import Hero from "../components/Hero_about";
import AboutACM from "../components/about/AboutACM";
import AboutBMSCE_ACM from "../components/about/AboutBMSCE_ACM";
import Journey from "../components/about/Journey";
import GetInTouch from "../components/about/GetInTouch";
import MagicBento from "../components/about/MagicBento";


function AboutUs() {
  // You must add the "return" keyword here
  return (
    <main className="relative min-h-screen w-screen overflow-x-hidden bg-black">

      <Hero />
      <AboutACM />
      <AboutBMSCE_ACM />
      <Journey />
      

      <MagicBento
        textAutoHide={true}
        enableStars={true}
        enableSpotlight={true}
        enableBorderGlow={true}
        enableTilt={true}
        enableMagnetism={true}
        clickEffect={true}
        spotlightRadius={400}
        particleCount={12}
        glowColor="52, 171, 235"
      />
      <GetInTouch />

    </main>
  );
}

export default AboutUs; 