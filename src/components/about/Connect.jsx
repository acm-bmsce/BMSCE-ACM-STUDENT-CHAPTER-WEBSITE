// src/components/Connect.jsx

import AnimatedTitle from "../AnimatedTitle";
import { FaInstagram, FaLinkedin, FaGithub, FaYoutube, FaEnvelope } from "react-icons/fa";

const socialLinks = [
  { href: "https://instagram.com/bmsce_acm", icon: <FaInstagram size={28} /> },
  { href: "https://www.linkedin.com/company/bmsce-acm-student-chapter/", icon: <FaLinkedin size={28} /> },
  { href: "https://www.youtube.com/channel/UC-p5iI_OFm_n8-wI_u4a5xw", icon: <FaYoutube size={28} /> },
  { href: "https://github.com/bmsce-acm", icon: <FaGithub size={28} /> },
  { href: "mailto:bmsce.acm@bmsce.ac.in", icon: <FaEnvelope size={28} /> },
  
];

const Connect = () => {
    return (
        <div id="connect" className="my-20 min-h-96 w-screen px-10">
            <div className="relative rounded-lg bg-black py-24 text-blue-50 sm:overflow-hidden flex flex-col items-center justify-center text-center">
                
                {/* Decorative Images - Reusing pattern */}
                <img src="/img/contact-1.webp" className="contact-clip-path-1 absolute left-10 top-2 w-72 h-full opacity-30 hidden lg:block" alt="deco" />
                <img src="/img/contact-3.webp" className="sword-man-clip-path absolute -right-8 top-10 w-96 h-full opacity-30 hidden lg:block" alt="deco" />
                
                <p className="mb-10 font-general text-[10px] uppercase">
                    Stay Connected
                </p>

                <AnimatedTitle
                    title="Follow Our Journey,<br />Join Our Community"
                    className="!md:text-[6.2rem] w-full font-zentry !text-5xl !font-black !leading-[.9]"
                />

                <div className="flex justify-center gap-8 md:gap-12 mt-16">
                    {socialLinks.map((link, index) => (
                        <a
                            key={index}
                            href={link.href}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-50 transition-transform duration-300 hover:text-blue-300 hover:scale-110"
                        >
                            {link.icon}
                        </a>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Connect;