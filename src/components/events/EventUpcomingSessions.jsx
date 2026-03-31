import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Clock, MapPin, Ticket, CalendarPlus, Zap, ArrowRight } from "lucide-react";
import eventService from "../../api/eventService"; 

export default function EventUpcomingSessions({
  locationLabel = "BMSCE Campus",
}) {
  const [sessions, setSessions] = useState([]);
  const [fetchStatus, setFetchStatus] = useState("loading");
  const today = new Date();

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
            const eventsData = response.data?.events || response.data?.data || response.data || [];
            
            const mappedData = eventsData
              .map(item => {
                const eventDate = new Date(item.date || item.startDate || item.createdAt || Date.now());
                
                // Feature: Calculate if event is "Soon" (within 3 days)
                const timeDiff = eventDate.getTime() - today.getTime();
                const daysUntil = Math.ceil(timeDiff / (1000 * 3600 * 24));
                const isSoon = daysUntil <= 3 && daysUntil >= 0;

                return {
                  ...item,
                  parsedDate: eventDate,
                  title: item.title,
                  description: item.description,
                  day: item.day || eventDate.getDate().toString().padStart(2, '0'),
                  month: item.month || new Intl.DateTimeFormat('en-US', { month: 'short' }).format(eventDate),
                  time: item.time || "TBD",
                  location: item.location || "Main Campus",
                  tag: item.tag || item.categories?.[0] || "Session",
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

  // Animation variants
  const containerVars = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.15 } }
  };
  const itemVars = {
    hidden: { opacity: 0, x: -20 },
    show: { opacity: 1, x: 0, transition: { type: "spring", stiffness: 100 } }
  };

  return (
    <section className="bg-[#050505] py-24 relative overflow-hidden font-['General_Sans']">
      
      {/* Background Glow */}
      <div className="absolute top-40 right-0 w-[500px] h-[500px] bg-[#7DD4EF]/5 blur-[150px] rounded-full pointer-events-none" />

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
            <h2 className="text-6xl md:text-8xl font-black text-white leading-[0.85] tracking-tighter uppercase font-['Impact'] italic">
              Next <span className="text-transparent" style={{ WebkitTextStroke: "1px rgba(125,212,239,0.5)" }}>Up</span>
            </h2>
          </div>
          
          <div className="text-right hidden md:block">
            <p className="text-gray-500 text-sm font-bold uppercase tracking-widest">Active Schedule</p>
            <p className="text-white text-3xl font-black font-['Impact']">{fetchStatus === "success" ? sessions.length : "0"} <span className="text-[#7DD4EF] text-lg">NODES</span></p>
          </div>
        </header>

        {/* Content Area */}
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_3.5fr] gap-10">
          
          {/* Left: Sticky Info Column */}
          <div className="hidden lg:block relative">
            <div className="sticky top-32 space-y-6">
              <p className="text-gray-500 text-xs leading-relaxed font-medium uppercase tracking-widest border-l-2 border-[#7DD4EF]/30 pl-4">
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
                <p className="text-[#7DD4EF] text-xs font-bold tracking-[0.3em] uppercase animate-pulse">
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
                    
                    {/* Timeline Node (Hidden on very small screens) */}
                    <div className="absolute left-[34px] md:left-[54px] top-1/2 -translate-y-1/2 w-2.5 h-2.5 bg-[#050505] border-2 border-[#7DD4EF] rounded-full z-10 hidden sm:block shadow-[0_0_10px_rgba(125,212,239,0.5)]" />

                    {/* Digital Ticket Card */}
                    <div className="group flex flex-col md:flex-row bg-[#0A0A0A] border border-white/10 hover:border-[#7DD4EF]/40 rounded-3xl overflow-hidden transition-all duration-300 shadow-2xl hover:shadow-[0_20px_40px_-15px_rgba(125,212,239,0.1)] hover:-translate-y-1">
                      
                      {/* Left: Date Stub */}
                      <div className="flex md:flex-col justify-between md:justify-center items-center bg-white/5 md:w-32 p-6 md:p-0 border-b md:border-b-0 md:border-r border-dashed border-white/20 relative">
                        <div className="text-center">
                          <span className="block text-4xl md:text-5xl font-black text-white font-['Impact']">{session.day}</span>
                          <span className="block text-xs font-bold text-[#7DD4EF] uppercase tracking-widest mt-1">{session.month}</span>
                        </div>
                        {/* Semi-circle cutouts for ticket effect */}
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

                        <h3 className="text-2xl md:text-3xl font-black text-white mb-3 tracking-tight group-hover:text-[#7DD4EF] transition-colors">
                          {session.title}
                        </h3>
                        <p className="text-gray-400 text-sm leading-relaxed mb-6 line-clamp-2 max-w-2xl font-medium">
                          {session.description}
                        </p>

                        {/* Metadata & Actions */}
                        <div className="mt-auto flex flex-col xl:flex-row xl:items-center justify-between gap-6 pt-6 border-t border-white/5">
                          
                          <div className="flex flex-wrap items-center gap-6 text-gray-400 text-xs font-bold uppercase tracking-wider">
                            <span className="flex items-center gap-2"><Clock size={14} className="text-[#7DD4EF]" /> {session.time}</span>
                            <span className="flex items-center gap-2"><MapPin size={14} className="text-[#7DD4EF]" /> {session.location}</span>
                          </div>

                          <div className="flex items-center gap-3">
                            <button className="hidden sm:flex items-center justify-center p-3 rounded-xl bg-white/5 hover:bg-white/10 text-gray-300 transition-colors border border-white/5" title="Add to Calendar">
                              <CalendarPlus size={18} />
                            </button>
                            <button 
                              onClick={() => window.open(session.registrationLink, "_blank")}
                              className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-8 py-3 bg-[#7DD4EF] hover:bg-white text-black font-black uppercase text-[10px] tracking-widest rounded-xl transition-all duration-300"
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
    </section>
  );
}