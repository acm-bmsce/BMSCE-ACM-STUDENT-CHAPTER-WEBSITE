import { useMemo, useRef, useState } from "react";
import { CHAPTER } from "../data/site";
import { PLAYBOOK, PLAYBOOK_INTRO } from "../data/playbook";
import { cdn, useInsights } from "../lib/data";
import useTitle from "../lib/useTitle";
import Split from "../components/Split";
import { safeHref } from "../lib/safeUrl";
import { Eyebrow, PageHero, SectionHead } from "../components/ui";
import { rs } from "../lib/responsive";

const PREVIEW = 8;
const pad = (n) => String(n).padStart(2, "0");

function Playbook({ head }) {
  const [i, setI] = useState(0);
  const article = useRef(null);
  const s = PLAYBOOK[i];

  const go = (n) => {
    setI(n);
    // Bring the new section into view on phones, where the nav sits above it.
    const top = article.current?.getBoundingClientRect().top ?? 0;
    if (top < 0 || top > window.innerHeight * 0.6) {
      const y = window.scrollY + top - 96;
      if (window.__lenis) window.__lenis.scrollTo(y);
      else window.scrollTo({ top: y, behavior: "smooth" });
    }
  };

  return (
    <div className="pb">
      <div className="pb-side">
        {head}
        <nav aria-label="Playbook sections" className="pb-nav" style={{ borderTop: "1px solid var(--ln-d)" }}>
        {PLAYBOOK.map((p, n) => (
          <button
            key={p.id}
            type="button"
            onClick={() => go(n)}
            aria-current={n === i ? "step" : undefined}
            style={{ display: "flex", gap: 14, width: "100%", alignItems: "center", border: 0, borderBottom: "1px solid var(--ln-d)", padding: "0 12px", textAlign: "left", background: n === i ? "var(--b)" : "transparent", color: n === i ? "#000" : undefined, fontWeight: n === i ? 700 : 500, transition: "background-color .2s" }}
          >
            <span className={`lab${n === i ? "" : " mut"}`}>{pad(n + 1)}</span>
            {p.label}
          </button>
        ))}
        </nav>
      </div>
      <article ref={article} key={s.id} className="pb-art page-in" aria-live="polite">
        <div className="pb-body">
        <p className="lab mut">
          Section {n1(i)} of {PLAYBOOK.length} · {s.label}
        </p>
        <h3 className="d2" style={{ fontSize: "clamp(26px, 3.4vw, 52px)", marginTop: 14 }}>
          {s.title}
        </h3>
        {s.intro && (
          <p className="lede" style={{ marginTop: 18 }}>
            {s.intro}
          </p>
        )}
        <div className="cells g2" style={{ gap: 0, marginTop: 32 }}>
          {s.blocks.map((b) => (
            <div key={b.heading}>
              <h4 className="lab blue">{b.heading}</h4>
              {b.text && (
                <p className="sm mut" style={{ marginTop: 10 }}>
                  {b.text}
                </p>
              )}
              {b.items && (
                <ul className="bl sm">
                  {b.items.map((it) => (
                    <li key={it}>{it}</li>
                  ))}
                </ul>
              )}
              {b.note && (
                <p className="sm" style={{ marginTop: 12 }}>
                  {b.note}
                </p>
              )}
            </div>
          ))}
        </div>
        </div>
        <div className="pb-foot">
          <button type="button" className="btn o" disabled={i === 0} onClick={() => go(i - 1)}>
            ← Previous
          </button>
          <button type="button" className="btn" disabled={i === PLAYBOOK.length - 1} onClick={() => go(i + 1)}>
            Next →
          </button>
        </div>
      </article>
    </div>
  );
}
const n1 = (i) => i + 1;

export default function Placements() {
  useTitle("Placements");
  const insights = useInsights();
  const [batch, setBatch] = useState("All");
  const [all, setAll] = useState(false);
  const batches = useMemo(() => ["All", ...new Set(insights.map((x) => x.year).filter(Boolean))], [insights]);
  const list = batch === "All" ? insights : insights.filter((x) => x.year === batch);
  const visible = all ? list : list.slice(0, PREVIEW);

  return (
    <>
      <PageHero
        title={
          <>
            Career <span className="blue">paths</span>
          </>
        }
        lede={<>Actionable guidance and motivation for students pursuing higher studies or career goals, with direct takeaways from alumni journeys.</>}
        img="/img/internships.webp"
        imgAlt="Illustration of students preparing for careers"
      >
        <nav className="chips rv" aria-label="Placement resources" style={{ marginTop: 32, "--i": 3 }}>
          <a className="chip on" href="#insights">Insight Series</a>
          <a className="chip" href="#playbook">Placement playbook</a>
          <a className="chip" href="#hundred">100 Days of Code</a>
        </nav>
      </PageHero>

      <section className="sec light" id="insights">
        <div className="wrap">
          <SectionHead title={<>Insight Series</>} lede={<>Alumni stories with practical perspectives on careers, higher studies and the paths between them.</>} />
          {batches.length > 2 && (
            <div className="chips" role="group" aria-label="Filter by batch" style={{ marginBottom: 40 }}>
              {batches.map((b) => (
                <button key={b} type="button" className={`chip${b === batch ? " on" : ""}`} aria-pressed={b === batch} onClick={() => setBatch(b)}>
                  {b}
                </button>
              ))}
            </div>
          )}
          <div className="g4" style={{ rowGap: 48 }} key={batch}>
            {visible.map((x, n) => (
              <a key={x.id} href={safeHref(x.link)} target="_blank" rel="noopener noreferrer" className="zoom rv" style={{ "--i": n % 4 }}>
                <span style={{ display: "block", overflow: "hidden" }}>
                  <img src={cdn(x.image, 520)} alt={`${x.name}, Insight Series poster`} className="ph4" style={{ aspectRatio: 1 }} loading="lazy" decoding="async" width="520" height="520" />
                </span>
                <h3 className="d3" style={{ fontSize: 20, marginTop: 14 }}>{x.name}</h3>
                <p className="sm mut">{x.role}</p>
                {x.company && <p className="sm" style={{ fontWeight: 700 }}>{x.company}</p>}
                <p className="lab" style={{ marginTop: 10 }}>Read on Instagram →</p>
              </a>
            ))}
          </div>
          {list.length > PREVIEW && (
            <div style={{ textAlign: "center", marginTop: 56 }}>
              <button type="button" className="btn o" onClick={() => setAll((v) => !v)}>
                {all ? "Show fewer stories" : `Show all ${list.length} stories`}
              </button>
            </div>
          )}
        </div>
      </section>

      <section className="sec dark fit pb-sec" id="playbook">
        <div className="wrap">
          <Playbook
            head={
              <div className="pb-head">
                <Split className="d2">
                  Placement <span className="blue">playbook</span>
                </Split>
                <p className="mut rv" style={{ "--i": 1 }}>
                  {PLAYBOOK_INTRO}
                </p>
              </div>
            }
          />
        </div>
      </section>

      <section className="sec light" id="hundred">
        <div className="wrap g2 ai-c">
          <div>
            <Split className="d2" style={{ "--i": 1 }}>
              100 days <span className="hl">of</span> code
            </Split>
            <p className="lede rv" style={{ marginTop: 28, "--i": 2 }}>
              The chapter’s 100 day DSA challenge ran from 30 October 2025 to 6 February 2026, encouraging consistent practice and code consistency. Its motto said it plainly: if you cheat, you are cheating yourself.
            </p>
            <a className="btn w" href={CHAPTER.hundredDays} target="_blank" rel="noopener noreferrer" style={{ marginTop: 28 }}>
              Visit the challenge site <span className="ar">→</span>
            </a>
          </div>
          <div>
            <img src="/img/poster.webp" {...rs("/img/poster.webp")} alt="100 Days of Code poster" className="ph4 rv-img hd-poster" loading="lazy" />
          </div>
        </div>
      </section>
    </>
  );
}
