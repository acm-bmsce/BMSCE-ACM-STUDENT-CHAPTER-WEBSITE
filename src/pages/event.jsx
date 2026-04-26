import { useMemo, useState, useEffect } from "react";
import { motion } from "framer-motion";
import SEO from "../components/SEO";
import eventService from "../api/eventService"; 

import EventTitleSection from "../components/events/EventTitleSection";
import EventFeaturedSection from "../components/events/EventFeaturedSection";
import EventCalendarSection from "../components/events/EventCalendarSection";
import EventUpcomingSessions from "../components/events/EventUpcomingSessions";
import EventPastSessions from "../components/events/EventPastSessions";

const parseDate = (date) => {
  const parsed = new Date(date);
  return Number.isNaN(parsed.getTime()) ? null : parsed;
};


const buildCalendarCells = (monthAnchor, events, focusLabel, today) => {
  const year = monthAnchor.getFullYear();
  const month = monthAnchor.getMonth();
  const firstOfMonth = new Date(year, month, 1);
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  let startIndex = firstOfMonth.getDay() - 1;
  if (startIndex < 0) startIndex = 6;
  
  const totalCells = Math.ceil((startIndex + daysInMonth) / 7) * 7;
  const eventCounts = new Map();
  
  events
    .map((evt) => parseDate(evt.date || evt.startDate || evt.createdAt))
    .filter((d) => d !== null && d.getFullYear() === year && d.getMonth() === month)
    .forEach((d) => {
      const day = d.getDate();
      eventCounts.set(day, (eventCounts.get(day) || 0) + 1);
    });

  const focusDate = events
    .map((evt) => parseDate(evt.date || evt.startDate || evt.createdAt))
    .filter((d) => d !== null)
    .find((d) => d.getFullYear() === year && d.getMonth() === month);

  return Array.from({ length: totalCells }, (_, index) => {
    const dayNumber = index - startIndex + 1;
    const isWeekend = index % 7 >= 5;
    if (dayNumber < 1 || dayNumber > daysInMonth) return { type: "empty", isWeekend };

    const isToday = today.getFullYear() === year && today.getMonth() === month && today.getDate() === dayNumber;
    const isFocus = Boolean(focusDate) && focusDate.getDate() === dayNumber && !isToday;
    const count = eventCounts.get(dayNumber) || 0;

    return {
      type: "day",
      day: dayNumber,
      isWeekend,
      isToday,
      isFocus,
      focusLabel: isFocus ? focusLabel : undefined,
      events: count > 0 ? [`${count} event${count > 1 ? "s" : ""}`] : undefined,
    };
  });
};


const scrollRevealConfig = {
  initial: { opacity: 0, y: 30 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-50px" },
  transition: { type: "tween", ease: "easeOut", duration: 0.5 }
};

export default function EventPage() {
  const [allEvents, setAllEvents] = useState([]);
  const [fetchStatus, setFetchStatus] = useState("loading"); 
  const [monthOffset, setMonthOffset] = useState(0);
  const today = new Date();

  
  useEffect(() => {
    let isMounted = true;
    
    const originalHtmlBg = document.documentElement.style.backgroundColor;
    const originalBodyBg = document.body.style.backgroundColor;

    document.documentElement.style.overflowY = 'auto';
    document.body.style.overflowY = 'auto';
    document.documentElement.style.backgroundColor = '#000000';
    document.body.style.backgroundColor = '#000000';

    const fetchProgressively = async () => {
      try {
        let skip = 0;
        const limit = 20; 
        let hasMore = true;
        
        if (isMounted) setFetchStatus("waking");

        while (hasMore && isMounted) {
          const res = await eventService.getEvents(limit, skip);
          const data = res.data?.events || res.data?.data || res.data || [];
          
          if (data.length > 0 && isMounted) {
            setAllEvents(prev => {
              const combined = [...prev, ...data];
              
              const uniqueEvents = Array.from(new Map(combined.map(item => [item._id || item.id, item])).values());
              return uniqueEvents;
            });
            
            setFetchStatus("success"); 
            skip += limit;
          }

          if (data.length < limit) {
            hasMore = false;
          }
        }
      } catch (error) {
        console.error("Failed to fetch events:", error);
        if (allEvents.length === 0 && isMounted) setFetchStatus("error");
      }
    };

    fetchProgressively();

    return () => { 
      isMounted = false; 
      document.documentElement.style.backgroundColor = originalHtmlBg;
      document.body.style.backgroundColor = originalBodyBg;
    };
  }, []); 

  const derived = useMemo(() => {
    const normalized = allEvents.map((evt, index) => ({
      ...evt,
      _id: evt._id || evt.id || `event-${index}`,
      title: evt.title || "Elite Tech Session",
      date: evt.date || evt.startDate || evt.createdAt || Date.now(),
      description: evt.description || "Join our flagship ACM event.",
      location: evt.location || "BMSCE Campus",
      image: evt.imageUrl || evt.image || "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4",
      is_featured: evt.is_featured || evt.featured || false,
      parsedDate: parseDate(evt.date || evt.startDate || evt.createdAt || Date.now()),
    }));

    const sorted = normalized.filter((item) => item.parsedDate !== null).sort((a, b) => a.parsedDate - b.parsedDate);
    const upcoming = sorted.filter((item) => item.parsedDate >= today);
    const past = [...sorted].filter((item) => item.parsedDate < today).reverse();
    const feat = normalized.find((e) => e.is_featured) || upcoming[0] || normalized[0];

    const monthAnchor = new Date(today.getFullYear(), today.getMonth() + monthOffset, 1);
    const cells = buildCalendarCells(monthAnchor, normalized, feat?.title, today);

    const featuredCard = feat ? {
      ...feat,
      imageSecondary: normalized[1]?.image,
      imageTertiary: normalized[2]?.image,
      registrationLink: feat.registrationLink || feat.registration_link || "#",
    } : null;

    return {
      featuredCard,
      cells,
      monthLabel: monthAnchor.toLocaleDateString("en-IN", { month: "long", year: "numeric" }).toUpperCase(),
      semesterLabel: "ACADEMIC CALENDAR",
      sessionCards: upcoming,
      pastSessionCards: past,
      spotlight: feat,
    };
  }, [monthOffset, allEvents]);

  return (
    <main className="relative min-h-screen w-full bg-[#000000] text-white selection:bg-[#7DD4EF] selection:text-black font-general overflow-x-hidden">
      <SEO title="Events | BMSCE ACM" description="View our featured events, academic calendar, and upcoming technical sessions." />

      <div 
        className="fixed inset-0 z-0 pointer-events-none" 
        style={{ 
          background: 'radial-gradient(circle at 20% 0%, rgba(125, 212, 239, 0.05) 0%, transparent 40%), radial-gradient(circle at 80% 100%, rgba(30, 58, 138, 0.08) 0%, transparent 40%)',
          transform: 'translateZ(0)' 
        }} 
      />

      {fetchStatus === "loading" || fetchStatus === "waking" ? (
        <motion.div 
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          className="relative z-10 flex flex-col items-center justify-center min-h-screen px-4"
        >
          <div className="relative w-20 h-20 mb-8">
            <div className="absolute inset-0 border-4 border-white/10 rounded-full"></div>
            <div className="absolute inset-0 border-4 border-[#7DD4EF] border-t-transparent rounded-full animate-spin"></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-2 h-2 bg-[#7DD4EF] rounded-full animate-ping"></div>
            </div>
          </div>
          <h2 className="text-4xl md:text-6xl font-normal text-white mb-4 tracking-tighter uppercase font-bebas-neue text-center drop-shadow-[0_0_15px_rgba(125,212,239,0.3)]">
            {fetchStatus === "waking" ? "System Booting" : "Syncing Nodes"}
          </h2>
          {fetchStatus === "waking" && (
            <p className="text-[#7DD4EF] text-xs md:text-sm font-general tracking-[0.3em] uppercase text-center max-w-md animate-pulse">
              Establishing secure connection...
            </p>
          )}
        </motion.div>
      ) : fetchStatus === "error" ? (
        <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-4">
          <p className="text-5xl font-normal text-[#ff6b6b] uppercase font-bebas-neue tracking-tighter text-center">Connection Terminated</p>
          <p className="text-gray-400 mt-4 text-sm font-general tracking-widest uppercase">The backend server is unresponsive.</p>
          <button 
            onClick={() => window.location.reload()} 
            className="mt-10 px-8 py-4 bg-white/5 hover:bg-white/10 border border-white/10 text-white rounded-2xl uppercase tracking-[0.2em] font-general text-xs transition-all"
          >
            Reboot Sequence
          </button>
        </div>
      ) : (
        <div className="relative z-10 flex flex-col">
          
          <motion.section 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            transition={{ duration: 0.6 }} 
            className="relative w-full will-change-transform will-change-opacity"
          >
            <EventTitleSection featured={derived.featuredCard} />
          </motion.section>

          <motion.section {...scrollRevealConfig} className="relative w-full rounded-t-[40px] md:rounded-t-[80px] bg-[#0A0A0A] border-t border-white/5 mt-10 shadow-[0_-20px_50px_rgba(0,0,0,0.5)] will-change-transform will-change-opacity">
            <EventUpcomingSessions sessions={derived.sessionCards} locationLabel="BMSCE Campus" />
          </motion.section>


          <motion.section {...scrollRevealConfig} className="relative w-full py-16 will-change-transform will-change-opacity">
            <EventCalendarSection
              monthLabel={derived.monthLabel}
              semesterLabel={derived.semesterLabel}
              cells={derived.cells}
              spotlight={derived.spotlight}
              onPrevMonth={() => setMonthOffset((prev) => prev - 1)}
              onNextMonth={() => setMonthOffset((prev) => prev + 1)}
            />
          </motion.section>

          <motion.section {...scrollRevealConfig} className="relative w-full will-change-transform will-change-opacity">
            <EventFeaturedSection />
          </motion.section>

          <motion.section {...scrollRevealConfig} className="relative w-full bg-[#0A0A0A] will-change-transform will-change-opacity">
            <EventPastSessions sessions={derived.pastSessionCards} locationLabel="BMSCE Campus" />
          </motion.section>

          <div className="py-24 text-center bg-[#0A0A0A]">
            <div className="w-2 h-2 bg-[#7DD4EF]/50 rounded-full mx-auto mb-4 animate-pulse" />
            <p className="text-gray-600 text-[9px] uppercase tracking-[0.5em] font-general">End of Directory</p>
          </div>

        </div>
      )}
    </main>
  );
}