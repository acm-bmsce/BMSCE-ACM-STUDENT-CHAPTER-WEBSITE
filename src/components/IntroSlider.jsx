// IntroSlider.jsx
import { useLayoutEffect, useRef, useState } from "react";
import gsap from "gsap";

/**
 * Plays the “WELCOME to BMSCE ACM Student Chapter” animation
 * the first time the site is opened in this tab.
 * After it finishes, it hides itself and never renders again.
 */
export default function IntroSlider() {
  const sliderRef = useRef(null);
  const [visible, setVisible] = useState(() => {
    // sessionStorage survives full-page refreshes in the same tab,
    // but resets when the tab is closed.
    return !sessionStorage.getItem("introPlayed");
  });

  useLayoutEffect(() => {
    if (!visible) return;

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        onComplete() {
          // mark as played so it won't run again
          sessionStorage.setItem("introPlayed", "true");
          // hide the slider
          setVisible(false);
        },
      });

      tl.from("#intro-slider", {
        scale: 1,
        duration: 1,
        ease: "power3.out",
        backgroundColor: "#000",
      })
        .to("#intro-slider", {
          duration: 1.3,
          ease: "power3.inOut",
          backgroundColor: "#000",
        })
        .fromTo("#title-1", { x: "-100vw" }, { x: 0, duration: 0.5 })
        .fromTo("#title-2", { x: "100vw" }, { x: 0, duration: 0.5 })
        .fromTo("#title-3", { x: "-100vw" }, { x: 0, duration: 0.5 })
        .fromTo("#title-4", { x: "100vw" }, { x: 0, duration: 0.5 })
        .to(["#title-1", "#title-2", "#title-3", "#title-4"], {
          scale: 4,
          opacity: 0,
          duration: 0.6,
          stagger: 0.1,
          ease: "power4.in",
        })
        .to("#intro-slider", {
          scale: 0,
          opacity: 0,
          duration: 0.5,
        });
    }, sliderRef);

    return () => ctx.revert();
  }, [visible]);

  if (!visible) return null; // nothing to render after first run

  return (
    <div
      ref={sliderRef}
      id="intro-slider"
      className="fixed inset-0 z-[90] flex flex-col items-center justify-center space-y-10 bg-black p-10 font-spaceGrotesk font-extrabold tracking-tight text-blue-100"
    >
      <h1 id="title-1" className="special-font hero-heading text-4xl md:text-8xl">
        WELCOME
      </h1>
      <h1 id="title-2" className="special-font hero-heading text-4xl md:text-6xl uppercase">
        to
      </h1>
      <h1
        id="title-3"
        className="special-font hero-heading text-4xl md:text-8xl uppercase text-blue-300"
      >
        BMSCE ACM
      </h1>
      <h1
        id="title-4"
        className="special-font hero-heading text-4xl md:text-8xl uppercase text-blue-300"
      >
        Student Chapter
      </h1>
    </div>
  );
}
