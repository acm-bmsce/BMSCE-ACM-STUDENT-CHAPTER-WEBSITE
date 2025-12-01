import React, { useRef, useLayoutEffect } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import AnimatedTitle from "./AnimatedTitle";
import Card from "./Teamcaard/TeamCard";

gsap.registerPlugin(ScrollTrigger);

const Coreteam = ({ members }) => {
  const sectionRef = useRef(null);
  const headingRef = useRef(null);
  const descriptionRef = useRef(null);
  const cardsRef = useRef([]); // NEW: to hold each card's ref

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      // Animate heading and description
      gsap.fromTo(
        [headingRef.current, descriptionRef.current],
        { opacity: 0, y: 40 },
        {
          opacity: 1,
          y: 0,
          duration: 1,
          ease: "power2.out",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 80%",
          },
        }
      );

      // Animate each card
      cardsRef.current.forEach((card, i) => {
        gsap.fromTo(
          card,
          { opacity: 0, y: 60 },
          {
            opacity: 1,
            y: 0,
            duration: 0.8,
            ease: "power2.out",
            delay: i * 0.1,
            scrollTrigger: {
              trigger: card,
              start: "top 90%",
              toggleActions: "play none none reverse",
            },
          }
        );
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={sectionRef} className="w-full bg-black text-white py-24 px-6">
      {/* Heading */}
      <div className="text-center">
        <div ref={headingRef}>
          <AnimatedTitle
            title="CORE  2025-2026"
            containerClass="!text-blue-100 text-center text-3xl md:text-4xl lg:text-8xl"
          />
        </div>
        <div ref={descriptionRef}>
          <p className="text-gray-300 text-base mb-12 md:text-lg max-w-2xl mx-auto ">
            The driving force behind all initiatives—our Core Team leads with
            passion, purpose, and a spirit of innovation.
          </p>
        </div>
      </div>

      {/* Grid Layout for Cards */}
      <div
        className="
    team-grid
    flex flex-wrap justify-center gap-x-20 gap-y-12 px-4 w-full mx-auto
    max-[400px]:grid max-[400px]:grid-cols-1 max-[400px]:place-items-center max-[400px]:gap-x-4 max-[400px]:gap-y-8
  "
      >
        {members.map((member, idx) => (
          <div
            key={idx}
            ref={(el) => (cardsRef.current[idx] = el)}
            className="
    w-full max-w-[350px] sm:w-[calc(50%-20px)] lg:w-[calc(33.333%-20px)]
    max-[400px]:w-auto
    aspect-[1/1] sm:aspect-[4/5]
  "
          >
            <Card
              name={member.name}
              pic={member.image}
              role1={member.role1}
              role2={member.role2}
              linkedin={member.socials.linkedin}
              email={member.socials.email}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default Coreteam;
