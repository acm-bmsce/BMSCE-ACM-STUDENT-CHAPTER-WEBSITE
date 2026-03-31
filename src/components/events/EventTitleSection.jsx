import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Zap, Sparkles, ArrowRight, Terminal } from "lucide-react";

export default function EventTitleSection({ featured }) {
  const [timeLeft, setTimeLeft] = useState(null); // null means no active future event
  const [isFutureEvent, setIsFutureEvent] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());

  // Live Terminal Clock (Runs when no future event is active)
  useEffect(() => {
    const clockTimer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(clockTimer);
  }, []);

  // Smart Real-time Countdown (No Dummy Data)
  useEffect(() => {
    if (!featured || !featured.date) {
      setIsFutureEvent(false);
      setTimeLeft(null);
      return;
    }

    const eventDate = new Date(featured.date);
    
    // If date is invalid or in the past, don't show countdown
    if (isNaN(eventDate.getTime()) || eventDate < new Date()) {
      setIsFutureEvent(false);
      setTimeLeft(null);
      return;
    }

    setIsFutureEvent(true);

    const timer = setInterval(() => {
      const difference = eventDate - new Date();
      
      if (difference > 0) {
        setTimeLeft({
          days: String(Math.floor(difference / (1000 * 60 * 60 * 24))).padStart(2, '0'),
          hours: String(Math.floor((difference / (1000 * 60 * 60)) % 24)).padStart(2, '0'),
          mins: String(Math.floor((difference / 1000 / 60) % 60)).padStart(2, '0'),
          secs: String(Math.floor((difference / 1000) % 60)).padStart(2, '0'),
        });
      } else {
        // Event has started!
        setTimeLeft(null);
        setIsFutureEvent(false);
        clearInterval(timer);
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [featured]);

  // Safe Title Splitter
  const titleString = featured?.title || "BMSCE ACM";
  const titleParts = titleString.split(" ");
  const firstWord = titleParts[0];
  const restOfTitle = titleParts.slice(1).join(" ");

  // Animation Variants
  const containerVars = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.15 } }
  };
  const itemVars = {
    hidden: { opacity: 0, y: 30 },
    show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 100 } }
  };

  const placeholderImg = "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=1600&q=80";

  return (
    <section className="relative min-h-[100svh] flex flex-col justify-center overflow-hidden bg-black pt-32 pb-20 lg:pt-20">
      {/* Immersive Background Glows */}
      <div className="absolute top-[-10%] left-[-10%] w-[50vw] h-[50vw] bg-[#7DD4EF]/10 blur-[150px] rounded-full pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40vw] h-[40vw] bg-blue-600/10 blur-[120px] rounded-full pointer-events-none" />
      
      <div className="max-w-7xl mx-auto px-6 lg:px-10 relative z-10 w-full">
        <div className="grid lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          
          {/* Left Column: Text & Interaction */}
          <motion.div 
            className="lg:col-span-7 flex flex-col items-center text-center lg:items-start lg:text-left"
            variants={containerVars}
            initial="hidden"
            animate="show"
          >
            <motion.div variants={itemVars} className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-[#7DD4EF]/30 bg-gradient-to-r from-[#7DD4EF]/10 to-transparent mb-8 shadow-[0_0_20px_rgba(125,212,239,0.1)]">
              {isFutureEvent ? (
                <>
                  <span className="relative flex h-2.5 w-2.5">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#7DD4EF] opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#7DD4EF]"></span>
                  </span>
                  <span className="text-[10px] sm:text-xs font-bold text-[#7DD4EF] tracking-[0.2em] uppercase">
                    Next Flagship Event
                  </span>
                </>
              ) : (
                <>
                  <Terminal size={12} className="text-[#7DD4EF]" />
                  <span className="text-[10px] sm:text-xs font-bold text-[#7DD4EF] tracking-[0.2em] uppercase">
                    Chapter Hub Online
                  </span>
                </>
              )}
            </motion.div>
            
            <motion.h1 variants={itemVars} className="text-[4rem] sm:text-7xl md:text-8xl lg:text-[9rem] font-black text-white leading-[0.85] tracking-tighter mb-8 font-['Impact'] uppercase break-words w-full">
              {firstWord}<br />
              {restOfTitle && (
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#7DD4EF] via-blue-400 to-[#7DD4EF] bg-300% animate-gradient">
                  {restOfTitle}
                </span>
              )}
            </motion.h1>

            <motion.p variants={itemVars} className="text-gray-400 text-sm sm:text-base md:text-lg max-w-lg leading-relaxed mb-10 lg:border-l-2 border-[#7DD4EF]/30 lg:pl-6 bg-black/40 lg:bg-transparent backdrop-blur-md p-4 lg:p-0 rounded-2xl lg:rounded-none border border-white/5 lg:border-none">
              {featured?.description || "Engineering the future of computing. Join us for technical excellence, hackathons, and industry-leading workshops."}
            </motion.p>

            {/* Dynamic Interactive Panel */}
            <motion.div variants={itemVars} className="flex flex-col sm:flex-row items-center gap-6 bg-[#0A0A0A] border border-white/10 p-2 pl-6 pr-2 rounded-[2rem] shadow-2xl w-full sm:w-auto">
              
              {/* Show Countdown ONLY if there is a valid future event */}
              {isFutureEvent && timeLeft ? (
                <div className="flex gap-4 sm:gap-6 py-4 sm:py-0">
                  {[
                    ["Days", timeLeft.days], 
                    ["Hrs", timeLeft.hours], 
                    ["Mins", timeLeft.mins],
                    ["Secs", timeLeft.secs, "text-[#7DD4EF]"] 
                  ].map(([label, val, colorClass]) => (
                    <div key={label} className="flex flex-col items-center min-w-[3rem]">
                      <div className={`text-2xl sm:text-3xl font-black leading-none font-['Impact'] ${colorClass || 'text-white'}`}>
                        {val}
                      </div>
                      <div className="text-[9px] uppercase tracking-[0.2em] text-gray-500 mt-1">{label}</div>
                    </div>
                  ))}
                </div>
              ) : (
                /* Feature: Live Terminal Status (Replaces Dummy Data) */
                <div className="flex items-center gap-6 py-4 sm:py-0 px-2">
                  <div className="flex flex-col items-start">
                    <div className="flex items-center gap-2 mb-1">
                      <div className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse shadow-[0_0_8px_rgba(74,222,128,0.8)]" />
                      <span className="text-green-400 font-bold text-[9px] uppercase tracking-widest">Network Live</span>
                    </div>
                    <span className="text-white font-black text-xl tracking-widest font-['Impact']">
                      {currentTime.toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute:'2-digit', second:'2-digit' })}
                    </span>
                  </div>
                  <div className="w-px h-8 bg-white/10" />
                  <div className="flex flex-col items-start">
                    <span className="text-gray-500 font-bold text-[9px] uppercase tracking-widest mb-1">Location</span>
                    <span className="text-[#7DD4EF] font-black text-xl tracking-widest font-['Impact']">BMSCE BLR</span>
                  </div>
                </div>
              )}
              
              <div className="hidden sm:block w-px h-12 bg-white/10" />
              
              <button 
                onClick={() => window.open(featured?.registrationLink || "https://bmsce.acm.org", '_blank')} 
                className="w-full sm:w-auto group relative flex items-center justify-center gap-2 px-8 py-5 bg-white text-black font-black rounded-full text-xs uppercase tracking-[0.2em] hover:bg-[#7DD4EF] transition-all duration-300 overflow-hidden"
              >
                <span className="relative z-10 flex items-center gap-2">
                  {isFutureEvent ? "Register" : "Explore"} <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                </span>
                <div className="absolute inset-0 h-full w-0 bg-[#7DD4EF] transition-all duration-300 ease-out group-hover:w-full z-0" />
              </button>
            </motion.div>
          </motion.div>

          {/* Right Column: Desktop Mosaic & Mobile "Card Deck" */}
          <div className="lg:col-span-5 relative mt-16 lg:mt-0 w-full h-[400px] lg:h-[600px] flex justify-center items-center">
            
            {/* Mobile Feature: Tilted Card Deck (Hidden on lg) */}
            <div className="lg:hidden relative w-full h-full flex justify-center items-center">
              <motion.div 
                initial={{ rotate: -15, scale: 0.8, opacity: 0 }}
                animate={{ rotate: -8, scale: 0.9, opacity: 0.5 }}
                transition={{ duration: 1, delay: 0.2 }}
                className="absolute w-[70%] aspect-[3/4] rounded-3xl overflow-hidden border border-white/10"
              >
                <img src={featured?.imageTertiary || placeholderImg} className="w-full h-full object-cover blur-[2px]" alt="Background Event" />
              </motion.div>
              
              <motion.div 
                initial={{ rotate: 15, scale: 0.8, opacity: 0 }}
                animate={{ rotate: 6, scale: 0.95, opacity: 0.8 }}
                transition={{ duration: 1, delay: 0.4 }}
                className="absolute w-[75%] aspect-[3/4] rounded-3xl overflow-hidden border border-white/20 shadow-2xl"
              >
                <img src={featured?.imageSecondary || placeholderImg} className="w-full h-full object-cover" alt="Secondary Event" />
              </motion.div>

              <motion.div 
                initial={{ y: 50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ type: "spring", stiffness: 100, delay: 0.6 }}
                className="absolute w-[80%] aspect-[3/4] rounded-3xl overflow-hidden border border-[#7DD4EF]/40 shadow-[0_20px_50px_rgba(0,0,0,0.8)] z-10"
              >
                <img src={featured?.image || placeholderImg} className="w-full h-full object-cover" alt="Main Event" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                <div className="absolute bottom-6 left-6 text-white font-bold text-lg tracking-wide drop-shadow-md">
                  {featured?.title || "BMSCE ACM"}
                </div>
              </motion.div>
            </div>

            {/* Desktop Feature: Floating Mosaic (Hidden on mobile) */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1 }}
              className="hidden lg:grid grid-cols-12 grid-rows-12 gap-4 w-full h-full relative"
            >
              {/* Floating Holographic Badges */}
              <motion.div animate={{ y: [-10, 10, -10] }} transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }} className="absolute -left-6 top-20 z-20 bg-black/60 backdrop-blur-xl border border-white/10 px-4 py-2 rounded-2xl flex items-center gap-2 shadow-xl">
                 <Zap size={14} className="text-[#7DD4EF]" /> <span className="text-[10px] text-white font-bold tracking-widest uppercase">Innovation</span>
              </motion.div>
              <motion.div animate={{ y: [10, -10, 10] }} transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }} className="absolute -right-8 bottom-32 z-20 bg-black/60 backdrop-blur-xl border border-white/10 px-4 py-2 rounded-2xl flex items-center gap-2 shadow-xl">
                 <Sparkles size={14} className="text-blue-400" /> <span className="text-[10px] text-white font-bold tracking-widest uppercase">Tech Excellence</span>
              </motion.div>

              {/* Image Grid */}
              <div className="col-span-8 row-span-8 rounded-[2rem] overflow-hidden border border-white/10 group shadow-2xl relative z-10 bg-gray-900">
                <img src={featured?.image || placeholderImg} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" alt="Featured" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              </div>
              <div className="col-span-5 row-span-5 col-start-8 row-start-2 rounded-[2rem] overflow-hidden border border-white/10 shadow-2xl z-0 -ml-8 mt-8 group bg-gray-900">
                <img src={featured?.imageSecondary || placeholderImg} className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700" alt="Sub 1" />
              </div>
              <div className="col-span-6 row-span-5 col-start-6 row-start-8 rounded-[2rem] overflow-hidden border border-[#7DD4EF]/20 shadow-2xl z-20 -mt-12 group bg-gray-900">
                 <img src={featured?.imageTertiary || placeholderImg} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" alt="Sub 2" />
              </div>
            </motion.div>

          </div>
        </div>
      </div>
      
      {/* Custom CSS for gradient animation */}
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes gradient-xy {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        .animate-gradient {
          background-size: 300% 300%;
          animation: gradient-xy 6s ease infinite;
        }
      `}} />
    </section>
  );
}