import { useEffect, useState } from "react";
import { FiArrowUp } from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";

const ScrollToTopButton = () => {
  const [scrollProgress, setScrollProgress] = useState(0);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const windowHeight =
        document.documentElement.scrollHeight - window.innerHeight;
      const scrolled = scrollTop / windowHeight;

      setScrollProgress(scrolled);

      if (scrollTop > 200) {
        setVisible(true);
      } else {
        setVisible(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <AnimatePresence>
      {visible && (
        <motion.button
          initial={{ y: 80, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 80, opacity: 0 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
          onClick={scrollToTop}
          className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full backdrop-blur-md bg-white/20 dark:bg-gray-800/30 border border-white/30 dark:border-gray-300/20 flex items-center justify-center overflow-hidden"
          style={{
            WebkitBackdropFilter: "blur(10px)",
            backdropFilter: "blur(10px)",
            boxShadow:
              "0 8px 20px rgba(0,0,0,0.25), 0 4px 10px rgba(0,0,0,0.15)", // floating shadow
          }}
        >
          {/* Progress Fill */}
          <div
            className="absolute bottom-0 left-0 w-full bg-blue-300 opacity-30"
            style={{
              height: `${scrollProgress * 100}%`,
              transition: "height 0.2s linear",
              zIndex: 0,
            }}
          />

          {/* Icon */}
          <FiArrowUp className="relative z-10 text-white text-xl drop-shadow" />
        </motion.button>
      )}
    </AnimatePresence>
  );
};

export default ScrollToTopButton;
