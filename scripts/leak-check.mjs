// Navigates the production preview between pages many times (through the real links, so
// the page-change curtain runs) and reports whether listeners, DOM nodes or heap grow.
//   node scripts/leak-check.mjs [--base=http://localhost:4173] [--rounds=50]
import fs from "node:fs";
import { chromium } from "playwright-core";

const arg = (n, d) => process.argv.find((a) => a.startsWith(`--${n}=`))?.split("=")[1] || d;
const BASE = arg("base", "http://localhost:4173");
const ROUNDS = Number(arg("rounds", 50));
const BROWSER = ["C:/Program Files/Google/Chrome/Application/chrome.exe", "C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe", "/usr/bin/chromium"].find((p) => fs.existsSync(p));
const PAGES = ["/events", "/team", "/about", "/projects", "/placements", "/join", "/"];

const browser = await chromium.launch({ executablePath: BROWSER, headless: true, args: ["--js-flags=--expose-gc"] });
const page = await browser.newPage({ viewport: { width: 1280, height: 800 } });
await page.addInitScript(() => sessionStorage.setItem("introPlayed-v2", "true"));
const cdp = await page.context().newCDPSession(page);
await cdp.send("Performance.enable");

const sample = async () => {
  await page.evaluate(() => window.gc?.());
  const m = Object.fromEntries((await cdp.send("Performance.getMetrics")).metrics.map((x) => [x.name, x.value]));
  return { listeners: m.JSEventListeners, nodes: m.Nodes, heapMB: +(m.JSHeapUsedSize / 1048576).toFixed(1) };
};

await page.goto(BASE + "/", { waitUntil: "networkidle" });
await page.waitForTimeout(1500);
const baseline = await sample();
const history = [];
for (let i = 0; i < ROUNDS; i += 1) {
  const to = PAGES[i % PAGES.length];
  await page.evaluate((href) => {
    const a = document.querySelector(`header a[href="${href}"]`) || Object.assign(document.createElement("a"), { href });
    if (!a.isConnected) document.body.append(a);
    a.click();
  }, to);
  await page.waitForURL((u) => new URL(u).pathname === to, { timeout: 8000 });
  await page.waitForFunction(() => !document.documentElement.classList.contains("pt-on") && !document.querySelector(".pt.on"), null, { timeout: 8000 });
  await page.waitForTimeout(250);
  if ((i + 1) % 7 === 0) history.push({ round: i + 1, ...(await sample()) });
}
// Back on the page we started from, to compare like with like.
await page.goto(BASE + "/", { waitUntil: "networkidle" });
await page.waitForTimeout(1500);
const end = await sample();
await browser.close();

console.log("baseline", baseline);
history.forEach((h) => console.log(`after ${String(h.round).padStart(2)} page changes`, { listeners: h.listeners, nodes: h.nodes, heapMB: h.heapMB }));
console.log("final (fresh load of /)", end);
const growth = history.length > 2 ? history[history.length - 1].listeners - history[1].listeners : 0;
console.log(`listener drift between round ${history[1]?.round} and ${history[history.length - 1]?.round}: ${growth}`);
