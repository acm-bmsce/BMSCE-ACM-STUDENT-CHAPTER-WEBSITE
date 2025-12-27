import React, { useEffect, useRef } from "react";
import ImageCarousel from "./ImageCarousel";
import AnimatedTitle from "./AnimatedTitle";
import Button from "./Button";
import Hero_events from "./Hero_events";
import UpcomingEventsCarousel from "./UpcomingEventsCarousel";
import FunZone from "./FunZone";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function HeroAndCarousel({ setIsGridView, upcomingEvents, pastEvents }) {

    const pastRef = useRef(null);
    const upcomingRef = useRef(null);
    const funzoneRef = useRef(null);

    useEffect(() => {
        const animateSection = (targetRef) => {
            if (!targetRef) return;

            gsap.fromTo(
                targetRef,
                { opacity: 0, y: 100 },
                {
                    opacity: 1,
                    y: 0,
                    duration: 2.0,
                    ease: "power3.out",
                    scrollTrigger: {
                        trigger: targetRef,
                        start: "top 85%",
                        end: "top 40%",
                        toggleActions: "play none none reverse",
                    },
                }
            );
        };

        animateSection(pastRef.current);
        animateSection(upcomingRef.current);
        animateSection(funzoneRef.current);
    }, []);

    return (
        /* Wrapper changed from Fragment <> to a Flex div.
           Adjust 'gap-24 md:gap-32' here to change spacing for ALL sections at once.
        */
        <div className="flex flex-col w-full gap-24 md:gap-32">
            
            {/* HERO SECTION */}
            <Hero_events />

            {/* ---------- PAST EVENTS ---------- */}
            <section ref={pastRef}>
                <AnimatedTitle
                    title="Past Events"
                    containerClass="!text-blue-100 text-center text-3xl md:text-4xl lg:text-8xl"
                />

                <div className="flex flex-col items-center gap-6 w-full">
                    <div className="w-full max-w-4xl">
                        <ImageCarousel events={pastEvents} />
                    </div>

                    <div className="md:hidden text-white text-2xl font-semibold tracking-wide mt-4 select-none"> 
                        <p className="animate-bounce">Swipe →</p> 
                    </div>

                    {/* VIEW MORE → visible on all screens */}
                    <Button
                        id="realm-btn"
                        title="VIEW MORE"
                        onClick={() => setIsGridView(true)}
                    />
                </div>
            </section>


            {/* ---------- UPCOMING EVENTS ---------- */}
            <section ref={upcomingRef}>
                <AnimatedTitle
                    title="Upcoming Events"
                    containerClass="text-center text-3xl md:text-4xl lg:text-8xl"
                />
                <UpcomingEventsCarousel upcomingEvents={upcomingEvents} />
            </section>

            {/* ---------- FUN ZONE ---------- */}
            <section ref={funzoneRef}>
                <AnimatedTitle
                    title="Fun Zone — Let’s Play 🎮"
                    containerClass="text-center text-3xl md:text-4xl lg:text-8xl"
                />

                <FunZone />
            </section>
        </div>
    );
}