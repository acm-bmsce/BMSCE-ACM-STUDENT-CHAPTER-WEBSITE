import React from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import AnimatedTitle from "./AnimatedTitle";


const About = () => {
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
        opacity: 0.6,
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

export default About;
