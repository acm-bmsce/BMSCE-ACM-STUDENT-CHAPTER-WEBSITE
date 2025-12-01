import React, { useState, useEffect, useRef } from "react";
import { motion, useScroll, useTransform, useSpring } from "framer-motion";
import { cn } from "../lib/utils";

// --- TYPE DEFINITIONS ---
export interface TimelineEvent {
  id?: string;
  year: string;
  title: string;
  description?: string | React.ReactNode;
}

export interface ScrollTimelineProps {
  events: TimelineEvent[];
  lineColor?: string;
  darkMode?: boolean;
}

// --- MAIN TIMELINE COMPONENT ---
export const ScrollTimeline = ({
  events,
  lineColor = "bg-gray-700",
  darkMode = false,
}: ScrollTimelineProps) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(-1);

  // Group events into pairs
  const eventPairs: TimelineEvent[][] = [];
  for (let i = 0; i < events.length; i += 2) {
    eventPairs.push(events.slice(i, i + 2));
  }
  const numPairs = eventPairs.length;

  const { scrollYProgress } = useScroll({
    target: scrollRef,
    offset: ["start end", "start start"],
  });

  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  });

  const progressHeight = useTransform(smoothProgress, [0, 1], ["0%", "88%"]);

  useEffect(() => {
    return scrollYProgress.onChange((v) => {
      const newIndex = Math.floor(v * numPairs);
      if (newIndex >= 0 && newIndex < numPairs) {
        setActiveIndex(newIndex);
      } else if (v >= 1) {
        setActiveIndex(numPairs - 1);
      }
    });
  }, [scrollYProgress, numPairs]);

  return (
    <div
      ref={scrollRef}
      className={cn(
        "relative w-full",
        darkMode && "bg-background text-foreground"
      )}
    >
      <div className="relative max-w-6xl mx-auto px-4 pt-8 pb-24">
        {/* Vertical Background Line */}
        <div
          className={cn(
            "absolute left-1/2 transform -translate-x-1/2 h-[620px] w-[2px]",
            lineColor
          )}
        />

        {/* Scroll Progress Line with Glow */}
        <motion.div
          className="absolute top-0 z-10"
          style={{
            height: progressHeight,
            width: 2,
            left: "50%",
            transform: "translateX(-50%)",
            background: `linear-gradient(to bottom, #22d3ee, #6366f1, #a855f7)`,
            boxShadow: `0 0 15px rgba(99,102,241,0.5), 0 0 25px rgba(168,85,247,0.3)`,
          }}
        />

        {/* Comet Ball */}
        <motion.div
          className="absolute z-20"
          style={{
            top: progressHeight,
            left: "50%",
            translateX: "-50%",
            translateY: "-50%",
          }}
        >
          <motion.div
            className="w-5 h-5 rounded-full"
            style={{
              background:
                "radial-gradient(circle, rgba(168,85,247,0.8) 0%, rgba(99,102,241,0.5) 40%, rgba(34,211,238,0) 70%)",
              boxShadow: `0 0 15px 4px rgba(168, 85, 247, 0.6), 0 0 25px 8px rgba(99, 102, 241, 0.4), 0 0 40px 15px rgba(34, 211, 238, 0.2)`,
            }}
            animate={{ scale: [1, 1.3, 1] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          />
        </motion.div>

        {/* Timeline Cards */}
        <div className="relative z-20 space-y-12">
          {eventPairs.map((pair, pairIndex) => {
            const start = pairIndex * 0.2;
            const end = start + 0.2;
            const opacity = useTransform(smoothProgress, [start, end], [0, 1]);
            const y = useTransform(smoothProgress, [start, end], [20, 0]);

            return (
              <div key={pairIndex} className="relative">
                {/* Timeline Dot */}
                <div className="absolute top-4 left-1/2 -translate-x-1/2 z-30">
                  <motion.div
                    className={cn(
                      "w-6 h-6 rounded-full border-4 bg-background flex items-center justify-center transition-colors duration-300",
                      pairIndex <= activeIndex
                        ? "border-primary"
                        : "border-gray-600"
                    )}
                    animate={{ scale: pairIndex === activeIndex ? 1.2 : 1 }}
                    transition={{ duration: 0.3 }}
                  />
                </div>

                {/* Event Cards */}
                <motion.div
                  className="flex flex-col lg:flex-row justify-between items-start w-full gap-8 lg:gap-0"
                  style={{ opacity, y }}
                >
                  {/* Left Card */}
                  {pair[0] && (
                    <div className="w-full lg:w-[calc(50%-80px)] text-center">
                      <h3 className="text-2xl font-semibold">{pair[0].title}</h3>
                      <p className="text-gray-400 mt-1">{pair[0].description}</p>
                    </div>
                  )}

                  {/* Right Card */}
                  {pair[1] ? (
                    <div className="w-full lg:w-[calc(50%-80px)] text-center">
                      <h3 className="text-2xl font-semibold">{pair[1].title}</h3>
                      <p className="text-gray-400 mt-1">{pair[1].description}</p>
                    </div>
                  ) : (
                    <div className="w-full lg:w-[calc(50%-80px)]" />
                  )}
                </motion.div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
