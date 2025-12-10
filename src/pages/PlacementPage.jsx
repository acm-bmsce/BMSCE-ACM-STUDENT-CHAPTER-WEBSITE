import React, { useState, useEffect } from "react";
import { DaysCard } from "../components/days-card_placements";
import { ImageCarousel } from "../components/image-carousel_placements";
import { InsightsGrid } from "../components/insights-grid_placements";

// API
import placementService from "../api/placementService";

export default function PlacementPage() {
  const [insights, setInsights] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchInsights = async () => {
      try {
        const response = await placementService.getInsights();
        // Map backend fields to frontend component props if names differ
        const mappedData = response.data.map(item => ({
            id: item.id || item._id,
            image: item.image,
            name: item.personName,
            // Backend stores "Role, Company" in description. 
            // If you want to split them:
            job: item.description.split(',')[0], 
            company: item.description.split(',')[1] || "",
            link: item.insta_link,
            year: "Alumni", // Or add this field to DB if needed
            description: "Success story...", // You might want to add a 'quote' field to DB later
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

          {loading ? (
             <div className="text-center text-[#2FA6B8]">Loading Insights...</div>
          ) : (
             <InsightsGrid insights={insights} />
          )}

          <div className="mt-12 max-w-2xl mx-auto text-center">
            <p className="text-white/70 text-base leading-relaxed font-impact">
              The series aims to provide actionable guidance and motivation to
              current students pursuing higher studies or career goals by
              offering direct takeaways from alumni journeys.
            </p>
          </div>
        </section>

        {/* 100 Days of Code Section (Static for now) */}
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
                  description="The BMSCE ACM Student Chapter is hosting a 100 Days of Code challenge dedicated to Mastering DSA..."
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