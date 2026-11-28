import { useEffect } from "react";
import Lenis from "lenis";
import { prefersReducedMotion } from "../lib/motion";

/** Eased wheel scrolling on desktop. Touch devices keep native momentum scrolling. */
export default function SmoothScroll({ children }) {
  useEffect(() => {
    if (prefersReducedMotion() || window.matchMedia("(pointer: coarse)").matches) return undefined;
    const lenis = new Lenis({ lerp: 0.12, smoothWheel: true, wheelMultiplier: 1 });
    window.__lenis = lenis;
    let raf = requestAnimationFrame(function loop(t) {
      lenis.raf(t);
      raf = requestAnimationFrame(loop);
    });
    return () => {
      cancelAnimationFrame(raf);
      lenis.destroy();
      window.__lenis = null;
    };
  }, []);
  return children;
}

export function scrollToTop(immediate = true) {
  if (window.__lenis) window.__lenis.scrollTo(0, { immediate, force: true });
  else window.scrollTo({ top: 0, behavior: immediate ? "auto" : "smooth" });
}

// Counted, so two overlays (a dialog and the passes window) can't unlock each other early.
let locks = 0;
export function lockScroll(lock) {
  locks = Math.max(0, locks + (lock ? 1 : -1));
  const on = locks > 0;
  document.body.classList.toggle("is-locked", on);
  if (window.__lenis) (on ? window.__lenis.stop() : window.__lenis.start());
}
