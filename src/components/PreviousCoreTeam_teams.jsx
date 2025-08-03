import React, { useRef, useLayoutEffect } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import AnimatedTitle from "./AnimatedTitle";
import "./PreviousCoreTeam.css"; // Import the CSS for flip animation

gsap.registerPlugin(ScrollTrigger);

const PreviousCoreTeamSection = () => {
    const sectionRef = useRef(null);
    const headingRef = useRef(null);
    const descriptionRef = useRef(null);
    const cardRef = useRef(null);

    useLayoutEffect(() => {
        const ctx = gsap.context(() => {
            gsap.fromTo(
                [headingRef.current, descriptionRef.current],
                { opacity: 0, y: 40 },
                {
                    opacity: 1,
                    y: 0,
                    duration: 1,
                    ease: "power4.out",
                    scrollTrigger: {
                        trigger: sectionRef.current,
                        start: "top 80%",
                    },
                }
            );

            gsap.fromTo(
                cardRef.current,
                { opacity: 0, y: 60 },
                {
                    opacity: 1,
                    y: 0,
                    duration: 1,
                    ease: "power2.out",
                    scrollTrigger: {
                        trigger: cardRef.current,
                        start: "top 90%",
                    },
                }
            );
        }, sectionRef);

        return () => ctx.revert();
    }, []);

    return (
        <div ref={sectionRef} className="w-full bg-black text-white py-24 px-6">
            {/* Heading */}
            <div className="text-center mb-12">
                <div ref={headingRef}>
                    <AnimatedTitle
                        title="Previous Core Team"
                        containerClass="!text-blue-100 text-center text-3xl md:text-4xl lg:text-8xl"
                    />
                </div>
                <div ref={descriptionRef}>
                    <p className="text-gray-300 text-lg md:text-xl lg:text-5xl max-w-2xl mx-auto font-semibold">
                        2024
                    </p>
                </div>
            </div>

            {/* Flip Card */}
            <div className="flex justify-center" ref={cardRef}>
                <div className="flip-card">
                    <div className="flip-card-inner">
                        <div className="flip-card-front">
                            <img
                                src="./img/previous_core.jpeg"
                                alt="Previous Core Team"
                                className="w-full h-full object-cover rounded-xl"
                            />
                        </div>
                        <div className="flip-card-back flex flex-col items-center justify-center px-12 py-10 gap-8 bg-gradient-to-br from-blue-900/60 via-indigo-800/60 to-sky-700/60 backdrop-blur-md rounded-2xl shadow-[0_0_30px_rgba(0,0,0,0.5)] border border-white/20">
                            <h2 className="text-5xl font-extrabold text-white tracking-wide drop-shadow-xl underline underline-offset-8 decoration-sky-400">
                                Team Members
                            </h2>

                            <ul className="text-white font-bold leading-relaxed space-y-4 text-[clamp(0.8rem,2.5vw,1.5rem)]">
                                <li>1. G Sri Sai Meghana – Chair</li>
                                <li>2. Srujana A Rao – Vice Chair</li>
                                <li>3. Harshavardhan S – Secretary</li>
                                <li>4. Bhuvan Kumar SG – Treasurer</li>
                                <li>5. Manvendra Singh – Membership Chair</li>
                                <li>6. Sudeep S – Web Master</li>
                            </ul>

                        </div>


                    </div>
                </div>
            </div>
        </div>
    );
};

export default PreviousCoreTeamSection;
