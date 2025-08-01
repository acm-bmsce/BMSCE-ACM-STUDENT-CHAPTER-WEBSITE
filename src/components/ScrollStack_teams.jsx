import React, { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import TeamMemberCard from "./Teamcaard/TeamCard"; // reuse your card component

const ScrollStackSection = ({ title, members, sectionKey }) => {
    const containerRef = useRef(null);
    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start start", "end end"]
    });

    const total = members.length;
    const indexValue = useTransform(scrollYProgress, [0, 1], [0, total - 1]);

    return (
        <div ref={containerRef} className="h-[300vh] bg-black text-white">
            <div className="sticky top-0 h-screen flex items-center">
                {/* Left deck */}
                <div className="w-[25vw] flex flex-col items-end gap-4 pl-8">
                    {members.map((m, i) => (
                        <div
                            key={i}
                            className="w-32 h-20 rounded-lg bg-gradient-to-br from-blue-400 to-indigo-500 flex items-center justify-center text-sm font-medium opacity-80 shadow"
                        >
                            {m.name.split(" ")[0]}
                        </div>
                    ))}
                </div>

                {/* Center display */}
                <div className="flex-1 flex justify-center items-center relative">
                    {members.map((m, i) => {
                        const opacity = useTransform(
                            indexValue,
                            [i - 0.5, i, i + 0.5],
                            [0, 1, 0]
                        );
                        const scale = useTransform(
                            indexValue,
                            [i - 0.5, i, i + 0.5],
                            [0.8, 1, 0.8]
                        );
                        const y = useTransform(
                            indexValue,
                            [i - 0.5, i, i + 0.5],
                            [100, 0, -100]
                        );
                        const x = useTransform(
                            indexValue,
                            [i - 0.5, i, i + 0.5],
                            [-100, 0, 100]
                        );

                        return (
                            <motion.div
                                key={i}
                                style={{ opacity, scale, y, x }}
                                className="absolute"
                            >
                                <div className="w-[90vw] max-w-[350px] h-auto">
                                    <TeamMemberCard member={m} />
                                </div>
                            </motion.div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};

export default ScrollStackSection;
