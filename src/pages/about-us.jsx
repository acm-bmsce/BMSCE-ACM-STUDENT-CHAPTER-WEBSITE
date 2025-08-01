import Hero from "../components/Hero_about";
import Navbar from "../components/Navbar";
import AboutACM from "../components/about/AboutACM";
import AboutBMSCE_ACM from "../components/about/AboutBMSCE_ACM";
import Journey from "../components/about/Journey";
import Connect from "../components/about/Connect";
import Footer from "../components/Footer_about";
import ScrollToTop from "../components/ScrollToTop";

function AboutUs() {
  // You must add the "return" keyword here
  return (
    <main className="relative min-h-screen w-screen overflow-x-hidden bg-black">
      <Navbar />
      <Hero />
      <AboutACM />
      <AboutBMSCE_ACM />
      <Journey />
      <Connect />
      <Footer />
    </main>
  );
}

export default AboutUs; 