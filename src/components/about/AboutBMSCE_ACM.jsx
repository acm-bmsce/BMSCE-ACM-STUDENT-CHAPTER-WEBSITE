// src/components/AboutBMSCE_ACM.jsx

import AnimatedTitle from "../AnimatedTitle";
import { BentoCard, BentoTilt } from "../Bento"; // Reusing from Features.jsx

const bmsceAcmCards = [
    {
        title: "Innovation",
        description: "We encourage creative problem-solving and the development of novel technologies through projects and workshops.",
        video: "videos/innovation.mp4",
        type:"video",
    },
    {
        title: "Community",
        description: "Building a strong, supportive network of students and faculty to foster collaboration and shared growth.",
        video: "img/community.webp",
        type:"image",
    },
    {
        title: "Excellence",
        description: "Striving for technical and academic excellence in all our endeavors, from coding competitions to research papers.",
        video: "img/excellence2.webp",
        type:"image",
    },
    {
        title: "Growth",
        description: "Providing opportunities for personal and professional development, preparing members for future careers.",
        video: "videos/growth.mp4",
    },
];

const AboutBMSCE_ACM = () => {
    return (
        <section className="bg-black text-blue-50 py-32 px-3 md:px-10">
            <div className="container mx-auto">
                <AnimatedTitle
                    title="About BMSCE ACM"
                    containerClass="text-center !text-white"
                />
                <p className="mt-8 mb-20 max-w-3xl mx-auto text-center font-general text-lg text-blue-50/80">
                    The BMSCE ACM Student Chapter is a vibrant community of passionate computer science enthusiasts, researchers, and innovators dedicated to advancing the field of computing at BMS College of Engineering. We foster an environment of learning, collaboration, and innovation where students can explore cutting-edge technologies, participate in research, and build lasting professional networks.
                </p>

                {/* Bento Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-7">
                    {bmsceAcmCards.map((card, index) => (
                        <BentoTilt key={index} className="bento-tilt_2 row-span-1 h-[50vh]">
                            <BentoCard
                                src={card.video}
                                title={card.title}
                                description={card.description}
                                type={card.type}
                            />
                        </BentoTilt>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default AboutBMSCE_ACM;