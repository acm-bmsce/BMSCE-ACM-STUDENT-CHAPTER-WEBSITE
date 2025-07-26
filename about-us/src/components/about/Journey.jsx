// src/components/Journey.jsx

import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/all";
import AnimatedTitle from "../AnimatedTitle";

gsap.registerPlugin(ScrollTrigger);

const timelineData = [
    { year: "2021", title: "Chapter Inauguration", description: "The official launch of the BMSCE ACM Student Chapter, setting the stage for a new era of computing culture on campus." },
    { year: "2022", title: "First Workshop Series", description: "Hosted our first series of workshops on emerging technologies like AI/ML and Web3, attracting over 200 participants." },
    { year: "2023", title: "Genesis Hackathon", description: "Successfully organized our flagship national-level hackathon, 'Genesis', with teams competing from across the country." },
    { year: "2024", title: "Research Publications", description: "Chapter members achieved a new milestone with three papers accepted at international conferences." },
    { year: "2025", title: "Emerging Chapter Award", description: "Recognized as the 'Emerging Chapter of the Year' by ACM India for our outstanding contributions and rapid growth." },
];

const Journey = () => {
    const component = useRef(null);

    useGSAP(() => {
        const items = gsap.utils.toArray('.timeline-item');
        items.forEach(item => {
            gsap.from(item, {
                x: item.classList.contains('timeline-item-left') ? -100 : 100,
                opacity: 0,
                duration: 1,
                ease: 'power3.out',
                scrollTrigger: {
                    trigger: item,
                    start: 'top 80%',
                    toggleActions: 'play none none none'
                }
            });
        });
    }, { scope: component });

    return (
        <section ref={component} className="relative bg-black text-blue-50 py-32 px-3 md:px-10 overflow-hidden">
            <div className="container mx-auto">
                <AnimatedTitle
                    title="Our Journey"
                    containerClass="text-center !text-white"
                />
                <div className="relative mt-24">
                    {/* The center line */}
                    <div className="absolute left-1/2 top-0 h-full w-[2px] bg-white/10 -translate-x-1/2"></div>

                    {timelineData.map((event, index) => (
                        <div
                            key={index}
                            className={`timeline-item relative mb-12 flex items-center w-full ${index % 2 === 0 ? 'justify-start timeline-item-left' : 'justify-end timeline-item-right'}`}
                        >
                            <div className="w-1/2 px-4 md:px-8">
                                <div className={`p-6 rounded-lg border border-white/20 bg-black/50 backdrop-blur-sm ${index % 2 === 0 ? 'text-right' : 'text-left'}`}>
                                    <p className="text-blue-300 font-bebas-neue text-4xl mb-2">{event.year}</p>
                                    <h3 className="font-general uppercase text-xl font-bold mb-3">{event.title}</h3>
                                    <p className="text-sm text-blue-50/70">{event.description}</p>
                                </div>
                            </div>
                             {/* The dot on the line */}
                            <div className="absolute left-1/2 -translate-x-1/2 z-10 size-4 rounded-full bg-blue-300 border-4 border-black"></div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Journey;