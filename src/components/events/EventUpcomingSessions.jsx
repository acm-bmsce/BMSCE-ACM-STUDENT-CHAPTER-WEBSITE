import React, { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Clock, MapPin, Ticket, CalendarPlus, Zap, ArrowRight, X, ExternalLink, Users } from "lucide-react";
import eventService from "../../api/eventService"; 

// --- 🚀 Crisp, Professional Framer Motion Variants ---
const containerVars = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.1, delayChildren: 0.1 } }
};
const itemVars = {
  hidden: { opacity: 0, x: -15 },
  show: { opacity: 1, x: 0, transition: { type: "tween", ease: "easeOut", duration: 0.3 } }
};

export default function EventUpcomingSessions({
  locationLabel = "BMSCE Campus",
}) {
  const [sessions, setSessions] = useState([]);
  const [fetchStatus, setFetchStatus] = useState("loading");
  
  // 🎯 State to control the Modal
  const [selectedEvent, setSelectedEvent] = useState(null);
  
  const today = new Date();
  const closeModal = () => setSelectedEvent(null);

  // 🚀 Bulletproof Background Scroll Lock
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

  // Modal Keyboard Escape
  useEffect(() => {
    if (!selectedEvent) return; 
    const handleKeyDown = (e) => {
      if (e.key === "Escape") closeModal();
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [selectedEvent]);

  useEffect(() => {
    let isMounted = true;

    const fetchUpcomingEvents = async () => {
      let attempts = 0;
      const maxAttempts = 15; 

      while (attempts < maxAttempts && isMounted) {
        try {
          if (attempts === 1) setFetchStatus("waking");

          const response = await eventService.getEvents(20, 0); 
          
          if (isMounted) {
            const rawData = response.data?.events || response.data?.data || response.data;
            // 🚀 CRASH PREVENTION: Enforce Array
            const eventsData = Array.isArray(rawData) ? rawData : [];
            
            const mappedData = eventsData
              .map(item => {
                const eventDate = new Date(item.date || item.startDate || item.createdAt || Date.now());
                const timeDiff = eventDate.getTime() - today.getTime();
                const daysUntil = Math.ceil(timeDiff / (1000 * 3600 * 24));
                const isSoon = daysUntil <= 3 && daysUntil >= 0;

                return {
                  ...item, // Keep backend properties for the modal
                  parsedDate: eventDate,
                  title: item.title,
                  description: item.description,
                  day: item.day || eventDate.getDate().toString().padStart(2, '0'),
                  month: item.month || new Intl.DateTimeFormat('en-US', { month: 'short' }).format(eventDate),
                  time: item.time || "TBD",
                  location: item.location || "Main Campus",
                  tag: item.tag || item.categories?.[0] || "Session",
                  image: item.imageUrl || item.image || "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=1600&q=80",
                  registrationLink: item.registrationLink || "#",
                  isSoon
                };
              })
              .filter(session => session.parsedDate >= today)
              .sort((a, b) => a.parsedDate - b.parsedDate)
              .slice(0, 10); 

            setSessions(mappedData);
            setFetchStatus("success");
          }
          return;
        } catch (error) {
          attempts++;
          if (attempts >= maxAttempts && isMounted) {
            setFetchStatus("error");
            return;
          }
          await new Promise(resolve => setTimeout(resolve, 3000));
        }
      }
    };

    fetchUpcomingEvents();
    return () => { isMounted = false; };
  }, []);

  return (
    <section className="bg-[#050505] py-24 relative overflow-hidden font-general">
      
      {/* 🚀 Hardware Accelerated Background Glow */}
      <div 
        className="absolute top-40 right-0 w-[500px] h-[500px] pointer-events-none z-0" 
        style={{ 
          background: 'radial-gradient(circle, rgba(125, 212, 239, 0.05) 0%, transparent 70%)',
          transform: 'translateZ(0)' 
        }} 
      />

      <div className="max-w-7xl mx-auto px-6 lg:px-10 relative z-10">
        
        {/* Header */}
        <header className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-20 border-b border-white/10 pb-12">
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <span className="w-8 h-[1px] bg-[#7DD4EF]"></span>
              <span className="text-[#7DD4EF] text-[10px] font-bold tracking-[0.4em] uppercase">
                {locationLabel} / Roadmap
              </span>
            </div>
            <h2 className="text-6xl md:text-8xl font-normal text-white leading-[0.85] tracking-tighter uppercase font-bebas-neue italic">
              Next <span className="text-transparent" style={{ WebkitTextStroke: "1px rgba(125,212,239,0.5)" }}>Up</span>
            </h2>
          </div>
          
          <div className="text-right hidden md:block">
            <p className="text-gray-500 text-sm font-bold uppercase tracking-widest">Active Schedule</p>
            <p className="text-white text-3xl font-normal font-bebas-neue">
              {fetchStatus === "success" ? sessions.length : "0"} <span className="text-[#7DD4EF] text-lg">NODES</span>
            </p>
          </div>
        </header>

        {/* Content Area */}
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_3.5fr] gap-10">
          
          {/* Left: Sticky Info Column */}
          <div className="hidden lg:block relative">
            <div className="sticky top-32 space-y-6">
              <p className="text-gray-500 text-xs leading-relaxed font-bold uppercase tracking-widest border-l-2 border-[#7DD4EF]/30 pl-4">
                Secure your spot in our upcoming technical sessions. Registrations are limited to ensure quality interaction.
              </p>
              
              <div className="p-6 bg-white/5 border border-white/10 rounded-2xl">
                 <Ticket size={24} className="text-[#7DD4EF] mb-4" />
                 <h4 className="text-white font-bold mb-2">Claim Your Ticket</h4>
                 <p className="text-gray-500 text-xs">Events fill up fast. Use the register links to reserve your digital pass.</p>
              </div>
            </div>
          </div>

          {/* Right: Timeline & Tickets */}
          <div className="relative">
            
            {/* Timeline Line */}
            {sessions.length > 0 && (
              <div className="absolute left-[38px] md:left-[58px] top-0 bottom-0 w-px bg-gradient-to-b from-[#7DD4EF]/50 via-white/10 to-transparent hidden sm:block" />
            )}

            {fetchStatus === "loading" || fetchStatus === "waking" ? (
              <div className="flex flex-col items-center justify-center py-32 bg-white/5 border border-white/10 rounded-3xl">
                <div className="w-10 h-10 border-4 border-[#7DD4EF] border-t-transparent rounded-full animate-spin mb-6"></div>
                <p className="text-[#7DD4EF] text-[10px] md:text-xs font-bold tracking-[0.3em] uppercase animate-pulse">
                  {fetchStatus === "waking" ? "Waking Backend Servers..." : "Syncing Future Events..."}
                </p>
              </div>
            ) : fetchStatus === "error" ? (
              <div className="py-32 text-center bg-red-900/10 border border-red-500/20 rounded-3xl">
                <p className="text-red-400 font-bold uppercase tracking-widest text-sm">Failed to connect to timeline.</p>
              </div>
            ) : sessions.length === 0 ? (
              <div className="py-32 text-center border border-dashed border-white/10 rounded-3xl">
                <p className="text-gray-500 font-bold uppercase tracking-widest text-sm">No future events scheduled.</p>
                <p className="text-gray-600 text-xs mt-2">Systems are currently on standby.</p>
              </div>
            ) : (
              <motion.div variants={containerVars} initial="hidden" animate="show" className="space-y-8">
                {sessions.map((session, i) => (
                  <motion.div key={i} variants={itemVars} className="relative sm:pl-24">
                    
                    {/* Timeline Node */}
                    <div className="absolute left-[34px] md:left-[54px] top-1/2 -translate-y-1/2 w-2.5 h-2.5 bg-[#050505] border-2 border-[#7DD4EF] rounded-full z-10 hidden sm:block shadow-[0_0_10px_rgba(125,212,239,0.5)]" />

                    {/* Digital Ticket Card */}
                    <div 
                      onClick={() => setSelectedEvent(session)} // 🎯 Trigger Modal
                      className="group flex flex-col md:flex-row bg-[#0A0A0A] border border-white/10 hover:border-[#7DD4EF]/40 rounded-3xl overflow-hidden transition-all duration-300 shadow-2xl hover:shadow-[0_20px_40px_-15px_rgba(125,212,239,0.1)] hover:-translate-y-1 cursor-pointer will-change-transform"
                    >
                      
                      {/* Left: Date Stub */}
                      <div className="flex md:flex-col justify-between md:justify-center items-center bg-white/5 md:w-32 p-6 md:p-0 border-b md:border-b-0 md:border-r border-dashed border-white/20 relative">
                        <div className="text-center">
                          <span className="block text-4xl md:text-5xl font-normal text-white font-bebas-neue">{session.day}</span>
                          <span className="block text-xs font-bold text-[#7DD4EF] uppercase tracking-widest mt-1">{session.month}</span>
                        </div>
                        <div className="hidden md:block absolute -top-3 -right-3 w-6 h-6 bg-[#050505] rounded-full border-b border-white/10" />
                        <div className="hidden md:block absolute -bottom-3 -right-3 w-6 h-6 bg-[#050505] rounded-full border-t border-white/10" />
                      </div>

                      {/* Right: Event Info */}
                      <div className="flex-1 p-6 md:p-8 flex flex-col justify-center relative">
                        
                        {/* Tags / Urgency */}
                        <div className="flex flex-wrap items-center gap-3 mb-4">
                          <span className="px-3 py-1 bg-white/10 text-white text-[9px] font-black uppercase tracking-widest rounded-md">
                            {session.tag}
                          </span>
                          {session.isSoon && (
                            <span className="flex items-center gap-1 px-3 py-1 bg-[#7DD4EF]/20 border border-[#7DD4EF]/50 text-[#7DD4EF] text-[9px] font-black uppercase tracking-widest rounded-md animate-pulse">
                              <Zap size={10} /> Happening Soon
                            </span>
                          )}
                        </div>

                        <h3 className="text-2xl md:text-3xl font-normal text-white mb-3 tracking-tight group-hover:text-[#7DD4EF] transition-colors font-bebas-neue uppercase">
                          {session.title}
                        </h3>
                        <p className="text-gray-400 text-sm leading-relaxed mb-6 line-clamp-2 max-w-2xl font-general">
                          {session.description}
                        </p>

                        {/* Metadata & Actions */}
                        <div className="mt-auto flex flex-col xl:flex-row xl:items-center justify-between gap-6 pt-6 border-t border-white/5">
                          
                          <div className="flex flex-wrap items-center gap-6 text-gray-400 text-[10px] font-bold uppercase tracking-wider">
                            <span className="flex items-center gap-2"><Clock size={14} className="text-[#7DD4EF]" /> {session.time}</span>
                            <span className="flex items-center gap-2"><MapPin size={14} className="text-[#7DD4EF]" /> {session.location}</span>
                          </div>

                          <div className="flex items-center gap-3">
                            <button 
                              onClick={(e) => {
                                e.stopPropagation(); // 🎯 Stops the modal from opening
                                window.open(session.registrationLink, "_blank");
                              }}
                              className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-8 py-3 bg-[#7DD4EF] hover:bg-white text-black font-black uppercase text-[10px] tracking-widest rounded-xl transition-all duration-300 shadow-lg shadow-[#7DD4EF]/20"
                            >
                              Reserve Seat <ArrowRight size={14} />
                            </button>
                          </div>
                          
                        </div>
                      </div>

                    </div>
                  </motion.div>
                ))}
              </motion.div>
            )}
          </div>
        </div>
      </div>

      {/* 🎯 Consistent High-End Glassmorphic Modal via Portal */}
      {typeof document !== "undefined" && createPortal(
        <AnimatePresence>
          {selectedEvent && (
            <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 sm:p-6 md:p-12 font-general text-white">
              
              {/* Backdrop */}
              <motion.div 
                initial={{ opacity: 0 }} 
                animate={{ opacity: 1 }} 
                exit={{ opacity: 0 }} 
                onClick={closeModal} 
                className="absolute inset-0 bg-black/90 backdrop-blur-md cursor-pointer" 
              />

              {/* Modal Box */}
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                transition={{ duration: 0.25, ease: "easeOut" }}
                className="relative w-full max-w-4xl bg-[#0F0F0F] border border-white/10 rounded-[24px] md:rounded-[32px] overflow-hidden shadow-2xl z-[10000] flex flex-col md:flex-row max-h-[90vh] md:max-h-[85vh]"
              >
                
                {/* Close Button */}
                <button 
                  onClick={closeModal} 
                  className="absolute top-4 right-4 z-50 p-2.5 bg-black/40 hover:bg-white/10 text-white rounded-full transition-colors border border-white/10 backdrop-blur-md"
                >
                  <X size={18} />
                </button>

                {/* Left Column: Image */}
                <div className="w-full md:w-2/5 h-48 md:h-auto relative shrink-0 bg-gray-900 border-b md:border-b-0 md:border-r border-white/5">
                  <img 
                    src={selectedEvent.image} 
                    alt={selectedEvent.title} 
                    className="w-full h-full object-cover" 
                  />
                  <div className="absolute inset-0 bg-gradient-to-t md:bg-gradient-to-r from-[#0F0F0F] via-transparent to-transparent opacity-80" />
                </div>

                {/* Right Column: Deep-Dive Content */}
                <div 
                  className="w-full md:w-3/5 p-5 md:p-10 flex flex-col gap-5 md:gap-6 overflow-y-auto custom-scrollbar overscroll-contain flex-1 min-h-0 relative"
                  onWheel={(e) => e.stopPropagation()} 
                  onTouchMove={(e) => e.stopPropagation()}
                >
                  
                  {/* Header Section */}
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
                  
                  {/* Quick Info Grid */}
                  <div className="grid grid-cols-2 gap-4 border-y border-white/10 py-5 shrink-0 bg-white/[0.02] -mx-5 md:-mx-10 px-5 md:px-10">
                    <div className="flex flex-col gap-1 text-gray-400 min-w-0">
                      <span className="text-[#7DD4EF] font-bold text-[9px] uppercase tracking-widest flex items-center gap-1.5">Date</span>
                      <span className="font-general text-sm text-white truncate">
                        {selectedEvent.parsedDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                      </span>
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

                  {/* Main Description */}
                  <div className="shrink-0 min-w-0">
                    <h4 className="text-[#7DD4EF] font-bebas-neue text-xl mb-2 tracking-wide">About The Event</h4>
                    <p className="text-gray-300 text-sm leading-relaxed font-general whitespace-pre-wrap break-words">
                      {selectedEvent.fullDescription || selectedEvent.description}
                    </p>
                  </div>

                  {/* Dynamic Outcomes */}
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

                  {/* Dynamic Speakers */}
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

                  {/* Call to Action Buttons */}
                  <div className="mt-auto pt-4 flex flex-col sm:flex-row gap-3 shrink-0">
                    <button 
                      onClick={() => window.open(selectedEvent.registrationLink, "_blank")}
                      className="flex-1 py-3.5 bg-[#7DD4EF] hover:bg-white text-black rounded-xl font-black uppercase text-[10px] tracking-widest transition-all duration-300 flex items-center justify-center gap-2 shadow-lg shadow-[#7DD4EF]/20"
                    >
                      Reserve Seat <ArrowRight size={14} />
                    </button>
                    
                    <button 
                      onClick={closeModal} 
                      className="px-6 py-3.5 bg-white/5 hover:bg-white/10 text-white border border-white/10 rounded-xl font-black uppercase text-[10px] tracking-widest transition-colors"
                    >
                      Close
                    </button>
                  </div>

                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>,
        document.body
      )}

      {/* Required Utility CSS for the Modal Scrollbar */}
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