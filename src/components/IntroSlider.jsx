// IntroSlider.jsx
import { useEffect, useRef, useState } from "react";
import lottie from "lottie-web";

/**
 * Plays the Lottie intro animation the first time
 * the site is opened in this tab. After it finishes,
 * it hides itself and never renders again.
 * Plays a different animation on mobile devices.
 */
export default function IntroSlider() {
  const containerRef = useRef(null);
  const animRef = useRef(null);
  const [visible, setVisible] = useState(() => {
    return !sessionStorage.getItem("introPlayed");
  });
  const [fadeOut, setFadeOut] = useState(false);

  useEffect(() => {
    if (!visible) return;

    // Detect mobile devices (simple width check)
    const isMobile = window.innerWidth <= 768;

    const animationPath = isMobile
      ? "/animations/intro-mob.json"
      : "/animations/intro.json";

    animRef.current = lottie.loadAnimation({
      container: containerRef.current,
      renderer: "svg",
      loop: false,
      autoplay: true,
      path: animationPath,
      rendererSettings: {
        preserveAspectRatio: "xMidYMid slice",
      },
    });

    // Set playback speed
    animRef.current.setSpeed(isMobile ? 1 : 1.5);

    // When animation completes
    animRef.current.addEventListener("complete", () => {
      setFadeOut(true);

      setTimeout(() => {
        sessionStorage.setItem("introPlayed", "true");
        setVisible(false);
      }, 500); // matches CSS transition duration
    });

    return () => {
      animRef.current?.destroy();
    };
  }, [visible]);

  if (!visible) return null;

  return (
    <div
      className={`fixed inset-0 z-[9999] flex items-center justify-center bg-black transition-opacity duration-500 ${
        fadeOut ? "opacity-0" : "opacity-100"
      }`}
    >
      <div ref={containerRef} className="w-full h-full overflow-hidden" />
    </div>
  );
}
