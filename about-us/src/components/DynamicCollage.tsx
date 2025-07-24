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
  // Layout for 13 images, adjusted to spread across the container
  { top: '5%', left: '2%', rotate: '-5deg', width: 'w-56' },    // Top-left
  { top: '2%', left: '30%', rotate: '3deg',  width: 'w-64' },    // Top-center
  { top: '8%',  left: '65%', rotate: '8deg', width: 'w-52' },    // Top-right
  { top: '40%', left: '5%',  rotate: '6deg',  width: 'w-60' },    // Mid-left
  { top: '30%', left: '40%', rotate: '-4deg', width: 'w-72' },   // Center (larger focal point)
  { top: '45%', left: '70%', rotate: '-10deg', width: 'w-56' },  // Mid-right
  { top: '75%', left: '2%', rotate: '-5deg', width: 'w-64' },    // Bottom-left
  { top: '65%', left: '30%', rotate: '10deg', width: 'w-48' },   // Bottom-center-left
  { top: '70%', left: '55%', rotate: '5deg',  width: 'w-52' },   // Bottom-center-right
  { top: '80%', left: '75%', rotate: '12deg', width: 'w-48' },   // Bottom-right
  { top: '60%', left: '15%', rotate: '-15deg', width: 'w-44' },  // Filler
  { top: '55%', left: '45%', rotate: '2deg', width: 'w-40' },    // Filler (central)
  { top: '0%', left: '85%', rotate: '-10deg', width: 'w-44' },  // Far top-right corner
];

export const DynamicCollage: React.FC<DynamicCollageProps> = ({ images }) => {
  // State to track which image is currently zoomed to the center.
  const [zoomedIndex, setZoomedIndex] = useState<number | null>(null);
  // State to lock interactions while an animation is running.
  const [isAnimating, setIsAnimating] = useState<boolean>(false);
  // Ref to hold the timer ID. This allows us to clear it if needed.
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Clear any active timer when the component unmounts to prevent memory leaks.
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  const handleMouseEnter = (index: number) => {
    // If an animation is already in progress, do nothing.
    if (isAnimating) {
      return;
    }

    // Lock the component to prevent other interactions.
    setIsAnimating(true);
    // Set the new image as the zoomed one.
    setZoomedIndex(index);

    // Set a timer to handle the zoom-out and unlock sequence.
    // The total duration is 2000ms (pause) + 500ms (zoom-out transition)
    timeoutRef.current = setTimeout(() => {
      // Zoom out the image.
      setZoomedIndex(null);
      
      // After the zoom-out transition completes (500ms), unlock the component.
      setTimeout(() => {
        setIsAnimating(false);
      }, 500); // This should match the CSS transition duration.

    }, 1500); // 2 seconds pause while zoomed in
  };

  return (
    <div 
      className="relative w-full min-h-[25rem] p-4 bg-gray-900 border border-blue-800 rounded-lg overflow-hidden"
    >
      {images.map((image, index) => {
        const isZoomed = zoomedIndex === index;
        // An image is considered "in the background" if another image is zoomed
        // or if the component is in the middle of an animation sequence.
        const isAnotherZoomed = zoomedIndex !== null && !isZoomed;
        const layout = collageLayout[index % collageLayout.length];

        return (
          <div
            key={index}
            onMouseEnter={() => handleMouseEnter(index)}
            className={`
              absolute transition-all duration-500 ease-in-out shadow-lg
              ${isAnimating ? 'cursor-wait' : 'cursor-pointer'}
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

export default DynamicCollage;
