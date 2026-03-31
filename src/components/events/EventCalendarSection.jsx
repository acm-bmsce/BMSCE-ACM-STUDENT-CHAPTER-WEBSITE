import React, { useState, useEffect, useMemo } from "react";
import eventService from "../../api/eventService"; 

const CSS = `

  *, *::before, *::after {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
  }

  :root {
    --bg:    #000000;
    --s1:    #0F0F16;
    --s2:    #15151E;
    --b0:    rgba(255,255,255,0.05);
    --b1:    rgba(255,255,255,0.09);
    --b2:    rgba(255,255,255,0.16);
    --t0:    #EAF7FF;
    --t1:    rgba(234,247,255,0.6);
    --t2:    rgba(234,247,255,0.35);
    --t3:    rgba(234,247,255,0.18);
    --ac:    #7DD4EF;
    --ac-bg: rgba(125,212,239,0.12);
    --ac-br: rgba(125,212,239,0.3);
  }

  html, body {
    width: 100%;
    height: 100%;
    background: transparent;
    color: var(--t0);
    font-family: 'General Sans', sans-serif;
  }

  .ec-page {
  width: 100%;
  max-width: 1400px;
  margin: 0 auto;

  display: flex;
  flex-direction: column;   /* 🔥 mobile first */
  align-items: stretch;

  padding: 16px;
  gap: 16px;

  background: var(--bg);
}

/* Desktop */
@media (min-width: 768px) {
  .ec-page {
    flex-direction: row;
    padding: clamp(24px, 2.4vw, 56px);
    gap: 2vw;

    aspect-ratio: 16 / 9;     /* only desktop */
    max-height: 100vh;
    overflow: hidden;
  }
}

  .ec-pill {
    display: inline-flex;
    align-items: center;
    gap: 5px;
    background: var(--ac-bg);
    border: 0.5px solid var(--ac-br);
    border-radius: 999px;
    padding: 3px 11px;
    font-size: 0.65vw;
    font-weight: 600;
    letter-spacing: 0.18em;
    text-transform: uppercase;
    color: var(--ac);
  }

  .ec-pill-dot {
    width: 4px;
    height: 4px;
    border-radius: 50%;
    background: var(--ac);
    flex-shrink: 0;
    display: inline-block;
  }

  .ec-cal-card {
    flex: 1;
    background: var(--s1);
    border: 0.5px solid var(--b1);
    border-radius: 18px;
    overflow: hidden;
    display: flex;
    flex-direction: column;
  }

  .ec-cal-top {
    padding: 1.5vw 1.8vw 1.2vw;
    border-bottom: 0.5px solid var(--b0);
    flex-shrink: 0;
  }

  .ec-cal-top-inner {
    display: flex;
    align-items: flex-end;
    justify-content: space-between;
  }

  .ec-month-title {
    font-family: Impact, 'Arial Narrow', sans-serif;
    font-size: 4.2vw;
    color: var(--t0);
    letter-spacing: 0.01em;
    line-height: 1;
    margin: 0.6vw 0 0.3vw;
    text-transform: uppercase;
  }

  .ec-month-sub {
    font-size: 0.65vw;
    letter-spacing: 0.22em;
    text-transform: uppercase;
    color: var(--t2);
    font-weight: 500;
  }

  .ec-navs {
    display: flex;
    gap: 0.4vw;
  }

  .ec-nav-btn {
    width: 2vw;
    height: 2vw;
    border-radius: 999px;
    border: 0.5px solid var(--b2);
    background: transparent;
    color: var(--t1);
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: border-color 0.15s, color 0.15s;
    padding: 0;
    font-family: 'General Sans', sans-serif;
  }

  .ec-nav-btn:hover {
    border-color: var(--ac-br);
    color: var(--ac);
  }

  .ec-wdrow {
    display: grid;
    grid-template-columns: repeat(7, 1fr);
    border-bottom: 0.5px solid var(--b0);
    flex-shrink: 0;
  }

  .ec-wd {
    padding: 0.6vw 0;
    text-align: center;
    font-size: 0.55vw;
    font-weight: 600;
    letter-spacing: 0.2em;
    text-transform: uppercase;
    color: var(--t3);
  }

  .ec-cgrid {
    display: grid;
    grid-template-columns: repeat(7, 1fr);
    flex: 1;
  }

  .ec-c {
    border-right: 0.5px solid var(--b0);
    border-bottom: 0.5px solid var(--b0);
    padding: 0.55vw 0.7vw;
    position: relative;
    transition: background 0.12s;
    background: transparent;
    display: flex;
    flex-direction: column;
    cursor: default;
  }

  .ec-c:hover {
    background: rgba(255,255,255,0.025);
  }

  .ec-c--empty {
    background: rgba(0,0,0,0.25) !important;
    pointer-events: none;
  }

  .ec-c--weekend {
    background: rgba(0,0,0,0.15);
  }

  .ec-c--today {
    background: rgba(125,212,239,0.08);
  }

  .ec-c--focus {
    background: rgba(125,212,239,0.1);
  }

  .ec-cnum {
    font-family: Impact, 'Arial Narrow', sans-serif;
    font-size: 1.1vw;
    color: var(--t1);
    font-weight: 400;
    line-height: 1.1;
    letter-spacing: 0.01em;
  }

  .ec-cnum--accent {
    font-family: Impact, 'Arial Narrow', sans-serif;
    font-size: 1.1vw;
    color: var(--ac);
    font-weight: 400;
    line-height: 1.1;
    letter-spacing: 0.01em;
  }

  .ec-today-wrap {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .ec-today-label {
    font-size: 0.5vw;
    letter-spacing: 0.18em;
    text-transform: uppercase;
    color: var(--ac);
    font-weight: 600;
  }

  .ec-today-line {
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    height: 1.5px;
    background: var(--ac);
    opacity: 0.5;
  }

  .ec-focus-top {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
  }

  .ec-focus-tag {
    font-size: 0.5vw;
    letter-spacing: 0.13em;
    text-transform: uppercase;
    color: var(--ac);
    background: var(--ac-bg);
    border: 0.5px solid var(--ac-br);
    border-radius: 6px;
    padding: 1px 5px;
    font-weight: 600;
  }

  .ec-focus-title {
    position: absolute;
    bottom: 0.55vw;
    left: 0.7vw;
    font-size: 0.5vw;
    font-weight: 600;
    letter-spacing: 0.16em;
    text-transform: uppercase;
    color: var(--ac);
  }

  .ec-focus-bar {
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    height: 1.5px;
    background: var(--ac);
    opacity: 0.45;
  }

  .ec-epip {
    margin-top: 0.4vw;
    display: flex;
    align-items: center;
    gap: 0.35vw;
    font-size: 0.55vw;
    color: var(--t2);
    letter-spacing: 0.07em;
    font-weight: 500;
  }

  .ec-pip {
    width: 3px;
    height: 3px;
    border-radius: 50%;
    background: var(--ac);
    flex-shrink: 0;
    display: inline-block;
  }

  .ec-aside {
  width: 100%;
  display: flex;
  flex-direction: column;
}

/* Desktop */
@media (min-width: 768px) {
  .ec-aside {
    width: 22vw;
    flex-shrink: 0;
  }
}

  .ec-evt-card {
    background: var(--s1);
    border: 0.5px solid var(--b1);
    border-radius: 18px;
    overflow: hidden;
    display: flex;
    flex-direction: column;
    height: 100%;
  }

  .ec-evt-img {
    flex: 1;
    position: relative;
    overflow: hidden;
    min-height: 0;
  }

  .ec-evt-img-el {
    width: 100%;
    height: 100%;
    object-fit: cover;
    display: block;
    filter: brightness(0.7);
  }

  .ec-evt-overlay {
    position: absolute;
    inset: 0;
    background: linear-gradient(to top, rgba(8,8,13,0.88) 0%, rgba(8,8,13,0.1) 55%);
  }

  .ec-evt-badge {
    position: absolute;
    top: 1vw;
    left: 1vw;
    background: rgba(8,8,13,0.65);
    border: 0.5px solid var(--b2);
    border-radius: 6px;
    padding: 0.25vw 0.65vw;
    font-size: 0.6vw;
    letter-spacing: 0.15em;
    text-transform: uppercase;
    color: #EAF7FF;
    font-weight: 600;
  }

  .ec-evt-datestamp {
    position: absolute;
    bottom: 1.2vw;
    left: 1.2vw;
  }

  .ec-evt-ds-day {
    font-family: Impact, 'Arial Narrow', sans-serif;
    font-size: 3.2vw;
    color: #EAF7FF;
    line-height: 1;
    letter-spacing: 0.02em;
  }

  .ec-evt-ds-rest {
    font-size: 0.6vw;
    letter-spacing: 0.2em;
    text-transform: uppercase;
    color: rgba(234,247,255,0.7);
    font-weight: 500;
    margin-top: 0.2vw;
  }

  .ec-evt-body {
    padding: 1.2vw 1.3vw 1.3vw;
    flex-shrink: 0;
  }

  .ec-evt-title {
    font-family: Impact, 'Arial Narrow', sans-serif;
    font-size: 1.6vw;
    color: var(--t0);
    letter-spacing: 0.02em;
    text-transform: uppercase;
    margin-bottom: 0.5vw;
    line-height: 1.1;
  }

  .ec-evt-desc {
    font-size: 0.7vw;
    color: var(--t1);
    line-height: 1.65;
    font-weight: 400;
    margin-bottom: 1vw;
  }

  .ec-evt-meta {
    border-top: 0.5px solid var(--b0);
    padding-top: 0.8vw;
    display: flex;
    flex-direction: column;
    gap: 0.6vw;
  }

  .ec-meta-row {
    display: flex;
    align-items: center;
    gap: 0.6vw;
  }

  .ec-meta-icon {
    width: 1.6vw;
    height: 1.6vw;
    border-radius: 8px;
    border: 0.5px solid var(--b1);
    background: var(--s2);
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
  }

  .ec-meta-label {
    font-size: 0.5vw;
    letter-spacing: 0.15em;
    text-transform: uppercase;
    color: var(--t2);
    font-weight: 600;
    margin-bottom: 1px;
  }

  .ec-meta-val {
    font-size: 0.7vw;
    color: var(--t0);
    font-weight: 500;
  }
`;

const WEEKDAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

function useInjectStyles(css, id) {
  useEffect(() => {
    if (document.getElementById(id)) return;
    const tag = document.createElement("style");
    tag.id = id;
    tag.textContent = css;
    document.head.appendChild(tag);
    return () => {
      const existing = document.getElementById(id);
      if (existing) existing.remove();
    };
  }, [css, id]);
}


function IconChevronLeft() { return (<svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M7.5 2L4 6l3.5 4" stroke="currentColor" strokeWidth="1.1" strokeLinecap="round" strokeLinejoin="round" /></svg>); }
function IconChevronRight() { return (<svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M4.5 2L8 6l-3.5 4" stroke="currentColor" strokeWidth="1.1" strokeLinecap="round" strokeLinejoin="round" /></svg>); }
function IconClock() { return (<svg width="11" height="11" viewBox="0 0 11 11" fill="none"><circle cx="5.5" cy="5.5" r="4.2" stroke="rgba(240,238,233,0.45)" strokeWidth="0.8" /><path d="M5.5 3v2.5l1.7 1.3" stroke="rgba(240,238,233,0.45)" strokeWidth="0.8" strokeLinecap="round" /></svg>); }
function IconPin() { return (<svg width="11" height="11" viewBox="0 0 11 11" fill="none"><path d="M5.5 1C3.8 1 2.5 2.3 2.5 4c0 2.1 3 6 3 6s3-3.9 3-6c0-1.7-1.3-3-3-3Z" stroke="rgba(240,238,233,0.45)" strokeWidth="0.8" /><circle cx="5.5" cy="4" r="0.9" fill="rgba(240,238,233,0.45)" /></svg>); }


function Pill() { return (<div className="ec-pill"><span className="ec-pill-dot" />Academic Calendar</div>); }
function NavButton({ label, disabled, onClick, children }) {
  return (
    <button className="ec-nav-btn" aria-label={label} onClick={onClick} disabled={disabled} type="button" style={{ opacity: disabled ? 0.3 : 1, cursor: disabled ? "default" : "pointer" }}>
      {children}
    </button>
  );
}
function EventPip({ label }) { return (<div className="ec-epip"><span className="ec-pip" />{label}</div>); }
function EmptyCell({ isWeekend }) { const cls = isWeekend ? "ec-c ec-c--empty ec-c--weekend" : "ec-c ec-c--empty"; return <div className={cls} />; }
function RegularCell({ day, isWeekend, events }) { const cls = isWeekend ? "ec-c ec-c--weekend" : "ec-c"; return (<div className={cls}><div className="ec-cnum">{day}</div>{events?.[0] !== undefined && <EventPip label={events[0]} />}</div>); }
function TodayCell({ day, events }) { return (<div className="ec-c ec-c--today"><div className="ec-today-wrap"><span className="ec-cnum--accent">{day}</span><span className="ec-today-label">Today</span></div>{events?.[0] !== undefined && <EventPip label={events[0]} />}<span className="ec-today-line" /></div>); }
function FocusCell({ day, focusLabel }) { return (<div className="ec-c ec-c--focus"><div className="ec-focus-top"><span className="ec-cnum--accent">{day}</span><span className="ec-focus-tag">Focus</span></div>{focusLabel !== undefined && <span className="ec-focus-title">{focusLabel}</span>}<span className="ec-focus-bar" /></div>); }
function DayCell({ cell }) {
  if (cell.type === "empty") return <EmptyCell isWeekend={cell.isWeekend} />;
  if (cell.isToday === true) return <TodayCell day={cell.day} events={cell.events} />;
  if (cell.isFocus === true) return <FocusCell day={cell.day} focusLabel={cell.focusLabel} />;
  return <RegularCell day={cell.day} isWeekend={cell.isWeekend} events={cell.events} />;
}
function CalendarTopBar({ monthLabel, semesterLabel, isLoading, onPrevMonth, onNextMonth }) {
  return (
    <div className="ec-cal-top">
      <div className="ec-cal-top-inner">
        <div>
          <Pill />
          <div className="ec-month-title">{monthLabel}</div>
          <div className="ec-month-sub">{semesterLabel}</div>
        </div>
        <div className="ec-navs">
          <NavButton label="Previous month" disabled={isLoading} onClick={onPrevMonth}><IconChevronLeft /></NavButton>
          <NavButton label="Next month" disabled={isLoading} onClick={onNextMonth}><IconChevronRight /></NavButton>
        </div>
      </div>
    </div>
  );
}
function WeekdayHeaderRow() { return (<div className="ec-wdrow">{WEEKDAYS.map((day) => (<div key={day} className="ec-wd">{day}</div>))}</div>); }
function DayGrid({ cells }) { return (<div className="ec-cgrid">{cells.map((cell, index) => (<DayCell key={index} cell={cell} />))}</div>); }
function CalendarCard({ monthLabel, semesterLabel, cells, isLoading, fetchStatus, onPrevMonth, onNextMonth }) {
  return (
    <div className="ec-cal-card">
      <CalendarTopBar monthLabel={monthLabel} semesterLabel={semesterLabel} isLoading={isLoading} onPrevMonth={onPrevMonth} onNextMonth={onNextMonth} />
      <WeekdayHeaderRow />
      
      
      {fetchStatus === "loading" || fetchStatus === "waking" ? (
        <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", color: "var(--ac)" }}>
           <div style={{ width: 24, height: 24, border: "2px solid var(--ac)", borderTopColor: "transparent", borderRadius: "50%", animation: "spin 1s linear infinite", marginBottom: 12 }} />
           <p style={{ fontSize: '0.8vw', letterSpacing: '0.1em' }}>
             {fetchStatus === "waking" ? "Waking up server..." : "Loading events..."}
           </p>
           <style>{`@keyframes spin { 100% { transform: rotate(360deg); } }`}</style>
        </div>
      ) : fetchStatus === "error" ? (
        <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", color: "#ff6b6b", fontSize: '0.8vw' }}>
          <p>Failed to load calendar data. Please try again.</p>
        </div>
      ) : (
        <DayGrid cells={cells} />
      )}
    </div>
  );
}
function EventImageSection({ imageUrl, alt, badge, day, monthLabel }) {
  return (
    <div className="ec-evt-img">
      <img className="ec-evt-img-el" src={imageUrl} alt={alt} onError={(e) => { e.target.src = "https://placehold.co/600x400/0f172a/f8fafc?text=Event"; }} />
      <div className="ec-evt-overlay" />
      <div className="ec-evt-badge">{badge}</div>
      <div className="ec-evt-datestamp">
        <div className="ec-evt-ds-day">{day}</div>
        <div className="ec-evt-ds-rest">{monthLabel}</div>
      </div>
    </div>
  );
}
function MetaRow({ icon, label, value }) { return (<div className="ec-meta-row"><div className="ec-meta-icon">{icon}</div><div><div className="ec-meta-label">{label}</div><div className="ec-meta-val">{value}</div></div></div>); }
function EventBodySection({ titleLine1, titleLine2, description, time, location }) {
  return (
    <div className="ec-evt-body">
      <div className="ec-evt-title">{titleLine1}<br />{titleLine2}</div>
      <p className="ec-evt-desc">{description}</p>
      <div className="ec-evt-meta">
        <MetaRow icon={<IconClock />} label="Time" value={time} />
        <MetaRow icon={<IconPin />} label="Location" value={location} />
      </div>
    </div>
  );
}
function EventCard({ spotlight }) {
  return (
    <div className="ec-evt-card">
      <EventImageSection imageUrl={spotlight.imageUrl} alt={`${spotlight.titleLine1} ${spotlight.titleLine2}`} badge={spotlight.badge} day={spotlight.day} monthLabel={spotlight.monthLabel} />
      <EventBodySection titleLine1={spotlight.titleLine1} titleLine2={spotlight.titleLine2} description={spotlight.description} time={spotlight.time} location={spotlight.location} />
    </div>
  );
}


export default function EventCalendar() {
  useInjectStyles(CSS, "event-calendar-styles");

  
  const [allEvents, setAllEvents] = useState([]);
  const [fetchStatus, setFetchStatus] = useState("loading"); // 'loading' | 'waking' | 'success' | 'error'
  const [viewDate, setViewDate] = useState(new Date());

  
  useEffect(() => {
    let isMounted = true;

    const fetchAllEvents = async () => {
      let attempts = 0;
      const maxAttempts = 15; 

      while (attempts < maxAttempts && isMounted) {
        try {
          if (attempts === 1) setFetchStatus("waking");

          
          const response = await eventService.getEvents(100, 0); 
          
          if (isMounted) {
            
            const eventsData = response.data?.events || response.data?.data || response.data || [];
            setAllEvents(Array.isArray(eventsData) ? eventsData : []);
            setFetchStatus("success");
          }
          return;
        } catch (error) {
          attempts++;
          console.warn(`Server sleeping... Retrying request (${attempts}/${maxAttempts})`);
          
          if (attempts >= maxAttempts && isMounted) {
            console.error("Calendar fetch failed: Backend unresponsive.");
            setFetchStatus("error");
            return;
          }
          
          await new Promise(resolve => setTimeout(resolve, 3000));
        }
      }
    };

    fetchAllEvents();
    return () => { isMounted = false; };
  }, []);

  
  const handlePrevMonth = () => {
    setViewDate((prev) => new Date(prev.getFullYear(), prev.getMonth() - 1, 1));
  };
  const handleNextMonth = () => {
    setViewDate((prev) => new Date(prev.getFullYear(), prev.getMonth() + 1, 1));
  };

  
  const { cells, spotlightEvents } = useMemo(() => {
    const year = viewDate.getFullYear();
    const month = viewDate.getMonth();
    
    
    const firstDay = new Date(year, month, 1);
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    
    
    let startOffset = firstDay.getDay() - 1;
    if (startOffset < 0) startOffset = 6; 

    
    const currentMonthEvents = allEvents.filter(ev => {
      const evDate = new Date(ev.date || ev.startDate || ev.createdAt);
      return evDate.getFullYear() === year && evDate.getMonth() === month;
    });

    const generatedCells = [];
    const today = new Date();

    
    for (let i = 0; i < startOffset; i++) {
      generatedCells.push({ type: "empty", isWeekend: i >= 5 });
    }

    
    for (let d = 1; d <= daysInMonth; d++) {
      const currentCellDate = new Date(year, month, d);
      const dayOfWeek = currentCellDate.getDay();
      const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
      const isToday = today.getFullYear() === year && today.getMonth() === month && today.getDate() === d;

      
      const dayEvents = currentMonthEvents.filter(ev => new Date(ev.date || ev.startDate || ev.createdAt).getDate() === d);
      const eventTitles = dayEvents.map(e => e.title || "Event");

      generatedCells.push({
        type: "day",
        day: d,
        isWeekend,
        isToday,
        isFocus: dayEvents.length > 0, 
        focusLabel: eventTitles[0],
        events: eventTitles
      });
    }

    
    while (generatedCells.length % 7 !== 0) {
      generatedCells.push({ type: "empty", isWeekend: generatedCells.length % 7 >= 5 });
    }

    return { cells: generatedCells, spotlightEvents: currentMonthEvents };
  }, [viewDate, allEvents]);


  
  const monthFormatter = new Intl.DateTimeFormat('en-US', { month: 'long', year: 'numeric' });
  const monthLabel = monthFormatter.format(viewDate);
  const semesterLabel = "BMSCE Chapter Calendar";

  
  let spotlightConfig;
  if (fetchStatus !== "success") {
    spotlightConfig = {
      day: "-",
      monthLabel: "TBD",
      badge: fetchStatus === "loading" || fetchStatus === "waking" ? "Loading..." : "Error",
      titleLine1: "Fetching",
      titleLine2: "Events...",
      description: "Please hold on while we sync the latest schedule.",
      imageUrl: "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=800&q=80",
      time: "--:--",
      location: "Campus",
    };
  } else if (spotlightEvents.length > 0) {
    
    const nextEv = spotlightEvents[0];
    const evDate = new Date(nextEv.date || nextEv.startDate || nextEv.createdAt);
    

    const titleWords = (nextEv.title || "Upcoming Event").split(" ");
    const line1 = titleWords.length > 1 ? titleWords.slice(0, Math.ceil(titleWords.length / 2)).join(" ") : titleWords[0];
    const line2 = titleWords.length > 1 ? titleWords.slice(Math.ceil(titleWords.length / 2)).join(" ") : "";

    spotlightConfig = {
      day: evDate.getDate(),
      monthLabel: new Intl.DateTimeFormat('en-US', { month: 'short' }).format(evDate),
      badge: nextEv.tag || "Spotlight",
      titleLine1: line1,
      titleLine2: line2,
      description: nextEv.description || "Join us for this upcoming session.",
      imageUrl: nextEv.imageUrl || "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=800&q=80",
      time: nextEv.time || "TBD",
      location: nextEv.location || "TBD",
    };
  } else {
    
    spotlightConfig = {
      day: "-",
      monthLabel: new Intl.DateTimeFormat('en-US', { month: 'short' }).format(viewDate),
      badge: "Quiet Month",
      titleLine1: "No Events",
      titleLine2: "Scheduled",
      description: "There are no events planned for this month yet. Check back later!",
      imageUrl: "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=800&q=80",
      time: "--:--",
      location: "TBD",
    };
  }

  return (
    <div className="ec-page">
      <CalendarCard
        monthLabel={monthLabel}
        semesterLabel={semesterLabel}
        cells={cells}
        isLoading={fetchStatus === "loading" || fetchStatus === "waking"}
        fetchStatus={fetchStatus}
        onPrevMonth={handlePrevMonth}
        onNextMonth={handleNextMonth}
      />
      <aside className="ec-aside">
        <EventCard spotlight={spotlightConfig} />
      </aside>
    </div>
  );
}