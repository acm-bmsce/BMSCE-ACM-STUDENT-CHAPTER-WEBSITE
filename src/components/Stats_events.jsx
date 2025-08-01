import { TrendingUp, Calendar, Users, Clock } from 'lucide-react';
import React, { useState, useRef, useEffect } from 'react';
import CountUp from './text/CountUp_event';
import { gsap } from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);


const EventStats = ({
    totalEvents,
    upcomingEvents,
    pastEvents,
    totalAttendees
}) => {
    const stats = [
        {
            label: 'Total Events',
            value: totalEvents,
            icon: Calendar,
            color: 'text-primary'
        },
        {
            label: 'Upcoming',
            value: upcomingEvents,
            icon: Clock,
            color: 'text-primary-glow'
        },
        {
            label: 'Past Events',
            value: pastEvents,
            icon: TrendingUp,
            color: 'text-muted-foreground'
        },
        {
            label: 'Total Attendees',
            value: totalAttendees,
            icon: Users,
            color: 'text-primary'
        }
    ];

    const [isHovering, setIsHovering] = useState(false);
    const cardRefs = useRef([]);


    const addToRefs = (el) => {
        if (el && !cardRefs.current.includes(el)) {
            cardRefs.current.push(el);
        }
    };


    const handleMouseMove = ({ clientX, clientY, currentTarget }) => {
        const rect = currentTarget.getBoundingClientRect();

        const xOffset = clientX - (rect.left + rect.width / 2);
        const yOffset = clientY - (rect.top + rect.height / 2);

        if (isHovering) {

            gsap.to(currentTarget, {
                x: xOffset * 0.05,
                y: yOffset * 0.05,
                rotationY: xOffset / 75,
                rotationX: -yOffset / 75,
                transformPerspective: 500,
                duration: 0.6,
                ease: "power1.out",
                scale: 1.05,
            });


            // const content = currentTarget.querySelector('video, img'); 
            // if (content) {
            //     gsap.to(content, {
            //         x: -xOffset * 0.1, 
            //         y: -yOffset * 0.1, 
            //         duration: 0.6, 
            //         ease: "power1.out",
            //     });
            // }
        }
    };




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

                const content = card.querySelector('video, img');
                if (content) {
                    gsap.to(content, {
                        x: 0,
                        y: 0,
                        duration: 0.6,
                        ease: "power1.out",
                    });
                }
            });
        }
    }, [isHovering]);


    cardRefs.current = []

    return (
        <div className="max-w-7xl mx-auto px-6 py-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((stat) => {
                    const Icon = stat.icon;
                    return (
                        <div
                            key={stat.label}
                            // className={`bg-event-stats border border-event-card-border rounded-lg p-6 
                            //            shadow-card hover:shadow-glow hover:bg-black transition-all duration-300
                            //            animate-slide-up`}
                            // style={{ animationDelay: `${index * 100}ms` }}
                            ref={addToRefs}
                            className='flex border bg-event-stats flex-col justify-between w-full hover:bg-black shadow-card hover:shadow-glo max-w-full lg:max-w-xl border-event-card-border p-6 rounded-lg overflow-hidden'
                            onMouseMove={handleMouseMove}
                            onMouseEnter={() => setIsHovering(true)}
                            onMouseLeave={() => setIsHovering(false)}
                        >
                            <div className="flex items-center font-general justify-between">
                                <div>
                                    <p className="text-sm font-medium text-muted-foreground mb-1">
                                        {stat.label}
                                    </p>
                                    <p className="text-2xl font-bold text-foreground">
                                        {/* {stat.value.toLocaleString()} */}
                                        <CountUp
                                            from={0}
                                            to={stat.value}
                                            separator=","
                                            direction="up"
                                            duration={0.8}
                                            className="count-up-text"
                                        />
                                    </p>
                                </div>
                                <Icon className={`h-8 w-8 ${stat.color}`} />
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default EventStats