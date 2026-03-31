import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const MOCK_FEATURED_EVENTS = [
  {
    id: "demo-1",
    title: "ACM India Chapter Summit 2024",
    date: "October 15, 2024",
    description:
      "Join us for the annual gathering of ACM student and professional chapters across India to network, learn, and grow. This event features keynote speakers from top tech companies, hands-on workshops, and collaborative sessions designed to elevate your chapter's impact.",
    image:
      "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=1600&q=80",
    is_featured: true,
    tags: ["Summit", "Networking"],
  },
  {
    id: "demo-2",
    title: "ACM ROCS 2025",
    date: "February 10, 2025",
    description:
      "The premier Research Symposium focused on the latest advancements in Computer Science and Engineering. Present your papers, get feedback from industry veterans, and discover cutting-edge tech trends.",
    image:
      "https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&w=1600&q=80",
    is_featured: true,
    tags: ["Research", "Symposium"],
  },
  {
    id: "demo-3",
    title: "15 Days of Code",
    date: "March 1, 2025",
    description:
      "An intensive two-week coding boot camp designed to elevate your programming skills and algorithmic thinking. Whether you are a beginner looking to understand the basics or an advanced coder tackling dynamic programming, there is a track for you.",
    image:
      "https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=1600&q=80",
    is_featured: true,
    tags: ["Bootcamp", "Coding"],
  },
];

export default function EventFeaturedSection() {
  const [selectedEvent, setSelectedEvent] = useState(null);
  const closeModal = () => setSelectedEvent(null);

  return (
    <section className="w-full py-12 px-4 md:px-8 bg-black">
      <div className="max-w-7xl mx-auto flex flex-col gap-8">
        <div className="flex items-center justify-between">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-100 tracking-tight font-['Impact'] uppercase">
            <span className="font-normal">FEATURED</span> <span className="font-bold">EVENTS</span>
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {MOCK_FEATURED_EVENTS.map((event) => (
            <div
              key={event.id}
              className="group flex flex-col bg-[#111111] border border-gray-800 rounded-2xl overflow-hidden hover:border-gray-600 transition-all duration-300"
            >
              <div className="relative h-56 w-full overflow-hidden">
                <img
                  src={event.image}
                  alt={event.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-in-out"
                />
                <div className="absolute top-4 left-4 flex gap-2">
                  {event.tags.map((tag, idx) => (
                    <span
                      key={idx}
                      className="px-3 py-1 bg-black/60 backdrop-blur-md text-gray-200 text-xs font-medium rounded-lg"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              <div className="p-6 md:p-8 flex flex-col flex-grow gap-4">
                <span className="text-sm font-semibold text-[#7DD4EF]">{event.date}</span>

                <h3 className="text-xl md:text-2xl font-bold text-gray-100 line-clamp-2">
                  {event.title}
                </h3>

                <p className="text-gray-400 text-sm leading-relaxed line-clamp-3">
                  {event.description}
                </p>

                <div className="mt-auto pt-4">
                  <button
  onClick={() => setSelectedEvent(event)}
  className="w-full md:w-auto px-6 py-3 bg-gray-800 hover:bg-gray-700 text-gray-100 rounded-full text-xs uppercase tracking-[0.3em] font-medium transition-colors duration-200"
>
  View Details
</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <AnimatePresence>
        {selectedEvent && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={closeModal}
              className="absolute inset-0 bg-black/80 backdrop-blur-sm cursor-pointer"
            />

            <motion.div
              initial={{ opacity: 0, y: 40, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.95 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
              className="relative w-full max-w-2xl bg-[#1a1a1a] border border-gray-700 rounded-2xl overflow-hidden shadow-2xl z-10 flex flex-col max-h-[90vh]"
            >
              <button
                onClick={closeModal}
                className="absolute top-4 right-4 z-20 p-2 bg-black/50 hover:bg-black/80 text-white rounded-lg backdrop-blur-md transition-colors"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M18 6 6 18" />
                  <path d="m6 6 12 12" />
                </svg>
              </button>

              <div className="w-full h-64 sm:h-80 relative shrink-0">
                <img
                  src={selectedEvent.image}
                  alt={selectedEvent.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#1a1a1a] to-transparent bottom-0 h-full" />
              </div>

              <div className="p-6 sm:p-8 flex flex-col gap-4 overflow-y-auto">
                <div className="flex flex-wrap gap-2 mb-2">
                  {selectedEvent.tags.map((tag, idx) => (
                    <span
                      key={idx}
                      className="px-3 py-1 bg-gray-800 text-[#7DD4EF] text-xs font-semibold rounded-lg border border-gray-700"
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                <h3 className="text-2xl sm:text-3xl font-bold text-gray-100">
                  {selectedEvent.title}
                </h3>
                <span className="text-sm sm:text-base font-semibold text-[#7DD4EF]">
                  Date: {selectedEvent.date}
                </span>

                <p className="text-gray-300 text-base leading-relaxed mt-2">
                  {selectedEvent.description}
                </p>

                <div className="mt-6 flex flex-wrap gap-4">
                  <button className="px-6 py-3 bg-[#7DD4EF] hover:bg-[#9BE0F4] text-black rounded-lg font-medium transition-colors duration-200">
                    Register Now
                  </button>
                  <button
                    onClick={closeModal}
                    className="px-6 py-3 bg-gray-800 hover:bg-gray-700 text-gray-200 rounded-lg font-medium transition-colors duration-200"
                  >
                    Close
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
}