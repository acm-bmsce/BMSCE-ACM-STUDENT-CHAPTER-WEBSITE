import { CHAPTER, MEMBERSHIP, WHY_JOIN } from "../data/site";
import useTitle from "../lib/useTitle";
import Split from "../components/Split";
import { PageHero, SectionHead } from "../components/ui";
import { rs } from "../lib/responsive";

export default function Join() {
  useTitle("Join");
  return (
    <>
      <PageHero
        img="/img/orient-team.webp"
        imgAlt="The BMSCE ACM team on stage at Orientation 2026"
        imgStyle={{ objectPosition: "50% 55%" }}
        title={
          <>
            Join the <span className="blue">chapter</span>
          </>
        }
        lede={<>Level up by becoming a member of the BMSCE ACM Student Chapter community.</>}
      >
        <div className="rv" style={{ display: "flex", gap: 10, flexWrap: "wrap", marginTop: 32, "--i": 3 }}>
          <a className="btn" href={CHAPTER.forms.chapter} target="_blank" rel="noopener noreferrer">
            Chapter membership <span className="ar">→</span>
          </a>
          <a className="btn o" href={CHAPTER.forms.global} target="_blank" rel="noopener noreferrer">
            Global membership <span className="ar">→</span>
          </a>
        </div>
      </PageHero>

      <section className="sec light fit why">
        <div className="wrap">
          <SectionHead title={<>Why join <span className="hl">our network?</span></>} lede={<>Whether you’re in Computer Science, Electronics, Mechanical or Civil, everyone is welcome to innovate with us.</>} />
          <ol className="cells g4 one-m" style={{ gap: 0 }}>
            {WHY_JOIN.map((w, n) => (
              <li key={w.title} className="rv" style={{ "--i": n % 4 }}>
                <p className="d2 why-n">{String(n + 1).padStart(2, "0")}</p>
                <h3 className="d3" style={{ fontSize: 20, marginTop: 16 }}>{w.title}</h3>
                <p className="sm mut" style={{ marginTop: 8 }}>{w.text}</p>
              </li>
            ))}
            <li style={{ padding: 0 }} aria-hidden="true">
              <img src="/img/team-acm-letters.webp" {...rs("/img/team-acm-letters.webp")} alt="BMSCE ACM members together behind big A, C and M letters" className="ph4 rv-img" style={{ height: "100%", minHeight: 260, objectFit: "cover" }} loading="lazy" />
            </li>
          </ol>
        </div>
      </section>

      <section className="sec dark fit">
        <div className="wrap">
          <div className="sh">
            <Split className="d2">
              Membership <span className="blue">options</span>
            </Split>
            <p className="lede mut rv" style={{ "--i": 1 }}>
              Start with the chapter membership; ACM Global opens the worldwide ACM network on top of everything the chapter offers.
            </p>
          </div>
          <div className="gm gm-ch rv">
            <div className="gm-head">
              <h3 className="d2">Chapter</h3>
              <p className="sm mut">Everything the BMSCE ACM Student Chapter runs on campus.</p>
              <a className="btn" href={CHAPTER.forms.chapter} target="_blank" rel="noopener noreferrer">
                Get Chapter membership <span className="ar">→</span>
              </a>
            </div>
            <div>
              <p className="lab blue gm-k">With the chapter</p>
              <ul className="gm-list hi">
                {MEMBERSHIP.chapter.map(([title, text]) => (
                  <li key={title}>
                    <span className="gm-dia" aria-hidden="true" />
                    <span>
                      <b>{title}</b>
                      <span className="sm mut">{text}</span>
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      <section className="sec dark fit">
        <div className="wrap">
          <div className="gm rv">
            <div className="gm-head">
              <h3 className="d2">ACM Global</h3>
              <p className="sm mut">Every chapter benefit, plus the world&rsquo;s largest computing society.</p>
              <a className="btn" href={CHAPTER.forms.global} target="_blank" rel="noopener noreferrer">
                Get Global membership <span className="ar">→</span>
              </a>
            </div>
            <div>
              <p className="lab blue gm-k">Only with Global</p>
              <ul className="gm-list hi">
                {MEMBERSHIP.global.map(([title, text]) => (
                  <li key={title}>
                    <span className="gm-dia" aria-hidden="true" />
                    <span>
                      <b>{title}</b>
                      <span className="sm mut">{text}</span>
                    </span>
                  </li>
                ))}
              </ul>
              <p className="lab mut gm-k gm-also">Also included: every chapter benefit</p>
              <ul className="gm-list gm-mini">
                {MEMBERSHIP.chapter.map(([title]) => (
                  <li key={title}>
                    <span className="gm-dia" aria-hidden="true" />
                    <b>{title}</b>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
