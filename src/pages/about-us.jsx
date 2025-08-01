import Hero from "../components/Hero_about";
import AboutACM from "../components/about/AboutACM";
import AboutBMSCE_ACM from "../components/about/AboutBMSCE_ACM";
import Journey from "../components/about/Journey";
import Connect from "../components/about/Connect";


function AboutUs() {
  // You must add the "return" keyword here
  return (
    <main className="relative min-h-screen w-screen overflow-x-hidden bg-black">
      
      <Hero />
      <AboutACM />
      <AboutBMSCE_ACM />
      <Journey />
      <Connect />
      
    </main>
  );
}

export default AboutUs; 