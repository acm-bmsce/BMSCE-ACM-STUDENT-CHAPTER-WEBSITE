// App.js
import React, { useState, useRef } from "react";
import { AnimatePresence, motion } from "framer-motion";

import HeroAndCarousel from "../components/HeroAndCarousel";
import Spotlight from "../components/Spotlight";
import upcomingEvents from "../components/upcomingEventsData";

export default function App() {
    const [isGridView, setIsGridView] = useState(false);
    const [isReturning, setIsReturning] = useState(false); // track if returning
    const scrollPositionRef = useRef(0);

    // Save scroll position when going into spotlight
    const handleOpenGrid = () => {
        scrollPositionRef.current = window.scrollY;
        setIsGridView(true);
    };

    // Smooth delayed return to hero section
    const handleCloseGrid = () => {
        setIsReturning(true);

        // 1️⃣ Fade out spotlight view (600ms)
        setTimeout(() => {
            setIsGridView(false);
            setIsReturning(false);

            // 2️⃣ After fade-in completes, silently restore scroll (delay ≈ 800ms)
            setTimeout(() => {
                window.scrollTo({
                    top: scrollPositionRef.current,
                    behavior: "instant", // No visible movement
                });
            }, 800);
        }, 600); // Fade-out delay (600ms)
    };

    return (
        <div className="min-h-screen bg-black text-gray-900 antialiased overflow-x-hidden">
            <main>
                <AnimatePresence mode="wait" initial={false}>
                    {!isGridView ? (
                        <motion.section
                            key="hero"
                            initial={{ opacity: 0, y: 50 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -40 }}
                            transition={{
                                duration: 0.8,
                                ease: "easeInOut",
                                delay: isReturning ? 0.6 : 0, // wait for spotlight fade out
                            }}
                            className="flex flex-col gap-20"
                        >
                            <HeroAndCarousel
                                setIsGridView={handleOpenGrid}
                                upcomingEvents={upcomingEvents}
                            />
                        </motion.section>
                    ) : (
                        <motion.section
                            key="grid"
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -50 }}
                            transition={{ duration: 0.8, ease: "easeInOut" }}
                            className="flex flex-col gap-20"
                        >
                            <Spotlight setIsGridView={handleCloseGrid} />
                        </motion.section>
                    )}
                </AnimatePresence>
            </main>
        </div>
    );
}
