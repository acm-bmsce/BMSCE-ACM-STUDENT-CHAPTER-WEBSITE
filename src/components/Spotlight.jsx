// Spotlight.jsx
import React, { useEffect, useRef, useState } from "react";
import "./Spotlight.css";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "@studio-freight/lenis";
import { FaMapMarkerAlt, FaUsers } from "react-icons/fa";
import eventData from "./Data2_event";
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

export default function Spotlight() {
  const spotlightRef = useRef();
  const titlesContainerRef = useRef();
  const introTextRefs = [useRef(), useRef()];
  const bgImgRef = useRef();
  const headerRef = useRef();
  const imgRefs = useRef(eventData.map(() => React.createRef()));

  const [activeModal, setActiveModal] = useState(null);
  const modalRef = useRef();
  const modalImageRef = useRef();
  const blurBgRef = useRef();
  const [activeTab, setActiveTab] = useState("Overview");
  const overviewRef = useRef();
  const [overviewVisible, setOverviewVisible] = useState(false);
  const tabContentRef = useRef();

  // Spotlight scroll animation
  useEffect(() => {
    const lenis = new Lenis();
    lenis.on("scroll", ScrollTrigger.update);
    gsap.ticker.add((time) => lenis.raf(time * 1000));
    gsap.ticker.lagSmoothing(0);

    let currentActiveIndex = 0;
    imgRefs.current.forEach((img) => gsap.set(img.current, { opacity: 0 }));

    const titleNodes = titlesContainerRef.current.querySelectorAll("h1");
    titleNodes.forEach((title, i) => {
      title.style.opacity = i === 0 ? "1" : "0.25";
    });

    const viewportHeight = window.innerHeight;
    const titlesContainerHeight = titlesContainerRef.current.scrollHeight;
    const extraScroll = viewportHeight * 2;
    const totalImages = eventData.length;
    const totalAnimationDuration =
      (totalImages - 1) * config.gap + config.speed;
    const scrollEndExtra = (totalAnimationDuration / 0.7) * viewportHeight;

    ScrollTrigger.create({
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
          gsap.set(bgImgRef.current.querySelector("img"), {
            scale: 1.5 - animationProgress * 0.5,
          });

          imgRefs.current.forEach((img) => gsap.set(img.current, { opacity: 0 }));
          headerRef.current.style.opacity = "0";
          gsap.set(titlesContainerRef.current, {
            opacity: 0,
            "--before-opacity": "0",
            "--after-opacity": "0",
          });
        } else if (progress > 0.2 && progress <= 0.25) {
          gsap.set(bgImgRef.current, { scale: 1 });
          gsap.set(bgImgRef.current.querySelector("img"), { scale: 1 });
          introTextRefs.forEach((el) => gsap.set(el.current, { opacity: 0 }));
          imgRefs.current.forEach((img) => gsap.set(img.current, { opacity: 0 }));

          headerRef.current.style.opacity = "1";
          gsap.set(titlesContainerRef.current, {
            opacity: 1,
            "--before-opacity": "1",
            "--after-opacity": "1",
          });
        } else if (progress > 0.25 && progress <= 0.95) {
          gsap.set(bgImgRef.current, { scale: 1 });
          gsap.set(bgImgRef.current.querySelector("img"), { scale: 1 });
          introTextRefs.forEach((el) => gsap.set(el.current, { opacity: 0 }));

          headerRef.current.style.opacity = "1";
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
            titlesContainerRef.current.querySelector(".spotlight-titles"),
            { transform: `translateY(${currentY}px)` }
          );

          imgRefs.current.forEach((img, index) => {
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
            const bgImageEl = bgImgRef.current.querySelector("img");
            if (bgImageEl && bgImageEl.getAttribute("src") !== eventData[closestIndex].image) {
              bgImageEl.setAttribute("src", eventData[closestIndex].image);
            }
            currentActiveIndex = closestIndex;
          }
        } else if (progress >= 0.95) {
          headerRef.current.style.opacity = "0";
          gsap.set(titlesContainerRef.current, {
            opacity: 0,
            "--before-opacity": "0",
            "--after-opacity": "0",
          });
        }
      },
    });

    return () => {
      ScrollTrigger.killAll();
      gsap.ticker.remove((time) => lenis.raf(time * 1000));
      lenis.destroy();
    };
  }, []);

  // --- MODAL ANIMATION ---
  useEffect(() => {
    if (activeModal !== null) {
      document.body.style.overflow = "hidden";
      setActiveTab("Overview"); // Reset tab to Overview on every modal open

      const imgEl = imgRefs.current[activeModal.index].current.querySelector("img");
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
        onComplete: () => {
          if (activeTab === "Overview") {
            gsap.fromTo(overviewRef.current, { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.4 });
            setOverviewVisible(true);
          }
        },
      });
    } else {
      document.body.style.overflow = "auto";
    }
  }, [activeModal]);

  useEffect(() => {
    if (tabContentRef.current) {
      gsap.fromTo(tabContentRef.current, { opacity: 0, y: 10 }, { opacity: 1, y: 0, duration: 0.3, ease: "power2.out" });
    }
  }, [activeTab]);

  const openModal = (item, index) => {
    setOverviewVisible(false);
    setActiveTab("Overview");
    setActiveModal({ ...item, index });
  };

  const closeModal = () => {
    if (!activeModal) return;
    gsap.to(modalImageRef.current.querySelector(".modal-title"), { opacity: 0, duration: 0.2 });
    const imgEl = imgRefs.current[activeModal.index].current.querySelector("img");
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

    gsap.to(blurBgRef.current, { opacity: 0, duration: 0.3, onComplete: () => gsap.set(blurBgRef.current, { display: "none" }) });
  };

  return (
    <div className="spotlight-wrapper" style={{ overflowX: "hidden" }}>
      <section
        className="intro flex flex-col gap-4"
        style={{
          backgroundImage:
            "linear-gradient(rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.75)), url('/img/events-bg.webp')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }}
      >
        <AnimatedTitle title="A CURATED SERIES<br />OF TRANSFORMATIVE DAYS" containerClass="animated-title_joinus !text-white text-center mb-2" />
        <p>Learn, Connect, and Create — one event at a time.</p>
      </section>

      <section className="spotlight" ref={spotlightRef}>
        <div className="spotlight-intro-text-wrapper">
          <div className="spotlight-intro-text" ref={introTextRefs[0]}><p>Connect</p></div>
          <div className="spotlight-intro-text" ref={introTextRefs[1]}><p>Collaborate</p></div>
        </div>

        <div className="spotlight-bg-img" ref={bgImgRef}><img src={eventData[0].image} alt="" /></div>

        <div className="spotlight-titles-container" ref={titlesContainerRef}>
          <div className="spotlight-titles">{eventData.map((item) => (<h1 key={item.id}>{item.title}</h1>))}</div>
        </div>

        <div className="spotlight-images">{eventData.map((item, i) => (<div className="spotlight-img" key={item.id} ref={imgRefs.current[i]} onClick={() => openModal(item, i)}><img src={item.image} alt={item.title} /></div>))}</div>

        <div className="spotlight-header" ref={headerRef}><p>2025</p></div>
      </section>

      <div className="modal-blur-bg" ref={blurBgRef}></div>

      {activeModal && (
        <div className="event-modal" ref={modalRef}>
          <button className="close-btn" onClick={closeModal}>×</button>
          <div className="modal-image" ref={modalImageRef}>
            <img src={activeModal.image} alt="" />
            <div className="modal-title">
              <h2>{activeModal.title}</h2>
              <p>{activeModal.date}</p>
            </div>
          </div>
          <div className="modal-navbar">
            {["Overview", "Gallery", "Highlights & Outcomes"].map((tab) => (
              <button key={tab} className={activeTab === tab ? "active" : ""} onClick={() => setActiveTab(tab)}>{tab}</button>
            ))}
          </div>
          <div className="modal-content !font-robert-regular" style={{ flex: 1, overflowY: "auto", padding: "1rem" }} ref={tabContentRef}>
            {activeTab === "Overview" && (<p ref={overviewRef} style={{ opacity: overviewVisible ? 1 : 0, textAlign: "justify" }}>{activeModal.fullDescription}</p>)}

            {activeTab === "Gallery" && (
              activeModal.gallery.length > 0 ? (
                <div className="gallery-grid">
                  {activeModal.gallery.map((img, idx) => (<img key={idx} src={img} alt={`Gallery ${idx}`} />))}
                </div>
              ) : (
                <p>No gallery images available.</p>
              )
            )}

            {activeTab === "Highlights & Outcomes" && (
              <div className="highlight-cards">
                <div className="highlight-card"><FaMapMarkerAlt className="highlight-icon" /><div><h4>Location</h4><p>{activeModal.location}</p></div></div>
                <div className="highlight-card"><FaUsers className="highlight-icon" /><div><h4>Attendees</h4><p>{activeModal.attendees}</p></div></div>
                <div style={{ marginTop: "1rem" }}><p>{activeModal.outcomes}</p></div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
