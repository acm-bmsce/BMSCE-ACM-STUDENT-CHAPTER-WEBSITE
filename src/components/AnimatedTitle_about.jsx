import { gsap } from "gsap";
import { useEffect, useRef } from "react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import clsx from "clsx";

gsap.registerPlugin(ScrollTrigger);

const AnimatedTitle = ({ title, containerClass, className }) => {
  const containerRef = useRef(null);
  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.to(containerRef.current.querySelectorAll(".animated-word"), {
        opacity: 1,
        transform: "translate3d(0, 0, 0) rotateY(0deg) rotateX(0deg)",
        ease: "power2.inOut",
        stagger: 0.02,
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top 85%",
          end: "bottom center",
          toggleActions: "play none none reverse",
        },
      });
    }, containerRef);
    return () => ctx.revert();
  }, []);

  return (
    <div ref={containerRef} className={clsx("animated-title", containerClass)}>
      {title.split("<br />").map((line, index) => (
        <div key={index} className={clsx("flex justify-center flex-wrap gap-2 lg:gap-3", className)}>
          {line.split(" ").map((word, idx) => (
            <span key={idx} className="animated-word" dangerouslySetInnerHTML={{ __html: word }} />
          ))}
        </div>
      ))}
    </div>
  );
};
export default AnimatedTitle;