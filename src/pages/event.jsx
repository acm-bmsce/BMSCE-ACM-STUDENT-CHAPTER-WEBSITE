import React, { useState, useRef, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useLocation } from "react-router-dom"; 
// ❌ REMOVED: import { useQuery, keepPreviousData } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";

import HeroAndCarousel from "../components/HeroAndCarousel";
import Spotlight from "../components/Spotlight";
import Loader from "../components/Loader";
import eventService from "../api/eventService";

// ✅ ADDED: Helpers
import SEO from "../components/SEO";
import { getOptimizedImageUrl } from "../utils/imageHelper";

export default function EventPage() {
    const [isGridView, setIsGridView] = useState(false);
    const [isReturning, setIsReturning] = useState(false);
    const scrollPositionRef = useRef(0);
    const location = useLocation();

    // Data States
    const [featuredEvents, setFeaturedEvents] = useState([]);
    const [allEvents, setAllEvents] = useState([]);
    const [loading, setLoading] = useState(true);

    // --- FETCH DATA (useEffect) ---
    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                
                // 1. Fetch Featured for Carousel
                // We optimize these for HIGHER quality (width 1200px) because they are big Hero banners
                const featuredRes = await eventService.getEvents(10, 0, true);
                const featuredOptimized = featuredRes.data.map(evt => ({
                    ...evt,
                    image: getOptimizedImageUrl(evt.image, 1200) 
                }));
                setFeaturedEvents(featuredOptimized);

                // 2. Fetch All for Grid
                // We optimize these for LOWER quality (width 500px) because they are small thumbnails
                const allRes = await eventService.getEvents(500, 0, null);
                const allOptimized = allRes.data.map(evt => ({
                    ...evt,
                    image: getOptimizedImageUrl(evt.image, 500)
                }));
                setAllEvents(allOptimized);

            } catch (error) {
                console.error("Failed to load events", error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    // --- LOGIC ---
    useEffect(() => {
        setIsGridView(false);
        setIsReturning(false);
        window.scrollTo(0, 0); 
    }, [location]);

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

    if (loading && !isGridView) return <Loader />;

    return (
        <div className="min-h-screen bg-black text-gray-900 antialiased overflow-x-hidden">
            {/* ✅ ADDED: SEO */}
            <SEO 
                title="Events" 
                description="Explore upcoming workshops, hackathons, and seminars at ACM BMSCE." 
            />

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
                                upcomingEvents={featuredEvents} // ✅ Pass Featured Only
                                pastEvents={[]} 
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
                            <div className="flex flex-col items-center">
                                <Spotlight 
                                    setIsGridView={handleCloseGrid} 
                                    events={allEvents} // ✅ Pass All Events
                                />
                                {/* Note: Pagination buttons removed for simplicity as per your request, 
                                    but you can add them back using 'page' state logic if needed. */}
                            </div>
                        </motion.section>
                    )}
                </AnimatePresence>
            </main>
        </div>
    );
}