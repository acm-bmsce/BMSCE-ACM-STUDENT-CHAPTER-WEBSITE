
import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface PhotoCarouselProps {
  images: string[];
  autoPlay?: boolean;
  interval?: number;
}

export const PhotoCarousel: React.FC<PhotoCarouselProps> = ({ 
  images, 
  autoPlay = true, 
  interval = 3000 
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (autoPlay && images.length > 1) {
      const timer = setInterval(() => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
      }, interval);

      return () => clearInterval(timer);
    }
  }, [autoPlay, interval, images.length]);

  const goToPrevious = () => {
    setCurrentIndex((prevIndex) => 
      prevIndex === 0 ? images.length - 1 : prevIndex - 1
    );
  };

  const goToNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
  };

  if (images.length === 0) {
    return (
      <div className="relative w-full h-80 bg-acm-black/50 rounded-lg flex items-center justify-center">
        <p className="font-bricolage text-acm-white/60">No images available</p>
      </div>
    );
  }

  return (
    <div className="relative w-full h-80 overflow-hidden rounded-lg group">
      {/* Image Container */}
      <div 
        className="flex transition-transform duration-500 ease-in-out h-full"
        style={{ transform: `translateX(-${currentIndex * 100}%)` }}
      >
        {images.map((image, index) => (
          <div key={index} className="min-w-full h-full relative">
            <img
              src={image}
              alt={`Gallery image ${index + 1}`}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-acm-black/50 via-transparent to-acm-black/30"></div>
          </div>
        ))}
      </div>

      {/* Navigation Buttons */}
      {images.length > 1 && (
        <>
          <button
            onClick={goToPrevious}
            className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-acm-black/70 text-acm-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 hover:bg-acm-gold/80"
          >
            <ChevronLeft size={20} />
          </button>
          <button
            onClick={goToNext}
            className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-acm-black/70 text-acm-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 hover:bg-acm-gold/80"
          >
            <ChevronRight size={20} />
          </button>
        </>
      )}

      {/* Dots Indicator */}
      {images.length > 1 && (
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
          {images.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={`w-2 h-2 rounded-full transition-colors duration-300 ${
                index === currentIndex ? 'bg-acm-gold' : 'bg-acm-white/40'
              }`}
            />
          ))}
        </div>
      )}

      {/* Image Counter */}
      <div className="absolute top-4 right-4 bg-acm-black/70 text-acm-white px-3 py-1 rounded-full text-sm font-bricolage">
        {currentIndex + 1} / {images.length}
      </div>
    </div>
  );
};
