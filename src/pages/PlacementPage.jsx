import { DaysCard } from "../components/days-card_placements";
import { ImageCarousel } from "../components/image-carousel_placements";
import { InsightsGrid } from "../components/insights-grid_placements";

export default function PlacementPage() {
  const insightsData = [
    {
      id: 7,
      image: "/images/insight-7.png",
      name: "M Naga Rajesh",
      job: "Associate Software Engineer",
      company: "Aclie",
      link: "https://www.instagram.com/p/DMPwRPET5FR/",
      year: "Class of 2020",
      description:
        "Success driven by 6 months of disciplined LeetCode/core CS prep. Fight back stronger after any rejections.",
    },
    {
      id: 2,
      image: "/images/insight-2.png",
      name: "Manumohan A J V",
      job: "Analyst",
      company: "Deloitte",
      link: "https://www.instagram.com/p/DM0Lz_xTEUv/",
      year: "Class of 2020",
      description:
        "6 months of LeetCode and Google Cloud certifications. Stay positive and dedicated to coding practice.",
    },
    {
      id: 3,
      image: "/images/insight-3.png",
      name: "Adithi Grao",
      job: "Industrial Engineer",
      company: "Andisk",
      link: "https://www.instagram.com/p/DNLY_pQsiT1/",
      year: "Class of 2020",
      description:
        "Rejected 10 times, but never gave up. Focus on technical basics and mock interviews.",
    },
    {
      id: 4,
      image: "/images/insight-4.png",
      name: "Ankith L",
      job: "Software Engineer",
      company: "Confluent",
      link: "https://www.instagram.com/p/DMFkjl6zknm/",
      year: "Class of 2020",
      description:
        "Achieved success through two years of consistent DSA practice. Stay consistent and revise core subjects.",
    },
    {
      id: 5,
      image: "/images/insight-5.png",
      name: "Adithya Giri",
      job: "Software Engineer",
      company: "Confluent",
      link: "https://www.instagram.com/p/DMp7RQ7z3l3/",
      year: "Class of 2020",
      description:
        "Prep began in the 3rd year (DSA/competitive coding). Revise core subjects and prepare for rejections.",
    },
    {
      id: 6,
      image: "/images/insight-6.png",
      name: "Chethna Mundra",
      job: "Graduate Analyst",
      company: "Deutsche Bank",
      link: "https://www.instagram.com/p/DMXxMUMMXIz/",
      year: "Class of 2020",
      description:
        "Graduate Analyst role secured with 3 months of DSA/theory prep. Be confident and seek off-campus opportunities.",
    },
    {
      id: 1,
      image: "/images/insight-1.png",
      name: "Aryaman Sharma",
      job: "Masters from",
      company: "Cornell University",
      link: "https://www.instagram.com/p/DMiUiCmscVI/",
      year: "Class of 2020",
      description:
        "MS application required 6 months of early prep (tests/SOPs). Start early because essays are critical.",
    },
  ];

  const carouselImages = [
    "/images/c1.png",
    "/images/c2.png",
    "/images/c3.png",
    "/images/c4.png",
  ];

  return (
    <div className="min-h-screen bg-black text-white overflow-x-hidden">
     

      <main className="relative z-10 max-w-7xl mx-auto px-6 py-20 mt-20">
        <section className="mb-32">
          <h2 className="text-center text-5xl md:text-6xl font-bold mb-16 tracking-widest bebas-neue text-white drop-shadow-sm">
            INSIGHT SERIES
          </h2>

          <InsightsGrid insights={insightsData} />

          <div className="mt-12 max-w-2xl mx-auto text-center">
            <p className="text-white/70 text-base leading-relaxed font-impact">
              The series aims to provide actionable guidance and motivation to
              current students pursuing higher studies or career goals by
              offering direct takeaways from alumni journeys.
            </p>
          </div>
        </section>

        <section className="py-24 border-t border-white/10">
          <h2 className="text-center text-5xl md:text-6xl font-bold mb-16 tracking-widest bebas-neue text-white drop-shadow-lg">
            100 DAYS OF CODE
          </h2>

          <div className="grid gap-6 max-w-6xl mx-auto">
            <div className="grid grid-cols-2 gap-6 auto-rows-max">
              <DaysCard
                type="image"
                imageUrl="/images/poster.jpg"
                bgColor="rgba(125, 212, 238, 0.1)"
                borderColor="#7dd4ee"
                size="tall"
              />

              <div className="row-span-2 flex flex-col gap-6">
                <DaysCard
                  type="content"
                  title="About the Challenge"
                  description="The BMSCE ACM Student Chapter is hosting a 100 Days of Code challenge dedicated to Mastering DSA. This intensive coding period runs from October 30th, 2025, to February 6th, 2026. The goal is consistent daily practice, symbolized by the motto: If you cheat, you are cheating yourself!! The challenge aims to help participants build strong coding habits and achieve Code Consistency."
                  bgColor="rgba(125, 212, 238, 0.15)"
                  borderColor="#7dd4ee"
                  size="medium"
                />

                <ImageCarousel
                  images={carouselImages}
                  bgColor="rgba(125, 212, 238, 0.1)"
                  borderColor="#7dd4ee"
                />
              </div>

              <div className="h-fit">
                <DaysCard
                  type="action"
                  title="Start Your Journey"
                  buttonText="LOG IN"
                  link="https://100daysofcode.pages.dev/"
                  bgColor="rgba(125, 212, 238, 0.12)"
                  borderColor="#7dd4ee"
                  size="wide"
                />
              </div>
            </div>
          </div>
        </section>
      </main>

    </div>
  );
}