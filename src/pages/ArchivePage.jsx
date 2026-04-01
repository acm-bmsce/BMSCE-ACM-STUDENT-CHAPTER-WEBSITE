import React, { useState, useEffect, useMemo } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  Calendar,
  MapPin,
  ArrowLeft,
  Loader2,
  X,
  ExternalLink,
  Clock,
  Users,
  ChevronDown,
  ChevronUp,
  Camera,
  Maximize,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import eventService from "../api/eventService";

const ExpandableText = ({ text }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const maxLength = 250;
  if (!text) return null;
  const isLong = text.length > maxLength;

  return (
    <div className="shrink-0 min-w-0 mb-8">
      <h4 className="text-white font-bebas-neue text-2xl mb-4 tracking-wide uppercase">
        About The Event
      </h4>
      <p className="text-gray-400 text-sm md:text-base leading-loose font-general whitespace-pre-wrap break-words">
        {isExpanded || !isLong ? text : `${text.slice(0, maxLength)}...`}
      </p>
      {isLong && (
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="mt-4 flex items-center gap-1.5 text-[#7DD4EF] text-[10px] font-bold uppercase tracking-widest hover:text-white transition-colors"
        >
          {isExpanded ? (
            <>
              View Less <ChevronUp size={12} />
            </>
          ) : (
            <>
              View More <ChevronDown size={12} />
            </>
          )}
        </button>
      )}
    </div>
  );
};

export default function ArchivePage() {
  const [allPastEvents, setAllPastEvents] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [fetchStatus, setFetchStatus] = useState("loading");
  const [isSyncing, setIsSyncing] = useState(true);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [fullscreenIdx, setFullscreenIdx] = useState(null);

  useEffect(() => {
    let isMounted = true;
    const fetchProgressively = async () => {
      try {
        let skip = 0;
        const limit = 9;
        while (isMounted) {
          const res = await eventService.getEvents(limit, skip);
          const rawData = res.data?.events || res.data?.data || res.data;
          const data = Array.isArray(rawData) ? rawData : [];
          if (data.length === 0) {
            setIsSyncing(false);
            break;
          }
          const today = new Date();
          const pastBatch = data
            .map((ev) => ({
              ...ev,
              parsedDate: new Date(ev.date || ev.startDate || Date.now()),
              tag: ev.tag || ev.categories?.[0] || "Past Event",
            }))
            .filter((ev) => ev.parsedDate < today);

          setAllPastEvents((prev) => {
            const combined = [...prev, ...pastBatch];
            return Array.from(
              new Map(
                combined.map((item) => [item._id || item.id, item]),
              ).values(),
            ).sort((a, b) => b.parsedDate - a.parsedDate);
          });
          setFetchStatus("success");
          skip += limit;
          if (data.length < limit) {
            setIsSyncing(false);
            break;
          }
        }
      } catch (e) {
        if (isMounted) setFetchStatus("error");
      }
    };
    fetchProgressively();
    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    if (selectedEvent || fullscreenIdx !== null) {
      document.body.style.overflow = "hidden";
      document.body.style.height = "100vh";
    } else {
      document.body.style.overflow = "unset";
      document.body.style.height = "auto";
    }
  }, [selectedEvent, fullscreenIdx]);

  const filteredEvents = useMemo(() => {
    return allPastEvents.filter((ev) =>
      ev.title.toLowerCase().includes(searchQuery.toLowerCase()),
    );
  }, [searchQuery, allPastEvents]);

  const galleryPhotos =
    selectedEvent?.gallery ||
    selectedEvent?.images ||
    selectedEvent?.photos ||
    [];

  return (
    <main className="min-h-screen bg-[#030303] pt-32 pb-20 px-6 font-general text-white">
      <div className="fixed inset-0 z-0 pointer-events-none bg-[radial-gradient(circle_at_20%_20%,_rgba(125,212,239,0.05)_0%,_transparent_50%)]" />

      <div className="max-w-7xl mx-auto relative z-10">
        <header className="mb-16">
          <button
            onClick={() => window.history.back()}
            className="flex items-center gap-2 text-gray-500 hover:text-[#7DD4EF] transition-colors mb-8 uppercase text-[10px] font-bold tracking-widest"
          >
            <ArrowLeft size={14} /> Back to Events
          </button>
          <h1 className="text-6xl md:text-9xl font-normal font-bebas-neue uppercase tracking-tighter">
            Past{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-gray-500 to-gray-800">
              Events
            </span>
          </h1>
          <div className="mt-4 flex items-center gap-4 text-gray-500 text-xs uppercase tracking-widest font-bold">
            {fetchStatus === "success"
              ? `History Archive / ${allPastEvents.length} Nodes`
              : "Initializing Systems..."}
            {isSyncing && (
              <Loader2 size={12} className="animate-spin text-[#7DD4EF]" />
            )}
          </div>
        </header>

        <div className="mb-12 relative w-full md:w-[450px]">
          <Search
            className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-600"
            size={18}
          />
          <input
            type="text"
            placeholder="Search parameters..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-white outline-none focus:border-[#7DD4EF]/40 transition-all placeholder:text-gray-700"
          />
        </div>

        {fetchStatus === "loading" ? (
          <div className="py-40 flex flex-col items-center gap-4">
            <Loader2 className="animate-spin text-[#7DD4EF]" size={32} />
            <p className="text-[#7DD4EF] text-[10px] font-bold tracking-widest uppercase">
              Fetching Data...
            </p>
          </div>
        ) : filteredEvents.length === 0 ? (
          <div className="py-32 text-center border border-dashed border-white/10 rounded-3xl text-gray-600 uppercase text-xs font-bold tracking-widest">
            No entries match query
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            {filteredEvents.map((ev) => (
              <div
                key={ev._id || ev.id}
                onClick={() => setSelectedEvent(ev)}
                className="group bg-[#0A0A0A] border border-white/10 rounded-3xl overflow-hidden hover:border-[#7DD4EF]/40 transition-all duration-500 cursor-pointer"
              >
                
                <div className="h-56 overflow-hidden relative isolate" style={{ WebkitMaskImage: '-webkit-radial-gradient(white, black)' }}>
                  <img
                    src={
                      ev.imageUrl ||
                      ev.image ||
                      "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4"
                    }
                    loading="lazy"
                    className="w-full h-full object-cover grayscale-0 group-hover:grayscale transition-all duration-700 group-hover:scale-105"
                    alt={ev.title}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0A] to-transparent opacity-60" />
                </div>
                <div className="p-8">
                  <div className="flex justify-between mb-4">
                    <span className="text-[#7DD4EF] text-[9px] font-black uppercase tracking-widest border border-[#7DD4EF]/20 bg-[#7DD4EF]/5 px-3 py-1 rounded-md">
                      {ev.tag}
                    </span>
                    <span className="text-gray-600 text-[10px] font-bold">
                      {ev.parsedDate.getFullYear()}
                    </span>
                  </div>
                  <h3 className="text-3xl font-bebas-neue text-white mb-3 group-hover:text-[#7DD4EF] transition-colors">
                    {ev.title}
                  </h3>
                  <p className="text-gray-500 text-sm leading-relaxed line-clamp-2 font-general">
                    {ev.description}
                  </p>
                </div>
              </div>
            ))}
          </motion.div>
        )}
      </div>

      {typeof document !== "undefined" &&
        createPortal(
          <AnimatePresence>
            {selectedEvent && (
              <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 md:p-12 overflow-hidden">
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  onClick={() => setSelectedEvent(null)}
                  className="absolute inset-0 bg-black/95 backdrop-blur-sm"
                />

                <motion.div
                  initial={{ opacity: 0, y: 20, scale: 0.98 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 20, scale: 0.98 }}
                  onClick={(e) => e.stopPropagation()}
                  className="relative w-full max-w-5xl bg-[#0A0A0A] border border-white/10 rounded-[32px] overflow-hidden flex flex-col md:flex-row h-full max-h-[85vh] z-10 shadow-2xl"
                >
                  <button
                    onClick={() => setSelectedEvent(null)}
                    className="absolute top-6 right-6 z-50 p-2 bg-black/50 text-white rounded-full border border-white/10 hover:bg-[#7DD4EF] hover:text-black transition-all"
                  >
                    <X size={20} />
                  </button>

                  <div className="md:w-2/5 h-48 md:h-full relative shrink-0 bg-[#070707] border-b md:border-b-0 md:border-r border-white/5">
                    <img
                      src={selectedEvent.imageUrl || selectedEvent.image}
                      className="w-full h-full object-cover"
                      alt={selectedEvent.title}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t md:bg-gradient-to-r from-[#0A0A0A] via-transparent to-transparent opacity-90" />
                  </div>

                  <div
                    className="flex-1 overflow-y-auto custom-scrollbar flex flex-col"
                    onWheel={(e) => e.stopPropagation()}
                  >
                    <div className="p-8 md:p-12">
                      <div className="mb-8">
                        <span className="text-[#7DD4EF] text-[10px] font-bold uppercase tracking-[0.3em]">
                          {selectedEvent.tag}
                        </span>
                        <h2 className="text-5xl md:text-7xl font-bebas-neue uppercase text-white mt-2 leading-[0.95]">
                          {selectedEvent.title}
                        </h2>
                      </div>

                      <div className="flex flex-wrap gap-8 mb-10 pb-8 border-b border-white/5 text-gray-400">
                        <div className="flex items-center gap-2">
                          <Calendar size={16} className="text-[#7DD4EF]" />
                          <span className="text-sm">
                            {selectedEvent.parsedDate?.toLocaleDateString(
                              "en-US",
                              {
                                month: "short",
                                day: "numeric",
                                year: "numeric",
                              },
                            )}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <MapPin size={16} className="text-[#7DD4EF]" />
                          <span className="text-sm">
                            {selectedEvent.location || "BMSCE Campus"}
                          </span>
                        </div>
                      </div>

                      <ExpandableText
                        text={
                          selectedEvent.fullDescription ||
                          selectedEvent.description
                        }
                      />

                      {galleryPhotos.length > 0 && (
                        <div className="mb-10">
                          <h4 className="text-white font-bebas-neue text-2xl mb-4 tracking-widest uppercase flex items-center gap-2">
                            <Camera size={20} className="text-[#7DD4EF]" />{" "}
                            Gallery
                          </h4>
                          <div className="flex gap-4 overflow-x-auto pb-4 custom-scrollbar snap-x">
                            {galleryPhotos.map((p, i) => (
                              <div
                                key={i}
                                onClick={() => setFullscreenIdx(i)}
                                className="relative w-48 h-36 shrink-0 rounded-2xl overflow-hidden border border-white/10 cursor-pointer snap-start group bg-black isolate"
                                style={{ WebkitMaskImage: '-webkit-radial-gradient(white, black)' }}
                              >
                                
                                <img
                                  src={p}
                                  className="w-full h-full object-cover grayscale-0 group-hover:grayscale transition-all duration-500 group-hover:scale-110"
                                  alt="Gallery item"
                                />
                                <div className="absolute inset-0 flex items-center justify-center">
                                  <div className="bg-black/60 p-3 rounded-full opacity-0 group-hover:opacity-100 scale-75 group-hover:scale-100 transition-all duration-300 backdrop-blur-sm border border-white/10">
                                    <Maximize
                                      size={18}
                                      className="text-white"
                                    />
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {selectedEvent.speakers && (
                        <div className="mb-10">
                          <h4 className="text-white font-bebas-neue text-2xl mb-4 tracking-widest uppercase flex items-center gap-2">
                            <Users size={20} className="text-[#7DD4EF]" />{" "}
                            Speakers
                          </h4>
                          <p className="text-[#7DD4EF] text-sm font-medium leading-relaxed font-general">
                            {Array.isArray(selectedEvent.speakers)
                              ? selectedEvent.speakers.join(" • ")
                              : selectedEvent.speakers}
                          </p>
                        </div>
                      )}

                      <div className="flex flex-col sm:flex-row gap-4 pt-8 mt-auto border-t border-white/5">
                        {selectedEvent.registrationLink && (
                          <button
                            onClick={() =>
                              window.open(
                                selectedEvent.registrationLink,
                                "_blank",
                              )
                            }
                            className="flex-1 py-4 bg-[#7DD4EF] text-black font-bold uppercase text-xs rounded-2xl hover:bg-white transition-all flex items-center justify-center gap-2"
                          >
                            Confirm Attendance <ExternalLink size={14} />
                          </button>
                        )}
                        <button
                          onClick={() => setSelectedEvent(null)}
                          className="px-8 py-4 border border-white/10 text-white font-bold uppercase text-xs rounded-2xl hover:bg-white/5 transition-all"
                        >
                          Close
                        </button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              </div>
            )}
          </AnimatePresence>,
          document.body,
        )}

      {fullscreenIdx !== null && (
        <div className="fixed inset-0 z-[20000] flex items-center justify-center bg-black text-white">
          <div
            onClick={() => setFullscreenIdx(null)}
            className="absolute inset-0"
          />
          <div className="absolute top-6 right-6 z-[20002] flex items-center gap-3">
            <span className="text-xs px-3 py-2 bg-white/10 rounded-lg backdrop-blur">
              {fullscreenIdx + 1} / {galleryPhotos.length}
            </span>
            <button
              onClick={() => setFullscreenIdx(null)}
              className="p-2 bg-white/10 rounded-full hover:bg-white/20"
            >
              <X size={18} />
            </button>
          </div>
          <div className="relative z-[20001] flex items-center justify-center w-full h-full pointer-events-none">
            <img
              src={galleryPhotos[fullscreenIdx]}
              className="max-w-[95vw] max-h-[90vh] object-contain pointer-events-auto"
            />
          </div>
          {galleryPhotos.length > 1 && (
            <>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setFullscreenIdx((prev) =>
                    prev > 0 ? prev - 1 : galleryPhotos.length - 1,
                  );
                }}
                className="absolute left-6 top-1/2 -translate-y-1/2 z-[20002] p-3 bg-white/10 rounded-full hover:bg-white/20"
              >
                <ChevronLeft size={24} />
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setFullscreenIdx((prev) =>
                    prev < galleryPhotos.length - 1 ? prev + 1 : 0,
                  );
                }}
                className="absolute right-6 top-1/2 -translate-y-1/2 z-[20002] p-3 bg-white/10 rounded-full hover:bg-white/20"
              >
                <ChevronRight size={24} />
              </button>
            </>
          )}
        </div>
      )}
      <style
        dangerouslySetInnerHTML={{
          __html: `
        .custom-scrollbar::-webkit-scrollbar { width: 4px; height: 4px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(125,212,239,0.3); border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: rgba(125,212,239,0.5); }
      `,
        }}
      />
    </main>
  );
}