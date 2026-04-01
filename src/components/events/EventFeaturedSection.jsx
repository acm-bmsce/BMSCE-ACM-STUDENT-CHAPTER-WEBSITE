import React, { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Calendar, MapPin, X, ExternalLink, Clock, Users, ArrowUpRight } from "lucide-react";
import eventService from "../../api/eventService"; 

export default function EventFeaturedSection() {
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [featuredEvents, setFeaturedEvents] = useState([]);
  const [fetchStatus, setFetchStatus] = useState("loading"); 

  const closeModal = () => setSelectedEvent(null);

  // Modal Keyboard Escape
  useEffect(() => {
    if (!selectedEvent) return; 
    const handleKeyDown = (e) => {
      if (e.key === "Escape") closeModal();
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [selectedEvent]);

  // 🚀 Bulletproof Background Scroll Lock (Consistent with Archive)
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

  // Data Fetching
  useEffect(() => {
    let isMounted = true;
    const fetchFeaturedEvents = async () => {
      let attempts = 0;
      const maxAttempts = 15; 

      while (attempts < maxAttempts && isMounted) {
        try {
          if (attempts === 1) setFetchStatus("waking");

          // 🚀 API FIX: Clean parameter passing
          const response = await eventService.getEvents(6, 0, true);
          
          if (isMounted) {
            const rawData = response.data?.events || response.data?.data || response.data;
            // 🚀 CRASH PREVENTION: Enforce Array
            const eventsData = Array.isArray(rawData) ? rawData : [];
            
            const mappedEvents = eventsData.map(ev => ({
              ...ev, // Keep all backend properties for the deep-dive modal
              id: ev._id || ev.id,
              title: ev.title || "Untitled Event",
              date: ev.date || ev.startDate || "TBA",
              parsedDate: new Date(ev.date || ev.startDate || Date.now()),
              description: ev.description || "No description available.",
              image: ev.imageUrl || ev.image || "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=1600&q=80",
              tag: ev.tag || ev.categories?.[0] || "Featured",
              registrationLink: ev.registrationLink || "#"
            }));

            setFeaturedEvents(mappedEvents);
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

    fetchFeaturedEvents();
    return () => { isMounted = false; };
  }, []);

  return (
    <section className="w-full py-12 px-4 md:px-8 bg-black relative font-general text-white">
      <div className="max-w-7xl mx-auto flex flex-col gap-8">
        
        {/* Section Header */}
        <div className="flex items-center justify-between">
          <h2 className="text-3xl md:text-4xl font-normal text-gray-100 tracking-tight font-bebas-neue uppercase">
            FEATURED EVENTS
          </h2>
        </div>

        {/* Loading / Error / Data States */}
        {fetchStatus === "loading" || fetchStatus === "waking" ? (
          <div className="flex flex-col items-center justify-center min-h-[300px] border border-white/10 rounded-3xl bg-[#0A0A0A]">
            <div className="w-10 h-10 border-4 border-[#7DD4EF] border-t-transparent rounded-full animate-spin mb-4"></div>
            <p className="text-sm text-[#7DD4EF] font-bold uppercase tracking-[0.3em] animate-pulse">
              {fetchStatus === "waking" ? "Waking Database..." : "Loading Featured Nodes..."}
            </p>
          </div>
        ) : fetchStatus === "error" ? (
          <div className="flex flex-col items-center justify-center min-h-[300px] border border-dashed border-red-500/20 rounded-3xl bg-red-500/5">
            <p className="text-sm text-red-400 font-bold uppercase tracking-widest">Failed to connect to server.</p>
          </div>
        ) : featuredEvents.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredEvents.map((event) => (
              <div
                key={event.id}
                onClick={() => setSelectedEvent(event)} // 🎯 Trigger Modal on entire card click
                className="group flex flex-col bg-[#0A0A0A] border border-white/10 rounded-3xl overflow-hidden hover:border-[#7DD4EF]/40 transition-colors duration-300 hover:shadow-[0_10px_30px_rgba(125,212,239,0.1)] cursor-pointer will-change-transform"
              >
                {/* Card Image */}
                <div className="relative h-56 w-full overflow-hidden shrink-0 bg-gray-900">
                  <img
                    src={event.image}
                    alt={event.title}
                    loading="lazy"
                    decoding="async"
                    className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0A] via-transparent to-transparent pointer-events-none" />
                </div>

                {/* Card Content */}
                <div className="p-6 md:p-8 flex flex-col flex-1">
                  <div className="flex justify-between items-start mb-4">
                    <span className="text-[#7DD4EF] text-[9px] font-black uppercase tracking-widest border border-[#7DD4EF]/30 bg-[#7DD4EF]/10 px-3 py-1 rounded-md">
                      {event.tag}
                    </span>
                    <span className="text-gray-500 text-[10px] font-bold uppercase tracking-widest bg-white/5 px-2 py-1 rounded-md">
                      {Number.isNaN(event.parsedDate.getTime()) ? "TBA" : event.parsedDate.getFullYear()}
                    </span>
                  </div>

                  <h3 className="text-2xl md:text-3xl font-normal font-bebas-neue text-white mb-3 uppercase tracking-wide group-hover:text-[#7DD4EF] transition-colors line-clamp-2">
                    {event.title}
                  </h3>
                  
                  <p className="text-gray-400 text-sm leading-relaxed line-clamp-2 mb-6 font-general">
                    {event.description}
                  </p>

                  <div className="mt-auto pt-6 border-t border-white/5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-[10px] text-gray-400 font-bold uppercase tracking-widest">
                    <div className="flex items-center gap-2">
                      <Calendar size={12} className="text-[#7DD4EF]" />
                      {Number.isNaN(event.parsedDate.getTime()) ? event.date : event.parsedDate.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                    </div>
                    <div className="flex items-center gap-2 text-[#7DD4EF] opacity-0 group-hover:opacity-100 transition-opacity">
                      View Details <ArrowUpRight size={14} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center text-gray-500 py-20 font-general uppercase tracking-widest text-xs border border-dashed border-white/10 rounded-3xl">
            No featured events currently active.
          </div>
        )}
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

              {/* Modal Box (Perfectly matches ArchivePage constraints) */}
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

                {/* Right Column: Deep-Dive Scrollable Content */}
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
                      <span className="text-[#7DD4EF] font-bold text-[9px] uppercase tracking-widest flex items-center gap-1.5"><Calendar size={12}/> Date</span>
                      <span className="font-general text-sm text-white truncate">
                        {Number.isNaN(selectedEvent.parsedDate.getTime()) ? selectedEvent.date : selectedEvent.parsedDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
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
                      Confirm Attendance <ExternalLink size={14} />
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