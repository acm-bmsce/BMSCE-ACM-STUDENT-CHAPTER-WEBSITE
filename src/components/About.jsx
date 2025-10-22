import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/all";

import AnimatedTitle from "./AnimatedTitle";

gsap.registerPlugin(ScrollTrigger);

const About = () => {
  useGSAP(() => {
    const isShortScreen = window.innerHeight < 500;

  // ✅ Start smaller if the height < 500
  gsap.set(".mask-clip-path", {
    width: isShortScreen ? "80vh" : "100vw", // start from your CSS value
    height: isShortScreen ? "50vh" : "100vh",
  });


    const animation = gsap.timeline({
      scrollTrigger: {
        id: "about-clip", // ✅ unique ID
        trigger: "#clip",
        start: "center center",
        end: "+=800 center",
        scrub: 0.5,
        pin: true,
        pinSpacing: true,
      },
    });

    animation.to(".mask-clip-path", {
      width: "100vw",
      height: "100vh",
      borderRadius: 0,
    });

    ScrollTrigger.refresh(true);

    // ✅ Cleanup only this animation & trigger on unmount
    return () => {
      ScrollTrigger.getById("about-clip")?.kill();
      animation.kill();
    };
  });

  return (
    <div id="about" className="min-h-screen w-screen">
      <div className="relative mb-8 mt-36 flex flex-col items-center gap-5">
        <p className="font-general text-sm uppercase md:text-[20px]">
          Welcome to BMSCE ACM STUDENT CHAPTER
        </p>

        <AnimatedTitle
          title="Transforming Passion <br /> into Progress"
          containerClass="mt-5 !text-black text-center"
        />

        <div className="about-subtext">
          <p>Level up with BMSCE ACM Student Chapter</p>
          <p className="text-gray-500">
            Your gateway to the world of computing. Dive into a vibrant community where students,
            tech, and innovation collide through events, learning, and endless possibilities.
          </p>
        </div>
      </div>

      <div className="h-screen w-screen" id="clip">
        <div className="mask mask-clip-path about-image">
          <img
            src="img/about.webp"
            alt="Background"
            className="absolute left-0 top-0 size-full object-cover"
          />
        </div>
      </div>
    </div>
  );
};

export default About;
