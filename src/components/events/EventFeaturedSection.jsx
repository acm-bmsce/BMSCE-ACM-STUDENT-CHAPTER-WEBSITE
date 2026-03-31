import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Calendar, MapPin, ExternalLink, X, ArrowUpRight } from "lucide-react";
import eventService from "../../api/eventService"; 

export default function EventFeaturedSection() {
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [featuredEvents, setFeaturedEvents] = useState([]);
  const [fetchStatus, setFetchStatus] = useState("loading"); 

  const closeModal = () => setSelectedEvent(null);

  useEffect(() => {
    let isMounted = true;
    const fetchFeaturedEvents = async () => {
      let attempts = 0;
      while (attempts < 15 && isMounted) {
        try {
          if (attempts === 1) setFetchStatus("waking");
          const response = await eventService.getEvents(6, 0, true);
          if (isMounted) {
            const eventsData = response.data?.events || response.data?.data || response.data || [];
            const mappedEvents = eventsData.map(ev => ({
              id: ev._id || ev.id,
              title: ev.title || "Elite Event",
              date: ev.date || ev.startDate || "Upcoming",
              description: ev.description || "Join us for an exclusive session with industry experts.",
              image: ev.imageUrl || ev.image || "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4",
              tags: ev.tags || ev.categories || ["Premier"],
              registrationLink: ev.registrationLink || "#",
              location: ev.location || "BMSCE Campus"
            }));
            setFeaturedEvents(mappedEvents);
            setFetchStatus("success");
          }
          return; 
        } catch (error) {
          attempts++;
          await new Promise(resolve => setTimeout(resolve, 3000));
        }
      }
    };
    fetchFeaturedEvents();
    return () => { isMounted = false; };
  }, []);

  return (
    <section className="w-full py-24 px-6 bg-black relative overflow-hidden">
      {/* Background Decorative Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[500px] bg-[#7DD4EF]/5 blur-[120px] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10">
        <header className="mb-16 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-4">
            <span className="text-[#7DD4EF] font-bold tracking-[0.3em] uppercase text-xs">Flagship Experiences</span>
            <h2 className="text-5xl md:text-7xl font-black text-white tracking-tighter uppercase font-['Impact']">
              Featured <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#7DD4EF] to-blue-500">Events</span>
            </h2>
          </div>
          <p className="text-gray-500 max-w-sm text-sm md:text-right leading-relaxed font-medium">
            Discover our premier technical symposiums, hackathons, and high-impact workshops.
          </p>
        </header>

        {fetchStatus === "loading" || fetchStatus === "waking" ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-[450px] bg-white/5 rounded-3xl border border-white/10 animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {featuredEvents.map((event) => (
              <motion.div
                key={event.id}
                whileHover={{ y: -10 }}
                className="group flex flex-col bg-[#0A0A0A] border border-white/10 rounded-[32px] overflow-hidden hover:border-[#7DD4EF]/50 transition-all duration-500 shadow-2xl"
              >
                <div className="relative h-64 w-full overflow-hidden">
                  <img src={event.image} alt={event.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0A] via-transparent to-transparent" />
                  <div className="absolute top-6 left-6 flex gap-2">
                    {event.tags.map((tag, idx) => (
                      <span key={idx} className="px-4 py-1.5 bg-black/40 backdrop-blur-xl border border-white/20 text-white text-[10px] font-bold uppercase tracking-widest rounded-full">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="p-8 flex flex-col flex-grow gap-4">
                  <div className="flex items-center gap-2 text-[#7DD4EF] text-xs font-bold tracking-widest uppercase">
                    <Calendar size={14} />
                    {event.date}
                  </div>
                  <h3 className="text-2xl font-bold text-white leading-tight group-hover:text-[#7DD4EF] transition-colors">{event.title}</h3>
                  <p className="text-gray-500 text-sm leading-relaxed line-clamp-3 font-medium">{event.description}</p>
                  
                  <div className="mt-auto pt-6">
                    <button
                      onClick={(e) => { e.stopPropagation(); setSelectedEvent(event); }}
                      className="w-full py-4 bg-white/5 hover:bg-[#7DD4EF] text-white hover:text-black border border-white/10 hover:border-[#7DD4EF] rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] transition-all duration-300 flex items-center justify-center gap-2"
                    >
                      Details <ArrowUpRight size={14} />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      <AnimatePresence>
        {selectedEvent && (
          <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 md:p-8">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={closeModal} className="absolute inset-0 bg-black/95 backdrop-blur-xl cursor-pointer" />

            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-5xl bg-[#0F0F0F] border border-white/10 rounded-[40px] overflow-hidden shadow-2xl z-[10000] flex flex-col lg:flex-row max-h-[90vh]"
            >
              <button onClick={closeModal} className="absolute top-6 right-6 z-50 p-3 bg-white/5 hover:bg-white/10 text-white rounded-full transition-colors border border-white/10">
                <X size={20} />
              </button>

              <div className="w-full lg:w-1/2 h-64 lg:h-auto relative shrink-0">
                <img src={selectedEvent.image} alt={selectedEvent.title} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-r from-transparent to-[#0F0F0F] hidden lg:block" />
              </div>

              <div className="p-8 md:p-12 flex flex-col gap-6 overflow-y-auto w-full lg:w-1/2">
                <div className="flex flex-wrap gap-2">
                  {selectedEvent.tags.map((tag, idx) => (
                    <span key={idx} className="px-4 py-1.5 bg-[#7DD4EF]/10 border border-[#7DD4EF]/30 text-[#7DD4EF] text-[10px] font-black uppercase tracking-widest rounded-full">
                      {tag}
                    </span>
                  ))}
                </div>

                <h3 className="text-4xl md:text-5xl font-black text-white leading-[1.1] uppercase font-['Impact']">{selectedEvent.title}</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center gap-3 text-gray-400 font-bold text-xs uppercase tracking-wider bg-white/5 p-4 rounded-2xl border border-white/5">
                    <Calendar className="text-[#7DD4EF]" size={18} /> {selectedEvent.date}
                  </div>
                  <div className="flex items-center gap-3 text-gray-400 font-bold text-xs uppercase tracking-wider bg-white/5 p-4 rounded-2xl border border-white/5">
                    <MapPin className="text-[#7DD4EF]" size={18} /> {selectedEvent.location}
                  </div>
                </div>

                <p className="text-gray-400 text-base leading-relaxed font-medium">{selectedEvent.description}</p>

                <div className="mt-auto pt-8 flex flex-col sm:flex-row gap-4">
                  <button 
                    onClick={() => window.open(selectedEvent.registrationLink, "_blank")}
                    className="flex-1 py-5 bg-[#7DD4EF] hover:bg-[#9BE0F4] text-black rounded-2xl font-black uppercase text-xs tracking-widest transition-all duration-300 flex items-center justify-center gap-2 shadow-lg shadow-[#7DD4EF]/20"
                  >
                    Confirm Attendance <ExternalLink size={16} />
                  </button>
                  <button onClick={closeModal} className="px-8 py-5 bg-white/5 hover:bg-white/10 text-white border border-white/10 rounded-2xl font-black uppercase text-xs tracking-widest transition-colors">
                    Close
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
}