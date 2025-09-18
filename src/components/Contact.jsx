import { Stars } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import React, { useEffect, useMemo } from "react";
import { FiArrowRight } from "react-icons/fi";
import {
  useMotionTemplate,
  useMotionValue,
  motion,
  animate,
} from "framer-motion";
import { useInView } from "react-intersection-observer";

import AnimatedTitle from "./AnimatedTitle";

const COLORS_TOP = ["#13FFAA", "#1E67C6", "#CE84CF", "#DD335C"];
const COLORS_MOB= ["#5acbedff"]
const Contact = () => {
  const color = useMotionValue(COLORS_MOB[0]);
  const isMobile = typeof window !== "undefined" && window.innerWidth < 768;

  // Animate color only on desktop for performance
  useEffect(() => {
    if (!isMobile) {
      animate(color, COLORS_TOP, {
        ease: "easeInOut",
        duration: 10,
        repeat: Infinity,
        repeatType: "mirror",
      });
    }
  }, [isMobile, color]);

  const backgroundImage = useMotionTemplate`radial-gradient(125% 125% at 50% 0%, #020617 50%, ${color})`;
  const border = useMotionTemplate`1px solid ${color}`;
  const boxShadow = useMotionTemplate`0px 4px 24px ${color}`;

  // Scroll-based animation for subtitle
  const { ref, inView } = useInView({
    triggerOnce: false,
    threshold: 0.3,
  });

  // Memoized starfield so it doesn’t remount
  const Starfield = useMemo(
    () => (
      <Canvas>
        <Stars
          radius={50}
          count={isMobile ? 500 : 2500}
          factor={isMobile ? 2 : 4}
          fade
          speed={1.5}
        />
      </Canvas>
    ),
    [isMobile]
  );

  return (
    <div id="contact" className="pt-24 pb-20 w-screen px-5 md:px-24 bg-black">
      <motion.div
        style={{
          backgroundImage,
          boxShadow: "0 30px 60px rgba(0, 0, 0, 0.6)",
          borderStyle: "none",
        }}
        className={`relative rounded-lg ${
          isMobile
            ? "bg-gray-900/80"
            : "bg-gray-950/50 backdrop-blur-md"
        } border border-white/20 py-24 text-gray-200 sm:overflow-hidden`}
      >
        {/* Starfield Canvas */}
        <div className="absolute inset-0 z-0">{Starfield}</div>

        {/* Floating Logo */}
        <div className="relative z-10">
          <img
            src="/img/logo.png"
            className="absolute left-1/2 -translate-x-1/2 -top-[5rem] w-32 h-auto lg:top-[22rem] lg:w-40 object-cover"
            alt="contact decoration"
          />
        </div>

        {/* Content */}
        <div className="relative z-10 flex flex-col items-center text-center">
          <motion.p
            ref={ref}
            initial={{ y: 30, opacity: 0 }}
            animate={inView ? { y: 0, opacity: 1 } : { y: 30, opacity: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="mb-10 mt-10 md:mt-0 font-general text-[20px] uppercase tracking-widest"
          >
            Join BMSCE ACM Student Chapter
          </motion.p>

          <AnimatedTitle
            title="let&#39;s b<b>u</b>ild the <br /> new era of <br /> co<b>m</b>puting t<b>o</b>gether"
            className="special-font !md:text-[6.2rem] w-full font-zentry !text-5xl !font-black !leading-[.9]"
          />

          <a href="mailto:acm@bmsce.ac.in" className="mt-10">
            <motion.button
              style={{ border, boxShadow }}
              whileHover={{ scale: 1.015 }}
              whileTap={{ scale: 0.985 }}
              className="group relative flex w-fit items-center gap-1.5 rounded-full bg-gray-950/10 px-6 py-3 text-sm text-gray-50 transition-colors hover:bg-gray-950/50"
            >
              Contact Us
              <FiArrowRight className="transition-transform group-hover:-rotate-45 group-active:-rotate-12" />
            </motion.button>
          </a>
        </div>
      </motion.div>
    </div>
  );
};

export default Contact;
