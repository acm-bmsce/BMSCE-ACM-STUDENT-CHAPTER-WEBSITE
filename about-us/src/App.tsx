// src/App.tsx (or src/Index.tsx) - REVISED
import { useEffect } from 'react';
import { FuturisticNav } from './components/FuturisticNav';
import { MatrixBackground } from './components/MatrixBackground';
import { HeroSection } from './components/sections/HeroSection';
import { AboutACMSection } from './components/sections/AboutACMSection';
import { AboutBMSCESection } from './components/sections/AboutBMSCESection';
import { WhatWeDoSection } from './components/sections/WhatWeDoSection';
import { WhyJoinSection } from './components/sections/WhyJoinSection';
import { ConnectSection } from './components/sections/ConnectSection';
// import { DepthTransition } from './components/DepthTransition';

const Index = () => {
  useEffect(() => {
    document.documentElement.style.scrollBehavior = 'smooth';
  }, []);

  return (
    <div className="bg-acm-black text-acm-white min-h-screen relative overflow-x-hidden">
      {/* Matrix Background Effect */}
      <MatrixBackground />
      
      {/* Navigation */}
      <FuturisticNav />
      
      {/* Main Content */}
      <main className="relative z-10">

        {/* Hero Section */}
        <HeroSection />
        
        {/* About ACM Section */}
        <AboutACMSection />
        
        {/* Depth Transition between About ACM and About BMSCE */}
        {/* <DepthTransition variant="blue" height="lg" /> */}
        
        {/* About BMSCE ACM Section */}
        <AboutBMSCESection />
        
        {/* Transition 3 */}
        {/* <SectionTransition variant="default" /> */}
        
        {/* What We Do Section */}
        <WhatWeDoSection />
        
        {/* Transition 4 */}
        {/* <SectionTransition variant="red" /> */}
        
        {/* Why Join Us Section */}
        <WhyJoinSection />
        
        {/* Transition 5 */}
        {/* <SectionTransition variant="gold" /> */}
        
        {/* Connect With Us Section */}
        <ConnectSection />
      </main>

      <footer className="relative z-10 bg-acm-black/90 backdrop-blur-md border-t border-acm-gold/30 py-8">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <div className="w-6 h-6 bg-gradient-to-br from-acm-gold to-acm-red rounded transform rotate-45 animate-glow"></div>
            <span className="font-bebas text-lg text-acm-white">BMSCE ACM STUDENT CHAPTER</span>
          </div>
          <p className="font-bellefair text-acm-white/60">
            © 2024 BMSCE ACM Student Chapter. All rights reserved.
          </p>
          <p className="font-bricolage text-acm-gold/80 text-sm mt-2">
            Innovating the Future Through Technology & Community
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;