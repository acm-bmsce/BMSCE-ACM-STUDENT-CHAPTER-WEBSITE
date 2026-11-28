import { useRef } from "react";

// A button that throws confetti from where it sits, for the Emerging Chapter Award.
// The burst draws on one short-lived canvas over the page and removes it when the last piece lands.
const COLORS = ["#4db8ff", "#ffffff", "#ffd84d", "#ff5fa2", "#7cf29c", "#b48cff"];

function burst(fromEl) {
  const r = fromEl.getBoundingClientRect();
  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  const cv = document.createElement("canvas");
  cv.setAttribute("aria-hidden", "true");
  Object.assign(cv.style, { position: "fixed", inset: "0", width: "100vw", height: "100vh", pointerEvents: "none", zIndex: "9999" });
  cv.width = innerWidth * dpr;
  cv.height = innerHeight * dpr;
  document.body.appendChild(cv);
  const ctx = cv.getContext("2d");
  ctx.scale(dpr, dpr);

  const ox = r.left + r.width / 2;
  const oy = r.top + r.height / 2;
  const pieces = Array.from({ length: 160 }, () => {
    const a = -Math.PI / 2 + (Math.random() - 0.5) * Math.PI * 0.9;
    const v = 9 + Math.random() * 11;
    return {
      x: ox,
      y: oy,
      vx: Math.cos(a) * v,
      vy: Math.sin(a) * v,
      w: 6 + Math.random() * 6,
      h: 3 + Math.random() * 5,
      rot: Math.random() * Math.PI,
      spin: (Math.random() - 0.5) * 0.35,
      tilt: Math.random() * Math.PI,
      color: COLORS[(Math.random() * COLORS.length) | 0],
      round: Math.random() < 0.25,
    };
  });

  const start = performance.now();
  const step = (now) => {
    const t = now - start;
    ctx.clearRect(0, 0, innerWidth, innerHeight);
    let alive = 0;
    for (const p of pieces) {
      p.vx *= 0.985;
      p.vy = p.vy * 0.985 + 0.32;
      p.x += p.vx;
      p.y += p.vy;
      p.rot += p.spin;
      p.tilt += 0.12;
      if (p.y > innerHeight + 20) continue;
      alive++;
      ctx.save();
      ctx.globalAlpha = Math.max(0, Math.min(1, (4200 - t) / 800));
      ctx.translate(p.x, p.y);
      ctx.rotate(p.rot);
      ctx.fillStyle = p.color;
      if (p.round) {
        ctx.beginPath();
        ctx.arc(0, 0, p.h / 2 + 1, 0, Math.PI * 2);
        ctx.fill();
      } else {
        ctx.fillRect(-p.w / 2, (-p.h / 2) * Math.abs(Math.cos(p.tilt)), p.w, p.h * Math.abs(Math.cos(p.tilt)) + 0.5);
      }
      ctx.restore();
    }
    if (alive && t < 4200) requestAnimationFrame(step);
    else cv.remove();
  };
  requestAnimationFrame(step);
}

export default function Celebrate({ className = "btn", style }) {
  const ref = useRef(null);
  const go = () => {
    if (!ref.current) return;
    burst(ref.current);
  };
  return (
    <button type="button" ref={ref} className={`${className} roll`} style={style} onClick={go} aria-label="Celebrate">
      <span className="roll-in" aria-hidden="true">
        <span>Celebrate 🎉</span>
        <span>Celebrate 🎉</span>
      </span>
    </button>
  );
}
