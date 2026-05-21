import React, { useState, useEffect, useMemo } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import { 
  ArrowRight, Calendar as CalendarIcon, MapPin, Clock, 
  ChevronDown, ChevronUp, X, ExternalLink, Users, 
  Camera, Maximize, ChevronLeft, ChevronRight 
} from "lucide-react";
import eventService from "../../api/eventService";


const ExpandableText = ({ text, isSpotlight = false }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const maxLength = isSpotlight ? 120 : 250; 

  if (!text) return <p className={isSpotlight ? "ec-spot-desc" : "text-gray-400 text-sm md:text-base leading-loose font-general"}>No description provided.</p>;
  const isLong = text.length > maxLength;

  return (
    <div className={isSpotlight ? "mb-5 shrink-0" : "shrink-0 min-w-0 mb-8"}>
      <motion.div layout>
        <p className={isSpotlight ? "ec-spot-desc" : "text-gray-400 text-sm md:text-base leading-loose font-general whitespace-pre-wrap break-words"}>
          {isExpanded || !isLong ? text : `${text.slice(0, maxLength)}...`}
        </p>
      </motion.div>
      
      {isLong && (
        <button
          onClick={(e) => { e.stopPropagation(); setIsExpanded(!isExpanded); }}
          className="mt-2 flex items-center gap-1.5 text-[#7DD4EF] text-[10px] font-bold uppercase tracking-widest hover:text-white transition-colors"
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

// --- Framer Motion Variants ---
const lightboxVars = {
  hidden: { opacity: 0, scale: 0.95 },
  show: { opacity: 1, scale: 1, transition: { duration: 0.3, ease: "easeOut" } },
  exit: { opacity: 0, scale: 0.95, transition: { duration: 0.2, ease: "easeIn" } }
};

const CSS = `
  :root {
    --bg: #000000;
    --glass: rgba(255, 255, 255, 0.02);
    --glass-border: rgba(255, 255, 255, 0.1);
    --accent: #7DD4EF;
    --text-main: #EAF7FF;
    --text-dim: rgba(234, 247, 255, 0.5);
    --panel-bg: #0A0A0A;
  }

  .ec-container {
    width: 100%;
    max-width: 1300px;
    margin: 0 auto;
    display: flex;
    flex-direction: column;
    gap: 16px;
    padding: 16px 12px;
    font-family: 'general', sans-serif;
  }

  @media (min-width: 1024px) {
    .ec-container { flex-direction: row; align-items: stretch; padding: 40px 20px; gap: 24px; }
  }

  .ec-main-panel {
    flex: 1;
    background: var(--panel-bg);
    border: 1px solid var(--glass-border);
    border-radius: 24px;
    display: flex;
    flex-direction: column;
    overflow: hidden;
    box-shadow: 0 10px 30px rgba(0,0,0,0.5);
  }

  @media (min-width: 1024px) { .ec-main-panel { border-radius: 32px; } }

  .ec-header {
    padding: 20px 16px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-bottom: 1px solid var(--glass-border);
  }

  @media (min-width: 768px) { .ec-header { padding: 32px; } }

  .ec-spot-tag { color: var(--accent); font-size: 0.55rem; font-weight: 800; letter-spacing: 0.3em; text-transform: uppercase; }

  .ec-title-group h2 {
    font-family: 'bebas-neue', sans-serif;
    font-size: clamp(2.5rem, 8vw, 4rem);
    text-transform: uppercase;
    letter-spacing: 0.02em;
    margin: 0;
    color: var(--text-main);
    line-height: 1;
    font-weight: normal;
  }

  .ec-nav-btn {
    width: 36px; height: 36px;
    border-radius: 12px;
    border: 1px solid var(--glass-border);
    background: var(--glass);
    color: var(--text-main);
    cursor: pointer;
    transition: all 0.2s ease;
    display: flex; align-items: center; justify-content: center;
  }

  .ec-nav-btn:hover { background: var(--accent); color: #000; border-color: var(--accent); }

  .ec-grid-header {
    display: grid; grid-template-columns: repeat(7, 1fr);
    background: rgba(255,255,255,0.02);
    padding: 10px 0; text-align: center;
    font-size: 0.6rem; font-weight: 800;
    text-transform: uppercase; letter-spacing: 0.1em; color: var(--text-dim);
  }

  .ec-grid { display: grid; grid-template-columns: repeat(7, 1fr); background: var(--glass-border); gap: 1px; border-top: 1px solid var(--glass-border); }

  .ec-day { background: var(--panel-bg); padding: 6px; position: relative; transition: all 0.2s ease; min-height: 60px; display: flex; flex-direction: column; align-items: center; }

  @media (min-width: 768px) { .ec-day { padding: 16px; min-height: 100px; align-items: flex-start; } }

  .ec-day.ec-empty { background: rgba(255,255,255,0.01); }

  .ec-day:hover:not(.ec-empty) { background: rgba(125, 212, 239, 0.08); cursor: pointer; }

  .ec-day-num { font-family: 'bebas-neue', sans-serif; font-size: 1.2rem; color: var(--text-dim); line-height: 1; }

  @media (min-width: 768px) { .ec-day-num { font-size: 1.8rem; } }

  .ec-day.active .ec-day-num { color: var(--text-main); }

  .ec-event-indicator { margin-top: auto; margin-bottom: 4px; width: 6px; height: 6px; background: var(--accent); border-radius: 50%; box-shadow: 0 0 8px var(--accent); }

  .ec-today-pill { position: absolute; top: 4px; right: 4px; font-size: 0.45rem; background: var(--accent); color: #000; padding: 2px 4px; border-radius: 4px; font-weight: 800; text-transform: uppercase; }

  .ec-spotlight { width: 100%; background: var(--panel-bg); border: 1px solid var(--glass-border); border-radius: 24px; overflow: hidden; display: flex; flex-direction: column; position: relative; will-change: transform; }

  @media (min-width: 1024px) { .ec-spotlight { width: 380px; border-radius: 32px; } }

  .ec-spot-img-wrap { height: 200px; position: relative; flex-shrink: 0; }

  .ec-spot-img { width: 100%; height: 100%; object-fit: cover; }

  .ec-spot-content { padding: 24px; display: flex; flex-direction: column; flex: 1; overflow-y: auto; }
  .ec-spot-content::-webkit-scrollbar { width: 4px; }
  .ec-spot-content::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.1); border-radius: 10px; }

  .ec-spot-title { font-family: 'bebas-neue', sans-serif; font-size: 2.5rem; line-height: 1; color: var(--text-main); margin: 8px 0 12px 0; text-transform: uppercase; font-weight: normal; word-break: break-word; }

  .ec-spot-desc { color: var(--text-dim); font-size: 0.85rem; line-height: 1.6; margin: 0; }

  .ec-meta-box { margin-top: auto; background: rgba(255,255,255,0.03); padding: 16px; border-radius: 20px; border: 1px solid var(--glass-border); display: flex; flex-direction: column; gap: 12px; }

  .ec-meta-item { display: flex; align-items: center; gap: 12px; font-size: 0.75rem; color: var(--text-dim); font-weight: 600; text-transform: uppercase; }

  .ec-meta-icon { color: var(--accent); flex-shrink: 0; }

  .ec-btn-primary { background: var(--accent); color: #000; border: none; padding: 14px; border-radius: 14px; font-family: 'general', sans-serif; font-weight: 800; text-transform: uppercase; letter-spacing: 0.2em; font-size: 0.7rem; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 8px; margin-top: 8px; transition: all 0.2s ease; }
  .ec-btn-primary:hover { background: #fff; transform: translateY(-2px); }
  
  .custom-scrollbar::-webkit-scrollbar { width: 6px; height: 6px; }
  .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.1); border-radius: 10px; }
`;

const WEEKDAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

export default function EventCalendarSection() {
  const [allEvents, setAllEvents] = useState([]);
  const [viewDate, setViewDate] = useState(new Date());
  const [hoveredEvent, setHoveredEvent] = useState(null);
  const [fetchStatus, setFetchStatus] = useState("loading");


  const [selectedEvent, setSelectedEvent] = useState(null);
  const [fullscreenPhotoIndex, setFullscreenPhotoIndex] = useState(null);

  useEffect(() => {
    let isMounted = true;
    const fetchEvents = async () => {
      let attempts = 0;
      while (attempts < 15 && isMounted) {
        try {
          if (attempts === 1) setFetchStatus("waking");
          const res = await eventService.getEvents(100, 0);
          if (isMounted) {
            const rawData = res.data?.events || res.data?.data || res.data;
            const data = Array.isArray(rawData) ? rawData : [];
            setAllEvents(data);
            setFetchStatus("success");
          }
          return;
        } catch (e) {
          attempts++;
          await new Promise(r => setTimeout(r, 3000));
        }
      }
      if (isMounted) setFetchStatus("error");
    };
    fetchEvents();
    return () => { isMounted = false; };
  }, []);

  const closeModal = () => { setSelectedEvent(null); setFullscreenPhotoIndex(null); };
  const closeLightbox = () => setFullscreenPhotoIndex(null);

  const galleryPhotos = selectedEvent ? (selectedEvent.gallery || selectedEvent.images || selectedEvent.photos || []) : [];

  const showPrevPhoto = (e) => { e.stopPropagation(); setFullscreenPhotoIndex((prev) => (prev > 0 ? prev - 1 : galleryPhotos.length - 1)); };
  const showNextPhoto = (e) => { e.stopPropagation(); setFullscreenPhotoIndex((prev) => (prev < galleryPhotos.length - 1 ? prev + 1 : 0)); };

  
  useEffect(() => {
    if (selectedEvent || fullscreenPhotoIndex !== null) {
      document.body.style.overflow = 'hidden';
      document.documentElement.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
      document.documentElement.style.overflow = 'auto';
    }
  }, [selectedEvent, fullscreenPhotoIndex]);

  const { cells, monthEvents } = useMemo(() => {
    const year = viewDate.getFullYear();
    const month = viewDate.getMonth();
    const firstDay = new Date(year, month, 1);
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    let startOffset = firstDay.getDay() - 1;
    if (startOffset < 0) startOffset = 6; 
    
    const currentMonthEvents = allEvents.filter(ev => {
      const d = new Date(ev.date || ev.startDate);
      return !isNaN(d.getTime()) && d.getFullYear() === year && d.getMonth() === month;
    });

    const gridCells = [];
    for (let i = 0; i < startOffset; i++) gridCells.push({ type: "empty" });
    for (let d = 1; d <= daysInMonth; d++) {
      const dayEvents = currentMonthEvents.filter(ev => new Date(ev.date || ev.startDate).getDate() === d);
      gridCells.push({ day: d, events: dayEvents, isToday: new Date().toDateString() === new Date(year, month, d).toDateString() });
    }
    const remainder = gridCells.length % 7;
    if (remainder !== 0) for (let i = 0; i < 7 - remainder; i++) gridCells.push({ type: "empty" });

    return { cells: gridCells, monthEvents: currentMonthEvents };
  }, [viewDate, allEvents]);

  const spotlight = hoveredEvent || monthEvents[0] || null;

  return (
    <div className="ec-container font-general">
      <style>{CSS}</style>

      
      <div className="ec-main-panel">
        <div className="ec-header">
          <div>
            <span className="ec-spot-tag">Academic Schedule</span>
            <div className="ec-title-group">
              <h2>{viewDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}</h2>
            </div>
          </div>
          <div className="ec-nav-group flex gap-2">
            <button className="ec-nav-btn" onClick={() => setViewDate(new Date(viewDate.setMonth(viewDate.getMonth() - 1)))}>
              <ChevronLeft size={18} />
            </button>
            <button className="ec-nav-btn" onClick={() => setViewDate(new Date(viewDate.setMonth(viewDate.getMonth() + 1)))}>
              <ChevronRight size={18} />
            </button>
          </div>
        </div>

        <div className="ec-grid-header">
          {WEEKDAYS.map(d => <div key={d}>{d}</div>)}
        </div>

        {fetchStatus === "loading" || fetchStatus === "waking" ? (
          <div className="flex-1 flex flex-col items-center justify-center min-h-[300px]">
            <div className="w-8 h-8 border-4 border-[#7DD4EF]/20 border-t-[#7DD4EF] rounded-full animate-spin mb-4" />
            <p className="text-[#7DD4EF] text-[10px] uppercase animate-pulse tracking-[0.2em]">Syncing Calendar...</p>
          </div>
        ) : (
          <div className="ec-grid">
            {cells.map((cell, i) => (
              <div 
                key={i} 
                className={`ec-day ${cell.type === 'empty' ? 'ec-empty' : ''} ${cell.events?.length ? 'active' : ''}`}
                onMouseEnter={() => cell.events?.length && setHoveredEvent(cell.events[0])}
                onClick={() => cell.events?.length && setHoveredEvent(cell.events[0])}
              >
                {cell.day && <span className="ec-day-num">{cell.day}</span>}
                {cell.isToday && <span className="ec-today-pill">Today</span>}
                {cell.events?.length > 0 && <div className="ec-event-indicator" />}
              </div>
            ))}
          </div>
        )}
      </div>

      
      <aside className="ec-spotlight group"> 
        {spotlight ? (
          <>
            <div className="ec-spot-img-wrap overflow-hidden">
              <img 
                src={spotlight.image || spotlight.imageUrl || "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4"} 
                
                className="ec-spot-img grayscale-0 group-hover:grayscale transition-all duration-700 ease-in-out" 
                alt="Spotlight" 
              />
              <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, #0A0A0A, transparent)' }} />
              <div style={{ position: 'absolute', top: 16, left: 16 }}>
                 <span className="px-3 py-1 bg-black/60 backdrop-blur-md text-[#7DD4EF] border border-[#7DD4EF]/30 text-[9px] font-black uppercase tracking-widest rounded-lg">
                   {spotlight.tag || spotlight.categories?.[0] || "Featured"}
                 </span>
              </div>
            </div>

            <div className="ec-spot-content">
              <h3 className="ec-spot-title">{spotlight.title}</h3>
              <ExpandableText text={spotlight.fullDescription || spotlight.description} isSpotlight={true} />
              
              <div className="ec-meta-box">
                <div className="ec-meta-item"><Clock size={16} className="ec-meta-icon" /> <span className="text-white">{spotlight.time || spotlight.duration || "TBA"}</span></div>
                <div className="ec-meta-item"><MapPin size={16} className="ec-meta-icon" /> <span className="text-white truncate">{spotlight.location || "BMSCE Campus"}</span></div>
                
                <button 
                  onClick={() => setSelectedEvent(spotlight)}
                  className="ec-btn-primary"
                >
                  View Details <ArrowRight size={14} />
                </button>
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center p-8 text-center bg-white/[0.02]">
            <CalendarIcon size={40} className="text-white/10 mb-4" />
            <h3 className="text-2xl font-normal text-white uppercase font-bebas-neue mb-2 tracking-wide">No Events Selected</h3>
            <p className="text-[#7DD4EF] text-[10px] font-bold uppercase tracking-widest">Tap a date to view details</p>
          </div>
        )}
      </aside>

      
      {typeof document !== "undefined" && createPortal(
        <AnimatePresence>
          {selectedEvent && (
            <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 sm:p-6 md:p-12 font-general text-white">
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={closeModal} className="absolute inset-0 bg-black/80 backdrop-blur-md cursor-pointer" />
              <motion.div layout initial={{ opacity: 0, scale: 0.98, y: 10 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.98, y: 10 }} transition={{ duration: 0.3, ease: "easeOut" }} className="relative w-full max-w-5xl bg-[#0A0A0A] border border-white/10 rounded-[24px] md:rounded-[32px] overflow-hidden shadow-2xl z-[10000] flex flex-col md:flex-row max-h-[90vh] md:max-h-[85vh]">
                <button onClick={closeModal} className="absolute top-4 right-4 z-[10001] p-2.5 bg-black/40 hover:bg-white/10 text-white rounded-full border border-white/10 backdrop-blur-md"><X size={18} /></button>
                <div className="w-full md:w-[35%] h-48 md:h-auto relative shrink-0 bg-[#070707] border-b md:border-b-0 md:border-r border-white/5">
                  <img src={selectedEvent.image || selectedEvent.imageUrl} alt={selectedEvent.title} className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t md:bg-gradient-to-r from-[#0A0A0A] via-transparent to-transparent opacity-90" />
                </div>
                <div className="w-full md:w-[65%] p-6 md:p-12 flex flex-col overflow-y-auto custom-scrollbar overscroll-contain flex-1 min-h-0 relative" onWheel={(e) => e.stopPropagation()} onTouchMove={(e) => e.stopPropagation()}>
                  <div className="shrink-0 min-w-0 mb-6 md:mb-8">
                    <span className="inline-block px-3 py-1 mb-4 bg-[#7DD4EF]/10 text-[#7DD4EF] text-[10px] font-bold uppercase tracking-widest rounded-full">{selectedEvent.tag || "Event"}</span>
                    <h3 className="text-4xl md:text-6xl font-normal text-white leading-[1.05] uppercase font-bebas-neue break-words">{selectedEvent.title}</h3>
                  </div>
                  <div className="flex flex-wrap items-center gap-x-8 gap-y-4 pb-8 mb-8 border-b border-white/10 shrink-0 text-gray-400">
                    <div className="flex items-center gap-2"><CalendarIcon size={16} className="text-[#7DD4EF]" /> <span className="text-sm">{selectedEvent.date || "TBA"}</span></div>
                    <div className="flex items-center gap-2"><MapPin size={16} className="text-[#7DD4EF]" /> <span className="text-sm truncate max-w-[200px]">{selectedEvent.location || "BMSCE Campus"}</span></div>
                    {(selectedEvent.time || selectedEvent.duration) && <div className="flex items-center gap-2"><Clock size={16} className="text-[#7DD4EF]" /> <span className="text-sm">{selectedEvent.time || selectedEvent.duration}</span></div>}
                  </div>
                  <ExpandableText text={selectedEvent.fullDescription || selectedEvent.description} />
                  
                  
                  {galleryPhotos.length > 0 && (
                    <div className="shrink-0 min-w-0 mb-8">
                      <h4 className="text-white font-bebas-neue text-2xl mb-4 tracking-wide uppercase flex items-center gap-2"><Camera size={20} className="text-[#7DD4EF]"/> Event Gallery</h4>
                      <div className="flex overflow-x-auto gap-4 pb-4 snap-x custom-scrollbar">
                        {galleryPhotos.map((photo, idx) => (
                          <div key={idx} onClick={() => setFullscreenPhotoIndex(idx)} className="relative w-48 md:w-56 aspect-[4/3] shrink-0 snap-start rounded-xl overflow-hidden border border-white/10 bg-[#050505] group cursor-pointer">
                            <img 
                              src={photo} 
                              alt={`Gallery ${idx + 1}`} 
                              loading="lazy" 
                              decoding="async" 
                              
                              className="w-full h-full object-cover grayscale-0 group-hover:grayscale transition-all duration-500 ease-in-out group-hover:scale-105" 
                            />
                            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors flex items-center justify-center">
                               <div className="bg-black/60 p-2.5 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300 scale-75 group-hover:scale-100 backdrop-blur-sm border border-white/10"><Maximize size={18} className="text-white"/></div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {selectedEvent.speakers && (
                    <div className="shrink-0 min-w-0 mb-8">
                      <h4 className="text-white font-bebas-neue text-2xl mb-4 tracking-wide uppercase flex items-center gap-2"><Users size={20} className="text-[#7DD4EF]"/> Speakers</h4>
                      <div className="text-[#7DD4EF] text-sm font-general font-medium">
                        {Array.isArray(selectedEvent.speakers) ? selectedEvent.speakers.join("  •  ") : selectedEvent.speakers}
                      </div>
                    </div>
                  )}
                  <div className="mt-auto pt-8 flex flex-col sm:flex-row gap-4 shrink-0 border-t border-white/10">
                    {selectedEvent.registrationLink && selectedEvent.registrationLink !== "#" ? (
                      <button onClick={() => window.open(selectedEvent.registrationLink, "_blank")} className="flex-1 py-4 bg-[#7DD4EF] hover:bg-white text-black rounded-xl font-bold uppercase text-[10px] tracking-widest transition-all duration-300 flex items-center justify-center gap-2 shadow-lg shadow-[#7DD4EF]/20">Register Now <ExternalLink size={14} /></button>
                    ) : (<div className="flex-1 flex items-center justify-center text-gray-500 font-bold uppercase text-[10px] border border-white/5 rounded-xl py-4 bg-white/[0.02]">Link Unavailable</div>)}
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
                  <button onClick={showPrevPhoto} className="absolute left-4 md:left-8 top-1/2 -translate-y-1/2 p-3.5 bg-black/60 hover:bg-white/10 text-white rounded-full border border-white/10 backdrop-blur-md z-[20002]"><ChevronLeft size={24} /></button>
                  <button onClick={showNextPhoto} className="absolute right-4 md:right-8 top-1/2 -translate-y-1/2 p-3.5 bg-black/60 hover:bg-white/10 text-white rounded-full border border-white/10 backdrop-blur-md z-[20002]"><ChevronRight size={24} /></button>
                </>
              )}
            </div>
          )}
        </AnimatePresence>,
        document.body
      )}
    </div>
  );
}