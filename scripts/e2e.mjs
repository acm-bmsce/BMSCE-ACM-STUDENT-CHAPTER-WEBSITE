// End-to-end bot: drives the real admin panel and website the way a committee member would.
//   npm run qa:e2e            (headless)
//   npm run qa:e2e -- --headed
//
// Runs a stand-in for the chapter's backend (:5056, scripts/mock-backend.mjs, so the real database
// is never touched), this site's own API (:5055, saving to the local content/ files, no GitHub)
// and a Vite dev server (:5174). Image uploads to Cloudinary are answered by the bot itself. The
// website reads content/ directly, so the bot backs those files up first and puts them back
// afterwards, whatever happens.
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import crypto from "node:crypto";
import { spawn, execFileSync } from "node:child_process";
import { chromium } from "playwright-core";
import bcrypt from "bcryptjs";
import sharp from "sharp";
import { startMockBackend } from "./mock-backend.mjs";

const ROOT = path.resolve(path.dirname(new URL(import.meta.url).pathname.replace(/^\/([A-Za-z]:)/, "$1")), "..");
const API_PORT = 5055;
const BACKEND_PORT = 5056;
const BACKEND = `http://localhost:${BACKEND_PORT}`;
const WEB_PORT = 5174;
const API = `http://localhost:${API_PORT}/api`;
const WEB = `http://localhost:${WEB_PORT}`;
const HEADED = process.argv.includes("--headed");
const BROWSER = ["C:/Program Files/Google/Chrome/Application/chrome.exe", "C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe", "/usr/bin/chromium", "/usr/bin/google-chrome"].find((p) => fs.existsSync(p));
const SHOTS = path.join(ROOT, "docs", "e2e");
fs.mkdirSync(SHOTS, { recursive: true });

// ---------------------------------------------------------------- back up the content
const CONTENT = path.join(ROOT, "content");
const UPLOADS = path.join(ROOT, "public/img/uploads");
const backup = fs.mkdtempSync(path.join(os.tmpdir(), "acm-e2e-content-"));
fs.cpSync(CONTENT, path.join(backup, "content"), { recursive: true });
const uploadsBefore = new Set(fs.existsSync(UPLOADS) ? fs.readdirSync(UPLOADS) : []);
let restored = false;
function restore() {
  if (restored) return;
  restored = true;
  fs.cpSync(path.join(backup, "content"), CONTENT, { recursive: true, force: true });
  if (fs.existsSync(UPLOADS)) for (const f of fs.readdirSync(UPLOADS)) if (!uploadsBefore.has(f)) fs.rmSync(path.join(UPLOADS, f));
  if (fs.existsSync(UPLOADS) && !fs.readdirSync(UPLOADS).length && !uploadsBefore.size) fs.rmdirSync(UPLOADS);
}

const rand = (n = 4) => crypto.randomBytes(n).toString("hex");
const ADMIN = { username: `e2e${rand(2)}`, password: `E2e-${rand(8)}-pass` };
// Accounts on the (stand-in) backend.
const MASTER = { username: `master${rand(2)}`, password: `M-${rand(8)}`, role: "master" };
const COORD = { username: `coord${rand(2)}`, password: `C-${rand(8)}`, role: "coordinator" };
const NEWBIE = { username: `newbie${rand(2)}`, email: "newbie@example.org", password: `N-${rand(8)}`, is_approved: false };
const FORGOT = { username: `forgot${rand(2)}`, email: "forgot@example.org", password: `F-${rand(8)}`, reset_requested: true };
const env = {
  ...process.env,
  NODE_ENV: "test",
  PORT: String(API_PORT),
  FRONTEND_URL: WEB,
  JWT_SECRET: rand(32),
  ADMIN_USERS: `${ADMIN.username}:${bcrypt.hashSync(ADMIN.password, 10)}`,
  GITHUB_TOKEN: "",
  CONTENT_ROOT: ROOT,
  VITE_API_URL: API,
  VITE_LIVE_API: BACKEND,
  LIVE_API: BACKEND,
};

// ---------------------------------------------------------------- servers
const procs = [];
function start(cmd, args) {
  const p = spawn(cmd, args, { cwd: ROOT, env, shell: process.platform === "win32" });
  p.stdout.on("data", () => {});
  p.stderr.on("data", () => {});
  procs.push(p);
}
async function waitFor(url, ms = 60000) {
  const end = Date.now() + ms;
  while (Date.now() < end) {
    try {
      if ((await fetch(url)).status < 500) return;
    } catch {
      /* not up yet */
    }
    await new Promise((r) => setTimeout(r, 400));
  }
  throw new Error(`Timed out waiting for ${url}`);
}
function cleanup() {
  for (const p of procs) {
    try {
      if (process.platform === "win32") execFileSync("taskkill", ["/pid", String(p.pid), "/T", "/F"], { stdio: "ignore" });
      else p.kill("SIGTERM");
    } catch {
      /* already gone */
    }
  }
  restore();
}
process.on("exit", cleanup);
process.on("SIGINT", () => process.exit(130));

// ---------------------------------------------------------------- reporting
const results = [];
const pages = [];
const consoleErrors = [];
async function step(name, fn) {
  const t = Date.now();
  try {
    await fn();
    results.push({ name, ok: true, ms: Date.now() - t });
    console.log(`  ✓ ${name}`);
  } catch (e) {
    results.push({ name, ok: false, error: e.message.split("\n")[0] });
    console.log(`  ✗ ${name}\n      ${e.message.split("\n").slice(0, 3).join("\n      ")}`);
    for (const [k, pg] of pages.entries()) await pg.screenshot({ path: path.join(SHOTS, `fail-${results.length}-${k}.png`) }).catch(() => {});
  }
}
const expect = (cond, msg) => {
  if (!cond) throw new Error(msg);
};

// ---------------------------------------------------------------- run
const backend = await startMockBackend({ port: BACKEND_PORT, users: [MASTER, COORD, NEWBIE, FORGOT] });
start("node", ["server/index.js"]);
start(process.platform === "win32" ? "npx.cmd" : "npx", ["vite", "--port", String(WEB_PORT), "--strictPort"]);
await waitFor(`${API}/health`);
await waitFor(WEB);

const browser = await chromium.launch({ executablePath: BROWSER, headless: !HEADED });
const PNG = await sharp({ create: { width: 900, height: 1200, channels: 3, background: "#123a5a" } }).png().toBuffer();
async function newPage() {
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 }, permissions: ["clipboard-read", "clipboard-write"] });
  await ctx.addInitScript(() => {
    try {
      sessionStorage.setItem("introPlayed-v2", "true");
    } catch {
      /* fine */
    }
  });
  // Cloudinary: uploads are answered here (nothing reaches the chapter's account), and the
  // returned image is served from here too.
  await ctx.route("https://api.cloudinary.com/**", async (route) => {
    const body = route.request().postDataBuffer()?.toString("latin1") || "";
    if (!body.includes("Website-Image")) consoleErrors.push("an upload didn't use the chapter's upload preset");
    const url = `https://res.cloudinary.com/dzccr1oot/image/upload/v1/e2e-${rand(4)}.png`;
    await route.fulfill({ status: 200, contentType: "application/json", headers: { "Access-Control-Allow-Origin": "*" }, body: JSON.stringify({ secure_url: url, width: 900, height: 1200 }) });
  });
  await ctx.route("https://res.cloudinary.com/**", (route) => route.fulfill({ status: 200, contentType: "image/png", body: PNG }));
  const p = await ctx.newPage();
  p.setDefaultTimeout(20000);
  p.on("pageerror", (e) => consoleErrors.push(`pageerror ${e.message}`));
  p.on("console", (m) => m.type() === "error" && !/Failed to load resource|ERR_ABORTED|\[vite\]/.test(m.text()) && consoleErrors.push(m.text()));
  pages.push(p);
  return p;
}

const admin = await newPage();
const site = await newPage();
const EVENT = { title: `E2E Team Hack ${rand(2).toUpperCase()}` };
const start7 = new Date(Date.now() + 7 * 864e5);
start7.setHours(10, 30, 0, 0);
const localInput = (d) => new Date(d.getTime() - d.getTimezoneOffset() * 60000).toISOString().slice(0, 16);
const events = () => JSON.parse(fs.readFileSync(path.join(CONTENT, "events.json"), "utf8"));
const signIn = async (page, who) => {
  await page.goto(`${WEB}/admin/login`);
  await page.locator("#a-user").fill(who.username);
  await page.locator('input[type="password"]').fill(who.password);
  await page.locator('button[type="submit"]').click();
  await page.waitForURL(/\/admin\/dashboard/);
};
const signOut = async (page) => {
  await page.getByRole("button", { name: "Sign out" }).click();
  await page.waitForURL(/\/admin\/login/);
};

try {
  console.log("\nPublic site");
  await step("no sign-in, My ACM or registration anywhere; old member pages go to Home", async () => {
    await site.goto(`${WEB}/`);
    expect((await site.getByRole("link", { name: /sign in|my acm/i }).count()) === 0, "a sign-in link is still on the page");
    for (const old of ["/login", "/account", "/verify"]) {
      await site.goto(`${WEB}${old}`);
      await site.waitForURL(`${WEB}/`);
    }
  });
  await step("the previous site's addresses lead to the new pages", async () => {
    for (const [old, now] of [["/event", "/events"], ["/join-us", "/join"], ["/about-us", "/about"], ["/archive", "/events"], ["/events/abc123/register", "/events"]]) {
      await site.goto(`${WEB}${old}`);
      await site.waitForURL(`${WEB}${now}`);
    }
  });
  await step("events come from the backend; with nothing scheduled, the calendar says Coming soon", async () => {
    await site.goto(`${WEB}/events`);
    await site.locator(".nextup").getByText("Coming", { exact: false }).waitFor();
    expect(backend.log.some((l) => l.startsWith("GET /events/")), "the website didn't ask the backend for events");
  });

  console.log("\nAdmin panel (master admin)");
  await step("a master admin signs in with their backend account", async () => {
    await signIn(admin, MASTER);
    await admin.getByText(/Nothing upcoming/).waitFor();
    await admin.getByRole("link", { name: "Accounts" }).waitFor();
    await admin.getByText("Master admin").waitFor();
  });
  await step("a wrong password is refused", async () => {
    await signOut(admin);
    await admin.locator("#a-user").fill(MASTER.username);
    await admin.locator('input[type="password"]').fill("wrong-password");
    await admin.locator('button[type="submit"]').click();
    await admin.getByText("Wrong username or password.").waitFor();
    await signIn(admin, MASTER);
  });
  await step("a new draft stays off the backend and the website", async () => {
    await admin.goto(`${WEB}/admin/events`);
    await admin.getByRole("button", { name: /new event/i }).first().click();
    const dlg = admin.getByRole("dialog", { name: "Event form" });
    await dlg.locator("#ev-title").fill(EVENT.title);
    await dlg.locator("#ev-type").selectOption("Hackathon");
    await dlg.locator("#ev-short").fill("A 24-hour build sprint, created by the end-to-end bot.");
    await dlg.locator("#ev-start").fill(localInput(start7));
    await dlg.locator("#ev-loc").fill("Seminar Hall, PJA Block");
    await dlg.locator("#ev-image").locator("xpath=..").locator('input[type="file"]').setInputFiles({ name: "poster.png", mimeType: "image/png", buffer: PNG });
    await admin.waitForFunction(() => /^https:\/\/res\.cloudinary\.com\/dzccr1oot\//.test(document.querySelector("#ev-image")?.value || ""));
    EVENT.poster = await dlg.locator("#ev-image").inputValue();
    await dlg.getByText("Team event", { exact: true }).click();
    await dlg.locator("#ev-tmin").fill("2");
    await dlg.locator("#ev-tmax").fill("4");
    await dlg.locator("#ev-mp").fill("100");
    await dlg.locator("#ev-np").fill("150");
    await dlg.locator("#ev-cap").fill("40");
    await dlg.locator("#ev-status").selectOption("draft");
    EVENT.slug = await dlg.locator("#ev-slug").inputValue();
    await dlg.getByRole("button", { name: /save draft/i }).click();
    await dlg.waitFor({ state: "detached" });
    await admin.getByText(new RegExp(`${EVENT.title}.*added as a draft`)).waitFor();
    expect(!backend.db.events.some((e) => e.title === EVENT.title), "the draft was sent to the backend");
    const saved = events().find((e) => e.title === EVENT.title);
    expect(saved && saved.status === "draft" && saved.teamMin === 2 && saved.memberPrice === 100 && saved.image === EVENT.poster, `saved: ${JSON.stringify(saved).slice(0, 200)}`);
  });
  await step("publishing sends it to the backend (date as DD-MM-YYYY) and keeps the website-only details", async () => {
    const row = admin.locator(".dr", { hasText: EVENT.title }).first();
    await row.getByRole("button", { name: "Publish" }).click();
    await admin.getByText(new RegExp(`${EVENT.title}.*published`)).waitFor();
    const remote = backend.db.events.find((e) => e.title === EVENT.title);
    expect(remote, "the event isn't on the backend");
    const d = start7;
    expect(remote.date.startsWith(`${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`), `backend date ${remote.date}`);
    expect(remote.image === EVENT.poster && remote.location === "Seminar Hall, PJA Block", "backend fields wrong");
    const local = events().find((e) => e._id === remote._id);
    expect(local && local.slug === EVENT.slug && local.teamMax === 4 && local.status === "published", `local copy: ${JSON.stringify(local).slice(0, 200)}`);
    EVENT.id = remote._id;
  });
  await step("the website shows it under Next up, at its own link, with its details", async () => {
    await site.goto(`${WEB}/events`);
    await site.locator(".nextup").getByText(EVENT.title).click();
    await site.waitForURL(`${WEB}/events/${EVENT.slug}`);
    const dlg = site.getByRole("dialog");
    await dlg.getByText(/Hackathon · Teams of 2–4/).waitFor();
    await dlg.getByText(/Members ₹100 · Others ₹150/).waitFor();
    await dlg.getByRole("button", { name: /share event/i }).click();
    await dlg.getByRole("button", { name: "Link copied" }).waitFor();
    expect((await dlg.getByRole("button", { name: /register/i }).count()) === 0, "a Register button appeared");
  });
  await step("editing the venue updates the backend", async () => {
    await admin.goto(`${WEB}/admin/events`);
    await admin.locator(".dr", { hasText: EVENT.title }).first().getByRole("button", { name: /edit/i }).click();
    const dlg = admin.getByRole("dialog", { name: "Event form" });
    await dlg.locator("#ev-loc").fill("Main Auditorium");
    await dlg.getByRole("button", { name: /save event/i }).click();
    await dlg.waitFor({ state: "detached" });
    await admin.getByText(new RegExp(`${EVENT.title}.*saved`)).waitFor();
    expect(backend.db.events.find((e) => e._id === EVENT.id)?.location === "Main Auditorium", "backend venue not updated");
  });
  await step("unpublishing removes it from the backend and keeps it here as a draft", async () => {
    const row = admin.locator(".dr", { hasText: EVENT.title }).first();
    await row.getByRole("button", { name: "Unpublish" }).click();
    await admin.getByText(new RegExp(`${EVENT.title}.*moved to drafts`)).waitFor();
    expect(!backend.db.events.some((e) => e.title === EVENT.title), "still on the backend");
    expect(events().find((e) => e.title === EVENT.title)?.status === "draft", "the draft wasn't kept");
    await site.goto(`${WEB}/events`);
    await site.locator(".nextup").getByText("Coming", { exact: false }).waitFor();
    await site.goto(`${WEB}/events/${EVENT.slug}`);
    expect((await site.getByRole("dialog").count()) === 0, "the draft's link still opens it");
  });
  await step("deleting the draft removes it everywhere", async () => {
    admin.once("dialog", (d) => d.accept());
    await admin.locator(".dr", { hasText: EVENT.title }).first().getByRole("button", { name: /delete/i }).click();
    await admin.getByText(new RegExp(`${EVENT.title}.*deleted`)).waitFor();
    expect(!events().some((e) => e.title === EVENT.title), "still in events.json");
  });
  await step("admin changes a home-page stat (saved through this site's API with the backend sign-in)", async () => {
    await admin.goto(`${WEB}/admin/content`);
    await admin.getByRole("button", { name: "Stats" }).click();
    await admin.locator("#st-v-0").fill("777");
    await admin.getByRole("button", { name: /publish changes/i }).click();
    await admin.getByText(/Saved\./).waitFor();
    expect(JSON.parse(fs.readFileSync(path.join(CONTENT, "site.json"), "utf8")).stats[0].value === 777, "site.json not updated");
    await site.goto(`${WEB}/`);
    const heading = site.getByText(/nutshell/i).first();
    await heading.scrollIntoViewIfNeeded();
    await site.waitForTimeout(400);
    await heading.evaluate((el) => el.closest("section")?.scrollIntoView({ block: "center" }));
    await site.getByText(/^777/).first().waitFor();
  });
  const PROJECT = `E2E Project ${rand(2)}`;
  await step("admin adds a project on the backend and it appears on the Projects page", async () => {
    await admin.goto(`${WEB}/admin/projects`);
    await admin.getByRole("button", { name: /add project|new project/i }).first().click();
    await admin.locator("#proj-title").fill(PROJECT);
    await admin.locator("#proj-author").fill("E2E Bot");
    await admin.locator("#proj-desc").fill("A project added by the end-to-end bot.");
    await admin.locator('form button[type="submit"]').last().click();
    await admin.getByText(/added to the showcase/).waitFor();
    expect(backend.db.projects.find((x) => x.title === PROJECT)?.status === "APPROVED", "not approved on the backend");
    await site.goto(`${WEB}/projects`);
    await site.getByText(PROJECT).first().waitFor();
  });
  await step("hiding the project sends the whole project and takes it off the site", async () => {
    await admin.locator(".dr", { hasText: PROJECT }).first().getByRole("button", { name: "Hide" }).click();
    await admin.getByText(/hidden from public showcase/).waitFor();
    const x = backend.db.projects.find((y) => y.title === PROJECT);
    expect(x?.status === "HIDDEN" && x.author === "E2E Bot", `backend: ${JSON.stringify(x).slice(0, 160)}`);
    await site.goto(`${WEB}/projects`);
    await site.waitForTimeout(1500);
    expect((await site.getByText(PROJECT).count()) === 0, "the hidden project still shows");
  });
  const PERSON = `E2E Person ${rand(2)}`;
  await step("admin adds an Insight Series story; its batch year is kept although the backend can't store it", async () => {
    await admin.goto(`${WEB}/admin/insights`);
    await admin.getByRole("button", { name: /add story/i }).first().click();
    await admin.locator("#ins-image").locator("xpath=..").locator('input[type="file"]').setInputFiles({ name: "story.png", mimeType: "image/png", buffer: PNG });
    await admin.waitForFunction(() => /^https:\/\/res\.cloudinary\.com\//.test(document.querySelector("#ins-image")?.value || ""));
    await admin.locator("#ins-name").fill(PERSON);
    await admin.locator("#ins-year").fill("2027");
    await admin.locator("#ins-company").fill("Example Corp");
    await admin.locator("#ins-role").fill("Software Engineer");
    await admin.locator("#ins-insta").fill("https://www.instagram.com/p/DE2eTestPost/");
    await admin.getByRole("button", { name: /^add story$/i }).last().click();
    await admin.getByText(/story added/).waitFor();
    const remote = backend.db.insights.find((x) => x.personName === PERSON);
    expect(remote && remote.year === "Alumni", "not on the backend");
    const local = JSON.parse(fs.readFileSync(path.join(CONTENT, "insights.json"), "utf8")).find((x) => x._id === remote._id);
    expect(local?.year === "2027", `year not kept: ${JSON.stringify(local)}`);
    await site.goto(`${WEB}/placements`);
    await site.getByRole("button", { name: "2027" }).first().click();
    await site.getByText(PERSON).first().waitFor();
  });
  await step("Accounts: approve a waiting account and set a new password for a reset request", async () => {
    await admin.goto(`${WEB}/admin/users`);
    await admin.locator(".dr", { hasText: NEWBIE.username }).getByRole("button", { name: "Approve" }).click();
    await admin.getByText(`${NEWBIE.username} can now sign in.`).waitFor();
    expect(backend.db.users.find((u) => u.username === NEWBIE.username).is_approved, "not approved on the backend");
    const row = admin.locator(".dr", { hasText: FORGOT.username });
    await row.locator('input[type="password"]').fill("a-new-password-123");
    await row.getByRole("button", { name: "Set password" }).click();
    await admin.getByText(/password was changed/).waitFor();
    const u = backend.db.users.find((x) => x.username === FORGOT.username);
    expect(u.password === "a-new-password-123" && !u.reset_requested, "reset not applied");
  });
  await step("a save from an out-of-date copy is refused instead of overwriting", async () => {
    const t = await admin.evaluate(() => localStorage.getItem("acm_admin_token"));
    const h = { "Content-Type": "application/json", Authorization: `Bearer ${t}` };
    const cur = await (await fetch(`${API}/admin/content/insights`, { headers: h })).json();
    const first = await fetch(`${API}/admin/content/insights`, { method: "PUT", headers: h, body: JSON.stringify({ data: cur.data, sha: cur.sha }) });
    expect(first.status === 200, `first save ${first.status}`);
    fs.appendFileSync(path.join(CONTENT, "insights.json"), "\n");
    const stale = await fetch(`${API}/admin/content/insights`, { method: "PUT", headers: h, body: JSON.stringify({ data: cur.data, sha: (await first.json()).sha }) });
    expect(stale.status === 409, `stale save returned ${stale.status}`);
  });

  console.log("\nAdmin panel (coordinator)");
  await step("a coordinator signs in and sees events and stories, not projects, pages or accounts", async () => {
    await signOut(admin);
    await signIn(admin, COORD);
    await admin.getByText("Coordinator").waitFor();
    for (const name of ["Projects", "Pages & team", "Accounts"]) expect((await admin.locator(".side").getByRole("link", { name }).count()) === 0, `${name} is offered to a coordinator`);
    await admin.locator(".side").getByRole("link", { name: "Insight Series" }).waitFor();
  });
  await step("this site's API refuses a coordinator's change to the pages, and any made-up token", async () => {
    const t = await admin.evaluate(() => localStorage.getItem("acm_admin_token"));
    const h = { "Content-Type": "application/json", Authorization: `Bearer ${t}` };
    const cur = await (await fetch(`${API}/admin/content/site`, { headers: h })).json();
    const r = await fetch(`${API}/admin/content/site`, { method: "PUT", headers: h, body: JSON.stringify({ data: cur.data, sha: cur.sha }) });
    expect(r.status === 403, `coordinator site save returned ${r.status}`);
    const fake = await fetch(`${API}/admin/content/site`, { headers: { Authorization: "Bearer aaa.bbb.ccc" } });
    expect(fake.status === 401, `made-up token returned ${fake.status}`);
  });
  await step("an account waiting for approval can't sign in", async () => {
    await signOut(admin);
    const waiting = { username: `wait${rand(2)}`, password: "x-pass-1234", is_approved: false, role: "coordinator", _id: rand(12) };
    backend.db.users.push(waiting);
    await admin.locator("#a-user").fill(waiting.username);
    await admin.locator('input[type="password"]').fill(waiting.password);
    await admin.locator('button[type="submit"]').click();
    await admin.getByText(/pending approval/i).waitFor();
  });
  await step("anyone can ask for an account or a password reset from the sign-in page", async () => {
    const name = `asker${rand(2)}`;
    await admin.getByRole("button", { name: "Request access" }).click();
    await admin.locator("#a-user").fill(name);
    await admin.locator("#a-mail").fill("asker@example.org");
    await admin.locator("#a-pw").fill("asker-pass-123");
    await admin.getByRole("button", { name: "Send request" }).click();
    await admin.getByText(/once a master admin approves/).waitFor();
    const u = backend.db.users.find((x) => x.username === name);
    expect(u && !u.is_approved, "the account request didn't reach the backend");
    await admin.getByRole("button", { name: "Forgot your password?" }).click();
    await admin.locator("#a-user").fill(COORD.username);
    await admin.getByRole("button", { name: "Send request" }).click();
    await admin.getByText(/will set a new password/).waitFor();
    expect(backend.db.users.find((x) => x.username === COORD.username).reset_requested, "the reset request didn't reach the backend");
  });
  await step("no unexpected console errors", async () => {
    expect(!consoleErrors.length, consoleErrors.slice(0, 3).join(" | "));
  });
} finally {
  await browser.close();
  await backend.close();
  cleanup();
}

const failed = results.filter((r) => !r.ok);
console.log(`\n${results.length - failed.length}/${results.length} passed.${failed.length ? " Failure screenshots in docs/e2e/." : ""}`);
process.exit(failed.length ? 1 : 0);
