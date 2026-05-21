import React from "react";

// Simple SVG Icon for the Plus button
const PlusIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="black" strokeWidth="3">
    <path d="M12 5v14M5 12h14" />
  </svg>
);

export function InsightProfileCard({ 
  image, 
  name, 
  job, 
  company, 
  link, 
  year, 
  description, 
  onViewProfile 
}) {
  
  const handlePlusClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    // Trigger the parent handler with all the profile data
    if (onViewProfile) {
      onViewProfile({
        image,
        name,
        job,
        company,
        link,
        year,
        description
      });
    }
  };

  return (
    <div className="group flex flex-col items-center text-center">
      {/* Circular Image Container - Responsive sizing */}
      <div className="relative mb-4 sm:mb-6">
        <div 
          onClick={handlePlusClick} // Optional: clicking image also triggers modal
          className="w-40 h-40 sm:w-48 sm:h-48 md:w-56 md:h-56 rounded-full overflow-hidden border-2 border-white/20 transition-all duration-300 cursor-pointer hover:border-blue-400/50"
        >
          <img
            src={image || "/placeholder.svg"}
            alt={name}
            className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
          />
        </div>

        {/* Plus Icon */}
        <button
          onClick={handlePlusClick}
          className="absolute -bottom-1 -right-1 sm:bottom-0 sm:right-0 bg-white/90 hover:bg-white rounded-full p-2 sm:p-3 transition-all duration-300 shadow-lg hover:scale-110 cursor-pointer z-10"
          aria-label="View details"
        >
          <PlusIcon />
        </button>
      </div>

      {/* Person Info - Responsive text sizes */}
      <h3 className="text-lg sm:text-xl font-bold text-white bebas-neue tracking-wider sm:tracking-widest mb-2 sm:mb-3 line-clamp-1">
        {name}
      </h3>
      <p className="text-sm sm:text-base text-white/60 mb-1 line-clamp-1">{job}</p>
      <p className="text-xs sm:text-sm text-white/50 line-clamp-1">{company}</p>
    </div>
  );
}