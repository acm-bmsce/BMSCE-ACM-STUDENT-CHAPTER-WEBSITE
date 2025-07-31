import React from "react";
import { cn } from "./lib/utils_event";

export const EventNav = ({ activeTab, onTabChange, upcomingCount, pastCount }) => {
  const tabs = [
    { id: "past", label: "Past Events", count: pastCount },
    { id: "upcoming", label: "Upcoming Events", count: upcomingCount }
  ];

  return (
    <div className="max-w-7xl mx-auto px-6 py-6">
      <div className="bg-event-nav rounded-lg p-2 border border-event-card-border shadow-card">
        <div className="grid grid-cols-2 gap-2">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={cn(
                "relative px-6 py-3 rounded-md font-medium transition-all duration-300",
                "hover:bg-event-card hover:shadow-glow",
                activeTab === tab.id
                  ? "bg-primary text-primary-foreground shadow-glow"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              <div className="flex items-center justify-center gap-2">
                <span>{tab.label}</span>
                <span
                  className={cn(
                    "text-xs px-2 py-1 rounded-full",
                    activeTab === tab.id
                      ? "bg-primary-foreground/20 text-primary-foreground"
                      : "bg-muted text-muted-foreground"
                  )}
                >
                  {tab.count}
                </span>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
