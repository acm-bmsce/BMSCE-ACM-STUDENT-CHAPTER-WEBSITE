import React, { useState, useEffect } from "react";
import { DaysCard } from "../components/days-card_placements";
import { ImageCarousel } from "../components/image-carousel_placements";
import { InsightsGrid } from "../components/insights-grid_placements"; // Desktop Grid
import InsightsCarousel from "../components/InsightsCarousel"; // Mobile Carousel
import placementService from "../api/placementService";
import { getOptimizedImageUrl } from "../utils/imageHelper";
import SEO from "../components/SEO";
import AnimatedTitle from "../components/AnimatedTitle";
import { PlacementGuideSection } from "../components/placement-guide-section";

export default function PlacementPage() {
  const [insights, setInsights] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchInsights = async () => {
      try {
        const response = await placementService.getInsights();
        const mappedData = response.data.map((item) => ({
          id: item.id || item._id,
          // Higher quality for mobile carousel (400) vs grid (200)
          image: getOptimizedImageUrl(item.image, 400),
          name: item.personName,
          job: item.description.split(",")[0],
          company: item.description.split(",")[1] || "",
          link: item.insta_link,
          year: item.year ? item.year : "Alumni",
          description: "Check the Instagram Post For More Details",
        }));
        setInsights(mappedData);
      } catch (error) {
        console.error("Error fetching insights", error);
      } finally {
        setLoading(false);
      }
    };

    fetchInsights();
  }, []);

  const carouselImages = [
    "/100DayOfCode/carousel1.webp",
    "/100DayOfCode/carousel2.webp",
    "/100DayOfCode/carousel3.webp",
    "/100DayOfCode/carousel4.webp",
  ];

  return (
    <div className="min-h-screen bg-black text-white overflow-x-hidden">
      <SEO
        title="Placement Insights"
        description="Read success stories and placement insights from ACM BMSCE Alumni."
      />

      <main className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 py-8 md:py-20">
        
        {/* INSIGHT SERIES SECTION */}
        {/* Mobile: reduced margins | Desktop: Original large margins */}
        <section className="mb-16 md:mb-32 mt-4 md:mt-10">
          <AnimatedTitle
            title="Insight Series"
            containerClass="text-center !text-white !mb-0 mt-8 md:mt-20"
          />

          <div className="mb-8 md:mb-10 max-w-2xl mx-auto text-center px-4">
            <p className="max-w-3xl mx-auto text-center font-general text-base md:text-lg text-blue-50/80">
              The series aims to provide actionable guidance and motivation to
              current students pursuing higher studies or career goals by
              offering direct takeaways from alumni journeys.
            </p>
          </div>

          {loading ? (
            <div className="text-center text-[#2FA6B8] animate-pulse">Loading Insights...</div>
          ) : (
            <>
              {/* --- MOBILE VIEW: CAROUSEL --- */}
              <div className="md:hidden">
                <InsightsCarousel insights={insights} />
              </div>

              {/* --- DESKTOP VIEW: GRID --- */}
              <div className="hidden md:block">
                <InsightsGrid insights={insights} />
              </div>
            </>
          )}
        </section>

        {/* PLACEMENT GUIDE SECTION */}
        <section className="mb-16 md:mb-32 pt-8 border-t border-white/10">
          <PlacementGuideSection />
        </section>

        {/* 100 DAYS OF CODE SECTION */}
        <section className="pt-8 md:pt-24 pb-8 md:pb-24 border-t border-white/10">
          <AnimatedTitle
            title="100 Days Of Code"
            containerClass="text-center !text-white !mb-0"
          />

          {/* --- MOBILE LAYOUT (Stacked) --- */}
          <div className="lg:hidden space-y-6 max-w-4xl mx-auto mt-8">
            <div className="w-full">
              <DaysCard
                type="image"
                imageUrl="/100DayOfCode/poster.webp"
                bgColor="rgba(125, 212, 238, 0.1)"
                borderColor="#7dd4ee"
                size="tall"
              />
            </div>

            <div className="w-full">
              <DaysCard
                type="content"
                title="About the Challenge"
                description="The BMSCE ACM Student Chapter is hosting a 100 Days of Code challenge dedicated to Mastering DSA. This intensive coding period runs from October 30th, 2025, to February 6th, 2026. The goal is consistent daily practice, symbolized by the motto: If you cheat, you are cheating yourself!! The challenge aims to help participants build strong coding habits and achieve Code Consistency."
                bgColor="rgba(125, 212, 238, 0.15)"
                borderColor="#7dd4ee"
                size="medium"
              />
            </div>

            <div className="w-full h-56 sm:h-72">
              <ImageCarousel
                images={carouselImages}
                bgColor="rgba(125, 212, 238, 0.1)"
                borderColor="#7dd4ee"
              />
            </div>

            <div className="w-full">
              <DaysCard
                type="action"
                title="Start Your Journey"
                buttonText="LOG IN"
                link="https://100daysofcode.pages.dev/"
                description="*Available for registered users only"
                bgColor="rgba(125, 212, 238, 0.12)"
                borderColor="#7dd4ee"
                size="wide"
              />
            </div>
          </div>

          {/* --- DESKTOP LAYOUT (Grid) - EXACT COPY OF ORIGINAL --- */}
          <div className="hidden lg:block mt-12">
            <div className="max-w-6xl mx-auto">
              <div className="grid grid-cols-2 gap-6 auto-rows-max">
                {/* Left column */}
                <DaysCard
                  type="image"
                  imageUrl="/100DayOfCode/poster.webp"
                  bgColor="rgba(125, 212, 238, 0.1)"
                  borderColor="#7dd4ee"
                  size="tall"
                />

                {/* Right column */}
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

                {/* Bottom row */}
                <div className="h-fit">
                  <DaysCard
                    type="action"
                    title="Start Your Journey"
                    buttonText="LOG IN"
                    link="https://100daysofcode.pages.dev/"
                    description="*Available for registered users only"
                    bgColor="rgba(125, 212, 238, 0.12)"
                    borderColor="#7dd4ee"
                    size="wide"
                  />
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}