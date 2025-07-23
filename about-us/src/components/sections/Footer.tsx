import React from 'react'; // <-- FIX: Added this line
import { FaInstagram, FaGithub, FaLinkedin } from 'react-icons/fa';

export const Footer = () => {
  return (
    <footer className="bg-black/90 text-gray-300 py-10 px-6 border-t border-white/10">
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-10">
        {/* Column 1: About */}
        <div>
          <h3 className="text-xl font-bold text-white mb-4">BMSCE ACM</h3>
          <p className="text-sm leading-relaxed">
            The BMSCE ACM Student Chapter is a vibrant tech community fostering innovation, collaboration, and student leadership under the banner of ACM India. 
          </p>
        </div>

        {/* Column 2: Links */}
        <div>
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
          <p className="text-sm">Email: <a href="mailto:bmsce.acm@bmsce.ac.in" className="underline hover:text-white">bmsce.acm@bmsce.ac.in</a></p>
          <div className="flex space-x-4 mt-4">
            <a href="https://github.com/bmsce-acm" target="_blank" rel="noopener noreferrer" className="hover:text-white text-xl">
              <FaGithub />
            </a>
            <a href="https://linkedin.com/in/bmsce-acm" target="_blank" rel="noopener noreferrer" className="hover:text-white text-xl">
              <FaLinkedin />
            </a>
            <a href="https://instagram.com/bmsce_acm" target="_blank" rel="noopener noreferrer" className="hover:text-white text-xl">
              <FaInstagram />
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

