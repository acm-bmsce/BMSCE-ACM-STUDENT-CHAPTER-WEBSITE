import { useEffect, useRef, useState } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
} from "react-router-dom";
import gsap from "gsap";
// Pages
import Home from "./pages/Home";
import JoinUs from "./pages/join-us";
import AboutUs from "./pages/about-us";
import Team from "./pages/team";
import Event from "./pages/event";
// Components
import ScrollToTop from "./components/ScrollToTop";
import NavBar from "./components/Navbar";
import Footer from "./components/Footer";

const ease = "power4.inOut";

function AnimatedRoutes() {
  const location = useLocation();
  const transitionRef = useRef();
  const [displayLocation, setDisplayLocation] = useState(location);
  const [isTransitioning, setIsTransitioning] = useState(false);

  useEffect(() => {
    let isMounted = true;

    const animateTransition = () => {
      return new Promise((resolve) => {
        if (!transitionRef.current) return resolve();
        const blocks = transitionRef.current.querySelectorAll(".block");
        gsap.set(blocks, { scaleY: 0, visibility: "visible" });
        gsap.to(blocks, {
          scaleY: 1,
          duration: 0.7,
          stagger: {
            each: 0.1,
            from: "start",
            grid: [2, 5],
            axis: "x",
          },
          ease,
          onStart: () => setIsTransitioning(true), // 🟢 Start transition
          onComplete: resolve,
        });
      });
    };

    const revealTransition = () => {
      return new Promise((resolve) => {
        if (!transitionRef.current) return resolve();
        const blocks = transitionRef.current.querySelectorAll(".block");
        gsap.to(blocks, {
          scaleY: 0,
          duration: 0.7,
          stagger: {
            each: 0.1,
            from: "start",
            grid: "auto",
            axis: "x",
          },
          ease,
          onComplete: () => {
            gsap.set(".block", { visibility: "visible" });
            resolve();
            setIsTransitioning(false); // 🟢 End transition
          },
        });
      });
    };

    animateTransition().then(() => {
      if (isMounted) setDisplayLocation(location);
      setTimeout(() => {
        revealTransition();
      }, 0);
    });

    return () => {
      isMounted = false;
    };
  }, [location]);

  return (
    <>
      {/* Page transition overlay */}
      <div
        ref={transitionRef}
        className="transition fixed top-0 left-0 w-screen h-screen flex flex-col z-50 pointer-events-none"
      >
        <div className="transition-row row-1 flex">
          {Array(5)
            .fill(0)
            .map((_, i) => (
              <div
                key={`top-${i}`}
                className="block flex-1 bg-cyan-400 origin-top scale-y-1"
              />
            ))}
        </div>
        <div className="transition-row row-2 flex">
          {Array(5)
            .fill(0)
            .map((_, i) => (
              <div
                key={`bottom-${i}`}
                className="block flex-1 bg-cyan-400 origin-bottom scale-y-1"
              />
            ))}
        </div>
      </div>

      {/* Content */}
      <div key={displayLocation.pathname}>
        {!isTransitioning && <NavBar />}
        <Routes location={displayLocation}>
          <Route path="/" element={<Home />} />
          <Route path="/join-us" element={<JoinUs />} />
          <Route path="/about-us" element={<AboutUs />} />
          <Route path="/team" element={<Team />} />
          <Route path="/event" element={<Event />} />
        </Routes>
        {!isTransitioning && <Footer />}
      </div>
    </>
  );
}


function App() {
  return (
    <Router>
      <ScrollToTop />
      <AnimatedRoutes />
    </Router>
  );
}

export default App;
