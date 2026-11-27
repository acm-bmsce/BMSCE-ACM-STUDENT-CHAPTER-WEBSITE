import fs from "node:fs";
import path from "node:path";
import { describe, it, expect, beforeAll, beforeEach, afterEach, vi } from "vitest";
import request from "supertest";
import sharp from "sharp";
import { ADMINS, BACKEND_USERS, backend } from "./setup.js";
import app from "../app.js";
import { config, parseAdmins, ROOT } from "../config/index.js";
import { resetLockouts } from "../services/auth.service.js";
import { forgetBackendTokens } from "../middlewares/auth.middleware.js";
import { blobSha } from "../services/store.js";
import { CONTENT } from "../services/content.schemas.js";

const read = (rel) => fs.readFileSync(path.join(ROOT, rel));
const login = (username, password) => request(app).post("/api/auth/login").send({ username, password });

let token;
const auth = () => ({ Authorization: `Bearer ${token}` });

beforeAll(async () => {
  token = (await login("alice", ADMINS.alice)).body.data.token;
});

describe("Reading ADMIN_USERS", () => {
  const h = "$2b$04$abcdefghijklmnopqrstuuJ8YbhXK1lWhE3rDWEWd0q6EcX0gWnzW";
  it("accepts the value however it was pasted", () => {
    for (const raw of [`alice:${h}`, `"alice:${h}"`, `ADMIN_USERS=alice:${h}`, `alice:${h}
bob:${h}`, ` alice:${h} , bob:${h}. `]) {
      const admins = parseAdmins(raw);
      expect(admins[0]).toEqual({ username: "alice", hash: h });
      expect(admins.problems).toBe(0);
    }
  });
  it("counts entries it can't use instead of failing silently", () => {
    const admins = parseAdmins(`alice:not-a-hash,bob:${h}`);
    expect(admins.map((a) => a.username)).toEqual(["bob"]);
    expect(admins.problems).toBe(1);
  });
});

describe("Admin sign-in", () => {
  beforeEach(() => resetLockouts());

  it("signs in with a listed username and password (any case for the username)", async () => {
    const res = await login("ALICE", ADMINS.alice);
    expect(res.status).toBe(200);
    expect(res.body.data.user.username).toBe("alice");
    expect(res.body.data.token).toMatch(/^ey/);
  });

  it("refuses wrong passwords and unknown usernames with the same message", async () => {
    const wrong = await login("alice", "nope-nope-nope");
    const unknown = await login("mallory", "nope-nope-nope");
    expect(wrong.status).toBe(401);
    expect(unknown.status).toBe(401);
    expect(wrong.body.error.message).toBe(unknown.body.error.message);
  });

  it("locks a username after five wrong passwords, without locking anyone else", async () => {
    for (let i = 0; i < 5; i++) await login("bob", `wrong-${i}`);
    const locked = await login("bob", ADMINS.bob);
    expect(locked.status).toBe(429);
    expect(locked.body.error.code).toBe("ACCOUNT_LOCKED");
    expect((await login("alice", ADMINS.alice)).status).toBe(200);
  });

  it("guards admin routes and drops tokens of removed accounts", async () => {
    expect((await request(app).get("/api/admin/content/events")).status).toBe(401);
    expect((await request(app).get("/api/auth/me").set(auth())).body.data.username).toBe("alice");
    const saved = config.admins;
    config.admins = saved.filter((a) => a.username !== "alice");
    expect((await request(app).get("/api/auth/me").set(auth())).status).toBe(401);
    config.admins = saved;
  });
});

describe("Content files", () => {
  it("every shipped content file passes its schema (so hand edits can't break the build)", () => {
    for (const [name, entry] of Object.entries(CONTENT)) {
      const result = entry.schema.safeParse(JSON.parse(read(entry.path)));
      expect(result.success, `${name}: ${JSON.stringify(result.error?.issues?.slice(0, 3))}`).toBe(true);
    }
  });

  it("returns a file with its version", async () => {
    const res = await request(app).get("/api/admin/content/site").set(auth());
    expect(res.status).toBe(200);
    expect(res.body.sha).toBe(blobSha(read("content/site.json")));
    expect(res.body.data.team.core.length).toBeGreaterThan(0);
    expect((await request(app).get("/api/admin/content/secrets").set(auth())).status).toBe(404);
  });

  it("saves a valid change and returns the new version", async () => {
    const { body } = await request(app).get("/api/admin/content/site").set(auth());
    const data = { ...body.data, stats: [{ value: 700, suffix: "+", label: "Active members" }, ...body.data.stats.slice(1)] };
    const res = await request(app).put("/api/admin/content/site").set(auth()).send({ data, sha: body.sha });
    expect(res.status).toBe(200);
    expect(res.body.storage).toBe("local");
    const onDisk = read("content/site.json");
    expect(res.body.sha).toBe(blobSha(onDisk));
    expect(JSON.parse(onDisk).stats[0].value).toBe(700);
    expect(onDisk.toString()).toMatch(/^\{\n {2}"chapter"/); // pretty-printed for readable diffs
  });

  it("refuses a save started from an older version", async () => {
    const { body } = await request(app).get("/api/admin/content/projects").set(auth());
    const first = await request(app).put("/api/admin/content/projects").set(auth()).send({ data: body.data, sha: body.sha });
    expect(first.status).toBe(200);
    fs.appendFileSync(path.join(ROOT, "content/projects.json"), " "); // someone else's save
    const stale = await request(app).put("/api/admin/content/projects").set(auth()).send({ data: body.data, sha: first.body.sha });
    expect(stale.status).toBe(409);
    expect(stale.body.error.code).toBe("CONTENT_CONFLICT");
    expect((await request(app).put("/api/admin/content/projects").set(auth()).send({ data: body.data })).status).toBe(400);
  });

  it("checks events before saving: required fields, link names, unsafe links, duplicates", async () => {
    const { body } = await request(app).get("/api/admin/content/events").set(auth());
    const good = body.data[0];
    const cases = [
      [{ ...good, title: "" }, /Title is required/],
      [{ ...good, slug: "Has Spaces!" }, /Link name/],
      [{ ...good, image: "javascript:alert(1)" }, /https:\/\//],
      [{ ...good, date: "not a date" }, /valid date/],
    ];
    for (const [bad, message] of cases) {
      const res = await request(app).put("/api/admin/content/events").set(auth()).send({ data: [bad, ...body.data.slice(1)], sha: body.sha });
      expect(res.status).toBe(400);
      expect(JSON.stringify(res.body.error.details)).toMatch(message);
    }
    const dup = await request(app).put("/api/admin/content/events").set(auth()).send({ data: [...body.data, { ...good, _id: "copy" }], sha: body.sha });
    expect(dup.status).toBe(400);
    expect(JSON.stringify(dup.body.error.details)).toMatch(/same link name/);
  });

  it("adds an event with display-only details and keeps older fields intact", async () => {
    const { body } = await request(app).get("/api/admin/content/events").set(auth());
    const event = {
      _id: "test-event-1",
      slug: "test-hack-2027",
      status: "published",
      title: "Test Hack 2027",
      description: "A test event.",
      date: "2027-02-01T04:30:00.000Z",
      location: "PJA Block",
      is_team_event: true,
      teamMin: 2,
      teamMax: 4,
      memberPrice: 100,
      nonMemberPrice: 150,
      acmExclusive: false,
      capacity: 40,
    };
    const res = await request(app).put("/api/admin/content/events").set(auth()).send({ data: [event, ...body.data], sha: body.sha });
    expect(res.status).toBe(200);
    const saved = JSON.parse(read("content/events.json"));
    expect(saved[0]).toMatchObject(event);
    expect(saved.length).toBe(body.data.length + 1);
    const legacy = body.data.find((e) => "registration_limit" in e);
    if (legacy) expect(saved.find((e) => e._id === legacy._id).registration_limit).toEqual(legacy.registration_limit);
  });
});

describe("Deployment without a GitHub token", () => {
  it("explains that GITHUB_TOKEN is needed instead of failing on Vercel's read-only disk", async () => {
    const { body } = await request(app).get("/api/admin/content/insights").set(auth());
    process.env.VERCEL = "1";
    try {
      const res = await request(app).put("/api/admin/content/insights").set(auth()).send({ data: body.data, sha: body.sha });
      expect(res.status).toBe(503);
      expect(res.body.error.message).toMatch(/GITHUB_TOKEN/);
    } finally {
      delete process.env.VERCEL;
    }
  });
});

describe("Image uploads", () => {
  const png = () => sharp({ create: { width: 2400, height: 1200, channels: 3, background: "#3ddcff" } }).png().toBuffer();

  it("converts an image to WebP under /img/uploads, scaled to 2000 px, reusing identical uploads", async () => {
    const buf = await png();
    const a = await request(app).post("/api/admin/uploads").set(auth()).attach("image", buf, { filename: "poster.png", contentType: "image/png" });
    expect(a.status).toBe(201);
    expect(a.body.data.path).toMatch(/^\/img\/uploads\/[a-z0-9]{16}\.webp$/);
    expect(a.body.data.width).toBe(2000);
    const file = read(`public${a.body.data.path}`);
    expect((await sharp(file).metadata()).format).toBe("webp");
    const b = await request(app).post("/api/admin/uploads").set(auth()).attach("image", buf, { filename: "again.png", contentType: "image/png" });
    expect(b.body.data.path).toBe(a.body.data.path);
    const preview = await request(app).get(`/api/uploads/${a.body.data.path.split("/").pop()}`);
    expect(preview.status).toBe(200);
    expect(preview.headers["content-type"]).toMatch(/webp/);
  });

  it("refuses non-images, images in disguise, and odd preview names", async () => {
    const text = await request(app).post("/api/admin/uploads").set(auth()).attach("image", Buffer.from("hello"), { filename: "x.txt", contentType: "text/plain" });
    expect(text.status).toBe(400);
    const fake = await request(app).post("/api/admin/uploads").set(auth()).attach("image", Buffer.from("not really a png"), { filename: "x.png", contentType: "image/png" });
    expect(fake.status).toBe(400);
    expect((await request(app).post("/api/admin/uploads").attach("image", await png(), "x.png")).status).toBe(401);
    expect((await request(app).get("/api/uploads/..%2F..%2F.env")).status).toBe(404);
  });
});

describe("Saving through GitHub", () => {
  let calls;
  beforeEach(() => {
    calls = [];
    config.github.token = "test-token";
    vi.stubGlobal("fetch", async (url, opts = {}) => {
      calls.push({ url, ...opts, body: opts.body ? JSON.parse(opts.body) : undefined });
      const json = (status, data) => ({ status, json: async () => data, arrayBuffer: async () => new ArrayBuffer(0) });
      if ((opts.method || "GET") === "GET") {
        return json(200, { sha: "a".repeat(40), content: Buffer.from(JSON.stringify([{ _id: "p1", title: "Remote project", description: "From GitHub" }])).toString("base64") });
      }
      if (opts.body && JSON.parse(opts.body).sha !== "a".repeat(40)) return json(409, { message: "is at aaaa but expected bbbb" });
      return json(200, { content: { sha: "b".repeat(40) }, commit: { sha: "c".repeat(40) } });
    });
  });
  afterEach(() => {
    vi.unstubAllGlobals();
    config.github.token = "";
  });

  it("reads the file from the configured repo and branch", async () => {
    const res = await request(app).get("/api/admin/content/projects").set(auth());
    expect(res.body.data[0].title).toBe("Remote project");
    expect(calls[0].url).toBe(`https://api.github.com/repos/${config.github.repo}/contents/content/projects.json?ref=${config.github.branch}`);
    expect(calls[0].headers.Authorization).toBe("Bearer test-token");
  });

  it("commits a save with the starting version, the branch and who made it", async () => {
    const data = [{ _id: "p1", title: "Edited project", description: "From the admin" }];
    const res = await request(app).put("/api/admin/content/projects").set(auth()).send({ data, sha: "a".repeat(40) });
    expect(res.status).toBe(200);
    expect(res.body).toMatchObject({ storage: "github", sha: "b".repeat(40), commit: "c".repeat(40) });
    const put = calls.find((c) => c.method === "PUT");
    expect(put.body).toMatchObject({ sha: "a".repeat(40), branch: config.github.branch, message: "content: update projects (by alice)" });
    expect(JSON.parse(Buffer.from(put.body.content, "base64").toString())).toEqual(data);
  });

  it("turns GitHub's version clash into a clear conflict", async () => {
    const res = await request(app).put("/api/admin/content/projects").set(auth()).send({ data: [], sha: "d".repeat(40) });
    expect(res.status).toBe(409);
    expect(res.body.error.code).toBe("CONTENT_CONFLICT");
  });
});

describe("Signing in with the chapter's backend", () => {
  const backendToken = async ({ username, password }) => {
    const res = await fetch(`${backend.url}/auth/login`, { method: "POST", headers: { "Content-Type": "application/x-www-form-urlencoded" }, body: new URLSearchParams({ username, password }) });
    return (await res.json()).access_token;
  };
  beforeEach(() => forgetBackendTokens());

  it("lets a master admin read and save any content file", async () => {
    const t = await backendToken(BACKEND_USERS.master);
    const h = { Authorization: `Bearer ${t}` };
    const cur = await request(app).get("/api/admin/content/site").set(h);
    expect(cur.status).toBe(200);
    const saved = await request(app).put("/api/admin/content/site").set(h).send({ data: cur.body.data, sha: cur.body.sha });
    expect(saved.status).toBe(200);
    expect((await request(app).get("/api/auth/me").set(h)).body.data).toMatchObject({ username: "chief", role: "master" });
  });

  it("lets a coordinator save events and stories but not the pages or projects", async () => {
    const h = { Authorization: `Bearer ${await backendToken(BACKEND_USERS.coordinator)}` };
    for (const name of ["events", "insights"]) {
      const cur = await request(app).get(`/api/admin/content/${name}`).set(h);
      expect((await request(app).put(`/api/admin/content/${name}`).set(h).send({ data: cur.body.data, sha: cur.body.sha })).status).toBe(200);
    }
    for (const name of ["site", "projects"]) {
      const cur = await request(app).get(`/api/admin/content/${name}`).set(h);
      const res = await request(app).put(`/api/admin/content/${name}`).set(h).send({ data: cur.body.data, sha: cur.body.sha });
      expect(res.status).toBe(403);
    }
  });

  it("refuses tokens the backend doesn't recognise", async () => {
    const forged = `${Buffer.from('{"alg":"HS256"}').toString("base64url")}.${Buffer.from('{"sub":"chief"}').toString("base64url")}.bogus`;
    expect((await request(app).get("/api/admin/content/site").set({ Authorization: `Bearer ${forged}` })).status).toBe(401);
  });

  it("asks the backend once per token, not on every request", async () => {
    const h = { Authorization: `Bearer ${await backendToken(BACKEND_USERS.master)}` };
    const before = backend.log.filter((l) => l === "GET /projects/").length;
    for (let i = 0; i < 3; i++) await request(app).get("/api/admin/status").set(h);
    expect(backend.log.filter((l) => l === "GET /projects/").length - before).toBe(1);
  });
});
