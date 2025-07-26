import { FaBars, FaTimes } from "react-icons/fa";
import { useState } from "react";

const navItems = ["Home", "About", "Events", "Teams", "Contact"];

const Navbar = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    return (
        <nav className="fixed inset-x-3 top-4 z-50 h-16 bg-black/20 backdrop-blur-md rounded-lg">
            <div className="flex size-full items-center justify-between p-4">
                <img src="/img/logo.png" alt="logo" className="w-[5rem]" />
                <div className="hidden md:flex items-center gap-8">
                    {navItems.map((item) => (
                        <a key={item} href={`#${item.toLowerCase()}`} className="text-white hover:text-blue-300 transition-colors">
                            {item}
                        </a>
                    ))}
                </div>
                <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="md:hidden text-white">
                    {isMenuOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
                </button>
            </div>
        </nav>
    );
};
export default Navbar;