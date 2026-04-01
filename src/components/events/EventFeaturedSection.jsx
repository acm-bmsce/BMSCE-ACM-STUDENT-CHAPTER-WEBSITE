import React, { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import eventService from "../../api/eventService"; 

export default function EventFeaturedSection() {
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [featuredEvents, setFeaturedEvents] = useState([]);
  const [fetchStatus, setFetchStatus] = useState("loading"); 

  const closeModal = () => setSelectedEvent(null);

  useEffect(() => {
  if (!selectedEvent) return; // only listen when modal is open

  const handleKeyDown = (e) => {
    if (e.key === "Escape") {
      closeModal();
    }
  };

  document.addEventListener("keydown", handleKeyDown);

  return () => {
    document.removeEventListener("keydown", handleKeyDown);
  };
}, [selectedEvent]);

  useEffect(() => {
    let isMounted = true;

    const fetchFeaturedEvents = async () => {
      let attempts = 0;
      const maxAttempts = 15; 

      while (attempts < maxAttempts && isMounted) {
        try {
          if (attempts === 1) {
            setFetchStatus("waking");
          }

          // Fetch only featured events
          const response = await eventService.getEvents(6, 0, true);
          
          if (isMounted) {
            const eventsData = response.data?.events || response.data?.data || response.data || [];
            
            const mappedEvents = eventsData.map(ev => ({
              id: ev._id || ev.id,
              title: ev.title || "Untitled Event",
              date: ev.date || ev.startDate || "TBA",
              description: ev.description || "No description available.",
              image: ev.imageUrl || ev.image || "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=1600&q=80",
              tags: ev.tags || ev.categories || ["Featured"],
              registrationLink: ev.registrationLink || "#"
            }));

            setFeaturedEvents(mappedEvents);
            setFetchStatus("success");
          }
          return; 
        } catch (error) {
          attempts++;
          console.warn(`Server sleeping... Retrying request (${attempts}/${maxAttempts})`);
          
          if (attempts >= maxAttempts && isMounted) {
            setFetchStatus("error");
            return;
          }
          await new Promise(resolve => setTimeout(resolve, 3000));
        }
      }
    };

    fetchFeaturedEvents();
    return () => { isMounted = false; };
  }, []);

  return (
    <section className="w-full py-12 px-4 md:px-8 bg-black relative font-general">
      <div className="max-w-7xl mx-auto flex flex-col gap-8">
        <div className="flex items-center justify-between">
          <h2 className="text-3xl md:text-4xl font-normal text-gray-100 tracking-tight font-bebas-neue uppercase">
            FEATURED EVENTS
          </h2>
        </div>

        {fetchStatus === "loading" || fetchStatus === "waking" ? (
          <div className="flex flex-col items-center justify-center min-h-[300px] border border-gray-800 rounded-2xl bg-[#111111]">
            <div className="w-10 h-10 border-4 border-[#7DD4EF] border-t-transparent rounded-full animate-spin mb-4"></div>
            <p className="text-lg text-gray-200 font-general">
              {fetchStatus === "waking" ? "Waking up the server... ☕" : "Loading Featured Events..."}
            </p>
          </div>
        ) : fetchStatus === "error" ? (
          <div className="flex flex-col items-center justify-center min-h-[300px] border border-[#ff6b6b] rounded-2xl bg-[#111111]">
            <p className="text-xl text-[#ff6b6b] font-general">Failed to connect to server.</p>
          </div>
        ) : featuredEvents.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredEvents.map((event) => (
              <div
                key={event.id}
                className="group flex flex-col bg-[#111111] border border-gray-800 rounded-2xl overflow-hidden hover:border-gray-600 transition-all duration-300"
              >
                <div className="relative h-56 w-full overflow-hidden">
                  <img
                    src={event.image}
                    alt={event.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-in-out"
                  />
                  <div className="absolute top-4 left-4 flex gap-2">
                    {event.tags?.map((tag, idx) => (
                      <span key={idx} className="px-3 py-1 bg-black/60 backdrop-blur-md text-gray-200 text-xs font-general rounded-lg">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="p-6 md:p-8 flex flex-col flex-grow gap-4">
                  <span className="text-sm font-general text-[#7DD4EF]">{event.date}</span>
                  <h3 className="text-xl md:text-2xl font-normal text-gray-100 line-clamp-2 font-bebas-neue uppercase">{event.title}</h3>
                  <p className="text-gray-400 text-sm leading-relaxed line-clamp-3 font-general">{event.description}</p>
                  <div className="mt-auto pt-4">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedEvent(event);
                      }}
                      className="w-full md:w-auto px-6 py-3 bg-gray-800 hover:bg-gray-700 text-gray-100 rounded-full text-xs uppercase tracking-[0.3em] font-general transition-colors duration-200"
                    >
                      View Details
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center text-gray-500 py-20 font-general">No featured events found.</div>
        )}
      </div>

      {/* Modal rendered into document.body via Portal — escapes all parent transforms */}
      {typeof document !== "undefined" && createPortal(
        <AnimatePresence>
          {selectedEvent && (
            <div
              style={{
                position: "fixed",
                top: 0, left: 0, right: 0, bottom: 0,
                zIndex: 9999,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                padding: "16px",
              }}
            >
              {/* Backdrop */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={closeModal}
                style={{
                  position: "fixed",
                  top: 0, left: 0, right: 0, bottom: 0,
                  background: "rgba(0,0,0,0.85)",
                  backdropFilter: "blur(4px)",
                  cursor: "pointer",
                }}
              />

              {/* Modal — wide split layout */}
              <motion.div
                initial={{ opacity: 0, y: 40, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 20, scale: 0.95 }}
                transition={{ duration: 0.25, ease: "easeOut" }}
                style={{ position: "relative", zIndex: 10000, width: "100%", maxWidth: "56rem", maxHeight: "90vh" }}
                className="bg-[#111111] border border-gray-800 rounded-2xl overflow-hidden shadow-2xl flex flex-col md:flex-row"
              >
              {/* Close button */}
              <button
                onClick={closeModal}
                className="absolute top-4 right-4 z-50 p-2 bg-black/60 hover:bg-black/90 text-white rounded-full backdrop-blur-md transition-colors"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M18 6 6 18"/><path d="m6 6 12 12"/>
                </svg>
              </button>

              {/* LEFT — Image with date overlay */}
              <div className="relative w-full md:w-[45%] shrink-0 h-64 md:h-auto min-h-[280px]">
                <img
                  src={selectedEvent.image}
                  alt={selectedEvent.title}
                  className="w-full h-full object-cover"
                />
                {/* Dark gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

                {/* Date badge at bottom */}
                <div className="absolute bottom-5 left-5 right-5">
                  <div className="inline-flex items-center px-4 py-2 bg-black/60 backdrop-blur-md rounded-xl border border-white/10">
                    <svg className="mr-2 text-[#7DD4EF] shrink-0" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/>
                    </svg>
                    <span className="text-white text-xs font-general tracking-wide">
                      {(() => {
                        const d = new Date(selectedEvent.date);
                        if (isNaN(d.getTime())) return selectedEvent.date;
                        return d.toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" }).toUpperCase();
                      })()}
                    </span>
                  </div>
                </div>
              </div>

              {/* RIGHT — Details */}
              <div className="flex flex-col gap-5 p-7 sm:p-9 overflow-y-auto flex-1">
                {/* Tags */}
                <div className="flex flex-wrap gap-2">
                  {selectedEvent.tags?.map((tag, idx) => (
                    <span
                      key={idx}
                      className="px-3 py-1 bg-[#7DD4EF]/10 text-[#7DD4EF] text-[10px] font-general uppercase tracking-widest rounded-full border border-[#7DD4EF]/30"
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                {/* Title */}
                <h3 className="text-3xl sm:text-4xl font-normal text-white uppercase leading-tight font-bebas-neue tracking-tight">
                  {selectedEvent.title}
                </h3>

                {/* Date + Location row */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="flex items-center gap-3 px-4 py-3 bg-white/5 border border-white/10 rounded-xl">
                    <svg className="text-[#7DD4EF] shrink-0" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/>
                    </svg>
                    <span className="text-white/70 text-xs font-general">
                      {(() => {
                        const d = new Date(selectedEvent.date);
                        if (isNaN(d.getTime())) return selectedEvent.date;
                        return d.toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" }).toUpperCase();
                      })()}
                    </span>
                  </div>
                  <div className="flex items-center gap-3 px-4 py-3 bg-white/5 border border-white/10 rounded-xl">
                    <svg className="text-[#7DD4EF] shrink-0" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M12 21s-7-6.5-7-11a7 7 0 0 1 14 0c0 4.5-7 11-7 11z"/><circle cx="12" cy="10" r="2"/>
                    </svg>
                    <span className="text-white/70 text-xs font-general">
                      {selectedEvent.location || "BMSCE Campus"}
                    </span>
                  </div>
                </div>

                {/* Description */}
                <p className="text-gray-300 text-sm leading-relaxed font-general">
                  {selectedEvent.description}
                </p>

                {/* CTA Buttons */}
                <div className="mt-auto pt-2 flex flex-wrap gap-3">
                  <button
                    onClick={() => window.open(selectedEvent.registrationLink, "_blank")}
                    className="flex items-center gap-2 px-6 py-3 bg-[#7DD4EF] hover:bg-[#9BE0F4] text-black rounded-xl font-general text-xs uppercase tracking-[0.25em] transition-colors"
                  >
                    CONFIRM ATTENDANCE
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/>
                    </svg>
                  </button>
                  <button
                    onClick={closeModal}
                    className="px-6 py-3 bg-white/5 hover:bg-white/10 text-gray-300 rounded-xl font-general text-xs uppercase tracking-[0.25em] border border-white/10 transition-colors"
                  >
                    CLOSE
                  </button>
                </div>
              </div>
            </motion.div>
            </div>
          )}
        </AnimatePresence>,
        document.body
      )}
    </section>
  );
}