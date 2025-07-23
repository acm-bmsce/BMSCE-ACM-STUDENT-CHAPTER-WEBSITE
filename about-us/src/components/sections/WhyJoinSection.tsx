
import React from 'react';
import { Lightbulb, Network, Award, TrendingUp, Users2, Zap } from 'lucide-react';

export const WhyJoinSection: React.FC = () => {
  const benefits = [
    {
      icon: Lightbulb,
      title: "Skill Development",
      description: "Access to cutting-edge workshops, certifications, and hands-on learning experiences.",
      features: ["Technical Workshops", "Certification Programs", "Mentorship"]
    },
    {
      icon: Network,
      title: "Professional Network",
      description: "Connect with industry leaders, alumni, and peers from across the globe.",
      features: ["Industry Connections", "Alumni Network", "Peer Collaboration"]
    },
    {
      icon: Award,
      title: "Recognition & Awards",
      description: "Opportunity to showcase your work and receive recognition for your contributions.",
      features: ["Competition Participation", "Achievement Awards", "Portfolio Building"]
    },
    {
      icon: TrendingUp,
      title: "Career Growth",
      description: "Access to internships, job opportunities, and career development resources.",
      features: ["Job Placement", "Career Guidance", "Industry Exposure"]
    }
  ];

  return (
    <section id="why-join" className="min-h-screen flex items-center justify-center py-20 relative">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="font-bricolage text-6xl md:text-8xl text-acm-white mb-6 animate-bounce-3d">
            WHY JOIN US
          </h2>
          <div className="w-32 h-1 bg-gradient-to-r from-acm-blue to-acm-blue2 mx-auto mb-8"></div>
          <p className="font-bellefair text-xl text-acm-blue2 max-w-4xl mx-auto leading-relaxed">
            Join a community of innovators, learners, and leaders who are shaping the future of technology.
          </p>
        </div>

        {/* Benefits Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16">
          {benefits.map((benefit, index) => (
            <div
              key={index}
              className="group relative  to-acm-blue2/20 backdrop-blur-md border border-acm-blue2/30 rounded-2xl p-8 transform transition-all duration-700 hover:scale-105 animate-slide-in-3d"
              style={{ animationDelay: `${index * 0.2}s` }}
            >
              {/* Icon */}
              <div className="flex items-center mb-6">
                <div className="w-16 h-16 rounded-xl flex items-center justify-center mr-4 group-hover:rotate-12 transition-transform duration-300">
                  <benefit.icon size={32} className="text-acm-white" />
                </div>
                <h3 className="font-bricolage text-2xl font-bold text-acm-white group-hover:text-acm-white transition-colors duration-300">
                  {benefit.title}
                </h3>
              </div>

              {/* Description */}
              <p className="font-bellefair text-acm-white/90 mb-6 leading-relaxed">
                {benefit.description}
              </p>

              {/* Features */}
              <div className="space-y-3">
                {benefit.features.map((feature, featureIndex) => (
                  <div key={featureIndex} className="flex items-center space-x-3">
                    <Zap size={16} className="text-acm-white" />
                    <span className="font-bellefair text-acm-white/80">{feature}</span>
                  </div>
                ))}
              </div>

              {/* Glow Effect */}
              {/* <div className="absolute inset-0 bg-gradient-to-br from-acm-blue/5 to-acm-blue2/5 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div> */}
              
              {/* 3D Border */}
              <div className="absolute inset-0 border-2 border-acm-blue2/20 rounded-2xl transform translate-x-1 translate-y-1 -z-10 group-hover:translate-x-2 group-hover:translate-y-2 transition-transform duration-300"></div>
            </div>
          ))}
        </div>

        {/* Community Stats */}
        <div className=" border border-acm-gold/30 rounded-2xl p-8">
          <div className="text-center mb-8">
            <Users2 size={48} className="text-acm-blue2 mx-auto mb-4" />
            <h3 className="font-bricolage text-3xl text-acm-white">JOIN OUR GROWING COMMUNITY</h3>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { number: "500+", label: "Active Members", icon: "👥" },
              { number: "95%", label: "Placement Rate", icon: "🎯" },
              { number: "50+", label: "Companies", icon: "🏢" },
              { number: "4.8/5", label: "Satisfaction", icon: "⭐" }
            ].map((stat, index) => (
              <div key={index} className="text-center group">
                <div className="text-2xl mb-2">{stat.icon}</div>
                <div className="font-bricolage text-2xl md:text-3xl text-acm-white mb-1 border border-acm-white group-hover:text-acm-gold transition-colors duration-30 ">
                  {stat.number}
                </div>
                <div className="font-bellefair text-2xl text-bold text-acm-white/80 ">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center mt-16">
          <div className=" border border-acm-blue/30 rounded-2xl p-8 max-w-2xl mx-auto">
            <h3 className="font-bricolage text-3xl text-acm-white mb-4">READY TO TRANSFORM YOUR FUTURE?</h3>
            <p className="font-bellefair text-acm-white/90 mb-6">
              Take the first step towards joining a community that will accelerate your growth and open doors to endless opportunities.
            </p>
            <button className="group bg-gradient-to-r from-acm-blue to-acm-blue text-acm-black font-bricolage font-bold py-4 px-8 rounded-xl transform transition-all duration-300 hover:scale-105 hover:shadow-2xl">
              <span className="flex items-center">
                <Users2 className="mr-2" size={20} />
                JOIN US TODAY
              </span>
            </button>
          </div>
        </div>
      </div>

      {/* Background Elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none opacity-20">
        <div className="absolute top-1/4 right-20 w-64 h-64 border-2 border-acm-blue rotate-45 animate-spin" style={{ animationDuration: '30s' }}></div>
        <div className="absolute bottom-1/4 left-20 w-48 h-48 border-2 border-acm-blue rounded-full animate-pulse"></div>
        <div className="absolute top-1/2 left-10 w-32 h-32 bg-acm-blue/10 rounded-lg" style={{ animationDelay: '2s' }}></div>
      </div>
    </section>
  );
};
