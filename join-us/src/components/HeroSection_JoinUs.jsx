import React from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import AnimatedTitle from "./AnimatedTitle";

// ScrollTrigger is not used, so it can be removed
// import { ScrollTrigger } from "gsap/all";
// gsap.registerPlugin(ScrollTrigger);

const About = () => {
  useGSAP(() => {
    // A single master timeline for all page-load animations
    const masterTimeline = gsap.timeline({
      delay: 0.5, // A brief delay before the whole sequence starts
    });

    // 1. THE FIX: A single fromTo() tween for a seamless animation
    masterTimeline.fromTo(
      ".mask-clip-path",
      {
        // Starting State
        clipPath: "circle(250px at center)",
        opacity: 0,
        scale: 0.9,
      },
      {
        // Ending State
        clipPath: "circle(150% at center)",
        opacity: 1,
        scale: 1,
        duration: 2.5, // Total duration for the main reveal
        ease: "power2.inOut",
      }
    );

    // 2. Animate the dark overlay at the same time
    masterTimeline.to(
      ".image-overlay",
      {
        opacity: 0.6,
        duration: 2.5,
        ease: "power2.inOut",
      },
      "<" // Starts at the same time as the fromTo animation
    );

    // 3. Fade in the text content, starting 1 second into the main reveal
    masterTimeline.to(
      ".text-content",
      {
        opacity: 1,
        duration: 1.5,
        ease: "power2.inOut",
      },
      "<1" // Starts 1 second after the beginning of the previous animations
    );
  }, []);

  return (
    <div id="about-container" className="relative h-screen w-screen">
      <div id="clip" className="h-screen w-screen">
        {/* The opacity-0 class is no longer needed here */}
        <div className="mask-clip-path relative h-screen w-screen">
          <div className="text-content absolute inset-0 z-20 flex flex-col items-center justify-center gap-5 px-4 text-center opacity-0">
            <AnimatedTitle
              title="JOIN THE  <br /> BMSCE ACM STUDENT CHAPTER"
              containerClass="!text-white text-center"
            />
            <p className="font-general text-sm uppercase text-white md:text-[20px]">
              Where innovation meets community – Shape your tech future with us
            </p>
            <div className="about-subtext text-white">
              <p className="text-base font-semibold md:text-lg lg:text-xl">
                Level up with BMSCE ACM Student Chapter
              </p>
              <p className="text-gray-300 text-sm md:text-base">
                Become a Member <br />
                Join 500+ students already part of our community
              </p>
            </div>
          </div>
          <img
            src="/img/42.jpg"
            alt="BMSCE ACM Student Chapter"
            className="h-full w-full object-cover"
          />
          <div className="image-overlay absolute inset-0 z-10 bg-black opacity-0"></div>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;
