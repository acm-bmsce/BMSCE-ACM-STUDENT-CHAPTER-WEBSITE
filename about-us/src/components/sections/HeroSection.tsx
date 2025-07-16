
import React from 'react';
import { ChevronDown, Zap } from 'lucide-react';

export const HeroSection: React.FC = () => {
  return (
    <section id="hero" className="min-h-screen flex items-center justify-center relative overflow-hidden">
      {/* 3D Floating Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-20 w-20 h-20 bg-acm-blue/20 rounded-full animate-float" style={{ animationDelay: '0s' }}></div>
        <div className="absolute top-40 right-32 w-16 h-16 bg-acm-blue/20 rounded-lg animate-float" style={{ animationDelay: '1s' }}></div>
        <div className="absolute bottom-40 left-1/4 w-24 h-24 bg-acm-blue/20 rounded-full animate-float" style={{ animationDelay: '2s' }}></div>
        <div className="absolute top-1/2 right-20 w-12 h-12 bg-acm-blue/30 rounded-lg animate-float" style={{ animationDelay: '1.5s' }}></div>
      </div>

      <div className="text-center z-10 px-4 max-w-6xl mx-auto">
        {/* Main Title with 3D effect */}
        <div className="relative mb-8">
          <h1 className="font-bebas text-8xl md:text-9xl lg:text-[12rem] text-transparent bg-clip-text bg-gradient-to-r from-acm-blue via-acm-blue to-acm-white animate-bounce-3d leading-none">
            BMSCE
          </h1>
          <div className="absolute inset-0 font-bebas text-8xl md:text-9xl lg:text-[12rem] text-acm-red/20 transform translate-x-2 translate-y-2 -z-10 leading-none">
            BMSCE
          </div>
        </div>

        {/* ACM Text with glow effect */}
        <h2 className="font-bebas text-4xl md:text-6xl text-acm-blue2 mb-6 animate-glow">
          ACM STUDENT CHAPTER
        </h2>

        {/* Subtitle */}
        <p className="font-bricolage text-xl md:text-2xl text-acm-blue2 mb-8 max-w-3xl mx-auto animate-slide-in-3d">
          Innovating the Future Through Technology & Community
        </p>

        {/* CTA Button */}
        <button className="group relative overflow-hidden bg-gradient-to-r from-acm-blue/50 to-acm-blue2 text-acm-gold font-bricolage font-bold py-4 px-8 rounded-lg transform transition-all duration-300 hover:scale-105 hover:shadow-2xl">
          <span className="relative z-10 flex items-center">
            <Zap className="mr-2" size={20} />
            EXPLORE OUR JOURNEY
          </span>
          <div className="absolute inset-0 bg-acm-white/20 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></div>
        </button>

        {/* Scroll Indicator */}
        <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 animate-bounce">
          <ChevronDown size={32} className="text-acm-blue" />
        </div>
      </div>

      {/* Geometric Shapes */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-10 w-32 h-32 border-2 border-acm-blue/30 rotate-45 animate-spin" style={{ animationDuration: '20s' }}></div>
        <div className="absolute bottom-1/4 right-10 w-40 h-40 border-2 border-acm-blue/30 rounded-full animate-pulse"></div>
      </div>
    </section>
  );
};
