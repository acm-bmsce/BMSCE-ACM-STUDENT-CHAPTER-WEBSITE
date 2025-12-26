import React from 'react'
import AnimatedTitle from "./AnimatedTitle";

const Hero_events = () => {
    return (
        <div>
            <section
                className="intro flex flex-col items-center justify-center gap-6 text-white text-center min-h-screen"
                style={{
                    backgroundImage:
                        "linear-gradient(rgba(0,0,0,0.7), rgba(0,0,0,0.75)), url('/img/events-bg.webp')",
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                    backgroundRepeat: "no-repeat",
                }}
            >
                <AnimatedTitle
    title="A CURATED SERIES<br />OF TRANSFORMATIVE DAYS"
    containerClass="animated-title_joinus !text-white text-center mb-2 !text-6xl md:!text-[6rem] leading-tight"
/>
                <p className="text-lg font-medium">
                    Learn, Connect, and Create — one event at a time.
                </p>
            </section>
        </div>
    )
}

export default Hero_events