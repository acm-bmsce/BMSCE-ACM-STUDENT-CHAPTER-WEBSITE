import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowUpRight, Calendar, MapPin, X, ExternalLink, Clock, Users, ArrowLeft } from "lucide-react";
import eventService from "../../api/eventService";

// --- 🚀 Crisp, Professional Framer Motion Variants ---
const containerVars = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.08, delayChildren: 0.1 } },
};

const cardVars = {
  hidden: { opacity: 0, y: 15 },
  show: { 
    opacity: 1, 
    y: 0, 
    transition: { type: "tween", ease: "easeOut", duration: 0.3 }
  },
};

export default function EventPastSessions() {
  const [sessions, setSessions] = useState([]);
  const [fetchStatus, setFetchStatus] = useState("loading");
  
  // 🎯 State to control the Modal
  const [selectedEvent, setSelectedEvent] = useState(null);

  useEffect(() => {
    let isMounted = true;
    const fetchArchivePreview = async () => {
      let attempts = 0;
      while (attempts < 15 && isMounted) {
        try {
          if (attempts === 1) setFetchStatus("waking");

          // 🚀 API FIX: Passing pure numbers so we don't get the [object Object] 422 error!
          const res = await eventService.getEvents(30, 0); 
          
          if (isMounted) {
            const rawData = res.data?.events || res.data?.data || res.data;
            // Safety shield to prevent blank screens
            const data = Array.isArray(rawData) ? rawData : []; 
            const today = new Date();

            const archive = data
              .map((ev) => ({
                ...ev,
                parsedDate: new Date(ev.date || ev.startDate || Date.now()),
                tag: ev.tag || ev.categories?.[0] || "Past Event"
              }))
              .filter((ev) => ev.parsedDate < today)
              .sort((a, b) => b.parsedDate - a.parsedDate)
              .slice(0, 3);

            setSessions(archive);
            setFetchStatus("success");
          }
          return;
        } catch (e) {
          attempts++;
          await new Promise((r) => setTimeout(r, 3000));
        }
      }
      if (isMounted) setFetchStatus("error");
    };
    fetchArchivePreview();
    return () => { isMounted = false; };
  }, []);

  // Bulletproof Background Scroll Lock
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

  const placeholderImg = "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=800&q=80";

  return (
    <section className="bg-[#030303] py-32 relative overflow-hidden font-general text-white">
      
      {/* Hardware Accelerated Background Ambience */}
      <div 
        className="absolute top-0 left-0 w-full h-[400px] pointer-events-none z-0" 
        style={{ 
          background: 'radial-gradient(circle at 50% 0%, rgba(125, 212, 239, 0.06) 0%, transparent 60%)',
          transform: 'translateZ(0)' 
        }} 
      />

      <div className="max-w-7xl mx-auto px-6 lg:px-10 relative z-10">
        
        {/* Header */}
        <header className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-20 border-b border-white/10 pb-10">
          <div className="space-y-4">
            <div className="flex items-center gap-4 mb-2">
              <span className="h-px w-12 bg-[#7DD4EF]"></span>
              <span className="text-[#7DD4EF] text-[10px] font-bold uppercase tracking-[0.4em]">
                Legacy Nodes
              </span>
            </div>
            <h2 className="text-6xl md:text-8xl font-normal text-white uppercase font-bebas-neue tracking-tighter">
              Past <span className="text-transparent bg-clip-text bg-gradient-to-r from-gray-500 to-gray-700">Impact</span>
            </h2>
          </div>
          <p className="text-gray-500 max-w-sm text-sm md:text-right leading-relaxed uppercase tracking-widest text-[10px] font-bold">
            A brief look at our recent milestones. Discover the history of our technical excellence.
          </p>
        </header>

        {/* Grid Content */}
        {fetchStatus === "loading" || fetchStatus === "waking" ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 animate-pulse">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-[450px] bg-white/5 rounded-3xl border border-white/10" />
            ))}
          </div>
        ) : fetchStatus === "error" ? (
          <div className="h-[200px] flex items-center justify-center border border-dashed border-red-500/20 rounded-3xl bg-red-500/5">
            <p className="text-red-400 tracking-widest uppercase text-xs font-bold">
              Failed to load archive.
            </p>
          </div>
        ) : sessions.length > 0 ? (
          <motion.div
            variants={containerVars}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-50px" }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            {sessions.map((session) => (
              <motion.div
                key={session.id || session._id}
                variants={cardVars}
                onClick={() => setSelectedEvent(session)} 
                className="group flex flex-col bg-[#0A0A0A] border border-white/10 hover:border-[#7DD4EF]/40 rounded-3xl overflow-hidden transition-colors duration-300 hover:shadow-[0_10px_30px_rgba(125,212,239,0.1)] cursor-pointer will-change-transform"
              >
                <div className="relative h-56 w-full overflow-hidden bg-gray-900 shrink-0">
                  <img
                    src={session.image || session.imageUrl || placeholderImg}
                    loading="lazy"
                    decoding="async"
                    className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700 group-hover:scale-110"
                    alt={session.title}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0A] via-transparent to-transparent pointer-events-none" />
                </div>

                <div className="p-6 md:p-8 flex flex-col flex-1">
                  <div className="flex justify-between items-start mb-4">
                    <span className="text-[#7DD4EF] text-[9px] font-black uppercase tracking-widest border border-[#7DD4EF]/30 bg-[#7DD4EF]/10 px-3 py-1 rounded-md">
                      {session.tag}
                    </span>
                    <span className="text-gray-500 text-[10px] font-bold uppercase tracking-widest bg-white/5 px-2 py-1 rounded-md">
                      {session.parsedDate.getFullYear()}
                    </span>
                  </div>

                  <h3 className="text-2xl md:text-3xl font-normal font-bebas-neue text-white mb-3 uppercase tracking-wide group-hover:text-[#7DD4EF] transition-colors line-clamp-2">
                    {session.title}
                  </h3>
                  
                  <p className="text-gray-400 text-sm leading-relaxed line-clamp-2 mb-6 font-general">
                    {session.description}
                  </p>

                  <div className="mt-auto pt-6 border-t border-white/5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-[10px] text-gray-400 font-bold uppercase tracking-widest">
                    <div className="flex items-center gap-2">
                      <Calendar size={12} className="text-[#7DD4EF]" />
                      {session.parsedDate.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                    </div>
                    <div className="flex items-center gap-2 text-[#7DD4EF] opacity-0 group-hover:opacity-100 transition-opacity">
                      View Details <ArrowLeft size={12} className="rotate-180" />
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        ) : (
          <div className="h-[200px] flex items-center justify-center border border-dashed border-white/10 rounded-3xl">
            <p className="text-gray-500 tracking-widest uppercase text-xs font-bold">
              Archive is currently empty.
            </p>
          </div>
        )}

        <div className="mt-20 flex justify-center">
          <button
            onClick={() => (window.location.href = "/archive")}
            className="group relative flex items-center gap-4 px-10 py-5 bg-white text-black rounded-full font-normal font-bebas-neue text-2xl uppercase tracking-widest hover:bg-[#7DD4EF] transition-all duration-300 overflow-hidden shadow-[0_0_40px_rgba(255,255,255,0.1)] hover:shadow-[0_0_40px_rgba(125,212,239,0.4)]"
          >
            <span className="relative z-10 flex items-center gap-2 mt-1">
              Explore Full Archive{" "}
              <ArrowUpRight size={24} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
            </span>
            <div className="absolute inset-0 h-full w-0 bg-[#7DD4EF] transition-all duration-300 ease-out group-hover:w-full z-0" />
          </button>
        </div>
      </div>

      {/* 🎯 MODAL FIX: Bulletproof Centered & Contained Layout */}
      <AnimatePresence>
        {selectedEvent && (
          <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 sm:p-6 md:p-12">
            
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              exit={{ opacity: 0 }} 
              onClick={() => setSelectedEvent(null)} 
              className="absolute inset-0 bg-black/90 backdrop-blur-md cursor-pointer" 
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-4xl bg-[#0F0F0F] border border-white/10 rounded-[24px] md:rounded-[32px] overflow-hidden shadow-2xl z-[10000] flex flex-col md:flex-row max-h-[90vh] md:max-h-[85vh]"
            >
              
              <button 
                onClick={() => setSelectedEvent(null)} 
                className="absolute top-4 right-4 z-50 p-2.5 bg-black/40 hover:bg-white/10 text-white rounded-full transition-colors border border-white/10 backdrop-blur-md"
              >
                <X size={18} />
              </button>

              <div className="w-full md:w-2/5 h-48 md:h-auto relative shrink-0 bg-gray-900 border-b md:border-b-0 md:border-r border-white/5">
                <img 
                  src={selectedEvent.imageUrl || selectedEvent.image || placeholderImg} 
                  alt={selectedEvent.title} 
                  className="w-full h-full object-cover" 
                />
                <div className="absolute inset-0 bg-gradient-to-t md:bg-gradient-to-r from-[#0F0F0F] via-transparent to-transparent opacity-80" />
              </div>

              <div 
                className="w-full md:w-3/5 p-5 md:p-10 flex flex-col gap-5 md:gap-6 overflow-y-auto custom-scrollbar overscroll-contain flex-1 min-h-0 relative"
                onWheel={(e) => e.stopPropagation()} 
                onTouchMove={(e) => e.stopPropagation()}
              >
                
                <div className="shrink-0 min-w-0">
                  <div className="flex flex-wrap gap-2 mb-3">
                    <span className="px-3 py-1 bg-[#7DD4EF]/10 border border-[#7DD4EF]/30 text-[#7DD4EF] text-[9px] font-black uppercase tracking-widest rounded-full">
                      {selectedEvent.tag}
                    </span>
                  </div>
                  <h3 className="text-4xl md:text-5xl font-normal text-white leading-[1.1] uppercase font-bebas-neue break-words">
                    {selectedEvent.title}
                  </h3>
                </div>
                
                <div className="grid grid-cols-2 gap-4 border-y border-white/10 py-5 shrink-0 bg-white/[0.02] -mx-5 md:-mx-10 px-5 md:px-10">
                  <div className="flex flex-col gap-1 text-gray-400 min-w-0">
                    <span className="text-[#7DD4EF] font-bold text-[9px] uppercase tracking-widest flex items-center gap-1.5"><Calendar size={12}/> Date</span>
                    <span className="font-general text-sm text-white truncate">{selectedEvent.parsedDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                  </div>
                  <div className="flex flex-col gap-1 text-gray-400 min-w-0">
                    <span className="text-[#7DD4EF] font-bold text-[9px] uppercase tracking-widest flex items-center gap-1.5"><MapPin size={12}/> Location</span>
                    <span className="font-general text-sm text-white truncate">{selectedEvent.location || "BMSCE Campus"}</span>
                  </div>
                  {(selectedEvent.time || selectedEvent.duration) && (
                    <div className="flex flex-col gap-1 text-gray-400 col-span-2 mt-2 min-w-0">
                      <span className="text-[#7DD4EF] font-bold text-[9px] uppercase tracking-widest flex items-center gap-1.5"><Clock size={12}/> Time</span>
                      <span className="font-general text-sm text-white truncate">{selectedEvent.time || selectedEvent.duration}</span>
                    </div>
                  )}
                </div>

                <div className="shrink-0 min-w-0">
                  <h4 className="text-[#7DD4EF] font-bebas-neue text-xl mb-2 tracking-wide">About The Event</h4>
                  <p className="text-gray-300 text-sm leading-relaxed font-general whitespace-pre-wrap break-words">
                    {selectedEvent.fullDescription || selectedEvent.description}
                  </p>
                </div>

                {selectedEvent.outcomes && (
                  <div className="shrink-0 min-w-0">
                    <h4 className="text-[#7DD4EF] font-bebas-neue text-xl mb-2 tracking-wide">Key Outcomes</h4>
                    <div className="text-gray-300 text-sm font-general leading-relaxed bg-white/5 p-4 rounded-xl border border-white/5 break-words">
                      {Array.isArray(selectedEvent.outcomes) ? (
                        <ul className="list-disc pl-4 space-y-1.5 marker:text-[#7DD4EF]">
                          {selectedEvent.outcomes.map((outcome, idx) => (
                            <li key={idx} className="pl-1 break-words">{outcome}</li>
                          ))}
                        </ul>
                      ) : (
                        <p className="whitespace-pre-wrap break-words">{selectedEvent.outcomes}</p>
                      )}
                    </div>
                  </div>
                )}

                {selectedEvent.speakers && (
                  <div className="shrink-0 min-w-0">
                    <h4 className="text-[#7DD4EF] font-bebas-neue text-xl mb-3 tracking-wide flex items-center gap-2"><Users size={16}/> Speakers</h4>
                    <div className="text-gray-300 text-sm font-general leading-relaxed">
                      {Array.isArray(selectedEvent.speakers) ? (
                        <div className="flex flex-wrap gap-2">
                           {selectedEvent.speakers.map((speaker, idx) => (
                             <span key={idx} className="bg-white/5 border border-white/10 px-3 py-1.5 rounded-lg text-[11px] font-bold tracking-wide max-w-full truncate">
                               {speaker}
                             </span>
                           ))}
                        </div>
                      ) : (
                        <p className="break-words">{selectedEvent.speakers}</p>
                      )}
                    </div>
                  </div>
                )}

                <div className="mt-auto pt-4 flex flex-col sm:flex-row gap-3 shrink-0">
                  {selectedEvent.registrationLink || selectedEvent.recapLink ? (
                    <button 
                      onClick={() => window.open(selectedEvent.registrationLink || selectedEvent.recapLink, "_blank")}
                      className="flex-1 py-3.5 bg-[#7DD4EF] hover:bg-white text-black rounded-xl font-black uppercase text-[10px] tracking-widest transition-all duration-300 flex items-center justify-center gap-2 shadow-lg shadow-[#7DD4EF]/20"
                    >
                      View Gallery <ExternalLink size={14} />
                    </button>
                  ) : (
                    <div className="flex-1 flex items-center justify-center text-gray-500 font-bold uppercase text-[10px] tracking-widest border border-white/5 rounded-xl py-3.5 bg-white/5 text-center px-4">
                      Recap Unavailable
                    </div>
                  )}
                  
                  <button 
                    onClick={() => setSelectedEvent(null)} 
                    className="px-6 py-3.5 bg-white/5 hover:bg-white/10 text-white border border-white/10 rounded-xl font-black uppercase text-[10px] tracking-widest transition-colors"
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
    </section>
  );
}