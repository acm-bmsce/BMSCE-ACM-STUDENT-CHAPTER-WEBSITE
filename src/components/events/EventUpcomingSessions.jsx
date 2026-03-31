import { ArrowRight, Clock, MapPin, ChevronRight } from "lucide-react";

export default function EventUpcomingSessions({
  sessions = [],
  locationLabel = "BMSCE Campus",
}) {
  return (
    <section
      style={{
        background: "#000000",
        padding: "2px 0 20px",
        fontFamily: "'General Sans', sans-serif",
      }}
    >
      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 40px" }}>
        {/* Header row */}
        <div
          style={{
            display: "flex",
            alignItems: "flex-end",
            justifyContent: "space-between",
            marginBottom: 64,
            gap: 24,
            flexWrap: "wrap",
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
              {locationLabel} &nbsp;/&nbsp; Schedule
            </p>
            <h2
              style={{
                fontFamily: "Impact, Anton, 'Arial Black', sans-serif",
                fontSize: "clamp(48px, 6vw, 80px)",
                fontWeight: 400,
                color: "#EAF7FF",
                margin: 0,
                lineHeight: 1,
                letterSpacing: "-0.02em",
              }}
            >
              UPCOMING
              <br />
              <span style={{ fontWeight: 700 }}>SESSIONS</span>
            </h2>
          </div>

          
        </div>

        {/* Divider */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 3fr",
            borderTop: "1px solid rgba(234,247,255,0.12)",
            paddingTop: 40,
            gap: 60,
          }}
        >
          {/* Left column — issue-style label */}
          <div style={{ paddingTop: 4 }}>
            <p
              style={{
                fontFamily: "'General Sans', sans-serif",
                fontSize: 9,
                letterSpacing: "0.3em",
                textTransform: "uppercase",
                color: "#7DD4EF",
                margin: "0 0 8px",
              }}
            >
              All Events
            </p>
            <p
              style={{
                fontFamily: "'General Sans', sans-serif",
                fontSize: 9,
                color: "rgba(234,247,255,0.5)",
                letterSpacing: "0.15em",
              }}
            >
              {sessions.length} upcoming
            </p>
          </div>

          {/* Right column — stacked session rows */}
          <div>
            {sessions.map((session, i) => (
              <div
                key={`${session.title}-${i}`}
                style={{
                  display: "grid",
                  gridTemplateColumns: "80px 1fr auto",
                  gap: 32,
                  alignItems: "start",
                  padding: "32px 0",
                  borderBottom: "1px solid rgba(234,247,255,0.12)",
                  transition: "all 0.2s",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = "#0F0F16";
                  e.currentTarget.style.padding = "32px 16px";
                  e.currentTarget.style.margin = "0 -16px";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = "transparent";
                  e.currentTarget.style.padding = "32px 0";
                  e.currentTarget.style.margin = "0";
                }}
              >
                {/* Date block */}
                <div style={{ flexShrink: 0 }}>
                  <p
                    style={{
                      fontFamily: "'General Sans', sans-serif",
                      fontSize: 40,
                      fontWeight: 700,
                      color: "#EAF7FF",
                      margin: 0,
                      lineHeight: 1,
                    }}
                  >
                    {session.day}
                  </p>
                  <p
                    style={{
                      fontFamily: "'General Sans', sans-serif",
                      fontSize: 9,
                      letterSpacing: "0.3em",
                      textTransform: "uppercase",
                      color: "#7DD4EF",
                      margin: "4px 0 0",
                    }}
                  >
                    {session.month}
                  </p>
                </div>

                {/* Content block */}
                <div>
                  {/* Tag */}
                  <span
                    style={{
                      display: "inline-block",
                      fontFamily: "'General Sans', sans-serif",
                      fontSize: 9,
                      letterSpacing: "0.3em",
                      textTransform: "uppercase",
                      color: "#7DD4EF",
                      border: "1px solid rgba(125,212,239,0.4)",
                      padding: "3px 8px",
                      borderRadius: 999,
                      marginBottom: 10,
                    }}
                  >
                    {session.tag || "Event"}
                  </span>

                  <h3
                    style={{
                      fontFamily: "'General Sans', sans-serif",
                      fontSize: 22,
                      fontWeight: 700,
                      color: "#EAF7FF",
                      margin: "0 0 8px",
                      letterSpacing: "-0.01em",
                    }}
                  >
                    {session.title}
                  </h3>
                  <p
                    style={{
                      fontFamily: "'General Sans', sans-serif",
                      fontSize: 14,
                      color: "rgba(234,247,255,0.6)",
                      margin: "0 0 14px",
                      lineHeight: 1.6,
                    }}
                  >
                    {session.description}
                  </p>

                  <div style={{ display: "flex", gap: 24, flexWrap: "wrap" }}>
                    {session.time && (
                      <span
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: 6,
                          fontFamily: "'General Sans', sans-serif",
                          fontSize: 10,
                          color: "rgba(234,247,255,0.6)",
                          letterSpacing: "0.1em",
                        }}
                      >
                        <Clock size={11} />
                        {session.time}
                      </span>
                    )}
                    {session.location && (
                      <span
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: 6,
                          fontFamily: "'General Sans', sans-serif",
                          fontSize: 10,
                          color: "rgba(234,247,255,0.6)",
                          letterSpacing: "0.1em",
                        }}
                      >
                        <MapPin size={11} />
                        {session.location}
                      </span>
                    )}
                  </div>
                </div>

                {/* Register CTA */}
                <button
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 6,
                    background: "transparent",
                    border: "1px solid rgba(125,212,239,0.5)",
                    color: "#7DD4EF",
                    padding: "10px 20px",
                    borderRadius: 999,
                    fontFamily: "'General Sans', sans-serif",
                    fontSize: 9,
                    letterSpacing: "0.3em",
                    textTransform: "uppercase",
                    cursor: "pointer",
                    whiteSpace: "nowrap",
                    flexShrink: 0,
                    marginTop: 8,
                  }}
                >
                  Register
                  <ChevronRight size={10} />
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}