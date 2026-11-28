import { useEffect, useRef, useState } from "react";
import { prefersReducedMotion } from "../lib/motion";
import { markReady } from "../lib/ready";
import { lockScroll } from "./SmoothScroll";

const KEY = "introPlayed-v2";
// If the intro isn't ready by then, open the site instead of keeping people waiting.
const LOAD_BUDGET_MS = 2500;

/** Should this visit start with the chapter intro? Only when it begins on the home page. */
function shouldPlay() {
  if (typeof window === "undefined" || document.hidden || prefersReducedMotion()) return false;
  if (window.location.pathname !== "/") return false;
  if (navigator.connection?.saveData) return false;
  try {
    return !sessionStorage.getItem(KEY);
  } catch {
    return true;
  }
}

/**
 * The chapter's original Lottie intro, once per session when a visit starts on Home.
 * A black cover is up from the first frame (so the page never flashes underneath), the
 * animation plays on a canvas, and a wipe hands over to the hero, whose entrance waits
 * for markReady(). Skippable at any moment: the button, any tap, key or scroll.
 */
export default function Preloader() {
  const host = useRef(null);
  const [visible, setVisible] = useState(shouldPlay);
  const [leaving, setLeaving] = useState(false);

  useEffect(() => {
    if (!visible) {
      markReady();
      return undefined;
    }

    lockScroll(true);
    let locked = true;
    const unlock = () => {
      if (locked) lockScroll(false);
      locked = false;
    };
    let disposed = false;
    let done = false;
    let animation;
    let hideTimer;
    const mobile = window.matchMedia("(max-width: 768px)").matches;

    const finish = () => {
      if (disposed || done) return;
      done = true;
      try {
        sessionStorage.setItem(KEY, "true");
      } catch {
        /* storage unavailable */
      }
      markReady();
      setLeaving(true);
      hideTimer = setTimeout(() => {
        unlock();
        setVisible(false);
      }, 800);
    };

    const budget = setTimeout(() => !animation && finish(), LOAD_BUDGET_MS);
    const failsafe = setTimeout(finish, 9000);

    (async () => {
      try {
        const path = mobile ? "/animations/intro-mob.json" : "/animations/intro.json";
        const [{ default: lottie }, response] = await Promise.all([
          // Light SVG build: no expression engine (no eval). The canvas build drops this file's
          // masked image layers and plays a black screen, so SVG it is.
          import("lottie-web/build/player/esm/lottie_light.min.js"),
          fetch(path),
        ]);
        if (!response.ok) throw new Error(`Failed to load ${path}`);
        const animationData = await response.json();
        if (disposed || done) return;
        animation = lottie.loadAnimation({
          container: host.current,
          renderer: "svg",
          loop: false,
          autoplay: true,
          animationData,
          rendererSettings: { preserveAspectRatio: "xMidYMid slice", progressiveLoad: true, hideOnTransparent: true },
        });
        animation.setSpeed(mobile ? 1.5 : 1.8);
        animation.addEventListener("complete", finish);
        animation.addEventListener("data_failed", finish);
      } catch {
        finish();
      }
    })();

    // Any deliberate input means "let me in".
    const skip = (e) => {
      if (e.type === "keydown" && ["Shift", "Control", "Alt", "Meta"].includes(e.key)) return;
      finish();
    };
    const events = ["pointerdown", "keydown", "wheel", "touchmove"];
    events.forEach((ev) => window.addEventListener(ev, skip, { passive: true }));

    return () => {
      disposed = true;
      clearTimeout(budget);
      clearTimeout(failsafe);
      clearTimeout(hideTimer);
      events.forEach((ev) => window.removeEventListener(ev, skip));
      animation?.destroy();
      unlock();
    };
  }, [visible]);

  if (!visible) return null;
  return (
    <div className={`preloader${leaving ? " is-fading" : ""}`} role="status" aria-label="BMSCE ACM Student Chapter introduction">
      <div className="preloader-animation" ref={host} aria-hidden="true" />
    </div>
  );
}
