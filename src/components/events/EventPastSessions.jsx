import { useState } from "react";
import { ArrowLeft, ArrowRight, Calendar, MapPin } from "lucide-react";

const FALLBACK_IMAGES = [
  "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=1400&q=80",
  "https://images.unsplash.com/photo-1487058792275-0ad4aaf24ca7?auto=format&fit=crop&w=1400&q=80",
  "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1400&q=80",
  "https://images.squarespace-cdn.com/content/v1/63d40fe2cbd65e16cb8098b6/1703717561610-67A1NAXA7N6Q40D9SIHG/Wikimedia_Hackathon_San_Francisco_107.jpg",
  "https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=1400&q=80",
  "https://img.freepik.com/free-photo/medium-shot-people-studying-math_23-2150444959.jpg?semt=ais_incoming&w=740&q=80",
];

const isHighRes = (url) =>
  typeof url === "string" && url.startsWith("http") && !url.includes("placehold.co");

export default function EventPastSessions({
  sessions = [],
  locationLabel = "BMSCE Campus",
}) {
  const resolvedSessions = sessions.map((session, index) => ({
    ...session,
    image: isHighRes(session.image)
      ? session.image
      : FALLBACK_IMAGES[index % FALLBACK_IMAGES.length],
  }));

  const limited = resolvedSessions.slice(0, 6);
  const pages = [limited.slice(0, 3), limited.slice(3, 6)];
  const [pageIndex, setPageIndex] = useState(0);
  const activePage = pages[pageIndex] || [];

  const [featured, ...rest] = activePage;

  return (
    <section
      style={{
        background: "#000000",
        padding: "36px 0 10px",
        fontFamily: "'General Sans', sans-serif",
      }}
    >
      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 40px" }}>

        {/* Header */}
        <div
          style={{
            display: "flex",
            alignItems: "flex-end",
            justifyContent: "space-between",
            marginBottom: 56,
            gap: 24,
            flexWrap: "wrap",
            borderBottom: "1px solid rgba(234,247,255,0.12)",
            paddingBottom: 40,
          }}
        >
          <div>
            <p
              style={{
                fontFamily: "'General Sans', sans-serif",
                fontSize: 10,
                letterSpacing: "0.35em",
                textTransform: "uppercase",
                color: "#7DD4EF",
                margin: "0 0 16px",
              }}
            >
              {locationLabel} &nbsp;/&nbsp; Archive
            </p>
            <h2
              style={{
                fontFamily: "Impact, Anton, 'Arial Black', sans-serif",
                fontSize: "clamp(48px, 6vw, 80px)",
                fontWeight: 400,
                color: "#F5F2ED",
                margin: 0,
                lineHeight: 1,
                letterSpacing: "-0.02em",
              }}
            >
              PAST
              <br />
              <span style={{ fontWeight: 700 }}>EVENTS</span>
            </h2>
          </div>

          {/* Pagination controls */}
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <button
              onClick={() => setPageIndex((p) => Math.max(0, p - 1))}
              disabled={pageIndex === 0}
              style={{
                width: 40,
                height: 40,
                border: "1px solid rgba(234,247,255,0.2)",
                background: "transparent",
                color: pageIndex === 0 ? "rgba(234,247,255,0.2)" : "#7DD4EF",
                borderRadius: 999,
                cursor: pageIndex === 0 ? "default" : "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <ArrowLeft size={14} />
            </button>
            <span
              style={{
                fontFamily: "'General Sans', sans-serif",
                fontSize: 10,
                color: "rgba(234,247,255,0.5)",
                letterSpacing: "0.2em",
                minWidth: 40,
                textAlign: "center",
              }}
            >
              {pageIndex + 1} / {pages.length}
            </span>
            <button
              onClick={() => setPageIndex((p) => Math.min(pages.length - 1, p + 1))}
              disabled={pageIndex >= pages.length - 1}
              style={{
                width: 40,
                height: 40,
                border: "1px solid rgba(234,247,255,0.2)",
                background: "transparent",
                color: pageIndex >= pages.length - 1 ? "rgba(234,247,255,0.2)" : "#7DD4EF",
                borderRadius: 999,
                cursor: pageIndex >= pages.length - 1 ? "default" : "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <ArrowRight size={14} />
            </button>
          </div>
        </div>

        {/* Magazine layout: 1 large hero + 2 secondary stacked */}
        {activePage.length > 0 && (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 360px",
              gap: 2,
              marginBottom: 2,
            }}
          >
            {/* Hero / Featured card */}
            {featured && (
              <div
                style={{
                  position: "relative",
                  overflow: "hidden",
                  cursor: "pointer",
                  minHeight: 520,
                  background: "#1A1410",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.querySelector(".hero-img").style.transform = "scale(1.04)";
                  e.currentTarget.querySelector(".hero-overlay").style.opacity = 0.75;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.querySelector(".hero-img").style.transform = "scale(1)";
                  e.currentTarget.querySelector(".hero-overlay").style.opacity = 0.55;
                }}
              >
                <img
                  className="hero-img"
                  src={featured.image}
                  alt={featured.title}
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                    position: "absolute",
                    inset: 0,
                    transition: "transform 0.6s ease",
                  }}
                />
                <div
                  className="hero-overlay"
                  style={{
                    position: "absolute",
                    inset: 0,
                    background: "linear-gradient(to top, #0E0C0A 0%, rgba(14,12,10,0.3) 60%, transparent 100%)",
                    opacity: 0.55,
                    transition: "opacity 0.4s",
                  }}
                />
                <div
                  style={{
                    position: "absolute",
                    inset: 0,
                    padding: 40,
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-between",
                  }}
                >
                  {/* Top row */}
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                    <span
                      style={{
                        fontFamily: "'General Sans', sans-serif",
                        fontSize: 9,
                        letterSpacing: "0.3em",
                        textTransform: "uppercase",
                        color: "#7DD4EF",
                        border: "1px solid rgba(125,212,239,0.35)",
                        padding: "4px 10px",
                        borderRadius: 999,
                      }}
                    >
                      {featured.tag || "Past Event"}
                    </span>

                    <div style={{ textAlign: "right" }}>
                      <p
                        style={{
                          fontFamily: "'General Sans', sans-serif",
                          fontSize: 52,
                          fontWeight: 700,
                          color: "#F5F2ED",
                          margin: 0,
                          lineHeight: 1,
                        }}
                      >
                        {featured.day}
                      </p>
                      <p
                        style={{
                          fontFamily: "'General Sans', sans-serif",
                          fontSize: 9,
                          letterSpacing: "0.3em",
                          textTransform: "uppercase",
                          color: "rgba(245,242,237,0.6)",
                          margin: "4px 0 0",
                        }}
                      >
                        {featured.month}
                      </p>
                    </div>
                  </div>

                  {/* Bottom content */}
                  <div>
                    <h3
                      style={{
                        fontFamily: "'General Sans', sans-serif",
                        fontSize: 32,
                        fontWeight: 700,
                        color: "#F5F2ED",
                        margin: "0 0 10px",
                        letterSpacing: "-0.01em",
                        lineHeight: 1.15,
                      }}
                    >
                      {featured.title}
                    </h3>
                    <p
                      style={{
                        fontFamily: "'General Sans', sans-serif",
                        fontSize: 14,
                        color: "rgba(245,242,237,0.7)",
                        margin: "0 0 20px",
                        lineHeight: 1.55,
                        maxWidth: 480,
                      }}
                    >
                      {featured.description}
                    </p>

                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 12 }}>
                      <div style={{ display: "flex", gap: 20 }}>
                        {featured.dateLabel && (
                          <span
                            style={{
                              display: "flex",
                              alignItems: "center",
                              gap: 6,
                              fontFamily: "'General Sans', sans-serif",
                              fontSize: 10,
                              color: "rgba(234,247,255,0.65)",
                              letterSpacing: "0.1em",
                            }}
                          >
                            <Calendar size={11} />
                            {featured.dateLabel}
                          </span>
                        )}
                        {featured.location && (
                          <span
                            style={{
                              display: "flex",
                              alignItems: "center",
                              gap: 6,
                              fontFamily: "'General Sans', sans-serif",
                              fontSize: 10,
                              color: "rgba(234,247,255,0.65)",
                              letterSpacing: "0.1em",
                            }}
                          >
                            <MapPin size={11} />
                            {featured.location}
                          </span>
                        )}
                      </div>
                      <button
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: 6,
                          background: "#7DD4EF",
                          color: "#000000",
                          border: "none",
                          padding: "10px 20px",
                          borderRadius: 999,
                          fontFamily: "'General Sans', sans-serif",
                          fontSize: 9,
                          letterSpacing: "0.3em",
                          textTransform: "uppercase",
                          cursor: "pointer",
                        }}
                      >
                        View Recap <ArrowRight size={10} />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Right column — two stacked smaller cards */}
            <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
              {rest.map((session, i) => (
                <div
                  key={`${session.title}-${i}`}
                  style={{
                    position: "relative",
                    overflow: "hidden",
                    flex: 1,
                    minHeight: 259,
                    background: "#1A1410",
                    cursor: "pointer",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.querySelector(".card-img").style.transform = "scale(1.05)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.querySelector(".card-img").style.transform = "scale(1)";
                  }}
                >
                  <img
                    className="card-img"
                    src={session.image}
                    alt={session.title}
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                      position: "absolute",
                      inset: 0,
                      transition: "transform 0.5s ease",
                    }}
                  />
                  <div
                    style={{
                      position: "absolute",
                      inset: 0,
                      background: "linear-gradient(to top, rgba(14,12,10,0.95) 0%, rgba(14,12,10,0.2) 60%, transparent 100%)",
                    }}
                  />
                  <div
                    style={{
                      position: "absolute",
                      inset: 0,
                      padding: 24,
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "space-between",
                    }}
                  >
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                      <span
                        style={{
                          fontFamily: "'General Sans', sans-serif",
                          fontSize: 8,
                          letterSpacing: "0.3em",
                          textTransform: "uppercase",
                          color: "#7DD4EF",
                          border: "1px solid rgba(125,212,239,0.35)",
                          padding: "3px 8px",
                          borderRadius: 999,
                        }}
                      >
                        {session.tag || "Past Event"}
                      </span>
                      <div style={{ textAlign: "right" }}>
                        <p
                          style={{
                            fontFamily: "'General Sans', sans-serif",
                            fontSize: 28,
                            fontWeight: 700,
                            color: "#F5F2ED",
                            margin: 0,
                            lineHeight: 1,
                          }}
                        >
                          {session.day}
                        </p>
                        <p
                          style={{
                            fontFamily: "'General Sans', sans-serif",
                            fontSize: 8,
                            letterSpacing: "0.3em",
                            textTransform: "uppercase",
                            color: "rgba(234,247,255,0.6)",
                            margin: "3px 0 0",
                          }}
                        >
                          {session.month}
                        </p>
                      </div>
                    </div>

                    <div>
                      <h4
                        style={{
                          fontFamily: "'General Sans', sans-serif",
                          fontSize: 18,
                          fontWeight: 700,
                          color: "#F5F2ED",
                          margin: "0 0 6px",
                          letterSpacing: "-0.01em",
                          lineHeight: 1.2,
                        }}
                      >
                        {session.title}
                      </h4>
                      <p
                        style={{
                          fontFamily: "'General Sans', sans-serif",
                          fontSize: 12,
                          color: "rgba(245,242,237,0.6)",
                          margin: "0 0 14px",
                          lineHeight: 1.5,
                        }}
                      >
                        {session.description}
                      </p>
                      <button
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: 5,
                          background: "transparent",
                          color: "#7DD4EF",
                          border: "1px solid rgba(125,212,239,0.35)",
                          padding: "7px 14px",
                          borderRadius: 999,
                          fontFamily: "'General Sans', sans-serif",
                          fontSize: 8,
                          letterSpacing: "0.3em",
                          textTransform: "uppercase",
                          cursor: "pointer",
                        }}
                      >
                        View Recap <ArrowRight size={9} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}