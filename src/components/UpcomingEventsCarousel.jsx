import React, { useState } from "react";
import UpcomingEventDetails from "./UpcomingEventDetails";

export default function UpcomingEventsCarousel({ upcomingEvents }) {
    const [activeEvent, setActiveEvent] = useState(null);

    if (!upcomingEvents || upcomingEvents.length === 0) {
        return (
            <div className="text-center text-gray-300 py-20 text-2xl">
                No Upcoming Events
            </div>
        );
    }

    return (
        <div className="w-full flex flex-col items-center gap-8">

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                {upcomingEvents.map((event) => (
                    <div
                        key={event.id}
                        onClick={() => setActiveEvent(event)}
                        className="relative cursor-pointer group overflow-hidden rounded-xl"
                        style={{ width: "360px", height: "420px" }}
                    >
                        <img
                            src={event.image}
                            alt={event.title}
                            className="w-full h-full object-cover transition-all duration-500 group-hover:scale-110"
                        />

                        {/* Hover overlay */}
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-all duration-500 flex items-center justify-center text-white text-lg font-semibold">
                            Click here for more details
                        </div>
                    </div>
                ))}
            </div>

            {/* Event details modal */}
            {activeEvent && (
                <UpcomingEventDetails
                    event={activeEvent}
                    onClose={() => setActiveEvent(null)}
                />
            )}
        </div>
    );
}
