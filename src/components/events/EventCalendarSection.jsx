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
    gap: 24px;
    padding: 20px;
    font-family: 'General Sans', sans-serif;
  }

  @media (min-width: 1024px) {
    .ec-container {
      flex-direction: row;
      align-items: stretch;
      padding: 40px 20px;
    }
  }

  /* --- LEFT PANEL: CALENDAR --- */
  .ec-main-panel {
    flex: 1;
    background: var(--panel-bg);
    border: 1px solid var(--glass-border);
    border-radius: 32px;
    display: flex;
    flex-direction: column;
    overflow: hidden;
    box-shadow: 0 20px 40px rgba(0,0,0,0.5);
  }

  .ec-header {
    padding: 32px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-bottom: 1px solid var(--glass-border);
  }

  .ec-spot-tag {
    color: var(--accent);
    font-size: 0.65rem;
    font-weight: 800;
    letter-spacing: 0.3em;
    text-transform: uppercase;
  }

  .ec-title-group h2 {
    font-family: 'Impact', sans-serif;
    font-size: clamp(2rem, 4vw, 3rem);
    text-transform: uppercase;
    letter-spacing: -0.02em;
    margin: 4px 0 0 0;
    color: var(--text-main);
  }

  .ec-nav-group {
    display: flex;
    gap: 8px;
  }

  .ec-nav-btn {
    width: 44px;
    height: 44px;
    border-radius: 14px;
    border: 1px solid var(--glass-border);
    background: var(--glass);
    color: var(--text-main);
    cursor: pointer;
    transition: all 0.2s ease;
    display: flex;
    align-items: center;
    justify-content: center;
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
    padding: 16px 0;
    text-align: center;
    font-size: 0.7rem;
    font-weight: 800;
    text-transform: uppercase;
    letter-spacing: 0.2em;
    color: var(--text-dim);
  }

  /* Perfect Grid Lines Trick */
  .ec-grid {
    display: grid;
    grid-template-columns: repeat(7, 1fr);
    background: var(--glass-border); /* Acts as the border color */
    gap: 1px; /* Creates 1px borders between cells perfectly */
    border-top: 1px solid var(--glass-border);
  }

  .ec-day {
    background: var(--panel-bg); /* Covers the grid background */
    padding: 16px;
    position: relative;
    transition: all 0.2s ease;
    min-height: 100px;
    display: flex;
    flex-direction: column;
  }

  .ec-day.ec-empty {
    background: rgba(255,255,255,0.01);
  }

  .ec-day:hover:not(.ec-empty) {
    background: rgba(125, 212, 239, 0.08);
    cursor: pointer;
  }

  .ec-day-num {
    font-family: 'Impact', sans-serif;
    font-size: 1.5rem;
    color: var(--text-dim);
    line-height: 1;
  }

  .ec-day.active .ec-day-num {
    color: var(--text-main);
  }

  .ec-event-indicator {
    margin-top: 8px;
    width: 8px;
    height: 8px;
    background: var(--accent);
    border-radius: 50%;
    box-shadow: 0 0 12px var(--accent);
  }

  .ec-today-pill {
    position: absolute;
    top: 12px;
    right: 12px;
    font-size: 0.55rem;
    background: var(--accent);
    color: #000;
    padding: 4px 8px;
    border-radius: 6px;
    font-weight: 800;
    text-transform: uppercase;
    letter-spacing: 0.1em;
  }

  /* --- RIGHT PANEL: SPOTLIGHT --- */
  .ec-spotlight {
    width: 100%;
    background: var(--panel-bg);
    border: 1px solid var(--glass-border);
    border-radius: 32px;
    overflow: hidden;
    display: flex;
    flex-direction: column;
    position: relative;
  }

  @media (min-width: 1024px) {
    .ec-spotlight { width: 380px; }
  }

  .ec-spot-img-wrap {
    height: 260px;
    position: relative;
    flex-shrink: 0;
  }

  .ec-spot-img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  .ec-spot-content {
    padding: 32px;
    display: flex;
    flex-direction: column;
    flex: 1;
  }

  .ec-spot-title {
    font-family: 'Impact', sans-serif;
    font-size: 2.2rem;
    line-height: 1.1;
    color: var(--text-main);
    margin: 8px 0 16px 0;
    text-transform: uppercase;
  }

  .ec-spot-desc {
    color: var(--text-dim);
    font-size: 0.9rem;
    line-height: 1.6;
    margin-bottom: 24px;
  }

  .ec-meta-box {
    margin-top: auto;
    background: rgba(255,255,255,0.03);
    padding: 24px;
    border-radius: 24px;
    border: 1px solid var(--glass-border);
    display: flex;
    flex-direction: column;
    gap: 16px;
  }

  .ec-meta-item {
    display: flex;
    align-items: center;
    gap: 12px;
    font-size: 0.8rem;
    color: var(--text-dim);
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.1em;
  }

  .ec-meta-icon {
    color: var(--accent);
  }

  .ec-btn-primary {
    background: var(--accent);
    color: #000;
    border: none;
    padding: 16px;
    border-radius: 16px;
    font-weight: 800;
    text-transform: uppercase;
    letter-spacing: 0.2em;
    font-size: 0.75rem;
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
          const res = await eventService.getEvents(100, 0);
          if (isMounted) {
            const data = res.data?.events || res.data || [];
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
    
    // Shift so Monday is index 0
    let startOffset = firstDay.getDay() - 1;
    if (startOffset < 0) startOffset = 6; 
    
    const currentMonthEvents = allEvents.filter(ev => {
      const d = new Date(ev.date || ev.startDate);
      return d.getFullYear() === year && d.getMonth() === month;
    });

    const gridCells = [];
    
    // 1. Padding before the 1st
    for (let i = 0; i < startOffset; i++) {
      gridCells.push({ type: "empty" });
    }

    // 2. The actual days
    for (let d = 1; d <= daysInMonth; d++) {
      const dayEvents = currentMonthEvents.filter(ev => new Date(ev.date || ev.startDate).getDate() === d);
      gridCells.push({
        day: d,
        events: dayEvents,
        isToday: new Date().toDateString() === new Date(year, month, d).toDateString()
      });
    }

    // 3. Padding after the 31st (Fixes the dates falling out of the box)
    const remainder = gridCells.length % 7;
    if (remainder !== 0) {
      for (let i = 0; i < 7 - remainder; i++) {
        gridCells.push({ type: "empty" });
      }
    }

    return { cells: gridCells, monthEvents: currentMonthEvents };
  }, [viewDate, allEvents]);

  // Default spotlight logic
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
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>
            </button>
            <button className="ec-nav-btn" onClick={() => setViewDate(new Date(viewDate.setMonth(viewDate.getMonth() + 1)))}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6"/></svg>
            </button>
          </div>
        </div>

        <div className="ec-grid-header">
          {WEEKDAYS.map(d => <div key={d}>{d}</div>)}
        </div>

        {fetchStatus === "loading" || fetchStatus === "waking" ? (
          <div className="flex-1 flex flex-col items-center justify-center min-h-[400px]">
            <div className="w-10 h-10 border-4 border-[#7DD4EF]/20 border-t-[#7DD4EF] rounded-full animate-spin mb-4" />
            <p className="text-[#7DD4EF] text-xs font-bold tracking-[0.2em] uppercase animate-pulse">
              {fetchStatus === "waking" ? "Waking Servers..." : "Syncing Calendar..."}
            </p>
          </div>
        ) : (
          <div className="ec-grid">
            {cells.map((cell, i) => (
              <div 
                key={i} 
                className={`ec-day ${cell.type === 'empty' ? 'ec-empty' : ''} ${cell.events?.length ? 'active' : ''}`}
                onMouseEnter={() => cell.events?.length && setHoveredEvent(cell.events[0])}
              >
                {cell.day && <span className="ec-day-num">{cell.day}</span>}
                {cell.isToday && <span className="ec-today-pill">Today</span>}
                
                {/* Visual Indicator for events */}
                {cell.events?.length > 0 && (
                  <div className="mt-auto">
                    <div className="ec-event-indicator" />
                  </div>
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
              <img src={spotlight.image || spotlight.imageUrl || "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4"} className="ec-spot-img" alt="Spotlight" />
              <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, #0A0A0A, transparent)' }} />
              
              <div style={{ position: 'absolute', top: 20, left: 20 }}>
                 <span className="px-3 py-1 bg-black/60 backdrop-blur-md text-[#7DD4EF] border border-[#7DD4EF]/30 text-[10px] font-black uppercase tracking-widest rounded-lg">
                   {spotlight.tag || "Featured"}
                 </span>
              </div>
            </div>

            <div className="ec-spot-content">
              <h3 className="ec-spot-title">{spotlight.title}</h3>
              <p className="ec-spot-desc">{spotlight.description?.substring(0, 150)}{spotlight.description?.length > 150 ? '...' : ''}</p>
              
              <div className="ec-meta-box">
                <div className="ec-meta-item">
                  <Clock size={16} className="ec-meta-icon" /> 
                  <span className="text-white">{spotlight.time || "TBA"}</span>
                </div>
                <div className="ec-meta-item">
                  <MapPin size={16} className="ec-meta-icon" /> 
                  <span className="text-white line-clamp-1">{spotlight.location || "BMSCE Campus"}</span>
                </div>
                
                <button 
                  onClick={() => window.open(spotlight.registrationLink || "#", "_blank")}
                  className="ec-btn-primary"
                >
                  Register Now <ArrowRight size={14} />
                </button>
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center p-8 text-center bg-white/[0.02]">
            <CalendarIcon size={48} className="text-white/10 mb-6" />
            <h3 className="text-xl font-black text-white uppercase font-['Impact'] mb-2">No Events Selected</h3>
            <p className="text-[#7DD4EF] text-xs font-bold uppercase tracking-widest">
              Hover over a date<br/>to view details
            </p>
          </div>
        )}
      </aside>
    </div>
  );
}