import React, { useEffect, useRef, useState } from "react";
import "./Spotlight.css";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "@studio-freight/lenis";
import { FaMapMarkerAlt, FaUsers } from "react-icons/fa";
// import eventData from "./Data2_event"; // ❌ DELETED
import AnimatedTitle from "./AnimatedTitle";
gsap.registerPlugin(ScrollTrigger);

const config = { gap: 0.09, speed: 0.4, arcRadius: 500 };

function getBezierPosition(t, containerWidth, containerHeight) {
  const arcStartX = containerWidth - 220;
  const arcStartY = -200;
  const arcEndY = containerHeight + 200;
  const arcControlPointX = arcStartX + config.arcRadius;
  const arcControlPointY = containerHeight / 2;
  const x =
    (1 - t) ** 2 * arcStartX +
    2 * (1 - t) * t * arcControlPointX +
    t ** 2 * arcStartX;
  const y =
    (1 - t) ** 2 * arcStartY +
    2 * (1 - t) * t * arcControlPointY +
    t ** 2 * arcEndY;
  return { x, y };
}

function getImgProgressState(index, overallProgress) {
  const startTime = index * config.gap;
  const endTime = startTime + config.speed;
  if (overallProgress < startTime) return -1;
  if (overallProgress > endTime) return 2;
  return (overallProgress - startTime) / config.speed;
}

// 1. Accept events as a prop
export default function Spotlight({ setIsGridView, events }) {
  // 2. Safety Check: If no events, show nothing (prevents crash)
  if (!events || events.length === 0) return <div className="text-white text-center pt-20">No Events to Display</div>;

  const spotlightRef = useRef();
  const titlesContainerRef = useRef();
  const introTextRefs = [useRef(), useRef()];
  const bgImgRef = useRef();
  const headerRef = useRef();

  // 3. Use 'events' instead of 'eventData' for ref initialization
  const imgRefs = useRef(events.map(() => React.createRef()));

  const [activeModal, setActiveModal] = useState(null);
  const modalRef = useRef();
  const modalImageRef = useRef();
  const blurBgRef = useRef();
  const [activeTab, setActiveTab] = useState("Overview");
  const tabContentRef = useRef();

  // 4. Set initial year safely
  // Helper function (optional but clean)
  const getYearFromDate = (date) =>
    date ? new Date(date).getFullYear().toString() : "2024";

  // ---------------- STATE ----------------
  const [activeYear, setActiveYear] = useState(
    getYearFromDate(events[0]?.date)
  );

  const [fullScreenImage, setFullScreenImage] = useState(null);

  // ---------------- REF ----------------
  const yearRef = useRef(null);

  // ---------------- ANIMATION ----------------
  useEffect(() => {
    if (!yearRef.current) return;

    gsap.fromTo(
      yearRef.current,
      { opacity: 0, y: 15 },
      { opacity: 1, y: 0, duration: 0.4, ease: "power3.out" }
    );
  }, [activeYear]);


  useEffect(() => {
    const lenis = new Lenis();
    lenis.on("scroll", ScrollTrigger.update);
    const raf = (time) => {
      lenis.raf(time * 1000);
    };
    gsap.ticker.add(raf);
    gsap.ticker.lagSmoothing(0);

    let currentActiveIndex = 0;

    // Safety check for refs
    if (imgRefs.current.length !== events.length) {
      imgRefs.current = events.map(() => React.createRef());
    }

    imgRefs.current.forEach((img) => {
      if (img.current) gsap.set(img.current, { opacity: 0 })
    });

    const titleNodes = titlesContainerRef.current?.querySelectorAll("h1") || [];
    titleNodes.forEach((title, i) => {
      title.style.opacity = i === 0 ? "1" : "0.25";
    });
    const viewportHeight = window.innerHeight;
    const titlesContainerHeight = titlesContainerRef.current?.scrollHeight || 0;
    const extraScroll = viewportHeight * 2;

    // 5. Use 'events.length'
    const totalImages = events.length;
    const totalAnimationDuration = (totalImages - 1) * config.gap + config.speed;
    const scrollEndExtra = (totalAnimationDuration / 0.7) * viewportHeight;

    const trigger = ScrollTrigger.create({
      trigger: spotlightRef.current,
      start: "top top",
      end: `+=${viewportHeight + titlesContainerHeight + extraScroll + scrollEndExtra}px`,
      pin: true,
      pinSpacing: true,
      scrub: 1,
      anticipatePin: 1,
      onUpdate: (self) => {
        const progress = self.progress;
        const containerWidth = window.innerWidth * 0.3;
        const containerHeight = window.innerHeight;
        if (progress < 0.2) {
          const animationProgress = progress / 0.2;
          const moveDistance = window.innerWidth * 0.6;
          gsap.set(introTextRefs[0].current, {
            x: -animationProgress * moveDistance,
            opacity: 1,
          });
          gsap.set(introTextRefs[1].current, {
            x: animationProgress * moveDistance,
            opacity: 1,
          });
          gsap.set(bgImgRef.current, { scale: animationProgress });
          gsap.set(bgImgRef.current?.querySelector("img"), {
            scale: 1.5 - animationProgress * 0.5,
          });
          imgRefs.current.forEach((img) => {
            if (img.current) gsap.set(img.current, { opacity: 0 });
          });
          if (headerRef.current) headerRef.current.style.opacity = "0";
          gsap.set(titlesContainerRef.current, {
            opacity: 0,
            "--before-opacity": "0",
            "--after-opacity": "0",
          });
        } else if (progress > 0.2 && progress <= 0.25) {
          gsap.set(bgImgRef.current, { scale: 1 });
          gsap.set(bgImgRef.current?.querySelector("img"), { scale: 1 });
          introTextRefs.forEach((el) => gsap.set(el.current, { opacity: 0 }));
          imgRefs.current.forEach((img) => {
            if (img.current) gsap.set(img.current, { opacity: 0 });
          });
          if (headerRef.current) headerRef.current.style.opacity = "1";
          gsap.set(titlesContainerRef.current, {
            opacity: 1,
            "--before-opacity": "1",
            "--after-opacity": "1",
          });
        } else if (progress > 0.25 && progress <= 0.95) {
          gsap.set(bgImgRef.current, { scale: 1 });
          gsap.set(bgImgRef.current?.querySelector("img"), { scale: 1 });
          introTextRefs.forEach((el) => gsap.set(el.current, { opacity: 0 }));
          if (headerRef.current) headerRef.current.style.opacity = "1";
          gsap.set(titlesContainerRef.current, {
            opacity: 1,
            "--before-opacity": "1",
            "--after-opacity": "1",
          });
          let animProgress = (progress - 0.25) / 0.7;
          animProgress = Math.min(animProgress, 1);
          const overallImgProgress = animProgress * totalAnimationDuration;
          const titleHeight = titlesContainerHeight / totalImages;
          const fractionalIndex = animProgress * (totalImages - 1);
          const currentY =
            viewportHeight - fractionalIndex * titleHeight - titleHeight / 2;
          gsap.set(
            titlesContainerRef.current?.querySelector(".spotlight-titles"),
            { transform: `translateY(${currentY}px)` }
          );
          imgRefs.current.forEach((img, index) => {
            if (!img.current) return;
            const imageProgress = getImgProgressState(index, overallImgProgress);
            if (imageProgress < 0 || imageProgress > 1) {
              gsap.set(img.current, { opacity: 0 });
            } else {
              const pos = getBezierPosition(imageProgress, containerWidth, containerHeight);
              const imageHeight = 150;
              const targetCenterY = viewportHeight / 2 - imageHeight / 2;
              let drift = targetCenterY - pos.y;
              const midWeight = 1 - Math.abs(imageProgress - 0.5) * 2;
              drift *= 0.1 * midWeight;
              gsap.set(img.current, {
                x: pos.x - 100,
                y: pos.y + drift,
                opacity: 1,
                pointerEvents: "auto",
              });
            }
          });
          let closestIndex = 0;
          let closestDistance = Infinity;
          const viewportMiddle = viewportHeight / 2;
          titleNodes.forEach((title, index) => {
            const rect = title.getBoundingClientRect();
            const center = rect.top + rect.height / 2;
            const distance = Math.abs(center - viewportMiddle);
            if (distance < closestDistance) {
              closestDistance = distance;
              closestIndex = index;
            }
          });
          if (closestIndex !== currentActiveIndex) {
            titleNodes.forEach((title, i) => {
              title.style.opacity = i === closestIndex ? "1" : "0.25";
            });

            // 6. Use 'events' here
            const bgImageEl = bgImgRef.current?.querySelector("img");
            if (bgImageEl && bgImageEl.getAttribute("src") !== events[closestIndex].image) {
              bgImageEl.setAttribute("src", events[closestIndex].image);
            }

            // Fallback for year if not present in DB
            setActiveYear(getYearFromDate(events[closestIndex].date));

            currentActiveIndex = closestIndex;
          }
        } else if (progress >= 0.95) {
          if (headerRef.current) headerRef.current.style.opacity = "0";
          gsap.set(titlesContainerRef.current, {
            opacity: 0,
            "--before-opacity": "0",
            "--after-opacity": "0",
          });
        }
      },
    });
    return () => {
      trigger.kill();
      gsap.ticker.remove(raf);
      lenis.destroy();
    };
  }, [events]); // Added events as dependency

  // Modal logic (Mostly unchanged, just ensuring activeModal is safe)
  useEffect(() => {
    if (activeModal !== null || fullScreenImage !== null) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }

    if (activeModal !== null) {
      setActiveTab((tab) => (tab ? tab : "Overview"));

      const refIndex = activeModal.index;
      // Safety check
      if (!imgRefs.current[refIndex] || !imgRefs.current[refIndex].current) return;

      const imgEl = imgRefs.current[refIndex].current.querySelector("img");
      if (!imgEl) return;

      const imgRect = imgEl.getBoundingClientRect();
      gsap.set(blurBgRef.current, { opacity: 0, display: "block", backdropFilter: "blur(0px)" });
      gsap.to(blurBgRef.current, { opacity: 1, backdropFilter: "blur(8px)", duration: 0.4 });
      gsap.set(modalRef.current, {
        position: "fixed",
        top: imgRect.top,
        left: imgRect.left,
        width: imgRect.width,
        height: imgRect.height,
        borderRadius: "12px",
        opacity: 1,
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
      });
      gsap.to(modalRef.current, {
        top: "50%",
        left: "50%",
        xPercent: -50,
        yPercent: -50,
        width: "80%",
        height: "80%",
        borderRadius: "20px",
        duration: 0.6,
        ease: "power3.out",
      });
    } else {
      if (modalRef.current) gsap.set(modalRef.current, { display: "none" });
      gsap.to(blurBgRef.current, {
        opacity: 0,
        duration: 0.3,
        onComplete: () => gsap.set(blurBgRef.current, { display: "none" }),
      });
    }
  }, [activeModal, fullScreenImage]);

  // Tab animation
  useEffect(() => {
    if (tabContentRef.current) {
      gsap.fromTo(tabContentRef.current, { opacity: 0, y: 10 }, { opacity: 1, y: 0, duration: 0.3, ease: "power2.out" });
    }
  }, [activeTab]);

  const openModal = (item, index) => {
    setActiveModal({ ...item, index });
    setActiveTab("Overview");
  };

  const closeModal = () => {
    if (!activeModal) return;
    gsap.to(modalImageRef.current?.querySelector(".modal-title"), { opacity: 0, duration: 0.2 });

    // Safety check
    if (!imgRefs.current[activeModal.index] || !imgRefs.current[activeModal.index].current) {
      setActiveModal(null);
      gsap.set(modalRef.current, { display: "none" });
      return;
    }

    const imgEl = imgRefs.current[activeModal.index].current.querySelector("img");
    if (!imgEl) return;
    const imgRect = imgEl.getBoundingClientRect();
    gsap.to(modalRef.current, {
      top: imgRect.top,
      left: imgRect.left,
      xPercent: 0,
      yPercent: 0,
      width: imgRect.width,
      height: imgRect.height,
      borderRadius: "12px",
      duration: 0.6,
      ease: "power3.inOut",
      onComplete: () => {
        setActiveModal(null);
        gsap.set(modalRef.current, { display: "none" });
      },
    });
    gsap.to(blurBgRef.current, {
      opacity: 0,
      duration: 0.3,
      onComplete: () => gsap.set(blurBgRef.current, { display: "none" }),
    });
  };

  const openFullScreenImage = (imgUrl, e) => {
    e.stopPropagation();
    setFullScreenImage(imgUrl);
  };

  const closeFullScreenImage = (e) => {
    e?.stopPropagation();
    setFullScreenImage(null);
  };

  const preventScrollPropagation = (e) => {
    e.stopPropagation();
  };

  return (
    <div className="spotlight-wrapper" style={{ overflowX: "hidden" }}>

      <section className="spotlight" ref={spotlightRef}>

        <div className="spotlight-bg-img" ref={bgImgRef}>
          {/* Use event data here */}
          <img src={events[0].image} alt="" />
        </div>
        <div className="spotlight-titles-container" ref={titlesContainerRef}>
          <div className="spotlight-titles">
            {events.map((item) => (
              <h1 key={item.id || item._id}>{item.title}</h1>
            ))}
          </div>
        </div>
        <div className="spotlight-images">
          {events.map((item, i) => (
            <div
              className="spotlight-img"
              key={item.id || item._id}
              ref={imgRefs.current[i]}
              onClick={() => openModal(item, i)}
            >
              <img src={item.image} alt={item.title} />
            </div>
          ))}
        </div>
        <div className="spotlight-header" ref={headerRef}>
          <button
            className="back-btn"
            onClick={() => setIsGridView(false)}
          >
            ← Back
          </button>
          <p ref={yearRef}>{activeYear}</p>
        </div>
        <div className="scroll-indicator">
          <span>Scroll to Explore</span>
          <div className="mouse">
            <div className="wheel"></div>
          </div>
        </div>

      </section>

      {/* Modal Blur Background */}
      <div className="modal-blur-bg" ref={blurBgRef} onClick={closeModal}></div>

      {/* Modal */}
      {activeModal && (
        <div
          className="event-modal"
          ref={modalRef}
          onWheel={preventScrollPropagation}
          onTouchMove={preventScrollPropagation}
        >
          <button className="close-btn" onClick={closeModal}>
            ×
          </button>
          <div className="modal-image" ref={modalImageRef}>
            <img src={activeModal.image} alt="" />
            <div className="modal-title">
              <h2>{activeModal.title}</h2>
              <p>
                {new Date(activeModal.date).toLocaleDateString("en-GB")}
              </p>
            </div>
          </div>

          <div className="modal-navbar">
            {["Overview", "Gallery", "Highlights & Outcomes"].map((tab) => (
              <button
                key={tab}
                className={activeTab === tab ? "active" : ""}
                onClick={() => setActiveTab(tab)}
              >
                {tab}
              </button>
            ))}
          </div>
          <div
            className="modal-content !font-robert-regular"
            style={{ flex: 1, overflowY: "auto", padding: "1rem" }}
            ref={tabContentRef}
            onWheel={preventScrollPropagation}
            onTouchMove={preventScrollPropagation}
          >
            {activeTab === "Overview" && (
              <p style={{ textAlign: "justify" }}>{activeModal.fullDescription}</p>
            )}
            {activeTab === "Gallery" && (
              activeModal.gallery && activeModal.gallery.length > 0 ? (
                <div className="gallery-grid-responsive">
                  {activeModal.gallery.map((img, idx) => (
                    <img
                      key={idx}
                      src={img}
                      alt={`Gallery ${idx}`}
                      onClick={e => openFullScreenImage(img, e)}
                      className="gallery-item"
                    />
                  ))}
                </div>
              ) : (
                <p>No gallery images available.</p>
              )
            )}
            {activeTab === "Highlights & Outcomes" && (
              <div className="highlight-cards">
                <div className="highlight-card">
                  <FaMapMarkerAlt className="highlight-icon" />
                  <div>
                    <h4>Location</h4>
                    <p>{activeModal.location}</p>
                  </div>
                </div>
                <div className="highlight-card">
                  <FaUsers className="highlight-icon" />
                  <div>
                    <h4>Attendees</h4>
                    <p>{activeModal.attendees}</p>
                  </div>
                </div>
                <div style={{ marginTop: "1rem" }}>
                  <p>{activeModal.outcomes}</p>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {fullScreenImage && (
        <>
          <div
            className="fullscreen-overlay"
            onClick={closeFullScreenImage}
          ></div>
          <div className="fullscreen-image-container" onClick={closeFullScreenImage}>
            <img className="fullscreen-image" src={fullScreenImage} alt="Full Screen" />
            <button className="fullscreen-close-btn" onClick={closeFullScreenImage}>×</button>
          </div>
        </>
      )}
    </div>
  );
}