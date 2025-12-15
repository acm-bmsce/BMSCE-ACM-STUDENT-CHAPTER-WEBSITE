import React, { useRef, useState, useEffect } from "react";
import { Swiper, SwiperSlide, useSwiperSlide } from "swiper/react";
import "swiper/css";
import { BsArrowLeft, BsArrowRight } from "react-icons/bs";
import { motion, AnimatePresence } from "framer-motion";

// ❌ DELETED: import eventData from "./Data2_event"; 
// ❌ DELETED: import eventDataDesktop from "./Data2_events_desktop";

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
                rotateY: isActive ? 0 : slide.isPrev ? 8 : -8,
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
            {/* Image */}
            <img
                src={src}
                alt={alt}
                className="w-full h-full object-cover pointer-events-none"
            />

            {/* Hover Overlay */}
            <div className="hidden md:flex absolute inset-0 bg-black/50 items-center justify-center text-white text-2xl font-semibold opacity-0 group-hover:opacity-100 transition">
                View Details
            </div>

            {/* Bottom Title Overlay */}
            <div className="absolute bottom-0 left-0 w-full bg-black/60 py-3 flex justify-center">
                <p
                    className={`text-white text-lg font-bold text-center transition-opacity duration-300 ${isActive ? "opacity-100" : "opacity-80"
                        }`}
                >
                    {title}
                </p>
            </div>
        </motion.div>
    );
}




// ---------------------------------------------------
// Main Carousel Component
// ---------------------------------------------------
// 1. Accept 'events' as a prop
export default function ImageCarousel({ events }) {
    const swiperRef = useRef(null);
    const [swiperReady, setSwiperReady] = useState(false);

    const [isMobile, setIsMobile] = useState(false);
    const [popup, setPopup] = useState(null);

    // ⭐ Tabs inside popup
    const [popupTab, setPopupTab] = useState("Overview");

    // ⭐ Fullscreen image viewer
    const [fullImg, setFullImg] = useState(null);

    const [atStart, setAtStart] = useState(true);
    const [atEnd, setAtEnd] = useState(false);



    // Detect screen size
    useEffect(() => {
        const check = () => setIsMobile(window.innerWidth < 768);
        check();
        window.addEventListener("resize", check);
        return () => window.removeEventListener("resize", check);
    }, []);

    // 2. Safety Check: If no events, show empty state
    if (!events || events.length === 0) {
        return <div className="text-white text-center py-10 opacity-50">No Past Events Found</div>;
    }

    // 3. Use the dynamic 'events' prop for data
    const activeData = events;

    // Arrow controls
    const prev = () => swiperRef.current?.slidePrev(300);
    const next = () => swiperRef.current?.slideNext(300);

    return (
        <div className="relative w-full flex flex-col items-center">

            {/* -----------------------------------
                SWIPER
            ----------------------------------- */}
            <Swiper
                onSwiper={(swiper) => {
                    swiperRef.current = swiper;
                    setSwiperReady(true);

                    // initial state
                    setAtStart(swiper.progress <= 0.01);
                    setAtEnd(swiper.progress >= 0.99);
                }}
                onProgress={(swiper) => {
                    setAtStart(swiper.progress <= 0.01);
                    setAtEnd(swiper.progress >= 0.99);
                }}
                slidesPerView="auto"
                centeredSlides
                spaceBetween={40}
                grabCursor
                loop={false}
                className="w-full py-10"
            >


                {/* 4. Map over the dynamic activeData */}
                {activeData.map((item) => (
                    <SwiperSlide
                        key={item.id || item._id} // Handle Mongo ID or manual ID
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
            {!atStart && (
                <button
                    onClick={prev}
                    disabled={!swiperReady}
                    className="absolute z-20 left-1/2 -translate-x-[300px] top-1/2 -translate-y-1/2 bg-white p-4 rounded-full shadow"
                >
                    <BsArrowLeft size={20} />
                </button>
            )}

            {!atEnd && (
                <button
                    onClick={next}
                    disabled={!swiperReady}
                    className="absolute z-20 right-1/2 translate-x-[300px] top-1/2 -translate-y-1/2 bg-white p-4 rounded-full shadow"
                >
                    <BsArrowRight size={20} />
                </button>
            )}


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
                        <div className="relative bg-white rounded-2xl w-full max-w-[450px] md:max-w-[750px] lg:max-w-[900px] h-[85vh] overflow-hidden shadow-xl flex flex-col">

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

                            {/* 🔥 BLACK GRADIENT OVERLAY */}
                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />

                            {/* TEXT */}
                            <div className="absolute bottom-4 left-4 z-10 text-white">
                                <h2 className="text-2xl font-bold">
                                {popup.title}
                                </h2>
                                <p className="text-sm opacity-90">
                                {new Date(popup.date).toLocaleDateString()}
                                </p>
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
                                        {popup.gallery && popup.gallery.length > 0 ? (
                                            popup.gallery.map((img, i) => (
                                                <img
                                                    key={i}
                                                    src={img}
                                                    alt="gallery"
                                                    onClick={() => setFullImg(img)}
                                                    className="w-full aspect-video object-contain bg-black/5 rounded-md cursor-pointer hover:opacity-80 transition"
                                                />
                                            ))
                                        ) : (
                                            <div className="col-span-2 text-center text-gray-400 mt-10">No Gallery Images</div>
                                        )}
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
                                            <p>{popup.outcomes || "No outcomes listed."}</p>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* 🖼️ FULLSCREEN IMAGE VIEWER */}
            <AnimatePresence>
                {fullImg && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.25 }}
                        className="fixed inset-0 z-[99999] bg-black/80 flex items-center justify-center p-4"
                    >
                        <div className="relative">
                            <button
                                onClick={() => setFullImg(null)}
                                className="absolute top-3 right-3 text-white text-2xl bg-black/50 w-9 h-9 flex items-center justify-center rounded-full backdrop-blur-md hover:bg-black/70 transition"
                            >
                                ×
                            </button>
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