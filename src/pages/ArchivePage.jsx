import React, { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Calendar, MapPin, ArrowLeft, Loader2 } from "lucide-react";
import eventService from "../api/eventService";

export default function ArchivePage() {
  const [allPastEvents, setAllPastEvents] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");
  const [fetchStatus, setFetchStatus] = useState("loading"); // 'loading', 'success', 'error'

  useEffect(() => {
    let isMounted = true;

    const fetchEverySingleEvent = async () => {
      try {
        let allFetchedEvents = [];
        let skip = 0;
        const limit = 50; // Fetches in safe batches of 50 until it gets all of them
        let hasMore = true;

        // Loop until the backend says there are no more events
        while (hasMore && isMounted) {
          const res = await eventService.getEvents(limit, skip);
          const data = res.data?.events || res.data?.data || res.data || [];
          
          if (data.length === 0) {
            hasMore = false; // We reached the end of the database
          } else {
            allFetchedEvents = [...allFetchedEvents, ...data];
            skip += limit;
            
            // If backend returned fewer events than our limit, we are at the end
            if (data.length < limit) {
              hasMore = false;
            }
          }
        }

        if (isMounted) {
          const today = new Date();
          
          // Filter out future events and sort from newest to oldest
          const past = allFetchedEvents
            .map(ev => ({
              ...ev,
              parsedDate: new Date(ev.date || ev.startDate || Date.now()),
              category: ev.tag || ev.categories?.[0] || "Event"
            }))
            .filter(ev => ev.parsedDate < today)
            .sort((a, b) => b.parsedDate - a.parsedDate);

          setAllPastEvents(past);
          setFetchStatus("success");
        }
      } catch (e) {
        console.error("Failed to fetch full archive:", e);
        if (isMounted) setFetchStatus("error");
      }
    };

    fetchEverySingleEvent();

    // Ensure page background stays immersive
    document.body.style.backgroundColor = '#000000';
    document.documentElement.style.backgroundColor = '#000000';

    return () => { isMounted = false; };
  }, []);

  // Instant Search & Category Filtering
  const filteredEvents = useMemo(() => {
    return allPastEvents.filter(ev => {
      const matchesSearch = ev.title.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCat = activeCategory === "All" || ev.category === activeCategory;
      return matchesSearch && matchesCat;
    });
  }, [searchQuery, activeCategory, allPastEvents]);

  // Dynamically generate category buttons based on the fetched data
  const categories = ["All", ...new Set(allPastEvents.map(e => e.category))];

  return (
    <main className="min-h-screen bg-[#030303] pt-32 pb-20 px-6 font-general overflow-x-hidden text-white">
      
      {/* Background Ambience */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[50vw] h-[50vw] bg-[#7DD4EF]/5 blur-[150px] rounded-full mix-blend-screen" />
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        
        {/* Navigation & Header */}
        <header className="mb-16">
          <button 
            onClick={() => window.history.back()}
            className="flex items-center gap-2 text-gray-500 hover:text-[#7DD4EF] transition-colors mb-8 uppercase text-[10px] font-bold tracking-[0.3em]"
          >
            <ArrowLeft size={14} /> Back to Events
          </button>
          
          {/* SIMPLIFIED HEADLINE */}
          <h1 className="text-6xl md:text-9xl font-normal text-white font-bebas-neue uppercase leading-none tracking-tighter">
            Past <span className="text-transparent bg-clip-text bg-gradient-to-r from-gray-500 to-gray-800">Events</span>
          </h1>
          <p className="mt-4 text-gray-400 font-general uppercase tracking-widest text-xs">
            {fetchStatus === "success" ? `Showing ${allPastEvents.length} Past Events` : 'Loading Events...'}
          </p>
        </header>

        {/* Filter & Search Bar */}
        <div className="flex flex-col md:flex-row gap-6 mb-12 items-center justify-between">
          <div className="relative w-full md:w-96">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
            <input 
              type="text" 
              placeholder="Search past events..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-white font-general focus:border-[#7DD4EF]/50 outline-none transition-all placeholder:text-gray-600"
            />
          </div>
          
          {/* Draggable/Scrollable Category Tabs */}
          <div className="flex gap-2 overflow-x-auto pb-2 w-full md:w-auto scrollbar-hide">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-6 py-2 rounded-full text-[10px] font-bold uppercase tracking-widest border transition-all whitespace-nowrap ${
                  activeCategory === cat 
                  ? "bg-[#7DD4EF] border-[#7DD4EF] text-black" 
                  : "bg-transparent border-white/10 text-gray-500 hover:border-white/30 hover:text-white"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Dynamic Grid / State Handling */}
        {fetchStatus === "loading" ? (
          <div className="flex flex-col items-center justify-center py-32">
            <Loader2 className="animate-spin text-[#7DD4EF] mb-4" size={40} />
            <p className="text-[#7DD4EF] uppercase tracking-[0.3em] font-bold text-xs animate-pulse">
              Loading All Events...
            </p>
          </div>
        ) : fetchStatus === "error" ? (
          <div className="py-32 text-center border border-dashed border-red-500/20 rounded-3xl bg-red-500/5">
            <p className="text-red-400 tracking-widest uppercase font-bold text-sm">Failed to load events from the database.</p>
          </div>
        ) : filteredEvents.length === 0 ? (
          <div className="py-32 text-center border border-dashed border-white/10 rounded-3xl bg-white/5">
            <p className="text-gray-500 tracking-widest uppercase font-bold text-sm">No events match your search.</p>
          </div>
        ) : (
          <AnimatePresence mode="popLayout">
            <motion.div 
              layout
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {filteredEvents.map((ev) => (
                <motion.div
                  layout
                  initial={{ opacity: 0, scale: 0.95, y: 20 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95, y: -20 }}
                  transition={{ duration: 0.4 }}
                  key={ev._id || ev.id}
                  className="group bg-[#0A0A0A] border border-white/10 rounded-3xl overflow-hidden hover:border-[#7DD4EF]/40 transition-all duration-300 hover:shadow-[0_10px_30px_rgba(125,212,239,0.1)] flex flex-col"
                >
                  {/* Event Image */}
                  <div className="h-56 overflow-hidden relative bg-gray-900 shrink-0">
                    <img 
                      src={ev.imageUrl || ev.image || "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4"} 
                      className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700 group-hover:scale-110" 
                      alt={ev.title}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0A] via-transparent to-transparent" />
                  </div>
                  
                  {/* Event Details */}
                  <div className="p-6 md:p-8 flex flex-col flex-1">
                    <div className="flex justify-between items-start mb-4">
                      <span className="text-[#7DD4EF] text-[9px] font-black uppercase tracking-widest border border-[#7DD4EF]/30 bg-[#7DD4EF]/10 px-3 py-1 rounded-md">
                        {ev.category}
                      </span>
                      <span className="text-gray-500 text-[10px] font-bold uppercase tracking-widest bg-white/5 px-2 py-1 rounded-md">
                        {ev.parsedDate.getFullYear()}
                      </span>
                    </div>
                    
                    <h3 className="text-2xl md:text-3xl font-normal font-bebas-neue text-white mb-3 uppercase tracking-wide group-hover:text-[#7DD4EF] transition-colors line-clamp-2">
                      {ev.title}
                    </h3>
                    
                    <p className="text-gray-400 text-sm leading-relaxed line-clamp-2 mb-6 font-general">
                      {ev.description}
                    </p>
                    
                    {/* Footer Meta */}
                    <div className="mt-auto pt-6 border-t border-white/5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-[10px] text-gray-400 font-bold uppercase tracking-widest">
                      <div className="flex items-center gap-2">
                        <Calendar size={12} className="text-[#7DD4EF]"/> 
                        {ev.parsedDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                      </div>
                      <div className="flex items-center gap-2">
                        <MapPin size={12} className="text-[#7DD4EF]"/> 
                        <span className="truncate max-w-[120px]">{ev.location || "BMSCE Campus"}</span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </AnimatePresence>
        )}
      </div>

      {/* Custom CSS to hide the ugly scrollbar on the filter tabs */}
      <style dangerouslySetInnerHTML={{__html: `
        .scrollbar-hide::-webkit-scrollbar { display: none; }
        .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
      `}} />
    </main>
  );
}