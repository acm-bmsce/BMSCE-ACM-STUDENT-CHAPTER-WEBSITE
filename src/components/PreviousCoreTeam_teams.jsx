import React, { useRef, useLayoutEffect } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import AnimatedTitle from "./AnimatedTitle";
import Card from "./PreviousCoreTeam_Card.jsx";

gsap.registerPlugin(ScrollTrigger);

const previousTeamMembers2025 = [
  { label: "1. Fazal M A", role: "Chair" },
  { label: "2. Naysha", role: "Vice Chair" },
  { label: "3. Devanand", role: "Secretary" },
  { label: "4. Praneeth", role: "Treasurer" },
  { label: "5. Aprameya", role: "Webmaster and Technical Head" },
  { label: "6. Aravind", role: "Membership Chair" },
  { label: "7. Subodh", role: "Senior Coordinator" },
  { label: "8. Anish", role: "Senior Coordinator" },
  { label: "9. Sanskar", role: "Media Head" }
];

const previousTeamMembers2024 = [
  { label: "1. G Sri Sai Meghana", role: "Chair" },
  { label: "2. Srujana A Rao", role: "Vice Chair" },
  { label: "3. Harshavardhan S", role: "Secretary" },
  { label: "4. Bhuvan Kumar SG", role: "Treasurer" },
  { label: "5. Manvendra Singh", role: "Membership Chair" },
  { label: "6. Sudeep S", role: "Web Master" }
];

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
                    ease: "power2.out",
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
                        2025
                    </p>
                </div>
            </div>

            {/* Flip Cards */}
            <div className="flex flex-col items-center gap-16" ref={cardRef}>
                <div className="flex flex-col items-center gap-8 w-full max-w-4xl">
                    <Card title="Team Members" members={previousTeamMembers2025} />
                </div>

                <div className="flex flex-col items-center gap-8 w-full max-w-4xl">
                    <p className="text-gray-300 text-lg md:text-xl lg:text-5xl font-semibold">
                        2024
                    </p>
                    <Card title="2024" members={previousTeamMembers2024} />
                </div>
            </div>
        </div>
    );
};

export default PreviousCoreTeamSection;
