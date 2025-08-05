import React, { useState, useRef, useEffect, useCallback } from 'react';
import { gsap } from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from "gsap/all";
import AnimatedTitle from "./AnimatedTitle";
import TextPressure from './TextPressure';
import CountUp from './CountUp';


gsap.registerPlugin(ScrollTrigger);

const Glance = () => {
    const [isHovering, setIsHovering] = useState(false);
    const cardRefs = useRef([]);
    const animationFrame = useRef(null);
    const mousePosition = useRef({});
    const videoRefs = useRef([]);

    const addToRefs = (el) => {
        if (el && !cardRefs.current.includes(el)) {
            cardRefs.current.push(el);
        }
    };

    const addVideoRef = (el) => {
        if (el && !videoRefs.current.includes(el)) {
            videoRefs.current.push(el);
        }
    };

    const handleMouseMove = useCallback(({ clientX, clientY, currentTarget }) => {
        const rect = currentTarget.getBoundingClientRect();

        const xOffset = clientX - (rect.left + rect.width / 2);
        const yOffset = clientY - (rect.top + rect.height / 2);

        mousePosition.current = { xOffset, yOffset, currentTarget };

        if (animationFrame.current) cancelAnimationFrame(animationFrame.current);
        animationFrame.current = requestAnimationFrame(() => {
            if (isHovering) {
                gsap.to(currentTarget, {
                    x: xOffset * 0.05,
                    y: yOffset * 0.05,
                    rotationY: xOffset / 75,
                    rotationX: -yOffset / 75,
                    transformPerspective: 500,
                    duration: 0.6,
                    ease: "power1.out",
                    scale: 0.9,
                });
            }
        });
    }, [isHovering]);

    useEffect(() => {
        if (!isHovering) {
            cardRefs.current.forEach(card => {
                gsap.to(card, {
                    x: 0,
                    y: 0,
                    rotationY: 0,
                    rotationX: 0,
                    duration: 0.6,
                    ease: "power1.out",
                    scale: 1,
                });
            });
        }
    }, [isHovering]);

    useEffect(() => {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                const video = entry.target;
                if (entry.isIntersecting) {
                    video.play();
                } else {
                    video.pause();
                }
            });
        }, {
            threshold: 0.25
        });

        videoRefs.current.forEach(video => {
            if (video) observer.observe(video);
        });

        return () => {
            videoRefs.current.forEach(video => {
                if (video) observer.unobserve(video);
            });
        };
    }, []);

    return (
        <section className='min-h-screen bg-black text-violet-100 p-5 space-y-10'>
            <AnimatedTitle
                title="Our community<br />in a nutshell"
                containerClass="mt-5 !text-black !text-blue-100 text-center"
            />

            <div className='flex flex-col lg:flex-row gap-10 lg:pr-40'>
                <div className='flex flex-col w-full gap-10 items-end mt-28'>
                    <div
                        ref={addToRefs}
                        className='relative flex border flex-col justify-between w-full max-w-full lg:max-w-xl md:h-[15rem] border border-neutral-700 p-5 rounded-lg overflow-hidden'
                        onMouseMove={handleMouseMove}
                        onMouseEnter={() => setIsHovering(true)}
                        onMouseLeave={() => setIsHovering(false)}
                    >
                        <video
                            ref={addVideoRef}
                            src="videos/glance-2.mp4"
                            loop
                            muted
                            autoPlay
                            className="absolute inset-0 h-full w-full left-[100px] object-cover object-left md:object-[60%] opacity-40 z-0"
                        />
                        <div className='relative z-10 p-2'>
                            <h3 className="special-font text-2xl text-white font-bold">Chapter Members</h3>
                            <h1 className='plain-heading special-font text-blue-300 text-7xl md:text-8xl font-semibold'>
                                <CountUp from={0} to={300} separator="," direction="up" duration={1} className="count-up-text" />
                                <b>+</b>
                            </h1>
                        </div>
                    </div>

                    <div
                        ref={addToRefs}
                        className='flex border flex-col justify-between w-full h-[20rem] max-w-full lg:max-w-xl md:h-[30rem] lg:h-[26rem] border border-neutral-700 p-2 bg-yellow-300 rounded-lg overflow-hidden'
                        onMouseMove={handleMouseMove}
                        onMouseEnter={() => setIsHovering(true)}
                        onMouseLeave={() => setIsHovering(false)}
                    >
                        <div className='special-font text-black lg:text-[16rem] leading-none' style={{ position: 'relative', height: '390px' }}>
                            <TextPressure text="59+" flex={true} alpha={false} stroke={false} width={true} weight={true} italic={false} textColor="#000000ff" strokeColor="#ff0000" minFontSize={20} />
                        </div>
                        <div className='p-5'>
                            <h3 className='text-black text-3xl text-end font-bold opacity-100'>Global Members</h3>
                        </div>
                    </div>

                    <div
                        ref={addToRefs}
                        className='flex border flex-col justify-between w-full max-w-full lg:max-w-xl border border-neutral-700 p-2 bg-blue-300 rounded-lg overflow-hidden'
                        onMouseMove={handleMouseMove}
                        onMouseEnter={() => setIsHovering(true)}
                        onMouseLeave={() => setIsHovering(false)}
                    >
                        <div className='p-2 px-5'>
                            <div className='p-2'>
                                <h3 className='text-black text-3xl text-start font-bold opacity-100'>Events Conducted</h3>
                            </div>
                            <h1 className='special-font text-black text-[12rem] md:text-[12rem] leading-none text-start'>
                                <CountUp from={0} to={40} separator="," direction="up" duration={1} className="count-up-text font-semibold" />
                                <b>+</b>
                            </h1>
                        </div>
                        <div className='p-10 flex flex-col space-y-3'>
                            <div className='flex space-x-4 items-center'>
                                <div className='text-black h-5 w-5 bg-black rounded-full'></div>
                                <div className='flex flex-col'>
                                    <h1 className='text-black font-montserat font-bold text-1xl md:text-1xl'>TOTAL PARTICIPANTS</h1>
                                    <h1 className='text-black font-montserat font-bold text-2xl md:text-2xl'>
                                        <CountUp from={0} to={2603} separator="," direction="up" duration={1} className="count-up-text" />
                                    </h1>
                                </div>
                            </div>
                            <div className='flex space-x-4 items-center'>
                                <div className='text-black h-5 w-5 bg-yellow-300 rounded-full'></div>
                                <div className='flex flex-col'>
                                    <h1 className='text-yellow-300 font-montserat font-semibold text-1xl md:text-1xl'>TECHNICAL EVENTS</h1>
                                    <h1 className='text-yellow-300 font-montserat font-bold text-2xl md:text-2xl'>
                                        <CountUp from={0} to={24} separator="," direction="up" duration={1} className="count-up-text" />
                                    </h1>
                                </div>
                            </div>
                            <div className='flex space-x-4 items-center'>
                                <div className='text-black h-5 w-5 bg-white rounded-full'></div>
                                <div className='flex flex-col'>
                                    <h1 className='text-white font-montserat font-semibold text-1xl md:text-1xl'>NON-TECHNICAL AND OTHER EVENTS</h1>
                                    <h1 className='text-white font-montserat font-bold text-2xl md:text-2xl'>
                                        <CountUp from={0} to={16} separator="," direction="up" duration={1} className="count-up-text" />
                                    </h1>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className='flex flex-col w-auto gap-10 items-start'>
                    <div
                        ref={addToRefs}
                        className='relative flex border flex-col justify-between w-full max-w-full lg:max-w-xl md:h-[30rem] border border-neutral-700 p-3 rounded-lg overflow-hidden'
                        onMouseMove={handleMouseMove}
                        onMouseEnter={() => setIsHovering(true)}
                        onMouseLeave={() => setIsHovering(false)}
                    >
                        <video
                            ref={addVideoRef}
                            src="videos/glance-4.mp4"
                            loop
                            muted
                            autoPlay
                            className="absolute inset-0 h-2rem w-full left-[-100px] top-[200px] object-cover md:object-[50%] opacity-30 z-0"
                        />
                        <div className='relative z-10 font-montserrat text-white opacity-70 p-4 text-2xl md:text-[2rem] leading-none'>
                            <p>
                                Join the quest at <b>BMSCE ACM Student Chapter</b> where tech meets purpose. We're on a mission to spark innovation, grow leaders, and connect classrooms to real-world impact through learning, service, and collaboration.
                            </p>
                        </div>
                        <div className='p-5'>
                            <h3 className='relative z-10 text-blue-300 text-3xl text-end font-bold opacity-100'>OUR MISSION</h3>
                        </div>
                    </div>
                    <div
                        ref={addToRefs}
                        className='relative flex border flex-col justify-between w-full max-w-full lg:max-w-xl md:h-[18rem] border border-neutral-700 p-5 rounded-lg overflow-hidden'
                        onMouseMove={handleMouseMove}
                        onMouseEnter={() => setIsHovering(true)}
                        onMouseLeave={() => setIsHovering(false)}
                    >
                        <video
                            ref={addVideoRef}
                            src="videos/glance-5.mp4"
                            loop
                            muted
                            autoPlay
                            className="absolute inset-0 h-full w-full left-[100px] object-cover object-left md:object-[60%] opacity-60 z-0"
                        />
                        <div className='relative z-10 p-2'>
                            <h3 className="special-font text-3xl text-white font-bold">Internships Offered</h3>
                            <h1 className='plain-heading special-font text-blue-300 text-[5rem] md:text-[10rem] font-semibold'>
                                <CountUp from={0} to={8} separator="," direction="up" duration={1} className="count-up-text" />
                                <b>+</b>
                            </h1>
                        </div>
                    </div>
                    <div
                        ref={addToRefs}
                        className='bg-blue-75 rounded-lg w-full max-w-full lg:max-w-xl'
                        onMouseMove={handleMouseMove}
                        onMouseEnter={() => setIsHovering(true)}
                        onMouseLeave={() => setIsHovering(false)}
                    >
                        <div className='p-2'>
                            <div className='p-2'>
                                <h3 className='text-black text-start text-3xl font-semibold opacity-70'>Social Media Reach</h3>
                                <h3 className='text-black text-start font-semibold opacity-70'>Instagram + LinkedIn</h3>
                            </div>
                            <h1 className='plain-heading special-font text-black text-[9rem] px-4 md:text-[16rem] lg:text-[16rem] leading-none md:leading-[20rem] text-start'><b>2.5k</b>+</h1>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Glance;


