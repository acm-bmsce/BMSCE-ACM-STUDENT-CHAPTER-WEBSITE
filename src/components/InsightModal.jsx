// src/components/InsightModal.jsx
import React, { useEffect } from "react";
import { ArrowRight, X } from "lucide-react"; // Or use your SVG icons if you prefer

export default function InsightModal({ profile, onClose }) {
  if (!profile) return null;

  // Close on Escape key
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleEscape);
    document.body.style.overflow = "hidden"; 
    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "auto";
    };
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-3 sm:p-4 md:p-6"
      onClick={onClose}
    >
      <div
        className="bg-gradient-to-br from-black to-gray-900 rounded-xl sm:rounded-2xl border border-blue-400/30 w-full max-w-xs sm:max-w-sm md:max-w-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh] sm:max-h-[85vh] animate-fadeIn"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex justify-center items-center relative p-4 sm:p-6 border-b border-blue-400/20">
          <h2 className="text-lg sm:text-xl font-bold text-white bebas-neue tracking-wider sm:tracking-widest">
            Profile
          </h2>
          <button
            onClick={onClose}
            className="absolute right-3 sm:right-6 p-1 sm:p-2 hover:bg-white/10 rounded-lg transition-colors text-white"
          >
            <X size={20} />
          </button>
        </div>

        {/* Main Content */}
        <div className="p-4 sm:p-6 md:p-8 flex-1 overflow-y-auto">
          <div className="flex flex-col md:flex-row gap-6">
            
            {/* Left Column - Image and Year */}
            <div className="flex flex-col items-center md:items-start md:w-1/3">
              <div className="w-32 h-32 sm:w-36 sm:h-36 md:w-40 md:h-40 rounded-lg sm:rounded-xl overflow-hidden border-2 border-blue-400/50 mb-4 shadow-lg shrink-0">
                <img
                  src={profile.image || "/placeholder.svg"}
                  alt={profile.name}
                  className="w-full h-full object-cover"
                />
              </div>
              
              <div className="text-center md:text-left">
                <p className="text-xs uppercase tracking-wider text-blue-400 font-semibold mb-1">
                  Year
                </p>
                <p className="text-sm text-white/80 font-medium">{profile.year}</p>
              </div>
            </div>

            {/* Right Column - Info */}
            <div className="flex-1 md:w-2/3">
              <div>
                <h3 className="text-2xl sm:text-3xl font-bold text-white mb-2 sm:mb-3 leading-tight">
                  {profile.name}
                </h3>
                <div className="space-y-1 sm:space-y-2 mb-3 sm:mb-4">
                  <p className="text-base sm:text-lg font-semibold text-blue-400">
                    {profile.job}
                  </p>
                  <p className="text-sm text-white/60">{profile.company}</p>
                </div>
                
                <div className="mt-3 sm:mt-4 pt-3 sm:pt-4 border-t border-blue-400/20">
                  <p className="text-sm sm:text-sm text-white/70 leading-relaxed">
                    {profile.description}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Button */}
        <a
          href={profile.link}
          target="_blank"
          rel="noopener noreferrer"
          className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-semibold py-3 sm:py-4 px-4 sm:px-6 rounded-none transition-all duration-300 flex items-center justify-center gap-2 group/button shadow-lg hover:shadow-blue-500/20 border-t border-blue-400/20 text-sm sm:text-base"
        >
          See More
          <span className="group-hover/button:translate-x-1 transition-transform">
            <ArrowRight size={18} />
          </span>
        </a>
      </div>
    </div>
  );
}