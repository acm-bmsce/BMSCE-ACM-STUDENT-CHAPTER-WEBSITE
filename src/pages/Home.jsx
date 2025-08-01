import IntroSlider from "../components/IntroSlider";
import Hero from "../components/Hero";
import About from "../components/About";
import Features from "../components/Features";
import Glance from "../components/Glance";
import Story from "../components/Story";
import Contact from "../components/Contact";

function Home() {
  return (
    <main className="relative min-h-screen w-screen overflow-x-hidden">
     
      <IntroSlider />   {/* runs once per tab session */}
      <Hero />
      <About />
      <Features />
      <Glance />
      <Story />
      <Contact />
      
    </main>
  );
}
export default Home;
