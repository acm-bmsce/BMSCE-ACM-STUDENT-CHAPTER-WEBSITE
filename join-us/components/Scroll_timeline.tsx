import React, { useState, useEffect, useRef } from "react";
import { motion, useScroll, useTransform, useSpring } from "framer-motion";
import { cn } from "../lib/utils";

export interface TimelineEvent {
  id?: string;
  year: string;
  title: string;
  description?: string | React.ReactNode;
  icon?: React.ReactNode;
  color?: string;
}

export interface ScrollTimelineProps {
  events: TimelineEvent[];
  animationOrder?: "sequential" | "staggered" | "simultaneous";
  lineColor?: string;
  progressIndicator?: boolean;
  progressLineWidth?: number;
  progressLineCap?: "round" | "square";
  className?: string;
  revealAnimation?: "fade" | "slide" | "scale" | "none";
  connectorStyle?: "dots" | "line" | "dashed";
  darkMode?: boolean;
}

export const ScrollTimeline = ({
  events,
  animationOrder = "staggered",
  lineColor = "bg-primary/30",
  progressIndicator = true,
  progressLineWidth = 2,
  progressLineCap = "round",
  revealAnimation = "fade",
  className = "",
  connectorStyle = "line",
  darkMode = false,
}: ScrollTimelineProps) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(-1);

  const eventPairs: TimelineEvent[][] = [];
  for (let i = 0; i < events.length; i += 2) {
    eventPairs.push(events.slice(i, i + 2));
  }

  const { scrollYProgress } = useScroll({
    target: scrollRef,
    offset: ["start start", "end end"],
  });

  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  });
  
  // ✅ FIX: Inverted the animation mapping to fix the scroll direction.
  // It now maps the reversed scroll value [1, 0] to the correct visual [0%, 100%].
  const progressHeight = useTransform(smoothProgress, [1, 0], ["0%", "100%"]);


  useEffect(() => {
    const unsubscribe = scrollYProgress.onChange((v) => {
      // The active index calculation also needs to be inverted.
      const newIndex = Math.floor((1 - v) * eventPairs.length);
      if (
        newIndex !== activeIndex &&
        newIndex >= 0 &&
        newIndex < eventPairs.length
      ) {
        setActiveIndex(newIndex);
      }
    });
    return () => unsubscribe();
  }, [scrollYProgress, eventPairs.length, activeIndex]);

  const getTextVariants = (index: number) => {
    const baseDelay =
      animationOrder === "simultaneous"
        ? 0
        : animationOrder === "staggered"
        ? index * 0.15
        : index * 0.3;

    const initialStates = {
      fade: { opacity: 0, y: 20 },
      slide: { x: index % 2 === 0 ? -50 : 50, opacity: 0 },
      scale: { scale: 0.8, opacity: 0 },
      none: { opacity: 1 },
    };

    return {
      initial: initialStates[revealAnimation],
      whileInView: {
        opacity: 1,
        y: 0,
        x: 0,
        scale: 1,
        transition: {
          duration: 0.6,
          delay: baseDelay,
          ease: [0.25, 0.1, 0.25, 1.0] as [number, number, number, number],
        },
      },
      viewport: { once: false, margin: "-150px" },
    };
  };

  const getConnectorClasses = () => {
    const baseClasses = cn("absolute left-1/2 transform -translate-x-1/2",lineColor);
    const widthStyle = `w-[${progressLineWidth}px]`;
    switch (connectorStyle) {
      case "dots": return cn(baseClasses, "w-1 rounded-full");
      case "dashed": return cn(baseClasses,widthStyle,`[mask-image:linear-gradient(to_bottom,black_33%,transparent_33%,transparent_66%,black_66%)] [mask-size:1px_12px]`);
      case "line": default: return cn(baseClasses, widthStyle);
    }
  };

  return (
    <div
      ref={scrollRef}
      className={cn(
        "relative w-full overflow-hidden",
        darkMode ? "bg-background text-foreground" : "",
        className
      )}
    >
      <div className="relative max-w-6xl mx-auto px-4 pt-8 pb-24">
        <div className={cn(getConnectorClasses(), "h-full absolute top-0 z-10")}></div>

        {progressIndicator && (
          <>
            <motion.div className="absolute top-0 z-10" style={{ height: progressHeight, width: progressLineWidth, left: "50%", transform: "translateX(-50%)", borderRadius: progressLineCap === "round" ? "9999px" : "0px", background: `linear-gradient(to bottom, #22d3ee, #6366f1, #a855f7)`, boxShadow: `0 0 15px rgba(99,102,241,0.5), 0 0 25px rgba(168,85,247,0.3)`}} />
            <motion.div className="absolute z-20" style={{ top: progressHeight, left: "50%", translateX: "-50%", translateY: "-50%" }}>
              <motion.div className="w-5 h-5 rounded-full" style={{ background: "radial-gradient(circle, rgba(168,85,247,0.8) 0%, rgba(99,102,241,0.5) 40%, rgba(34,211,238,0) 70%)", boxShadow: `0 0 15px 4px rgba(168, 85, 247, 0.6), 0 0 25px 8px rgba(99, 102, 241, 0.4), 0 0 40px 15px rgba(34, 211, 238, 0.2)` }} animate={{ scale: [1, 1.3, 1] }} transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }} />
            </motion.div>
          </>
        )}

        <div className="relative z-20 space-y-12">
          {eventPairs.map((pair, pairIndex) => {
            const leftEvent = pair[0];
            const rightEvent = pair[1];

            return (
              <div key={`timeline-row-${pairIndex}`} className="relative">
                <div className="absolute top-4 left-1/2 -translate-x-1/2 z-30">
                  <motion.div className={cn("w-6 h-6 rounded-full border-4 bg-background flex items-center justify-center", pairIndex <= activeIndex ? "border-primary" : "border bg-card")} animate={pairIndex <= activeIndex ? { scale: [1, 1.3, 1], boxShadow: ["0 0 0px rgba(99,102,241,0)", "0 0 12px rgba(99,102,241,0.6)", "0 0 0px rgba(99,102,241,0)"] } : {}} transition={{ duration: 0.8, repeat: Infinity, repeatDelay: 4, ease: "easeInOut" }} />
                </div>
                
                <div className="flex flex-col lg:flex-row justify-between items-start w-full gap-8 lg:gap-0">
                  {leftEvent && (
                    <motion.div
                      // ✅ FIX: Centered the text content
                      className="w-full lg:w-[calc(50%-80px)] text-center"
                      variants={getTextVariants(pairIndex * 2)}
                      initial="initial"
                      whileInView="whileInView"
                    >
                      <h3 className="text-2xl font-semibold">{leftEvent.title}</h3>
                      <p className="text-gray-400 mt-1">{leftEvent.description}</p>
                    </motion.div>
                  )}

                  {rightEvent ? (
                    <motion.div
                      // ✅ FIX: Centered the text content
                      className="w-full lg:w-[calc(50%-80px)] text-center"
                      variants={getTextVariants(pairIndex * 2 + 1)}
                      initial="initial"
                      whileInView="whileInView"
                    >
                      <h3 className="text-2xl font-semibold">{rightEvent.title}</h3>
                      <p className="text-gray-400 mt-1">{rightEvent.description}</p>
                    </motion.div>
                  ) : (
                    <div className="w-full lg:w-[calc(50%-80px)]" />
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
