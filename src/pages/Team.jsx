import { PREVIOUS_CORE, TEAM_PHOTO } from "../data/site";
import { useSiteContent } from "../lib/content";
import useTitle from "../lib/useTitle";
import TeamCarousel from "../components/TeamCarousel";
import Split from "../components/Split";
import { safeHref } from "../lib/safeUrl";
import { Rings, SectionHead } from "../components/ui";
import { rs } from "../lib/responsive";

// Advisors get the same framed card as the core carousel: a thin frame, the photo in grey until
// it is pointed at (or always in colour on touch screens), and the blue diamond pin.
function Person({ p, i = 0 }) {
  const href = safeHref(p.linkedin);
  return (
    <div className="adv rv" style={{ "--i": i % 4 }}>
      <span className="adv-frame">
        <span className="adv-face">
          <img src={p.img || "/img/members.webp"} alt={p.name} loading="lazy" decoding="async" width="400" height="500" />
        </span>
        <span className="adv-pin" aria-hidden="true" />
      </span>
      <p className="lab mut">{p.role}</p>
      <h3 className="d3">
        {href ? (
          <a href={href} target="_blank" rel="noopener noreferrer" aria-label={`${p.name} on LinkedIn`}>
            {p.name} <span className="mut" aria-hidden="true">↗</span>
          </a>
        ) : (
          p.name
        )}
      </h3>
    </div>
  );
}

export default function Team() {
  useTitle("Team");
  const { team } = useSiteContent();

  return (
    <>
      <section className="ph team-hero">
        <Rings rings={5} />
        <div className="wrap" style={{ paddingTop: "clamp(24px, 4vh, 56px)", paddingBottom: "clamp(20px, 3vh, 36px)" }}>
          <div className="team-head">
            <Split as="h1" className="d1" style={{ "--i": 1 }}>
              The <span className="blue">people</span> behind it
            </Split>
            <p className="lede mut rv" style={{ "--i": 2 }}>
              Discover the passionate minds behind our innovation: the dedicated individuals who drive our community forward.
            </p>
          </div>
        </div>
        <figure className="wrap team-photo">
          <img src={TEAM_PHOTO.img} {...rs(TEAM_PHOTO.img, "(max-width: 820px) 100vw, 80vw")} alt={TEAM_PHOTO.alt || "The BMSCE ACM core team"} className="rv-img" fetchpriority="high" />
        </figure>
      </section>

      <section className="sec light">
        <div className="wrap">
          <SectionHead title={<>Faculty <span className="hl">core</span></>} lede={<>Our faculty coordinators, whose guidance and support are instrumental to the growth and success of the chapter.</>} />
          <div className="g2 fac-grid">
            {team.faculty.map((f, n) => (
              <article key={f.name} className="fac rv" style={{ "--i": n }}>
                <img src={f.img} alt={f.name} loading="lazy" />
                <div className="fac-body">
                  <p className="lab blue">{f.role}</p>
                  <h3 className="d3">{f.name}</h3>
                  {f.detail && <p className="sm mut">{f.detail}</p>}
                  <p className="fac-links">
                    {f.email && <a href={`mailto:${f.email}`}>Email ↗</a>}
                    {safeHref(f.linkedin) && (
                      <a href={safeHref(f.linkedin)} target="_blank" rel="noopener noreferrer">
                        LinkedIn ↗
                      </a>
                    )}
                  </p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <TeamCarousel
        people={team.core}
        title={
          <>
            Core <span className="blue">2026–27</span>
          </>
        }
        intro="The driving force behind every initiative. Our core team leads with passion, purpose, and a spirit of innovation."
      />

      {team.advisors.length > 0 && (
        <section className="sec light">
          <div className="wrap g2 ai-c">
            <div>
              <Split className="d2">
                Student <span className="hl">advisors</span>
              </Split>
              <p className="lede mut rv" style={{ marginTop: 24, "--i": 1 }}>
                With experience and insight, our student advisors ensure continuity and empower the next generation of leaders.
              </p>
            </div>
            <div className="g2 keep2" style={{ gap: 20 }}>
              {team.advisors.map((p, n) => (
                <Person key={p.name} p={p} i={n} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Previous cores: one screen per year, the heading on the first. */}
      {PREVIOUS_CORE.map((c, n) => (
        <section key={c.year} className="sec dark fit prev-core">
          <div className="wrap">
            {n === 0 && (
              <Split className="d2 prev-core-h">
                Previous <span className="blue">core</span>
              </Split>
            )}
            <div className="g2 ai-c prev-core-row" style={{ direction: n % 2 ? "rtl" : undefined }}>
              <img src={c.img} alt={`Core team ${c.year}`} className="ph4 rv-img batch-photo" width={c.w} height={c.h} loading="lazy" />
              <div style={{ direction: "ltr" }}>
                <Split as="p" className="d1" style={{ fontSize: "clamp(44px, min(7vw, 11vh), 104px)" }}>{c.year}</Split>
                <ul style={{ marginTop: "clamp(10px, 2vh, 20px)" }}>
                  {c.members.map(([name, role]) => (
                    <li key={name} className="sm rv" style={{ display: "flex", justifyContent: "space-between", gap: 16, padding: "clamp(8px, 1.4vh, 12px) 0", borderTop: "1px solid var(--ln-d)" }}>
                      <b>{name}</b>
                      <span className="mut" style={{ textAlign: "right" }}>{role}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </section>
      ))}
    </>
  );
}
