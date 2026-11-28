// Visual and technical QA over the production build.
//   npm run build && npx vite preview --port 4173 (and the API on :5000), then
//   node scripts/qa.mjs [--base=http://localhost:4173] [--browser=path-to-chromium]
// For every route at 390 / 768 / 1440 px it records console errors, failed requests, CSP
// violations, horizontal overflow, images without alt text, broken internal links and axe
// accessibility violations, and saves a full-page screenshot to docs/after/.
import fs from "node:fs";
import path from "node:path";
import { chromium } from "playwright-core";
import AxeBuilder from "@axe-core/playwright";

const arg = (name, fallback) => process.argv.find((a) => a.startsWith(`--${name}=`))?.split("=").slice(1).join("=") || fallback;
const BASE = arg("base", "http://localhost:4173");
const BROWSER = arg(
  "browser",
  ["C:/Program Files/Google/Chrome/Application/chrome.exe", "C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe", "/usr/bin/chromium", "/usr/bin/google-chrome"].find((p) => fs.existsSync(p))
);
const ROUTES = ["/", "/events", "/events/duos-dash-4-0-2026", "/projects", "/placements", "/team", "/about", "/join", "/admin/login", "/this-page-does-not-exist"];
const KNOWN = new Set(["/", "/events", "/projects", "/placements", "/team", "/about", "/join", "/admin/login"]);
const REDUCED = process.argv.includes("--reduced");
const WIDTHS = REDUCED ? [390, 1440] : [390, 768, 1440];
const OUT = REDUCED ? "docs/after/reduced-motion" : "docs/after";
fs.mkdirSync(OUT, { recursive: true });

const slug = (r) => (r === "/" ? "home" : r.replace(/^\//, "").replace(/[^a-z0-9]+/gi, "-").replace(/-+$/, ""));

const browser = await chromium.launch({ executablePath: BROWSER, headless: true });
const report = [];

for (const width of WIDTHS) {
  const ctx = await browser.newContext({ viewport: { width, height: width < 800 ? 844 : 900 }, deviceScaleFactor: 1, hasTouch: width < 800, isMobile: width < 800, reducedMotion: REDUCED ? "reduce" : "no-preference" });
  // Skip the once-per-session intro so every route is tested on its own content.
  await ctx.addInitScript(() => {
    try {
      sessionStorage.setItem("introPlayed-v2", "true");
    } catch {
      /* ignore */
    }
    window.__csp = [];
    document.addEventListener("securitypolicyviolation", (e) => window.__csp.push(`${e.violatedDirective} ${e.blockedURI}`));
  });

  for (const route of ROUTES) {
    const page = await ctx.newPage();
    const issues = { console: [], requests: [] };
    // The unknown-certificate route is meant to get a 404 from the API; the browser logs it.
    const expected404 = route.includes("ACMB-000000");
    page.on("console", (m) => m.type() === "error" && !(expected404 && m.text().includes("404")) && issues.console.push(m.text().slice(0, 300)));
    page.on("pageerror", (e) => issues.console.push(`pageerror: ${e.message}`));
    page.on("requestfailed", (r) => issues.requests.push(`${r.failure()?.errorText} ${r.url()}`));
    page.on("response", (r) => r.status() >= 400 && issues.requests.push(`${r.status()} ${r.url()}`));

    await page.goto(BASE + route, { waitUntil: "networkidle" });
    // Scroll through like a visitor so lazy images load, counters run and reveals fire.
    await page.evaluate(async () => {
      const step = Math.round(window.innerHeight * 0.8);
      for (let y = 0; y < document.documentElement.scrollHeight; y += step) {
        window.scrollTo(0, y);
        await new Promise((r) => setTimeout(r, 120));
      }
      await new Promise((r) => setTimeout(r, 1600));
      window.scrollTo(0, 0);
    });
    await page.waitForLoadState("networkidle");
    await page.waitForTimeout(400);

    const facts = await page.evaluate((known) => {
      // Land every entrance in its final state so screenshots show the finished page.
      const s = document.createElement("style");
      s.textContent = "*,*::before,*::after{transition:none!important;animation-duration:0s!important;animation-delay:0s!important}";
      document.head.append(s);
      document.querySelectorAll(".rv,.rv-img").forEach((e) => e.classList.add("in"));
      document.querySelectorAll(".sw").forEach((e) => e.style.setProperty("--p", "999"));
      const links = [...document.querySelectorAll("a[href]")]
        .map((a) => new URL(a.getAttribute("href"), location.href))
        .filter((u) => u.origin === location.origin && !u.hash && !u.search)
        .map((u) => u.pathname);
      return {
        overflow: document.documentElement.scrollWidth - window.innerWidth,
        noAlt: [...document.querySelectorAll("img:not([alt])")].map((i) => i.src).slice(0, 5),
        // Each event has its own page, /events/<slug>.
        broken: [...new Set(links.filter((p) => !known.includes(p) && !/^\/events\/[a-z0-9-]+$/.test(p)))],
        csp: window.__csp,
        title: document.title,
        h1: document.querySelectorAll("h1").length,
      };
    }, [...KNOWN]);

    await page.waitForTimeout(300);
    await page.screenshot({ path: path.join(OUT, `${slug(route)}-${width}.png`), fullPage: true });

    let axe = [];
    if (width !== 768) {
      const res = await new AxeBuilder({ page }).withTags(["wcag2a", "wcag2aa", "wcag21aa", "wcag22aa"]).analyze();
      axe = res.violations.map((v) => ({ id: v.id, impact: v.impact, nodes: v.nodes.length, sample: v.nodes[0]?.target?.join(" ") }));
    }

    report.push({ route, width, ...facts, ...issues, axe });
    const flags = [
      facts.overflow > 0 && `overflow ${facts.overflow}px`,
      facts.noAlt.length && `no-alt ${facts.noAlt.length}`,
      facts.broken.length && `broken-links ${facts.broken.join(",")}`,
      facts.csp.length && `csp ${facts.csp.length}`,
      issues.console.length && `console ${issues.console.length}`,
      issues.requests.length && `requests ${issues.requests.length}`,
      axe.length && `axe ${axe.map((a) => a.id).join(",")}`,
      facts.h1 !== 1 && `h1 x${facts.h1}`,
    ].filter(Boolean);
    console.log(`${String(width).padStart(4)} ${route.padEnd(34)} ${flags.length ? flags.join(" | ") : "ok"}`);
    await page.close();
  }
  await ctx.close();
}

await browser.close();
fs.writeFileSync(REDUCED ? "docs/qa-report-reduced.json" : "docs/qa-report.json", JSON.stringify(report, null, 2));
const bad = report.filter((r) => r.overflow > 0 || r.noAlt.length || r.broken.length || r.csp.length || r.console.length || r.requests.length || r.axe.length);
console.log(`\n${report.length} checks, ${bad.length} with findings. Details: ${REDUCED ? "docs/qa-report-reduced.json" : "docs/qa-report.json"}`);
process.exitCode = bad.length ? 1 : 0;
