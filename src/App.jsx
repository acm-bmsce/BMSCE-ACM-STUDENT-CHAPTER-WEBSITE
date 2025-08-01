import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import JoinUs from "./pages/join-us";
import AboutUs from "./pages/about-us";
import Team from "./pages/team";
import Event from "./pages/event"
import ScrollToTop from "./components/ScrollToTop";
import NavBar from "./components/Navbar";
import Footer from "./components/Footer"

export default function App() {
  return (
    <Router>
      <ScrollToTop />
      <NavBar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/join-us" element={<JoinUs />} />
        <Route path="/about-us" element={<AboutUs />} />
        <Route path="/team" element={<Team />} />
        <Route path="/event" element={<Event />} />
      </Routes>
      <Footer />

    </Router>
  );
}