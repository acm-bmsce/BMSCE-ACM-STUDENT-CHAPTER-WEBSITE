import React from "react";
import { motion } from "framer-motion";

const images = [
    { id: 1, src: "https://picsum.photos/id/1011/800/1200", alt: "Modern concrete building" },
    { id: 2, src: "https://picsum.photos/id/1015/800/1000", alt: "Minimal house with striped awning" },
    { id: 3, src: "https://picsum.photos/id/1025/800/1100", alt: "Lake house in the fog" },
    { id: 4, src: "https://picsum.photos/id/1035/800/950", alt: "Architectural symmetry" },
    { id: 5, src: "https://picsum.photos/id/1040/800/1300", alt: "Seaside villa with pool" },
    { id: 6, src: "https://picsum.photos/id/1051/800/900", alt: "Dome building at dusk" },
    { id: 7, src: "https://picsum.photos/id/1065/800/1150", alt: "Modern gallery interior" },
    { id: 8, src: "https://picsum.photos/id/1074/800/1000", alt: "Contemporary home exterior" },
    { id: 9, src: "https://picsum.photos/id/1084/800/950", alt: "Ocean villa" },
];

export default function ImageGrid({ setIsGridView }) {
    return (
        <div className="min-h-screen px-10 py-12 bg-neutral-100">
            {/* Header */}
            <div className="flex items-center justify-between mb-10">
                <h2 className="text-3xl font-bold tracking-tight">All Pieces</h2>
                <button
                    onClick={() => setIsGridView(false)}
                    className="px-4 py-2 rounded-full bg-black text-white text-sm font-semibold shadow hover:scale-105 transition"
                >
                    BACK
                </button>
            </div>

            {/* 3-column Masonry Grid */}
            <motion.div
                layout
                className="
          grid 
          grid-cols-1 
          sm:grid-cols-2 
          lg:grid-cols-3 
          gap-8 
          auto-rows-[300px]
          max-w-7xl
          mx-auto
        "
            >
                {images.map((img, i) => (
                    <motion.div
                        key={img.id}
                        layout
                        whileHover={{ scale: 1.03 }}
                        transition={{ type: "spring", stiffness: 220, damping: 22 }}
                        className={`relative rounded-2xl overflow-hidden shadow-md hover:shadow-xl 
              ${i % 4 === 0 ? "row-span-2" : ""}
            `}
                    >
                        <img
                            src={img.src}
                            alt={img.alt}
                            className="w-full h-full object-cover rounded-2xl"
                            draggable={false}
                        />
                    </motion.div>
                ))}
            </motion.div>
        </div>
    );
}
