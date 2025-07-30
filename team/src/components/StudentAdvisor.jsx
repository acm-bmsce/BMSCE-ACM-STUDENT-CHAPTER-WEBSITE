import React, { useRef, useLayoutEffect } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import AnimatedTitle from "./AnimatedTitle";
import TeamMemberCard from "./Teamcaard/TeamCard";
import { useGSAP } from '@gsap/react';

gsap.registerPlugin(ScrollTrigger);

const Studentadvisor = ({ members, sectionKey, onMemberClick }) => {
    const sectionRef = useRef(null);
    const headingPinRef = useRef(null);
    const headingRef = useRef(null);
    const descriptionRef = useRef(null);
    const cardsSectionRef = useRef(null);
    const cardsWrapperRef = useRef(null);
    const cardRefs = useRef([]);

    useLayoutEffect(() => {
        const ctx = gsap.context(() => {
            // Heading Pin
            ScrollTrigger.create({
                trigger: headingPinRef.current,
                start: "top top",
                end: "+=100%",
                pin: true,
                pinSpacing: false,
                scrub: false,
                anticipatePin: 1,
            });

            gsap.to([headingRef.current, descriptionRef.current], {
                opacity: 0,
                y: -80,
                scale: 1.3,
                rotate: 10,
                filter: 'blur(16px)',
                duration: 0.7,
                ease: "power3.inOut",
                scrollTrigger: {
                    trigger: headingPinRef.current,
                    start: () => `bottom-=${window.innerHeight * 0.2} top`,
                    end: () => `bottom top`,
                    scrub: true,
                },
            });

            gsap.fromTo([headingRef.current, descriptionRef.current],
                { opacity: 0, y: 40 },
                {
                    opacity: 1, y: 0, duration: 0.8, ease: "power2.out",
                    scrollTrigger: {
                        trigger: headingPinRef.current,
                        start: "top 80%",
                    },
                }
            );

            // Cards horizontal scroll
            gsap.to(cardsWrapperRef.current, {
                x: () => `-${window.innerWidth * (members.length - 1)}`,
                ease: "none",
                scrollTrigger: {
                    trigger: cardsSectionRef.current,
                    start: "top top",
                    end: () => `+=${window.innerWidth * members.length}`,
                    scrub: true,
                    pin: true,
                    anticipatePin: 1,
                },
            });

            cardRefs.current.forEach((card, idx) => {
                gsap.set(card, { opacity: idx === 0 ? 1 : 0 });
                if (idx > 0) {
                    gsap.fromTo(card,
                        { opacity: 0 },
                        {
                            opacity: 1,
                            duration: 0.5,
                            ease: "power2.inOut",
                            scrollTrigger: {
                                trigger: cardsSectionRef.current,
                                start: "top top",
                                end: () => `+=${window.innerWidth * 0.5}`,
                                scrub: true,
                            },
                        }
                    );
                }
            });
        }, sectionRef);
        return () => ctx.revert();
    }, [members.length]);

    return (
        <div ref={sectionRef} className="w-full">
            {/* Heading */}
            <section ref={headingPinRef} className="relative h-screen flex flex-col items-center justify-center bg-black">
                <div ref={headingRef} className="w-full z-20 pointer-events-auto bg-black/90 flex flex-col items-center justify-center h-full">
                    <AnimatedTitle
                        title="Faculty Advisor & Sponsor"
                        containerClass="!text-blue-100 text-center mb-4"
                    />
                    <div ref={descriptionRef}>
                        <p className="text-gray-300 text-base md:text-lg max-w-2xl text-center mb-2">
                            Meet the distinguished academics and partners who provide invaluable guidance and essential resources to our chapter.
                        </p>
                    </div>
                </div>
            </section>
            {/* Cards */}
            <section ref={cardsSectionRef} className="relative w-full h-screen overflow-hidden bg-black flex flex-col justify-center items-center mb-32">
                <div
                    ref={cardsWrapperRef}
                    className="flex h-full w-[100vw] md:w-[100vw] items-center z-10"
                    style={{ willChange: 'transform' }}
                >
                    {members.map((member, idx) => (
                        <div
                            key={idx}
                            ref={el => cardRefs.current[idx] = el}
                            className={`flex-shrink-0 w-screen h-full flex items-center justify-center transition-opacity duration-500${idx === 0 ? '' : ' opacity-0'}`}
                            style={{ scrollSnapAlign: 'center' }}
                        >
                            <div className="w-full flex justify-center items-center">
                                <div className="w-[90vw] h-[60vw] max-w-[400px] max-h-[400px] md:w-[350px] md:h-[350px] lg:w-[400px] lg:h-[400px] flex items-center justify-center">
                                    <TeamMemberCard member={member} onClick={onMemberClick} />
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </section>
        </div>
    );
};

export default Studentadvisor;
