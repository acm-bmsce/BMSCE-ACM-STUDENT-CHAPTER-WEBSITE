import { useMemo, useState } from "react";
import { cdn, useProjects } from "../lib/data";
import useTitle from "../lib/useTitle";
import Split from "../components/Split";
import { safeHref } from "../lib/safeUrl";
import { PageHero } from "../components/ui";

export default function Projects() {
  useTitle("Projects");
  const projects = useProjects();
  const [cat, setCat] = useState("All");
  const cats = useMemo(() => ["All", ...new Set(projects.flatMap((p) => p.categories))], [projects]);
  const list = cat === "All" ? projects : projects.filter((p) => p.categories.includes(cat));

  return (
    <>
      <PageHero
        title={
          <>
            Technical <span className="blue">projects</span>
          </>
        }
        lede={<>Discover innovative projects built by students of ACM BMSCE, from AI-powered tools to containerised backends.</>}
        img="/img/technical.webp"
        imgAlt="A developer at work"
      />

      <section className="sec light">
        <div className="wrap">
          {cats.length > 2 && (
            <div className="chips" role="group" aria-label="Filter by category" style={{ marginBottom: 56 }}>
              {cats.map((c) => (
                <button key={c} type="button" className={`chip${c === cat ? " on" : ""}`} aria-pressed={c === cat} onClick={() => setCat(c)}>
                  {c}
                </button>
              ))}
            </div>
          )}

          <div key={cat}>
          {list.map((p, n) => {
            const flip = n % 2 === 1;
            const last = n === list.length - 1;
            return (
              <article
                key={p.id}
                className="g2 ai-c"
                style={{ padding: "56px 0", borderTop: "1px solid var(--ln-d)", borderBottom: last ? "1px solid var(--ln-d)" : undefined, direction: flip ? "rtl" : undefined }}
              >
                {p.image ? (
                  flip ? (
                    <div className="rv-img" style={{ direction: "ltr", background: "var(--raise)", height: "clamp(260px, 30vw, 400px)", display: "grid", placeItems: "center" }}>
                      <img src={cdn(p.image, 900)} alt={`${p.title} screenshot`} className="nobg" style={{ width: "64%", height: "auto", maxHeight: "80%", objectFit: "contain" }} loading="lazy" />
                    </div>
                  ) : (
                    <img src={cdn(p.image, 1100)} alt={`${p.title} screenshot`} className="ph4 rv-img" style={{ height: "clamp(260px, 30vw, 400px)" }} loading="lazy" />
                  )
                ) : (
                  <div style={{ direction: "ltr", background: "var(--raise)", height: "clamp(200px, 24vw, 320px)", display: "grid", placeItems: "center" }}>
                    <span className="d2 mut" aria-hidden="true">{String(n + 1).padStart(2, "0")}</span>
                  </div>
                )}
                <div style={{ direction: "ltr", minWidth: 0 }}>
                  <p className="lab mut rv">
                    {String(n + 1).padStart(2, "0")}
                    {p.categories.length ? ` · ${p.categories.join(" · ")}` : ""}
                  </p>
                  <Split className="d2" style={{ fontSize: "clamp(26px, 3.6vw, 56px)", marginTop: 14, "--i": 1 }}>
                    {p.title}
                  </Split>
                  <p className="lede mut rv" style={{ marginTop: 18, "--i": 2 }}>
                    {p.description}
                  </p>
                  {p.author && (
                    <p className="sm" style={{ marginTop: 14 }}>
                      By <b>{p.author}</b>
                    </p>
                  )}
                  {p.stack.length > 0 && (
                    <div className="chips" style={{ marginTop: 18 }}>
                      {p.stack.map((t) => (
                        <span key={t} className="chip">
                          {t}
                        </span>
                      ))}
                    </div>
                  )}
                  {safeHref(p.github) && (
                    <a className="btn w" href={safeHref(p.github)} target="_blank" rel="noopener noreferrer" style={{ marginTop: 24 }}>
                      View on GitHub <span className="ar">→</span>
                    </a>
                  )}
                </div>
              </article>
            );
          })}

          </div>

          <div className="rv" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 24, flexWrap: "wrap", marginTop: 88, background: "var(--raise)", padding: "clamp(28px, 4vw, 48px)" }}>
            <p className="d2" style={{ fontSize: "clamp(32px, 3.4vw, 52px)" }}>Built something worth showing?</p>
            <a className="btn" href="https://github.com/acm-bmsce" target="_blank" rel="noopener noreferrer">
              ACM BMSCE on GitHub <span className="ar">→</span>
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
