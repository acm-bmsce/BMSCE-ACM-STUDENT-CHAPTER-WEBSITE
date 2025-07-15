import React from 'react';

interface SectionTransitionProps {
  variant?: 'default' | 'gold' | 'blue' | 'red';
}

export const SectionTransition: React.FC<SectionTransitionProps> = ({ variant = 'default' }) => {
  const getGradientColors = () => {
    switch (variant) {
      case 'gold':
        return 'from-acm-gold/20 via-acm-gold/10 to-transparent';
      case 'blue':
        return 'from-acm-blue/20 via-acm-blue/10 to-transparent';
      case 'red':
        return 'from-acm-red/20 via-acm-red/10 to-transparent';
      default:
        return 'from-acm-gold/20 via-acm-blue/10 to-acm-red/20';
    }
  };

  const getShapeColor = () => {
    switch (variant) {
      case 'gold':
        return 'border-acm-gold/30';
      case 'blue':
        return 'border-acm-blue/30';
      case 'red':
        return 'border-acm-red/30';
      default:
        return 'border-acm-gold/30';
    }
  };

  return (
    <div className="relative h-32 w-full overflow-hidden">
      {/* Gradient Background */}
      <div className={`absolute inset-0 bg-gradient-to-r ${getGradientColors()}`}></div>
      
      {/* Animated Geometric Elements */}
      <div className="absolute inset-0 flex items-center justify-center">
        {/* Central Diamond */}
        <div className={`w-8 h-8 border-2 ${getShapeColor()} rotate-45 animate-pulse`}></div>
        
        {/* Side Circles */}
        <div className={`absolute left-1/4 w-4 h-4 border ${getShapeColor()} rounded-full animate-float`} style={{ animationDelay: '0.5s' }}></div>
        <div className={`absolute right-1/4 w-4 h-4 border ${getShapeColor()} rounded-full animate-float`} style={{ animationDelay: '1s' }}></div>
        
        {/* Connecting Lines */}
        <div className={`absolute left-0 right-0 h-px bg-gradient-to-r ${getGradientColors()} opacity-50`}></div>
      </div>
      
      {/* Flowing Particles */}
      <div className="absolute inset-0">
        <div className={`absolute top-1/2 left-10 w-2 h-2 bg-acm-gold/40 rounded-full animate-float`} style={{ animationDelay: '0s' }}></div>
        <div className={`absolute top-1/3 left-1/3 w-1 h-1 bg-acm-blue/40 rounded-full animate-float`} style={{ animationDelay: '0.8s' }}></div>
        <div className={`absolute top-2/3 right-1/3 w-1 h-1 bg-acm-red/40 rounded-full animate-float`} style={{ animationDelay: '1.2s' }}></div>
        <div className={`absolute top-1/2 right-10 w-2 h-2 bg-acm-gold/40 rounded-full animate-float`} style={{ animationDelay: '1.6s' }}></div>
      </div>
      
      {/* Subtle Glow Effect */}
      <div className="absolute inset-0 bg-gradient-to-t from-acm-black/50 via-transparent to-acm-black/50"></div>
    </div>
  );
};