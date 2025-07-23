import React, { useState, useEffect, useRef } from 'react';

// --- 1. INTERSECTION OBSERVER HOOK ---
// This custom hook detects when an element is visible on the screen.
const useOnScreen = (options: IntersectionObserverInit) => {
  const ref = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      // Set visibility to true when the element is intersecting
      if (entry.isIntersecting) {
        setIsVisible(true);
        // Optional: stop observing after it's visible once
        observer.unobserve(entry.target);
      }
    }, options);

    const currentRef = ref.current;
    if (currentRef) {
      observer.observe(currentRef);
    }

    return () => {
      if (currentRef) {
        observer.unobserve(currentRef);
      }
    };
  }, [ref, options]);

  return [ref, isVisible] as const;
};


// --- 2. COMPONENT PROPS AND DATA TYPES ---
interface Milestone {
  year: string;
  title: string;
  image: string;
  description: string;
}

interface JourneyTimelineProps {
  milestones: Milestone[];
}


// --- 3. THE MAIN TIMELINE COMPONENT ---
export const JourneyTimeline: React.FC<JourneyTimelineProps> = ({ milestones }) => {
  // Use the custom hook to track when the timeline container is visible
  const [timelineRef, isTimelineVisible] = useOnScreen({
    threshold: 0.2, // Trigger when 20% of the element is visible
  });

  return (
    <div
      ref={timelineRef}
      className={`w-full max-w-6xl mx-auto py-12 px-4 ${isTimelineVisible ? 'animate-in' : ''}`}
    >
      {/* Container for both vertical and horizontal timelines */}
      <div className="relative">
        {/*
          VERTICAL TIMELINE (for small screens)
          - Uses `lg:hidden` to hide on large screens.
        */}
        <div className="lg:hidden">
          {/* The vertical line */}
          <div className="absolute left-1/2 w-0.5 h-full bg-gray-600 transform -translate-x-1/2"></div>
          {milestones.map((milestone, index) => (
            <div
              key={index}
              className="mb-12 transition-all duration-700 opacity-0 transform translate-y-8"
              style={{ transitionDelay: `${index * 200}ms` }}
            >
              <div className="flex items-center" style={{ flexDirection: index % 2 === 0 ? 'row' : 'row-reverse' }}>
                <div className="w-1/2 px-4">
                  <img src={milestone.image} alt={milestone.title} className="rounded-lg shadow-xl w-full" />
                </div>
                <div className="w-1/2 px-4">
                  <div className="p-4 bg-gray-800 rounded-lg shadow-md border border-gray-700">
                    <p className="text-2xl font-bold text-cyan-400 mb-1">{milestone.year}</p>
                    <h3 className="text-lg font-semibold text-white">{milestone.title}</h3>
                    <p className="text-sm text-gray-400 mt-2">{milestone.description}</p>
                  </div>
                </div>
              </div>
              {/* The dot on the timeline */}
              <div className="absolute left-1/2 w-4 h-4 bg-cyan-400 rounded-full border-4 border-gray-900 transform -translate-x-1/2"></div>
            </div>
          ))}
        </div>

        {/*
          HORIZONTAL TIMELINE (for large screens)
          - Uses `hidden lg:block` to only show on large screens.
        */}
        <div className="hidden lg:block">
          {/* The horizontal line */}
          <div className="absolute top-1/2 left-0 w-full h-0.5 bg-gray-600 transform -translate-y-1/2">
             {/* The animated part of the line */}
            <div className="h-full bg-cyan-400 transition-all duration-[4000ms]" style={{ width: isTimelineVisible ? '100%' : '0%' }}></div>
          </div>
          <div className="flex justify-between items-start w-full">
            {milestones.map((milestone, index) => (
              <div
                key={index}
                className="group relative flex-1 px-4 transition-all duration-700 opacity-0 transform translate-y-8"
                style={{ transitionDelay: `${index * 300}ms` }}
              >
                <div className={`flex items-center justify-center ${index % 2 === 0 ? 'flex-col-reverse' : 'flex-col'}`}>
                  {/* Card with image and text */}
                  <div className={`p-4 bg-gray-800 rounded-lg shadow-md border border-gray-700 w-64 text-center ${index % 2 === 0 ? 'mt-8' : 'mb-8'}`}>
                    <img src={milestone.image} alt={milestone.title} className="rounded-md shadow-lg w-full h-32 object-cover mb-3" />
                    <p className="text-2xl font-bold text-cyan-400">{milestone.year}</p>
                    <h3 className="text-lg font-semibold text-white">{milestone.title}</h3>
                    <p className="text-sm text-gray-400 mt-1">{milestone.description}</p>
                  </div>
                  {/* The dot on the timeline */}
                  <div className="absolute top-1/2 w-4 h-4 bg-cyan-400 rounded-full border-4 border-gray-900 transform -translate-y-1/2 transition-transform duration-300 group-hover:scale-125"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};