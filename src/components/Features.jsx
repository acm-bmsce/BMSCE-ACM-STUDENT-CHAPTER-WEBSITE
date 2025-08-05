import { useState, useRef, useEffect } from "react";
import { TiLocationArrow } from "react-icons/ti";
import ScrollFloat from "./ScrollFloat";
import BlurText from "./BlurText";
import AnimatedTitle from "./AnimatedTitle";

import gsap from "gsap";
import { ScrollTrigger } from "gsap/all";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger);

export const BentoTilt = ({ children, className = "" }) => {
  const [transformStyle, setTransformStyle] = useState("");
  const itemRef = useRef(null);

  useGSAP(() => {
    if (itemRef.current) {
      gsap.fromTo(
        itemRef.current,
        {
          y: 100,
          opacity: 0,
        },
        {
          y: 0,
          opacity: 1,
          duration: 1,
          ease: "power3.out",
          scrollTrigger: {
            trigger: itemRef.current,
            start: "top 85%",
            toggleActions: "play none none reverse",
          },
        }
      );
    }
  }, []);

  const handleMouseMove = (event) => {
    if (!itemRef.current) return;
    const { left, top, width, height } = itemRef.current.getBoundingClientRect();

    const relativeX = (event.clientX - left) / width;
    const relativeY = (event.clientY - top) / height;

    const tiltX = (relativeY - 0.5) * 5;
    const tiltY = (relativeX - 0.5) * -5;

    const newTransform = `perspective(700px) rotateX(${tiltX}deg) rotateY(${tiltY}deg) scale3d(.95, .95, .95)`;
    setTransformStyle(newTransform);
  };

  const handleMouseLeave = () => {
    setTransformStyle("");
  };

  return (
    <div
      ref={itemRef}
      className={className}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ transform: transformStyle, willChange: "transform" }}
    >
      {children}
    </div>
  );
};

export const BentoCard = ({ src, title, description, isComingSoon }) => {
  const [cursorPosition, setCursorPosition] = useState({ x: 0, y: 0 });
  const [hoverOpacity, setHoverOpacity] = useState(0);
  const hoverButtonRef = useRef(null);

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

  return (
    <div className="relative w-full h-full will-change-transform overflow-hidden rounded-md">
      <video
        src={src}
        loop
        muted
        autoPlay
        preload="none"
        playsInline
        loading="lazy"
        className="absolute left-0 top-0 w-full h-full object-cover object-center opacity-50 pointer-events-none"
      />
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
            onMouseMove={handleMouseMove}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            className="relative flex w-fit cursor-pointer items-center gap-1 overflow-hidden rounded-full bg-black px-5 py-2 text-xs uppercase text-white/20 border border-white/10"
            style={{ willChange: "opacity, transform" }}
          >
            <div
              className="pointer-events-none absolute -inset-px transition duration-300"
              style={{
                opacity: hoverOpacity,
                background: `radial-gradient(100px circle at ${cursorPosition.x}px ${cursorPosition.y}px, #656fe288, #00000026)`,
              }}
            />
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

      <BentoTilt className="border-hsla relative mb-7 h-96 w-full overflow-hidden rounded-md lg:h-[65vh] will-change-transform">
        <BentoCard
          src="videos/hackathon.mp4"
          title={<>TECHNICAL</>}
          description="Promoting innovation through coding, projects, and hackathon participation."
        />
      </BentoTilt>

      <div className="grid h-[135vh] w-full grid-cols-1 lg:grid-cols-2 grid-rows-6 gap-7">
        {[
          {
            src: "videos/design.mp4",
            title: "Media and Design",
            description:
              "Showcasing our work through creative visuals, content, and design.",
          },
          {
            src: "videos/seminar.mp4",
            title: "Seminars and Workshops",
            description: "Hosting expert talks and hands-on learning sessions.",
          },
          {
            src: "videos/research.mp4",
            title: "Research",
            description:
              "Exploring AI, ML, and emerging tech through research and publications.",
            isComingSoon: true,
          },
          {
            src: "videos/event.mp4",
            title: "Event Management",
            description:
              "Planning and executing events with seamless coordination.",
          },
          {
            src: "videos/community.mp4",
            title: "Community Service",
            description:
              "Driving impact through outreach, education, and social initiatives.",
          },
        ].map((item, index) => (
          <BentoTilt
            key={index}
            className="bento-tilt_1 row-span-1 md:col-span-1 lg:row-span-2 will-change-transform"
          >
            <BentoCard {...item} />
          </BentoTilt>
        ))}

        <BentoTilt className="bento-tilt_1 row-span-1 md:col-span-1 lg:row-span-2 will-change-transform">
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
