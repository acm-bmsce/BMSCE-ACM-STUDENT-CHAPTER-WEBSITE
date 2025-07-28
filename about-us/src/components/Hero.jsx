// src/components/Hero.jsx

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import TagCloud from "TagCloud";

const values = [
  "Innovation", "Community", "Excellence", 
  "Growth", "Collaboration", "Technology",
  "Research", "Leadership", "ACM", "BMSCE",
  "Events", "Workshops"
];

const Hero = () => {
  const containerRef = useRef(null);
  const cloudRef = useRef(null);
  const titleRef = useRef(null);
  const centerTextRef = useRef(null);
  const [isMorphed, setIsMorphed] = useState(false);

  useEffect(() => {
    if (isMorphed || !cloudRef.current) return;

    const options = {
      radius: 280,
      maxSpeed: "fast",
      initSpeed: "fast",
      direction: 135,
      keep: true,
    };
    const tagCloudInstance = TagCloud(cloudRef.current, values, options);
    
    return () => tagCloudInstance.destroy();
  }, [isMorphed]);

  useGSAP(() => {
    if (isMorphed) {
      gsap.to([cloudRef.current, centerTextRef.current], {
        opacity: 0,
        scale: 0.5,
        duration: 0.8,
        ease: "power3.in",
        onComplete: () => {
          gsap.to(titleRef.current, {
            opacity: 1,
            y: 0,
            duration: 1.2,
            ease: "power3.out",
          });
        }
      });
    }
  }, { scope: containerRef, dependencies: [isMorphed] });

  return (
    <section
      ref={containerRef}
      className="relative h-dvh w-screen overflow-hidden bg-black flex items-center justify-center"
      onClick={() => setIsMorphed(true)}
    >
      <div
        ref={cloudRef}
        className="text-blue-300 font-general uppercase text-lg cursor-pointer"
      >
        {/* TagCloud library will populate this div */}
      </div>

      <div
        ref={centerTextRef}
        className="absolute z-10 text-center pointer-events-none"
      >
        <h2 className="font-bebas-neue text-6xl tracking-wider text-[#009BCE]">Who Are We?</h2>
      </div>

      {/* Final Headline */}
      <h1
        ref={titleRef}
        // CORRECTED: Added absolute centering classes
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20 text-center text-white hero-heading !text-6xl md:!text-8xl lg:!text-[9rem] opacity-0"
        style={{ pointerEvents: 'none' }}
      >
        Find your people <br className="hidden md:block" /> Find your passion.
      </h1>
    </section>
  );
};

export default Hero;