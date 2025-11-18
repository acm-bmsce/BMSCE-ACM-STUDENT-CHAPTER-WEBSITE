import React from "react";

export default function FunZone() {
    const gameUrl = "https://acmvaultoftrials.pages.dev"; // 👉 replace with your game/riddle URL

    return (
        <section className="flex flex-col items-center w-full py-20">

            <div
                className="relative w-full max-w-6xl h-[380px] rounded-xl overflow-hidden cursor-pointer group"
                onClick={() => window.open(gameUrl, "_blank")}
            >
                <img
                    src="./img/vaultoftrails.jpeg"
                    alt="Play game"
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />

                {/* hover overlay */}
                <div className="absolute inset-0 bg-black/50 flex justify-center items-center opacity-0 group-hover:opacity-100 transition-all duration-500">
                    <button className="bg-white px-8 py-4 text-xl font-semibold rounded-full group-hover:scale-110 transition">
                        PLAY
                    </button>
                </div>
            </div>

            {/* Desktop-only message */}
            <p className="mt-4 text-lg text-gray-400">
                ⚠️ This game can be played on desktop only.
            </p>

        </section>

    );
}
