import { Children, cloneElement, isValidElement, useEffect, useRef } from "react";
import { prefersReducedMotion } from "../lib/motion";

// Splits text (including text inside spans like .blue) into word spans, numbered in
// reading order via --wi. Highlight blocks (.hl, .dia) and <br> stay whole.
function splitNode(node, counter) {
  if (typeof node === "string" || typeof node === "number") {
    return String(node)
      .split(/(\s+)/)
      .map((part) => {
        if (!part) return null;
        if (/^\s+$/.test(part)) return " ";
        return (
          <span className="w">
            <span style={{ "--wi": counter.n++ }}>{part}</span>
          </span>
        );
      });
  }
  if (!isValidElement(node) || node.type === "br") return node;
  const cls = typeof node.props.className === "string" ? node.props.className.split(" ") : [];
  if (cls.includes("hl") || cls.includes("dia")) {
    return (
      <span className="w">
        <span style={{ "--wi": counter.n++ }}>{node}</span>
      </span>
    );
  }
  return cloneElement(node, undefined, Children.map(node.props.children, (c) => splitNode(c, counter)));
}

/** A display heading whose words rise out of masks when it scrolls into view. */
export default function Split({ as: Tag = "h2", className = "", children, ...rest }) {
  const counter = { n: 0 };
  return (
    <Tag className={`${className} split rv`} {...rest}>
      {Children.map(children, (c) => splitNode(c, counter))}
    </Tag>
  );
}

/**
 * A long statement that lights up word by word as it scrolls through the viewport.
 * One CSS variable (--p) is written per frame; each word compares it with its index.
 */
export function ScrollWords({ as: Tag = "p", className = "", children, ...rest }) {
  const ref = useRef(null);
  const counter = { n: 0 };
  const words = Children.map(children, (c) => splitNode(c, counter));
  const total = counter.n;

  useEffect(() => {
    const el = ref.current;
    if (!el) return undefined;
    if (prefersReducedMotion()) {
      el.style.setProperty("--p", String(total + 2));
      return undefined;
    }
    let raf = 0;
    const paint = () => {
      raf = 0;
      const vh = window.innerHeight;
      const r = el.getBoundingClientRect();
      // 0 when the block's top reaches 85% of the screen, 1 when its bottom reaches 45%.
      const t = Math.min(Math.max((vh * 0.85 - r.top) / (r.height + vh * 0.4), 0), 1);
      el.style.setProperty("--p", (t * (total + 2)).toFixed(2));
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
  }, [total]);

  return (
    <Tag ref={ref} className={`${className} sw`} {...rest}>
      {words}
    </Tag>
  );
}
