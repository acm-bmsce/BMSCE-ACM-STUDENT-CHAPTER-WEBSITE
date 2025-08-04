// src/components/Hero.jsx

"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import TagCloud from "TagCloud";
import TextType from "./TextType"; // ✅ make sure path is correct

const values = [
  "Innovation", "Community", "Excellence",
  "Growth", "Collaboration", "Technology",
  "Research", "Leadership", "Events", "Workshops"
];

const Hero = () => {
  const containerRef = useRef(null);
  const cloudRef = useRef(null);
  const centerTextRef = useRef(null);
  const [isMorphed, setIsMorphed] = useState(false);
  const [showTextType, setShowTextType] = useState(false);
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

    timeoutRef.current = setTimeout(() => {
      setIsMorphed(true);
    }, 8000);

    return () => {
      tagCloudInstance.destroy();
      clearTimeout(timeoutRef.current);
    };
  }, []);

  // Morph animation using GSAP
  useGSAP(() => {
    if (isMorphed) {
      gsap.to([cloudRef.current, centerTextRef.current], {
        opacity: 0,
        scale: 0.5,
        duration: 0.8,
        ease: "power3.in",
        onComplete: () => {
          setShowTextType(true); // Show typewriter effect after animation
        },
      });
    }
  }, { scope: containerRef, dependencies: [isMorphed] });

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
        {/* TagCloud renders here */}
      </div>

      <div
        ref={centerTextRef}
        className="absolute z-10 text-center pointer-events-none"
      >
        <h2 className="font-bebas-neue text-6xl tracking-wider text-[#009BCE]">
          Who Are We?
        </h2>
      </div>

      {/* ✅ Final Headline with TextType after morph */}
      {showTextType && (
        <TextType
          text={["WELCOME TO BMSCE ACM STUDENT CHAPTER", "FIND YOUR PEOPLE","FIND YOUR PASSION"]}
          as="h1"
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20 text-center text-white font-robert-medium !text-[5rem] md:!text-6xl lg:!text-[6rem] font-bold"
          typingSpeed={80}
          deletingSpeed={50}
          pauseDuration={2000}
          initialDelay={200}
          loop={true}
          showCursor={true}
          hideCursorWhileTyping={false}
          cursorCharacter="."
          cursorBlinkDuration={0.5}
          textColors={["#ffffff", "#00BFFF"]}
        />
      )}
    </section>
  );
};

export default Hero;
