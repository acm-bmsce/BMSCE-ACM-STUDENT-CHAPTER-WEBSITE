import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/all";
import { useRef } from "react";
import AnimatedTitle from "./AnimatedTitle";

gsap.registerPlugin(ScrollTrigger);

const TeamsHero = () => {
  const heroRef = useRef(null);
  const descriptionRef = useRef(null);

  // Circular Fade-In on Load
  useGSAP(() => {
    gsap.fromTo(
      "#circular-mask",
      {
        clipPath: "circle(0% at 50% 50%)",
      },
      {
        clipPath: "circle(150% at 50% 50%)",
        duration: 2.5,
        ease: "power2.out",
      }
    );
  }, { scope: heroRef });

  // GSAP Background Animation
  useGSAP(() => {
    gsap.set("#hero-bg-frame", {
      clipPath: "polygon(14% 0, 72% 0, 88% 90%, 0 95%)",
      borderRadius: "0% 0% 42% 15%",
    });
    gsap.from("#hero-bg-frame", {
      clipPath: "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)",
      borderRadius: "0% 0% 0% 0%",
      ease: "power1.inOut",
      scrollTrigger: {
        trigger: "#hero-bg-frame",
        start: "center center",
        end: "bottom center",
        scrub: true,
      },
    });
  }, { scope: heroRef });

  // Animate Text
  useGSAP(() => {
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: heroRef.current,
        start: "top center",
        end: "bottom center",
        toggleActions: "play none none reverse",
      },
    });
    tl.fromTo(
      descriptionRef.current,
      { opacity: 0, y: 50 },
      { opacity: 1, y: 0, duration: 0.8, ease: "power2.out" },
      "+=0.5"
    );
  }, { scope: heroRef });

  return (
    <div ref={heroRef} className="relative h-dvh w-screen overflow-x-hidden bg-black flex items-center justify-center">
      {/* Circular Reveal Mask */}
      <div id="circular-mask" className="absolute inset-0 z-10 bg-black">
        <div className="relative h-full w-full flex items-center justify-center">
          {/* GSAP Background */}
          <div
            id="hero-bg-frame"
            className="absolute inset-0 z-0 overflow-hidden"
            style={{ pointerEvents: 'none' }}
          >
            <img
              src="img/18.webp"
              alt="Teams background"
              className="w-full h-full object-cover absolute inset-0 z-30 opacity-40"
              style={{ pointerEvents: 'none' }}
            />
          </div>

          {/* Hero Content */}
          <div className="relative z-20 text-center -top-6 px-5 lg:px-10 max-w-4xl mx-auto">
            <AnimatedTitle
              title="OUR TEAM"
              containerClass="!text-white !text-[5rem] md:!text-[8rem] text-center mb-8"
            />
            <p
              ref={descriptionRef}
              className="mb-8 max-w-2xl mx-auto font-robert-regular text-white text-2xl md:text-xl leading-relaxed"
            >
              Discover the passionate minds behind our innovation. <br />
              Meet the dedicated individuals who drive our community forward.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TeamsHero;
