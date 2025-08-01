import NavBar from "../components/Navbar";
import Hero from "../components/Hero_JoinUs";
import HeroSection from "../components/HeroSection_JoinUs";
import Features from "../components/Features_JoinUs";
import Membership from "../components/Membership_JoinUs";
import Dummy from "../components/Dummy_JoinUs";
import Contact from "../components/Contact_JoinUs";
import Footer from "../components/Footer_about";

function App() {
  return (
    <main className="relative min-h-screen w-screen overflow-x-hidden">
      <NavBar />
      <HeroSection />
      <Features />
      <Membership />
      <Dummy />
      <Contact />
      <Dummy />
      <Footer />
    </main>
  );
}

export default App;
