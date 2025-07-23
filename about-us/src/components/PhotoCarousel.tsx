import React, { useState, useEffect } from 'react';
// REMOVED: ChevronLeft and ChevronRight are no longer needed
// import { ChevronLeft, ChevronRight } from 'lucide-react';

interface PhotoCarouselProps {
  images: string[];
  autoPlay?: boolean;
  interval?: number;
}

export const PhotoCarousel: React.FC<PhotoCarouselProps> = ({
  images,
  autoPlay = true,
  interval = 3000,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    // NOTE: The carousel will now only change via autoplay or by re-enabling some form of navigation.
    if (autoPlay && images.length > 1 && !isHovered) {
      const timer = setInterval(() => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
      }, interval);

      return () => clearInterval(timer);
    }
  }, [autoPlay, interval, images.length, isHovered, currentIndex]);

  // These functions are no longer called by buttons, but could be used by other interactions in the future.
  // const goToPrevious = () => {
  //   setCurrentIndex((prevIndex) =>
  //     prevIndex === 0 ? images.length - 1 : prevIndex - 1
  //   );
  // };

  // const goToNext = () => {
  //   setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
  // };

  if (images.length === 0) {
    return (
      <div className="relative w-full h-80 bg-acm-black/50 rounded-lg flex items-center justify-center">
        <p className="font-bricolage text-acm-white/60">No images available</p>
      </div>
    );
  }

  return (
    <div
      className="relative w-full h-80 rounded-lg group overflow-hidden"
      style={{ perspective: '1000px' }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div
        className="relative w-full h-full"
        style={{ transformStyle: 'preserve-3d' }}
      >
        {images.map((image, index) => {
          const offset = index - currentIndex;
          const isCurrent = offset === 0;
          const isPrevious = offset === -1 || (currentIndex === 0 && index === images.length - 1);
          const isNext = offset === 1 || (currentIndex === images.length - 1 && index === 0);

          const transform = isCurrent
            ? 'rotateY(0) translateZ(0) scale(1)'
            : isPrevious
            ? 'rotateY(25deg) translateX(-75%) scale(0.9)'
            : isNext
            ? 'rotateY(-25deg) translateX(75%) scale(0.9)'
            : 'scale(0.8)';

          const opacity = isCurrent ? 'opacity-100' : 'opacity-40';
          const zIndex = isCurrent ? images.length : images.length - 1;

          return (
            <div
              key={index}
              className="min-w-[70%] h-[90%] absolute top-[5%] left-[15%] transition-all duration-500 ease-in-out"
              style={{
                transform,
                zIndex,
                visibility: (isCurrent || isPrevious || isNext) ? 'visible' : 'hidden',
              }}
            >
              <img
                src={image}
                alt={`Gallery image ${index + 1}`}
                className={`w-full h-full object-cover rounded-lg transition-opacity duration-500 ${opacity}`}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-acm-black/60 via-transparent to-acm-black/40 rounded-lg"></div>
            </div>
          );
        })}
      </div>

      {/* REMOVED: Navigation Buttons */}
      {/* The <button> elements for previous and next have been deleted. */}

      {/* REMOVED: Dots Indicator */}
      {/* The div that mapped over images to create dot indicators has been deleted. */}
      
      {/* MODIFIED: Image Counter made smaller */}
      <div className="absolute top-3 right-3 bg-acm-black/70 text-acm-white px-2 py-0.5 rounded-full text-xs font-bricolage z-50">
        {currentIndex + 1} / {images.length}
      </div>
    </div>
  );
};