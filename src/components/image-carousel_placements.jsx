import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

export function ImageCarousel({ images, bgColor, borderColor }) {
  const [currentIndex, setCurrentIndex] = useState(0);

  const goToPrevious = () => {
    setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const goToNext = () => {
    setCurrentIndex((prev) => (prev + 1) % images.length);
  };

  if (images.length === 0) {
    return (
      <div
        className="rounded-2xl border h-72 flex items-center justify-center bg-black"
        style={{ borderColor }}
      >
        <p className="text-white/60">No images available</p>
      </div>
    );
  }

  return (
    <div
      className="relative rounded-2xl border h-72 overflow-hidden group bg-black"
      style={{ borderColor }}
    >
      <div className="relative w-full h-full flex items-center justify-center px-8">
        <div className="relative w-full h-full max-w-sm flex items-center justify-center">
          {images.map((image, index) => (
            <img
              key={index}
              src={image || "/placeholder.svg"}
              alt={`Carousel image ${index + 1}`}
              className={`absolute h-full object-contain rounded-4xl transition-opacity duration-500 ${
                index === currentIndex ? "opacity-100" : "opacity-0"
              }`}
            />
          ))}
        </div>
      </div>

      {images.length > 1 && (
        <>
          <button
            onClick={goToPrevious}
            className="absolute left-3 top-1/2 transform -translate-y-1/2 z-10 bg-white/20 hover:bg-white/40 text-white p-2 rounded-full transition-all duration-300"
            aria-label="Previous image"
          >
            <ChevronLeft size={20} />
          </button>

          <button
            onClick={goToNext}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 z-10 bg-white/20 hover:bg-white/40 text-white p-2 rounded-full transition-all duration-300"
            aria-label="Next image"
          >
            <ChevronRight size={20} />
          </button>

          <div className="absolute bottom-3 left-1/2 transform -translate-x-1/2 z-10 flex gap-2">
            {images.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={`w-2 h-2 rounded-full transition-all duration-300 ${
                  index === currentIndex
                    ? "bg-white w-6"
                    : "bg-white/40 hover:bg-white/60"
                }`}
                aria-label={`Go to image ${index + 1}`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
