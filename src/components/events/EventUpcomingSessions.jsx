import React, { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";

import { Clock, MapPin, Ticket, CalendarPlus, Zap, ArrowRight, X, ExternalLink, Users, ChevronDown, ChevronUp, Camera, Maximize, ChevronLeft, ChevronRight } from "lucide-react";
import eventService from "../../api/eventService"; 


const ExpandableText = ({ text }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const maxLength = 250; 

  if (!text) return null;
  const isLong = text.length > maxLength;

  return (
    <div className="shrink-0 min-w-0 mb-8">
      <h4 className="text-white font-bebas-neue text-2xl mb-4 tracking-wide uppercase">About The Event</h4>
      <motion.div layout>
        <p className="text-gray-400 text-sm md:text-base leading-loose font-general whitespace-pre-wrap break-words">
          {isExpanded || !isLong ? text : `${text.slice(0, maxLength)}...`}
        </p>
      </motion.div>
      
      {isLong && (
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="mt-4 flex items-center gap-1.5 text-[#7DD4EF] text-[10px] font-bold uppercase tracking-widest hover:text-white transition-colors"
        >
          {isExpanded ? (
            <>View Less <ChevronUp size={12} /></>
          ) : (
            <>View More <ChevronDown size={12} /></>
          )}
        </button>
      )}
    </div>
  );
};


const containerVars = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.1, delayChildren: 0.1 } }
};
const itemVars = {
  hidden: { opacity: 0, x: -15 },
  show: { opacity: 1, x: 0, transition: { type: "tween", ease: "easeOut", duration: 0.3 } }
};
const lightboxVars = {
  hidden: { opacity: 0, scale: 0.95 },
  show: { opacity: 1, scale: 1, transition: { duration: 0.3, ease: "easeOut" } },
  exit: { opacity: 0, scale: 0.95, transition: { duration: 0.2, ease: "easeIn" } }
};

export default function EventUpcomingSessions({
  locationLabel = "BMSCE Campus",
}) {
  const [sessions, setSessions] = useState([]);
  const [fetchStatus, setFetchStatus] = useState("loading");
  
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [fullscreenPhotoIndex, setFullscreenPhotoIndex] = useState(null);
  
  const today = new Date();
  const closeModal = () => {
    setSelectedEvent(null);
    setFullscreenPhotoIndex(null);
  };
  const closeLightbox = () => setFullscreenPhotoIndex(null);

  
  const galleryPhotos = selectedEvent ? (selectedEvent.gallery || selectedEvent.images || selectedEvent.photos || []) : [];

  
  const showPrevPhoto = (e) => {
    e.stopPropagation(); 
    setFullscreenPhotoIndex((prev) => (prev > 0 ? prev - 1 : galleryPhotos.length - 1));
  };
  const showNextPhoto = (e) => {
    e.stopPropagation(); 
    setFullscreenPhotoIndex((prev) => (prev < galleryPhotos.length - 1 ? prev + 1 : 0));
  };

  
  useEffect(() => {
    if (selectedEvent || fullscreenPhotoIndex !== null) {
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
  }, [selectedEvent, fullscreenPhotoIndex]);

  
  useEffect(() => {
    if (!selectedEvent) return; 
    const handleKeyDown = (e) => {
      if (fullscreenPhotoIndex !== null) {
        if (e.key === "Escape") closeLightbox();
        if (e.key === "ArrowLeft") showPrevPhoto(e);
        if (e.key === "ArrowRight") showNextPhoto(e);
      } else {
        if (e.key === "Escape") closeModal();
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [selectedEvent, fullscreenPhotoIndex, galleryPhotos.length]);

  useEffect(() => {
    let isMounted = true;
    const fetchUpcomingEvents = async () => {
      let attempts = 0;
      while (attempts < 15 && isMounted) {
        try {
          if (attempts === 1) setFetchStatus("waking");
          const response = await eventService.getEvents(20, 0); 
          if (isMounted) {
            const rawData = response.data?.events || response.data?.data || response.data;
            const eventsData = Array.isArray(rawData) ? rawData : [];
            const mappedData = eventsData
              .map(item => {
                const eventDate = new Date(item.date || item.startDate || item.createdAt || Date.now());
                const timeDiff = eventDate.getTime() - today.getTime();
                const daysUntil = Math.ceil(timeDiff / (1000 * 3600 * 24));
                const isSoon = daysUntil <= 3 && daysUntil >= 0;
                return {
                  ...item, 
                  parsedDate: eventDate,
                  day: eventDate.getDate().toString().padStart(2, '0'),
                  month: new Intl.DateTimeFormat('en-US', { month: 'short' }).format(eventDate),
                  time: item.time || "TBD",
                  location: item.location || "Main Campus",
                  tag: item.tag || item.categories?.[0] || "Session",
                  image: item.imageUrl || item.image || "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=1600&q=80",
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
          if (attempts >= 15 && isMounted) {
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
      <div 
        className="absolute top-40 right-0 w-[500px] h-[500px] pointer-events-none z-0" 
        style={{ background: 'radial-gradient(circle, rgba(125, 212, 239, 0.05) 0%, transparent 70%)', transform: 'translateZ(0)' }} 
      />

      <div className="max-w-7xl mx-auto px-6 lg:px-10 relative z-10">
        <header className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-20 border-b border-white/10 pb-12">
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <span className="w-8 h-[1px] bg-[#7DD4EF]"></span>
              <span className="text-[#7DD4EF] text-[10px] font-bold tracking-[0.4em] uppercase">{locationLabel} / Roadmap</span>
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

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_3.5fr] gap-10">
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

          <div className="relative">
            {sessions.length > 0 && <div className="absolute left-[38px] md:left-[58px] top-0 bottom-0 w-px bg-gradient-to-b from-[#7DD4EF]/50 via-white/10 to-transparent hidden sm:block" />}
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
              </div>
            ) : (
              <motion.div variants={containerVars} initial="hidden" animate="show" className="space-y-8">
                {sessions.map((session, i) => (
                  <motion.div key={i} variants={itemVars} className="relative sm:pl-24">
                    <div className="absolute left-[34px] md:left-[54px] top-1/2 -translate-y-1/2 w-2.5 h-2.5 bg-[#050505] border-2 border-[#7DD4EF] rounded-full z-10 hidden sm:block shadow-[0_0_10px_rgba(125,212,239,0.5)]" />
                    <div 
                      onClick={() => setSelectedEvent(session)} 
                      className="group flex flex-col md:flex-row bg-[#0A0A0A] border border-white/10 hover:border-[#7DD4EF]/40 rounded-3xl overflow-hidden transition-all duration-300 shadow-2xl hover:shadow-[0_20px_40px_-15px_rgba(125,212,239,0.1)] hover:-translate-y-1 cursor-pointer will-change-transform"
                    >
                      
                      <div className="flex md:flex-col justify-between md:justify-center items-center bg-white/5 md:w-32 p-6 md:p-0 border-b md:border-b-0 md:border-r border-dashed border-white/20 relative grayscale-0 group-hover:grayscale transition-all duration-700">
                        <div className="text-center">
                          <span className="block text-4xl md:text-5xl font-normal text-white font-bebas-neue">{session.day}</span>
                          <span className="block text-xs font-bold text-[#7DD4EF] uppercase tracking-widest mt-1">{session.month}</span>
                        </div>
                      </div>
                      <div className="flex-1 p-6 md:p-8 flex flex-col justify-center relative">
                        <div className="flex flex-wrap items-center gap-3 mb-4">
                          <span className="px-3 py-1 bg-white/10 text-white text-[9px] font-bold uppercase tracking-widest rounded-md">{session.tag}</span>
                          {session.isSoon && <span className="flex items-center gap-1 px-3 py-1 bg-[#7DD4EF]/20 border border-[#7DD4EF]/50 text-[#7DD4EF] text-[9px] font-black uppercase tracking-widest rounded-md animate-pulse"><Zap size={10} /> Happening Soon</span>}
                        </div>
                        <h3 className="text-2xl md:text-3xl font-normal text-white mb-3 group-hover:text-[#7DD4EF] transition-colors font-bebas-neue uppercase">{session.title}</h3>
                        <p className="text-gray-400 text-sm leading-relaxed mb-6 line-clamp-2 max-w-2xl font-general">{session.description}</p>
                        <div className="mt-auto flex flex-col xl:flex-row xl:items-center justify-between gap-6 pt-6 border-t border-white/5">
                          <div className="flex flex-wrap items-center gap-6 text-gray-400 text-[10px] font-bold uppercase tracking-wider">
                            <span className="flex items-center gap-2"><Clock size={14} className="text-[#7DD4EF]" /> {session.time}</span>
                            <span className="flex items-center gap-2"><MapPin size={14} className="text-[#7DD4EF]" /> {session.location}</span>
                          </div>
                          <div className="flex items-center gap-3">
                            <button onClick={(e) => { e.stopPropagation(); window.open(session.registrationLink, "_blank"); }} className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-8 py-3 bg-[#7DD4EF] hover:bg-white text-black font-black uppercase text-[10px] tracking-widest rounded-xl transition-all duration-300 shadow-lg shadow-[#7DD4EF]/20">Reserve Seat <ArrowRight size={14} /></button>
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

      
      {typeof document !== "undefined" && createPortal(
        <AnimatePresence>
          {selectedEvent && (
            <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 sm:p-6 md:p-12 font-general text-white">
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={closeModal} className="absolute inset-0 bg-black/80 backdrop-blur-md cursor-pointer" />
              <motion.div layout initial={{ opacity: 0, scale: 0.98, y: 10 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.98, y: 10 }} transition={{ duration: 0.3, ease: "easeOut" }} className="relative w-full max-w-5xl bg-[#0A0A0A] border border-white/10 rounded-[24px] md:rounded-[32px] overflow-hidden shadow-2xl z-[10000] flex flex-col md:flex-row max-h-[90vh] md:max-h-[85vh]">
                <button onClick={closeModal} className="absolute top-4 right-4 z-[10001] p-2.5 bg-black/40 hover:bg-white/10 text-white rounded-full transition-colors border border-white/10 backdrop-blur-md"><X size={18} /></button>
                <div className="w-full md:w-[35%] h-48 md:h-auto relative shrink-0 bg-[#070707] border-b md:border-b-0 md:border-r border-white/5">
                  <img src={selectedEvent.image || selectedEvent.imageUrl} alt={selectedEvent.title} className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t md:bg-gradient-to-r from-[#0A0A0A] via-transparent to-transparent opacity-90" />
                </div>
                <div className="w-full md:w-[65%] p-6 md:p-12 flex flex-col overflow-y-auto custom-scrollbar overscroll-contain flex-1 min-h-0 relative" onWheel={(e) => e.stopPropagation()} onTouchMove={(e) => e.stopPropagation()}>
                  <div className="shrink-0 min-w-0 mb-6 md:mb-8">
                    <span className="inline-block px-3 py-1 mb-4 bg-[#7DD4EF]/10 text-[#7DD4EF] text-[10px] font-bold uppercase tracking-widest rounded-full">{selectedEvent.tag || selectedEvent.categories?.[0] || "Session"}</span>
                    <h3 className="text-4xl md:text-6xl font-normal text-white leading-[1.05] uppercase font-bebas-neue break-words">{selectedEvent.title}</h3>
                  </div>
                  <div className="flex flex-wrap items-center gap-x-8 gap-y-4 pb-8 mb-8 border-b border-white/10 shrink-0">
                    <div className="flex items-center gap-2 text-gray-400">
                      <Calendar size={16} className="text-[#7DD4EF]" />
                      <span className="text-sm">{selectedEvent.parsedDate ? selectedEvent.parsedDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : selectedEvent.date}</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-400">
                      <MapPin size={16} className="text-[#7DD4EF]" />
                      <span className="text-sm truncate max-w-[200px]">{selectedEvent.location || "BMSCE Campus"}</span>
                    </div>
                    {(selectedEvent.time || selectedEvent.duration) && (
                      <div className="flex items-center gap-2 text-gray-400">
                        <Clock size={16} className="text-[#7DD4EF]" />
                        <span className="text-sm">{selectedEvent.time || selectedEvent.duration}</span>
                      </div>
                    )}
                  </div>
                  <ExpandableText text={selectedEvent.fullDescription || selectedEvent.description} />
                  
                  
                  {galleryPhotos.length > 0 && (
                    <div className="shrink-0 min-w-0 mb-8">
                      <h4 className="text-white font-bebas-neue text-2xl mb-4 tracking-wide uppercase flex items-center gap-2"><Camera size={20} className="text-[#7DD4EF]"/> Event Gallery</h4>
                      <div className="flex overflow-x-auto gap-4 pb-4 snap-x custom-scrollbar">
                        {galleryPhotos.map((photo, idx) => (
                          <div key={idx} onClick={() => setFullscreenPhotoIndex(idx)} className="relative w-48 md:w-56 aspect-[4/3] shrink-0 snap-start rounded-xl overflow-hidden border border-white/10 bg-[#050505] group cursor-pointer">
                            
                            <img src={photo} alt={`Gallery ${idx + 1}`} loading="lazy" decoding="async" className="w-full h-full object-cover grayscale-0 group-hover:grayscale transition-all duration-500 group-hover:scale-105" />
                            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors flex items-center justify-center">
                               <div className="bg-black/60 p-2.5 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300 scale-75 group-hover:scale-100 backdrop-blur-sm border border-white/10">
                                  <Maximize size={18} className="text-white"/>
                               </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {selectedEvent.outcomes && (
                    <div className="shrink-0 min-w-0 mb-8">
                      <h4 className="text-white font-bebas-neue text-2xl mb-4 tracking-wide uppercase">Key Outcomes</h4>
                      <div className="text-gray-400 text-sm md:text-base font-general leading-relaxed">
                        {Array.isArray(selectedEvent.outcomes) ? (
                          <ul className="list-disc pl-5 space-y-2 marker:text-[#7DD4EF]">
                            {selectedEvent.outcomes.map((outcome, idx) => (<li key={idx} className="pl-2 break-words">{outcome}</li>))}
                          </ul>
                        ) : (<p className="whitespace-pre-wrap break-words">{selectedEvent.outcomes}</p>)}
                      </div>
                    </div>
                  )}
                  {selectedEvent.speakers && (
                    <div className="shrink-0 min-w-0 mb-8">
                      <h4 className="text-white font-bebas-neue text-2xl mb-4 tracking-wide uppercase flex items-center gap-2"><Users size={20} className="text-[#7DD4EF]"/> Speakers & Guests</h4>
                      <div className="text-[#7DD4EF] text-sm md:text-base font-general font-medium">
                        {Array.isArray(selectedEvent.speakers) ? selectedEvent.speakers.join("  •  ") : selectedEvent.speakers}
                      </div>
                    </div>
                  )}
                  <div className="mt-auto pt-8 flex flex-col sm:flex-row gap-4 shrink-0 border-t border-white/10">
                    {selectedEvent.registrationLink && selectedEvent.registrationLink !== "#" ? (
                      <button onClick={() => window.open(selectedEvent.registrationLink, "_blank")} className="flex-1 py-4 bg-[#7DD4EF] hover:bg-white text-black rounded-xl font-bold uppercase text-[10px] tracking-widest transition-all duration-300 flex items-center justify-center gap-2 shadow-lg shadow-[#7DD4EF]/20">Reserve Seat <ExternalLink size={14} /></button>
                    ) : (<div className="flex-1 flex items-center justify-center text-gray-500 font-bold uppercase text-[10px] tracking-widest border border-white/5 rounded-xl py-4 bg-white/[0.02]">Link Unavailable</div>)}
                    <button onClick={closeModal} className="px-8 py-4 bg-transparent hover:bg-white/5 text-white border border-white/10 rounded-xl font-bold uppercase text-[10px] tracking-widest transition-colors">Close</button>
                  </div>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>,
        document.body
      )}

      
      {typeof document !== "undefined" && createPortal(
        <AnimatePresence>
          {fullscreenPhotoIndex !== null && (
            <div className="fixed inset-0 z-[20000] flex items-center justify-center p-4 md:p-8 font-general text-white cursor-auto">
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={closeLightbox} className="absolute inset-0 bg-black cursor-pointer" />
              <div className="absolute top-4 right-4 md:top-8 md:right-8 z-[20002] flex items-center gap-3">
                 <span className="text-gray-500 font-bold text-xs uppercase tracking-widest px-3 py-2 bg-white/5 rounded-lg backdrop-blur-md border border-white/10">{fullscreenPhotoIndex + 1} / {galleryPhotos.length}</span>
                 <button onClick={closeLightbox} className="p-3 bg-black/60 hover:bg-white/10 text-white rounded-full transition-colors border border-white/10 backdrop-blur-md"><X size={20} /></button>
              </div>
              <motion.div key={fullscreenPhotoIndex} variants={lightboxVars} initial="hidden" animate="show" exit="exit" className="relative w-full h-full flex items-center justify-center z-[20001] pointer-events-none">
                <img src={galleryPhotos[fullscreenPhotoIndex]} alt={`Full View ${fullscreenPhotoIndex + 1}`} className="max-w-[95vw] max-h-[90vh] object-contain pointer-events-auto" decoding="async" />
              </motion.div>
              {galleryPhotos.length > 1 && (
                <>
                  <button onClick={showPrevPhoto} className="absolute left-4 md:left-8 top-1/2 -translate-y-1/2 p-3.5 bg-black/60 hover:bg-white/10 text-white rounded-full transition-colors border border-white/10 backdrop-blur-md z-[20002]"><ChevronLeft size={24} /></button>
                  <button onClick={showNextPhoto} className="absolute right-4 md:right-8 top-1/2 -translate-y-1/2 p-3.5 bg-black/60 hover:bg-white/10 text-white rounded-full transition-colors border border-white/10 backdrop-blur-md z-[20002]"><ChevronRight size={24} /></button>
                </>
              )}
            </div>
          )}
        </AnimatePresence>,
        document.body
      )}

      <style dangerouslySetInnerHTML={{__html: `
        .custom-scrollbar { -webkit-overflow-scrolling: touch; }
        .custom-scrollbar::-webkit-scrollbar { width: 6px; height: 6px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.1); border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: rgba(255,255,255,0.2); }
      `}} />
    </section>
  );
}