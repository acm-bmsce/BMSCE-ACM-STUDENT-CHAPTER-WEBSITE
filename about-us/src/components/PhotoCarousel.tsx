import React, { useState, useEffect } from 'react';

// Define the props for the PhotoCarousel component
interface PhotoCarouselProps {
  images: string[]; // An array of image URLs
  autoPlay?: boolean; // Optional: whether the carousel should play automatically
  interval?: number; // Optional: the time in milliseconds between slides
}

/**
 * A 3D-style photo carousel that automatically cycles through images.
 * Only the center image is visible; others fade out and in.
 * The animation pauses on hover.
 */
export const PhotoCarousel: React.FC<PhotoCarouselProps> = ({
  images,
  autoPlay = true,
  interval = 3000,
}) => {
  // State to track the index of the image currently in the center
  const [currentIndex, setCurrentIndex] = useState(0);
  // State to track if the mouse is hovering over the carousel to pause autoplay
  const [isHovered, setIsHovered] = useState(false);

  // Effect hook to handle the autoplay logic
  useEffect(() => {
    // Start the timer only if autoplay is enabled, there's more than one image, and the carousel is not hovered
    if (autoPlay && images.length > 1 && !isHovered) {
      const timer = setInterval(() => {
        // Increment the index, looping back to the start if at the end
        setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
      }, interval);

      // Cleanup function: clear the timer when the component unmounts or dependencies change
      return () => clearInterval(timer);
    }
  }, [autoPlay, interval, images.length, isHovered, currentIndex]); // Rerun effect if these values change

  // Render a placeholder if no images are provided
  if (images.length === 0) {
    return (
      <div className="relative w-full h-80 bg-gray-800/50 rounded-lg flex items-center justify-center">
        <p className="text-white/60">No images available</p>
      </div>
    );
  }

  return (
    <div
      className="relative w-full h-80 rounded-lg group overflow-hidden"
      style={{ perspective: '1000px' }} // Creates the 3D space for the children
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div
        className="relative w-full h-full"
        style={{ transformStyle: 'preserve-3d' }} // Ensures children are positioned in 3D space
      >
        {images.map((image, index) => {
          // Determine if the image is the current, previous, or next one
          const isCurrent = index === currentIndex;
          const isPrevious = index === (currentIndex - 1 + images.length) % images.length;
          const isNext = index === (currentIndex + 1) % images.length;

          // Define the CSS transform based on the image's position
          const transform = isCurrent
            ? 'rotateY(0) translateZ(0) scale(1)' // Center image
            : isPrevious
            ? 'rotateY(25deg) translateX(-75%) scale(0.9)' // Left image (will be invisible)
            : isNext
            ? 'rotateY(-25deg) translateX(75%) scale(0.9)' // Right image (will be invisible)
            : 'scale(0.8)'; // Other images

          // --- CHANGED HERE ---
          // Opacity is now 0 for any image that is not the current one.
          const opacity = isCurrent ? 'opacity-100' : 'opacity-0';
          
          // Ensure the current image is always on top
          const zIndex = isCurrent ? images.length : images.length - 1;

          return (
            <div
              key={index}
              className="min-w-[70%] h-[90%] absolute top-[5%] left-[15%] transition-all duration-500 ease-in-out"
              style={{
                transform,
                zIndex,
                // Hide images that are not the current, previous, or next for better performance
                visibility: (isCurrent || isPrevious || isNext) ? 'visible' : 'hidden',
              }}
            >
              <img
                src={image}
                alt={`Gallery image ${index + 1}`}
                className={`w-full h-full object-cover rounded-lg transition-opacity duration-500 ${opacity}`}
              />
            </div>
          );
        })}
      </div>
      
      {/* Image counter display */}
      <div className="absolute top-3 right-3 bg-black/70 text-white px-2 py-0.5 rounded-full text-xs z-50">
        {currentIndex + 1} / {images.length}
      </div>
    </div>
  );
};

export default PhotoCarousel;
