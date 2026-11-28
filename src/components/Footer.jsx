import { Link } from "react-router-dom";
import { CHAPTER, SOCIALS } from "../data/site";
import { scrollToTop } from "./SmoothScroll";
import Split from "./Split";

const ICONS = {
  Instagram: (
    <>
      <rect x="2" y="2" width="20" height="20" rx="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37zM17.5 6.5h.01" />
    </>
  ),
  LinkedIn: (
    <>
      <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-4 0v7h-4v-7a6 6 0 0 1 6-6z" />
      <rect x="2" y="9" width="4" height="12" />
      <circle cx="4" cy="4" r="2" />
    </>
  ),
  YouTube: (
    <>
      <path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.33z" />
      <path d="m9.75 15.02 5.75-3.27-5.75-3.27z" />
    </>
  ),
  GitHub: (
    <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22" />
  ),
};

export function SocialIcons({ style }) {
  return (
    <div className="soc" style={style}>
      {SOCIALS.map((s) => (
        <a key={s.label} href={s.href} target="_blank" rel="noopener noreferrer" aria-label={`Follow BMSCE ACM on ${s.label}`}>
          <svg viewBox="0 0 24 24" aria-hidden="true">
            {ICONS[s.label]}
          </svg>
        </a>
      ))}
    </div>
  );
}

export default function Footer() {
  return (
    <footer className="ftr">
      {/* Closing call to action, after the old site's: a night sky with a blue glow rising
          from the horizon; the words reveal as it scrolls in. */}
      <section className="ftr-cta" aria-labelledby="ftr-cta-t">
        <div className="ftr-cta-in">
          <p className="ftr-cta-k rv">Join BMSCE ACM Student Chapter</p>
          <Split as="h2" className="ftr-cta-t" id="ftr-cta-t" style={{ "--i": 1 }}>
            Let’s build the
            <br />
            new era of
            <br />
            computing together
          </Split>
          <img className="ftr-cta-logo rv" style={{ "--i": 2 }} src="/img/logo-mark.webp" alt="BMSCE ACM Student Chapter" width="168" height="76" loading="lazy" />
          <div className="ftr-cta-act rv" style={{ "--i": 3 }}>
            <a className="btn" href={`mailto:${CHAPTER.email}`}>
              Contact us <span className="ar">→</span>
            </a>
            <Link className="btn o" to="/join">
              Become a member
            </Link>
          </div>
        </div>
      </section>

      <div className="wrap ftr-c">
        <div className="ftr-brand">
          <img src="/img/logo-mark.webp" alt="BMSCE ACM Student Chapter" className="nobg" style={{ height: 44, width: "auto" }} loading="lazy" />
          <p className="sm mut">A student-led community for computing, technology and collaboration at B.M.S. College of Engineering, Bengaluru.</p>
          <SocialIcons />
        </div>
        <nav aria-label="Footer">
          <p className="lab mut">Explore</p>
          <ul className="ftr-list">
            <li><Link to="/events">Events</Link></li>
            <li><Link to="/projects">Projects</Link></li>
            <li><Link to="/placements">Placements</Link></li>
            <li><Link to="/team">Team</Link></li>
            <li><Link to="/about">About Us</Link></li>
          </ul>
        </nav>
        <div>
          <p className="lab mut">Members</p>
          <ul className="ftr-list">
            <li><Link to="/join">Join us</Link></li>
          </ul>
        </div>
        <div>
          <p className="lab mut">Visit</p>
          <address className="ftr-addr">
            {CHAPTER.address.map((line) => (
              <span key={line}>{line}</span>
            ))}
          </address>
          <a className="ftr-mail" href={`mailto:${CHAPTER.email}`}>
            {CHAPTER.email}
          </a>
        </div>
      </div>

      <div className="wrap ftr-bar">
        <span>© {new Date().getFullYear()} BMSCE ACM Student Chapter</span>
        <span>Inaugurated {CHAPTER.inaugurated} · Bengaluru</span>
        <button type="button" className="ftr-top" onClick={() => scrollToTop(false)}>
          Back to top <span aria-hidden="true">↑</span>
        </button>
      </div>

      {/* The sign-off: the chapter's name across the full width, fading into the page edge. */}
      <div className="ftr-mark-w" aria-hidden="true">
        <p className="ftr-mark">BMSCE ACM</p>
      </div>
    </footer>
  );
}
