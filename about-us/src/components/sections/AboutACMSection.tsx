import React from 'react';
import { Globe, Users, Trophy, Code } from 'lucide-react';
import CountUp from '../CountUp';

export const AboutACMSection: React.FC = () => {
  const features = [
    { icon: Globe, title: "Global Network", description: "World's largest computing society" },
    { icon: Users, title: "100,000+ Members", description: "Professionals and students worldwide" },
    { icon: Trophy, title: "Excellence", description: "Advancing computing as a science" },
    { icon: Code, title: "Innovation", description: "Fostering technological breakthroughs" }
  ];

  return (
    <section id="about-acm" className="min-h-screen flex items-center justify-center py-20 relative">
      <div className="max-w-7xl mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="font-bricolage text-6xl md:text-8xl text-acm-white mb-6 animate-bounce-3d">
            ABOUT ACM
          </h2>
          <div className="w-32 h-1 bg-gradient-to-r from-acm-blue to-acm-white mx-auto mb-8"></div>
          <p className="font-bellefair text-xl text-acm-blue2 max-w-4xl mx-auto leading-relaxed">
            The Association for Computing Machinery (ACM) is the world's largest educational and scientific computing society, 
            uniting computing educators, researchers, and professionals to inspire dialogue, share resources, and address the field's challenges.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="group relative border border-acm-blue2/30 rounded-xl p-6 transform transition-all duration-500 hover:scale-105 hover:rotate-3 animate-slide-in-3d"
              style={{ animationDelay: `${index * 0.2}s` }}
            >
              {/* Glow effect */}
              {/* <div className="absolute inset-0 bg-gradient-to-r from-acm-blue/70 to-acm-blue/20 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div> */}
              
              {/* Icon */}
              <div className="relative z-10 mb-4">
                <feature.icon size={48} className="text-acm-blue2 group-hover:text-acm-gold transition-colors duration-300" />
              </div>
              
              {/* Content */}
              <h3 className="font-bricolage text-xl font-bold text-acm-white mb-2 relative z-10">
                {feature.title}
              </h3>
              <p className="font-bellefair text-acm-white/80 relative z-10">
                {feature.description}
              </p>

              {/* 3D Border Effect */}
              <div className="absolute inset-0 border-2 border-acm-blue/20 rounded-xl transform translate-x-1 translate-y-1 -z-10 group-hover:translate-x-2 group-hover:translate-y-2 transition-transform duration-300"></div>
            </div>
          ))}
        </div>

        {/* Stats Section */}
        <div className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-8">
          {[
            { number: "1947",extra:"", label: "Founded" },
            { number: "100",extra:"K+", label: "Members" },
            { number: "190",extra:"+", label: "Countries" },
            { number: "37",extra:"", label: "SIGs" }
          ].map((stat, index) => (
            <div key={index} className="text-center group p-4 m-2">
              <div className="p-2 m-2font-bricolage text-4xl md:text-5xl text-acm-white group-hover:text-acm-white transition-colors duration-30 border border-white">
                <CountUp from={0}  to={stat.number}  separator=","  direction="up"  duration={1}  className="count-up-text"/>{stat.extra}
              </div>
              <div className="font-bellefair text-2xl text-bold text-acm-white/80 mt-2">
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Background Elements */}
      <div className="absolute top-20 right-10 w-64 h-64 border border-acm-blue/20 rotate-45 animate-spin opacity-20" style={{ animationDuration: '30s' }}></div>
      <div className="absolute bottom-20 left-10 w-48 h-48 border border-acm-blue/20 rounded-full animate-pulse opacity-20"></div>
    </section>
  );
};