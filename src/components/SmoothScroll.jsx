import { ReactLenis } from "lenis/dist/lenis-react";

const SmoothScroll = () => {
  const isMobile = typeof window !== "undefined" &&
    ("ontouchstart" in window || navigator.maxTouchPoints > 0);

  return (
    <div className="bg-zinc-950">
      {!isMobile ? (
        <ReactLenis
          root
          options={{
            lerp: 0.05,
          }}
        >
          
        </ReactLenis>
      ) : (
        // Fallback for mobile — native scroll
        <div>
         
        </div>
      )}
    </div>
  );
};

export default SmoothScroll;
