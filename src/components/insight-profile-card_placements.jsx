import React, { useState } from "react";

// You can use these SVG icons if you don't want to install lucide-react
// Or replace with your own icon components
const PlusIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="black" strokeWidth="3">
    <path d="M12 5v14M5 12h14" />
  </svg>
);

const ArrowRightIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M5 12h14M12 5l7 7-7 7" />
  </svg>
);

const XIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M18 6L6 18M6 6l12 12" />
  </svg>
);

export function InsightProfileCard({ image, name, job, company, link, year, description }) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handlePlusClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDialogOpen(true);
  };

  // Close modal when clicking outside or pressing Escape
  React.useEffect(() => {
    if (!isDialogOpen) return;

    const handleEscape = (e) => {
      if (e.key === "Escape") {
        setIsDialogOpen(false);
      }
    };

    document.addEventListener("keydown", handleEscape);
    document.body.style.overflow = "hidden"; // Prevent background scrolling

    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "auto";
    };
  }, [isDialogOpen]);

  return (
    <>
      {/* Main Card */}
      <div className="group flex flex-col items-center text-center">
        {/* Circular Image Container - Responsive sizing */}
        <div className="relative mb-4 sm:mb-6">
          <div className="w-40 h-40 sm:w-48 sm:h-48 md:w-56 md:h-56 rounded-full overflow-hidden border-2 border-white/20 transition-all duration-300 cursor-pointer hover:border-blue-400/50">
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

      {/* Modal/Dialog - Responsive for all screen sizes */}
      {isDialogOpen && (
        <div
          className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-3 sm:p-4 md:p-6"
          onClick={() => setIsDialogOpen(false)}
        >
          <div
            className="bg-gradient-to-br from-black to-gray-900 rounded-xl sm:rounded-2xl border border-blue-400/30 w-full max-w-xs sm:max-w-sm md:max-w-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh] sm:max-h-[85vh]"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header - Responsive padding */}
            <div className="flex justify-center items-center relative p-4 sm:p-6 border-b border-blue-400/20">
              <h2 className="text-lg sm:text-xl font-bold text-white bebas-neue tracking-wider sm:tracking-widest">
                Profile
              </h2>
              <button
                onClick={() => setIsDialogOpen(false)}
                className="absolute right-3 sm:right-6 p-1 sm:p-2 hover:bg-white/10 rounded-lg transition-colors"
                aria-label="Close"
              >
                <XIcon />
              </button>
            </div>

            {/* Main Content - Responsive grid */}
            <div className="p-4 sm:p-6 md:p-8 flex-1 overflow-y-auto">
              <div className="flex flex-col md:flex-row gap-6">
                {/* Left Column - Image and Year */}
                <div className="flex flex-col items-center md:items-start md:w-1/3">
                  <div className="w-32 h-32 sm:w-36 sm:h-36 md:w-40 md:h-40 rounded-lg sm:rounded-xl overflow-hidden border-2 border-blue-400/50 mb-4 shadow-lg">
                    <img
                      src={image || "/placeholder.svg"}
                      alt={name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                 
                  {year && (
                    <div className="text-center md:text-left">
                      <p className="text-xs uppercase tracking-wider text-blue-400 font-semibold mb-1">
                        Year
                      </p>
                      <p className="text-sm text-white/80 font-medium">{year}</p>
                    </div>
                  )}
                </div>

                {/* Right Column - Info */}
                <div className="flex-1 md:w-2/3">
                  {/* Name and Title */}
                  <div>
                    <h3 className="text-2xl sm:text-3xl font-bold text-white mb-2 sm:mb-3 leading-tight">
                      {name}
                    </h3>
                    <div className="space-y-1 sm:space-y-2 mb-3 sm:mb-4">
                      <p className="text-base sm:text-lg font-semibold text-blue-400">
                        {job}
                      </p>
                      <p className="text-sm text-white/60">{company}</p>
                    </div>
                   
                    {description && (
                      <div className="mt-3 sm:mt-4 pt-3 sm:pt-4 border-t border-blue-400/20">
                        <p className="text-sm sm:text-sm text-white/70 leading-relaxed">
                          {description}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Footer Button - Responsive padding */}
            <a
              href={link}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-semibold py-3 sm:py-4 px-4 sm:px-6 rounded-none transition-all duration-300 flex items-center justify-center gap-2 group/button shadow-lg hover:shadow-blue-500/20 border-t border-blue-400/20 text-sm sm:text-base"
            >
              See More
              <span className="group-hover/button:translate-x-1 transition-transform">
                <ArrowRightIcon />
              </span>
            </a>
          </div>
        </div>
      )}
    </>
  );
}