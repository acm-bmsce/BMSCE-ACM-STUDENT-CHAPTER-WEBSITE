import { Clock, MapPin, ChevronRight } from "lucide-react";

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
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-10">

        {/* Header row */}
        <div className="flex items-end justify-between mb-16 gap-6 flex-wrap">
          <div>
            <p
              style={{
                fontSize: 10,
                letterSpacing: "0.35em",
                textTransform: "uppercase",
                color: "#7DD4EF",
                margin: "0 0 16px",
              }}
            >
              {locationLabel}&nbsp;/&nbsp;Schedule
            </p>
            <h2
              style={{
                fontFamily: "Impact, Anton, 'Arial Black', sans-serif",
                fontSize: "clamp(40px, 6vw, 80px)",
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

        {/* Two-col layout: label left, sessions right */}
        <div
          className="grid grid-cols-1 md:grid-cols-[1fr_3fr] gap-5 md:gap-[60px]"
          style={{ borderTop: "1px solid rgba(234,247,255,0.12)", paddingTop: 40 }}
        >
          {/* Left label column */}
          <div style={{ paddingTop: 4 }}>
            <p style={{ fontSize: 9, letterSpacing: "0.3em", textTransform: "uppercase", color: "#7DD4EF", margin: "0 0 8px" }}>
              All Events
            </p>
            <p style={{ fontSize: 9, color: "rgba(234,247,255,0.5)", letterSpacing: "0.15em" }}>
              {sessions.length} upcoming
            </p>
          </div>

          {/* Session rows */}
          <div>
            {sessions.map((session, i) => (
              <div
                key={`${session.title}-${i}`}
                className="group"
                style={{
                  display: "grid",
                  gridTemplateColumns: "60px 1fr",
                  gap: "16px 24px",
                  alignItems: "start",
                  padding: "24px 0",
                  borderBottom: "1px solid rgba(234,247,255,0.12)",
                  transition: "all 0.2s",
                }}
              >
                {/* Date block */}
                <div style={{ flexShrink: 0 }}>
                  <p style={{ fontSize: "clamp(28px, 3.5vw, 40px)", fontWeight: 700, color: "#EAF7FF", margin: 0, lineHeight: 1 }}>
                    {session.day}
                  </p>
                  <p style={{ fontSize: 9, letterSpacing: "0.3em", textTransform: "uppercase", color: "#7DD4EF", margin: "4px 0 0" }}>
                    {session.month}
                  </p>
                </div>

                {/* Content block — spans both cols on small, normal on medium+ */}
                <div className="col-span-1">
                  <span
                    style={{
                      display: "inline-block", fontSize: 9, letterSpacing: "0.3em",
                      textTransform: "uppercase", color: "#7DD4EF",
                      border: "1px solid rgba(125,212,239,0.4)",
                      padding: "3px 8px", borderRadius: 999, marginBottom: 10,
                    }}
                  >
                    {session.tag || "Event"}
                  </span>

                  <h3 style={{ fontSize: "clamp(18px, 2vw, 22px)", fontWeight: 700, color: "#EAF7FF", margin: "0 0 8px", letterSpacing: "-0.01em" }}>
                    {session.title}
                  </h3>
                  <p style={{ fontSize: 14, color: "rgba(234,247,255,0.6)", margin: "0 0 14px", lineHeight: 1.6 }}>
                    {session.description}
                  </p>

                  <div className="flex items-center justify-between flex-wrap gap-4">
                    <div style={{ display: "flex", gap: 24, flexWrap: "wrap" }}>
                      {session.time && (
                        <span style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 10, color: "rgba(234,247,255,0.6)", letterSpacing: "0.1em" }}>
                          <Clock size={11} />{session.time}
                        </span>
                      )}
                      {session.location && (
                        <span style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 10, color: "rgba(234,247,255,0.6)", letterSpacing: "0.1em" }}>
                          <MapPin size={11} />{session.location}
                        </span>
                      )}
                    </div>

                    {/* Register button — inline on mobile too */}
                    <button
                      style={{
                        display: "flex", alignItems: "center", gap: 6,
                        background: "transparent",
                        border: "1px solid rgba(125,212,239,0.5)",
                        color: "#7DD4EF",
                        padding: "10px 20px", borderRadius: 999,
                        fontSize: 9, letterSpacing: "0.3em",
                        textTransform: "uppercase", cursor: "pointer",
                        whiteSpace: "nowrap", flexShrink: 0,
                      }}
                    >
                      Register
                      <ChevronRight size={10} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}