import React, { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Calendar, MapPin, ArrowLeft, Loader2, X, ExternalLink, Clock, Users } from "lucide-react";
import eventService from "../api/eventService";

// --- 🚀 Crisp, Professional Framer Motion Variants ---
const gridVariants = {
  hidden: { opacity: 0 },
  show: { 
    opacity: 1, 
    transition: { staggerChildren: 0.05, delayChildren: 0.1 } 
  }
};

const cardVariants = {
  hidden: { opacity: 0, y: 15 },
  show: { 
    opacity: 1, 
    y: 0, 
    transition: { type: "tween", ease: "easeOut", duration: 0.3 }
  },
  exit: { opacity: 0, scale: 0.95, transition: { duration: 0.15 } }
};

export default function ArchivePage() {
  const [allPastEvents, setAllPastEvents] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [fetchStatus, setFetchStatus] = useState("loading"); 
  const [isSyncing, setIsSyncing] = useState(true);
  
  // State to control the Modal
  const [selectedEvent, setSelectedEvent] = useState(null);

  useEffect(() => {
    let isMounted = true;

    const fetchProgressively = async () => {
      try {
        let skip = 0;
        const limit = 9; 
        let hasMore = true;

        while (hasMore && isMounted) {
          const res = await eventService.getEvents(limit, skip);
          const data = res.data?.events || res.data?.data || res.data || [];
          
          if (data.length > 0 && isMounted) {
            const today = new Date();
            
            const pastBatch = data
              .map(ev => ({
                ...ev,
                parsedDate: new Date(ev.date || ev.startDate || Date.now()),
                // Fallback to "Event" or whatever tag the backend provides
                tag: ev.tag || "Past Event" 
              }))
              .filter(ev => ev.parsedDate < today);

            setAllPastEvents(prev => {
              const combined = [...prev, ...pastBatch];
              const uniqueEvents = Array.from(new Map(combined.map(item => [item._id || item.id, item])).values());
              return uniqueEvents.sort((a, b) => b.parsedDate - a.parsedDate);
            });
            
            setFetchStatus("success"); 
            skip += limit;
          }

          if (data.length < limit) {
            hasMore = false;
            if (isMounted) setIsSyncing(false); 
          }
        }
      } catch (e) {
        console.error("Failed to fetch archive:", e);
        if (allPastEvents.length === 0 && isMounted) setFetchStatus("error");
        if (isMounted) setIsSyncing(false);
      }
    };

    fetchProgressively();

    document.body.style.backgroundColor = '#000000';
    document.documentElement.style.backgroundColor = '#000000';

    return () => { isMounted = false; };
  }, []);

  // Lock body scroll when modal is open
  useEffect(() => {
    if (selectedEvent) {
      document.body.style.overflow = 'hidden';
      document.documentElement.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
      document.documentElement.style.overflow = 'auto';
    }
    return () => {
      document.body.style.overflow = 'auto';
      document.documentElement.style.overflow = 'auto';
    };
  }, [selectedEvent]);

  // Streamlined filter: Only cares about the Search Query now
  const filteredEvents = useMemo(() => {
    return allPastEvents.filter(ev => 
      ev.title.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [searchQuery, allPastEvents]);

  return (
    <main className="min-h-screen bg-[#030303] pt-32 pb-20 px-6 font-general overflow-x-hidden text-white">
      
      {/* Background Ambience */}
      <div className="fixed inset-0 z-0 pointer-events-none" style={{ transform: 'translateZ(0)' }}>
        <div className="absolute top-[-10%] left-[-10%] w-[50vw] h-[50vw] bg-[#7DD4EF]/5 blur-[150px] rounded-full mix-blend-screen will-change-transform" />
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        
        <header className="mb-16">
          <button 
            onClick={() => window.history.back()}
            className="flex items-center gap-2 text-gray-500 hover:text-[#7DD4EF] transition-colors mb-8 uppercase text-[10px] font-bold tracking-[0.3em]"
          >
            <ArrowLeft size={14} /> Back to Events
          </button>
          
          <h1 className="text-6xl md:text-9xl font-normal text-white font-bebas-neue uppercase leading-none tracking-tighter">
            Past <span className="text-transparent bg-clip-text bg-gradient-to-r from-gray-500 to-gray-800">Events</span>
          </h1>
          <div className="flex items-center gap-3 mt-4">
            <p className="text-gray-400 font-general uppercase tracking-widest text-xs">
              {fetchStatus === "success" ? `Showing ${allPastEvents.length} Past Events` : 'Loading Events...'}
            </p>
            {isSyncing && fetchStatus === "success" && (
              <span className="flex items-center gap-2 text-[#7DD4EF] text-[9px] uppercase tracking-widest animate-pulse">
                <Loader2 size={10} className="animate-spin" /> Syncing more...
              </span>
            )}
          </div>
        </header>

        {/* Clean, Standalone Search Bar */}
        <div className="mb-12">
          <div className="relative w-full md:w-[450px]">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
            <input 
              type="text" 
              placeholder="Search past events..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-white font-general focus:border-[#7DD4EF]/50 outline-none transition-all placeholder:text-gray-600"
            />
          </div>
        </div>

        {/* Dynamic Grid / State Handling */}
        {fetchStatus === "loading" ? (
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="flex flex-col items-center justify-center py-32"
          >
            <Loader2 className="animate-spin text-[#7DD4EF] mb-4" size={40} />
            <p className="text-[#7DD4EF] uppercase tracking-[0.3em] font-bold text-xs animate-pulse">
              Loading Archives...
            </p>
          </motion.div>
        ) : fetchStatus === "error" ? (
          <div className="py-32 text-center border border-dashed border-red-500/20 rounded-3xl bg-red-500/5">
            <p className="text-red-400 tracking-widest uppercase font-bold text-sm">Failed to load events from the database.</p>
          </div>
        ) : filteredEvents.length === 0 ? (
          <div className="py-32 text-center border border-dashed border-white/10 rounded-3xl bg-white/5">
            <p className="text-gray-500 tracking-widest uppercase font-bold text-sm">No events match your search.</p>
          </div>
        ) : (
          <AnimatePresence>
            <motion.div 
              variants={gridVariants}
              initial="hidden"
              animate="show"
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {filteredEvents.map((ev) => (
                <motion.div
                  
                  variants={cardVariants} 
                  key={ev._id || ev.id}
                  onClick={() => setSelectedEvent(ev)} 
                  className="group bg-[#0A0A0A] border border-white/10 rounded-3xl overflow-hidden hover:border-[#7DD4EF]/40 transition-colors duration-300 hover:shadow-[0_10px_30px_rgba(125,212,239,0.1)] flex flex-col will-change-transform cursor-pointer"
                >
                  <div className="h-56 overflow-hidden relative bg-gray-900 shrink-0">
                    <img 
                      src={ev.imageUrl || ev.image || "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4"} 
                      loading="lazy"          
                      decoding="async"        
                      className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700 group-hover:scale-110" 
                      alt={ev.title}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0A] via-transparent to-transparent pointer-events-none" />
                  </div>
                  
                  <div className="p-6 md:p-8 flex flex-col flex-1">
                    <div className="flex justify-between items-start mb-4">
                      {/* Premium Badge layout retained, just uses a generic tag if category is missing */}
                      <span className="text-[#7DD4EF] text-[9px] font-black uppercase tracking-widest border border-[#7DD4EF]/30 bg-[#7DD4EF]/10 px-3 py-1 rounded-md">
                        {ev.tag}
                      </span>
                      <span className="text-gray-500 text-[10px] font-bold uppercase tracking-widest bg-white/5 px-2 py-1 rounded-md">
                        {ev.parsedDate.getFullYear()}
                      </span>
                    </div>
                    
                    <h3 className="text-2xl md:text-3xl font-normal font-bebas-neue text-white mb-3 uppercase tracking-wide group-hover:text-[#7DD4EF] transition-colors line-clamp-2">
                      {ev.title}
                    </h3>
                    
                    <p className="text-gray-400 text-sm leading-relaxed line-clamp-2 mb-6 font-general">
                      {ev.description}
                    </p>
                    
                    <div className="mt-auto pt-6 border-t border-white/5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-[10px] text-gray-400 font-bold uppercase tracking-widest">
                      <div className="flex items-center gap-2">
                        <Calendar size={12} className="text-[#7DD4EF]"/> 
                        {ev.parsedDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                      </div>
                      <div className="flex items-center gap-2 text-[#7DD4EF] opacity-0 group-hover:opacity-100 transition-opacity">
                        View Details <ArrowLeft size={12} className="rotate-180" />
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </AnimatePresence>
        )}
      </div>

      {/* 🎯 High-End Glassmorphic Modal with FULL Event Details */}
      <AnimatePresence>
        {selectedEvent && (
          <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 md:p-8">
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              exit={{ opacity: 0 }} 
              onClick={() => setSelectedEvent(null)} 
              className="absolute inset-0 bg-black/90 backdrop-blur-xl cursor-pointer" 
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-5xl bg-[#0F0F0F] border border-white/10 rounded-[32px] md:rounded-[40px] overflow-hidden shadow-2xl z-[10000] flex flex-col lg:flex-row max-h-[90vh]"
            >
              <button 
                onClick={() => setSelectedEvent(null)} 
                className="absolute top-4 right-4 md:top-6 md:right-6 z-50 p-3 bg-black/40 hover:bg-white/10 text-white rounded-full transition-colors border border-white/10 backdrop-blur-md"
              >
                <X size={20} />
              </button>

              <div className="w-full lg:w-2/5 h-64 lg:h-full relative shrink-0 bg-gray-900 lg:absolute lg:left-0 lg:top-0">
                <img 
                  src={selectedEvent.imageUrl || selectedEvent.image || "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4"} 
                  alt={selectedEvent.title} 
                  className="w-full h-full object-cover" 
                />
                <div className="absolute inset-0 bg-gradient-to-r from-transparent to-[#0F0F0F] hidden lg:block" />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0F0F0F] to-transparent lg:hidden" />
              </div>

              <div className="hidden lg:block lg:w-2/5 shrink-0" />

              <div 
                className="p-6 md:p-12 flex flex-col gap-8 overflow-y-auto w-full lg:w-3/5 custom-scrollbar flex-1 min-h-0 relative z-10 overscroll-contain"
                onWheel={(e) => e.stopPropagation()} 
                onTouchMove={(e) => e.stopPropagation()}
              >
                
                <div className="shrink-0">
                  <div className="flex flex-wrap gap-2 mb-4">
                    <span className="px-4 py-1.5 bg-[#7DD4EF]/10 border border-[#7DD4EF]/30 text-[#7DD4EF] text-[10px] font-black uppercase tracking-widest rounded-full">
                      {selectedEvent.tag}
                    </span>
                  </div>
                  <h3 className="text-4xl md:text-6xl font-normal text-white leading-[1.1] uppercase font-bebas-neue">
                    {selectedEvent.title}
                  </h3>
                </div>
                
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 border-y border-white/10 py-6 shrink-0">
                  <div className="flex flex-col gap-1 text-gray-400">
                    <span className="text-[#7DD4EF] font-bold text-[9px] uppercase tracking-widest flex items-center gap-1"><Calendar size={12}/> Date</span>
                    <span className="font-general text-sm text-white">{selectedEvent.parsedDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                  </div>
                  <div className="flex flex-col gap-1 text-gray-400">
                    <span className="text-[#7DD4EF] font-bold text-[9px] uppercase tracking-widest flex items-center gap-1"><MapPin size={12}/> Location</span>
                    <span className="font-general text-sm text-white truncate">{selectedEvent.location || "BMSCE Campus"}</span>
                  </div>
                  {(selectedEvent.time || selectedEvent.duration) && (
                    <div className="flex flex-col gap-1 text-gray-400 col-span-2 md:col-span-1 mt-4 md:mt-0">
                      <span className="text-[#7DD4EF] font-bold text-[9px] uppercase tracking-widest flex items-center gap-1"><Clock size={12}/> Time</span>
                      <span className="font-general text-sm text-white">{selectedEvent.time || selectedEvent.duration}</span>
                    </div>
                  )}
                </div>

                <div className="shrink-0">
                  <h4 className="text-[#7DD4EF] font-bebas-neue text-2xl mb-3 tracking-wide">About The Event</h4>
                  <p className="text-gray-300 text-sm md:text-base leading-relaxed font-general whitespace-pre-wrap">
                    {selectedEvent.fullDescription || selectedEvent.description}
                  </p>
                </div>

                {selectedEvent.outcomes && (
                  <div className="shrink-0">
                    <h4 className="text-[#7DD4EF] font-bebas-neue text-2xl mb-3 tracking-wide">Key Outcomes</h4>
                    <div className="text-gray-300 text-sm md:text-base font-general leading-relaxed">
                      {Array.isArray(selectedEvent.outcomes) ? (
                        <ul className="list-disc pl-5 space-y-2">
                          {selectedEvent.outcomes.map((outcome, idx) => (
                            <li key={idx} className="pl-2">{outcome}</li>
                          ))}
                        </ul>
                      ) : (
                        <p className="whitespace-pre-wrap">{selectedEvent.outcomes}</p>
                      )}
                    </div>
                  </div>
                )}

                {selectedEvent.speakers && (
                  <div className="shrink-0">
                    <h4 className="text-[#7DD4EF] font-bebas-neue text-2xl mb-3 tracking-wide flex items-center gap-2"><Users size={20}/> Speakers & Guests</h4>
                    <div className="text-gray-300 text-sm md:text-base font-general leading-relaxed">
                      {Array.isArray(selectedEvent.speakers) ? (
                        <div className="flex flex-wrap gap-2">
                           {selectedEvent.speakers.map((speaker, idx) => (
                             <span key={idx} className="bg-white/5 border border-white/10 px-3 py-1.5 rounded-lg text-xs">{speaker}</span>
                           ))}
                        </div>
                      ) : (
                        <p>{selectedEvent.speakers}</p>
                      )}
                    </div>
                  </div>
                )}

                <div className="mt-auto pt-6 border-t border-white/10 flex flex-col sm:flex-row gap-4 shrink-0">
                  {selectedEvent.registrationLink || selectedEvent.recapLink ? (
                    <button 
                      onClick={() => window.open(selectedEvent.registrationLink || selectedEvent.recapLink, "_blank")}
                      className="flex-1 py-4 bg-[#7DD4EF] hover:bg-white text-black rounded-2xl font-black uppercase text-[10px] tracking-widest transition-all duration-300 flex items-center justify-center gap-2 shadow-lg shadow-[#7DD4EF]/20"
                    >
                      View Recap / Gallery <ExternalLink size={14} />
                    </button>
                  ) : (
                    <div className="flex-1 flex items-center justify-center text-gray-500 font-bold uppercase text-[10px] tracking-widest border border-white/5 rounded-2xl py-4 bg-white/5">
                      Recap Unavailable
                    </div>
                  )}
                  
                  <button 
                    onClick={() => setSelectedEvent(null)} 
                    className="px-8 py-4 bg-white/5 hover:bg-white/10 text-white border border-white/10 rounded-2xl font-black uppercase text-[10px] tracking-widest transition-colors"
                  >
                    Close
                  </button>
                </div>

              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <style dangerouslySetInnerHTML={{__html: `
        .custom-scrollbar { -webkit-overflow-scrolling: touch; }
        .custom-scrollbar::-webkit-scrollbar { width: 6px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.1); border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: rgba(255,255,255,0.2); }
      `}} />
    </main>
  );
}