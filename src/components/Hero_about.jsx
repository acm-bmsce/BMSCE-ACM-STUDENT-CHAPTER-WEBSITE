"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import TagCloud from "TagCloud";
import TextType from "./TextType";

const values = [
  "Innovation", "Community", "Excellence",
  "Growth", "Collaboration", "Technology",
  "Research", "Leadership", "Events", "Workshops"
];

const Hero = () => {
  const containerRef = useRef(null);
  const cloudRef = useRef(null);
  const centerTextRef = useRef(null);
  const [showTextType, setShowTextType] = useState(true);
  const [showGlobe, setShowGlobe] = useState(false);

  // Show TagCloud after typewriter finishes
  const handleTypingComplete = () => {
    setShowTextType(false);
    setShowGlobe(true);
  };

  // Initialize TagCloud and animate
  useEffect(() => {
    if (!showGlobe || !cloudRef.current) return;

    const options = {
      radius: 280,
      maxSpeed: "fast",
      initSpeed: "fast",
      direction: 135,
      keep: true,
    };

    const tagCloudInstance = TagCloud(cloudRef.current, values, options);

    // Create animation sequence
    const tl = gsap.timeline();

    // Globe zoom-in
    tl.fromTo(
      cloudRef.current,
      { scale: 0, opacity: 0 },
      { scale: 1, opacity: 1, duration: 1.2, ease: "power3.out" }
    );

    // "Who Are We?" text zoom-in after globe
    if (centerTextRef.current) {
      tl.fromTo(
        centerTextRef.current,
        { scale: 0.8, opacity: 0 },
        { scale: 1, opacity: 1, duration: 0.8, ease: "power2.out" },
        "-=0.6" // overlap with last 0.6s of globe animation
      );
    }

    return () => tagCloudInstance.destroy();
  }, [showGlobe]);

  return (
    <section
      ref={containerRef}
      className="relative h-dvh w-screen overflow-hidden bg-black flex items-center justify-center"
    >
      {/* Typewriter effect first */}
      {showTextType && (
        <TextType
          text={[
            "WELCOME TO BMSCE ACM STUDENT CHAPTER",
            "FIND YOUR PEOPLE",
            "FIND YOUR PASSION",
          ]}
          as="h1"
          className="absolute text-center text-white font-robert-medium !text-[5rem] md:!text-6xl lg:!text-[6rem] font-bold max-w-[80%] mx-auto"
          typingSpeed={80}
          deletingSpeed={50}
          pauseDuration={2000}
          initialDelay={200}
          loop={false}
          showCursor={true}
          cursorCharacter="."
          cursorBlinkDuration={0.5}
          textColors={["#ffffff", "#00BFFF"]}
          onComplete={handleTypingComplete}
        />
      )}

      {/* TagCloud after typewriter */}
      {showGlobe && (
        <div
          ref={cloudRef}
          className="text-blue-300 font-general uppercase text-lg cursor-pointer"
        ></div>
      )}

      {/* Center text for Globe */}
      {showGlobe && (
        <div
          ref={centerTextRef}
          className="absolute z-10 text-center pointer-events-none"
        >
          <h2 className="font-bebas-neue text-6xl tracking-wider text-[#009BCE]">
            Who Are We?
          </h2>
        </div>
      )}
    </section>
  );
};

export default Hero;
