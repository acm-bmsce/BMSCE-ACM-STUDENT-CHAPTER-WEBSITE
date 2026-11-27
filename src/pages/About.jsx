import { useEffect, useRef, useState } from "react";
import { ABOUT_ACM, ABOUT_CHAPTER, CHAPTER, JOURNEY } from "../data/site";
import { Count, prefersReducedMotion } from "../lib/motion";
import useTitle from "../lib/useTitle";
import Split from "../components/Split";
import { Eyebrow, PageHero, SectionHead } from "../components/ui";
import { rs } from "../lib/responsive";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function Contact() {
  const [form, setForm] = useState({ name: "", email: "", message: "", botcheck: "" });
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState("idle");
  const set = (k) => (e) => {
    setForm((f) => ({ ...f, [k]: e.target.value }));
    setErrors((x) => ({ ...x, [k]: undefined }));
  };

  const submit = async (e) => {
    e.preventDefault();
    const next = {};
    if (form.name.trim().length < 2) next.name = "Enter your name";
    if (!EMAIL_RE.test(form.email.trim())) next.email = "Enter a valid email";
    if (form.message.trim().length < 10) next.message = "Write at least a sentence";
    setErrors(next);
    if (Object.keys(next).length) return;
    // Hidden honeypot field: bots fill it, people never see it.
    if (form.botcheck) return setStatus("sent");

    setStatus("sending");
    try {
      const res = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({
          name: form.name.trim(),
          email: form.email.trim(),
          message: form.message.trim(),
          access_key: CHAPTER.web3formsKey,
          subject: `New message from ${form.name.trim()} (bmsce.acm.org)`,
        }),
      });
      const json = await res.json();
      if (!json.success) throw new Error(json.message);
      setStatus("sent");
      setForm({ name: "", email: "", message: "", botcheck: "" });
    } catch {
      setStatus("error");
    }
  };

  return (
    <form onSubmit={submit} noValidate style={{ display: "grid", gap: 28, background: "var(--raise)", padding: "clamp(24px, 4vw, 40px)" }}>
      <div className="fld float">
        <label htmlFor="c-name">Your name</label>
        <input id="c-name" type="text" autoComplete="name" placeholder=" " value={form.name} onChange={set("name")} aria-invalid={Boolean(errors.name)} aria-describedby={errors.name ? "c-name-e" : undefined} maxLength={100} />
        {errors.name && <span className="err" id="c-name-e">{errors.name}</span>}
      </div>
      <div className="fld float">
        <label htmlFor="c-email">Your email</label>
        <input id="c-email" type="email" autoComplete="email" inputMode="email" placeholder=" " value={form.email} onChange={set("email")} aria-invalid={Boolean(errors.email)} aria-describedby={errors.email ? "c-email-e" : undefined} maxLength={254} />
        {errors.email && <span className="err" id="c-email-e">{errors.email}</span>}
      </div>
      <div className="fld float">
        <label htmlFor="c-msg">Your message</label>
        <textarea id="c-msg" placeholder=" " value={form.message} onChange={set("message")} aria-invalid={Boolean(errors.message)} aria-describedby={errors.message ? "c-msg-e" : undefined} maxLength={4000} />
        {errors.message && <span className="err" id="c-msg-e">{errors.message}</span>}
      </div>
      <input type="text" name="botcheck" value={form.botcheck} onChange={set("botcheck")} tabIndex={-1} autoComplete="off" aria-hidden="true" style={{ display: "none" }} />
      {status === "sent" && <p className="note ok" role="status">Thanks, your message is on its way. We’ll reply by email.</p>}
      {status === "error" && (
        <p className="note bad" role="alert">
          The message didn’t go through. Try again, or write to {CHAPTER.email}.
        </p>
      )}
      <button className="btn w" type="submit" style={{ justifySelf: "start" }} disabled={status === "sending"}>
        {status === "sending" ? <span className="spin" aria-hidden="true" /> : null}
        {status === "sending" ? "Sending" : "Send message"} {status !== "sending" && <span className="ar">→</span>}
      </button>
    </form>
  );
}

/**
 * The milestones on one line. As you scroll, a blue line draws down through the dates and
 * each milestone lights up as the line reaches it.
 */
function Journey({ items }) {
  const ref = useRef(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return undefined;
    if (prefersReducedMotion()) {
      el.style.setProperty("--jp", "1");
      el.querySelectorAll("li").forEach((li) => li.classList.add("lit"));
      return undefined;
    }
    let raf = 0;
    const nodes = [...el.querySelectorAll("li")];
    const paint = () => {
      raf = 0;
      const r = el.getBoundingClientRect();
      const mark = window.innerHeight * 0.6;
      const p = Math.min(Math.max((mark - r.top) / r.height, 0), 1);
      el.style.setProperty("--jp", p.toFixed(4));
      const y = r.top + p * r.height;
      nodes.forEach((li) => li.classList.toggle("lit", li.getBoundingClientRect().top + 14 <= y));
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
  }, []);
  return (
    <div className="jr" ref={ref}>
      <span className="jr-line" aria-hidden="true">
        <span />
      </span>
      <ol>
      {items.map((j, n) => (
        <li key={j.title} className={n % 2 ? "r" : "l"}>
          <span className="jr-node" aria-hidden="true" />
          <span className="jr-year d3">{j.year}</span>
          <span className="jr-body">
            <b>{j.title}</b>
            <span className="sm mut">{j.text}</span>
          </span>
        </li>
      ))}
      </ol>
    </div>
  );
}

export default function About() {
  useTitle("About");
  return (
    <>
      <PageHero
        img="/img/orient-crowd.webp"
        imgAlt="A full auditorium of students at BMSCE ACM Orientation 2026"
        title={
          <>
            Find your <span className="blue">people</span>
          </>
        }
        lede={ABOUT_CHAPTER.text}
      />

      <section className="sec dark fit about-acm">
        <div className="wrap">
          <div className="sh">
            <Split className="d2">
              About <span className="blue">ACM</span>
            </Split>
            <div className="rv" style={{ "--i": 1 }}>
              <p className="lede">{ABOUT_ACM.text}</p>
              <a className="btn" href={ABOUT_ACM.link} target="_blank" rel="noopener noreferrer" style={{ marginTop: 24 }}>
                Explore ACM India <span className="ar">→</span>
              </a>
            </div>
          </div>
          <div className="g4">
            {ABOUT_ACM.pillars.map((p, n) => (
              <div key={p.title} className="rv" style={{ "--i": n }}>
                <img src={p.img} alt="" className="ph4" loading="lazy" />
                <h3 className="d3" style={{ fontSize: 20, marginTop: 16 }}>{p.title}</h3>
                <p className="sm mut" style={{ marginTop: 6 }}>{p.text}</p>
              </div>
            ))}
          </div>
          <div className="cells g3 acm-stats" style={{ gap: 0 }}>
            {ABOUT_ACM.stats.map((s) => (
              <div className="stat rv" key={s.label}>
                <span style={{ margin: "0 0 14px" }} className="mut">{s.label}</span>
                {s.plain ? <b className="blue">{s.value}</b> : <Count className="blue" value={s.value} suffix={s.suffix} />}
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="sec light">
        <div className="wrap">
          <div className="sh">
            <Split className="d2" style={{ fontSize: "clamp(30px, 4vw, 60px)" }}>
              Where tech <span className="hl">meets</span> purpose
            </Split>
            <p className="lede rv" style={{ "--i": 1 }}>{ABOUT_CHAPTER.mission}</p>
          </div>
          <div className="purpose">
            <img src="/img/talk-hall.webp" {...rs("/img/talk-hall.webp")} alt="A speaker addressing a packed auditorium at BMSCE" className="ph4 rv-img about-ph" loading="lazy" />
            <div className="cells g2" style={{ gap: 0 }}>
              {ABOUT_CHAPTER.values.map((v, n) => (
                <div key={v.title} className="rv" style={{ "--i": n }}>
                  <h3 className="d3" style={{ fontSize: 20 }}>{v.title}</h3>
                  <p className="sm mut" style={{ marginTop: 8 }}>{v.text}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="sec dark">
        <div className="wrap">
          <SectionHead
            title={
              <>
                Our <span className="blue">journey</span>
              </>
            }
            lede="From an inauguration with 250 attendees to anchoring a national summit, a few milestones along the way."
          />
          <Journey items={JOURNEY} />
        </div>
      </section>

      <section className="sec light" id="contact">
        <div className="wrap g2">
          <div>
            <Split className="d2" style={{ "--i": 1 }}>
              Have <span className="hl">questions?</span>
            </Split>
            <p className="lede rv" style={{ marginTop: 26, "--i": 2 }}>
              Drop us a message, or write to{" "}
              <a href={`mailto:${CHAPTER.email}`} style={{ borderBottom: "2px solid var(--b)", fontWeight: 700 }}>
                {CHAPTER.email}
              </a>
            </p>
            <p className="sm mut" style={{ marginTop: 22, lineHeight: 1.8 }}>
              {CHAPTER.address.map((l) => (
                <span key={l} style={{ display: "block" }}>{l}</span>
              ))}
            </p>
          </div>
          <Contact />
        </div>
      </section>
    </>
  );
}
