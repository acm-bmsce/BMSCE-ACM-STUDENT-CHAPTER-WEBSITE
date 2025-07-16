
import React from 'react';
import { Code2, Users, Trophy, BookOpen, Cpu, Globe } from 'lucide-react';

export const WhatWeDoSection: React.FC = () => {
  const activities = [
    {
      icon: Code2,
      title: "Technical Workshops",
      description: "Hands-on sessions covering latest technologies, programming languages, and development frameworks.",
      color: "from-acm-blue/70 to-acm-blue2/20"
    },
    {
      icon: Trophy,
      title: "Hackathons & Competitions",
      description: "Organize and participate in coding competitions, hackathons, and programming contests.",
      color: "from-acm-blue/70 to-acm-blue2/20"
    },
    {
      icon: Users,
      title: "Networking Events",
      description: "Connect with industry professionals, alumni, and fellow students to build lasting relationships.",
      color: "from-acm-blue/70 to-acm-blue2/20"
    },
    {
      icon: BookOpen,
      title: "Research & Publications",
      description: "Support student research initiatives and encourage publications in ACM conferences and journals.",
      color: "from-acm-blue/70 to-acm-blue2/20"
    },
    {
      icon: Cpu,
      title: "Tech Talks & Seminars",
      description: "Expert sessions on emerging technologies, industry trends, and career development.",
      color: "from-acm-blue/70 to-acm-blue2/20"
    },
    {
      icon: Globe,
      title: "Community Outreach",
      description: "Promote computer science education and digital literacy in the broader community.",
      color: "from-acm-blue/70 to-acm-blue2/20"
    }
  ];

  return (
    <section id="what-we-do" className="min-h-screen flex items-center justify-center py-20 relative">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="font-bricolage text-6xl md:text-8xl text-acm-white mb-6 animate-bounce-3d">
            WHAT WE DO
          </h2>
          <div className="w-32 h-1 bg-gradient-to-r from-acm-blue to-acm-blue2 mx-auto mb-8"></div>
          <p className="font-bellefair text-xl text-acm-blue2 max-w-4xl mx-auto leading-relaxed">
            We offer a comprehensive range of activities designed to enhance technical skills, 
            foster innovation, and build a strong computing community.
          </p>
        </div>

        {/* Activities Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {activities.map((activity, index) => (
            <div
              key={index}
              className="group relative bg-acm-black/50 backdrop-blur-md border border-acm-blue2/30 rounded-xl overflow-hidden transform transition-all duration-700 hover:scale-105 hover:-rotate-2 animate-slide-in-3d"
              style={{ animationDelay: `${index * 0.2}s` }}
            >
              {/* Gradient Background */}
              <div className={`absolute inset-0 bg-gradient-to-br ${activity.color}  group-hover:opacity-20 transition-opacity duration-300`}></div>
              
              {/* Content */}
              <div className="relative z-10 p-6">
                {/* Icon */}
                <div className="mb-4 transform group-hover:scale-110 transition-transform duration-300">
                  <activity.icon size={48} className="text-acm-blue2 group-hover:text-acm-blue transition-colors duration-300" />
                </div>
                
                {/* Title */}
                <h3 className="font-bricolage text-xl font-bold text-acm-white mb-3 group-hover:text-acm-white transition-colors duration-300">
                  {activity.title}
                </h3>
                
                {/* Description */}
                <p className="font-bellefair text-acm-white/80 leading-relaxed">
                  {activity.description}
                </p>
              </div>

              {/* Hover Effect Border */}
              <div className="absolute inset-0 border-2 border-transparent group-hover:border-acm-blue/50 rounded-xl transition-all duration-300"></div>
              
              {/* 3D Shadow */}
              <div className="absolute inset-0 bg-acm-blue/10 rounded-xl transform translate-x-2 translate-y-2 -z-10 group-hover:translate-x-3 group-hover:translate-y-3 transition-transform duration-300"></div>
            </div>
          ))}
        </div>

        {/* Stats Section */}
        <div className="mt-20 bg-gradient-to-r from-acm-blue/20 to-acm-blue2/20 backdrop-blur-md border border-acm-blue2/30 rounded-2xl p-8">
          <h3 className="font-bricolage text-3xl text-acm-white text-center mb-8">OUR IMPACT</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { number: "50+", label: "Events Organized" },
              { number: "500+", label: "Students Reached" },
              { number: "25+", label: "Industry Partners" },
              { number: "15+", label: "Research Projects" }
            ].map((stat, index) => (
              <div key={index} className="text-center group">
                <div className="font-bricolage text-3xl md:text-4xl text-acm-white mb-2 group-hover:text-acm-gold transition-colors duration-30 animate-glow">
                  {stat.number}
                </div>
                <div className="font-bellefair text-2xl text-bold text-acm-white/80 text-sm">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Animated Background Elements */}
      <div className="absolute top-1/4 left-10 w-32 h-32 border-2 border-acm-blue/20 rotate-45 animate-spin opacity-30" style={{ animationDuration: '20s' }}></div>
      <div className="absolute bottom-1/4 right-10 w-40 h-40 border-2 border-acm-gold/20 rounded-full animate-pulse opacity-30"></div>
      <div className="absolute top-1/2 left-1/4 w-20 h-20 bg-acm-blue/10 rounded-full" style={{ animationDelay: '1s' }}></div>
    </section>
  );
};
