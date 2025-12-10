import { useEffect, useRef, useState, lazy, Suspense } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
  useNavigationType,
} from "react-router-dom";
import gsap from "gsap";

// Components
import ScrollToTop from "./components/ScrollToTop";
import NavBar from "./components/Navbar";
import Footer from "./components/Footer";
import SmoothScroll from "./components/SmoothScroll";
import ScrollToTopButton from "./components/ScrollToTopButton";
import Loader from "./components/Loader";

// Sound
import transitionSound from "./assets/sounds/transition.mp3";

// Eager-loaded Home
import Home from "./pages/Home";

// Lazy-loaded Pages
const JoinUs = lazy(() => import("./pages/join-us"));
const AboutUs = lazy(() => import("./pages/about-us"));
const Team = lazy(() => import("./pages/team"));
const Event = lazy(() => import("./pages/event"));
const Projects = lazy(() => import("./pages/projects"));
const PlacementPage = lazy(() => import("./pages/PlacementPage"));

// --- ADMIN IMPORTS ---
import AdminLogin from "./pages/admin/AdminLogin";
import AdminLayout from "./pages/admin/AdminLayout";
import DashboardHome from "./pages/admin/DashboardHome";
import ManageEvents from "./pages/admin/ManageEvents";
import ManageProjects from "./pages/admin/ManageProjects";
import ManagePlacements from "./pages/admin/ManagePlacements";
import ManageUsers from "./pages/admin/ManageUsers";

const ease = "power4.inOut";

function AnimatedRoutes() {
  const location = useLocation();
  const navigationType = useNavigationType();

  const transitionRef = useRef();
  const audioRef = useRef(null);
  const prevPathRef = useRef(location.pathname);

  const [displayLocation, setDisplayLocation] = useState(location);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [firstLoad, setFirstLoad] = useState(true);

  // Check if current path is part of the Admin panel
  const isAdminRoute = location.pathname.startsWith("/admin");

  // Audio Effect
  useEffect(() => {
    // Skip sound for admin routes
    if (isAdminRoute) return;

    audioRef.current = new Audio(transitionSound);
    audioRef.current.volume = 0.6;
  }, [isAdminRoute]);

  // Transition Animation Effect
  useEffect(() => {
    // If Admin route, skip animations and update location immediately
    if (isAdminRoute) {
      setDisplayLocation(location);
      setIsTransitioning(false);
      return;
    }

    const fromPath = prevPathRef.current;
    const toPath = location.pathname;
    const isSameRoute = fromPath === toPath;
    const isPageReload = navigationType === "POP";

    if (firstLoad || isPageReload) {
      prevPathRef.current = location.pathname;
      setDisplayLocation(location);
      setIsTransitioning(false);
      setFirstLoad(false);

      const blocks = transitionRef.current?.querySelectorAll(".block") || [];
      blocks.forEach((block) => {
        gsap.set(block, { scaleY: 0, visibility: "hidden" });
      });
      return;
    }

    if (isSameRoute) {
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }

    const animateTransition = () => {
      return new Promise((resolve) => {
        if (!transitionRef.current) return resolve();

        if (audioRef.current) {
          audioRef.current.currentTime = 0;
          audioRef.current.play().catch((err) => {
            console.warn("Audio play failed:", err);
          });
        }

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
          onStart: () => setIsTransitioning(true),
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
            gsap.set(blocks, { visibility: "hidden" });
            setIsTransitioning(false);

            setTimeout(() => {
              window.scrollTo({ top: 0, behavior: "auto" });
            }, 0);

            resolve();
          },
        });
      });
    };

    animateTransition().then(() => {
      setDisplayLocation(location);
      prevPathRef.current = location.pathname;
      revealTransition();
    });
  }, [location, navigationType, firstLoad, isAdminRoute]);

  return (
    <>
      {/* Page transition overlay - Hidden on Admin routes */}
      {!isAdminRoute && (
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
                  className="block flex-1 bg-cyan-400 origin-top scale-y-0 invisible"
                />
              ))}
          </div>
          <div className="transition-row row-2 flex">
            {Array(5)
              .fill(0)
              .map((_, i) => (
                <div
                  key={`bottom-${i}`}
                  className="block flex-1 bg-cyan-400 origin-bottom scale-y-0 invisible"
                />
              ))}
          </div>
        </div>
      )}

      {/* Main content */}
      <div key={displayLocation.key || displayLocation.pathname}>
        
        {/* Navbar: Only show if NOT transitioning AND NOT in admin panel */}
        {!isTransitioning && !isAdminRoute && <NavBar />}
        
        <Routes location={displayLocation}>
          {/* Public Routes */}
          <Route path="/" element={<Home />} />
          <Route
            path="/join-us"
            element={
              <Suspense fallback={<Loader />}>
                <JoinUs />
              </Suspense>
            }
          />
          <Route
            path="/about-us"
            element={
              <Suspense fallback={<Loader />}>
                <AboutUs />
              </Suspense>
            }
          />
          <Route
            path="/team"
            element={
              <Suspense fallback={<Loader />}>
                <Team />
              </Suspense>
            }
          />
          <Route
            path="/event"
            element={
              <Suspense fallback={<Loader />}>
                <Event />
              </Suspense>
            }
          />
          <Route
            path="/projects"
            element={
              <Suspense fallback={<Loader />}>
                <Projects />
              </Suspense>
            }
          />
          <Route
            path="/placements"
            element={
              <Suspense fallback={<Loader />}>
                <PlacementPage />
              </Suspense>
            }
          />

          {/* Admin Routes */}
          <Route path="/admin/login" element={<AdminLogin />} />
          
          <Route path="/admin" element={<AdminLayout />}>
             <Route path="users" element={<ManageUsers />} />
             <Route path="dashboard" element={<DashboardHome />} />
             {/* Placeholders for future pages */}
             <Route path="events" element={<ManageEvents />} />
             <Route path="projects" element={<ManageProjects />} />
             <Route path="placements" element={<ManagePlacements />} />
          </Route>

        </Routes>

        {/* Footer: Only show if NOT transitioning AND NOT in admin panel */}
        {!isTransitioning && !isAdminRoute && <Footer />}
      </div>
    </>
  );
}

function App() {
  // We need to check location here too to hide ScrollToTopButton on admin pages
  // But Router is inside App, so we can't use useLocation() here directly.
  // Ideally, move ScrollToTopButton inside AnimatedRoutes or make a wrapper.
  // For now, we will leave it, or you can wrap it in a logic component.
  
  return (
    <Router>
      <ScrollToTop />
      <SmoothScroll />
      <AnimatedRoutes />
      
      {/* Note: If you want to hide this button on Admin pages too, 
         you should move this component inside 'AnimatedRoutes' 
         and use the 'isAdminRoute' check.
      */}
      <ScrollToTopButton /> 
    </Router>
  );
}

export default App;