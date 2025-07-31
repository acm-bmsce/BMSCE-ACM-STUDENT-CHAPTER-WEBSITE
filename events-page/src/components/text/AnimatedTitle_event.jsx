import { gsap } from "gsap";
import { useEffect, useRef } from "react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import clsx from "clsx";

gsap.registerPlugin(ScrollTrigger);

const AnimatedTitle = ({ title, containerClass }) => {
  const containerRef = useRef(null);
  

  useEffect(() => {
    const ctx = gsap.context(() => {
    //   const titleAnimation = gsap.timeline({
    //     scrollTrigger: {
    //       trigger: containerRef.current,
    //       start: "center center ",
    //       end: "150 top",
    //       toggleActions: "play none none reverse",
    //     },
    //   });
        
    
        
      gsap.fromTo(
        ".animated-word",

        {
          opacity: 0,
          transform: "translate3d(10px, 51px, -60px) rotateY(60deg) rotateX(-40deg)",
          ease: "power2.inOut",

        },

        {
          opacity: 1,
          transform: "translate3d(0, 0, 0) rotateY(0deg) rotateX(0deg)",
          ease: "power2.inOut",
          stagger: 0.02,
        },
      );
    }, containerRef);

    return () => ctx.revert(); // Clean up on unmount
  }, []);

  return (
    <div ref={containerRef} className={clsx("animated-title", containerClass)}>
      {title.split("<br />").map((line, index) => (
        <div
          key={index}
          className="flex-center max-w-full flex-wrap gap-2 px-10 lg:gap-3"
        >
          {line.split(" ").map((word, idx) => (
            <span
              key={idx}
              className="animated-word text-center mx-5"
              dangerouslySetInnerHTML={{ __html: word }}
            />
          ))}
        </div>
      ))}
    </div>
  );
};

export default AnimatedTitle;
