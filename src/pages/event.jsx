import React, { useState, useRef, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
// 1. Import useLocation
import { useLocation } from "react-router-dom"; 

import HeroAndCarousel from "../components/HeroAndCarousel";
import Spotlight from "../components/Spotlight";
import Loader from "../components/Loader";
import eventService from "../api/eventService";

export default function EventPage() {
    const [isGridView, setIsGridView] = useState(false);
    const [isReturning, setIsReturning] = useState(false);
    const scrollPositionRef = useRef(0);
    
    // 2. Get current location
    const location = useLocation(); 

    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);

    // --- NEW FIX: Reset View on Navigation ---
    useEffect(() => {
        // Whenever the user navigates to this page (or clicks the link again),
        // we force the view back to the main Hero/Carousel.
        setIsGridView(false);
        setIsReturning(false);
        window.scrollTo(0, 0); // Optional: Scroll to top
    }, [location]); // Dependency on 'location' ensures this runs on every nav click

    useEffect(() => {
        const fetchEvents = async () => {
            try {
                const response = await eventService.getEvents();
                setEvents(response.data);
            } catch (error) {
                console.error("Failed to fetch events:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchEvents();
    }, []);

    const upcomingEvents = events.filter(
        (event) => new Date(event.date) > new Date()
    );

    const pastEvents = events.filter(
        (event) => new Date(event.date) <= new Date()
    );

    const handleOpenGrid = () => {
        scrollPositionRef.current = window.scrollY;
        setIsGridView(true);
    };

    const handleCloseGrid = () => {
        setIsReturning(true);
        setTimeout(() => {
            setIsGridView(false);
            setIsReturning(false);
            setTimeout(() => {
                window.scrollTo({
                    top: scrollPositionRef.current,
                    behavior: "instant",
                });
            }, 800);
        }, 600);
    };

    if (loading) return <Loader />;

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
                                delay: isReturning ? 0.6 : 0,
                            }}
                            className="flex flex-col gap-20"
                        >
                            <HeroAndCarousel
                                setIsGridView={handleOpenGrid}
                                upcomingEvents={upcomingEvents}
                                pastEvents={pastEvents}
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
                            <Spotlight 
                                setIsGridView={handleCloseGrid} 
                                events={events} 
                            />
                        </motion.section>
                    )}
                </AnimatePresence>
            </main>
        </div>
    );
}