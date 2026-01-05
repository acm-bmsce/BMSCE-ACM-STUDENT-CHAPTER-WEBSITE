import React, { useRef } from "react";
import { ArrowLeft, ArrowRight, Instagram, Briefcase } from "lucide-react";

const InsightCard = ({ data }) => {
  return (
    // THEMED CARD: Blue/Cyan Gradients & Borders
    // h-[480px] ensures enough height for content
    // w-[85vw] ensures it takes up most of the mobile screen width
    <div className="group relative h-[480px] w-[85vw] max-w-[320px] flex-shrink-0 snap-center rounded-2xl border border-blue-500/30 bg-gradient-to-br from-blue-900/20 to-cyan-900/20 p-5 transition-all duration-300 hover:border-blue-400/50 hover:shadow-[0_0_20px_rgba(59,130,246,0.2)]">
      
      {/* Image Container */}
      <div className="relative h-60 w-full overflow-hidden rounded-xl border border-blue-500/20">
        <img
          src={data.image}
          alt={data.name}
          className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
        />
        {/* Blue-tinted gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#020617] via-blue-950/20 to-transparent opacity-80" />
      </div>

      {/* Content */}
      <div className="mt-5 flex flex-col gap-1">
        {/* Name - Bebas Neue Font to match Guide Section */}
        <h3 className="text-3xl font-bold text-white group-hover:text-blue-400 transition-colors truncate bebas-neue tracking-wide">
          {data.name}
        </h3>
        
        <div className="flex flex-col gap-1 mt-1">
          {/* Job Title - Cyan accent */}
          <div className="flex items-center gap-2">
            <Briefcase className="w-3 h-3 text-cyan-400" />
            <p className="text-sm font-semibold text-cyan-400 truncate uppercase tracking-wider">
              {data.job}
            </p>
          </div>
          <p className="text-xs text-blue-200/60 truncate font-light pl-5">
            {data.company}
          </p>
        </div>

        {/* Divider - Blue gradient */}
        <div className="my-4 h-px w-full bg-gradient-to-r from-transparent via-blue-500/30 to-transparent" />

        {/* Footer / Link */}
        <div className="mt-auto flex items-center justify-between pb-1">
            <span className="text-xs font-medium text-blue-300/60 group-hover:text-blue-300 transition-colors uppercase tracking-widest">
              View Profile
            </span>
            
            <a 
                href={data.link} 
                target="_blank" 
                rel="noreferrer"
                // Button style matches the 'Navigation' buttons
                className="flex items-center justify-center w-10 h-10 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 transition-all duration-300 group-hover:bg-blue-500 group-hover:text-white group-hover:border-blue-400 group-hover:shadow-[0_0_15px_rgba(59,130,246,0.5)]"
            >
                <Instagram size={18} />
            </a>
        </div>
      </div>
    </div>
  );
};

export default function InsightsCarousel({ insights }) {
  const scrollContainerRef = useRef(null);

  const scroll = (direction) => {
    if (scrollContainerRef.current) {
      const scrollAmount = 300; 
      scrollContainerRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
    }
  };

  return (
    <div className="relative w-full max-w-[1400px] mx-auto px-0 md:px-4">
      
      {/* Desktop Nav - Hidden on mobile, shown on desktop if needed */}
      <div className="absolute -top-14 right-4 hidden md:flex gap-3">
        <button onClick={() => scroll("left")} className="p-3 rounded-full border border-blue-500/20 bg-blue-900/10 text-blue-400 hover:bg-blue-500 hover:text-white transition-all">
          <ArrowLeft size={20} />
        </button>
        <button onClick={() => scroll("right")} className="p-3 rounded-full border border-blue-500/20 bg-blue-900/10 text-blue-400 hover:bg-blue-500 hover:text-white transition-all">
          <ArrowRight size={20} />
        </button>
      </div>

      {/* Carousel Track */}
      <div
        ref={scrollContainerRef}
        className="flex gap-5 overflow-x-auto snap-x snap-mandatory pb-8 pt-4 px-6 scrollbar-hide"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }} 
      >
        {insights.map((item) => (
          <InsightCard key={item.id} data={item} />
        ))}
        {/* Spacer to allow last card to be fully viewed */}
        <div className="w-2 flex-shrink-0" />
      </div>
      
      {/* Mobile Swipe Hint */}
      <div className="md:hidden flex justify-center -mt-4 gap-2 opacity-70">
        <div className="text-[10px] text-blue-400 uppercase tracking-[0.2em] font-bold animate-pulse">
          Swipe to Explore
        </div>
      </div>
    </div>
  );
}