import { useState } from "react";

export function DaysCard({
  type,
  title,
  description,
  buttonText,
  link,
  imageUrl,
  bgColor,
  borderColor,
  stats,
  size = "medium",
}) {
  const sizeClasses = {
    small: "h-64",
    medium: "h-72",
    tall: "h-[445px]",
    wide: "h-72",
  };

  const baseClasses = `relative rounded-2xl border backdrop-blur-sm transition-all duration-300 overflow-hidden group ${sizeClasses[size]} flex flex-col justify-center items-center p-6`;
  const hoverClasses = "hover:border-white/40 hover:shadow-[0_0_30px_rgba(125,212,238,0.3)]";

  // Handle button click for type="action"
  const handleButtonClick = () => {
    if (link && link !== "#") {
      window.open(link, '_blank', 'noopener,noreferrer');
    }
  };

  if (type === "image") {
    return (
      <div
        className={`relative overflow-hidden ${baseClasses} ${hoverClasses}`}
        style={{
          backgroundColor: bgColor,
          borderColor: borderColor,
        }}
      >
        {imageUrl && (
          <img
            src={imageUrl || "/placeholder.svg"}
            alt="100 Days of Code Challenge Poster"
            className="absolute inset-0 w-full h-full object-cover"
          />
        )}
      </div>
    );
  }

  if (type === "content") {
    return (
      <div
        className={`${baseClasses} ${hoverClasses}`}
        style={{
          backgroundColor: bgColor,
          borderColor: borderColor,
        }}
      >
        <div className="text-center">
          <h3 className="text-2xl font-bold text-white bebas-neue tracking-widest mb-3 mt-4">
            {title}
          </h3>
          <p
            className="mt-2 mb-10 max-w-3xl mx-auto text-center font-general text-lg text-blue-50/80"
            style={{ fontFamily: "sans-serif" }}
          >
            {description}
          </p>
        </div>
      </div>
    );
  }

  if (type === "action") {
    return (
      <div
        className={`${baseClasses} ${hoverClasses} h-fit`}
        style={{
          backgroundColor: bgColor,
          borderColor: borderColor,
        }}
      >
        <div className="text-center flex flex-col items-center gap-4">
          <h3 className="text-xl font-bold text-white bebas-neue tracking-widest">
            {title}
          </h3>
          <button
            onClick={handleButtonClick}
            className="border border-white/30 text-white/70 px-6 py-2 font-semibold hover:bg-white/5 hover:text-white hover:border-white/60 transition-all duration-300 rounded-full bebas-neue tracking-widest text-sm cursor-pointer"
          >
            {buttonText}
          </button>
        </div>
      </div>
    );
  }

  if (type === "stats") {
    return (
      <div
        className={`${baseClasses} ${hoverClasses}`}
        style={{
          backgroundColor: bgColor,
          borderColor: borderColor,
        }}
      >
        <div className="text-center w-full">
          <h3 className="text-xl font-bold text-white bebas-neue tracking-widest">
            {title}
          </h3>

          <div className="grid grid-cols-2 gap-4">
            {stats?.map((stat, index) => (
              <div key={index} className="flex flex-col items-center">
                <p className="text-lg font-bold text-white bebas-neue">
                  {stat.value}
                </p>
                <p className="text-xs text-white/60 bebas-neue tracking-wide">
                  {stat.label}
                </p>
                <p className="text-sm text-white/70 leading-relaxed">
                  {description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return null;
}