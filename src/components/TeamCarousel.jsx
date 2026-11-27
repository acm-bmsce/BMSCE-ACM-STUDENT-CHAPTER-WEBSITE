import { useEffect, useRef, useState } from "react";
import { prefersReducedMotion } from "../lib/motion";
import { safeHref } from "../lib/safeUrl";

// How much page scroll moves the carousel by one person.
const STEP_VH = 62;

const clamp = (v, lo, hi) => Math.min(hi, Math.max(lo, v));
const pad = (n) => String(n).padStart(2, "0");

/**
 * Scroll-driven arc of portraits. The page scrolls normally; a sticky
 * stage turns that progress into a sideways glide, and the person in the centre has
 * their details in the corner. Transforms are written straight to the DOM each frame,
 * so React only re-renders when the centred person changes.
 */
export default function TeamCarousel({ people, title, intro }) {
  const section = useRef(null);
  const cards = useRef([]);
  const [active, setActive] = useState(0);
  const [still] = useState(prefersReducedMotion);
  const count = people.length;

  useEffect(() => {
    if (still || !count) return undefined;
    let raf = 0;
    let last = -1;

    const paint = () => {
      raf = 0;
      const el = section.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const travel = el.offsetHeight - window.innerHeight;
      const p = clamp(-rect.top / Math.max(travel, 1), 0, 1) * (count - 1);
      const phone = window.innerWidth < 820;
      const gap = phone ? window.innerWidth * 0.64 : Math.min(window.innerWidth * 0.26, 380);
      const rise = phone ? 28 : 56;

      cards.current.forEach((card, i) => {
        if (!card) return;
        const d = i - p;
        const a = Math.abs(d);
        // Left of centre sits lower, right of centre higher, like a rising arc.
        const x = d * gap;
        // A gentle dip either side of centre, so neighbours never climb into the details above.
        const y = a * a * rise * 0.22;
        const s = 1 - Math.min(a, 3) * 0.12;
        // The person in the middle faces you squarely; neighbours turn away along the arc.
        card.style.transform = `translate3d(${x}px, ${y}px, 0) scale(${s}) rotateY(${-d * 8}deg) rotateZ(${d * -4}deg)`;
        card.style.opacity = String(clamp(1.25 - a * 0.45, 0, 1));
        card.style.zIndex = String(100 - Math.round(a * 10));
        card.style.pointerEvents = a > 2.4 ? "none" : "";
      });

      const idx = Math.round(p);
      if (idx !== last) {
        last = idx;
        setActive(idx);
      }
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
  }, [count, still]);

  // Clicking a side portrait scrolls the page until that person is centred.
  const goTo = (i) => {
    const el = section.current;
    if (!el) return;
    const travel = el.offsetHeight - window.innerHeight;
    const y = window.scrollY + el.getBoundingClientRect().top + (travel * i) / Math.max(count - 1, 1);
    if (window.__lenis) window.__lenis.scrollTo(y, { duration: 1.1 });
    else window.scrollTo({ top: y, behavior: "smooth" });
  };

  if (!count) return null;

  // Reduced motion: a plain, readable grid instead of the glide.
  if (still) {
    return (
      <section className="sec dark">
        <div className="wrap">
          <h2 className="d2" style={{ marginBottom: 40 }}>{title}</h2>
          <div className="g4">
            {people.map((p) => (
              <div key={p.name + p.role}>
                <img src={p.img || "/img/members.webp"} alt={p.name} className="ph4" style={{ aspectRatio: 0.8, objectPosition: "top" }} loading="lazy" />
                <p className="lab blue" style={{ marginTop: 14 }}>{p.role}</p>
                <h3 className="d3" style={{ fontSize: 20 }}>{p.name}</h3>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  const cur = people[active] || people[0];

  return (
    <section ref={section} className="tc" style={{ height: `calc(100svh + ${(count - 1) * STEP_VH}svh)` }} aria-label={typeof title === "string" ? title : "Core team"}>
      <div className="tc-stage">
        <div className="wrap tc-top">
          <div className="tc-head">
            <h2 className="d2">{title}</h2>
            {intro && <p className="sm mut">{intro}</p>}
          </div>
          <dl className="tc-meta" aria-live="polite">
            <div>
              <dt>Name</dt>
              <dd key={cur.name} className="tc-swap">{cur.name}</dd>
            </div>
            <div>
              <dt>Role</dt>
              <dd key={cur.role + active} className="tc-swap">{cur.role}</dd>
            </div>
            <div>
              <dt>Profile</dt>
              <dd>
                {safeHref(cur.linkedin) ? (
                  <a href={safeHref(cur.linkedin)} target="_blank" rel="noopener noreferrer" className="tc-swap" key={cur.linkedin}>
                    LinkedIn ↗
                  </a>
                ) : (
                  <span className="mut">-</span>
                )}
              </dd>
            </div>
          </dl>
        </div>

        <div className="tc-arc">
          {people.map((p, i) => (
            <button
              key={p.name + p.role}
              type="button"
              ref={(el) => (cards.current[i] = el)}
              className={`tc-card${i === active ? " on" : ""}`}
              onClick={() => goTo(i)}
              aria-label={`${p.name}, ${p.role}`}
              aria-current={i === active ? "true" : undefined}
              tabIndex={Math.abs(i - active) > 1 ? -1 : 0}
            >
              <span className="tc-ring" aria-hidden="true" />
              <span className="tc-face">
                <img src={p.img || "/img/members.webp"} alt="" loading={i < 3 ? "eager" : "lazy"} decoding="async" width="400" height="400" draggable="false" />
              </span>
              <span className="tc-pin" aria-hidden="true" />
            </button>
          ))}
        </div>

        <div className="tc-foot">
          <p className="tc-role tc-swap" key={`n${active}`}>{cur.role}</p>
          <p className="tc-count">
            <b className="tc-swap" key={active}>{pad(active + 1)}</b>
            <span>/ {pad(count)}</span>
          </p>
          <div className="tc-ticks" aria-hidden="true">
            {people.map((p, i) => (
              <span key={p.name} className={i === active ? "on" : ""} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
