import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/all";

import AnimatedTitle from "./AnimatedTitle";

gsap.registerPlugin(ScrollTrigger);

const About = () => {
  useGSAP(() => {
    // ✅ Determine initial size based on screen height & width
    const h = window.innerHeight;
    const w = window.innerWidth;

    let initialWidth, initialHeight;

    if (h < 700 && w > 767) {
      // Short desktop screens
      initialWidth = "80vh";
      initialHeight = "50vh";
    } else if (h < 850 && w <= 767) {
      // Mobile / tablet screens
      initialWidth = "80vw";
      initialHeight = "47vh";
    } else {
      // Default larger screens
      initialWidth = "60vw";
      initialHeight = "62vh";
    }

    // ✅ Set initial size after layout
    const setInitialSize = () => {
      gsap.set(".about-clip-path", { width: initialWidth, height: initialHeight });
    };

    // Run immediately and also after window load (to account for images)
    setInitialSize();
    window.addEventListener("load", setInitialSize);

    // ✅ Timeline animation
    const animation = gsap.timeline({
      scrollTrigger: {
        id: "about-clip",
        trigger: "#clip",
        start: "center center",
        end: "+=800 center",
        scrub: 0.5,
        pin: true,
        pinSpacing: true,
      },
    });

    animation.to(".about-clip-path", {
      width: "100vw",
      height: "100vh",
      borderRadius: 0,
      ease: "power2.out",
    });

    ScrollTrigger.refresh();

    return () => {
      window.removeEventListener("load", setInitialSize);
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
            Your gateway to the world of computing. Dive into a vibrant
            community where students, tech, and innovation collide through
            events, learning, and endless possibilities.
          </p>
        </div>
      </div>

      <div className="h-screen w-screen" id="clip">
        <div className="mask mask-clip-path about-clip-path about-image">
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
