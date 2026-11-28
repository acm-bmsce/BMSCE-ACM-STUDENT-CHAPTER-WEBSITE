// Layout check across phones, tablets, laptops and browser zoom levels (zoom = a smaller or
// larger CSS viewport). Flags sideways scrolling, content clipped by its section, and hero
// content pushed below the first screen. Needs the preview running:  node scripts/fit.mjs
import fs from "node:fs";
import { chromium } from "playwright-core";

const BASE = process.argv.find((a) => a.startsWith("--base="))?.slice(7) || "http://localhost:4173";
const BROWSER = ["C:/Program Files/Google/Chrome/Application/chrome.exe", "C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe", "/usr/bin/chromium", "/usr/bin/google-chrome"].find((p) => fs.existsSync(p));
const ROUTES = ["/", "/events", "/events/dev-duel-2026", "/projects", "/placements", "/team", "/about", "/join"];
const VIEWPORTS = [
  ["iPhone SE (1st)", 320, 568, true], ["Galaxy S", 360, 740, true], ["iPhone SE", 375, 667, true], ["iPhone 14", 390, 844, true],
  ["Pixel", 412, 915, true], ["iPhone Pro Max", 430, 932, true], ["Phone landscape", 844, 390, true],
  ["iPad mini", 768, 1024, true], ["iPad Air", 820, 1180, true], ["iPad landscape", 1024, 768, true], ["iPad Pro", 1024, 1366, true],
  ["1366 @ 200% zoom", 683, 384, false], ["1920 @ 175% zoom", 1097, 617, false], ["1920 @ 150% zoom", 1280, 720, false],
  ["Laptop 1366", 1366, 768, false], ["1920 @ 125% zoom", 1536, 864, false], ["Laptop 1440", 1440, 900, false],
  ["Desktop 1920", 1920, 1080, false], ["1920 @ 80% zoom", 2400, 1350, false], ["QHD 2560", 2560, 1440, false], ["1920 @ 50% zoom", 3840, 2160, false],
];

const browser = await chromium.launch({ executablePath: BROWSER, headless: true });
const problems = [];
for (const [name, width, height, touch] of VIEWPORTS) {
  const ctx = await browser.newContext({ viewport: { width, height }, hasTouch: touch, isMobile: touch && width < 800, reducedMotion: "reduce" });
  const page = await ctx.newPage();
  for (const route of ROUTES) {
    await page.goto(BASE + route, { waitUntil: "networkidle" });
    await page.waitForTimeout(300);
    const found = await page.evaluate(() => {
      const out = [];
      const vw = document.documentElement.clientWidth;
      if (document.documentElement.scrollWidth > vw + 1) {
        const wide = [...document.querySelectorAll("body *")].filter((el) => {
          const r = el.getBoundingClientRect();
          return r.width > 0 && (r.right > vw + 1 || r.left < -1) && getComputedStyle(el).position !== "fixed" && !el.closest(".marq,.rings,svg,.tc,.strip,.hof,[data-lenis-prevent]");
        });
        out.push(`scrolls sideways (${document.documentElement.scrollWidth - vw}px): ${wide.slice(0, 3).map((e) => e.tagName.toLowerCase() + "." + String(e.className).split(" ")[0]).join(", ")}`);
      }
      // Text or images cut off by a section that hides overflow.
      for (const sec of document.querySelectorAll("main > section, main > div > section")) {
        if (getComputedStyle(sec).overflowY !== "hidden" && getComputedStyle(sec).overflow !== "hidden") continue;
        const sb = sec.getBoundingClientRect().bottom;
        const cut = [...sec.querySelectorAll("h1,h2,h3,p,a.btn,img,dl")].filter((el) => {
          const r = el.getBoundingClientRect();
          return r.height > 0 && r.bottom > sb + 2 && !el.closest(".rings");
        });
        if (cut.length) out.push(`clipped in ${sec.className.split(" ")[0] || "section"}: ${cut.slice(0, 3).map((e) => e.tagName.toLowerCase() + "." + String(e.className).split(" ")[0]).join(", ")}`);
      }
      // Home hero: the button must be on the first screen.
      const btn = document.querySelector(".hero .btn");
      if (btn && btn.getBoundingClientRect().bottom > innerHeight + 1) out.push(`hero button below the fold (${Math.round(btn.getBoundingClientRect().bottom)} > ${innerHeight})`);
      // Home hero: the diamond's outline (its tips) must never touch the words.
      const dl = document.querySelector(".hero .dline")?.getBoundingClientRect();
      if (dl) for (const hw of document.querySelectorAll(".hero .hw, .hero .sub")) {
        const r = hw.getBoundingClientRect();
        if (r.left < dl.right - 1 && r.right > dl.left + 1 && r.top < dl.bottom - 1 && r.bottom > dl.top + 1) out.push(`hero diamond overlaps "${hw.textContent.trim()}"`);
      }
      // Text overflowing its own box sideways (long words).
      for (const h of document.querySelectorAll("h1,h2,.d1,.d2,.hw")) {
        if (h.scrollWidth > h.clientWidth + 2 && getComputedStyle(h).overflow !== "visible") out.push(`heading overflows: ${h.textContent.trim().slice(0, 30)}`);
      }
      return out;
    });
    for (const f of found) problems.push(`${name} ${width}x${height} ${route}: ${f}`);
  }
  await ctx.close();
}
await browser.close();
console.log(problems.length ? problems.join("\n") : "");
console.log(`${VIEWPORTS.length} sizes x ${ROUTES.length} pages, ${problems.length} problems`);
process.exit(problems.length ? 1 : 0);
