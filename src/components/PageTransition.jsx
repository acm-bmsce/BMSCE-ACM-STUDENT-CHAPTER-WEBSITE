import { useEffect, useRef } from "react";
import { pageOf } from "../lib/eventLinks";
import { flushSync } from "react-dom";
import { useNavigate } from "react-router-dom";
import { NAV } from "../data/site";
import { EASE as EASES, pageReady, prefersReducedMotion } from "../lib/motion";
import { beginCurtain, endCurtain } from "../lib/ready";
import { scrollToTop } from "./SmoothScroll";
import { Rings } from "./ui";

// Pages outside the main nav still get a proper title on the curtain.
const EXTRA = {
};
const EASE = EASES.inOut;
const OUT = EASES.out;
const wait = (ms) => new Promise((r) => setTimeout(r, ms));
// Animations can stall in a background tab; never wait on one longer than its own length.
const done = (anim, ms) => Promise.race([anim.finished, wait(ms)]);
// Two frames: React's effects have run and the browser has laid out and painted once.
const settle = () => new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(r)));
// Photos in the first screen of the new page, decoded now rather than mid-lift.
const decodeVisible = () =>
  Promise.all(
    [...document.querySelectorAll("main img")]
      .filter((img) => img.getBoundingClientRect().top < window.innerHeight && img.loading !== "lazy")
      .slice(0, 8)
      .map((img) => (img.decode ? img.decode().catch(() => {}) : null))
  );

function destination(path) {
  const i = NAV.findIndex((n) => n.to === path);
  if (i >= 0) return { label: NAV[i].label, count: `${String(i + 1).padStart(2, "0")} / ${String(NAV.length).padStart(2, "0")}` };
  return { label: EXTRA[path] || "BMSCE ACM", count: "" };
}

/**
 * The page-change curtain: the whole screen floods blue from the bottom, the destination's
 * name rises in black, the page swaps underneath, and the blue lifts off the top as the new
 * page's entrances begin.
 *
 * Only transforms are animated (no border-radius), so the browser moves the curtain on the
 * graphics card and it stays smooth while the incoming page is being built. Its curved leading
 * edge is a fixed dome above (and below) the sheet that travels with it.
 */
// How far past the screen the sheet starts and ends, so its dome is out of sight too.
const OFF = "calc(100% + 15vh)";
export default function PageTransition() {
  const navigate = useNavigate();
  const root = useRef(null);
  const busy = useRef(false);

  useEffect(() => {
    if (prefersReducedMotion()) return undefined;

    const run = async (to, path) => {
      const el = root.current;
      if (!el || busy.current) return;
      busy.current = true;
      const sheet = el.querySelector(".pt-sheet");
      const word = el.querySelector(".pt-word");
      const d = destination(path);
      word.textContent = d.label;
      // Long names (PLACEMENTS) scale down so the word always fits the screen.
      word.style.setProperty("--n", String(Math.max(d.label.length, 5)));

      window.__lenis?.stop();
      el.classList.add("on");
      const keep = { fill: "forwards" };

      // Flood: the panel rises with a slightly curved leading edge that flattens as it lands.
      const cover = sheet.animate([{ transform: `translate3d(0,${OFF},0)` }, { transform: "translate3d(0,0,0)" }], { duration: 620, easing: EASE, ...keep });
      const rise = word.animate([{ transform: "translate3d(0,105%,0)" }, { transform: "none" }], { duration: 560, delay: 280, easing: OUT, ...keep });

      // Swap the page only once the curtain and the name are still, so the work of building the
      // new page can't make anything on screen stutter.
      await Promise.all([done(cover, 800), done(rise, 1000)]);
      beginCurtain();
      flushSync(() => navigate(to));
      scrollToTop();
      await Promise.all([pageReady(), wait(200)]);
      // Let the new page lay itself out and decode the photos it opens with before lifting.
      await Promise.race([Promise.all([settle(), decodeVisible()]), wait(700)]);

      // Lift: the name leaves first, then the blue clears off the top.
      word.animate([{ transform: "none" }, { transform: "translate3d(0,-105%,0)" }], { duration: 360, easing: EASES.exit, ...keep });
      await wait(140);
      endCurtain();
      await done(
        sheet.animate([{ transform: "translate3d(0,0,0)" }, { transform: `translate3d(0,calc(-1 * ${OFF}),0)` }], { duration: 680, easing: EASE, ...keep }),
        950
      );

      el.classList.remove("on");
      el.getAnimations({ subtree: true }).forEach((a) => a.cancel());
      window.__lenis?.start();
      busy.current = false;
    };

    const onClick = (e) => {
      if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      const a = e.target.closest?.("a[href]");
      if (!a || (a.target && a.target !== "_self") || a.hasAttribute("download") || a.hasAttribute("data-inplace")) return;
      const url = new URL(a.href, window.location.href);
      if (url.origin !== window.location.origin || pageOf(url.pathname) === pageOf(window.location.pathname) || url.pathname.startsWith("/admin")) return;
      e.preventDefault();
      if (busy.current) return;
      run(url.pathname + url.search + url.hash, url.pathname).catch(() => {
        // Never leave someone stuck behind the curtain.
        endCurtain();
        root.current?.classList.remove("on");
        root.current?.getAnimations({ subtree: true }).forEach((x) => x.cancel());
        window.__lenis?.start();
        busy.current = false;
        navigate(url.pathname + url.search + url.hash);
      });
    };
    document.addEventListener("click", onClick, true);
    return () => document.removeEventListener("click", onClick, true);
  }, [navigate]);

  return (
    <div className="pt" ref={root} aria-hidden="true">
      <div className="pt-sheet">
        <span className="pt-cap top" />
        <div className="pt-blue">
          <Rings rings={5} />
          <span className="pt-mask">
            <span className="pt-word" />
          </span>
        </div>
        <span className="pt-cap bot" />
      </div>
    </div>
  );
}
