import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ArrowUpRight, Calendar, MapPin } from "lucide-react";
import eventService from "../../api/eventService";

export default function EventPastSessions() {
  const [sessions, setSessions] = useState([]);
  const [fetchStatus, setFetchStatus] = useState("loading");

  useEffect(() => {
    let isMounted = true;
    const fetchArchivePreview = async () => {
      let attempts = 0;
      while (attempts < 15 && isMounted) {
        try {
          if (attempts === 1) setFetchStatus("waking");
          
          // Fetch a batch to get the most recent past events
          const res = await eventService.getEvents(30, 0);
          if (isMounted) {
            const data = res.data?.events || res.data || [];
            const today = new Date();
            
            const archive = data
              .map(ev => ({
                ...ev,
                parsedDate: new Date(ev.date || ev.startDate || Date.now())
              }))
              .filter(ev => ev.parsedDate < today)
              .sort((a, b) => b.parsedDate - a.parsedDate)
              .slice(0, 3); // ONLY TAKE THE TOP 3 FOR THE PREVIEW
            
            setSessions(archive);
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
    fetchArchivePreview();
    return () => { isMounted = false; };
  }, []);

  // Framer Motion Variants
  const containerVars = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.2 } }
  };
  const cardVars = {
    hidden: { opacity: 0, y: 30 },
    show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 100 } }
  };

  const placeholderImg = "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=800&q=80";

  return (
    <section className="bg-[#030303] py-32 relative overflow-hidden font-general">
      {/* Background Ambience */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[300px] bg-[#7DD4EF]/5 blur-[120px] rounded-full pointer-events-none mix-blend-screen" />

      <div className="max-w-7xl mx-auto px-6 lg:px-10 relative z-10">
        
        {/* Header */}
        <header className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-20 border-b border-white/10 pb-10">
          <div className="space-y-4">
            <div className="flex items-center gap-4 mb-2">
               <span className="h-px w-12 bg-[#7DD4EF]"></span>
               <span className="text-[#7DD4EF] text-[10px] font-bold uppercase tracking-[0.4em]">Legacy Nodes</span>
            </div>
            <h2 className="text-6xl md:text-8xl font-normal text-white uppercase font-bebas-neue tracking-tighter">
              Past <span className="text-transparent bg-clip-text bg-gradient-to-r from-gray-500 to-gray-700">Impact</span>
            </h2>
          </div>
          <p className="text-gray-500 max-w-sm text-sm md:text-right leading-relaxed uppercase tracking-widest text-[10px]">
            A brief look at our recent milestones. Discover the history of our technical excellence.
          </p>
        </header>

        {/* Grid Content */}
        {fetchStatus === "loading" || fetchStatus === "waking" ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 animate-pulse">
             {[1, 2, 3].map(i => <div key={i} className="h-[450px] bg-white/5 rounded-3xl border border-white/10" />)}
          </div>
        ) : fetchStatus === "error" ? (
          <div className="h-[200px] flex items-center justify-center border border-dashed border-red-500/20 rounded-3xl bg-red-500/5">
            <p className="text-red-400 tracking-widest uppercase text-xs">Failed to load archive.</p>
          </div>
        ) : sessions.length > 0 ? (
          <motion.div 
            variants={containerVars} 
            initial="hidden" 
            whileInView="show" 
            viewport={{ once: true, margin: "-50px" }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            {sessions.map((session) => (
              <motion.div 
                key={session.id} 
                variants={cardVars}
                className="group flex flex-col bg-[#0A0A0A] border border-white/10 hover:border-[#7DD4EF]/50 rounded-3xl overflow-hidden transition-all duration-500 hover:-translate-y-2 shadow-2xl"
              >
                {/* Image Section */}
                <div className="relative h-56 w-full overflow-hidden bg-gray-900">
                  <img 
                    src={session.image || session.imageUrl || placeholderImg} 
                    className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700 group-hover:scale-110" 
                    alt={session.title} 
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0A] via-transparent to-transparent" />
                  
                  {/* Date Badge */}
                  <div className="absolute top-4 left-4 bg-black/60 backdrop-blur-md border border-white/10 px-3 py-2 rounded-xl text-center">
                    <div className="text-xl font-normal font-bebas-neue text-white leading-none">
                      {session.parsedDate.getDate()}
                    </div>
                    <div className="text-[9px] text-[#7DD4EF] uppercase tracking-widest font-bold mt-1">
                      {session.parsedDate.toLocaleDateString('en-US', {month: 'short'})}
                    </div>
                  </div>
                </div>

                {/* Content Section */}
                <div className="p-8 flex flex-col flex-1">
                  <span className="text-[9px] font-bold text-gray-500 uppercase tracking-widest mb-3">
                    {session.tag || 'Completed Session'}
                  </span>
                  <h3 className="text-3xl font-normal font-bebas-neue text-white leading-tight mb-4 group-hover:text-[#7DD4EF] transition-colors">
                    {session.title}
                  </h3>
                  <p className="text-gray-400 text-sm leading-relaxed line-clamp-3 mb-6">
                    {session.description}
                  </p>
                  
                  <div className="mt-auto pt-6 border-t border-white/5 flex items-center justify-between text-xs text-gray-500 font-bold uppercase tracking-widest">
                    <div className="flex items-center gap-2">
                      <MapPin size={14} className="text-[#7DD4EF]"/>
                      <span className="truncate max-w-[120px]">{session.location || "Campus"}</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        ) : (
          <div className="h-[200px] flex items-center justify-center border border-dashed border-white/10 rounded-3xl">
            <p className="text-gray-500 tracking-widest uppercase text-xs">Archive is currently empty.</p>
          </div>
        )}

        {/* EXPLORE MORE BUTTON */}
        <div className="mt-20 flex justify-center">
          <button 
            onClick={() => window.location.href = '/archive'} // 👈 Routes to your new Archive Page
            className="group relative flex items-center gap-4 px-10 py-5 bg-white text-black rounded-full font-normal font-bebas-neue text-2xl uppercase tracking-widest hover:bg-[#7DD4EF] transition-all duration-300 overflow-hidden shadow-[0_0_40px_rgba(255,255,255,0.1)] hover:shadow-[0_0_40px_rgba(125,212,239,0.4)]"
          >
            <span className="relative z-10 flex items-center gap-2 mt-1">
              Explore Full Archive <ArrowUpRight size={24} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
            </span>
            <div className="absolute inset-0 h-full w-0 bg-[#7DD4EF] transition-all duration-300 ease-out group-hover:w-full z-0" />
          </button>
        </div>

      </div>
    </section>
  );
}