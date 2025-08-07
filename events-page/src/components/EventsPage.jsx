import React, { useState, useEffect, useRef } from "react";
import { div } from "framer-motion/client";
import EventStats from './Stats_events'
import { EventNav } from "./Nav_event";
import { HorizontalScroll } from "./HorizontalScroll_event";
import { EventModal } from "./Modal_event";
import BlurText from "./text/BlurText_event";
import AnimatedTitle from "./text/AnimatedTitle_event";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/all";
import eventData from "./Data2_event";
import Timeline from "./Timeline_events";


// const tabs = [
//   "Upcoming Events",
//   "Past Events",
//   "Event Stats",
//   "Event Gallery",
//   "Other Images",
// ];






const tabs = [
  "Upcoming Events",
  "Past Events",
];

const eventsPageIntro = "Discover our upcoming workshops, coding competitions, guest lectures, and hackathons—all designed to help you grow your skills, connect with peers and professionals, and have fun building tech together. Check the calendar below for dates, descriptions, locations, and sign-up links. Don’t miss out!"



const EventsPage = () => {

  const [activeTab, setActiveTab] = useState("Past Events");
  const [selectedEvent, setSelectedEvent] = useState(null);
  
  const currentDate = new Date();
  const upcomingEvents = eventData.filter(event => new Date(event.date) > currentDate);
  const pastEvents = eventData.filter(event => new Date(event.date) <= currentDate);

  const handleEventClick = (event) => {
    setSelectedEvent(event);
  };

  const handleCloseModal = () => {
    setSelectedEvent(null);
  };
  



  return (
    <div className={` bg-black relative  flex flex-row justify-center items-center w-full  `} >
      
      <div className=" flex flex-col gap-3 w-full items-center relative z-10 snap-y snap-mandatory h-full">

        <div className="relative flex flex-col bg-blue-50 p-8 text-center items-center gap-2 w-full min-h-screen font-montserrat pt-4 justify-center">
          <AnimatedTitle title="Our Events" containerClass="text-xl mt-5 special-font hero-heading !text-black text-center"/>
          <BlurText
            text={eventsPageIntro}
            delay={2}
            animateBy="words"
            direction="top"
            className=" font-general text-[22px] text-black text-center max-w-[90%]"
          />
        </div>

        <div className="w-full ">
          <EventStats totalAttendees={2603} totalEvents={40} upcomingEvents={0} pastEvents={40}/>
        </div>

        {/* <div className="w-full">
                <EventNav activeTab={activeTab} onTabChange={setActiveTab} pastCount={12} upcomingCount={0} />
        </div> */}

        <HorizontalScroll
          events={activeTab === 'upcoming' ? upcomingEvents : pastEvents}
          onEventClick={handleEventClick}
          title={activeTab === 'upcoming' ? 'Upcoming Events' : 'Past Events'}
          />

          {selectedEvent && (
            <EventModal 
            event={selectedEvent}
            onClose={handleCloseModal}
            /> )}

        
        {/* 
  

         */}
        {/* <Timeline onEventClick={handleEventClick}/>
        )} */}
        {/* <Slider/> */}


      </div>

    </div>
  );
};


export default EventsPage;



