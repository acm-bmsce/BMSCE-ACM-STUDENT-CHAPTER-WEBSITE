import React, { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
// 🚀 FIX: Added Camera, Maximize, ChevronLeft, and ChevronRight for the gallery/lightbox
import { Calendar, MapPin, X, ExternalLink, Clock, Users, ArrowUpRight, ChevronDown, ChevronUp, Camera, Maximize, ChevronLeft, ChevronRight } from "lucide-react";
import eventService from "../../api/eventService"; 

const ExpandableText = ({ text }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const maxLength = 250; // How many characters to show before cutting off

  if (!text) return null;
  const isLong = text.length > maxLength;

  return (
    <div className="shrink-0 min-w-0 mb-8">
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

// --- FRAMER MOTION VARIANTS FOR LIGHTBOX ---
const lightboxVars = {
  hidden: { opacity: 0, scale: 0.95 },
  show: { opacity: 1, scale: 1, transition: { duration: 0.3, ease: "easeOut" } },
  exit: { opacity: 0, scale: 0.95, transition: { duration: 0.2, ease: "easeIn" } }
};

export default function EventFeaturedSection() {
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [featuredEvents, setFeaturedEvents] = useState([]);
  const [fetchStatus, setFetchStatus] = useState("loading"); 

  // 🎯 State for Fullscreen Gallery Lightbox
  const [fullscreenPhotoIndex, setFullscreenPhotoIndex] = useState(null);

  const closeModal = () => {
    setSelectedEvent(null);
    setFullscreenPhotoIndex(null); 
  };

  const closeLightbox = () => {
    setFullscreenPhotoIndex(null);
  };

  // Extract gallery photos securely
  const galleryPhotos = selectedEvent ? (selectedEvent.gallery || selectedEvent.images || selectedEvent.photos || []) : [];

  // Lightbox Navigation
  const showPrevPhoto = (e) => {
    e.stopPropagation(); 
    setFullscreenPhotoIndex((prev) => (prev > 0 ? prev - 1 : galleryPhotos.length - 1));
  };

  const showNextPhoto = (e) => {
    e.stopPropagation(); 
    setFullscreenPhotoIndex((prev) => (prev < galleryPhotos.length - 1 ? prev + 1 : 0));
  };

  // Bulletproof Background Scroll Lock (Handles both Modal and Lightbox)
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

  // Modal Keyboard Escape & Lightbox Arrows
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

  // Data Fetching
  useEffect(() => {
    let isMounted = true;
    const fetchFeaturedEvents = async () => {
      let attempts = 0;
      const maxAttempts = 15; 

      while (attempts < maxAttempts && isMounted) {
        try {
          if (attempts === 1) setFetchStatus("waking");

          const response = await eventService.getEvents(6, 0, true);
          
          if (isMounted) {
            const rawData = response.data?.events || response.data?.data || response.data;
            const eventsData = Array.isArray(rawData) ? rawData : [];
            
            const mappedEvents = eventsData.map(ev => ({
              ...ev, 
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

  const placeholderImg = "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=800&q=80";

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
                onClick={() => setSelectedEvent(event)} 
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

      {/* 🎯 Breathable, De-clustered Glassmorphic Modal */}
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
                className="absolute inset-0 bg-black/80 backdrop-blur-md cursor-pointer" 
              />

              {/* Modal Box */}
              <motion.div
                layout
                initial={{ opacity: 0, scale: 0.98, y: 10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.98, y: 10 }}
                transition={{ duration: 0.3, ease: "easeOut" }}
                className="relative w-full max-w-5xl bg-[#0A0A0A] border border-white/10 rounded-[24px] md:rounded-[32px] overflow-hidden shadow-2xl z-[10000] flex flex-col md:flex-row max-h-[90vh] md:max-h-[85vh]"
              >
                
                {/* Close Button */}
                <button 
                  onClick={closeModal} 
                  className="absolute top-4 right-4 z-50 p-2.5 bg-black/40 hover:bg-white/10 text-white rounded-full transition-colors border border-white/10 backdrop-blur-md"
                >
                  <X size={18} />
                </button>

                {/* Left Column: Image */}
                <div className="w-full md:w-[35%] h-48 md:h-auto relative shrink-0 bg-[#070707] border-b md:border-b-0 md:border-r border-white/5">
                  <img 
                    src={selectedEvent.image || selectedEvent.imageUrl || placeholderImg} 
                    alt={selectedEvent.title} 
                    className="w-full h-full object-cover" 
                  />
                  <div className="absolute inset-0 bg-gradient-to-t md:bg-gradient-to-r from-[#0A0A0A] via-transparent to-transparent opacity-90" />
                </div>

                {/* Right Column: Breathable Content Area */}
                <div 
                  className="w-full md:w-[65%] p-6 md:p-12 flex flex-col overflow-y-auto custom-scrollbar overscroll-contain flex-1 min-h-0 relative"
                  onWheel={(e) => e.stopPropagation()} 
                  onTouchMove={(e) => e.stopPropagation()}
                >
                  
                  {/* Title & Tags */}
                  <div className="shrink-0 min-w-0 mb-6 md:mb-8">
                    <span className="inline-block px-3 py-1 mb-4 bg-[#7DD4EF]/10 text-[#7DD4EF] text-[10px] font-bold uppercase tracking-widest rounded-full">
                      {selectedEvent.tag || selectedEvent.categories?.[0] || "Event"}
                    </span>
                    <h3 className="text-4xl md:text-6xl font-normal text-white leading-[1.05] uppercase font-bebas-neue break-words">
                      {selectedEvent.title}
                    </h3>
                  </div>
                  
                  {/* Clean, Minimalist Meta Info Row */}
                  <div className="flex flex-wrap items-center gap-x-8 gap-y-4 pb-8 mb-8 border-b border-white/10 shrink-0">
                    <div className="flex items-center gap-2 text-gray-400">
                      <Calendar size={16} className="text-[#7DD4EF]" />
                      <span className="text-sm">
                        {selectedEvent.parsedDate && !Number.isNaN(selectedEvent.parsedDate.getTime()) ? selectedEvent.parsedDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : selectedEvent.date}
                      </span>
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

                  {/* 🎯 Horizontal Gallery Section */}
                  {galleryPhotos.length > 0 && (
                    <div className="shrink-0 min-w-0 mb-8">
                      <h4 className="text-white font-bebas-neue text-2xl mb-4 tracking-wide uppercase flex items-center gap-2">
                        <Camera size={20} className="text-[#7DD4EF]"/> Event Gallery
                      </h4>
                      <div className="flex overflow-x-auto gap-4 pb-4 snap-x custom-scrollbar">
                        {galleryPhotos.map((photo, idx) => (
                          <div 
                            key={idx} 
                            onClick={() => setFullscreenPhotoIndex(idx)} 
                            className="relative w-48 md:w-56 aspect-[4/3] shrink-0 snap-start rounded-xl overflow-hidden border border-white/10 bg-[#050505] group cursor-pointer"
                          >
                            <img 
                              src={photo} 
                              alt={`Gallery ${idx + 1}`} 
                              loading="lazy"
                              decoding="async"
                              className="w-full h-full object-cover grayscale-[20%] group-hover:grayscale-0 transition-all duration-500 group-hover:scale-105"
                            />
                            {/* Hover overlay with expand icon */}
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

                  {/* Clean Outcomes */}
                  {selectedEvent.outcomes && (
                    <div className="shrink-0 min-w-0 mb-8">
                      <h4 className="text-white font-bebas-neue text-2xl mb-4 tracking-wide uppercase">Key Outcomes</h4>
                      <div className="text-gray-400 text-sm md:text-base font-general leading-relaxed">
                        {Array.isArray(selectedEvent.outcomes) ? (
                          <ul className="list-disc pl-5 space-y-2 marker:text-[#7DD4EF]">
                            {selectedEvent.outcomes.map((outcome, idx) => (
                              <li key={idx} className="pl-2 break-words">{outcome}</li>
                            ))}
                          </ul>
                        ) : (
                          <p className="whitespace-pre-wrap break-words">{selectedEvent.outcomes}</p>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Minimalist Speakers */}
                  {selectedEvent.speakers && (
                    <div className="shrink-0 min-w-0 mb-8">
                      <h4 className="text-white font-bebas-neue text-2xl mb-4 tracking-wide uppercase flex items-center gap-2">
                        <Users size={20} className="text-[#7DD4EF]"/> Speakers & Guests
                      </h4>
                      <div className="text-[#7DD4EF] text-sm md:text-base font-general font-medium">
                        {Array.isArray(selectedEvent.speakers) 
                          ? selectedEvent.speakers.join("  •  ") 
                          : selectedEvent.speakers
                        }
                      </div>
                    </div>
                  )}

                  {/* Call to Action Buttons */}
                  <div className="mt-auto pt-8 flex flex-col sm:flex-row gap-4 shrink-0 border-t border-white/10">
                    {(selectedEvent.registrationLink && selectedEvent.registrationLink !== "#") || (selectedEvent.recapLink && selectedEvent.recapLink !== "#") ? (
                      <button 
                        onClick={() => window.open(selectedEvent.registrationLink || selectedEvent.recapLink, "_blank")}
                        className="flex-1 py-4 bg-[#7DD4EF] hover:bg-white text-black rounded-xl font-bold uppercase text-[10px] tracking-widest transition-all duration-300 flex items-center justify-center gap-2"
                      >
                        {selectedEvent.registrationLink ? "Reserve Seat" : "View Gallery"} <ExternalLink size={14} />
                      </button>
                    ) : (
                      <div className="flex-1 flex items-center justify-center text-gray-500 font-bold uppercase text-[10px] tracking-widest border border-white/5 rounded-xl py-4 bg-white/[0.02]">
                        Link Unavailable
                      </div>
                    )}
                    
                    <button 
                      onClick={closeModal} 
                      className="px-8 py-4 bg-transparent hover:bg-white/5 text-white border border-white/10 rounded-xl font-bold uppercase text-[10px] tracking-widest transition-colors"
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

      {/* 🎯 Uncompressed Fullscreen Photo Lightbox via Portal */}
      {typeof document !== "undefined" && createPortal(
        <AnimatePresence>
          {fullscreenPhotoIndex !== null && (
            <div className="fixed inset-0 z-[20000] flex items-center justify-center p-4 md:p-8 font-general text-white cursor-auto">
              
              <motion.div 
                initial={{ opacity: 0 }} 
                animate={{ opacity: 1 }} 
                exit={{ opacity: 0 }} 
                onClick={closeLightbox} 
                className="absolute inset-0 bg-black cursor-pointer" 
              />

              <div className="absolute top-4 right-4 md:top-8 md:right-8 z-[20002] flex items-center gap-3">
                 <span className="text-gray-500 font-bold text-xs uppercase tracking-widest px-3 py-2 bg-white/5 rounded-lg backdrop-blur-md border border-white/10">
                    {fullscreenPhotoIndex + 1} / {galleryPhotos.length}
                 </span>
                 <button 
                    onClick={closeLightbox} 
                    className="p-3 bg-black/60 hover:bg-white/10 text-white rounded-full transition-colors border border-white/10 backdrop-blur-md"
                  >
                    <X size={20} />
                  </button>
              </div>

              <motion.div
                key={fullscreenPhotoIndex} 
                variants={lightboxVars}
                initial="hidden"
                animate="show"
                exit="exit"
                className="relative w-full h-full flex items-center justify-center z-[20001] pointer-events-none"
              >
                {/* 🎯 'object-contain' guarantees NO compression, NO stretching, NO cropping. */}
                <img 
                  src={galleryPhotos[fullscreenPhotoIndex] || placeholderImg} 
                  alt={`Full Screen Gallery ${fullscreenPhotoIndex + 1}`} 
                  className="max-w-[95vw] max-h-[90vh] object-contain pointer-events-auto" 
                  decoding="async"
                />
              </motion.div>

              {galleryPhotos.length > 1 && (
                <>
                  <button 
                    onClick={showPrevPhoto} 
                    className="absolute left-4 md:left-8 top-1/2 -translate-y-1/2 p-3.5 bg-black/60 hover:bg-white/10 text-white rounded-full transition-colors border border-white/10 backdrop-blur-md z-[20002]"
                  >
                    <ChevronLeft size={24} />
                  </button>
                  <button 
                    onClick={showNextPhoto} 
                    className="absolute right-4 md:right-8 top-1/2 -translate-y-1/2 p-3.5 bg-black/60 hover:bg-white/10 text-white rounded-full transition-colors border border-white/10 backdrop-blur-md z-[20002]"
                  >
                    <ChevronRight size={24} />
                  </button>
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