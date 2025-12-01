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
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 lg:grid-rows-2 gap-6">
         <div 
            ref={addToRefs}
                      className='flex border  flex-col justify-between w-full bg-blue-300  shadow-card hover:shadow-glo max-w-full lg:max-w-xl border-event-card-border p-6 rounded-lg overflow-hidden lg:row-span-2'
                      onMouseMove={handleMouseMove}
                      onMouseEnter={() => setIsHovering(true)}
                      onMouseLeave={() => setIsHovering(false)}
          >
            <div className="flex items-center lg:items-start font-general justify-between">
              <div className='flex flex-col lg:gap-14 justify-center lg:items-center'>
                <p className="text-sm lg:text-2xl font-semibold text-black mb-1  ">
                  Total Events
                </p>
                <p className="text-2xl lg:text-[150px] font-bold text-yellow-50">
                  <CountUp 
                    from={0}
                    to={totalEvents}
                    separator=","
                    direction="up"
                    duration={0.8}
                    className="count-up-text "
                  />
                </p>
              </div>
              <Calendar className={`h-8 w-8 lg:h-[60px] lg:w-[60px] lg:text-black`} />
            </div>   
          </div>

          <div 
            ref={addToRefs}
                      className='flex border bg-event-stats flex-col justify-between w-full text-white  hover:shadow-glo max-w-full lg:max-w-xl border-event-card-border p-6 rounded-lg overflow-hidden'
                      onMouseMove={handleMouseMove}
                      onMouseEnter={() => setIsHovering(true)}
                      onMouseLeave={() => setIsHovering(false)}
          >
            <div className="flex items-center font-general justify-between">
              <div>
                <p className="text-sm font-medium text-white mb-1">
                  Past Events
                </p>
                <p className="text-2xl font-bold text-foreground">
                  <CountUp
                    from={0}
                    to={pastEvents}
                    separator=","
                    direction="up"
                    duration={0.8}
                    className="count-up-text"
                  />
                </p>
              </div>
              <TrendingUp className={`h-8 w-8`} />
            </div>   
          </div>

          <div 
            ref={addToRefs}
                      className='flex border bg-event-stats flex-col justify-between w-full  bg-yellow-300 shadow-card hover:shadow-glo max-w-full lg:max-w-xl border-event-card-border p-6 lg:row-span-2 rounded-lg overflow-hidden'
                      onMouseMove={handleMouseMove}
                      onMouseEnter={() => setIsHovering(true)}
                      onMouseLeave={() => setIsHovering(false)}
          >
            <div className="flex items-center lg:items-start font-general justify-between">
              <div className='flex flex-col lg:gap-14 lg:justify-center'>
                <p className="text-sm font-medium lg:text-2xl text-black mb-1">
                  Total Participants
                </p>
                <p className="text-2xl lg:text-[100px] font-bold text-black">
                  <CountUp
                    from={0}
                    to={totalAttendees}
                    separator=","
                    direction="up"
                    duration={0.7}
                    className="count-up-text"
                  />
                </p>
              </div>
              <Users className={`h-8 w-8 lg:h-[60px] lg:w-[60px] text-black`} />
            </div>   
          </div>

          <div 
            ref={addToRefs}
                      className='flex border bg-event-stats flex-col text-white justify-between w-full hover:bg-black shadow-card hover:shadow-glo max-w-full lg:max-w-xl border-event-card-border p-6 rounded-lg overflow-hidden'
                      onMouseMove={handleMouseMove}
                      onMouseEnter={() => setIsHovering(true)}
                      onMouseLeave={() => setIsHovering(false)}
          >
            <div className="flex items-center font-general justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground mb-1">
                  Upcomimg Events
                </p>
                <p className="text-2xl font-bold text-foreground">
                  <CountUp
                    from={0}
                    to={0}
                    separator=","
                    direction="up"
                    duration={0.8}
                    className="count-up-text"
                  />
                </p>
              </div>
              <Clock className={`h-8 w-8`} />
            </div>   
          </div>

          
      </div>
    </div>
  );
};

export default EventStats
