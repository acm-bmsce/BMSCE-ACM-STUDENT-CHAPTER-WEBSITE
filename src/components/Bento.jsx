// src/components/Bento.jsx
import { useState, useRef } from "react";

export const BentoTilt = ({ children, className = "" }) => {
  const [transformStyle, setTransformStyle] = useState("");
  const itemRef = useRef(null);

  const handleMouseMove = (event) => {
    if (!itemRef.current) return;
    const { left, top, width, height } = itemRef.current.getBoundingClientRect();
    const relativeX = (event.clientX - left) / width;
    const relativeY = (event.clientY - top) / height;
    const tiltX = (relativeY - 0.5) * 10;
    const tiltY = (relativeX - 0.5) * -10;
    setTransformStyle(`perspective(800px) rotateX(${tiltX}deg) rotateY(${tiltY}deg) scale3d(.98, .98, .98)`);
  };

  const handleMouseLeave = () => setTransformStyle("");

  return (
    <div
      ref={itemRef}
      className={className}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ transform: transformStyle }}
    >
      {children}
    </div>
  );
};

export const BentoCard = ({ src, title, description, type = "video" }) => (
  <div className="relative w-full h-full">
    {type === "video" ? (
      <video
        src={src}
        loop
        muted
        autoPlay
        className="absolute left-0 top-0 size-full object-cover object-center opacity-40"
      />
    ) : (
      <img
        src={src}
        alt={title}
        className="absolute left-0 top-0 size-full object-cover object-center opacity-40"
      />
    )}
    <div className="relative z-10 flex size-full flex-col justify-between p-5 text-blue-50">
      <div>
        <h1 className="bento-title special-font">{title}</h1>
        {description && (
          <p className="mt-3 max-w-64 text-xs md:text-base">{description}</p>
        )}
      </div>
    </div>
  </div>
);
