import { InsightProfileCard } from "./insight-profile-card_placements";

export function InsightsGrid({ insights, onViewProfile }) {
  return (
    <div className="w-full px-4 sm:px-6 lg:px-8 ">
      {/* Responsive grid layout */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 lg:gap-12 max-w-7xl mx-auto">
        {insights.map((insight) => (
          <div
            key={insight.id}
          >
            <InsightProfileCard
              image={insight.image}
              name={insight.name}
              job={insight.job}
              company={insight.company}
              link={insight.link}
              year={insight.year}
              description={insight.description}
              onViewProfile={onViewProfile} // Pass the handler down to the card
            />
          </div>
        ))}
      </div>
    </div>
  );
}