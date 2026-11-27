// Lighthouse (mobile, simulated Fast 4G + 4x CPU) over the production preview.
//   node scripts/lighthouse.mjs [--base=http://localhost:4173] [/route ...]
// Launches the local Chromium through playwright-core (no browser download) and writes
// a summary to docs/PERF.md plus full reports to docs/lighthouse/.
import fs from "node:fs";
import { chromium } from "playwright-core";
import lighthouse from "lighthouse";

const BASE = process.argv.find((a) => a.startsWith("--base="))?.slice(7) || "http://localhost:4173";
const routes = process.argv.slice(2).filter((a) => a.startsWith("/"));
const ROUTES = routes.length ? routes : ["/", "/events", "/projects", "/placements", "/team", "/about", "/join", "/login", "/verify"];
const BROWSER = ["C:/Program Files/Google/Chrome/Application/chrome.exe", "C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe", "/usr/bin/chromium", "/usr/bin/google-chrome"].find((p) => fs.existsSync(p));
const PORT = 9333;

fs.mkdirSync("docs/lighthouse", { recursive: true });
const browser = await chromium.launch({ executablePath: BROWSER, headless: true, args: [`--remote-debugging-port=${PORT}`] });

const rows = [];
for (const route of ROUTES) {
  const result = await lighthouse(BASE + route, {
    port: PORT,
    output: "json",
    logLevel: "error",
    onlyCategories: ["performance", "accessibility", "best-practices", "seo"],
    formFactor: "mobile",
    screenEmulation: { mobile: true, width: 412, height: 823, deviceScaleFactor: 1.75, disabled: false },
    throttlingMethod: "simulate",
  });
  const { categories: c, audits: a } = result.lhr;
  const row = {
    route,
    perf: Math.round(c.performance.score * 100),
    a11y: Math.round(c.accessibility.score * 100),
    bp: Math.round(c["best-practices"].score * 100),
    seo: Math.round(c.seo.score * 100),
    fcp: a["first-contentful-paint"].displayValue,
    lcp: a["largest-contentful-paint"].displayValue,
    tbt: a["total-blocking-time"].displayValue,
    cls: a["cumulative-layout-shift"].displayValue,
    fails: Object.values(a)
      .filter((x) => x.score !== null && x.score < 0.9 && x.scoreDisplayMode !== "informative" && x.scoreDisplayMode !== "manual" && x.scoreDisplayMode !== "notApplicable")
      .map((x) => x.id)
      .slice(0, 12),
  };
  rows.push(row);
  fs.writeFileSync(`docs/lighthouse/${route === "/" ? "home" : route.slice(1)}.json`, result.report);
  console.log(`${route.padEnd(12)} perf ${row.perf}  a11y ${row.a11y}  bp ${row.bp}  seo ${row.seo}  | FCP ${row.fcp}  LCP ${row.lcp}  TBT ${row.tbt}  CLS ${row.cls}`);
  if (row.fails.length) console.log(`             below 0.9: ${row.fails.join(", ")}`);
}
await browser.close();

const md = [
  "# Performance (Lighthouse mobile)",
  "",
  `Run ${new Date().toISOString().slice(0, 10)} against the production build (\`npm run build && npx vite preview\`), simulated Fast 4G with 4x CPU slowdown, 412 px viewport.`,
  "",
  "| Route | Performance | Accessibility | Best practices | SEO | FCP | LCP | TBT | CLS |",
  "|---|---|---|---|---|---|---|---|---|",
  ...rows.map((r) => `| ${r.route} | ${r.perf} | ${r.a11y} | ${r.bp} | ${r.seo} | ${r.fcp} | ${r.lcp} | ${r.tbt} | ${r.cls} |`),
  "",
  "Audits scoring below 0.9 per route:",
  "",
  ...rows.map((r) => `- ${r.route}: ${r.fails.join(", ") || "none"}`),
  "",
].join("\n");
fs.writeFileSync("docs/PERF.md", md);
