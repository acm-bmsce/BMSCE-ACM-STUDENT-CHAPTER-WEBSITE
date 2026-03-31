import React from "react";
import { motion } from "framer-motion";
import { Terminal, Code2, Users } from "lucide-react";

export default function EventTitleSection({ featured }) {
  // Animation Variants for Minimalist Fades
  const containerVars = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.1, delayChildren: 0.2 } }
  };
  const itemVars = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 80, damping: 20 } }
  };

  // High-quality fallbacks in case the backend doesn't return enough images
  const fallbackMain = "https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=1200&q=80";
  const fallbackSecondary = "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=800&q=80";
  const fallbackTertiary = "https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=800&q=80";

  // Safely extract images from the featured prop
  const mainImg = featured?.image || fallbackMain;
  const secondaryImg = featured?.imageSecondary || fallbackSecondary;
  const tertiaryImg = featured?.imageTertiary || fallbackTertiary;

  return (
    <section className="relative min-h-[100svh] flex flex-col justify-center overflow-hidden bg-[#030303] pt-20">
      
      {/* Premium Minimalist Background: Subtle Grid & Soft Glow */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]" />
      <div className="absolute top-[-20%] left-[-10%] w-[50vw] h-[50vw] bg-[#7DD4EF]/10 blur-[120px] rounded-full pointer-events-none mix-blend-screen" />
      
      <div className="max-w-7xl mx-auto px-6 lg:px-10 relative z-10 w-full flex-1 flex items-center">
        <div className="grid lg:grid-cols-12 gap-12 lg:gap-8 items-center w-full">
          
          {/* Left Column: Clean Typography */}
          <motion.div 
            className="lg:col-span-7 flex flex-col items-center text-center lg:items-start lg:text-left"
            variants={containerVars}
            initial="hidden"
            animate="show"
          >
            <motion.div variants={itemVars} className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-white/10 bg-white/5 backdrop-blur-md mb-8">
              <Terminal size={12} className="text-[#7DD4EF]" />
              <span className="text-[10px] sm:text-xs font-bold text-gray-300 tracking-[0.2em] uppercase">
                BMSCE ACM CHAPTER
              </span>
            </motion.div>
            
            <motion.h1 variants={itemVars} className="text-[4rem] sm:text-6xl md:text-7xl lg:text-[8rem] font-black text-white leading-[0.9] tracking-tighter mb-6 font-['Impact'] uppercase">
              Chapter <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-gray-400 to-white">
                Events.
              </span>
            </motion.h1>

            <motion.p variants={itemVars} className="text-gray-400 text-sm sm:text-base md:text-lg max-w-md leading-relaxed mb-10 font-medium">
              Discover our lineup of hackathons, expert-led workshops, and technical symposiums. Experience the vibrant tech culture and secure your spot in our upcoming sessions.
            </motion.p>

            {/* Static Value Props */}
            <motion.div variants={itemVars} className="flex flex-wrap justify-center lg:justify-start gap-6">
              <div className="flex items-center gap-2 text-gray-500 text-xs font-bold uppercase tracking-widest">
                <Code2 size={16} className="text-[#7DD4EF]" /> Build
              </div>
              <div className="flex items-center gap-2 text-gray-500 text-xs font-bold uppercase tracking-widest">
                <Users size={16} className="text-[#7DD4EF]" /> Network
              </div>
              <div className="flex items-center gap-2 text-gray-500 text-xs font-bold uppercase tracking-widest">
                <Terminal size={16} className="text-[#7DD4EF]" /> Innovate
              </div>
            </motion.div>
          </motion.div>

          {/* Right Column: Minimalist Static Composition */}
          <div className="lg:col-span-5 relative mt-12 lg:mt-0 w-full h-[400px] lg:h-[600px] hidden md:flex justify-center items-center">
            <motion.div 
              initial={{ opacity: 0, filter: "blur(10px)" }}
              animate={{ opacity: 1, filter: "blur(0px)" }}
              transition={{ duration: 1.2, delay: 0.4 }}
              className="relative w-full h-full"
            >
              {/* Main Image */}
              <div className="absolute top-[10%] right-[10%] w-[70%] h-[60%] rounded-3xl overflow-hidden border border-white/10 shadow-2xl z-20 bg-gray-900">
                <img src={mainImg} alt="Featured Main" className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-black/20 mix-blend-overlay" />
              </div>
              
              {/* Secondary Image */}
              <div className="absolute bottom-[10%] left-[5%] w-[50%] h-[40%] rounded-3xl overflow-hidden border border-white/10 shadow-2xl z-30 bg-gray-900">
                <img src={secondaryImg} alt="Featured Secondary" className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-500" />
              </div>

              {/* Tertiary Image */}
              <div className="absolute top-[30%] left-[0%] w-[40%] h-[35%] rounded-3xl overflow-hidden border border-[#7DD4EF]/20 shadow-2xl z-10 bg-gray-900">
                <img src={tertiaryImg} alt="Featured Tertiary" className="w-full h-full object-cover opacity-60" />
              </div>
            </motion.div>
          </div>

        </div>
      </div>
      
      {/* Bottom fade to blend into the calendar section */}
      <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-[#030303] to-transparent z-20" />
    </section>
  );
}