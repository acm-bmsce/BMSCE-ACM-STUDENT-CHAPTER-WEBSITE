import React from "react";
import { motion } from "framer-motion";
import { Terminal, Code2, Users, Rocket, Target } from "lucide-react";

export default function EventTitleSection() {
  const containerVars = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.1, delayChildren: 0.1 } }
  };
  const itemVars = {
    hidden: { opacity: 0, y: 15 },
    show: { opacity: 1, y: 0, transition: { type: "tween", ease: "easeOut", duration: 0.4 } }
  };

  const hackathonFocusImg = "https://images.unsplash.com/photo-1731160807880-daf859b64420?q=80&w=2660&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"; 
  
  const workshopCollaborationImg = "https://images.unsplash.com/photo-1631350397792-8e0c2de5b637?q=80&w=1740&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"; 

  return (
    
    <section className="relative w-full h-fit flex flex-col bg-[#030303] overflow-hidden pt-28 pb-12 -mt-1 font-general text-white">
      
      
      <div 
        className="absolute top-0 right-0 w-[600px] h-[600px] pointer-events-none z-0" 
        style={{ 
          background: 'radial-gradient(circle at 70% 30%, rgba(125, 212, 239, 0.05) 0%, transparent 70%)',
          transform: 'translateZ(0)' 
        }} 
      />

      
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff03_1px,transparent_1px),linear-gradient(to_bottom,#ffffff03_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:linear-gradient(to_bottom,black_85%,transparent_100%)] z-0 pointer-events-none" />
      
      <div className="max-w-7xl w-full mx-auto px-6 lg:px-10 relative z-10">
        <div className="grid lg:grid-cols-2 gap-16 items-center w-full">
          
          
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
            
            <motion.h1 variants={itemVars} className="text-6xl sm:text-7xl md:text-8xl lg:text-[8.5rem] font-normal leading-[0.9] tracking-tighter mb-8 font-bebas-neue uppercase">
              Chapter <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-gray-300 to-[#7DD4EF]">
                Events.
              </span>
            </motion.h1>

            <motion.p variants={itemVars} className="text-gray-400 text-sm sm:text-base md:text-lg max-w-lg leading-relaxed mb-10">
              Discover technical symposiums, intense hackathons, and expert-led workshops. Immerse yourself in the tech culture and build the future with BMSCE ACM.
            </motion.p>

            <motion.div variants={itemVars} className="flex flex-wrap justify-center lg:justify-start gap-8 border-t border-white/5 pt-8 w-full max-w-md lg:max-w-full">
              <div className="flex items-center gap-2.5 text-gray-500 text-xs font-bold uppercase tracking-widest cursor-default">
                <Target size={18} className="text-[#7DD4EF]" /> HACK
              </div>
              <div className="flex items-center gap-2.5 text-gray-500 text-xs font-bold uppercase tracking-widest cursor-default">
                <Code2 size={18} className="text-[#7DD4EF]" /> BUILD
              </div>
              <div className="flex items-center gap-2.5 text-gray-500 text-xs font-bold uppercase tracking-widest cursor-default">
                <Rocket size={18} className="text-[#7DD4EF]" /> DEPLOY
              </div>
            </motion.div>
          </motion.div>

          
          <div className="hidden lg:flex justify-end items-center w-full">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
              className="relative w-full max-w-[450px] aspect-square"
            >
              <div className="absolute top-0 right-0 w-[85%] h-[85%] rounded-[2rem] border border-white/10 overflow-hidden bg-gray-900 shadow-2xl z-10">
                <img src={hackathonFocusImg} alt="ACM Hack" className="w-full h-full object-cover opacity-70" />
                <div className="absolute inset-0 bg-gradient-to-tr from-[#030303] via-transparent to-transparent" />
              </div>

              <motion.div 
                animate={{ y: [0, -8, 0] }}
                transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                className="absolute bottom-[2%] left-0 w-[65%] h-[65%] rounded-[2rem] border border-white/10 overflow-hidden bg-[#0A0A0A] shadow-[0_20px_50px_rgba(0,0,0,0.8)] z-20"
              >
                <img src={workshopCollaborationImg} alt="ACM Workshop" className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-700" />
              </motion.div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}