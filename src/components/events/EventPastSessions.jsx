import { useState, useEffect } from "react";
import { ArrowLeft, ArrowRight, Calendar, MapPin } from "lucide-react";
import eventService from "../../api/eventService";  

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
  locationLabel = "BMSCE Campus",
}) {
  const [sessions, setSessions] = useState([]);
  const [fetchStatus, setFetchStatus] = useState("loading");
  const [pageIndex, setPageIndex] = useState(0);

  useEffect(() => {
    let isMounted = true;

    const fetchPastEvents = async () => {
      let attempts = 0;
      const maxAttempts = 15;

      while (attempts < maxAttempts && isMounted) {
        try {
          if (attempts === 1) setFetchStatus("waking");

          
          const response = await eventService.getEvents(20, 0); 
          
          if (isMounted) {
            const eventsData = response.data?.events || response.data?.data || response.data || [];
            
            
            const mappedData = eventsData.map(item => {
              const eventDate = new Date(item.date || item.startDate || item.createdAt || Date.now());
              return {
                title: item.title,
                description: item.description,
                day: item.day || eventDate.getDate(),
                month: item.month || new Intl.DateTimeFormat('en-US', { month: 'short' }).format(eventDate),
                dateLabel: item.dateLabel || eventDate.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }),
                location: item.location || "BMSCE Campus",
                tag: item.tag || item.categories?.[0] || "Past Event",
                image: item.imageUrl || item.image
              };
            });

            setSessions(mappedData);
            setFetchStatus("success");
          }
          return;
        } catch (error) {
          attempts++;
          console.warn(`Server sleeping... Retrying request (${attempts}/${maxAttempts})`);
          
          if (attempts >= maxAttempts && isMounted) {
            console.error("Error fetching past events: Backend unresponsive.", error);
            setFetchStatus("error");
            return;
          }
          
          await new Promise(resolve => setTimeout(resolve, 3000));
        }
      }
    };

    fetchPastEvents();
    return () => { isMounted = false; };
  }, []);

  
  const resolvedSessions = sessions.map((session, index) => ({
    ...session,
    image: isHighRes(session.image)
      ? session.image
      : FALLBACK_IMAGES[index % FALLBACK_IMAGES.length],
  }));

  const limited = resolvedSessions.slice(0, 6);
  
  const pages = [limited.slice(0, 3), limited.slice(3, 6)].filter(page => page.length > 0);
  const activePage = pages[pageIndex] || [];
  const [featured, ...rest] = activePage;

  return (
    <section
      style={{ background: "#000000", fontFamily: "'General Sans', sans-serif" }}
      className="py-9 pb-2.5"
    >
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-10">

        {/* Header */}
        <div
          className="flex items-end justify-between mb-14 gap-6 flex-wrap pb-10"
          style={{ borderBottom: "1px solid rgba(234,247,255,0.12)" }}
        >
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
              {locationLabel}&nbsp;/&nbsp;Archive
            </p>
            <h2
              style={{
                fontFamily: "Impact, Anton, 'Arial Black', sans-serif",
                fontSize: "clamp(40px, 6vw, 80px)",
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

          
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <button
              onClick={() => setPageIndex((p) => Math.max(0, p - 1))}
              disabled={pageIndex === 0 || fetchStatus !== "success"}
              style={{
                width: 40, height: 40,
                border: "1px solid rgba(234,247,255,0.2)",
                background: "transparent",
                color: pageIndex === 0 || fetchStatus !== "success" ? "rgba(234,247,255,0.2)" : "#7DD4EF",
                borderRadius: 999,
                cursor: pageIndex === 0 || fetchStatus !== "success" ? "default" : "pointer",
                display: "flex", alignItems: "center", justifyContent: "center",
              }}
            >
              <ArrowLeft size={14} />
            </button>
            <span
              style={{
                fontSize: 10,
                color: "rgba(234,247,255,0.5)",
                letterSpacing: "0.2em",
                minWidth: 40,
                textAlign: "center",
              }}
            >
              {pages.length > 0 ? `${pageIndex + 1} / ${pages.length}` : '0 / 0'}
            </span>
            <button
              onClick={() => setPageIndex((p) => Math.min(pages.length - 1, p + 1))}
              disabled={pageIndex >= pages.length - 1 || fetchStatus !== "success"}
              style={{
                width: 40, height: 40,
                border: "1px solid rgba(234,247,255,0.2)",
                background: "transparent",
                color: pageIndex >= pages.length - 1 || fetchStatus !== "success" ? "rgba(234,247,255,0.2)" : "#7DD4EF",
                borderRadius: 999,
                cursor: pageIndex >= pages.length - 1 || fetchStatus !== "success" ? "default" : "pointer",
                display: "flex", alignItems: "center", justifyContent: "center",
              }}
            >
              <ArrowRight size={14} />
            </button>
          </div>
        </div>

        
        {fetchStatus === "loading" || fetchStatus === "waking" ? (
          <div className="flex flex-col items-center justify-center bg-[#1A1410] mb-0.5" style={{ minHeight: "clamp(320px, 40vw, 520px)" }}>
            <div className="w-10 h-10 border-4 border-[#7DD4EF] border-t-transparent rounded-full animate-spin mb-4"></div>
            <p className="text-lg text-gray-200 font-medium">
              {fetchStatus === "waking" 
                ? "Waking up the server... please hold on! ☕" 
                : "Loading Archive..."}
            </p>
          </div>
        ) : fetchStatus === "error" ? (
          <div className="flex flex-col items-center justify-center bg-[#1A1410] mb-0.5 border border-[#ff6b6b]" style={{ minHeight: "clamp(320px, 40vw, 520px)" }}>
            <p className="text-xl text-[#ff6b6b] font-medium">Failed to load past events.</p>
          </div>
        ) : activePage.length === 0 ? (
          <div className="flex flex-col items-center justify-center bg-[#1A1410] mb-0.5" style={{ minHeight: "clamp(320px, 40vw, 520px)" }}>
            <p className="text-xl text-[rgba(234,247,255,0.5)] font-medium">No past events to display.</p>
          </div>
        ) : (
          
          <div className="grid grid-cols-1 md:grid-cols-[1fr_340px] gap-0.5 mb-0.5">

            
            {featured && (
              <div
                className="group relative overflow-hidden cursor-pointer bg-[#1A1410]"
                style={{ minHeight: "clamp(320px, 40vw, 520px)" }}
              >
                <img
                  src={featured.image}
                  alt={featured.title}
                  className="w-full h-full object-cover absolute inset-0 transition-transform duration-[600ms] ease-in-out group-hover:scale-[1.04]"
                />
                <div
                  className="absolute inset-0 transition-opacity duration-400"
                  style={{
                    background: "linear-gradient(to top, #0E0C0A 0%, rgba(14,12,10,0.3) 60%, transparent 100%)",
                    opacity: 0.55,
                  }}
                />
                <div className="absolute inset-0 p-6 sm:p-10 flex flex-col justify-between">
                  <div className="flex justify-between items-start">
                    <span
                      style={{
                        fontSize: 9, letterSpacing: "0.3em", textTransform: "uppercase",
                        color: "#7DD4EF", border: "1px solid rgba(125,212,239,0.35)",
                        padding: "4px 10px", borderRadius: 999,
                      }}
                    >
                      {featured.tag || "Past Event"}
                    </span>
                    <div style={{ textAlign: "right" }}>
                      <p style={{ fontSize: 52, fontWeight: 700, color: "#F5F2ED", margin: 0, lineHeight: 1 }}>
                        {featured.day}
                      </p>
                      <p style={{ fontSize: 9, letterSpacing: "0.3em", textTransform: "uppercase", color: "rgba(245,242,237,0.6)", margin: "4px 0 0" }}>
                        {featured.month}
                      </p>
                    </div>
                  </div>

                  <div>
                    <h3
                      style={{
                        fontSize: "clamp(20px, 2.5vw, 32px)", fontWeight: 700,
                        color: "#F5F2ED", margin: "0 0 10px",
                        letterSpacing: "-0.01em", lineHeight: 1.15,
                      }}
                    >
                      {featured.title}
                    </h3>
                    <p style={{ fontSize: 14, color: "rgba(245,242,237,0.7)", margin: "0 0 20px", lineHeight: 1.55, maxWidth: 480 }}>
                      {featured.description}
                    </p>

                    <div className="flex items-center justify-between flex-wrap gap-3">
                      <div style={{ display: "flex", gap: 20, flexWrap: "wrap" }}>
                        {featured.dateLabel && (
                          <span style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 10, color: "rgba(234,247,255,0.65)", letterSpacing: "0.1em" }}>
                            <Calendar size={11} />{featured.dateLabel}
                          </span>
                        )}
                        {featured.location && (
                          <span style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 10, color: "rgba(234,247,255,0.65)", letterSpacing: "0.1em" }}>
                            <MapPin size={11} />{featured.location}
                          </span>
                        )}
                      </div>
                      <button
                        style={{
                          display: "flex", alignItems: "center", gap: 6,
                          background: "#7DD4EF", color: "#000000", border: "none",
                          padding: "10px 20px", borderRadius: 999, fontSize: 9,
                          letterSpacing: "0.3em", textTransform: "uppercase", cursor: "pointer",
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
            <div className="flex flex-col gap-0.5">
              {rest.map((session, i) => (
                <div
                  key={`${session.title}-${i}`}
                  className="group relative overflow-hidden cursor-pointer bg-[#1A1410]"
                  style={{ flex: 1, minHeight: "clamp(160px, 20vw, 259px)" }}
                >
                  <img
                    src={session.image}
                    alt={session.title}
                    className="w-full h-full object-cover absolute inset-0 transition-transform duration-500 ease-in-out group-hover:scale-[1.05]"
                  />
                  <div
                    className="absolute inset-0"
                    style={{ background: "linear-gradient(to top, rgba(14,12,10,0.95) 0%, rgba(14,12,10,0.2) 60%, transparent 100%)" }}
                  />
                  <div className="absolute inset-0 p-6 flex flex-col justify-between">
                    <div className="flex justify-between items-start">
                      <span style={{ fontSize: 8, letterSpacing: "0.3em", textTransform: "uppercase", color: "#7DD4EF", border: "1px solid rgba(125,212,239,0.35)", padding: "3px 8px", borderRadius: 999 }}>
                        {session.tag || "Past Event"}
                      </span>
                      <div style={{ textAlign: "right" }}>
                        <p style={{ fontSize: 28, fontWeight: 700, color: "#F5F2ED", margin: 0, lineHeight: 1 }}>{session.day}</p>
                        <p style={{ fontSize: 8, letterSpacing: "0.3em", textTransform: "uppercase", color: "rgba(234,247,255,0.6)", margin: "3px 0 0" }}>{session.month}</p>
                      </div>
                    </div>

                    <div>
                      <h4 style={{ fontSize: 18, fontWeight: 700, color: "#F5F2ED", margin: "0 0 6px", letterSpacing: "-0.01em", lineHeight: 1.2 }}>
                        {session.title}
                      </h4>
                      <p style={{ fontSize: 12, color: "rgba(245,242,237,0.6)", margin: "0 0 14px", lineHeight: 1.5 }}>
                        {session.description}
                      </p>
                      <button
                        style={{
                          display: "flex", alignItems: "center", gap: 5,
                          background: "transparent", color: "#7DD4EF",
                          border: "1px solid rgba(125,212,239,0.35)",
                          padding: "7px 14px", borderRadius: 999, fontSize: 8,
                          letterSpacing: "0.3em", textTransform: "uppercase", cursor: "pointer",
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