import React from "react";
import { InsightProfileCard } from "./insight-profile-card_placements";

export function InsightsGrid({ insights }) {
  const displayedInsights = insights.slice(0, 7);

  return (
    <div className="w-full px-4 sm:px-6 lg:px-8 ">
      {/* Responsive grid layout */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 lg:gap-12 max-w-7xl mx-auto">
        {displayedInsights.map((insight) => (
          <div
            key={insight.id}
            className={`
              ${displayedInsights.length > 6 &&
                displayedInsights.indexOf(insight) === 6
                ? "sm:col-span-2 lg:col-span-1 lg:col-start-2"
                : ""
              }
            `}
          >
            <InsightProfileCard
              image={insight.image}
              name={insight.name}
              job={insight.job}
              company={insight.company}
              link={insight.link}
              year={insight.year}
              description={insight.description}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
