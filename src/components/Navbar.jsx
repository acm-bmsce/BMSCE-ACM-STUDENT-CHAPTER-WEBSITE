import clsx from "clsx";
import gsap from "gsap";
import { useWindowScroll } from "react-use";
import { useEffect, useRef, useState } from "react";
import { TiLocationArrow } from "react-icons/ti";
import { GiHamburgerMenu } from "react-icons/gi";
import { IoMdClose } from "react-icons/io";
import { Link, useLocation } from "react-router-dom";

import Button from "./Button";

// ✅ CHANGE 1: ADD "Projects" and "Placements" to the navItems array
const navItems = [
  "Home",
  "Events",
  "Projects",
  "Placements", // 🌟 NEW: Added Placements
  "Join Us",
  "Team",
  "About Us",
];

const NavBar = () => {
  const [isAudioPlaying, setIsAudioPlaying] = useState(false);
  const [isIndicatorActive, setIsIndicatorActive] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showMenuItems, setShowMenuItems] = useState(false);
  const [isUnmounting, setIsUnmounting] = useState(false);
  const location = useLocation();

  const audioElementRef = useRef(null);
  const navContainerRef = useRef(null);

  const { y: currentScrollY } = useWindowScroll();
  const [isNavVisible, setIsNavVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  const toggleAudioIndicator = () => {
    setIsAudioPlaying((prev) => !prev);
    setIsIndicatorActive((prev) => !prev);
  };

  const toggleMenu = () => {
    if (isMenuOpen) {
      setIsUnmounting(true);
      document.body.style.overflow = "";

      setTimeout(() => {
        setShowMenuItems(false);
        setIsMenuOpen(false);
        setIsUnmounting(false);
      }, 600);
    } else {
      setShowMenuItems(true);
      setIsMenuOpen(true);
      document.body.style.overflow = "hidden";
    }
  };

  useEffect(() => {
    if (isAudioPlaying) {
      audioElementRef.current.play();
    } else {
      audioElementRef.current.pause();
    }
  }, [isAudioPlaying]);

  useEffect(() => {
    if (currentScrollY === 0) {
      setIsNavVisible(true);
      navContainerRef.current?.classList.remove("floating-nav");
    } else if (currentScrollY > lastScrollY) {
      setIsNavVisible(false);
      navContainerRef.current?.classList.add("floating-nav");
    } else if (currentScrollY < lastScrollY) {
      setIsNavVisible(true);
      navContainerRef.current?.classList.add("floating-nav");
    }
    setLastScrollY(currentScrollY);
  }, [currentScrollY, lastScrollY]);

  useEffect(() => {
    gsap.to(navContainerRef.current, {
      y: isNavVisible ? 0 : -100,
      opacity: isNavVisible ? 1 : 0,
      duration: 0.2,
    });
  }, [isNavVisible]);

  // ✅ CHANGE 2: Add logic for "Projects" and "Placements" in the desktop navigation
  const renderNavItem = (item, index) => {
    if (item === "Home") {
      return (
        <Link
          key={index}
          to="/"
          className="nav-hover-btn text-xl lg:text-[1rem] font-bold "
          onClick={() => {
            if (isMenuOpen) toggleMenu();
          }}
        >
          {item}
        </Link>
      );
    } else if (item === "Projects") {
      return (
        <Link
          key={index}
          to="/projects"
          className="nav-hover-btn text-xl lg:text-[1rem] font-bold"
          onClick={() => {
            if (isMenuOpen) toggleMenu();
          }}
        >
          {item}
        </Link>
      );
    } else if (item === "Placements") {
      // 🌟 NEW LOGIC FOR PLACEMENTS
      return (
        <Link
          key={index}
          to="/placements" // Route to the /placements page
          className="nav-hover-btn text-xl lg:text-[1rem] font-bold"
          onClick={() => {
            if (isMenuOpen) toggleMenu();
          }}
        >
          {item}
        </Link>
      );
    } else if (item === "Join Us") {
      return (
        <Link
          key={index}
          to="/join-us"
          className="nav-hover-btn text-xl lg:text-[1rem] font-bold"
          onClick={() => {
            if (isMenuOpen) toggleMenu();
          }}
        >
          {item}
        </Link>
      );
    } else if (item === "About Us") {
      return (
        <Link
          key={index}
          to="/about-us"
          className="nav-hover-btn text-xl lg:text-[1rem] font-bold"
          onClick={() => {
            if (isMenuOpen) toggleMenu();
          }}
        >
          {item}
        </Link>
      );
    } else if (item === "Team") {
      return (
        <Link
          key={index}
          to="/team"
          className="nav-hover-btn text-xl lg:text-[1rem] font-bold"
          onClick={() => {
            if (isMenuOpen) toggleMenu();
          }}
        >
          {item}
        </Link>
      );
    } else if (item === "Events") {
      return (
        <Link
          key={index}
          to="/event"
          className="nav-hover-btn text-xl lg:text-[1rem] font-bold"
          onClick={() => {
            if (isMenuOpen) toggleMenu();
          }}
        >
          {item}
        </Link>
      );
    } else {
      return (
        <a
          key={index}
          href={`#${item.toLowerCase().replace(" ", "-")}`}
          className="nav-hover-btn text-xl lg:text-[1rem] font-bold"
          onClick={() => {
            if (isMenuOpen) toggleMenu();
          }}
        >
          {item}
        </a>
      );
    }
  };

  const renderMobileNavItem = (item, index) => {
    if (item === "Home") {
      return (
        <li
          key={index}
          className={clsx(
            "text-5xl font-bold text-blue-50 transition-opacity duration-500",
            {
              "opacity-100 animate-rise": showMenuItems && !isUnmounting,
              "opacity-0 animate-fall": isUnmounting,
            }
          )}
          style={{
            animationDelay: `${0.1 * index + 0.3}s`,
            animationFillMode: "both",
          }}
        >
          <Link to="/" onClick={toggleMenu}>
            {item}
          </Link>
        </li>
      );
    } else if (item === "Projects") {
      return (
        <li
          key={index}
          className={clsx(
            "text-5xl font-bold text-blue-50 transition-opacity duration-500",
            {
              "opacity-100 animate-rise": showMenuItems && !isUnmounting,
              "opacity-0 animate-fall": isUnmounting,
            }
          )}
          style={{
            animationDelay: `${0.1 * index + 0.3}s`,
            animationFillMode: "both",
          }}
        >
          <Link to="/projects" onClick={toggleMenu}>
            {item}
          </Link>
        </li>
      );
    } else if (item === "Placements") {
      // 🌟 NEW LOGIC FOR MOBILE PLACEMENTS
      return (
        <li
          key={index}
          className={clsx(
            "text-5xl font-bold text-blue-50 transition-opacity duration-500",
            {
              "opacity-100 animate-rise": showMenuItems && !isUnmounting,
              "opacity-0 animate-fall": isUnmounting,
            }
          )}
          style={{
            animationDelay: `${0.1 * index + 0.3}s`,
            animationFillMode: "both",
          }}
        >
          <Link to="/placements" onClick={toggleMenu}>
            {item}
          </Link>
        </li>
      );
    } else if (item === "Join Us") {
      return (
        <li
          key={index}
          className={clsx(
            "text-5xl font-bold text-blue-50 transition-opacity duration-500",
            {
              "opacity-100 animate-rise": showMenuItems && !isUnmounting,
              "opacity-0 animate-fall": isUnmounting,
            }
          )}
          style={{
            animationDelay: `${0.1 * index + 0.3}s`,
            animationFillMode: "both",
          }}
        >
          <Link to="/join-us" onClick={toggleMenu}>
            {item}
          </Link>
        </li>
      );
    } else if (item === "About Us") {
      return (
        <li
          key={index}
          className={clsx(
            "text-5xl font-bold text-blue-50 transition-opacity duration-500",
            {
              "opacity-100 animate-rise": showMenuItems && !isUnmounting,
              "opacity-0 animate-fall": isUnmounting,
            }
          )}
          style={{
            animationDelay: `${0.1 * index + 0.3}s`,
            animationFillMode: "both",
          }}
        >
          <Link to="/about-us" onClick={toggleMenu}>
            {item}
          </Link>
        </li>
      );
    } else if (item === "Team") {
      return (
        <li
          key={index}
          className={clsx(
            "text-5xl font-bold text-blue-50 transition-opacity duration-500",
            {
              "opacity-100 animate-rise": showMenuItems && !isUnmounting,
              "opacity-0 animate-fall": isUnmounting,
            }
          )}
          style={{
            animationDelay: `${0.1 * index + 0.3}s`,
            animationFillMode: "both",
          }}
        >
          <Link to="/team" onClick={toggleMenu}>
            {item}
          </Link>
        </li>
      );
    } else if (item === "Events") {
      return (
        <li
          key={index}
          className={clsx(
            "text-5xl font-bold text-blue-50 transition-opacity duration-500",
            {
              "opacity-100 animate-rise": showMenuItems && !isUnmounting,
              "opacity-0 animate-fall": isUnmounting,
            }
          )}
          style={{
            animationDelay: `${0.1 * index + 0.3}s`,
            animationFillMode: "both",
          }}
        >
          <Link to="/event" onClick={toggleMenu}>
            {item}
          </Link>
        </li>
      );
    } else {
      return (
        <li
          key={index}
          className={clsx(
            "text-5xl font-bold text-blue-50 transition-opacity duration-500",
            {
              "opacity-100 animate-rise": showMenuItems && !isUnmounting,
              "opacity-0 animate-fall": isUnmounting,
            }
          )}
          style={{
            animationDelay: `${0.1 * index + 0.3}s`,
            animationFillMode: "both",
          }}
        >
          <a
            href={`#${item.toLowerCase().replace(" ", "-")}`}
            onClick={toggleMenu}
          >
            {item}
          </a>
        </li>
      );
    }
  };

  return (
    <>
      <div
        ref={navContainerRef}
        className="fixed inset-x-3 top-4 z-50 h-16 border-none bg-black/20 backdrop-blur-md transition-all duration-700 sm:inset-x-5 rounded-lg"
      >
        <header className="absolute top-1/2 w-full -translate-y-1/2">
          <nav className="flex size-full items-center justify-between p-4">
            <div className="flex items-center gap-7">
              <Link to="/">
                <img src="/img/logo.png" alt="logo" className="w-[5rem]" />
              </Link>
            </div>

            <div className="hidden md:flex h-full items-center gap-3">
              {/* Desktop Navigation Items */}
              {navItems.map((item, index) => renderNavItem(item, index))}

              <button
                onClick={toggleAudioIndicator}
                className="ml-10 flex items-center space-x-0.5"
              >
                <audio
                  ref={audioElementRef}
                  className="hidden"
                  src="/audio/loop.mp3"
                  loop
                />
                {[1, 2, 3, 4].map((bar) => (
                  <div
                    key={bar}
                    className={clsx("indicator-line", {
                      active: isIndicatorActive,
                    })}
                    style={{
                      animationDelay: `${bar * 0.1}s`,
                    }}
                  />
                ))}
              </button>
            </div>

            <button onClick={toggleMenu} className="md:hidden text-white">
              {isMenuOpen ? (
                <IoMdClose size={30} className="text-white" />
              ) : (
                <GiHamburgerMenu size={30} />
              )}
            </button>
          </nav>
        </header>
      </div>

      {/* Slide-in Mobile Menu */}
      <div
        className={clsx(
          " fixed top-0 right-0 z-[999] h-screen w-full bg-black text-white px-10 py-20 transform transition-transform duration-500 ease-in-out md:hidden overflow-hidden",

          isMenuOpen ? "translate-x-0" : "translate-x-full"
        )}
        onWheel={(e) => e.stopPropagation()}
      >
        <button
          onClick={toggleMenu}
          className="absolute top-8 right-3 text-white z-[1001]"
          aria-label="Close menu"
        >
          <IoMdClose size={36} />
        </button>

        {(showMenuItems || isUnmounting) && (
          <ul className="mobile-nav-list flex flex-col items-center space-y-10 mt-16">
            {/* Mobile Navigation Items */}
            {navItems.map((item, index) => renderMobileNavItem(item, index))}
          </ul>
        )}

        <div className="toggle-audio-title absolute bottom-20 sm:bottom-32 left-0 right-0 px-10 flex items-center justify-between w-full">
          <p className="text-sm text-blue-50">BMSCE ACM STUDENT CHAPTER</p>
          <button
            onClick={toggleAudioIndicator}
            className="flex items-center space-x-1"
          >
            <audio
              ref={audioElementRef}
              className="hidden"
              src="/audio/loop.mp3"
              loop
            />
            {[1, 2, 3, 4].map((bar) => (
              <div
                key={bar}
                className={clsx("indicator-line", {
                  active: isIndicatorActive,
                })}
                style={{
                  animationDelay: `${bar * 0.1}s`,
                }}
              />
            ))}
          </button>
        </div>
      </div>
    </>
  );
};

export default NavBar;