// The public site's building blocks. Every page is assembled from these, so a card,
// a section head or a hero looks and moves the same wherever it appears.
// Visual rules live in site.css; tokens (colour, easing) in its :root block.
import { forwardRef, useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import Split from "../Split";
import { cdn } from "../../lib/data";
import { rs } from "../../lib/responsive";

/** The concentric diamond outline behind heroes. `rings` is 4 (page heroes) or 5 (home). */
// Each ring is the outer diamond drawn smaller. They radiate: every ring grows slowly outward from
// the centre and fades as it goes, one after another, so the lines seem to pulse out of the photo.
// With reduced motion they rest at these sizes as a still set of concentric diamonds.
const RING_SIZES = [260, 380, 520, 680, 840].map((r) => r / 840);
export function Rings({ rings = 4, style }) {
  const sizes = RING_SIZES.slice(0, rings);
  const ref = useRef(null);
  // The rings are repainted while they move, so they only move while they're on screen.
  useEffect(() => {
    const el = ref.current;
    if (!el || typeof IntersectionObserver === "undefined") return undefined;
    const io = new IntersectionObserver(([e]) => el.classList.toggle("idle", !e.isIntersecting));
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return (
    <svg ref={ref} className="rings radiate" viewBox="0 0 1700 1700" aria-hidden="true" style={{ "--m": sizes[sizes.length - 1], ...style }}>
      {sizes.map((s, k) => (
        <path key={s} d="M850 10 1690 850 850 1690 10 850Z" style={{ "--s": s, "--k": k, "--n": sizes.length }} />
      ))}
    </svg>
  );
}

/** A striped tile with the blue diamond, holding a photo's place until one is chosen. */
export function Placeholder({ className = "", style, label = "Photo coming soon" }) {
  return (
    <div className={`ph-tile ${className}`.trim()} style={style} role="img" aria-label={label}>
      <span aria-hidden="true" />
    </div>
  );
}

/** Small label with the blue diamond, used above headings. */
export function Eyebrow({ children, muted, reveal = true, className = "", style }) {
  return (
    <p className={`lab${muted ? " mut" : ""}${reveal ? " rv" : ""} ${className}`.trim()} style={{ marginBottom: 20, ...style }}>
      <span className="dia" />
      {children}
    </p>
  );
}

/**
 * Inner-page hero: eyebrow, display title, lede and a diamond photo, with an optional
 * slot (facts, buttons, chips) under the lede.
 */
export function PageHero({ title, lede, img, imgAlt, imgStyle, children }) {
  return (
    <section className="ph">
      <div className="wrap ph-g">
        <div>
          <Split as="h1" className="d1" style={{ "--i": 1 }}>
            {title}
          </Split>
          {lede && (
            <p className="lede mut rv" style={{ marginTop: 28, "--i": 2 }}>
              {lede}
            </p>
          )}
          {children}
        </div>
        <div className="ph-img">
          <Rings />
          <span className="dline" style={{ inset: 0 }} />
          {img ? (
            <img className="dmask" src={img} {...rs(img, "(max-width: 820px) 72vw, 34vw")} alt={imgAlt} style={imgStyle} fetchpriority="high" width="560" height="560" />
          ) : (
            <Placeholder className="dmask ph-hero" />
          )}
        </div>
      </div>
    </section>
  );
}

/** Section heading row: display title on the left, lede on the right (stacked on phones). */
export function SectionHead({ title, lede, eyebrow }) {
  return (
    <div className="sh">
      <div>
        {eyebrow && <Eyebrow muted>{eyebrow}</Eyebrow>}
        <Split className="d2">{title}</Split>
      </div>
      {lede && (
        <p className="lede mut rv" style={{ "--i": 1 }}>
          {lede}
        </p>
      )}
    </div>
  );
}

/**
 * Button / link with the site's sweep fill. `to` renders a router Link, `href` an anchor,
 * otherwise a <button>. variant: "primary" | "outline" | "white"; size: "md" | "sm".
 */
export const Button = forwardRef(function Button(
  { to, href, variant = "primary", size = "md", full, loading, arrow, className = "", children, ...rest },
  ref
) {
  const cls = ["btn", variant === "outline" && "o", variant === "white" && "w", size === "sm" && "sm", full && "full", className]
    .filter(Boolean)
    .join(" ");
  const body = (
    <>
      {loading && <span className="spin" aria-hidden="true" />}
      {children}
      {arrow && !loading && <span className="ar">{arrow === true ? "→" : arrow}</span>}
    </>
  );
  if (to) {
    return (
      <Link ref={ref} to={to} className={cls} {...rest}>
        {body}
      </Link>
    );
  }
  if (href) {
    const external = /^https?:/.test(href);
    return (
      <a ref={ref} href={href} className={cls} {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})} {...rest}>
        {body}
      </a>
    );
  }
  return (
    <button ref={ref} type="button" className={cls} disabled={loading || rest.disabled} aria-busy={loading || undefined} {...rest}>
      {body}
    </button>
  );
});

/**
 * Responsive photo: reserves its box (no layout shift), shows a dark placeholder while
 * loading, then fades and settles in as it scrolls into view (.rv-img).
 */
export function Media({ src, alt = "", width = 900, height, ratio, className = "", style, eager, reveal = true, ...rest }) {
  const [loaded, setLoaded] = useState(false);
  const ref = useRef(null);
  useEffect(() => {
    if (ref.current?.complete) setLoaded(true);
  }, []);
  return (
    <img
      ref={ref}
      src={src}
      alt={alt}
      width={width}
      height={height || (ratio ? Math.round(width / ratio) : undefined)}
      loading={eager ? "eager" : "lazy"}
      decoding="async"
      onLoad={() => setLoaded(true)}
      className={`ph4${reveal ? " rv-img" : ""}${loaded ? " ld" : ""} ${className}`.trim()}
      style={{ aspectRatio: ratio, ...style }}
      {...rest}
    />
  );
}

/**
 * The one card used for events and the hall of fame: square art, optional date badge,
 * title and supporting lines. Pass `to` for a page link or `onOpen` for a dialog.
 */
export function PosterCard({ image, title, date, meta, foot, to, href, onOpen, width = 520, index = 0 }) {
  const inner = (
    <>
      <span style={image ? { "--bg": `url("${cdn(image, 60)}")` } : undefined}>
        <img src={image ? cdn(image, width) : "/img/events-bg.webp"} alt={image ? `${title} poster` : ""} loading="lazy" decoding="async" width={width} height={width} />
        {date && (
          <span className="badge">
            <b>{date.getDate()}</b>
            <span>{date.toLocaleDateString("en-IN", { month: "short", year: "numeric" })}</span>
          </span>
        )}
      </span>
      <h3>{title}</h3>
      {meta && <p className="mut clamp2">{meta}</p>}
      {foot && <p className="lab card-foot">{foot}</p>}
    </>
  );
  // `onOpen` cards open their window in place, so the page-change curtain leaves them alone.
  const props = { className: "poster rv", style: { "--i": index }, ...(onOpen ? { "data-inplace": "" } : {}) };
  if (to) {
    return (
      <Link to={to} {...props}>
        {inner}
      </Link>
    );
  }
  return (
    <a
      href={href}
      {...props}
      onClick={(e) => {
        if (!onOpen) return;
        e.preventDefault();
        onOpen();
      }}
    >
      {inner}
    </a>
  );
}

/** A sentence that scrolls sideways forever; `items` repeat with diamonds between. */
export function Marquee({ items, reverse, className = "", render = (x) => x, label }) {
  return (
    <div className={`marq ${reverse ? "rev " : ""}${className}`.trim()} aria-hidden={label ? undefined : "true"} aria-label={label}>
      {[0, 1].map((k) => (
        <span key={k} aria-hidden={k === 1 ? "true" : undefined}>
          {items.map((item, n) => (
            <span key={`${k}-${n}`} className="mq-i">
              {render(item, n)}
              <i className="dia" />
            </span>
          ))}
        </span>
      ))}
    </div>
  );
}

/** Row of filter chips. options: [{ value, label }]. */
export function FilterChips({ options, value, onChange, label }) {
  return (
    <div className="chips" role="group" aria-label={label}>
      {options.map((o) => (
        <button key={o.value} type="button" className={`chip${o.value === value ? " on" : ""}`} aria-pressed={o.value === value} onClick={() => onChange(o.value)}>
          {o.label}
        </button>
      ))}
    </div>
  );
}

/** Designed empty state: what's missing and, optionally, what to do about it. */
export function Empty({ title, children, action }) {
  return (
    <div className="empty">
      <p className="d3">{title}</p>
      {children && <p className="sm mut">{children}</p>}
      {action}
    </div>
  );
}
