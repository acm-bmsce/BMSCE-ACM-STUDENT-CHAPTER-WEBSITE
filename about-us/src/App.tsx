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

    </div>
  );
};

export default Index;