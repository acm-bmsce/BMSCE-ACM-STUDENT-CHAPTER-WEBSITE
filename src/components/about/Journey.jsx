// src/components/Journey.jsx

import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/all";
import AnimatedTitle from "../AnimatedTitle";

gsap.registerPlugin(ScrollTrigger);

const timelineData = [
  {
    year: "2022",
    title: "Inauguration of BMSCE ACM Student Chapter",
    description:
      "September 30: Officially launched with over 250 attendees, laying the foundation for innovation and collaboration.",
  },
  {
    year: "2022",
    title: "First Technical Event",
    description:
      'July 16: A talk on "AI/ML in Cognitive Science Applications" by Dr. G R Sinha marked our academic debut.',
  },
  {
    year: "2023",
    title: "Hack for Good",
    description:
      "August: A week-long national hackathon in collaboration with TechGig. 98 participants, ₹10,000 prize pool, and free Google Cloud access.",
  },
  {
    year: "2024",
    title: "DSA Mastery Program",
    description:
      "January–February: A month-long course on Data Structures and Algorithms with 33 learners, concluding with an Amazon guest lecture.",
  },
  {
    year: "2023-2025",
    title: "Duo's Dash Series",
    description:
      "Three editions across three years, each with 100+ participants. Creative, AI-powered mini-games testing teamwork and logic.",
  },
  {
    year: "2024",
    title: "ACM India Chapter Summit 2024",
    description:
      "December: Co-hosted with RVCE, BMSCE led this national summit on Sustainable Computing with 350+ attendees.",
  },
  {
    year: "2024",
    title: "National Recognition: Emerging Chapter Award",
    description:
      "Recognized by ACM India for excellence, impact, and engagement across the country.",
  },
  {
    year: "2025 - April",
    title: "ACM Student Town Hall",
    description:
      "Hosted with ACM India, the first Town Hall spotlighted awards, funding, research, and student chapter achievements.",
  },
  {
    year: "2025",
    title: "15 Days of Code",
    description:
      "April–May: Highest participation with 285 students solving coding problems daily. A leaderboard-based competitive coding challenge.",
  },
  {
    year: "2025 - July",
    title: "National Recognition: Most Number of Activities Reported",
    description:
      "Awarded by ACM India for our consistent high level of activity and member engagement.",
  },
];

const Journey = () => {
  const component = useRef(null);

  useGSAP(
    () => {
      const items = gsap.utils.toArray(".timeline-item");
      items.forEach((item) => {
        gsap.from(item, {
          x: item.classList.contains("timeline-item-left") ? -100 : 100,
          opacity: 0,
          duration: 1,
          ease: "power3.out",
          scrollTrigger: {
            trigger: item,
            start: "top 80%",
            toggleActions: "play none none none",
          },
        });
      });
    },
    { scope: component }
  );

  return (
    <section
      ref={component}
      className="relative bg-black text-blue-50 py-32 px-3 md:px-10 overflow-hidden"
    >
      <div className="container mx-auto">
        <AnimatedTitle
          title="Our Journey"
          containerClass="text-center !text-white"
        />
        <div className="relative mt-24">
          {/* The center line */}
          <div className="absolute left-1/2 top-0 h-full w-[2px] bg-white/10 -translate-x-1/2"></div>

          {timelineData.map((event, index) => (
            <div
              key={index}
              className={`timeline-item relative mb-12 flex items-center w-full ${
                index % 2 === 0
                  ? "justify-start timeline-item-left"
                  : "justify-end timeline-item-right"
              }`}
            >
              <div className="w-1/2 px-4 md:px-8">
                <div
                  className={`relative p-6 rounded-lg border border-white/20 shadow-lg overflow-hidden ${
                    index % 2 === 0 ? "text-right" : "text-left"
                  }`}
                >
                  {/* Background Image */}
                  <div
                    className="absolute inset-0 bg-cover bg-center"
                    style={{
                      backgroundImage: "url('/img/card-bg-1.png')", // <-- replace with your image path
                    }}
                  ></div>

                  {/* Glass Overlay */}
                  <div className="absolute inset-0 bg-black/40 backdrop-blur-sm"></div>

                  {/* Content */}
                  <div className="relative z-10">
                    <p className="text-blue-300 font-bebas-neue text-4xl mb-2">
                      {event.year}
                    </p>
                    <h3 className="font-general uppercase text-xl font-bold mb-3 text-white">
                      {event.title}
                    </h3>
                    <p className="text-sm text-blue-50/90">
                      {event.description}
                    </p>
                  </div>
                </div>
              </div>
              {/* The dot on the line */}
              <div className="absolute left-1/2 -translate-x-1/2 z-10 size-4 rounded-full bg-blue-300 border-4 border-black"></div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Journey;
