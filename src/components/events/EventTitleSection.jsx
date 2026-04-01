import React from "react";
import { motion } from "framer-motion";
import { Terminal, Code2, Users } from "lucide-react";

export default function EventTitleSection({ featured }) {
  
  const containerVars = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.1, delayChildren: 0.1 } }
  };
  const itemVars = {
    hidden: { opacity: 0, y: 15 },
    show: { opacity: 1, y: 0, transition: { type: "tween", ease: "easeOut", duration: 0.4 } }
  };

  const fallbackMain = "https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=1200&q=80";
  const fallbackSecondary = "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=800&q=80";

  const mainImg = featured?.image || fallbackMain;
  const secondaryImg = featured?.imageSecondary || fallbackSecondary;

  
  const displayDate = featured?.parsedDate instanceof Date && !isNaN(featured.parsedDate)
    ? featured.parsedDate.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
    : "UPCOMING";

  return (
    <section className="relative w-full min-h-[100svh] flex flex-col justify-center items-center bg-[#030303] overflow-hidden pt-32 pb-20 lg:pt-20 lg:pb-0 font-general">
      
      
      <div 
        className="absolute top-[-10%] right-[-5%] w-[600px] h-[600px] pointer-events-none z-0" 
        style={{ 
          background: 'radial-gradient(circle, rgba(125, 212, 239, 0.06) 0%, transparent 60%)',
          transform: 'translateZ(0)' 
        }} 
      />
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff03_1px,transparent_1px),linear-gradient(to_bottom,#ffffff03_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_0%,#000_70%,transparent_100%)] z-0 pointer-events-none" />
      
      <div className="max-w-7xl w-full mx-auto px-6 lg:px-10 relative z-10 flex-1 flex items-center">
        
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center w-full">
          
          
          <motion.div 
            className="flex flex-col items-center text-center lg:items-start lg:text-left will-change-transform"
            variants={containerVars}
            initial="hidden"
            animate="show"
          >
            <motion.div variants={itemVars} className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-white/10 bg-white/[0.02] backdrop-blur-md mb-8">
              <Terminal size={14} className="text-[#7DD4EF]" />
              <span className="text-[10px] sm:text-xs font-bold text-gray-300 tracking-[0.2em] uppercase">
                BMSCE ACM CHAPTER
              </span>
            </motion.div>
            
            <motion.h1 variants={itemVars} className="text-6xl sm:text-7xl md:text-8xl lg:text-[8.5rem] font-normal text-white leading-[0.9] tracking-tighter mb-8 font-bebas-neue uppercase">
              Chapter <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-gray-300 to-[#7DD4EF]">
                Events.
              </span>
            </motion.h1>

            <motion.p variants={itemVars} className="text-gray-400 text-sm sm:text-base md:text-lg max-w-lg leading-relaxed mb-10">
              Discover our lineup of hackathons, expert-led workshops, and technical symposiums. Experience the vibrant tech culture and secure your spot in our upcoming sessions.
            </motion.p>

            <motion.div variants={itemVars} className="flex flex-wrap justify-center lg:justify-start gap-8">
              <div className="flex items-center gap-2 text-gray-400 text-xs font-bold uppercase tracking-widest">
                <Code2 size={16} className="text-[#7DD4EF]" /> Build
              </div>
              <div className="flex items-center gap-2 text-gray-400 text-xs font-bold uppercase tracking-widest">
                <Users size={16} className="text-[#7DD4EF]" /> Network
              </div>
              <div className="flex items-center gap-2 text-gray-400 text-xs font-bold uppercase tracking-widest">
                <Terminal size={16} className="text-[#7DD4EF]" /> Innovate
              </div>
            </motion.div>
          </motion.div>

          
          <div className="hidden lg:flex justify-end items-center w-full">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
              className="relative w-full max-w-[500px] aspect-square will-change-transform"
            >
              
              
              <div className="absolute top-0 right-0 w-[80%] h-[80%] rounded-[2rem] border border-white/10 overflow-hidden bg-gray-900 shadow-2xl z-10">
                <img 
                  src={mainImg} 
                  alt="Primary Event" 
                  decoding="async" 
                  className="w-full h-full object-cover opacity-80 mix-blend-lighten" 
                />
                <div className="absolute inset-0 bg-gradient-to-tr from-[#030303] via-transparent to-transparent" />
              </div>


              <motion.div 
                
                animate={{ y: [0, -8, 0] }}
                transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                className="absolute bottom-[5%] left-0 w-[60%] h-[60%] rounded-[2rem] border border-white/10 overflow-hidden bg-[#0A0A0A] shadow-[0_20px_50px_rgba(0,0,0,0.8)] z-20 will-change-transform"
              >
                <img 
                  src={secondaryImg} 
                  alt="Secondary Event" 
                  decoding="async" 
                  className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-700" 
                />
              </motion.div>

              
              <motion.div 
                animate={{ y: [0, 6, 0] }}
                transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                className="absolute bottom-[-2%] right-[5%] bg-black/80 backdrop-blur-xl border border-white/10 p-5 rounded-2xl flex flex-col gap-1 shadow-2xl z-30"
              >
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-2 h-2 rounded-full bg-[#7DD4EF] animate-pulse" />
                  <span className="text-gray-400 text-[9px] font-bold uppercase tracking-widest">Next Up</span>
                </div>
                <p className="text-white font-bebas-neue text-3xl tracking-wide max-w-[150px] truncate leading-none">
                  {featured?.title || "Upcoming"}
                </p>
                
                <p className="text-[#7DD4EF] text-xs font-bold uppercase tracking-widest mt-1">
                  {displayDate}
                </p>
              </motion.div>

            </motion.div>
          </div>

        </div>
      </div>
      
      
      <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-[#030303] to-transparent z-20 pointer-events-none" />
    </section>
  );
}