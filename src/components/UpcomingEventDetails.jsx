import React from "react";

export default function UpcomingEventDetails({ event, onClose }) {
    return (
        <div className="fixed inset-0 bg-black/60 z-50 flex justify-center items-center">
            <div className="bg-white p-8 rounded-xl w-[90%] max-w-3xl relative">

                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-black text-xl font-bold hover:scale-110 transition"
                >
                    ✕
                </button>

                <h2 className="text-3xl font-bold mb-4">{event.title}</h2>

                <img
                    src={event.image}
                    alt={event.title}
                    className="w-full h-72 object-cover rounded-lg mb-6"
                />

                <p className="text-gray-700 leading-relaxed">
                    {event.description || "Details will be updated soon."}
                </p>
            </div>
        </div>
    );
}
