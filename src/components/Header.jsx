import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { lockScroll } from "./SmoothScroll";
import { SocialIcons } from "./Footer";

const LINKS = [
  { to: "/", label: "Home", end: true },
  { to: "/events", label: "Events" },
  { to: "/projects", label: "Projects" },
  { to: "/placements", label: "Placements" },
  { to: "/team", label: "Team" },
  { to: "/about", label: "About Us" },
];

export default function Header() {
  const { pathname } = useLocation();
  const [hidden, setHidden] = useState(false);
  const [solid, setSolid] = useState(false);
  const last = useRef(0);
  const nav = useRef(null);
  const ind = useRef(null);
  const [menu, setMenu] = useState(false);

  // Slide away while scrolling down, return on any upward scroll.
  useEffect(() => {
    let ticking = false;
    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        const y = window.scrollY;
        if (y > 240 && y > last.current + 4) setHidden(true);
        else if (y < last.current - 4 || y < 240) setHidden(false);
        setSolid(y > 8);
        last.current = y;
        ticking = false;
      });
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // The blue underline glides to whichever link is active (or hovered).
  useLayoutEffect(() => {
    const host = nav.current;
    const bar = ind.current;
    if (!host || !bar) return undefined;
    const place = (el) => {
      if (!el) {
        bar.style.opacity = "0";
        return;
      }
      bar.style.opacity = "1";
      bar.style.transform = `translateX(${el.offsetLeft}px)`;
      bar.style.width = `${el.offsetWidth}px`;
    };
    const active = () => host.querySelector("a.on");
    place(active());
    const over = (e) => {
      const a = e.target.closest("a");
      if (a && host.contains(a)) place(a);
    };
    const out = () => place(active());
    host.addEventListener("pointerover", over);
    host.addEventListener("pointerleave", out);
    const ro = new ResizeObserver(out);
    ro.observe(host);
    document.fonts?.ready.then(out);
    return () => {
      host.removeEventListener("pointerover", over);
      host.removeEventListener("pointerleave", out);
      ro.disconnect();
    };
  }, [pathname]);

  // A new page closes the phone menu and brings the header back.
  useEffect(() => {
    setMenu(false);
    setHidden(false);
  }, [pathname]);

  const cls = ({ isActive }) => (isActive ? "on" : undefined);

  return (
    <>
    <header className={`hdr${hidden && !menu ? " hide" : ""}${solid ? " solid" : ""}${menu ? " menu-open" : ""}`} id="top">
      <div className="wrap">
        <Link to="/" aria-label="BMSCE ACM Student Chapter, home" className="hdr-logo">
          <img className="logo nobg" src="/img/logo-mark.webp" alt="BMSCE ACM Student Chapter" width="84" height="38" />
        </Link>
        <nav className="nav" aria-label="Main navigation" ref={nav}>
          {LINKS.map((l) => (
            <NavLink key={l.to} to={l.to} end={l.end} className={cls}>
              {l.label}
            </NavLink>
          ))}
          <span className="nav-ind" ref={ind} aria-hidden="true" />
        </nav>
        <div className="hdr-r">
          <Link className="btn" to="/join">
            Join us
          </Link>
          <button type="button" className="menu-btn" aria-expanded={menu} aria-controls="mobile-menu" aria-label={menu ? "Close menu" : "Open menu"} onClick={() => setMenu((m) => !m)}>
            <span />
            <span />
          </button>
        </div>
      </div>
    </header>
    <MobileMenu open={menu} onClose={() => setMenu(false)} />
    </>
  );
}

/**
 * Phone navigation: a full-screen sheet that wipes down from the header, with the pages
 * rising in one after another. Traps focus, locks the page, closes on Esc.
 */
function MobileMenu({ open, onClose }) {
  const ref = useRef(null);

  useEffect(() => {
    if (!open) return undefined;
    lockScroll(true);
    const opener = document.activeElement;
    ref.current?.querySelector("a")?.focus({ preventScroll: true });
    const onKey = (e) => {
      if (e.key === "Escape") return onClose();
      if (e.key !== "Tab") return undefined;
      // The menu button stays in the tab loop so the sheet can be closed from the keyboard.
      const items = [document.querySelector(".menu-btn"), ...ref.current.querySelectorAll("a, button")].filter(Boolean);
      const first = items[0];
      const last = items[items.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
      return undefined;
    };
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("keydown", onKey);
      lockScroll(false);
      opener?.focus?.({ preventScroll: true });
    };
  }, [open, onClose]);

  const cls = ({ isActive }) => (isActive ? "on" : undefined);
  // Join us is the button at the foot of the sheet, so it is not repeated in the list.
  const pages = LINKS;

  return (
    <div id="mobile-menu" ref={ref} className={`mm${open ? " open" : ""}`} role="dialog" aria-modal="true" aria-label="Menu" inert={open ? undefined : ""}>
      <nav aria-label="Pages">
        {pages.map((l, i) => (
          <NavLink key={l.to} to={l.to} end={l.end} className={cls} style={{ "--i": i }}>
            <span className="mm-n">{String(i + 1).padStart(2, "0")}</span>
            <span>{l.label}</span>
          </NavLink>
        ))}
      </nav>
      <div className="mm-foot">
        <Link className="btn full" to="/join">
          Join us <span className="ar">→</span>
        </Link>
        <SocialIcons />
      </div>
    </div>
  );
}
