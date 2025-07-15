
import React, { useEffect, useState } from 'react';

interface DepthTransitionProps {
  variant?: 'default' | 'gold' | 'blue' | 'red';
  height?: 'sm' | 'md' | 'lg';
}

export const DepthTransition: React.FC<DepthTransitionProps> = ({ 
  variant = 'default', 
  height = 'md' 
}) => {
  const [scrollY, setScrollY] = useState(0);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => setIsVisible(entry.isIntersecting),
      { threshold: 0.1 }
    );

    const element = document.getElementById('depth-transition');
    if (element) observer.observe(element);

    return () => observer.disconnect();
  }, []);

  const getHeightClass = () => {
    switch (height) {
      case 'sm': return 'h-64';
      case 'lg': return 'h-96';
      default: return 'h-80';
    }
  };

  const getGradientColors = () => {
    switch (variant) {
      case 'gold':
        return 'from-acm-gold/30 via-acm-black/80 to-acm-gold/30';
      case 'blue':
        return 'from-acm-blue/30 via-acm-black/80 to-acm-blue/30';
      case 'red':
        return 'from-acm-red/30 via-acm-black/80 to-acm-red/30';
      default:
        return 'from-acm-gold/20 via-acm-black/90 to-acm-blue/20';
    }
  };

  const getAccentColor = () => {
    switch (variant) {
      case 'gold': return 'acm-gold';
      case 'blue': return 'acm-blue';
      case 'red': return 'acm-red';
      default: return 'acm-gold';
    }
  };

  const parallaxOffset = scrollY * 0.5;
  const rotationOffset = isVisible ? scrollY * 0.1 : 0;

  return (
    <div 
      id="depth-transition"
      className={`relative ${getHeightClass()} w-full overflow-hidden`}
      style={{ perspective: '1000px' }}
    >
      {/* Main Background with Depth */}
      <div 
        className={`absolute inset-0 bg-gradient-to-r ${getGradientColors()}`}
        style={{
          transform: `translateZ(${parallaxOffset * 0.5}px) rotateX(${rotationOffset * 0.2}deg)`,
        }}
      />

      {/* Layered Depth Elements */}
      <div className="absolute inset-0">
        {/* Background Layer */}
        <div 
          className={`absolute inset-0 bg-gradient-to-b from-transparent via-${getAccentColor()}/10 to-transparent`}
          style={{
            transform: `translateZ(-50px) translateY(${parallaxOffset * 0.3}px)`,
          }}
        />

        {/* Middle Layer */}
        <div 
          className="absolute inset-0 flex items-center justify-center"
          style={{
            transform: `translateZ(0px) translateY(${parallaxOffset * 0.6}px)`,
          }}
        >
          {/* Central Geometric Elements */}
          <div className="relative">
            {/* Main Diamond */}
            <div 
              className={`w-16 h-16 border-2 border-${getAccentColor()}/50 rotate-45 animate-pulse`}
              style={{
                transform: `rotate(45deg) rotateY(${rotationOffset}deg)`,
                boxShadow: `0 0 30px var(--${getAccentColor()})`,
              }}
            />

            {/* Orbiting Elements */}
            {[0, 120, 240].map((angle, index) => (
              <div
                key={index}
                className={`absolute w-6 h-6 border border-${getAccentColor()}/40 rounded-full`}
                style={{
                  transform: `rotate(${angle + rotationOffset}deg) translateX(40px) translateZ(20px)`,
                  top: '50%',
                  left: '50%',
                  marginTop: '-12px',
                  marginLeft: '-12px',
                  animationDelay: `${index * 0.5}s`,
                }}
              />
            ))}
          </div>
        </div>

        {/* Foreground Layer */}
        <div 
          className="absolute inset-0"
          style={{
            transform: `translateZ(50px) translateY(${parallaxOffset * 0.8}px)`,
          }}
        >
          {/* Floating Particles */}
          {[...Array(8)].map((_, index) => (
            <div
              key={index}
              className={`absolute w-2 h-2 bg-${getAccentColor()}/60 rounded-full animate-float`}
              style={{
                left: `${15 + index * 10}%`,
                top: `${30 + (index % 3) * 20}%`,
                animationDelay: `${index * 0.3}s`,
                transform: `translateZ(${index * 10}px)`,
              }}
            />
          ))}
        </div>

        {/* Depth Lines */}
        <div className="absolute inset-0 flex items-center justify-center">
          {[...Array(5)].map((_, index) => (
            <div
              key={index}
              className={`absolute w-full h-px bg-gradient-to-r from-transparent via-${getAccentColor()}/30 to-transparent`}
              style={{
                top: `${20 + index * 15}%`,
                transform: `translateZ(${index * 20 - 40}px) rotateX(${rotationOffset * 0.5}deg)`,
                opacity: 0.7 - index * 0.1,
              }}
            />
          ))}
        </div>
      </div>

      {/* Overlay Gradient for Depth */}
      <div className="absolute inset-0 bg-gradient-to-b from-acm-black/60 via-transparent to-acm-black/60 pointer-events-none" />

      {/* Edge Vignette */}
      <div className="absolute inset-0 bg-gradient-to-r from-acm-black via-transparent to-acm-black opacity-50" />
    </div>
  );
};
