
import React, { useState, useEffect } from 'react';
import { Menu, X, ChevronRight } from 'lucide-react';

interface NavItem {
  id: string;
  label: string;
  section: string;
}

const navItems: NavItem[] = [
  { id: 'hero', label: 'HOME', section: 'hero' },
  { id: 'about-acm', label: 'ABOUT ACM', section: 'about-acm' },
  { id: 'about-bmsce', label: 'ABOUT BMSCE ACM', section: 'about-bmsce' },
  { id: 'what-we-do', label: 'WHAT WE DO', section: 'what-we-do' },
  { id: 'why-join', label: 'WHY JOIN US', section: 'why-join' },
  { id: 'connect', label: 'CONNECT WITH US', section: 'connect' },
];

export const FuturisticNav: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('hero');

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ 
        behavior: 'smooth',
        block: 'start'
      });
    }
    setIsOpen(false);
  };

  useEffect(() => {
    const handleScroll = () => {
      const sections = navItems.map(item => item.section);
      const scrollPosition = window.scrollY + window.innerHeight / 2;

      for (const section of sections) {
        const element = document.getElementById(section);
        if (element) {
          const { offsetTop, offsetHeight } = element;
          if (scrollPosition >= offsetTop && scrollPosition < offsetTop + offsetHeight) {
            setActiveSection(section);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <>
      {/* Fixed Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-acm-black/90 backdrop-blur-md border-b border-acm-blue/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-br from-acm-blue to-acm-blue2 rounded transform rotate-45 animate-glow"></div>
              <span className="font-bebas text-xl text-bold text-acm-white"> BMSCE ACM</span>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex space-x-8">
              {navItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => scrollToSection(item.section)}
                  className={`font-bricolage text-sm font-medium transition-all duration-300 relative group ${
                    activeSection === item.section
                      ? 'text-acm-blue2'
                      : 'text-acm-white hover:text-acm-blue'
                  }`}
                >
                  {item.label}
                  <span className={`absolute bottom-0 left-0 w-full h-0.5 bg-acm-gold transform origin-left transition-transform duration-300 ${
                    activeSection === item.section ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100'
                  }`}></span>
                </button>
              ))}
            </div>

            {/* Mobile menu button */}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="md:hidden text-acm-white hover:text-acm-blue transition-colors duration-300"
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        <div className={`md:hidden transition-all duration-300 overflow-hidden ${
          isOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
        }`}>
          <div className="bg-acm-black/95 backdrop-blur-md">
            {navItems.map((item, index) => (
              <button
                key={item.id}
                onClick={() => scrollToSection(item.section)}
                className={`w-full text-left px-6 py-4 font-bricolage text-sm font-medium transition-all duration-300 flex items-center justify-between group ${
                  activeSection === item.section
                    ? 'text-acm-white bg-acm-blue/20'
                    : 'text-acm-white hover:text-acm-blue hover:bg-acm-blue/5'
                }`}
                style={{
                  animationDelay: `${index * 0.1}s`,
                  animation: isOpen ? 'slide-in-3d 0.5s ease-out forwards' : ''
                }}
              >
                {item.label}
                <ChevronRight size={16} className="group-hover:translate-x-1 transition-transform duration-300" />
              </button>
            ))}
          </div>
        </div>
      </nav>
    </>
  );
};
