import Hero from "../components/Hero_about";
import AboutACM from "../components/about/AboutACM";
import AboutBMSCE_ACM from "../components/about/AboutBMSCE_ACM";
import Journey from "../components/about/Journey";
import GetInTouch from "../components/about/GetInTouch";


function AboutUs() {
  // You must add the "return" keyword here
  return (
    <main className="relative min-h-screen w-screen overflow-x-hidden bg-black">
      
      <Hero />
      <AboutACM />
      <AboutBMSCE_ACM />
      <Journey />
      <GetInTouch />
      
    </main>
  );
}

export default AboutUs; 