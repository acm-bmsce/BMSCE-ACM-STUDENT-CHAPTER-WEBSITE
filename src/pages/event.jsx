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

                // 1. Fetch Featured (Get all featured, regardless of date)
                const featuredRes = await eventService.getEvents(20, 0, true);
                setRawFeatured(featuredRes.data);

                // 2. Fetch All (For History/Past)
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
        "DSA Course",
        "15 Days of Code",
        "CS Pathshala",
        "ESP: CryptoVerse"
    ];


    // --- FILTERING LOGIC ---
    const { upcomingFeatured, featuredPastEvents, allPastEvents } = useMemo(() => {
        const now = new Date();

        // 1. Upcoming Featured → soonest first
        const upcoming = rawFeatured
            .filter(evt => new Date(evt.date) >= now)
            .sort((a, b) => new Date(a.date) - new Date(b.date))
            .map(evt => ({
                ...evt,
                image: getOptimizedImageUrl(evt.image, 1200)
            }));

        // 2. All Past Events → newest first
        const allPast = allEvents
            .filter(evt => new Date(evt.date) < now)
            .sort((a, b) => new Date(b.date) - new Date(a.date));

        // 3. Featured Past Events → newest first
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
                                upcomingEvents={upcomingFeatured}
                                // ✅ Only show Featured Past events in the initial list
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
                            className="flex flex-col gap-20"
                        >
                            <div className="flex flex-col items-center">
                                <Spotlight
                                    setIsGridView={handleCloseGrid}
                                    // ✅ Show ALL Past events when "View More" is clicked
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