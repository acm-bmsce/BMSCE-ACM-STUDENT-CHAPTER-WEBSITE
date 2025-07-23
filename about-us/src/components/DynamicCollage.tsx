import React, { useState, useRef, useEffect } from 'react';

// Define the shape of an image object for type safety
interface CollageImage {
  src: string;
  alt?: string;
}

// Define the props for our component
interface DynamicCollageProps {
  images: CollageImage[];
}

// Defines the starting layout for the images in their "at rest" state.
const collageLayout = [
  { top: '15%', left: '10%', rotate: '-8deg', width: 'w-48' },
  { top: '30%', left: '45%', rotate: '5deg',  width: 'w-56' },
  { top: '5%',  left: '70%', rotate: '10deg', width: 'w-40' },
  { top: '70%', left: '5%',  rotate: '3deg',  width: 'w-44' },
  { top: '50%', left: '65%', rotate: '-5deg', width: 'w-44' },
  { top: '60%', left: '35%', rotate: '-2deg', width: 'w-44' },
];

export const DynamicCollage: React.FC<DynamicCollageProps> = ({ images }) => {
  // State to track which image is currently zoomed to the center.
  const [zoomedIndex, setZoomedIndex] = useState<number | null>(null);
  // Ref to hold the timer ID. This allows us to clear it if needed.
const timeoutRef = useRef<number | null>(null);
  // Clear any active timer when the component unmounts to prevent errors.
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  const handleMouseEnter = (index: number) => {
    // If there's a pending timer to "zoom out", cancel it.
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    // Set the new image as the zoomed one.
    setZoomedIndex(index);
  };

  const handleMouseLeave = () => {
    // When the mouse leaves, start a timer to return the image to its place.
    // The image will stay centered for 3.5 seconds.
    timeoutRef.current = setTimeout(() => {
      setZoomedIndex(null);
    }, 1000); // 1.5 seconds
  };

  return (
    <div 
      className="relative w-full min-h-[25rem] p-4 bg-acm-black border border-acm-blue2 rounded-lg overflow-hidden"
    >
      {images.map((image, index) => {
        const isZoomed = zoomedIndex === index;
        const isAnotherZoomed = zoomedIndex !== null && !isZoomed;
        const layout = collageLayout[index % collageLayout.length];

        return (
          <div
            key={index}
            onMouseEnter={() => handleMouseEnter(index)}
            onMouseLeave={handleMouseLeave}
            className={`
              absolute transition-all duration-500 ease-in-out cursor-pointer shadow-lg
              ${layout.width}
              ${isZoomed ? 'z-30' : 'z-10'}
              ${isAnotherZoomed ? 'opacity-0 scale-95 blur-sm' : 'opacity-100 scale-100 blur-0'}
            `}
            style={{
              // If zoomed, move to center. Otherwise, use layout position.
              top: isZoomed ? '50%' : layout.top,
              left: isZoomed ? '50%' : layout.left,
              // If zoomed, center, scale up, and un-rotate. 
              // Otherwise, use the layout's rotation.
              transform: isZoomed
                ? 'translate(-50%, -50%) scale(1.75) rotate(0deg)'
                : `rotate(${layout.rotate})`,
            }}
          >
            <img
              src={image.src}
              alt={image.alt || `Collage image ${index + 1}`}
              className="block w-full h-auto rounded-md object-cover"
            />
          </div>
        );
      })}
    </div>
  );
};