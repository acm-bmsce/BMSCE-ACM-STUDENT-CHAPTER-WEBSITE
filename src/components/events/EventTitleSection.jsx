import AnimatedTitle from "../AnimatedTitle";
import mockData from "../../../mock_events.json";

const fallbackImages = {
  primary:
    "https://cdn.prod.website-files.com/64ad227a3e66387fc5d89320/65cc5760a73d6666440d87e3_seminars-training-header.jpg",
  secondary: "https://start.docuware.com/hubfs/Cover%20data%20m.jpg",
  tertiary:
    "https://fptsoftware.com/-/media/project/fpt-software/fso/blog/hp-content/1/microchip-implants-in-healthcare-when-fiction-comes-to-life.jpg?modified=20231014083845",
};

const fallbackStats = [
  { value: "500+", label: "Active Members" },
  { value: "16+", label: "Years Running" },
  { value: "40+", label: "Events per Year" },
];

const fallbackPillars = [
  {
    heading: "Technical Excellence",
    body: "From DSA to competitive programming, we sharpen the skills that matter.",
  },
  {
    heading: "Industry Connect",
    body: "Regular talks with engineers at FAANG, startups, and research labs across India.",
  },
  {
    heading: "Build - Ship - Repeat",
    body: "Hackathons, open-source sprints, and project showcases every semester.",
  },
];

const ICONS = [
  (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <path
        d="M2 4h12M2 8h8M2 12h5"
        stroke="currentColor"
        strokeWidth="1.2"
        strokeLinecap="round"
      />
    </svg>
  ),
  (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <circle cx="8" cy="5" r="2.5" stroke="currentColor" strokeWidth="1.2" />
      <path
        d="M2 13c0-2.8 2.7-5 6-5s6 2.2 6 5"
        stroke="currentColor"
        strokeWidth="1.2"
        strokeLinecap="round"
      />
    </svg>
  ),
  (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <rect x="2" y="2" width="5" height="5" rx="1" stroke="currentColor" strokeWidth="1.2" />
      <rect x="9" y="2" width="5" height="5" rx="1" stroke="currentColor" strokeWidth="1.2" />
      <rect x="2" y="9" width="5" height="5" rx="1" stroke="currentColor" strokeWidth="1.2" />
      <rect x="9" y="9" width="5" height="5" rx="1" stroke="currentColor" strokeWidth="1.2" />
    </svg>
  ),
];

function ExternalLink() {
  return (
    <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
      <path
        d="M5 2H2v8h8V7M7 2h3v3M10 2L5.5 6.5"
        stroke="currentColor"
        strokeWidth="1.15"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export default function EventTitleSection({ featured, sectionTitle = "EVENTS" }) {
  const pageData = mockData?.eventPage || {};
  const images = pageData.featuredImages || fallbackImages;
  const stats = pageData.stats || fallbackStats;
  const pillars = pageData.pillars || fallbackPillars;

  const img1 = images.primary || fallbackImages.primary;
  const img2 = images.secondary || fallbackImages.secondary;
  const img3 = images.tertiary || fallbackImages.tertiary;

  const { title, registrationLink } = featured || {};

  return (
    <section className="relative overflow-hidden pb-14 pt-12 bg-black">
      <div className="mx-auto max-w-7xl px-6">
        <AnimatedTitle
          title={sectionTitle}
          containerClass="text-center !text-white !mb-6 font-['Impact']"
        />
      </div>

      <div className="mx-auto mt-6 max-w-7xl px-6">
        <div className="grid gap-0 overflow-hidden rounded-2xl border border-white/[0.08] bg-black lg:grid-cols-[1.1fr_0.9fr]">
          <div className="grid gap-0 border-r border-white/[0.08] lg:grid-rows-[1.5fr_1fr]">
            <div className="relative overflow-hidden" style={{ minHeight: "280px" }}>
              <img
                src={img1}
                alt={title || "Featured Event"}
                className="h-full w-full object-cover transition duration-700 hover:scale-[1.02]"
                onError={(e) => {
                  e.currentTarget.src = "https://via.placeholder.com/800x600?text=Image+Load+Failed";
                }}
              />

              <div className="absolute left-5 top-5">
                
              </div>
            </div>

            <div className="grid grid-cols-2 border-t border-white/[0.08]">
              <div
                className="relative overflow-hidden border-r border-white/[0.08]"
                style={{ minHeight: "160px" }}
              >
                <img
                  src={img2}
                  alt="Highlight 1"
                  className="h-full w-full object-cover transition duration-700 hover:scale-[1.03]"
                />
              </div>
              <div className="relative overflow-hidden" style={{ minHeight: "160px" }}>
                <img
                  src={img3}
                  alt="Highlight 2"
                  className="h-full w-full object-cover transition duration-700 hover:scale-[1.03]"
                />
              </div>
            </div>
          </div>

          <div className="flex flex-col bg-black">
            <div className="border-b border-white/[0.08] px-8 py-8">
              <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-[#7DD4EF]/30 bg-[#7DD4EF]/10 px-3 py-1 text-[9px] font-bold uppercase tracking-[0.28em] text-[#7DD4EF]">
                <span className="h-1.5 w-1.5 rounded-full bg-[#7DD4EF]" />
                Student Chapter - Est. 2008
              </div>
 
              <h2 className="mt-1 text-[2.6rem] font-extrabold leading-[1.0] tracking-tight text-white">
                BMSCE
                <br />
                <span style={{ color: "#7DD4EF" }}>ACM</span>
              </h2>

              <p className="mt-4 text-sm leading-relaxed text-white/55 max-w-xs">
                The student chapter of the Association for Computing Machinery at BMS College of
                Engineering, Bengaluru - building the next generation of technologists since 2008.
              </p>
            </div>

            <div className="grid grid-cols-4 border-b border-white/[0.08]">
              {stats.map(({ value, label }, i) => (
                <div
                  key={`${label}-${i}`}
                  className={`flex flex-col items-center justify-center py-5 gap-0.5 ${
                    i < stats.length - 1 ? "border-r border-white/[0.08]" : ""
                  }`}
                >
                  <span className="text-xl font-bold tracking-tight text-white">{value}</span>
                  <span className="text-[9px] font-medium uppercase tracking-[0.15em] text-white/35 text-center">
                    {label}
                  </span>
                </div>
              ))}
            </div>

            <div className="flex flex-col divide-y divide-white/[0.06] flex-1">
              {pillars.map(({ heading, body }, index) => (
                <div key={heading} className="flex items-start gap-4 px-8 py-5">
                  <div className="mt-0.5 flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg border border-white/10 bg-white/5 text-[#7DD4EF]">
                    {ICONS[index % ICONS.length]}
                  </div>
                  <div>
                    <p className="text-[13px] font-semibold text-white/90 tracking-tight">
                      {heading}
                    </p>
                    <p className="mt-0.5 text-xs leading-relaxed text-white/45">{body}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="border-t border-white/[0.08] px-8 py-6 flex items-center gap-3">
              
              <div className="ml-auto flex-shrink-0">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg border border-[#7DD4EF]/25 bg-[#7DD4EF]/10">
                  <span className="text-[11px] font-black text-[#7DD4EF] tracking-tight">ACM</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}