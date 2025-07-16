import React from 'react';
import { Mail, Phone, MapPin, Instagram, Linkedin, ExternalLink } from 'lucide-react';

export const ConnectSection: React.FC = () => {
  const socialLinks = [
    { icon: Instagram, label: "Instagram", handle: "@bmsce_acm", color: "hover:text-pink-400" },
    { icon: Linkedin, label: "LinkedIn", handle: "BMSCE ACM Chapter", color: "hover:text-blue-400" }
  ];

  const contactInfo = [
    { icon: Mail, label: "Email", value: "acm@bmsce.ac.in", color: "text-acm-gold" },
    { icon: Phone, label: "Phone", value: "+91 80-26762274", color: "text-acm-blue" },
    { icon: MapPin, label: "Address", value: "BMS College of Engineering, Bangalore", color: "text-acm-red" }
  ];

  return (
    <section id="connect" className="min-h-screen flex items-center justify-center py-20 relative">
      <div className="max-w-4xl mx-auto px-4 w-full">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="font-bricolage text-6xl md:text-8xl text-acm-white mb-6 animate-bounce-3d">
            CONNECT WITH US
          </h2>
          <div className="w-32 h-1 bg-gradient-to-r from-acm-blue to-acm-blue2 mx-auto mb-8"></div>
          <p className="font-bellefair text-xl text-acm-white max-w-3xl mx-auto leading-relaxed">
            Ready to join our community? Get in touch with us through any of these channels.
          </p>
        </div>

        <div className="space-y-12 flex flex-col items-center">
          {/* Contact Information */}
          <div className="w-full max-w-2xl">
            <h3 className="font-bricolage text-3xl text-acm-blue2 mb-8 text-center">GET IN TOUCH</h3>
            
            <div className="space-y-6">
              {contactInfo.map((contact, index) => (
                <div
                  key={index}
                  className="group flex items-center space-x-4 bg-gradient-to-r from-acm-blue/50 to-acm-blue2/20 backdrop-blur-md border border-acm-blue/30 rounded-xl p-6 transform transition-all duration-500 hover:scale-105 animate-slide-in-3d"
                  style={{ animationDelay: `${index * 0.2}s` }}
                >
                  <div className={`w-12 h-12 ${contact.color} bg-acm-white/30 rounded-xl flex items-center justify-center group-hover:rotate-12 transition-transform duration-300`}>
                    <contact.icon size={24} />
                  </div>
                  <div>
                    <div className="font-bellefair text-acm-white/60 text-sm">{contact.label}</div>
                    <div className="font-bellefair text-acm-white text-lg">{contact.value}</div>
                  </div>
                </div>
              ))}
            </div>

            {/* Office Hours */}
            <div className="bg-gradient-to-br from-acm-blue/50 to-acm-blue/20 backdrop-blur-md border border-acm-blue/30 rounded-xl p-6 mt-8">
              <h4 className="font-bricolage text-xl font-bold text-acm-white mb-4 text-center">Office Hours</h4>
              <div className="space-y-2 font-bellefair text-acm-white/80 text-center">
                <div>Monday - Friday: 9:00 AM - 5:00 PM</div>
                <div>Saturday: 10:00 AM - 2:00 PM</div>
              </div>
            </div>
          </div>

          {/* Social Media Links */}
          <div className="w-full max-w-md">
            <h3 className="font-bricolage text-3xl text-acm-white mb-8 text-center">FOLLOW US</h3>
            <div className="flex justify-center gap-6">
              {socialLinks.map((social, index) => (
                <button
                  key={index}
                  className={`group bg-gradient-to-br from-acm-blue/50 to-acm-blue2/20 backdrop-blur-md border border-acm-blue/30 rounded-xl p-6 transform transition-all duration-500 hover:scale-105 hover:-rotate-2 animate-slide-in-3d ${social.color} relative`}
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <social.icon size={32} className="mx-auto mb-3 text-acm-white" />
                  <div className="font-bellefair text-acm-white font-medium mb-1">{social.label}</div>
                  <div className="font-bellefair text-acm-white/60 text-sm">{social.handle}</div>
                  <ExternalLink size={16} className="absolute top-4 right-4 text-acm-white/60 group-hover:text-acm-white transition-colors duration-300" />
                </button>
              ))}
            </div>
          </div>

          {/* Newsletter Signup */}
          <div className="w-full max-w-2xl">
            <div className="bg-gradient-to-r from-acm-blue/50  to-acm-blue2/20 backdrop-blur-md border border-acm-blue/30 rounded-2xl p-8">
              <h3 className="font-bricolage text-3xl text-acm-white mb-4 text-center">STAY UPDATED</h3>
              <p className="font-bellefair text-acm-white/80 mb-6 text-center">
                Subscribe to our newsletter for the latest updates on events, workshops, and opportunities.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="flex-1 bg-acm-black/50 border border-acm-blue/30 rounded-lg px-4 py-3 text-acm-white placeholder-acm-white/50 focus:border-acm-blue focus:outline-none transition-colors duration-300"
                />
                <button className="bg-gradient-to-r from-acm-blue to-acm-blue2 text-acm-white font-bricolage font-bold py-3 px-6 rounded-lg transform transition-all duration-300 hover:scale-105">
                  SUBSCRIBE
                </button>
              </div>
            </div>
          </div>

          {/* Quick Contact Form - Last with horizontal extension */}
          <div className="w-full">
            <div className="bg-gradient-to-br from-acm-blue/50 to-acm-blue/20 backdrop-blur-md border border-acm-blue/30 rounded-xl p-8">
              <h4 className="font-bricolage text-xl font-bold text-acm-white mb-6 text-center">Quick Message</h4>
              <form className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <input
                    type="text"
                    placeholder="Your Name"
                    className="w-full bg-acm-black/50 border border-acm-blue/30 rounded-lg px-4 py-3 text-acm-white placeholder-acm-white/50 focus:border-acm-blue focus:outline-none transition-colors duration-300"
                  />
                  <input
                    type="email"
                    placeholder="Your Email"
                    className="w-full bg-acm-black/50 border border-acm-blue/30 rounded-lg px-4 py-3 text-acm-white placeholder-acm-white/50 focus:border-acm-blue focus:outline-none transition-colors duration-300"
                  />
                </div>
                <div>
                  <textarea
                    placeholder="Your Message"
                    rows={4}
                    className="w-full bg-acm-black/50 border border-acm-blue/30 rounded-lg px-4 py-3 text-acm-white placeholder-acm-white/50 focus:border-acm-blue focus:outline-none transition-colors duration-300"
                  ></textarea>
                </div>
                <button
                  type="submit"
                  className="w-full bg-gradient-to-r from-acm-blue to-acm-blue2 text-acm-black font-bricolage font-bold py-3 px-6 rounded-lg transform transition-all duration-300 hover:scale-105 hover:shadow-2xl"
                >
                  SEND MESSAGE
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>

      {/* Background Effects */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none opacity-20">
        <div className="absolute top-1/4 left-20 w-48 h-48 border-2 border-acm-red/30 rotate-45 animate-spin" style={{ animationDuration: '25s' }}></div>
        <div className="absolute bottom-1/3 right-20 w-36 h-36 border-2 border-acm-blue/30 rounded-full animate-pulse"></div>
        <div className="absolute top-1/2 right-1/4 w-24 h-24 bg-acm-gold/10 rounded-lg" style={{ animationDelay: '1.5s' }}></div>
      </div>
    </section>
  );
};
