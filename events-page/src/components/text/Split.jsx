import { useRef, useEffect } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText as GSAPSplitText } from "gsap/SplitText";
gsap.registerPlugin(ScrollTrigger, GSAPSplitText);

let counter = 0;

const SplitText = ({
  text,
  className = "",
  delay = 100,
  duration = 0.6,
  ease = "power3.out",
  splitType = "chars",
  from = { opacity: 0, y: 40 },
  to = { opacity: 1, y: 0 },
  threshold = 0.1,
  rootMargin = "-100px",
  textAlign = "center",
  onLetterAnimationComplete,
}) => {
  const ref = useRef(null);
  const initialized = useRef(false);
  const triggerId = useRef("");

  useEffect(() => {
    const el = ref.current;
    if (!el || !text) return;

    if (initialized.current) return;
    initialized.current = true;

    triggerId.current = `split-text-trigger-${counter++}`;

    const absoluteLines = splitType === "lines";
    if (absoluteLines) el.style.position = "relative";

    let splitter;
    try {
      splitter = new GSAPSplitText(el, {
        type: splitType,
        absolute: absoluteLines,
        linesClass: "split-line",
      });
    } catch (err) {
      console.error("SplitText error:", err);
      return;
    }

    const targets = splitter[splitType] || splitter.chars;
    if (!targets?.length) {
      splitter.revert();
      return;
    }

    targets.forEach(t => (t.style.willChange = "transform, opacity"));

    const startPct = (1 - threshold) * 100;
    const [_, val = "0", unit = "px"] = /^(-?\d+(?:\.\d+)?)(px|em|rem|%)?$/.exec(rootMargin) ?? [];
    const offset = `${val.startsWith("-") ? "-=" : "+="}${Math.abs(parseFloat(val))}${unit}`;
    const start = `top ${startPct}%${offset}`;

    const tl = gsap.timeline({
      scrollTrigger: {
        id: triggerId.current,
        trigger: el,
        start,
        toggleActions: "play none none none",
        once: true,
      },
      smoothChildTiming: true,
      onComplete: () => {
        gsap.set(targets, { ...to, clearProps: "willChange", immediateRender: true });
        onLetterAnimationComplete?.();
      },
    });

    tl.set(targets, { ...from, immediateRender: false, force3D: true });
    tl.to(targets, {
      ...to,
      duration,
      ease,
      stagger: delay / 1000,
      force3D: true,
    });

    return () => {
      const st = ScrollTrigger.getById(triggerId.current);
      if (st) st.kill();
      tl.kill();
      splitter.revert();
      initialized.current = false;
    };
  }, [text]);

  return (
    <p
      ref={ref}
      className={`split-parent overflow-hidden inline-block whitespace-normal ${className}`}
      style={{ textAlign, wordWrap: "break-word" }}
    >
      {text}
    </p>
  );
};

export default SplitText;
