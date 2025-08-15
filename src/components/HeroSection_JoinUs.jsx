import React from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import AnimatedTitle from "./AnimatedTitle";


const HeroSection = () => {
  useGSAP(() => {
    const masterTimeline = gsap.timeline({
      delay: 0.5, 
    });

    masterTimeline.fromTo(
      ".mask-clip-path",
      {
        clipPath: "circle(250px at center)",
        opacity: 0,
        scale: 0.9,
      },
      {
        clipPath: "circle(150% at center)",
        opacity: 1,
        scale: 1,
        duration: 2.5, 
        ease: "power2.inOut",
      }
    );

    masterTimeline.to(
      ".image-overlay",
      {
        opacity: 0.75,
        duration: 2.5,
        ease: "power2.inOut",
      },
      "<" 
    );

    masterTimeline.to(
      ".text-content",
      {
        opacity: 1,
        duration: 1.5,
        ease: "power2.inOut",
      },
      "<1" 
    );
  }, []);

  return (
    <div id="about-container" className="relative h-screen w-screen">
      <div id="clip" className="h-screen w-screen">
        <div className="mask-clip-path relative h-screen w-screen">
          <div className="text-content absolute inset-0 top-20 z-20 flex flex-col items-center justify-center px-4 text-center opacity-0">
            <AnimatedTitle
              title="JOIN THE<br /> BMSCE ACM STUDENT CHAPTER"
              
              containerClass="animated-title_joinus !text-white text-center mb-2"
            />
            
            
            <div className="about-subtext_joinus mt-4 text-white">
              <p className="text-base md:text-lg lg:text-xl">
                Join over 500 students and <br />
                level up by becoming a member <br /> of the BMSCE ACM Student
                Chapter community.
              </p>
            </div>
          </div>
          <img
            src="/img/42.webp"
            alt="BMSCE ACM Student Chapter"
            className="h-full w-full object-cover"
          />
          <div className="image-overlay absolute inset-0 z-10 bg-black opacity-60"></div>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;
