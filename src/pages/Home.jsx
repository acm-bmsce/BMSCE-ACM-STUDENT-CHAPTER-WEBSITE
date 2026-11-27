import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { CHAPTER, COLLABORATORS, DOMAINS, HIGHLIGHTS, SOCIALS } from "../data/site";
import { cdn, useEvents } from "../lib/data";
import { eventPath } from "../lib/eventLinks";
import { useSiteContent } from "../lib/content";
import { Count, prefersReducedMotion } from "../lib/motion";
import EventModal from "../components/EventModal";
import DriftWall from "../components/reactbits/DriftWall";
import ScrollStack, { ScrollStackItem } from "../components/reactbits/ScrollStack";
import { whenSettled } from "../lib/ready";
import useTitle from "../lib/useTitle";
import { PAGES } from "../data/seo";
import Split, { ScrollWords } from "../components/Split";
import { Eyebrow, Marquee, Placeholder, PosterCard, Rings, SectionHead } from "../components/ui";
import { rs } from "../lib/responsive";

const BAND = ["Events", "Projects", "Workshops", "Hackathons", "Research", "Community", "Placements"];

const SLIDE_MS = 4200;

// The diamond's slideshow. Group photos that the rest of the home page doesn't show.
const HERO = [
  { src: "/img/orient-crowd.webp", alt: "A full auditorium of students at BMSCE ACM Orientation 2026" },
  { src: "/img/sigmod-group.webp", alt: "Speakers, faculty and students at the ACM SIGMOD+PODS 2026 Pre-Conference Workshop" },
  { src: "/img/orient-team.webp", alt: "The BMSCE ACM team on stage at Orientation 2026" },
];

// Plays once the diamond has opened out to fill the screen.
// The chapter highlights reel (15.3 s, muted). It opens on the hall photo the hero dissolves into,
// closes into the diamond on black, and then the page scrolls on to the next section.
const HERO_VIDEO = "/video/hero.mp4";

const clamp01 = (n) => Math.min(Math.max(n, 0), 1);
const easeInOut = (t) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
const lerp = (a, b, t) => a + (b - a) * t;
// The clip morphs from a diamond (t = 0) to the full rectangle (t = 1). Eight points each, so
// every point has a partner: the diamond's corners and edge midpoints, the rectangle's edge
// midpoints and corners.
const DIAMOND = [[50, 0], [75, 25], [100, 50], [75, 75], [50, 100], [25, 75], [0, 50], [25, 25]];
const RECT = [[50, 0], [100, 0], [100, 50], [100, 100], [50, 100], [0, 100], [0, 50], [0, 0]];
const shape = (t) =>
  `polygon(${DIAMOND.map(([x, y], k) => `${lerp(x, RECT[k][0], t).toFixed(2)}% ${lerp(y, RECT[k][1], t).toFixed(2)}%`).join(",")})`;


// The photo section before "Our community in a nutshell": a slowly drifting wall of photos
// (React Bits DriftWall). Every one is from the SIGMOD+PODS 2026 and Orientation 2026 albums and
// appears nowhere else on the site.
const WALL = [
  ["sigmod-323", "Everyone together in the hall at the SIGMOD+PODS 2026 workshop"],
  ["orient-261", "The audience at Orientation 2026"],
  ["sigmod-280", "A keynote at the SIGMOD+PODS 2026 workshop"],
  ["orient-347", "Three speakers on stage at Orientation 2026"],
  ["sigmod-100", "A speaker addressing the hall at the SIGMOD+PODS 2026 workshop"],
  ["orient-394", "A violinist performing at Orientation 2026"],
  ["sigmod-72", "Guests on stage at the opening of the SIGMOD+PODS 2026 workshop"],
  ["orient-452", "The crowd cheering at Orientation 2026"],
  ["sigmod-189", "The panel discussion at the SIGMOD+PODS 2026 workshop"],
  ["orient-530", "A group having fun on stage at Orientation 2026"],
  ["sigmod-147", "Conversations over a break at the SIGMOD+PODS 2026 workshop"],
  ["orient-299", "A student asking a question at Orientation 2026"],
  ["sigmod-49", "Lighting the lamp at the SIGMOD+PODS 2026 workshop"],
  ["orient-809", "The Orientation 2026 opening on the big screen"],
  ["sigmod-292", "A talk on LLM-augmented databases at the SIGMOD+PODS 2026 workshop"],
].map(([name, title]) => ({ image: `/img/wall/${name}.webp`, title }));

// The photo wall sizes its tiles from its own width, so all five columns show on a phone just as
// on a laptop (capped at the desktop size). The wall's plane is drawn at 1.18x, hence the factor.
function WallFit() {
  const ref = useRef(null);
  const [w, setW] = useState(1330);
  useEffect(() => {
    const el = ref.current;
    if (!el) return undefined;
    const ro = new ResizeObserver(([e]) => setW(e.contentRect.width || 1330));
    ro.observe(el);
    return () => ro.disconnect();
  }, []);
  const unit = Math.min(258, (w * 1.14) / 5 / 1.18);
  const gap = Math.max(5, Math.round(unit * 0.07));
  const tile = Math.round(unit - gap);
  return (
    <div className="wall-wrap rv" ref={ref}>
      <DriftWall items={WALL} columns={5} tileWidth={tile} tileHeight={Math.round(tile * 2 / 3)} gap={gap} radius={Math.max(5, Math.round(tile / 20))} speed={30 * Math.max(0.4, tile / 240)} dim={0.82} overlayColor="#000000" fade={0.55} tilt={14} turn={0} />
    </div>
  );
}

function Hero() {
  const ref = useRef(null);
  const film = useRef(null);
  const video = useRef(null);
  const [i, setI] = useState(0);
  const [ready, setReady] = useState(false);

  // Hold the entrance until the chapter intro and any page-change curtain have cleared.
  useEffect(() => {
    let alive = true;
    whenSettled().then(() => alive && setReady(true));
    return () => {
      alive = false;
    };
  }, []);

  // "ACM" is spaced out to the same width as "BMSCE", so the words, the diamond, "Student
  // Chapter" and the button all share one centre line. Re-measured on resize and font load.
  useEffect(() => {
    const el = ref.current;
    if (!el) return undefined;
    const fit = () => {
      const [left, right] = el.querySelectorAll(".stage .hw");
      if (!left || !right) return;
      right.style.letterSpacing = "0px";
      right.style.marginRight = "0px";
      left.style.fontSize = right.style.fontSize = "";
      if (window.innerWidth <= 820) return; // stacked on phones: each word is centred on its own
      const textWidth = (node) => {
        const r = document.createRange();
        r.selectNodeContents(node);
        return r.getBoundingClientRect().width;
      };
      // Never wider than its column, or "BMSCE" would run into the diamond.
      const room = left.clientWidth / textWidth(left);
      if (room < 1) left.style.fontSize = right.style.fontSize = `${parseFloat(getComputedStyle(left).fontSize) * room * 0.98}px`;
      const gap = Math.max(0, (textWidth(left) - textWidth(right)) / 2);
      right.style.letterSpacing = `${gap}px`;
      right.style.marginRight = `${-gap}px`; // no invisible space after the last letter
    };
    fit();
    document.fonts?.ready.then(fit);
    window.addEventListener("resize", fit);
    return () => window.removeEventListener("resize", fit);
  }, []);

  // The slideshow: a new photo every few seconds once the hero is on screen.
  useEffect(() => {
    if (!ready || prefersReducedMotion() || HERO.length < 2) return undefined;
    const t = setTimeout(() => setI((n) => (n + 1) % HERO.length), SLIDE_MS);
    return () => clearTimeout(t);
  }, [i, ready]);

  // Scrolling: the words part and fade, then the diamond opens out until it fills the screen and
  // the video starts. Scrolling back closes it again. One write per frame.
  useEffect(() => {
    const el = ref.current;
    const box = film.current;
    if (!el || !box) return undefined;
    const still = prefersReducedMotion();
    let raf = 0;
    let playing = false;
    const paint = () => {
      raf = 0;
      const stage = el.querySelector(".hero-sticky");
      const frame = el.querySelector(".dframe");
      if (!stage || !frame) return;
      const run = Math.max(el.offsetHeight - stage.offsetHeight, 1);
      // Measured from where the hero starts on the page (it tucks up under the header), so the
      // first screen is always progress 0.
      const top = Math.max(0, el.getBoundingClientRect().top + window.scrollY);
      const p = still ? 0 : clamp01((window.scrollY - top) / run);
      const s = stage.getBoundingClientRect();
      const f = frame.getBoundingClientRect();
      // The frame's resting size, ignoring the entrance animation's scale.
      const fw = frame.offsetWidth;
      const fx = f.left + f.width / 2 - s.left - fw / 2;
      const fy = f.top + f.height / 2 - s.top - fw / 2;
      const t = easeInOut(clamp01((p - 0.1) / 0.6));
      // Where the film ends up: the whole screen on wide screens; on tall ones (phones) the full
      // width at the video's own shape, centred, so the video is never cropped.
      const vid = video.current;
      const ratio = vid?.videoWidth ? vid.videoWidth / vid.videoHeight : 16 / 9;
      const tall = s.width / s.height < 1.2;
      const ew = s.width;
      const eh = tall ? Math.min(s.height, s.width / ratio) : s.height;
      const ey = (s.height - eh) / 2;
      box.style.left = `${lerp(fx, 0, t)}px`;
      box.style.top = `${lerp(fy, ey, t)}px`;
      box.style.width = `${lerp(fw, ew, t)}px`;
      box.style.height = `${lerp(fw, eh, t)}px`;
      box.style.clipPath = shape(t);
      el.style.setProperty("--hp", clamp01(p / 0.4).toFixed(3));
      el.style.setProperty("--ht", t.toFixed(3));
      const v = video.current;
      if (!v) return;
      // Start fetching the film once the diamond is half open, so it's ready when it fills the screen.
      if (t > 0.4 && v.preload !== "auto") v.preload = "auto";
      if (t > 0.985 && !playing) {
        playing = true;
        v.play().catch(() => {});
        box.classList.add("playing");
      } else if (t < 0.9 && playing) {
        playing = false;
        v.pause();
        box.classList.remove("playing");
      }
    };
    const request = () => {
      if (!raf) raf = requestAnimationFrame(paint);
    };
    // When the film has played through while someone is still watching it, the page moves on
    // to the next section by itself. (Scrolling back up plays it again from the start.)
    const vid = video.current;
    const onEnded = () => {
      if (!playing) return;
      const next = el.nextElementSibling;
      if (!next) return;
      if (window.__lenis) window.__lenis.scrollTo(next, { duration: 1.6, easing: (x) => (x < 0.5 ? 4 * x * x * x : 1 - (-2 * x + 2) ** 3 / 2) });
      else next.scrollIntoView({ behavior: "smooth" });
    };
    vid?.addEventListener("ended", onEnded);
    paint();
    // The frame grows in with the entrance; keep the photo on it until that settles.
    const settle = setInterval(request, 100);
    const stop = setTimeout(() => clearInterval(settle), 2600);
    window.addEventListener("scroll", request, { passive: true });
    window.addEventListener("resize", request);
    document.fonts?.ready.then(request);
    return () => {
      cancelAnimationFrame(raf);
      clearInterval(settle);
      clearTimeout(stop);
      vid?.removeEventListener("ended", onEnded);
      window.removeEventListener("scroll", request);
      window.removeEventListener("resize", request);
    };
  }, [ready]);

  return (
    <section className={`hero ${ready ? "hero-in" : "hero-wait"}`} ref={ref}>
      <div className="hero-sticky">
        <div className="wrap hero-in-w">
          <h1 aria-label="BMSCE ACM Student Chapter" style={{ margin: "clamp(24px, 5vh, 64px) 0 0" }}>
            <span className="stage" aria-hidden="true">
              <span className="hw" style={{ textAlign: "right" }}>
                BMSCE
              </span>
              <span className="dframe">
                <Rings rings={5} />
                <span className="dline" />
              </span>
              <span className="hw">ACM</span>
            </span>
            <span aria-hidden="true" className="sub">
              Student <span className="blue">Chapter</span>
            </span>
          </h1>

          <div className="hero-foot">
            <div className="rv" style={{ "--i": 1 }}>
              <Link className="btn" to="/join">
                Join the chapter <span className="ar">→</span>
              </Link>
            </div>
          </div>
        </div>

        {/* The photos sit in their own layer over the diamond, so it can open out to the whole screen. */}
        <div className="hero-film" ref={film} aria-hidden="true">
          {HERO.map((img, n) => (
            <img
              key={img.src}
              className={n === i && ready ? "on" : undefined}
              src={img.src}
              {...rs(img.src, "100vw")}
              alt=""
              fetchpriority={n === 0 ? "high" : undefined}
              loading={n === 0 ? "eager" : "lazy"}
            />
          ))}
          {HERO_VIDEO && <video ref={video} src={HERO_VIDEO} muted playsInline preload="none" tabIndex={-1} onLoadedMetadata={() => window.dispatchEvent(new Event("scroll"))} />}
        </div>
      </div>
    </section>
  );
}

/**
 * One event highlight, sized to a single screen: the story on one side, a few photos on the other.
 * Highlights alternate sides. With no photos yet, tiles hold their place until real ones are added
 * from the admin panel (Pages & team → Highlights).
 */
function Highlight({ h, n }) {
  const id = `hl-${n}`;
  const photos = h.photos?.length ? h.photos.slice(0, 3) : [null, null, null];
  // A wide first photo (a group shot, say) runs across the top at its own shape, uncropped,
  // with the others side by side below; otherwise it stands tall on the left.
  const [wide, setWide] = useState(false);
  const measure = (img) => img && img.naturalWidth && setWide(img.naturalWidth / img.naturalHeight > 1.6);
  return (
    <article className={`moment${n % 2 ? " flip" : ""}`} aria-labelledby={id}>
      <div className="moment-in">
        <div className="moment-copy">
          <span className="moment-year rv" aria-hidden="true">{h.year}</span>
          <Split className="d2" style={{ "--i": 1 }}>
            <span id={id}>{h.title}</span>
          </Split>
          {h.when && (
            <p className="mut rv" style={{ "--i": 2 }}>
              {h.when}
            </p>
          )}
          {h.text && (
            <p className="lede rv" style={{ "--i": 3 }}>
              {h.text}
            </p>
          )}
          {h.stats?.length > 0 && (
            <dl className="moment-stats rv" style={{ "--i": 4 }}>
              {h.stats.map((s) => (
                <div key={s.label}>
                  <dt className="blue">{s.value}</dt>
                  <dd>{s.label}</dd>
                </div>
              ))}
            </dl>
          )}
          {h.link && (
            <Link to={h.link} className="btn o rv" style={{ "--i": 5, marginTop: 8 }}>
              Read about it
            </Link>
          )}
        </div>
        <div className={`moment-ph n${photos.length}${wide ? " wide" : ""}`}>
          {photos.map((p, i) =>
            p ? (
              <img
                key={p.src}
                src={p.src}
                {...rs(p.src, i === 0 ? "(max-width: 820px) 100vw, 50vw" : "(max-width: 820px) 50vw, 25vw")}
                alt={p.alt || ""}
                className="rv-img"
                loading="lazy"
                decoding="async"
                style={{ "--i": i }}
                ref={i === 0 ? (el) => el?.complete && measure(el) : undefined}
                onLoad={i === 0 ? (e) => measure(e.currentTarget) : undefined}
              />
            ) : (
              <div key={i} className="moment-tile rv-img" style={{ "--i": i }} role="img" aria-label="Photo coming soon">
                <span aria-hidden="true" />
              </div>
            )
          )}
        </div>
      </div>
    </article>
  );
}

// One photo from each of these events' galleries (event id, photo file name), newest first. The
// band of names beneath the strip lists the same events.
const MEMORY_PICKS = [
  ["6ac338ed1c0ec0d3c42bbdfb", "qh1wyibbqlilcls16z7o"], // Dev Duel
  ["69ec867dd57061077f7307af", "jluojmoyyzgh6zyjq4zt"], // Duos Dash 4.0
  ["69f07ad7c414f592bbbb9e45", "osdbzgizppkkprt2ktb0"], // Vault of Trials 2.0
  ["69edf9c028f5a32175d9dccc", "dymhzbysh4towndp2eir"], // Operation Black Veil
  ["694566abb7a1a9c19dd0fff2", "c6ujlbfqw6vs3qedrnl9"], // Bulls, Bears and Breakouts
  ["694566abb7a1a9c19dd0fff3", "qviadzubsw2evukauxkk"], // Quiz2Code
  ["6939a8e8cc9ff79294a4c853", "m0itjt5vipox0x1sq6pd"], // Grandmaster's Gambit 3.0
  ["6939a8e8cc9ff79294a4c84c", "y1exmdrxcq8im0rbodfr"], // AI Frontiers Workshop
  ["6939a8e8cc9ff79294a4c849", "nrjvy8vhjab5pt4syyuc"], // Game Theory Showdown
  ["6939a8e8cc9ff79294a4c847", "zgwwgkkjgwahvnuxhluc"], // CTRL+ALT+CREATE
  ["6939a8e7cc9ff79294a4c846", "x1sai061du6p3b3manwk"], // InnoVision
  ["6939a8e7cc9ff79294a4c845", "zxuvaeguexnqleim98tz"], // Cipher Quest
];
function memoriesFrom(events) {
  const byId = new Map(events.map((e) => [e.id, e]));
  return MEMORY_PICKS.map(([id, file]) => {
    const e = byId.get(id);
    const src = e?.gallery.find((g) => g.includes(file));
    return e && src ? { src: cdn(src, 900), alt: `${e.title.trim()}, BMSCE ACM`, title: e.title.trim() } : null;
  }).filter(Boolean);
}

/**
 * "A glimpse of memories": a strip of photos that drifts sideways and bends like the inside of
 * a cylinder (cards nearer the edges turn towards you), above a band of event names running
 * along an arc. Both keep moving (also under the cursor) and stay still for reduced motion.
 */
function Memories({ items: MEMORIES }) {
  const view = useRef(null);
  const track = useRef(null);
  const bandRef = useRef(null);
  const items = [...MEMORIES, ...MEMORIES];

  useEffect(() => {
    const v = view.current;
    const tr = track.current;
    const svg = bandRef.current;
    if (!v || !tr || !svg) return undefined;
    const reduce = prefersReducedMotion();
    const path = svg.querySelector("path");
    const names = [...svg.querySelectorAll(".mem-name")];
    const dots = [...svg.querySelectorAll(".mem-dot")];
    const cards = [...tr.children];
    let raf = 0;
    let x = 0;
    let last = 0;
    let visible = false;

    // The band is an arc; a name sits on it at the point straight below its photo. Arc length
    // by horizontal position, sampled once (the curve's x grows evenly along it).
    const total = path.getTotalLength();
    const N = 240;
    const lens = Array.from({ length: N + 1 }, (_, i) => (total * i) / N);
    const xs = lens.map((l) => path.getPointAtLength(l).x);
    const lenAt = (sx) => {
      if (sx <= xs[0] || sx >= xs[N]) return -9999;
      let lo = 0;
      let hi = N;
      while (hi - lo > 1) {
        const mid = (lo + hi) >> 1;
        if (xs[mid] < sx) lo = mid;
        else hi = mid;
      }
      const f = (sx - xs[lo]) / (xs[hi] - xs[lo]);
      return lens[lo] + f * (lens[hi] - lens[lo]);
    };
    const pt = svg.createSVGPoint();
    const toSvgX = (screenX, inv) => {
      pt.x = screenX;
      pt.y = 0;
      return pt.matrixTransform(inv).x;
    };
    // A long name never runs past its photo: it is narrowed to fit.
    const fit = () => {
      const inv = svg.getScreenCTM()?.inverse();
      if (!inv) return;
      names.forEach((n, k) => {
        const r = cards[k].getBoundingClientRect();
        const room = (toSvgX(r.right, inv) - toSvgX(r.left, inv)) * 0.92;
        n.removeAttribute("textLength");
        if (n.getComputedTextLength() > room) {
          n.setAttribute("textLength", room.toFixed(1));
          n.setAttribute("lengthAdjust", "spacingAndGlyphs");
        }
      });
    };

    const bend = () => {
      const vr = v.getBoundingClientRect();
      const mid = vr.left + vr.width / 2;
      const turn = vr.width < 820 ? 16 : 30; // degrees at the edges
      const inv = svg.getScreenCTM()?.inverse();
      // Measure every card first, then move them: reading between writes would make the browser
      // lay the page out again for each card, every frame.
      const rects = cards.map((c) => c.getBoundingClientRect());
      cards.forEach((c, k) => {
        const r = rects[k];
        const d = Math.max(-1.4, Math.min(1.4, (r.left + r.width / 2 - mid) / (vr.width / 2)));
        c.style.transform = `rotateY(${(-d * turn).toFixed(2)}deg) translateZ(${(d * d * 18).toFixed(1)}px)`;
        if (!inv) return;
        names[k]?.firstChild.setAttribute("startOffset", lenAt(toSvgX(r.left + r.width / 2, inv)).toFixed(1));
        const next = rects[k + 1];
        if (dots[k]) dots[k].firstChild.setAttribute("startOffset", next ? lenAt(toSvgX((r.right + next.left) / 2, inv)).toFixed(1) : "-9999");
      });
    };
    const frame = (now) => {
      raf = 0;
      const dt = last ? Math.min(now - last, 64) : 16;
      last = now;
      const half = tr.scrollWidth / 2;
      x = (x + dt * 0.075) % half;
      tr.style.transform = `translate3d(${-x}px,0,0)`;
      bend();
      if (visible) raf = requestAnimationFrame(frame);
    };
    const io = new IntersectionObserver(([e]) => {
      visible = e.isIntersecting;
      last = 0;
      if (visible && !reduce && !raf) raf = requestAnimationFrame(frame);
    });
    const layout = () => {
      fit();
      bend();
    };
    layout();
    // Photos load lazily and change width as they arrive; names refit once a batch has arrived
    // (one refit for many photos, not one each).
    let refit = 0;
    const later = () => {
      clearTimeout(refit);
      refit = setTimeout(layout, 150);
    };
    cards.forEach((c) => c.addEventListener("load", later));
    document.fonts?.ready.then(layout);
    if (!reduce) io.observe(v);
    window.addEventListener("resize", layout);
    return () => {
      cancelAnimationFrame(raf);
      clearTimeout(refit);
      io.disconnect();
      cards.forEach((c) => c.removeEventListener("load", later));
      window.removeEventListener("resize", layout);
    };
  }, []);

  return (
    <section className="memories dark" aria-labelledby="mem-t">
      <div className="wrap mem-head">
        <Split className="d2" style={{ "--i": 1 }}>
          <span id="mem-t">
            A glimpse of <span className="blue">memories</span>
          </span>
        </Split>
        <p className="lede mut rv" style={{ "--i": 2 }}>
          Talks, summits and late evenings: a few of the moments behind the chapter.
        </p>
      </div>
      <div className="mem-view" ref={view}>
        <div className="mem-track" ref={track}>
          {items.map((m, i) => (
            <img key={i} src={m.src} alt={i < MEMORIES.length ? m.alt : ""} aria-hidden={i >= MEMORIES.length || undefined} loading="lazy" decoding="async" draggable="false" />
          ))}
        </div>
      </div>
      {/* Each event's name rides the arc directly beneath its own photo. */}
      <svg className="mem-band" ref={bandRef} viewBox="0 0 1600 220" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
        <path id="mem-arc" d="M-60 180 Q800 20 1660 180" />
        {items.map((m, i) => (
          <text key={`n${i}`} className="mem-name" textAnchor="middle">
            <textPath href="#mem-arc" startOffset="-9999">
              {m.title.toUpperCase()}
            </textPath>
          </text>
        ))}
        {items.map((m, i) => (
          <text key={`d${i}`} className="mem-dot" textAnchor="middle">
            <textPath href="#mem-arc" startOffset="-9999">
              ◆
            </textPath>
          </text>
        ))}
      </svg>
    </section>
  );
}

export default function Home() {
  useTitle(PAGES["/"].title, true);
  const events = useEvents();
  const { stats, recognition } = useSiteContent();
  const posters = events.filter((e) => e.image).slice(0, 12);
  const [award, ...honours] = recognition;
  // Event names for the band under the memories strip, newest first.
  const memories = memoriesFrom(events);
  const [open, setOpen] = useState(null);

  return (
    <>
      <Hero />

      <div className="band">
        <Marquee items={BAND} />
      </div>

      <section className="sec dark story-sec">
        <div className="wrap">
          <div className="story-top">
            <div>
              <Split className="d2" style={{ fontSize: "clamp(30px, min(5.2vw, 12cqi), 84px)", "--i": 1 }}>
                Where students, technology <span className="blue">and ideas</span> meet.
              </Split>
              <p className="lede mut rv" style={{ marginTop: 24, "--i": 2 }}>
                A student-led community for learning, experimentation and work that connects the classroom to the world beyond it.
              </p>
            </div>
            <figure className="story-ph">
              <img src="/img/13.webp" {...rs("/img/13.webp", "(max-width: 820px) 100vw, 45vw")} alt="A full hall at a BMSCE ACM session" className="rv-img" loading="lazy" />
              <span className="story-dia" aria-hidden="true" />
            </figure>
          </div>
          <div className="sw-rule" />
          <ScrollWords className="d2" style={{ fontSize: "clamp(26px, min(4.2vw, 6.4vh), 68px)", lineHeight: 1 }}>
            Sparking <span className="blue">innovation,</span> growing <span className="blue">leaders,</span> connecting classrooms to{" "}
            <span className="blue">real-world</span> impact. Learning, service and collaboration. A community where tech{" "}
            <span className="blue">meets purpose</span>
          </ScrollWords>
        </div>
      </section>

      <section className="sec light collage-sec">
        <WallFit />
      </section>

      <section className="sec grey">
        <div className="wrap">
          <SectionHead title={<>Our community in a nutshell</>} lede={<>The chapter in numbers since it was inaugurated on {CHAPTER.inaugurated}.</>} />
          <div className="cells g4" style={{ gap: 0 }}>
            <div className="stat stat-key span2-m rv">
              <b className="blue">22.2.22</b>
              <span>Inaugurated on</span>
            </div>
            {stats.map((s, n) => (
              <div className="stat rv" key={s.label} style={{ "--i": n + 1 }}>
                <Count value={s.value} decimals={s.decimals || 0} suffix={s.suffix} />
                <span>{s.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="sec light">
        <div className="wrap">
          <SectionHead title={<>Our domains</>} lede={<>Six distinct wings, one united chapter. Find where you fit, from writing code and research papers to designing visual identities, organising national summits, and giving back.</>} />
          <div className="cells g3" style={{ gap: 0 }}>
            {DOMAINS.map((d, n) => (
              <div key={d.title} className="rv dom" style={{ display: "flex", gap: 20, alignItems: "center", "--i": n % 3 }}>
                {d.img ? (
                  <img src={d.img} alt="" className="dmask" width="88" height="88" style={{ width: 88, height: 88, objectFit: "cover", flex: "none" }} loading="lazy" />
                ) : (
                  <Placeholder className="dmask" style={{ width: 88, height: 88, flex: "none" }} />
                )}
                <div style={{ minWidth: 0 }}>
                  <p className="lab mut">{String(n + 1).padStart(2, "0")}</p>
                  <h3 className="d3">{d.title}</h3>
                  <p className="sm mut" style={{ marginTop: 4 }}>{d.text}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="sec dark fit hof">
        <div className="wrap">
          <SectionHead title={<>Past events</>} lede={<>{events.length} events and counting. Hackathons, research talks, coding marathons and games. Tap one to relive it.</>} />
          <div className="g6 hof-grid">
            {posters.map((e, n) => (
              <PosterCard key={e.id} image={e.image} title={e.title} meta={e.year} href={eventPath(e)} onOpen={() => setOpen(e)} width={420} index={n % 6} />
            ))}
          </div>
          <div className="hof-foot">
            <p className="d3">See every event, talk and competition from the chapter archive</p>
            <Link className="btn" to="/events">
              View all events <span className="ar">→</span>
            </Link>
          </div>
        </div>
      </section>

      {/* The flagship events stack up as you scroll: each rises as a card and settles on the last (React Bits ScrollStack). */}
      {HIGHLIGHTS.length > 0 && (
        <section className="flagships" aria-label="Flagship events">
          <ScrollStack useWindowScroll smoothScroll={false} itemDistance={140} itemStackDistance={26} stackPosition="11%" itemScale={0.04} baseScale={0.88} dimAmount={0.4} holdDistance={120}>
            {HIGHLIGHTS.map((h, n) => (
              <ScrollStackItem key={h.title} itemClassName="flag-card">
                <Highlight h={h} n={n} />
              </ScrollStackItem>
            ))}
          </ScrollStack>
        </section>
      )}

      {award && (
        <section className="sec light fit">
          <div className="wrap g2 ai-c">
            <div>
              <Split className="d2" style={{ "--i": 1 }}>
                {award.title.replace(/award$/i, "").trim()} <span className="hl">award</span> {award.year}
              </Split>
              <p className="lede rv" style={{ marginTop: 28, "--i": 2 }}>
                {award.text}
              </p>
              <ul className="dl" style={{ marginTop: 32 }}>
                {honours.map((h) => (
                  <li key={h.title} className="rv">
                    <span className="d3">{h.year}</span>
                    <span>
                      <b>{h.title}</b>
                      <br />
                      <span className="mut sm">{h.text}</span>
                    </span>
                  </li>
                ))}
              </ul>
              <Link className="btn w" to="/about" style={{ marginTop: 32 }}>
                Our journey <span className="ar">→</span>
              </Link>
            </div>
            <div style={{ display: "grid", gap: 20 }}>
              <img src="/img/entrance.webp" {...rs("/img/entrance.webp")} alt="Chapter members receiving the Emerging Chapter Award" className="ph4 rv-img award-feature" loading="lazy" />
            </div>
          </div>
        </section>
      )}

      {memories.length > 0 && <Memories items={memories} />}

      <section className="sec light">
        <div className="wrap">
          <SectionHead title={<>In good <span className="hl">company</span></>} lede={<>Speakers, partners and platforms we’ve learned alongside, from ACM India and IISc to Google DeepMind, IBM Research and TCS Research.</>} />
          <div className="co" role="img" aria-label={`Collaborators: ${COLLABORATORS.join(", ")}`}>
            {[COLLABORATORS.slice(0, 6), COLLABORATORS.slice(6)].map((row, r) => (
              <Marquee key={r} items={row} reverse={r === 1} className="co-row" render={(name, n) => ((n + r) % 2 ? <span className="thin">{name}</span> : <b>{name}</b>)} />
            ))}
          </div>
        </div>
      </section>

      <section className="sec grey">
        <div className="wrap g2 ai-c">
          <div>
            <Split className="d2">Follow BMSCE ACM on social media</Split>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 10, marginTop: 32 }}>
              {SOCIALS.map((s) => (
                <a key={s.label} className="btn w" href={s.href} target="_blank" rel="noopener noreferrer">
                  {s.label}
                </a>
              ))}
            </div>
            <p className="sm mut" style={{ marginTop: 22 }}>3.2k+ followers across Instagram &amp; LinkedIn · acm@bmsce.ac.in</p>
          </div>
          <div className="soc-grid">
            <img src="/img/orient-friends.webp" {...rs("/img/orient-friends.webp")} alt="Friends together at Orientation 2026" className="ph4 rv-img" loading="lazy" />
            <img src="/img/orient-singers.webp" {...rs("/img/orient-singers.webp")} alt="Two singers performing at Orientation 2026" className="ph4 rv-img" style={{ "--i": 1 }} loading="lazy" />
            <img src="/img/sigmod-board.webp" {...rs("/img/sigmod-board.webp")} alt="The BMSCE ACM team at the ACM SIGMOD+PODS 2026 Pre-Conference Workshop" className="ph4 rv-img" style={{ "--i": 2 }} loading="lazy" />
            <img src="/img/sh-6.webp" {...rs("/img/sh-6.webp")} alt="Students at a chapter event" className="ph4 rv-img" style={{ "--i": 3 }} loading="lazy" />
          </div>
        </div>
      </section>
      <EventModal event={open} onClose={() => setOpen(null)} />
    </>
  );
}
