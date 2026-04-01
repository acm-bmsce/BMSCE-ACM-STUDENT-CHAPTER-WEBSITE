import React, { useState, useEffect, useMemo } from "react";
import { ArrowRight, Calendar as CalendarIcon, MapPin, Clock } from "lucide-react";
import eventService from "../../api/eventService";

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
    .ec-container {
      flex-direction: row;
      align-items: stretch;
      padding: 40px 20px;
      gap: 24px;
    }
  }

  /* --- LEFT PANEL: CALENDAR --- */
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

  @media (min-width: 1024px) {
    .ec-main-panel { border-radius: 32px; }
  }

  .ec-header {
    padding: 20px 16px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-bottom: 1px solid var(--glass-border);
  }

  @media (min-width: 768px) {
    .ec-header { padding: 32px; }
  }

  .ec-spot-tag {
    color: var(--accent);
    font-size: 0.55rem;
    font-weight: 800;
    letter-spacing: 0.3em;
    text-transform: uppercase;
  }

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

  .ec-nav-group {
    display: flex;
    gap: 6px;
  }

  .ec-nav-btn {
    width: 36px;
    height: 36px;
    border-radius: 12px;
    border: 1px solid var(--glass-border);
    background: var(--glass);
    color: var(--text-main);
    cursor: pointer;
    transition: all 0.2s ease;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  @media (min-width: 768px) {
    .ec-nav-btn { width: 44px; height: 44px; }
  }

  .ec-nav-btn:hover {
    background: var(--accent);
    color: #000;
    border-color: var(--accent);
  }

  .ec-grid-header {
    display: grid;
    grid-template-columns: repeat(7, 1fr);
    background: rgba(255,255,255,0.02);
    padding: 10px 0;
    text-align: center;
    font-size: 0.6rem;
    font-weight: 800;
    text-transform: uppercase;
    letter-spacing: 0.1em;
    color: var(--text-dim);
  }

  .ec-grid {
    display: grid;
    grid-template-columns: repeat(7, 1fr);
    background: var(--glass-border); 
    gap: 1px; 
    border-top: 1px solid var(--glass-border);
  }

  .ec-day {
    background: var(--panel-bg); 
    padding: 6px;
    position: relative;
    transition: all 0.2s ease;
    min-height: 60px;
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  @media (min-width: 768px) {
    .ec-day { 
      padding: 16px; 
      min-height: 100px; 
      align-items: flex-start; 
    }
  }

  .ec-day.ec-empty {
    background: rgba(255,255,255,0.01);
  }

  .ec-day:hover:not(.ec-empty) {
    background: rgba(125, 212, 239, 0.08);
    cursor: pointer;
  }

  .ec-day-num {
    font-family: 'bebas-neue', sans-serif;
    font-size: 1.2rem;
    color: var(--text-dim);
    line-height: 1;
  }

  @media (min-width: 768px) {
    .ec-day-num { font-size: 1.8rem; }
  }

  .ec-day.active .ec-day-num {
    color: var(--text-main);
  }

  .ec-event-indicator {
    margin-top: auto;
    margin-bottom: 4px;
    width: 6px;
    height: 6px;
    background: var(--accent);
    border-radius: 50%;
    box-shadow: 0 0 8px var(--accent);
  }

  @media (min-width: 768px) {
    .ec-event-indicator { width: 8px; height: 8px; margin-bottom: 0; margin-top: 8px; }
  }

  .ec-today-pill {
    position: absolute;
    top: 4px;
    right: 4px;
    font-size: 0.45rem;
    background: var(--accent);
    color: #000;
    padding: 2px 4px;
    border-radius: 4px;
    font-weight: 800;
    text-transform: uppercase;
    letter-spacing: 0.05em;
  }

  @media (min-width: 768px) {
    .ec-today-pill { top: 12px; right: 12px; font-size: 0.55rem; padding: 4px 8px; }
  }

  /* --- RIGHT PANEL: SPOTLIGHT --- */
  .ec-spotlight {
    width: 100%;
    background: var(--panel-bg);
    border: 1px solid var(--glass-border);
    border-radius: 24px;
    overflow: hidden;
    display: flex;
    flex-direction: column;
    position: relative;
    /* 🚀 Added will-change to prevent flicker when swapping images */
    will-change: transform;
  }

  @media (min-width: 1024px) {
    .ec-spotlight { width: 380px; border-radius: 32px; }
  }

  .ec-spot-img-wrap {
    height: 200px;
    position: relative;
    flex-shrink: 0;
  }

  @media (min-width: 768px) {
    .ec-spot-img-wrap { height: 260px; }
  }

  .ec-spot-img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  .ec-spot-content {
    padding: 24px;
    display: flex;
    flex-direction: column;
    flex: 1;
  }

  @media (min-width: 768px) {
    .ec-spot-content { padding: 32px; }
  }

  .ec-spot-title {
    font-family: 'bebas-neue', sans-serif;
    font-size: 2.5rem;
    line-height: 1;
    color: var(--text-main);
    margin: 8px 0 12px 0;
    text-transform: uppercase;
    font-weight: normal;
    /* 🚀 Added break-words to prevent long titles from pushing layout */
    word-break: break-word;
  }

  .ec-spot-desc {
    color: var(--text-dim);
    font-size: 0.85rem;
    line-height: 1.5;
    margin-bottom: 20px;
  }

  .ec-meta-box {
    margin-top: auto;
    background: rgba(255,255,255,0.03);
    padding: 16px;
    border-radius: 20px;
    border: 1px solid var(--glass-border);
    display: flex;
    flex-direction: column;
    gap: 12px;
  }

  @media (min-width: 768px) {
    .ec-meta-box { padding: 24px; gap: 16px; }
  }

  .ec-meta-item {
    display: flex;
    align-items: center;
    gap: 12px;
    font-size: 0.75rem;
    color: var(--text-dim);
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.1em;
  }

  .ec-meta-icon {
    color: var(--accent);
    flex-shrink: 0; /* 🚀 Prevents icons from squishing */
  }

  .ec-btn-primary {
    background: var(--accent);
    color: #000;
    border: none;
    padding: 14px;
    border-radius: 14px;
    font-family: 'general', sans-serif;
    font-weight: 800;
    text-transform: uppercase;
    letter-spacing: 0.2em;
    font-size: 0.7rem;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    margin-top: 8px;
    transition: all 0.2s ease;
  }

  .ec-btn-primary:hover {
    background: #fff;
    transform: translateY(-2px);
  }
`;

const WEEKDAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

export default function EventCalendarSection() {
  const [allEvents, setAllEvents] = useState([]);
  const [viewDate, setViewDate] = useState(new Date());
  const [hoveredEvent, setHoveredEvent] = useState(null);
  const [fetchStatus, setFetchStatus] = useState("loading");

  useEffect(() => {
    let isMounted = true;
    const fetchEvents = async () => {
      let attempts = 0;
      while (attempts < 15 && isMounted) {
        try {
          if (attempts === 1) setFetchStatus("waking");
          
          // 🚀 API FIX: Ensure strict number parameters
          const res = await eventService.getEvents(100, 0);
          
          if (isMounted) {
            const rawData = res.data?.events || res.data?.data || res.data;
            // 🚀 CRASH SHIELD: Enforce Array output
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
    
    for (let i = 0; i < startOffset; i++) {
      gridCells.push({ type: "empty" });
    }

    for (let d = 1; d <= daysInMonth; d++) {
      const dayEvents = currentMonthEvents.filter(ev => new Date(ev.date || ev.startDate).getDate() === d);
      gridCells.push({
        day: d,
        events: dayEvents,
        isToday: new Date().toDateString() === new Date(year, month, d).toDateString()
      });
    }

    const remainder = gridCells.length % 7;
    if (remainder !== 0) {
      for (let i = 0; i < 7 - remainder; i++) {
        gridCells.push({ type: "empty" });
      }
    }

    return { cells: gridCells, monthEvents: currentMonthEvents };
  }, [viewDate, allEvents]);

  // Priority Spotlight: Hovered Event -> First event of month -> Null
  const spotlight = hoveredEvent || monthEvents[0] || null;

  return (
    <div className="ec-container">
      <style>{CSS}</style>

      {/* Main Calendar Panel */}
      <div className="ec-main-panel">
        <div className="ec-header">
          <div>
            <span className="ec-spot-tag">Academic Schedule</span>
            <div className="ec-title-group">
              <h2>{viewDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}</h2>
            </div>
          </div>
          <div className="ec-nav-group">
            <button className="ec-nav-btn" onClick={() => setViewDate(new Date(viewDate.setMonth(viewDate.getMonth() - 1)))}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>
            </button>
            <button className="ec-nav-btn" onClick={() => setViewDate(new Date(viewDate.setMonth(viewDate.getMonth() + 1)))}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6"/></svg>
            </button>
          </div>
        </div>

        <div className="ec-grid-header">
          {WEEKDAYS.map(d => <div key={d}>{d}</div>)}
        </div>

        {fetchStatus === "loading" || fetchStatus === "waking" ? (
          <div className="flex-1 flex flex-col items-center justify-center min-h-[300px]">
            <div className="w-8 h-8 border-4 border-[#7DD4EF]/20 border-t-[#7DD4EF] rounded-full animate-spin mb-4" />
            <p className="text-[#7DD4EF] text-[10px] md:text-xs font-bold tracking-[0.2em] uppercase animate-pulse">
              {fetchStatus === "waking" ? "Waking Servers..." : "Syncing Calendar..."}
            </p>
          </div>
        ) : fetchStatus === "error" ? (
          <div className="flex-1 flex flex-col items-center justify-center min-h-[300px]">
            <p className="text-red-400 text-xs font-bold tracking-[0.2em] uppercase">
              Calendar Sync Failed
            </p>
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
                
                {cell.events?.length > 0 && (
                  <div className="ec-event-indicator" />
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Right Spotlight Panel */}
      <aside className="ec-spotlight">
        {spotlight ? (
          <>
            <div className="ec-spot-img-wrap">
              <img 
                src={spotlight.image || spotlight.imageUrl || "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4"} 
                className="ec-spot-img" 
                alt="Spotlight"
                loading="lazy"      // 🚀 Performance Fix
                decoding="async"    // 🚀 Performance Fix
              />
              <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, #0A0A0A, transparent)' }} />
              
              <div style={{ position: 'absolute', top: 16, left: 16 }}>
                 <span className="px-3 py-1 bg-black/60 backdrop-blur-md text-[#7DD4EF] border border-[#7DD4EF]/30 text-[9px] md:text-[10px] font-black uppercase tracking-widest rounded-lg">
                   {spotlight.tag || spotlight.categories?.[0] || "Featured"}
                 </span>
              </div>
            </div>

            <div className="ec-spot-content">
              <h3 className="ec-spot-title">{spotlight.title}</h3>
              <p className="ec-spot-desc">
                {spotlight.description ? 
                  (spotlight.description.length > 120 ? `${spotlight.description.substring(0, 120)}...` : spotlight.description) 
                  : "No description provided."}
              </p>
              
              <div className="ec-meta-box">
                <div className="ec-meta-item">
                  <Clock size={16} className="ec-meta-icon" /> 
                  <span className="text-white truncate">{spotlight.time || spotlight.duration || "TBA"}</span>
                </div>
                <div className="ec-meta-item">
                  <MapPin size={16} className="ec-meta-icon" /> 
                  <span className="text-white truncate">{spotlight.location || "BMSCE Campus"}</span>
                </div>
                
                <button 
                  onClick={() => {
                    const link = spotlight.registrationLink || spotlight.recapLink;
                    if (link && link !== "#") window.open(link, "_blank");
                  }}
                  className="ec-btn-primary"
                  style={{ opacity: (spotlight.registrationLink && spotlight.registrationLink !== "#") ? 1 : 0.5 }}
                >
                  {(spotlight.registrationLink && spotlight.registrationLink !== "#") ? (
                    <>Register Now <ArrowRight size={14} /></>
                  ) : (
                    "No Link Available"
                  )}
                </button>
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center p-8 text-center bg-white/[0.02]">
            <CalendarIcon size={40} className="text-white/10 mb-4" />
            <h3 className="text-2xl font-normal text-white uppercase font-bebas-neue mb-2 tracking-wide">No Events Selected</h3>
            <p className="text-[#7DD4EF] text-[10px] font-bold uppercase tracking-widest">
              Tap or hover a date<br/>to view details
            </p>
          </div>
        )}
      </aside>
    </div>
  );
}