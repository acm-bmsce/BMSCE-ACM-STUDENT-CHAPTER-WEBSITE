import { useEffect, useRef, useState } from "react";
import { motion, useScroll, useTransform, useMotionValueEvent } from "framer-motion";
import { EventCard } from "./Card_event";

export const HorizontalScroll = ({ events, onEventClick, title }) => {
  const scrollRef = useRef(null);
  const containerRef = useRef(null);
  const [scrollDistance, setScrollDistance] = useState(0);
  const [cardStyles, setCardStyles] = useState([]);

  const { scrollYProgress } = useScroll({
    target: scrollRef,
    offset: ["start start", "end end"],
  });

  const x = useTransform(scrollYProgress, [0, 1], [0, -scrollDistance]);

  useEffect(() => {
    if (containerRef.current) {
      const totalScrollWidth = containerRef.current.scrollWidth + 1000;
      const viewportWidth = window.innerWidth;
      setScrollDistance(totalScrollWidth - viewportWidth);
    }
  }, [events]);


  useMotionValueEvent(x, "change", () => {
    if (!containerRef.current) return;

    const cards = containerRef.current.querySelectorAll(".card-wrapper");
    const centerX = window.innerWidth / 2;

    if (!cards || cards.length === 0) return;

    const styles = [];

    cards.forEach((card) => {

      if (!card || typeof card.getBoundingClientRect !== "function") return;

      const rect = card.getBoundingClientRect();
      const cardCenter = rect.left + rect.width / 2;
      const dist = Math.abs(centerX - cardCenter);
      const normDist = Math.min(dist / centerX, 1);

      const scale = 1.2 - normDist * 0.25;
      const parallaxX = (1 - normDist) * 30 * (cardCenter < centerX ? -1 : 1);

      styles.push({
        transform: `scale(${scale}) translateX(${parallaxX}px)`,
        transition: "transform 0.2s ease-out",
        opacity: 1 - normDist * 0.95,
      });
    });

    setCardStyles(styles);
  });

  return (
    <section ref={scrollRef} className="relative h-[400vh] w-full bg-black text-white">
      <div className="sticky lg:pl-[500px] top-0 w-full h-screen bg-black flex flex-col overflow-hidden">
        <motion.div
          ref={containerRef}
          style={{ x }}
          className="flex gap-6 w-max px-12 py-8"
        >
          {events.map((event, index) => (
            <div
              key={event.id}
              className="card-wrapper w-[450px] flex-shrink-0"
              style={cardStyles[index] || {}}
            >
              <EventCard event={event} onClick={() => onEventClick(event)} />
            </div>
          ))}
        </motion.div>

        {/* Scroll progress line */}
        {/* <div className="w-full px-4 mt-4 fixed left-0">
          <motion.div
            style={{ scaleX: scrollYProgress }}
            className="h-1 bg-blue-100 origin-left"
          />
        </div> */}
      </div>
    </section>
  );
};
