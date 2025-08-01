import { useEffect, useRef, useState } from 'react';
import { motion, useTransform, useScroll, useSpring } from "framer-motion";
import { EventCard } from './Card_event';

export const HorizontalScroll = ({ events, onEventClick, title, isModalOpen }) => {
    // const scrollRef = useRef(null);
    // const { scrollYProgress } = useScroll({
    //   target: scrollRef,
    //   offset: ["start start", "end end"],
    // });

    const scrollRef = useRef(null);
    const containerRef = useRef(null);
    const [scrollDistance, setScrollDistance] = useState(0);

    const { scrollYProgress } = useScroll({
        target: scrollRef,
        offset: ["start start", "end end"],
    });


    useEffect(() => {
        if (containerRef.current) {
            const totalScrollWidth = containerRef.current.scrollWidth;
            const viewportWidth = window.innerWidth;
            setScrollDistance(totalScrollWidth - viewportWidth);
        }
    }, [events]);

    // useEffect(() => {
    //   if (isModalOpen) return;

    //   const container = containerRef.current;
    //   if (!container) return;

    //   const handleWheel = (e) => {
    //     const containerRect = container.getBoundingClientRect();
    //     const isMouseOverContainer =
    //       e.clientX >= containerRect.left &&
    //       e.clientX <= containerRect.right &&
    //       e.clientY >= containerRect.top &&
    //       e.clientY <= containerRect.bottom;

    //     if (isMouseOverContainer) {
    //       e.preventDefault();
    //       e.stopPropagation();
    //       container.scrollLeft += e.deltaY;
    //     }
    //   };

    //   document.addEventListener('wheel', handleWheel, { passive: false });

    //   return () => {
    //     document.removeEventListener('wheel', handleWheel);
    //   };
    // }, [isModalOpen]);

    const x = useTransform(scrollYProgress, [0, 1], [0, -scrollDistance]);

    if (events.length === 0) {
        return (
            <div className="max-w-full min-w-full mx-auto px-6">
                <h2 className="text-2xl font-bold text-foreground mb-6 animate-slide-up">
                    {title}
                </h2>
                <div className="flex items-center justify-center py-16">
                    <div className="text-center">
                        <p className="text-lg text-muted-foreground mb-2">No events found</p>
                        <p className="text-sm text-muted-foreground">
                            Check back later for upcoming events!
                        </p>
                    </div>
                </div>
            </div>
        );
    }

    return (

        <section
            ref={scrollRef}
            className="relative h-[400vh] w-full bg-black text-white py-0"
        >
            <div className="sticky top-0 w-full h-screen bg-black flex flex-col justify-start overflow-hidden py-0">
                <motion.div
                    ref={containerRef}
                    style={{ x }}
                    className="flex gap-6 px-0 w-max space-x-1 py-0"
                >
                    {events.map((event) => (
                        <div
                            key={event.id}
                            className="w-[450px] flex-shrink-0"
                        >
                            <EventCard event={event} onClick={() => onEventClick(event)} />
                        </div>
                    ))}
                </motion.div>
                <div className="w-full px-4 mt-4">
                    <motion.div
                        style={{ scaleX: scrollYProgress }}
                        className="h-1 bg-blue-100 origin-left"
                    />
                </div>
            </div>

        </section>
    );
};

