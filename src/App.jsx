import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import JoinUs from "./pages/join-us";
import AboutUs from "./pages/about-us";
import Team from "./pages/team";

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/join-us" element={<JoinUs />} />
        <Route path="/about-us" element={<AboutUs />} />
        <Route path="/team" element={<Team />} />
      </Routes>
    </Router>
  );
}
