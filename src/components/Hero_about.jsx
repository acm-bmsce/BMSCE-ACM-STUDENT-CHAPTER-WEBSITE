// src/components/Hero.jsx

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import TagCloud from "TagCloud";
import { TextPlugin } from "gsap/TextPlugin";

gsap.registerPlugin(TextPlugin);

const values = [
  "Innovation", "Community", "Excellence", 
  "Growth", "Collaboration", "Technology",
  "Research", "Leadership", "Events", "Workshops"
];

const Hero = () => {
  const containerRef = useRef(null);
  const cloudRef = useRef(null);
  const titleRef = useRef(null);
  const centerTextRef = useRef(null);
  const [isMorphed, setIsMorphed] = useState(false);
  const timeoutRef = useRef(null);

  // Initialize TagCloud
  useEffect(() => {
    if (!cloudRef.current) return;

    const options = {
      radius: 280,
      maxSpeed: "fast",
      initSpeed: "fast",
      direction: 135,
      keep: true,
    };

    const tagCloudInstance = TagCloud(cloudRef.current, values, options);

    // Auto-trigger morph after 5 seconds
    timeoutRef.current = setTimeout(() => {
      setIsMorphed(true);
    }, 8000);

    return () => {
      tagCloudInstance.destroy();
      clearTimeout(timeoutRef.current);
    };
  }, []);

  // GSAP transition animation
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
            duration:0.5,
            onComplete: ()=>{
              gsap.to(titleRef.current,{
                text:"Find your people</br>Find your passion",
                duration: 3,
                ease: "none"
              });
            }
            
          });
        },
      });
    }
  }, { scope: containerRef, dependencies: [isMorphed] });

  // Manual click trigger (if before 5s)
  const handleClick = () => {
    if (!isMorphed) {
      clearTimeout(timeoutRef.current);
      setIsMorphed(true);
    }
  };

  return (
    <section
      ref={containerRef}
      className="relative h-dvh w-screen overflow-hidden bg-black flex items-center justify-center"
      onClick={handleClick}
    >
      <div
        ref={cloudRef}
        className="text-blue-300 font-general uppercase text-lg cursor-pointer"
      >
        {/* TagCloud will render here */}
      </div>

      <div
        ref={centerTextRef}
        className="absolute z-10 text-center pointer-events-none"
      >
        <h2 className="font-bebas-neue text-6xl tracking-wider text-[#009BCE]">
          Who Are We?
        </h2>
      </div>

      {/* Final Headline with typewriter effect */}
      <h1
        ref={titleRef}
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20 text-center text-white hero-heading !text-4xl md:!text-6xl lg:!text-8xl opacity-0 font-bold"
        style={{ pointerEvents: 'none' }}
      >
        {/* Initial blank, will be filled by GSAP TextPlugin */}
      </h1>
    </section>
  );
};

export default Hero;
