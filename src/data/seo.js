// What search engines and link previews see for each page. Used at build time (vite.config.js
// writes a ready-made HTML head for every page and event, plus sitemap.xml) and in the browser
// (lib/seo.js keeps the head right while people move between pages).
export const SITE_URL = "https://bmsce.acm.org";
export const SITE_NAME = "BMSCE ACM Student Chapter";

export const PAGES = {
  "/": {
    title: "BMSCE ACM Student Chapter | ACM at B.M.S. College of Engineering, Bengaluru",
    description:
      "BMSCE ACM is the ACM (Association for Computing Machinery) student chapter of B.M.S. College of Engineering, Bengaluru, since 2022: workshops, hackathons, talks, projects and placement stories.",
  },
  "/events": {
    title: "Events · BMSCE ACM Student Chapter",
    description:
      "Workshops, hackathons, coding contests, talks and summits run by the BMSCE ACM Student Chapter at B.M.S. College of Engineering, Bengaluru: what's coming up, and the full archive.",
  },
  "/projects": {
    title: "Projects · BMSCE ACM Student Chapter",
    description: "Projects built by members of the BMSCE ACM Student Chapter at B.M.S. College of Engineering, Bengaluru.",
  },
  "/placements": {
    title: "Placements & Insight Series · BMSCE ACM Student Chapter",
    description:
      "The Insight Series: BMSCE ACM members share how they landed their internships, jobs and university offers, batch by batch.",
  },
  "/team": {
    title: "Team · BMSCE ACM Student Chapter",
    description: "The faculty advisors, core team and advisors who run the BMSCE ACM Student Chapter at B.M.S. College of Engineering, Bengaluru.",
  },
  "/about": {
    title: "About · BMSCE ACM Student Chapter",
    description:
      "How the BMSCE ACM Student Chapter began in 2022 at B.M.S. College of Engineering, Bengaluru, what it does, and the recognition it has received from ACM India.",
  },
  "/join": {
    title: "Join · BMSCE ACM Student Chapter",
    description:
      "Become a member of the BMSCE ACM Student Chapter at B.M.S. College of Engineering, Bengaluru, with a chapter membership or a global ACM membership.",
  },
};

const clip = (s, n = 158) => {
  const t = String(s || "").replace(/\s+/g, " ").trim();
  return t.length > n ? `${t.slice(0, n - 1).replace(/\s+\S*$/, "")}…` : t;
};

/** Head details for an event's own page. */
export const eventMeta = (e) => ({
  title: `${e.title} · BMSCE ACM Student Chapter`,
  description: clip(e.description || e.fullDescription || `${e.title}, an event by the BMSCE ACM Student Chapter.`),
});
