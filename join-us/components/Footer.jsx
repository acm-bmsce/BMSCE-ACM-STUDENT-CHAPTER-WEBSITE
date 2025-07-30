import React from 'react';
import { FaInstagram, FaGithub, FaLinkedin, FaYoutube } from 'react-icons/fa';

const Footer = () => {
  return (
    <footer className="bg-black text-gray-300 py-10 px-6 border-t border-white/10">
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-10">
        {/* Column 1: About & Logos */}
        <div>
          {/* ⭐ CHANGE: Added description text */}
          <p className="text-sm leading-relaxed mb-4">
            A vibrant student-led community passionate about technology, innovation, and collaboration.
          </p>
          <div className="flex items-center gap-6">
            <img src="img/ACM-BLUE.svg" alt="ACM Logo" className="h-11 w-auto" />
            <img src="img/BMSCE_BLUE.svg" alt="BMSCE Logo" className="h-12 w-auto" />
            {/* ⭐ CHANGE: Increased height of this logo */}
            <img src="img//BMSCE_ACM_BLUE.svg" alt="BMSCE ACM Logo" className="h-20 w-auto" />
          </div>
        </div>

        {/* Column 2: Links */}
        {/* ⭐ CHANGE: Hidden on small devices, visible on medium and up */}
        <div className="hidden md:block">
          <h3 className="text-xl font-bold text-white mb-4">Quick Links</h3>
          <ul className="space-y-2 text-sm">
            <li><a href="#events" className="hover:text-white transition">Events</a></li>
            <li><a href="#join" className="hover:text-white transition">Join Us</a></li>
            <li><a href="#team" className="hover:text-white transition">Team</a></li>
            <li><a href="#about" className="hover:text-white transition">About Us</a></li>
          </ul>
        </div>

        {/* Column 3: Contact + Socials */}
        <div>
          <h3 className="text-xl font-bold text-white mb-4">Connect With Us</h3>
          <p className="text-sm">Email: <a href="mailto:bmsce.acm@bmsce.ac.in" className="underline hover:text-white">acm@bmsce.ac.in</a></p>
          <div className="flex space-x-4 mt-4">
            <a href="https://github.com/bmsce-acm" target="_blank" rel="noopener noreferrer" className="hover:text-white text-xl">
              <FaGithub />
            </a>
            <a href="https://www.linkedin.com/company/bmsce-acm-student-chapter/" target="_blank" rel="noopener noreferrer" className="hover:text-white text-xl">
              <FaLinkedin />
            </a>
            <a href="https://instagram.com/bmsce_acm" target="_blank" rel="noopener noreferrer" className="hover:text-white text-xl">
              <FaInstagram />
            </a>
            <a href="https://www.youtube.com/channel/UC-p5iI_OFm_n8-wI_u4a5xw" target="_blank" rel="noopener noreferrer" className="hover:text-white text-xl">
              <FaYoutube />
            </a>
          </div>
        </div>
      </div>

      {/* Bottom */}
      <div className="text-center text-xs text-gray-500 mt-10 border-t border-white/10 pt-6">
        © {new Date().getFullYear()} BMSCE ACM Student Chapter. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
