import { lazy, Suspense, useEffect, useLayoutEffect, useRef } from "react";
import GradualBlur from "./components/reactbits/GradualBlur";
import { pageOf } from "./lib/eventLinks";
import { BrowserRouter, Navigate, Route, Routes, useLocation, useNavigationType } from "react-router-dom";
import SmoothScroll, { scrollToTop } from "./components/SmoothScroll";
import Header from "./components/Header";
import Footer from "./components/Footer";
import Preloader from "./components/Preloader";
import ErrorBoundary from "./components/ErrorBoundary";
import { useRevealRoot, useScrollFX } from "./lib/motion";
import PageTransition from "./components/PageTransition";
import Home from "./pages/Home";

const About = lazy(() => import("./pages/About"));
const Events = lazy(() => import("./pages/Events"));
const Team = lazy(() => import("./pages/Team"));
const Join = lazy(() => import("./pages/Join"));
const Projects = lazy(() => import("./pages/Projects"));
const Placements = lazy(() => import("./pages/Placements"));
const NotFound = lazy(() => import("./pages/NotFound"));

const AdminLogin = lazy(() => import("./pages/admin/AdminLogin"));
const AdminLayout = lazy(() => import("./pages/admin/AdminLayout"));
const AdminDashboard = lazy(() => import("./pages/admin/AdminDashboard"));
const ManageEvents = lazy(() => import("./pages/admin/ManageEvents"));
const ManageProjects = lazy(() => import("./pages/admin/ManageProjects"));
const ManageInsights = lazy(() => import("./pages/admin/ManageInsights"));
const SiteContent = lazy(() => import("./pages/admin/SiteContent"));
const ManageUsers = lazy(() => import("./pages/admin/ManageUsers"));

// Warm every public page once the browser is idle, so page changes never wait on a download.
const prefetch = () =>
  [
    () => import("./pages/Events"),
    () => import("./pages/About"),
    () => import("./pages/Team"),
    () => import("./pages/Join"),
    () => import("./pages/Projects"),
    () => import("./pages/Placements"),
  ].forEach((load) => load().catch(() => {}));

function Routed() {
  const location = useLocation();
  const navType = useNavigationType();

  // Layout effect: a new page starts at the top before it is painted. Only a change of page
  // counts: opening or closing an event window (a ?query change) must keep your place.
  const lastPath = useRef(null);
  useLayoutEffect(() => {
    const first = lastPath.current === null;
    const page = pageOf(location.pathname);
    const moved = lastPath.current !== page;
    lastPath.current = page;
    if (!moved) return;
    if (first && location.hash) return;
    if (navType !== "POP" || !location.hash) scrollToTop();
  }, [location.pathname, navType, location.hash]);

  useEffect(() => {
    const idle = window.requestIdleCallback || ((fn) => setTimeout(fn, 1500));
    idle(prefetch);
  }, []);

  return (
    <main id="main" key={pageOf(location.pathname)} className="page-in">
      <Suspense fallback={<div className="route-fallback" style={{ minHeight: "100vh" }} />}>
        <Routes location={location}>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/about-us" element={<Navigate to="/about" replace />} />
          <Route path="/events" element={<Events />} />
          <Route path="/events/:slug" element={<Events />} />
          {/* The previous site's registration pages; sign-ups now use each event's own link. */}
          <Route path="/events/:slug/register" element={<Navigate to="/events" replace />} />
          <Route path="/event" element={<Navigate to="/events" replace />} />
          <Route path="/archive" element={<Navigate to="/events" replace />} />
          <Route path="/team" element={<Team />} />
          <Route path="/join" element={<Join />} />
          <Route path="/join-us" element={<Navigate to="/join" replace />} />
          <Route path="/projects" element={<Projects />} />
          <Route path="/placements" element={<Placements />} />
          {/* My ACM, accounts and certificate checks were removed; old links land on Home. */}
          <Route path="/login" element={<Navigate to="/" replace />} />
          <Route path="/account/*" element={<Navigate to="/" replace />} />
          <Route path="/verify" element={<Navigate to="/" replace />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Suspense>
    </main>
  );
}

function AdminRoutes() {
  return (
    <Suspense fallback={<div className="adm" style={{ minHeight: "100vh" }} />}>
      <Routes>
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<Navigate to="/admin/dashboard" replace />} />
          <Route path="dashboard" element={<AdminDashboard />} />
          <Route path="events" element={<ManageEvents />} />
          <Route path="projects" element={<ManageProjects />} />
          <Route path="insights" element={<ManageInsights />} />
          <Route path="content" element={<SiteContent />} />
          <Route path="users" element={<ManageUsers />} />
          {/* The previous site's admin address for Insight Series stories. */}
          <Route path="placements" element={<Navigate to="/admin/insights" replace />} />
          <Route path="*" element={<Navigate to="/admin/dashboard" replace />} />
        </Route>
      </Routes>
    </Suspense>
  );
}

/** Dev only (?grid=1): the 12-column grid over the page, for alignment checks. */
function GridOverlay() {
  return (
    <div className="grid-ov" aria-hidden="true">
      <div className="wrap">
        {Array.from({ length: 12 }, (_, i) => (
          <span key={i} />
        ))}
      </div>
    </div>
  );
}

function Site() {
  const root = useRef(null);
  useRevealRoot(root);
  useScrollFX(root);
  return (
    <SmoothScroll>
      <div className="site" ref={root}>
        <a href="#main" className="skip-link">
          Skip to content
        </a>
        <Preloader />
        <Header />
        <Routed />
        <div className="scroll-bar" aria-hidden="true" />
        {/* Content softens into the bottom edge of the screen; gone once the page's end is reached. */}
        <GradualBlur target="page" position="bottom" height="4.5rem" strength={1.2} layers={6} curve="bezier" tint="rgba(0, 0, 0, 0.45)" autoHide zIndex={25} />
        <PageTransition />
        {import.meta.env.DEV && new URLSearchParams(window.location.search).has("grid") && <GridOverlay />}
        <Footer />
      </div>
    </SmoothScroll>
  );
}

function Shell() {
  const location = useLocation();
  return location.pathname.startsWith("/admin") ? <AdminRoutes /> : <Site />;
}

export default function App() {
  return (
    <BrowserRouter>
      <ErrorBoundary>
        <Shell />
      </ErrorBoundary>
    </BrowserRouter>
  );
}
