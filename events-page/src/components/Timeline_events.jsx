import React, { useState, useEffect, useRef } from 'react';
import { Calendar, MapPin, Users, Clock } from 'lucide-react';
import { EventCard } from './Card_event';
import eventData from './Data2_event';


const timelineData = [
  {
    id: 1,
    date: 'Jan 15, 2024',
    title: 'Project Kickoff Meeting',
    description:
      'Initial planning session for the new product launch. Discussing project scope, timeline, and resource allocation.',
    location: 'Conference Room A',
    attendees: 8,
    type: 'meeting',
    posterImage:
      'https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg?auto=compress&cs=tinysrgb&w=800',
  },
  {
    id: 2,
    date: 'Feb 2, 2024',
    title: 'Design Review',
    description:
      'Comprehensive review of the UI/UX designs with stakeholders. Finalizing the visual direction and user experience.',
    location: 'Design Studio',
    attendees: 5,
    type: 'milestone',
    posterImage:
      'https://images.pexels.com/photos/196644/pexels-photo-196644.jpeg?auto=compress&cs=tinysrgb&w=800',
  },
  {
    id: 3,
    date: 'Feb 20, 2024',
    title: 'Developer Conference',
    description:
      'Annual tech conference focusing on emerging technologies and best practices in software development.',
    location: 'Tech Center',
    attendees: 150,
    type: 'event',
    posterImage:
      'https://images.pexels.com/photos/1181676/pexels-photo-1181676.jpeg?auto=compress&cs=tinysrgb&w=800',
  },
  {
    id: 4,
    date: 'Mar 5, 2024',
    title: 'Beta Release Deadline',
    description:
      'First beta version must be ready for internal testing. All core features should be implemented and tested.',
    location: 'Development Team',
    attendees: 12,
    type: 'deadline',
    posterImage:
      'https://images.pexels.com/photos/574071/pexels-photo-574071.jpeg?auto=compress&cs=tinysrgb&w=800',
  },
  {
    id: 5,
    date: 'Mar 18, 2024',
    title: 'User Testing Session',
    description:
      'Conducting usability tests with real users to gather feedback and identify areas for improvement.',
    location: 'UX Lab',
    attendees: 20,
    type: 'meeting',
    posterImage:
      'https://images.pexels.com/photos/3184360/pexels-photo-3184360.jpeg?auto=compress&cs=tinysrgb&w=800',
  },
  {
    id: 6,
    date: 'Apr 2, 2024',
    title: 'Product Launch',
    description:
      'Official product launch with marketing campaign, press releases, and customer onboarding.',
    location: 'Main Auditorium',
    attendees: 100,
    type: 'milestone',
    posterImage:
      'https://images.pexels.com/photos/3184465/pexels-photo-3184465.jpeg?auto=compress&cs=tinysrgb&w=800',
  },
  {
    id: 7,
    date: 'Apr 15, 2024',
    title: 'Post-Launch Review',
    description:
      'Analyzing launch metrics, user feedback, and planning for future iterations and improvements.',
    location: 'Strategy Room',
    attendees: 15,
    type: 'meeting',
    posterImage:
      'https://images.pexels.com/photos/3184639/pexels-photo-3184639.jpeg?auto=compress&cs=tinysrgb&w=800',
  },
  {
    id: 8,
    date: 'May 1, 2024',
    title: 'Team Retreat',
    description:
      'Team building activities and strategic planning session for Q2. Celebrating successful product launch.',
    location: 'Mountain Resort',
    attendees: 25,
    type: 'event',
    posterImage:
      'https://images.pexels.com/photos/1181467/pexels-photo-1181467.jpeg?auto=compress&cs=tinysrgb&w=800',
  },
];

const getTypeColor = (type) => {
  switch (type) {
    case 'meeting':
      return 'bg-blue-500';
    case 'event':
      return 'bg-green-500';
    case 'milestone':
      return 'bg-purple-500';
    case 'deadline':
      return 'bg-red-500';
    default:
      return 'bg-gray-500';
  }
};

const getTypeIcon = (type) => {
  switch (type) {
    case 'meeting':
      return Users;
    case 'event':
      return Calendar;
    case 'milestone':
      return MapPin;
    case 'deadline':
      return Clock;
    default:
      return Calendar;
  }
};

function Timeline({onEventClick}) {
  const [visibleItems, setVisibleItems] = useState(3);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [activeCardIndex, setActiveCardIndex] = useState(0);
  const timelineRef = useRef(null);
  const cardRefs = useRef([]);

  useEffect(() => {
    const handleScroll = () => {
      const { scrollTop, scrollHeight, clientHeight } = document.documentElement;
      const progress = scrollTop / (scrollHeight - clientHeight);
      setScrollProgress(progress);

      const scrollPercentage = (scrollTop + clientHeight) / scrollHeight;
      const newVisibleItems = Math.min(
        eventData.length,
        Math.ceil(scrollPercentage * eventData.length * 1.5)
      );
      setVisibleItems(Math.max(3, newVisibleItems));

      const viewportCenter = scrollTop + clientHeight / 2;
      let newActiveIndex = 0;

      cardRefs.current.forEach((cardRef, index) => {
        if (cardRef) {
          const cardTop = cardRef.offsetTop;
          const cardCenter = cardTop + cardRef.offsetHeight / 2;
          if (viewportCenter >= cardCenter) {
            newActiveIndex = index;
          }
        }
      });

      setActiveCardIndex(newActiveIndex);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    cardRefs.current = cardRefs.current.slice(0, eventData.length);
  }, []);

  return (
    <div className="min-h-screen w-full bg-black">
      <div className="relative z-10  backdrop-blur-sm border-b sticky top-0">
        <div className=" mx-auto px-4 sm:px-6 py-4 sm:py-6">
          <h1 className="text-4xl  font-bold text-white text-center">All Events</h1>
        </div>
      </div>

      <div className="relative max-w-6xl mx-auto px-4 sm:px-6 py-8 sm:py-12" ref={timelineRef}>
        <div className="absolute left-1/2 transform -translate-x-1/2 w-0.5 sm:w-1 bg-slate-200 h-full">
          <div
            className="w-full bg-gradient-to-b from-blue-500 to-purple-500 transition-all duration-300 ease-out"
            style={{ height: `${scrollProgress * 100}%` }}
          />
        </div>

        <div className="relative">
          {eventData.slice(0, visibleItems).map((event, index) => {
            const isLeft = index % 2 === 0;
            const Icon = getTypeIcon(event.type);

            return (
                //date left
              <div
                key={event.id}
                ref={(el) => (cardRefs.current[index] = el)}
                className={`relative flex items-center mb-16 ${
                  isLeft ? 'sm:flex-row flex-col' : 'sm:flex-row-reverse flex-col'
                } group`}
                style={{
                  opacity: index < visibleItems - 2 ? 1 : 0.7,
                  transform: index >= visibleItems - 2 ? 'translateY(20px)' : 'translateY(0)',
                  transition: 'all 0.6s ease-out',
                }}
              >
                <div
                  className={`w-full sm:w-5/12 mb-4 sm:mb-0 ${
                    isLeft
                      ? 'sm:text-right sm:pr-8 text-center'
                      : 'sm:text-left sm:pl-8 text-center order-3 sm:order-none'
                  }`}
                >
                  <div className="inline-block sm:block">
                    <div className="text-lg font-semibold text-slate-700 mb-1">{event.date}</div>
                  </div>
                </div>

                <div className="relative z-10 flex items-center justify-center mb-4 sm:mb-0 order-1 sm:order-none">
                  <div
                    className={`w-4 h-4 sm:w-6 sm:h-6 rounded-full  border-2 sm:border-4 border-white shadow-lg transform group-hover:scale-125 transition-all duration-300 ${
                      index <= activeCardIndex ? 'ring-4 ring-blue-200 ring-opacity-60' : ''
                    }`}
                  >
                    <div className="absolute inset-0 rounded-full bg-white/20" />
                  </div>
                </div>
                
                {/* card left*/}
                <div className={`w-full sm:w-5/12 order-2 sm:order-none ${isLeft ? 'sm:pl-[200px]' : 'sm:pr-[200px]'}`} >
                <EventCard event={event} onClick={() => onEventClick(event)}/>
                </div>
              </div>
            );
          })}
        </div>

        {visibleItems < eventData.length && (
          <div className="text-center py-6 sm:py-8">
            <div className="inline-flex items-center gap-2 text-slate-500">
              <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" />
              <div
                className="w-2 h-2 bg-purple-500 rounded-full animate-pulse"
                style={{ animationDelay: '0.2s' }}
                />
              <div
                className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"
                style={{ animationDelay: '0.4s' }}
                />
              <span className="ml-2 text-xs sm:text-sm">Loading more events...</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Timeline;

{/* <div className={`w-full sm:w-5/12 order-2 sm:order-none ${isLeft ? 'sm:pl-8' : 'sm:pr-8'}`}>
  <div
    className={`bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-500 p-4 sm:p-6 border group-hover:-translate-y-1 ${
      index <= activeCardIndex
        ? 'border-blue-300 shadow-blue-100 shadow-2xl ring-1 ring-blue-200 ring-opacity-50'
        : 'border-slate-200 group-hover:border-slate-300'
    }`}
  >
    <div className="relative mb-4 overflow-hidden rounded-lg">
      <img
        src={event.posterImage}
        alt={event.title}
        className={`w-full h-32 sm:h-40 object-cover transition-all duration-500 group-hover:scale-105 ${
          index <= activeCardIndex ? 'brightness-110' : ''
        }`}
      />
      <div
        className={`absolute inset-0 bg-gradient-to-t transition-all duration-500 ${
          index <= activeCardIndex
            ? 'from-blue-900/10 to-transparent'
            : 'from-black/20 to-transparent'
        }`}
      />
    </div>

    <div className="flex items-center gap-3 mb-3">
      <div className={`p-2 rounded-lg ${getTypeColor(event.type)} bg-opacity-10`}>
        <Icon className={`w-4 h-4 sm:w-5 sm:h-5 ${getTypeColor(event.type).replace('bg-', 'text-')}`} />
      </div>
      <div
        className={`px-2 sm:px-3 py-1 rounded-full text-xs font-medium text-white ${getTypeColor(
          event.type
        )}`}
      >
        {event.type.charAt(0).toUpperCase() + event.type.slice(1)}
      </div>
    </div>

    <h3 className="text-lg sm:text-xl font-bold text-slate-800 mb-3 leading-tight">
      {event.title}
    </h3>

    <p className="text-sm sm:text-base text-slate-600 mb-4 leading-relaxed">{event.description}</p>

    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-4 text-xs sm:text-sm text-slate-500">
      <div className="flex items-center gap-1">
        <MapPin className="w-4 h-4" />
        <span>{event.location}</span>
      </div>
      <div className="flex items-center gap-1">
        <Users className="w-4 h-4" />
        <span>{event.attendees}</span>
      </div>
    </div>
  </div>

  
</div> */}