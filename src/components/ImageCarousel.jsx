import React, { useRef, useState, useEffect } from "react";
import { Swiper, SwiperSlide, useSwiperSlide } from "swiper/react";
import "swiper/css";
import { BsArrowLeft, BsArrowRight } from "react-icons/bs";
import { motion, AnimatePresence } from "framer-motion";

import eventData from "./Data2_event";                 // MOBILE DATA
import eventDataDesktop from "./Data2_events_desktop";  // DESKTOP DATA

// ---------------------------------------------------
// Slide Item Component
// ---------------------------------------------------
function SlideItem({ src, title, alt, onClick }) {
    const slide = useSwiperSlide();
    const isActive = slide.isActive;

    return (
        <motion.div
            layout
            onClick={onClick}
            initial={{ opacity: 0.4, scale: 0.9, rotateY: -8 }}
            animate={{
                opacity: isActive ? 1 : 0.4,
                scale: isActive ? 1 : 0.9,
                rotateY: isActive ? 0 : (slide.isPrev ? 8 : -8),
            }}
            transition={{ duration: 0.7, ease: [0.25, 1, 0.5, 1] }}
            className="relative overflow-hidden group"
            style={{
                width: "900px",
                height: "420px",
                borderRadius: "12px",
                backgroundColor: "#f5f5f5",
                cursor: "pointer",
            }}
        >
            <img
                src={src}
                alt={alt}
                className="w-full h-full object-cover pointer-events-none"
            />

            {/* Hover Title (Desktop Only) */}
            <div className="hidden md:flex absolute inset-0 bg-black/50 items-center justify-center text-white text-2xl font-semibold opacity-0 group-hover:opacity-100 transition active:underline">
                View Details
            </div>


        </motion.div>
    );
}

// ---------------------------------------------------
// Main Carousel Component
// ---------------------------------------------------
export default function ImageCarousel() {
    const swiperRef = useRef(null);
    const [swiperReady, setSwiperReady] = useState(false);

    const [isMobile, setIsMobile] = useState(false);
    const [popup, setPopup] = useState(null);

    // ⭐ Tabs inside popup
    const [popupTab, setPopupTab] = useState("Overview");

    // ⭐ Fullscreen image viewer
    const [fullImg, setFullImg] = useState(null);

    // Detect screen size
    useEffect(() => {
        const check = () => setIsMobile(window.innerWidth < 768);
        check();
        window.addEventListener("resize", check);
        return () => window.removeEventListener("resize", check);
    }, []);

    // Select dataset based on device
    const activeData = isMobile ? eventData : eventDataDesktop;

    // Arrow controls
    const prev = () => swiperRef.current?.slidePrev(300);
    const next = () => swiperRef.current?.slideNext(300);

    return (
        <div className="relative w-full flex flex-col items-center">

            {/* -----------------------------------
                SWIPER
            ----------------------------------- */}
            <Swiper
                onInit={(swiper) => {
                    swiperRef.current = swiper;
                    setSwiperReady(true);
                }}
                slidesPerView="auto"
                centeredSlides
                spaceBetween={40}
                grabCursor
                loop={false}
                className="w-full py-10"
            >
                {activeData.map((item) => (
                    <SwiperSlide
                        key={item.id}
                        style={{ width: "380px", display: "flex", justifyContent: "center" }}
                    >
                        <SlideItem
                            src={item.image}
                            alt={item.title}
                            title={item.title}
                            onClick={() => {
                                setPopup(item);
                                setPopupTab("Overview");
                            }}
                        />
                    </SwiperSlide>
                ))}
            </Swiper>

            {/* -----------------------------------
                ARROWS (fixed)
            ----------------------------------- */}
            <button
                onClick={prev}
                disabled={!swiperReady}
                className="absolute z-20 left-1/2 -translate-x-[300px] top-1/2 -translate-y-1/2 bg-white p-4 rounded-full shadow disabled:opacity-40"
            >
                <BsArrowLeft size={20} />
            </button>

            <button
                onClick={next}
                disabled={!swiperReady}
                className="absolute z-20 right-1/2 translate-x-[300px] top-1/2 -translate-y-1/2 bg-white p-4 rounded-full shadow disabled:opacity-40"
            >
                <BsArrowRight size={20} />
            </button>


            {/* -----------------------------------
                ❤️ POPUP (Mobile + Desktop)
            ----------------------------------- */}
            <AnimatePresence>
                {popup && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        transition={{ duration: 0.25 }}
                        className="fixed inset-0 z-[9999] bg-black/60 flex items-center justify-center px-3"
                    >
                        {/* MODAL */}
                        <div
                            className="
        relative bg-white rounded-2xl 
        w-full 
        max-w-[450px]       
        md:max-w-[750px]    
        lg:max-w-[900px]    
        h-[85vh]             /* 🔥 FIXED HEIGHT */
        overflow-hidden shadow-xl flex flex-col
    "
                        >

                            {/* CLOSE BUTTON */}
                            <button
                                onClick={() => setPopup(null)}
                                className="absolute top-3 right-3 z-20 bg-black/50 text-white w-9 h-9 rounded-full flex items-center justify-center backdrop-blur-md text-lg"
                            >
                                ×
                            </button>

                            {/* BANNER IMAGE */}
                            <div className="w-full h-[180px] relative overflow-hidden">
                                <img
                                    src={popup.image}
                                    alt={popup.title}
                                    className="w-full h-full object-cover"
                                />

                                <div className="absolute bottom-4 left-4 text-white">
                                    <h2 className="text-2xl font-bold drop-shadow-lg">
                                        {popup.title}
                                    </h2>
                                    <p className="text-sm opacity-90">{popup.date}</p>
                                </div>
                            </div>

                            {/* TABS */}
                            <div className="w-full bg-white border-b flex text-sm font-semibold">
                                {["Overview", "Gallery", "Highlights"].map((tab) => (
                                    <button
                                        key={tab}
                                        onClick={() => setPopupTab(tab)}
                                        className={`flex-1 px-4 py-3 text-center ${popupTab === tab
                                            ? "text-blue-600 border-b-2 border-blue-600"
                                            : "text-gray-600"
                                            }`}
                                    >
                                        {tab === "Highlights" ? "Highlights & Outcomes" : tab}
                                    </button>
                                ))}
                            </div>

                            {/* CONTENT AREA */}
                            <div className="flex-1 overflow-y-auto p-4 text-sm leading-relaxed text-gray-800">

                                {/* OVERVIEW TAB */}
                                {popupTab === "Overview" && (
                                    <p className="whitespace-pre-line">{popup.fullDescription}</p>
                                )}

                                {/* GALLERY TAB */}
                                {popupTab === "Gallery" && (
                                    <div className="grid grid-cols-2 gap-3">
                                        {popup.gallery?.map((img, i) => (
                                            <img
                                                key={i}
                                                src={img}
                                                alt="gallery"
                                                onClick={() => setFullImg(img)}
                                                className="w-full h-28 object-cover rounded-md cursor-pointer hover:opacity-80 transition"
                                            />
                                        ))}
                                    </div>
                                )}

                                {/* HIGHLIGHTS TAB */}
                                {popupTab === "Highlights" && (
                                    <div className="space-y-4">
                                        <div>
                                            <h4 className="font-bold">Location</h4>
                                            <p>{popup.location || "Not specified"}</p>
                                        </div>

                                        <div>
                                            <h4 className="font-bold">Attendees</h4>
                                            <p>{popup.attendees}</p>
                                        </div>

                                        <div>
                                            <h4 className="font-bold">Outcome</h4>
                                            <p>{popup.outcomes}</p>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>


            {/* -----------------------------------
                🖼️ FULLSCREEN IMAGE VIEWER
            ----------------------------------- */}
            <AnimatePresence>
                {fullImg && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.25 }}
                        className="fixed inset-0 z-[99999] bg-black/80 flex items-center justify-center p-4"
                    >
                        {/* IMAGE WRAPPER */}
                        <div className="relative">

                            {/* CLOSE BUTTON INSIDE IMAGE */}
                            <button
                                onClick={() => setFullImg(null)}
                                className="absolute top-3 right-3 text-white text-2xl bg-black/50 w-9 h-9 flex items-center justify-center rounded-full backdrop-blur-md hover:bg-black/70 transition"
                            >
                                ×
                            </button>

                            {/* IMAGE */}
                            <img
                                src={fullImg}
                                alt="Full View"
                                className="max-w-[90vw] max-h-[90vh] rounded-xl shadow-2xl object-contain"
                            />
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>



        </div>
    );
}
