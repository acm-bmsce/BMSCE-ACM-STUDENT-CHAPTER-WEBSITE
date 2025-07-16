import React from 'react';
import { Rocket, Brain, Heart, Star, Zap } from 'lucide-react';
import { PhotoCarousel } from '../PhotoCarousel';
import ACMTEAM from "../../assets/ACMTEAM.jpg"
export const AboutBMSCESection: React.FC = () => {

   const galleryImages = [
    ACMTEAM,
    "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=800&h=600&fit=crop",
    "https://images.unsplash.com/photo-1487058792275-0ad4aaf24ca7?w=800&h=600&fit=crop",
    "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=800&h=600&fit=crop",
    "https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?w=800&h=600&fit=crop",
    "https://images.unsplash.com/photo-1649972904349-6e44c42644a7?w=800&h=600&fit=crop"
  ];

  const visionItems = [
    {
      icon: Brain,
      title: "Innovation",
      description: "Driving breakthrough solutions and creative problem-solving approaches in technology that shape the future of computing.",
      features: ["Cutting-edge research", "Idea incubation", "Solution development"]
    },
    {
      icon: Heart,
      title: "Community",
      description: "Building strong bonds and collaborative relationships among tech enthusiasts to create lasting professional networks.",
      features: ["Peer collaboration", "Mentorship programs", "Networking events"]
    },
    {
      icon: Rocket,
      title: "Growth",
      description: "Accelerating personal and professional development through continuous learning and hands-on experience in emerging technologies.",
      features: ["Skill enhancement workshops", "Career development", "Leadership opportunities"]
    },
    {
      icon: Star,
      title: "Excellence",
      description: "Maintaining highest standards in academic and technical achievements while fostering innovation and research excellence.",
      features: ["Competitive programming", "Project showcases", "Quality education"]
    }
  ];

  return (
    <section id="about-bmsce" className="min-h-screen flex items-center justify-center py-20 relative">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="font-bricolage text-6xl md:text-8xl text-acm-white mb-6 animate-bounce-3d">
            ABOUT BMSCE ACM
          </h2>
          <div className="w-32 h-1 bg-gradient-to-r from-acm-blue to-acm-blue2 mx-auto mb-8"></div>
        </div>

        {/* Main Content - Single column for text and cards */}
        <div className="mb-20">
          {/* Text Section - Spans full width */}
          <div className="max-w-4xl mx-auto space-y-8 mb-16">
            <div className="relative">
              <p className="font-bellefair text-xl text-acm-blue2 leading-relaxed">
                The BMSCE ACM Student Chapter is a vibrant community of passionate computer science enthusiasts,
                researchers, and innovators dedicated to advancing the field of computing at
                BMS College of Engineering.
              </p>

              <p className="font-bellefair text-lg text-acm-blue2 mt-6 leading-relaxed">
                We foster an environment of learning, collaboration, and innovation where students can explore
                cutting-edge technologies, participate in research, and build lasting professional networks.
              </p>
            </div>
          </div>

          {/* Vision Cards - Now rectangular and filling horizontal space better */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-2 2xl:grid-cols-2 gap-8 justify-items-center">
            {visionItems.map((item, index) => (
              <div
                key={index}
                className="group relative bg-gradient-to-br from-acm-blue/70 to-acm-blue2/20 backdrop-blur-md border border-acm-gold/30 rounded-2xl p-8 transform transition-all duration-700 hover:scale-105 animate-slide-in-3d w-full min-h-[280px]"
                style={{ animationDelay: `${index * 0.2}s` }}
              >
                {/* Icon and Title Container */}
                <div className="flex items-center mb-6">
                  <div className={`w-16 h-16 bg-gradient-to-br from-acm-blue2 to-acm-blue2 rounded-xl flex items-center justify-center mr-4 group-hover:rotate-12 transition-transform duration-300`}>
                    <item.icon size={32} className="text-acm-black" />
                  </div>
                  <h3 className="font-bricolage text-2xl font-bold text-acm-white group-hover:text-acm-white transition-colors duration-300">
                    {item.title}
                  </h3>
                </div>

                {/* Description */}
                <p className="font-bellefair text-acm-white/90 mb-6 leading-relaxed">
                  {item.description}
                </p>

                {/* Features list */}
                <div className="space-y-3">
                  {item.features.map((feature, featureIndex) => (
                    <div key={featureIndex} className="flex items-center space-x-3">
                      <Zap size={16} className="text-acm-white" />
                      <span className="font-bellafair text-acm-white/80">{feature}</span>
                    </div>
                  ))}
                </div>

                {/* Glow Effect */}
                <div className="absolute inset-0 bg-gradient-to-br from-acm-gold/5 to-acm-blue/5 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

                {/* 3D Border */}
                <div className="absolute inset-0 border-2 border-acm-blue/20 rounded-2xl transform translate-x-1 translate-y-1 -z-10 group-hover:translate-x-2 group-hover:translate-y-2 transition-transform duration-300"></div>
              </div>
            ))}
          </div>
        </div>

        {/* Mission Card and Photo Carousel - Arranged side-by-side on large screens */}
        <div className="flex flex-col lg:flex-row lg:justify-center lg:items-stretch lg:space-x-8 p-4">
          <div className="w-full lg:w-1/2 mb-8 lg:mb-0">
            <div className="group perspective-1000 max-w-4xl mx-auto h-full">
              <div className="relative preserve-3d transform transition-all duration-700 group-hover:rotate-y-12 group-hover:rotate-x-6 h-full">
                {/* Main Card */}
                <div className="bg-gradient-to-br from-acm-blue/70  to-acm-blue2/20 backdrop-blur-md border border-acm-blue/50 rounded-2xl p-8 transform transition-all duration-500 h-full flex flex-col">
                  <h3 className="font-bricolage text-3xl text-acm-white mb-4">OUR MISSION</h3>
                  <p className="font-bellefair text-acm-white/90 mb-6 leading-relaxed flex-grow">
                    To create a dynamic ecosystem where students can explore, learn, and contribute to the ever-evolving
                    world of computer science and technology. [Placeholder - Update with actual mission statement]
                  </p>

                  <div className="space-y-3">
                    {[
                      "Promote technical excellence and best practices",
                      "Foster innovation and cutting-edge research",
                      "Build professional networks and industry connections",
                      "Advance computing education and knowledge sharing"
                    ].map((point, index) => (
                      <div key={index} className="flex items-center space-x-3">
                        <div className="w-2 h-2 bg-acm-white rounded-full animate-pulse"></div>
                        <span className="font-bellafair text-acm-white/90">{point}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Shadow Card */}
                <div className="absolute inset-0 bg-acm-gold/10 rounded-2xl transform translate-x-4 translate-y-4 -z-10"></div>
              </div>
            </div>
          </div>

          <div className="w-full lg:w-1/2">
            {/* Removed the <h3> tag for "OUR MOMENTS" */}
            <div className="space-y-4 h-full flex flex-col">
              <div className="flex-grow flex items-center justify-center">
                <PhotoCarousel images={galleryImages} autoPlay={true} interval={4000}  />
              </div>
            </div>
          </div>
        </div>

        {/* Achievement Timeline */}
        <div className="mt-20 relative">
          <h3 className="font-bricolage text-4xl text-acm-white text-center mb-12">OUR JOURNEY</h3>
          <div className="flex flex-col md:flex-row justify-center items-center space-y-8 md:space-y-0 md:space-x-8">
            {[
              { year: "2018", event: "Chapter Established " },
              { year: "2020", event: "500+ Members Milestone " },
              { year: "2022", event: "National Recognition Award " },
              { year: "2024", event: "Innovation Hub Launch " }
            ].map((milestone, index) => (
              <div key={index} className="group text-center">
                <div className="w-20 h-20 bg-gradient-to-br from-acm-blue to-acm-blue2 rounded-full flex items-center justify-center mb-4 mx-auto group-hover:scale-110 transition-transform duration-30 animate-glow">
                  <span className="font-bellefair text-2xl text-acm-gold">{milestone.year}</span>
                </div>
                <p className="font-bellefair text-2xl text-acm-white">{milestone.event}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Background Geometric Elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none opacity-10">
        <div className="absolute top-1/4 right-20 w-40 h-40 border-2 border-acm-red rotate-45 animate-spin" style={{ animationDuration: '25s' }}></div>
        <div className="absolute bottom-1/3 left-16 w-32 h-32 border-2 border-acm-blue rounded-full animate-pulse"></div>
      </div>
    </section>
  );
};