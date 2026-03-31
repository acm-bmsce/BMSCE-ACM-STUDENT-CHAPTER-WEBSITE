import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowUpRight, ChevronLeft, ChevronRight, MapPin } from "lucide-react";
import eventService from "../../api/eventService";

export default function EventPastSessions() {
  const [sessions, setSessions] = useState([]);
  const [fetchStatus, setFetchStatus] = useState("loading");
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    let isMounted = true;
    const fetchArchive = async () => {
      let attempts = 0;
      while (attempts < 15 && isMounted) {
        try {
          if (attempts === 1) setFetchStatus("waking");
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
              .sort((a, b) => b.parsedDate - a.parsedDate);
            
            setSessions(archive);
            setFetchStatus("success");
          }
          return;
        } catch (e) {
          attempts++;
          await new Promise(r => setTimeout(r, 3000));
        }
      }
      setFetchStatus("error");
    };
    fetchArchive();
    return () => { isMounted = false; };
  }, []);

  const next = () => setCurrentIndex((prev) => (prev + 1) % sessions.length);
  const prev = () => setCurrentIndex((prev) => (prev - 1 + sessions.length) % sessions.length);

  if (fetchStatus === "loading" || fetchStatus === "waking") {
    return <div className="h-[600px] bg-black flex items-center justify-center text-[#7DD4EF] tracking-[0.5em] uppercase text-xs animate-pulse">Accessing Archive...</div>;
  }

  return (
    <section className="bg-black py-32 relative overflow-hidden font-['General_Sans']">
      {/* Editorial Background Text */}
      <div className="absolute top-10 left-10 opacity-[0.03] select-none pointer-events-none">
        <h2 className="text-[20vw] font-black leading-none uppercase font-['Impact']">Archive</h2>
      </div>

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        
        {/* Header with Counter */}
        <header className="flex items-end justify-between mb-20">
          <div className="max-w-xl">
            <div className="flex items-center gap-4 mb-4">
               <span className="h-px w-12 bg-[#7DD4EF]"></span>
               <span className="text-[#7DD4EF] text-[10px] font-black uppercase tracking-[0.4em]">Legacy Node / {sessions.length} Units</span>
            </div>
            <h2 className="text-6xl md:text-8xl font-black text-white uppercase font-['Impact'] tracking-tighter italic">
              Past <span className="text-transparent" style={{ WebkitTextStroke: "1px rgba(255,255,255,0.3)" }}>Impact</span>
            </h2>
          </div>
          
          <div className="hidden md:flex flex-col items-end gap-4">
             <div className="flex gap-2">
               <button onClick={prev} className="p-4 border border-white/10 rounded-full hover:bg-white text-white hover:text-black transition-all cursor-pointer"><ChevronLeft size={20}/></button>
               <button onClick={next} className="p-4 border border-white/10 rounded-full hover:bg-white text-white hover:text-black transition-all cursor-pointer"><ChevronRight size={20}/></button>
             </div>
             <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Shift Display</span>
          </div>
        </header>

        {sessions.length > 0 ? (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Image Showcase (Left) */}
            <div className="lg:col-span-7 relative group">
              <AnimatePresence mode="wait">
                <motion.div
                  key={sessions[currentIndex]?.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ duration: 0.5 }}
                  className="aspect-[16/10] rounded-[2rem] overflow-hidden border border-white/5 shadow-2xl relative"
                >
                  <img 
                    src={sessions[currentIndex]?.image || sessions[currentIndex]?.imageUrl || "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4"} 
                    className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700" 
                    alt="" 
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                  
                  {/* Floating Date Badge */}
                  <div className="absolute bottom-8 left-8 bg-white text-black p-4 rounded-2xl">
                    <div className="text-3xl font-black font-['Impact'] leading-none">
                      {sessions[currentIndex]?.parsedDate.getDate()}
                    </div>
                    <div className="text-[10px] font-bold uppercase tracking-tighter">
                      {sessions[currentIndex]?.parsedDate.toLocaleDateString('en-US', {month: 'short'})}
                    </div>
                  </div>
                </motion.div>
              </AnimatePresence>

              {/* Decorative Numbering */}
              <div className="absolute -bottom-10 -right-10 text-[12rem] font-black text-white/[0.03] font-['Impact'] hidden lg:block">
                0{currentIndex + 1}
              </div>
            </div>

            {/* Content Display (Right) */}
            <div className="lg:col-span-5 space-y-8">
              <AnimatePresence mode="wait">
                <motion.div
                  key={sessions[currentIndex]?.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="space-y-6"
                >
                  <span className="px-4 py-1.5 bg-[#7DD4EF]/10 border border-[#7DD4EF]/30 text-[#7DD4EF] text-[10px] font-black uppercase tracking-widest rounded-lg">
                    {sessions[currentIndex]?.tag || 'Workshop'}
                  </span>
                  
                  <h3 className="text-4xl md:text-5xl font-black text-white leading-tight uppercase font-['Impact']">
                    {sessions[currentIndex]?.title}
                  </h3>

                  <p className="text-gray-400 text-lg leading-relaxed font-medium">
                    {sessions[currentIndex]?.description || "Relive the highlights of this milestone event where students from across Bengaluru converged for a day of technical innovation."}
                  </p>

                  <div className="flex items-center gap-6 text-gray-500 text-xs font-bold uppercase tracking-widest">
                    <div className="flex items-center gap-2"><MapPin size={14} className="text-[#7DD4EF]"/> {sessions[currentIndex]?.location || "Main Campus"}</div>
                  </div>

                  <div className="pt-6">
                    <button className="flex items-center gap-3 px-8 py-4 bg-white text-black rounded-full font-black uppercase text-xs tracking-widest hover:bg-[#7DD4EF] transition-all group">
                      Review Recap <ArrowUpRight size={16} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform"/>
                    </button>
                  </div>
                </motion.div>
              </AnimatePresence>
              
              {/* Pagination Dots */}
              <div className="flex gap-2 pt-10">
                {sessions.slice(0, 5).map((_, i) => (
                  <div 
                    key={i} 
                    onClick={() => setCurrentIndex(i)}
                    className={`h-1 transition-all cursor-pointer rounded-full ${i === currentIndex ? 'w-12 bg-[#7DD4EF]' : 'w-4 bg-white/10'}`} 
                  />
                ))}
              </div>
            </div>

          </div>
        ) : (
          <div className="h-[400px] border border-dashed border-white/10 rounded-[3rem] flex items-center justify-center text-gray-600 uppercase tracking-widest text-xs">
            End of Archive Nodes
          </div>
        )}
      </div>
    </section>
  );
}