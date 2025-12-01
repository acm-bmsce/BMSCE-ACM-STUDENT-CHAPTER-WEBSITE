import React, { useState, useEffect } from "react";
import { motion, useAnimation } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/all";

gsap.registerPlugin(ScrollTrigger);

// ------------------ Animated Title ------------------
const AnimatedTitle = ({ title, containerClass, zoomFactor }) => {
  useGSAP(() => {
    gsap.fromTo(
      "#features-title",
      { scale: 0.8, opacity: 0 },
      {
        scale: 1,
        opacity: 1,
        duration: 1,
        ease: "power3.out",
        scrollTrigger: {
          trigger: "#features-title",
          start: "top 80%",
          toggleActions: "play none none reverse",
        },
      }
    );
  }, []);

  // Gradually scale down title when zoomed in
  const scale = zoomFactor > 1 ? Math.max(0.85, 1 - (zoomFactor - 1) * 0.3) : 1;

  return (
    <div className={containerClass}>
      <h1
        id="features-title"
        style={{
          transform: `scale(${scale})`,
          transition: "transform 0.3s ease",
        }}
        className="text-4xl md:text-5xl font-bold tracking-tighter special-font"
      >
        {title}
      </h1>
    </div>
  );
};

// ------------------ Product Card ------------------
function Product({ val, mover, count }) {
  const controls = useAnimation();
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.2 });

  useEffect(() => {
    if (inView) controls.start({ opacity: 1, y: 0 });
  }, [inView]);

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      animate={controls}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="w-full py-20 h-[23rem] text-white"
      onMouseEnter={() => mover(count)}
    >
      <div className="max-w-screen-xl mx-auto flex items-center justify-between">
        <h1 className="text-3xl capitalize font-medium">{val.title}</h1>
        <div className="details w-1/4">
          <p className="mb-10">{val.description}</p>
        </div>
      </div>
    </motion.div>
  );
}

// ------------------ Mobile Card ------------------
const MobileCard = ({ title, description, image }) => {
  const controls = useAnimation();
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.2 });

  useEffect(() => {
    if (inView) controls.start({ opacity: 1, y: 0 });
  }, [inView]);

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 50 }}
      animate={controls}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="mb-10 relative rounded-3xl overflow-hidden shadow-lg"
    >
      <img
        src={image}
        alt="mobile-card"
        className="w-full h-[300px] object-cover"
      />
      <div className="absolute inset-0 bg-black bg-opacity-50 text-white p-6 flex flex-col justify-end">
        <h2 className="text-2xl font-bold mb-2">{title}</h2>
        <p className="text-sm">{description}</p>
      </div>
    </motion.div>
  );
};

// ------------------ Main Features Section ------------------
const Features = () => {
  const products = [
    {
      title: (
        <>
          Member Only <br /> Discounts
        </>
      ),
      description:
        "Enjoy up to 30% off on events, workshops, and exclusive member benefits.",
    },
    {
      title: (
        <>
          Skill Development <br /> and Recognition
        </>
      ),
      description:
        "Earn volunteering points, build your portfolio, and get recognized for your contributions.",
    },
    {
      title: (
        <>
          Hands-On <br /> Experience
        </>
      ),
      description:
        "Join local chapter teams and work on real-time projects that make a difference.",
    },
    {
      title: (
        <>
          Global ACM <br /> Access
        </>
      ),
      description:
        "Access Communications of the ACM, XRDS, TechNews, Digital Library, and Career Center.",
    },
    {
      title: (
        <>
          Open to All <br /> Branches
        </>
      ),
      description:
        "Whether you're in Computer Science, Electronics, Mechanical, or Civil – everyone is welcome to innovate with us.",
    },
    {
      title: (
        <>
          Long Term <br /> Benefits
        </>
      ),
      description:
        "A 4-year Chapter membership gives you access to all BMSCE ACM Chapter events and activities, while international ACM resources, communities, and conferences are available through ACM Global Membership.",
    },
    {
      title: (
        <>
          Exclusive <br /> Access to <br /> ACM programs
        </>
      ),
      description:
        "Through ACM membership, get access and discounts to Summer Schools, Winter Schools, PhD Clinics, CSPtashala, ACM India AI Olympiad and many more exclusive programs.",
    },
  ];

  const imageSources = [
    "/img/13.webp",
    "/img/56.webp",
    "/img/9.webp",
    "/img/10.webp",
    "/img/15.webp",
    "/img/40.webp",
    "/img/summerschools.webp",
  ];

  const [pos, setPos] = useState(0);
  const [isMobileView, setIsMobileView] = useState(false);
  const [zoomFactor, setZoomFactor] = useState(1);

  const mover = (val) => setPos(val * 23);

  useEffect(() => {
    const handleResize = () => {
      const rootFontSize =
        parseFloat(getComputedStyle(document.documentElement).fontSize) || 16;

      // Base font-size (16px) is normal zoom. If user zooms in, this value increases.
      const zoomLevel = rootFontSize / 16; // 1.0 = 100%, 1.25 = 125%, etc.

      setZoomFactor(zoomLevel);

      const isMobileOrTablet =
        /iphone|ipod|ipad/.test(navigator.userAgent.toLowerCase()) ||
        (/android/.test(navigator.userAgent.toLowerCase()) &&
          !/mobile/.test(navigator.userAgent.toLowerCase())) ||
        window.innerWidth < 1280;

      // ✅ Trigger mobile view *only when zoomed in ≥125%*
      const shouldForceMobile = zoomLevel >= 1.25;
      setIsMobileView(isMobileOrTablet || shouldForceMobile);
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <section className="bg-black text-white pb-20 pt-10">
      <div className="container mx-auto px-3 md:px-10">
        <AnimatedTitle
          title="WHY JOIN OUR NETWORK?"
          containerClass="mt-20 mb-20 !text-white text-center"
          zoomFactor={zoomFactor}
        />

        {!isMobileView && (
          <div className="mt-10 relative">
            {products.map((val, index) => (
              <Product key={index} val={val} mover={mover} count={index} />
            ))}

            <div className="absolute top-0 w-full h-full pointer-events-none">
              <motion.div
                initial={{ y: pos, x: "-50%" }}
                animate={{ y: pos + `rem` }}
                transition={{ ease: [0.76, 0, 0.24, 1], duration: 0.6 }}
                className="window absolute w-[32rem] h-[23rem] bg-sky-100 left-[45%] rounded-3xl overflow-hidden"
              >
                {imageSources.map((src, index) => (
                  <motion.div
                    key={index}
                    animate={{ y: -pos + `rem` }}
                    transition={{ ease: [0.76, 0, 0.24, 1], duration: 0.5 }}
                    className="w-full h-full"
                  >
                    <img
                      className="w-full h-full object-cover"
                      src={src}
                      alt={`Product ${index}`}
                    />
                  </motion.div>
                ))}
              </motion.div>
            </div>
          </div>
        )}

        {isMobileView && (
          <div className="mt-10">
            {products.map((item, index) => (
              <MobileCard
                key={index}
                title={item.title}
                description={item.description}
                image={imageSources[index]}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default Features;
