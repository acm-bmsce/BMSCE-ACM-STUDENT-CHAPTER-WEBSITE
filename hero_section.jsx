import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/all";

import AnimatedTitle from "./AnimatedTitle";

gsap.registerPlugin(ScrollTrigger);

const About = () => {
  useGSAP(() => {
    const clipAnimation = gsap.timeline({
      scrollTrigger: {
        trigger: "#clip",
        start: "center center",
        end: "+=800 center",
        scrub: 0.5,
        pin: true,
        pinSpacing: true,
      },
    });

    clipAnimation.to(".mask-clip-path", {
      width: "100vw",
      height: "100vh",
      borderRadius: 0,
    });
  });

  return (
    <div id="about" className="min-h-screen w-screen">
      <div className="relative mb-8 mt-36 flex flex-col items-center gap-5 px-4 text-center">
        {/* <p className="font-general text-sm uppercase md:text-[20px]">
          Welcome to BMSCE ACM STUDENT CHAPTER
        </p> */}

        <AnimatedTitle
          title="JOIN THE  <br /> BMSCE ACM STUDENT CHAPTER"
          containerClass="mt-6 !text-black text-center"
        />

        <p className="font-general text-sm uppercase md:text-[20px] text-center">
          Where innovation meets community – Shape your tech future with us
        </p>

        <div className="about-subtext">
          <p className="text-base md:text-lg lg:text-xl font-semibold text-black">
            Level up with BMSCE ACM Student Chapter
          </p>
          <p className="text-gray-500 text-sm md:text-base">
            Become a Member <br />
            Join 500+ students already part of our community
          </p>
        </div>
      </div>

      {/* 
      <div className="h-screen w-screen" id="clip">
        <div className="mask-clip-path about-image ">
          <img
            src="img/about.webp"
            alt="Background"
            className="absolute left-0 top-0 size-full object-cover"
          />
        </div>
      </div> 
      */}
    </div>
  );
};

export default About;
