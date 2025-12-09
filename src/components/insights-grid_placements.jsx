import { InsightProfileCard } from "./insight-profile-card_placements"

export function InsightsGrid({ insights }) {
  const displayedInsights = insights.slice(0, 7)

  return (
    <div className="w-full">
      {/* First row - 3 items */}
      <div className="grid grid-cols-3 gap-12 max-w-7xl mx-auto mb-12">
        {displayedInsights.slice(0, 3).map((insight) => (
          <InsightProfileCard
            key={insight.id}
            image={insight.image}
            name={insight.name}
            job={insight.job}
            company={insight.company}
            link={insight.link}
            year={insight.year}
            description={insight.description}
          />
        ))}
      </div>

      {/* Second row - 3 items */}
      {displayedInsights.length > 3 && (
        <div className="grid grid-cols-3 gap-12 max-w-7xl mx-auto mb-12">
          {displayedInsights.slice(3, 6).map((insight) => (
            <InsightProfileCard
              key={insight.id}
              image={insight.image}
              name={insight.name}
              job={insight.job}
              company={insight.company}
              link={insight.link}
              year={insight.year}
              description={insight.description}
            />
          ))}
        </div>
      )}

      {/* Third row - 1 item centered */}
      {displayedInsights.length > 6 && (
        <div className="flex justify-center max-w-7xl mx-auto">
          {displayedInsights.slice(6, 7).map((insight) => (
            <div key={insight.id} className="w-1/3">
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
      )}
    </div>
  )
}
