import React, { useState, useEffect, useRef } from "react";
import Waves from "./background/Waves";
import CountUp from "./text/CountUp";
import DecryptedText from "./text/DecryptedText";
import GradientText from "./text/GradientText";
import { div } from "framer-motion/client";
import Cards from "./Cards";
import EventStats from './Stats'
import { EventNav } from "./EventNav";
import { HorizontalScroll } from "./HorizontalScroll";
import poster1 from './poster1.jpeg'
import { EventModal } from "./EventModal";
import SplitText from "./text/Split";
import BlurText from "./text/BlurText";
import Carousel from "./Carousel";
import AnimatedTitle from "./text/AnimatedTitle";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/all";
import eventData from "./EventData2";

// const tabs = [
//   "Upcoming Events",
//   "Past Events",
//   "Event Stats",
//   "Event Gallery",
//   "Other Images",
// ];

const mockEvents = [
  {
    id: '1',
    title: 'Annual Tech Symposium',
    description: 'A comprehensive gathering of tech enthusiasts, industry leaders, and innovators.',
    date: '2024-03-15',
    image: poster1,
    fullDescription:
      "Join us for our biggest event of the year! The Annual Tech Symposium brings together the brightest minds in technology for a day of learning, networking, and innovation. We'll feature keynote speakers from major tech companies, hands-on workshops, and exciting demonstrations of cutting-edge technologies.",
    gallery: [poster1, poster1, poster1],
    category: 'Technology',
    location: 'Main Auditorium',
    attendees: 250,
  },
  {
    id: '2',
    title: 'Coding Bootcamp Workshop',
    description: 'Intensive hands-on coding session for beginners and intermediate developers.',
    date: '2024-02-28',
    image: poster1,
    fullDescription:
      'Perfect for students looking to enhance their programming skills! This intensive workshop covers modern web development technologies including React, Node.js, and database management. Led by industry professionals with years of experience.',
    gallery: [poster1, poster1, poster1],
    category: 'Workshop',
    location: 'Computer Lab A',
    attendees: 45,
  },
  {
    id: '3',
    title: 'Innovation Challenge',
    description: 'Campus-wide competition for innovative solutions to real-world problems.',
    date: '2024-01-20',
    image: poster1,
    fullDescription:
      'Our flagship competition event where students form teams to solve pressing challenges using technology and creativity. Prizes include cash awards, mentorship opportunities, and internship placements.',
    gallery: [poster1, poster1, poster1],
    category: 'Competition',
    location: 'Innovation Hub',
    attendees: 120,
  },
  {
    id: '4',
    title: 'Alumni Networking Night',
    description: 'Connect with successful alumni and build professional relationships.',
    date: '2024-01-10',
    image: poster1,
    fullDescription:
      'An exclusive evening to connect with our accomplished alumni network. Perfect opportunity for current students to learn from industry veterans, explore career paths, and build meaningful professional relationships.',
    gallery: [poster1, poster1, poster1],
    category: 'Networking',
    location: 'Faculty Lounge',
    attendees: 80,
  },
  {
    id: '5',
    title: 'Web Development Masterclass',
    description: 'Advanced techniques and best practices for modern web development.',
    date: '2023-12-15',
    image: poster1,
    fullDescription:
      'Dive deep into advanced web development concepts with our expert instructors. Learn about performance optimization, security best practices, and cutting-edge frameworks.',
    gallery: [poster1, poster1, poster1],
    category: 'Education',
    location: 'Tech Center',
    attendees: 65,
  },
];

const slide = [{src: poster1, author: 'LUNDEV', title: 'DESIGN SLIDER', topic: 'ANIMAL', description: 'Lorem ipsum…'}]


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
  

  // #1c367da5

  return (
    <div className={` bg-black relative  flex flex-row justify-center items-center w-full  `} >
      
      <div className=" flex flex-col gap-3 w-full items-center relative z-10 snap-y snap-mandatory h-full">

        <div className="relative flex flex-col bg-blue-50 p-8 text-center items-center gap-2 w-full min-h-screen  pt-4 justify-center">
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

        <div className="w-full">
                <EventNav activeTab={activeTab} onTabChange={setActiveTab} pastCount={12} upcomingCount={0} />
        </div>

        
        <HorizontalScroll
          events={activeTab === 'upcoming' ? upcomingEvents : pastEvents}
          onEventClick={handleEventClick}
          title={activeTab === 'upcoming' ? 'Upcoming Events' : 'Past Events'}
          />
  

        {selectedEvent && (
          <EventModal 
          event={selectedEvent}
          onClose={handleCloseModal}
          />
        )}


      </div>

    </div>
  );
};


export default EventsPage;



{/* <div style={{ height: '600px', position: 'relative' }}>
  
  <CircularGallery bend={3} textColor="#ffffff" borderRadius={0.05} scrollEase={0.02}/>
  
  </div> */}
  
  // stats alt design
  {/* <div className="text-center font-heading text-[35px] mt-8">
      <ul className="space-y-2 text-white flex-row items-center justify-center mt-[4rem] font-semibold">
        <li>
        <p><DecryptedText text="Total Events" speed={100} maxIterations={30}  animateOn="view"/> :{"  "}
              <GradientText colors={["#40ffaa", "#4079ff", "#40ffaa", "#4079ff", "#40ffaa"]} animationSpeed={3} showBorder={false} className="custom-class">
              <CountUp from={0} to={24} separator="," direction="up" duration={0.8} className="count-up-text"/>
              </GradientText>
              </p>   
              </li>
              <li>
        <p><DecryptedText text="Avereage Participants" speed={100} maxIterations={30}  animateOn="view"/> :{"  "}
        <GradientText colors={["#40ffaa", "#4079ff", "#40ffaa", "#4079ff", "#40ffaa"]} animationSpeed={3} showBorder={false} className="custom-class">
        <CountUp from={0} to={120} separator="," direction="up" duration={0.8} className="count-up-text"/>
        </GradientText>
        </p>  
        </li>
        <li>
        <DecryptedText text="Top Rated :" speed={110} maxIterations={30}  animateOn="view"/> <GradientText colors={["#40ffaa", "#4079ff", "#40ffaa", "#4079ff", "#40ffaa"]} animationSpeed={3} showBorder={false} className="custom-class"> <DecryptedText text="Tech 2024" speed={110} maxIterations={30}  animateOn="view"/> </GradientText> 
        </li>
        </ul>
        </div> */}
        
        //old code
        
        // {tabs.map((tab, idx) => {
//           const folder = sectionFolders[tab];
//           // const images = folder ? getImages(folder) : [];

//           return (
  //             <div key={idx} className="min-h-screen  px-6 py-8">
  //               <h2 className="font-heading text-[100px] text-center text-[#a62639]">
  //                 {tab}
  //               </h2>
  
  //               {/* {images.length > 0 ? (
    //                 <div className="flex flex-wrap justify-center gap-6 mt-10">
//                   {images.map((url, i) => (
  //                     <img
  //                       key={i}
//                       src={url}
//                       alt={`Event ${i + 1}`}
//                       className="shadow-lg rounded-xl"
//                       style={{ objectFit: "contain", maxWidth: "100%" }}
//                       loading="lazy"
//                     />
//                   ))}
//                 </div>
//               ) : tab === "Event Stats" ? (
  //                 <div className="text-center font-body text-[22px] mt-10">
  //                   <ul className="space-y-2">
  //                     <li>Total Events: 24</li>
  //                     <li>Avg Participants: 120</li>
  //                     <li>Top Rated: Tech 2024</li>
  //                   </ul>
  //                 </div>
  //               ) : (
//                 <p className="text-center font-body text-[22px] mt-10">
//                   No images found.
//                 </p>
//               )} */}
//             </div>
//           );
//         })}



// stats old desing
//   <div className="max-w-sm mx-auto p-8 bg-white/[0.02] border border-white/[0.08] rounded-2xl">
//   <ul className="space-y-4 text-white font-semibold">
//     <li>

//         <DecryptedText
//           text="Total Events"
//           speed={100}
//           maxIterations={30}
//           animateOn="view"
//         />{" "}
//         :{" "}
//         <GradientText
//           colors={["#40ffaa", "#4079ff", "#40ffaa", "#4079ff", "#40ffaa"]}
//           animationSpeed={3}
//           showBorder={false}
//           className="custom-class"
//         >
//           <CountUp
//             from={0}
//             to={24}
//             separator=","
//             direction="up"
//             duration={0.8}
//             className="count-up-text"
//             />
//         </GradientText>
//     </li>
//     <li>
//         <DecryptedText
//           text="Average Participants"
//           speed={100}
//           maxIterations={30}
//           animateOn="view"
//           />{" "}
//         :{" "}
//         <GradientText
//           colors={["#40ffaa", "#4079ff", "#40ffaa", "#4079ff", "#40ffaa"]}
//           animationSpeed={3}
//           showBorder={false}
//           className="custom-class"
//           >
//           <CountUp
//             from={0}
//             to={120}
//             separator=","
//             direction="up"
//             duration={0.8}
//             className="count-up-text"
//             />
//         </GradientText>
//     </li>
//     <li>
//       <DecryptedText
//         text="Top Rated :"
//         speed={100}
//         maxIterations={30}
//         animateOn="view"
//       />{" "}
//       <

{/* <DecryptedText text="Customize me" speed={100} maxIterations={20} characters="ABCD1234!?" className="revealed" parentClassName="all-letters" encryptedClassName="encrypted"/> */}

// const getImages = (folderName) => {
//   const urls = [];
//   for (let i = 1; i <= 10; i++) {
//     urls.push(`/images/${folderName}/img${i}.jpg`);
//   }
//   return urls;
// };


// const SubNav = ({activeTab, setActiveTab}) => {
//   return(
//     <div className="w-[40%] h-[70px] flex flex-row items-center justify-center gap-5">
//       <button
//         className={`btn-glass-gradient font-semibold px-4 py-2 rounded-full transition-all duration-200 ${
//           activeTab === "Past Events" ? "border-white shadow-lg text-[#ffb630]" : "opacity-80 text-white"
//         }`}
//         onClick={() => {setActiveTab("Past Events"); console.log(activeTab)} }
//       >
//         Past Events
//       </button>
//       <button
//         className={`btn-glass-gradient font-semibold px-4 py-2 rounded-full transition-all duration-200 ${
//           activeTab === "Upcoming Events" ? "border-white shadow-lg text-[#ffb630]" : "opacity-80 text-white"
//         }`}
//         onClick={() => setActiveTab("Upcoming Events")}
//       >
//         Upcoming Events
//       </button>
//     </div>
//   )
// }


// const PastEvents = () => {

//   const scrollContainerRef = useRef(null);
//   const isScrollingRef = useRef(false);

//   useEffect(() => {
//     const handleWheel = (e) => {
//       const container = scrollContainerRef.current;
//       if (!container) return;

//       // Always prevent default vertical scrolling
//       e.preventDefault();

//       // Prevent rapid scrolling
//       if (isScrollingRef.current) return;
//       isScrollingRef.current = true;

//       // Convert vertical scroll to horizontal scroll
//       const scrollAmount = e.deltaY;
//       container.scrollLeft += scrollAmount;

//       // Reset scrolling flag after animation
//       setTimeout(() => {
//         isScrollingRef.current = false;
//       }, 50);
//     };

//     // Add wheel event listener to the entire window
//     window.addEventListener('wheel', handleWheel, { passive: false });

//     // Cleanup
//     return () => {
//       window.removeEventListener('wheel', handleWheel);
//     };
//   }, []);

//   return (
//     <div className="w-full h-full flex flex-col">
//       <h1 className="font-heading text-[50px] text-center text-[#a62639]">Past Events</h1>

//       <div 
//         ref={scrollContainerRef}
//         className="w-full px-3 flex gap-4 overflow-x-auto scrollbar-hide snap-x snap-mandatory scroll-smooth"
//         style={{
//           scrollbarWidth: 'none',
//           msOverflowStyle: 'none'
//         }}
//       >
//         <div className="snap-center shrink-0">
//           <Cards />
//         </div>
//         <div className="snap-center shrink-0">
//           <Cards />
//         </div>
//         <div className="snap-center shrink-0">
//           <Cards />
//         </div>
//         <div className="snap-center shrink-0">
//           <Cards />
//         </div>
//         <div className="snap-center shrink-0">
//           <Cards />
//         </div>
//         <div className="snap-center shrink-0">
//           <Cards />
//         </div>
//       </div>
//     </div>
//   );
    
// }

// const UpcomingEvents = () => {
//   return(
//     <div>
//       <h1 className="font-heading text-[50px] text-center text-[#a62639]">Upcoming Events</h1>
//     </div>
//   )
// }