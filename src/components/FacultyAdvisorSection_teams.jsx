import React, { useRef, useLayoutEffect } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import AnimatedTitle from "./AnimatedTitle";
import Card from "./Teamcaard/TeamCard";

gsap.registerPlugin(ScrollTrigger);

const FacultyAdvisorSection = ({ members }) => {
    const sectionRef = useRef(null);
    const headingRef = useRef(null);
    const descriptionRef = useRef(null);
    const cardsRef = useRef([]); // For card animations

    useLayoutEffect(() => {
        const ctx = gsap.context(() => {
            // Animate heading and description
            gsap.fromTo(
                [headingRef.current, descriptionRef.current],
                { opacity: 0, y: 40 },
                {
                    opacity: 1,
                    y: 0,
                    duration: 1,
                    ease: "power2.out",
                    scrollTrigger: {
                        trigger: sectionRef.current,
                        start: "top 80%",
                    },
                }
            );

            // Animate cards
            cardsRef.current.forEach((card, i) => {
                gsap.fromTo(
                    card,
                    { opacity: 0, y: 60 },
                    {
                        opacity: 1,
                        y: 0,
                        duration: 0.8,
                        ease: "power2.out",
                        delay: i * 0.1,
                        scrollTrigger: {
                            trigger: card,
                            start: "top 90%",
                            toggleActions: "play none none reverse",
                        },
                    }
                );
            });
        }, sectionRef);

        return () => ctx.revert();
    }, []);

    return (
        <div ref={sectionRef} className="w-full bg-black text-white py-24 px-6">
            {/* Heading */}
            <div className="text-center mb-12">
                <div ref={headingRef}>
                    <AnimatedTitle
                        title="Faculty Advisor & Sponsor"
                        containerClass="!text-blue-100 text-center text-3xl md:text-4xl lg:text-8xl"
                    />
                </div>
                <div ref={descriptionRef}>
                    <p className="text-gray-300 text-base md:text-lg max-w-2xl mx-auto mt-4">
                        Meet the distinguished academics and partners who provide invaluable guidance and essential resources to our chapter.
                    </p>
                </div>
            </div>

            {/* Grid Layout for Cards */}
            <div className="flex justify-center">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-40 gap-y-32 px-4">
                    {members.map((member, idx) => (
                        <div
                            key={idx}
                            className="w-fit" //cards fit within the grid
                            ref={(el) => (cardsRef.current[idx] = el)}
                        >
                            <Card
                                name={member.name}
                                pic={member.image}
                                role={member.role}
                                linkedin={member.socials.linkedin}
                            />
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default FacultyAdvisorSection;
