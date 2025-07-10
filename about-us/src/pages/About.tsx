import { useEffect, useRef } from 'react';
import { HeroSection } from '../components/about/HeroSection';
import { AboutACMSection } from '../components/about/AboutACMSection';
import { AboutChapterSection } from '../components/about/AboutChapterSection';
import { WhyJoinSection } from '../components/about/WhyJoinSection';
import { WhatWeDoSection } from '../components/about/WhatWeDoSection';
import { ContactSection } from '../components/about/ContactSection';
import { FloatingElements } from '../components/about/FloatingElements';

const About = () => {
  const cursorRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (cursorRef.current) {
        cursorRef.current.style.left = e.clientX + 'px';
        cursorRef.current.style.top = e.clientY + 'px';
      }
    };

    document.addEventListener('mousemove', handleMouseMove);
    return () => document.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <div className="min-h-screen bg-background text-foreground relative">
      {/* Custom cursor effect */}
      <div 
        ref={cursorRef}
        className="fixed w-4 h-4 bg-primary rounded-full pointer-events-none z-50 opacity-50 blur-sm"
        style={{ transform: 'translate(-50%, -50%)' }}
      />
      
      {/* Floating background elements */}
      <FloatingElements />
      
      {/* Main content */}
      <div className="relative z-10">
        <HeroSection />
        <AboutACMSection />
        <AboutChapterSection />
        <WhyJoinSection />
        <WhatWeDoSection />
        <ContactSection />
      </div>
    </div>
  );
};

export default About;
