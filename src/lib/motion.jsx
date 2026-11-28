// The site's motion layer. Everything runs on transform / opacity / clip-path (or a
// scroll-time object-position for photos), writes at most once per frame, and stops
// entirely for people who ask for reduced motion.
import { useCallback, useEffect, useRef, useState } from "react";
import { curtainDown } from "./ready";

export const prefersReducedMotion = () =>
  typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/**
 * Motion tokens, shared with CSS (site.css :root --ease / --ease-io) so JS-driven motion
 * (the page curtain, WebAnimations) moves exactly like CSS transitions.
 */
export const EASE = {
  out: "cubic-bezier(.2,.7,.2,1)", // entrances, reveals, hover
  inOut: "cubic-bezier(.76,0,.24,1)", // wipes and the page curtain
  exit: "cubic-bezier(.6,0,.4,1)", // things leaving
};
export const DUR = { micro: 180, ui: 400, reveal: 900, page: 700 };
export const STAGGER = { words: 55, items: 70, grid: 90 };

/** Reduced motion asked for, or the device is saving data: skip ambient and heavy motion. */
export const motionEnabled = () =>
  !prefersReducedMotion() && !(typeof navigator !== "undefined" && navigator.connection?.saveData);

// Items in lists and grids that have no reveal of their own rise in one after another, so
// long lists and card grids don't sit static. Carousels, marquees, the calendar, menus and
// forms keep their own motion (or none).
const AUTO_ITEMS = "main section :is(ul, ol, .g2, .g3, .g4, .ev-list, .gm-list, .pb-list) > :is(li, article, div, a)";
const AUTO_SKIP = ".tc, .marq, .cal, .strip, .hof-track, nav, form, [data-lenis-prevent], .hero, .moment-ph, .mm, .modal, .dpics";
const PENDING = ".rv:not(.in), .rv-img:not(.in), .rv-auto:not(.in), .rv-sec:not(.in)";

function autoTag(root) {
  root.querySelectorAll("main > section.sec:not(.rv-sec)").forEach((sec) => sec.classList.add("rv-sec"));
  const count = new Map();
  root.querySelectorAll(AUTO_ITEMS).forEach((el) => {
    if (el.classList.contains("rv-auto") || el.matches(".rv, .rv-img, .split") || el.closest(AUTO_SKIP) || el.closest(".rv, .rv-img") || el.querySelector(".rv, .rv-img, .split")) return;
    const n = count.get(el.parentElement) || 0;
    count.set(el.parentElement, n + 1);
    el.style.setProperty("--ai", String(n % 6));
    el.classList.add("rv-auto");
  });
}

/**
 * Watches `root` for .rv / .rv-img elements (including ones rendered later, after data
 * loads or a route change) and adds .in once each scrolls into view. Also tags list items
 * (.rv-auto) and sections (.rv-sec, for the hairline that draws across their top).
 */
export function useRevealRoot(rootRef) {
  useEffect(() => {
    const root = rootRef.current;
    if (!root) return undefined;
    const reveal = (el) => el.classList.add("in");

    if (prefersReducedMotion() || !("IntersectionObserver" in window)) {
      const all = () => root.querySelectorAll(".rv:not(.in), .rv-img:not(.in)").forEach(reveal);
      all();
      const mo = new MutationObserver(all);
      mo.observe(root, { childList: true, subtree: true });
      return () => mo.disconnect();
    }

    const io = new IntersectionObserver(
      (entries) =>
        entries.forEach((entry) => {
          // Behind the page-change curtain nothing is visible yet; wait for it to lift.
          if (entry.isIntersecting && !curtainDown()) {
            reveal(entry.target);
            io.unobserve(entry.target);
          }
        }),
      // Threshold 0: tall images and sections start revealing as soon as their edge enters.
      { rootMargin: "0px 0px -8% 0px", threshold: 0 }
    );
    const scan = () => {
      autoTag(root);
      root.querySelectorAll(PENDING).forEach((el) => io.observe(el));
    };
    scan();
    const mo = new MutationObserver(scan);
    mo.observe(root, { childList: true, subtree: true });
    // Observing again makes the observer report what is on screen right now.
    const rescan = () => {
      root.querySelectorAll(PENDING).forEach((el) => {
        io.unobserve(el);
        io.observe(el);
      });
    };
    window.addEventListener("pt:done", rescan);
    return () => {
      io.disconnect();
      mo.disconnect();
      window.removeEventListener("pt:done", rescan);
    };
  }, [rootRef]);
}

const fmt = (n, decimals) =>
  n.toLocaleString("en-US", { minimumFractionDigits: decimals, maximumFractionDigits: decimals });

/** Number that counts up the first time it is seen. Renders the final value for no-JS/reduced motion. */
export function Count({ value, decimals = 0, suffix = "", className, style }) {
  const ref = useRef(null);
  const [shown, setShown] = useState(value);

  useEffect(() => {
    const el = ref.current;
    if (!el || prefersReducedMotion() || !("IntersectionObserver" in window)) return undefined;
    let raf;
    setShown(0);
    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting || curtainDown()) return;
        io.disconnect();
        const start = performance.now();
        const dur = 1400;
        const tick = (now) => {
          const t = Math.min((now - start) / dur, 1);
          const eased = 1 - Math.pow(1 - t, 4);
          setShown(value * eased);
          if (t < 1) raf = requestAnimationFrame(tick);
        };
        raf = requestAnimationFrame(tick);
      },
      { threshold: 0.4 }
    );
    io.observe(el);
    const again = () => {
      io.unobserve(el);
      io.observe(el);
    };
    window.addEventListener("pt:done", again);
    return () => {
      io.disconnect();
      cancelAnimationFrame(raf);
      window.removeEventListener("pt:done", again);
    };
  }, [value]);

  return (
    <b ref={ref} className={className} style={style} aria-label={`${fmt(value, decimals)}${suffix}`}>
      {fmt(shown, decimals)}
      {suffix}
    </b>
  );
}

/** Mouse drag-to-scroll for horizontal strips; touch keeps native scrolling. */
export function useDragScroll() {
  const ref = useRef(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return undefined;
    let down = false;
    let moved = false;
    let startX = 0;
    let startLeft = 0;
    const onDown = (e) => {
      if (e.pointerType !== "mouse") return;
      down = true;
      moved = false;
      startX = e.clientX;
      startLeft = el.scrollLeft;
    };
    const onMove = (e) => {
      if (!down) return;
      const dx = e.clientX - startX;
      if (!moved && Math.abs(dx) > 4) {
        moved = true;
        el.classList.add("drag");
      }
      if (moved) el.scrollLeft = startLeft - dx;
    };
    const onUp = () => {
      down = false;
      el.classList.remove("drag");
    };
    el.addEventListener("pointerdown", onDown);
    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerup", onUp);
    return () => {
      el.removeEventListener("pointerdown", onDown);
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerup", onUp);
    };
  }, []);
  return ref;
}

/** The scroll progress line across the top of the page. */
export function useScrollFX(rootRef) {
  useEffect(() => {
    if (prefersReducedMotion()) return undefined;
    const bar = document.querySelector(".scroll-bar");
    let raf = 0;

    // Photos stay put while scrolling (no drift inside their frames); only the progress line moves.
    const paint = () => {
      raf = 0;
      const max = document.documentElement.scrollHeight - window.innerHeight;
      if (bar) bar.style.transform = `scaleX(${max > 0 ? window.scrollY / max : 0})`;
    };

    const request = () => {
      if (!raf) raf = requestAnimationFrame(paint);
    };
    paint();
    window.addEventListener("scroll", request, { passive: true });
    window.addEventListener("resize", request);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", request);
      window.removeEventListener("resize", request);
    };
  }, [rootRef]);
}

/** Resolves once the routed page has replaced the Suspense placeholder (or after a timeout). */
export function pageReady(timeout = 1500) {
  return new Promise((resolve) => {
    const done = () => document.querySelector("main#main > :not(.route-fallback)");
    if (done()) return resolve();
    const mo = new MutationObserver(() => {
      if (done()) {
        mo.disconnect();
        resolve();
      }
    });
    mo.observe(document.body, { childList: true, subtree: true });
    setTimeout(() => {
      mo.disconnect();
      resolve();
    }, timeout);
  });
}

/**
 * Lets a dialog play its exit before it closes. Returns [leaving, leave]; render
 * `leaving` as a class and call `leave()` wherever the dialog would have closed.
 */
export function useLeave(onClose, resetKey, ms = 240) {
  const [leaving, setLeaving] = useState(false);
  const timer = useRef(0);
  useEffect(() => () => clearTimeout(timer.current), []);
  // A dialog that stays mounted (and is reopened with new content) starts fresh.
  useEffect(() => setLeaving(false), [resetKey]);
  const leave = useCallback(() => {
    if (prefersReducedMotion()) return onClose();
    setLeaving(true);
    timer.current = setTimeout(onClose, ms);
  }, [onClose, ms]);
  return [leaving, leave];
}
