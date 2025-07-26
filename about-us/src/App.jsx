// src/App.jsx

import Hero from './components/Hero';
import AboutACM from './components/about/AboutACM';
import AboutBMSCE_ACM from './components/about/AboutBMSCE_ACM';
import Journey from './components/about/Journey';
import Connect from './components/about/Connect';
import Navbar from './components/NavBar';
import Footer from './components/Footer';

function App() {
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

export default App;