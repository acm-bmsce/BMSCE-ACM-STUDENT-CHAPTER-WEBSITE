import React, { useState, useRef, useEffect, useMemo } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useLocation } from "react-router-dom";
import { Loader2 } from "lucide-react";

import HeroAndCarousel from "../components/HeroAndCarousel";
import Spotlight from "../components/Spotlight";
import Loader from "../components/Loader";
import eventService from "../api/eventService";

// Helpers
import SEO from "../components/SEO";
import { getOptimizedImageUrl } from "../utils/imageHelper";

export default function EventPage() {
    const [isGridView, setIsGridView] = useState(false);
    const [isReturning, setIsReturning] = useState(false);
    const scrollPositionRef = useRef(0);
    const location = useLocation();

    // Data States
    const [rawFeatured, setRawFeatured] = useState([]);
    const [allEvents, setAllEvents] = useState([]);
    const [loading, setLoading] = useState(true);

    // --- FETCH DATA ---
    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);

                // 1. Fetch Featured
                const featuredRes = await eventService.getEvents(20, 0, true);
                setRawFeatured(featuredRes.data);

                // 2. Fetch All
                const allRes = await eventService.getEvents(100, 0, null);
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

    const FEATURED_EVENT_ORDER = [
        "ACM India Chapter Summit 2024",
        "ACM ROCS 2025",
        "Town Hall for ACM Students",
        "AGM 2025",
        "15 Days of Code",
        "Mastering DSA",
        "CS Pathshala",
        "ESP: CryptoVerse"
    ];

    // --- FILTERING LOGIC ---
    const { upcomingFeatured, featuredPastEvents, allPastEvents } = useMemo(() => {
        const now = new Date();

        // 1. Upcoming Featured
        const upcoming = rawFeatured
            .filter(evt => new Date(evt.date) >= now)
            .sort((a, b) => new Date(a.date) - new Date(b.date))
            .map(evt => ({
                ...evt,
                image: getOptimizedImageUrl(evt.image, 1200)
            }));

        // 2. All Past Events
        const allPast = allEvents
            .filter(evt => new Date(evt.date) < now)
            .sort((a, b) => new Date(b.date) - new Date(a.date));

        // 3. Featured Past Events
        const featuredPast = FEATURED_EVENT_ORDER
            .map(title =>
                allPast.find(
                    evt => evt.is_featured === true && evt.title === title
                )
            )
            .filter(Boolean);

        return {
            upcomingFeatured: upcoming,
            allPastEvents: allPast,
            featuredPastEvents: featuredPast
        };
    }, [rawFeatured, allEvents]);

    // --- VIEW LOGIC ---
    useEffect(() => {
        setIsGridView(false);
        setIsReturning(false);
        window.scrollTo(0, 0);
    }, [location]);

    // ⚡ FIX 1: Scroll to top when opening Grid
    const handleOpenGrid = () => {
        scrollPositionRef.current = window.scrollY;
        setIsGridView(true);
        // Instant scroll ensures we don't land in the middle of the grid
        window.scrollTo({ top: 0, left: 0, behavior: "instant" });
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
        // ⚡ FIX 2: Text color light (visible on black), full width constraints
        <div className="min-h-screen w-full bg-black text-gray-100 antialiased overflow-x-hidden">
            <SEO
                title="Events"
                description="Explore upcoming workshops, hackathons, and seminars at ACM BMSCE."
            />

            <main className="w-full relative">
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
                            // ⚡ FIX 3: Responsive gap (smaller on mobile) & bottom padding
                            className="flex flex-col gap-10 md:gap-16 lg:gap-20 pb-12"
                        >
                            <HeroAndCarousel
                                setIsGridView={handleOpenGrid}
                                upcomingEvents={upcomingFeatured}
                                pastEvents={featuredPastEvents}
                            />
                        </motion.section>
                    ) : (
                        <motion.section
                            key="grid"
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -50 }}
                            transition={{ duration: 0.8, ease: "easeInOut" }}
                            // ⚡ FIX 4: Responsive gap matching Hero section
                            className="flex flex-col gap-10 md:gap-16 lg:gap-20 pb-12"
                        >
                            {/* ⚡ FIX 5: Horizontal padding for mobile grid */}
                            <div className="flex flex-col items-center w-full px-4 md:px-0">
                                <Spotlight
                                    setIsGridView={handleCloseGrid}
                                    events={allPastEvents}
                                />
                            </div>
                        </motion.section>
                    )}
                </AnimatePresence>
            </main>
        </div>
    );
}