import React from 'react';
import { FaInstagram, FaGithub, FaLinkedin, FaYoutube } from 'react-icons/fa';
import { Link } from 'react-router-dom';

const socialLinks = [
  {
    icon: <FaGithub />,
    href: "https://github.com/acm-bmsce",
    hoverColor: "hover:text-white",
  },
  {
    icon: <FaLinkedin />,
    href: "https://www.linkedin.com/company/bmsce-acm-student-chapter/",
    hoverColor: "hover:text-blue-500",
  },
  {
    icon: <FaInstagram />,
    href: "https://instagram.com/bmsce_acm",
    hoverColor: "hover:text-pink-500",
  },
  {
    icon: <FaYoutube />,
    href: "http://www.youtube.com/@BMSCEACM",
    hoverColor: "hover:text-red-500",
  },
];

const Footer = () => {
  return (
    <footer className="bg-black text-gray-300 py-10 px-6 border-t border-white/10">
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-10 md:pl-20">
        {/* Column 1 */}
        <div>
          <p className="text-sm leading-relaxed mb-4">
            A vibrant student-led community passionate about technology, innovation, and collaboration.
          </p>
          <div className="flex items-center gap-6">
            <img src="img/ACM-BLUE.svg" alt="ACM Logo" className="h-11 w-auto" />
            <img src="img/BMSCE-BLUE.png" alt="BMSCE Logo" className="h-12 w-auto" />
            <img src="img/BMSCE-ACM-BLUE.png" alt="BMSCE ACM Logo" className="h-20 w-auto" />
          </div>
        </div>

        {/* Column 2 */}
        <div className="hidden md:block pl-20">
          <h3 className="text-xl font-bold text-white mb-4">Quick Links</h3>
          <ul className="space-y-2 text-sm">
            <li><Link to="/event" className="hover:text-white transition">Events</Link></li>
            <li><Link to="/join-us" className="hover:text-white transition">Join Us</Link></li>
            <li><Link to="/team" className="hover:text-white transition">Team</Link></li>
            <li><Link to="/about-us" className="hover:text-white transition">About Us</Link></li>
          </ul>
        </div>

        {/* Column 3 */}
        <div>
          <h3 className="text-xl font-bold text-white mb-4">Connect With Us</h3>
          <p className="text-sm">
            Email: <a href="mailto:bmsce.acm@bmsce.ac.in" className="underline hover:text-white">acm@bmsce.ac.in</a>
          </p>
          <div className="flex space-x-4 mt-4">
            {socialLinks.map(({ icon, href, hoverColor }, idx) => (
              <a
                key={idx}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className={`
                  text-xl text-gray-400
                  transition-all duration-300 ease-in-out
                  transform
                  ${hoverColor}
                  hover:scale-110 hover:-translate-y-1
                `}
              >
                {icon}
              </a>
            ))}
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
