import { useEffect, useId, useRef } from "react";
import { createPortal } from "react-dom";
import { lockScroll } from "../SmoothScroll";
import { useLeave } from "../../lib/motion";

const FOCUSABLE = 'button, a[href], input, select, textarea, [tabindex]:not([tabindex="-1"])';

/**
 * The site's one dialog shell (event details, certificate window). Locks page scroll,
 * traps Tab inside, closes on Esc / backdrop / the × button, plays its exit, and gives
 * focus back to whatever opened it. `after` renders over the dialog (e.g. a nested form).
 * `holdEscape()` returning true leaves Esc to that nested layer.
 */
export default function Dialog({ eyebrow, title, onClose, closeLabel = "Close", holdEscape, after, children }) {
  const [leaving, leave] = useLeave(onClose);
  const dlg = useRef(null);
  const id = useId();

  useEffect(() => {
    const y = window.scrollY;
    lockScroll(true);
    const opener = document.activeElement;
    const onKey = (e) => {
      if (e.key === "Escape" && !holdEscape?.()) leave();
      if (e.key === "Tab" && dlg.current) {
        const f = dlg.current.querySelectorAll(FOCUSABLE);
        if (!f.length) return;
        const first = f[0];
        const last = f[f.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };
    window.addEventListener("keydown", onKey);
    dlg.current?.querySelector(".x")?.focus({ preventScroll: true });
    return () => {
      window.removeEventListener("keydown", onKey);
      lockScroll(false);
      opener?.focus?.({ preventScroll: true });
      // Closing returns you exactly where you were, whatever reflowed underneath.
      if (Math.abs(window.scrollY - y) > 2) {
        if (window.__lenis) window.__lenis.scrollTo(y, { immediate: true, force: true });
        else window.scrollTo(0, y);
      }
    };
  }, [leave, holdEscape]);

  // Rendered at the site root: a transformed ancestor (page entrance, reveals) would otherwise
  // trap this fixed overlay in its own stacking context, under the header.
  return createPortal(
    <div className={`modal${leaving ? " out" : ""}`} onMouseDown={(e) => e.target === e.currentTarget && leave()} data-lenis-prevent>
      <div className="dlg" role="dialog" aria-modal="true" aria-labelledby={id} ref={dlg}>
        <div className="dlg-h">
          <div style={{ minWidth: 0 }}>
            {eyebrow && <p className="lab mut">{eyebrow}</p>}
            <h2 id={id} className="d3" style={{ marginTop: 2 }}>
              {title}
            </h2>
          </div>
          <button type="button" className="x" onClick={leave} aria-label={closeLabel}>
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d="M5 5l14 14M19 5 5 19" />
            </svg>
          </button>
        </div>
        {children}
      </div>
      {after}
    </div>,
    document.querySelector(".site") || document.body
  );
}
