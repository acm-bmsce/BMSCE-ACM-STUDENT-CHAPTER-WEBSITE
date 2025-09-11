import { useState, useRef, useEffect } from "react";
import { TiLocationArrow } from "react-icons/ti";
import AnimatedTitle from "./AnimatedTitle";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/all";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger);

const isMobile =
  typeof window !== "undefined" &&
  ("ontouchstart" in window || navigator.maxTouchPoints > 0);

const debounce = (fn, delay) => {
  let frame;
  return (...args) => {
    if (frame) cancelAnimationFrame(frame);
    frame = requestAnimationFrame(() => fn(...args));
  };
};

export const BentoTilt = ({ children, className = "" }) => {
  const [transformStyle, setTransformStyle] = useState("");
  const itemRef = useRef(null);

  useGSAP(() => {
    if (itemRef.current) {
      const runAnim = () => {
        gsap.fromTo(
          itemRef.current,
          { y: 100, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 1,
            ease: "power3.out",
            willChange: "transform, opacity",
            scrollTrigger: {
              trigger: itemRef.current,
              start: "top 85%",
              toggleActions: "play none none reverse",
            },
          }
        );
      };
      if ("requestIdleCallback" in window) {
        requestIdleCallback(runAnim);
      } else {
        setTimeout(runAnim, 100);
      }
    }
  }, []);

  const handleMouseMove = !isMobile
    ? debounce((event) => {
        if (!itemRef.current) return;
        const { left, top, width, height } = itemRef.current.getBoundingClientRect();
        const relativeX = (event.clientX - left) / width;
        const relativeY = (event.clientY - top) / height;
        const tiltX = (relativeY - 0.5) * 5;
        const tiltY = (relativeX - 0.5) * -5;
        setTransformStyle(
          `perspective(700px) rotateX(${tiltX}deg) rotateY(${tiltY}deg) scale3d(.95, .95, .95)`
        );
      }, 32)
    : undefined;

  const handleMouseLeave = !isMobile ? () => setTransformStyle("") : undefined;

  return (
    <div
      ref={itemRef}
      className={className}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        transform: isMobile ? undefined : transformStyle,
        willChange: "transform, opacity",
        transformStyle: "preserve-3d",
        backfaceVisibility: "hidden",
      }}
    >
      {children}
    </div>
  );
};

export const BentoCard = ({ videoSrc, imgSrc, title, description, isComingSoon }) => {
  const [cursorPosition, setCursorPosition] = useState({ x: 0, y: 0 });
  const [hoverOpacity, setHoverOpacity] = useState(0);
  const hoverButtonRef = useRef(null);
  const videoRef = useRef(null);

  const handleMouseMove = (event) => {
    if (!hoverButtonRef.current) return;
    const rect = hoverButtonRef.current.getBoundingClientRect();
    setCursorPosition({
      x: event.clientX - rect.left,
      y: event.clientY - rect.top,
    });
  };

  const handleMouseEnter = () => setHoverOpacity(1);
  const handleMouseLeave = () => setHoverOpacity(0);

  useEffect(() => {
    if (!isMobile && videoRef.current) {
      const observer = new IntersectionObserver(
        ([entry]) => {
          if (videoRef.current) {
            if (entry.isIntersecting) {
              videoRef.current.play().catch(() => {});
            } else {
              videoRef.current.pause();
            }
          }
        },
        { threshold: 0.6 }
      );
      observer.observe(videoRef.current);
      return () => observer.disconnect();
    }
  }, []);

  return (
    <div className="relative w-full h-full overflow-hidden rounded-md">
      {imgSrc ? (
        <img
          src={imgSrc}
          alt={title}
          className="absolute left-0 top-0 w-full h-full object-cover object-center opacity-40"
        />
      ) : isMobile ? (
        <img
          src={videoSrc.replace(".mp4", ".webp")}
          alt={title}
          className="absolute left-0 top-0 w-full h-full object-cover object-center opacity-40"
        />
      ) : (
        <video
          ref={videoRef}
          loop
          muted
          preload="auto"
          playsInline
          className="absolute left-0 top-0 w-full h-full object-cover object-center opacity-40 pointer-events-none"
        >
          <source src={videoSrc.replace(".mp4", ".webm")} type="video/webm" />
          <source src={videoSrc} type="video/mp4" />
        </video>
      )}

      <div className="relative z-10 flex size-full flex-col justify-between p-5 text-blue-50">
        <div>
          <h1 className="bento-title special-font">{title}</h1>
          {description && (
            <p className="mt-3 max-w-64 text-xs md:text-base">{description}</p>
          )}
        </div>

        {isComingSoon && (
          <div
            ref={hoverButtonRef}
            onMouseMove={!isMobile ? handleMouseMove : undefined}
            onMouseEnter={!isMobile ? handleMouseEnter : undefined}
            onMouseLeave={!isMobile ? handleMouseLeave : undefined}
            className="relative flex w-fit cursor-pointer items-center gap-1 overflow-hidden rounded-full bg-black px-5 py-2 text-xs uppercase text-white/20 border border-white/10"
          >
            {!isMobile && (
              <div
                className="pointer-events-none absolute -inset-px transition duration-300"
                style={{
                  opacity: hoverOpacity,
                  background: `radial-gradient(100px circle at ${cursorPosition.x}px ${cursorPosition.y}px, #656fe288, #00000026)`,
                }}
              />
            )}
            <TiLocationArrow className="relative z-20" />
            <p className="relative z-20">coming soon</p>
          </div>
        )}
      </div>
    </div>
  );
};

const Features = () => (
  <section className="bg-black pb-52">
    <div className="container mx-auto py-32 px-3 md:px-10">
      <AnimatedTitle
        title="our domains"
        containerClass="mt-[200px] !text-white text-center"
      />

      <BentoTilt className="border-hsla relative mb-7 h-96 w-full overflow-hidden rounded-md lg:h-[65vh]">
        <BentoCard
          imgSrc="videos/hackathon.webp"
          title={<>TECHNICAL</>}
          description="Promoting innovation through coding, projects, and hackathon participation."
        />
      </BentoTilt>

      <div className="grid h-[135vh] w-full grid-cols-1 lg:grid-cols-2 grid-rows-6 gap-7">
        {[
          {
            videoSrc: "videos/design.mp4",
            title: "Media and Design",
            description:
              "Showcasing our work through creative visuals, content, and design.",
          },
          {
            videoSrc: "videos/seminar.mp4",
            title: "Seminars and Workshops",
            description: "Hosting expert talks and hands-on learning sessions.",
          },
          {
            videoSrc: "videos/research.mp4",
            title: "Research",
            description:
              "Exploring AI, ML, and emerging tech through research and publications.",
            isComingSoon: true,
          },
          {
            imgSrc: "videos/event.webp",
            title: "Event Management",
            description: "Planning and executing events with seamless coordination.",
          },
          {
            imgSrc: "videos/community.webp",
            title: "Community Service",
            description:
              "Driving impact through outreach, education, and social initiatives.",
          },
        ].map((item, index) => (
          <BentoTilt
            key={index}
            className="bento-tilt_1 row-span-1 md:col-span-1 lg:row-span-2"
          >
            <BentoCard {...item} />
          </BentoTilt>
        ))}

        <BentoTilt className="bento-tilt_1 row-span-1 md:col-span-1 lg:row-span-2">
          <div className="flex w-full size-full flex-col justify-between bg-blue-300 p-5">
            <h1 className="bento-title special-font w-full text-black">
              M<b>o</b>re co<b>m</b>ing s<b>o</b>on.
            </h1>
            <TiLocationArrow className="m-5 scale-[5] self-end" />
          </div>
        </BentoTilt>
      </div>
    </div>
  </section>
);

export default Features;
