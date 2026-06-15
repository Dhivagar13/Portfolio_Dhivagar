import React, { useState, useEffect, useRef } from 'react';
import Lenis from 'lenis';
import './App.css';

// Import Components
import Header from './components/Header/Header';
import Home from './components/Home/Home';
import DynamicProfile from './components/DynamicProfile/DynamicProfile';
import Skills from './components/Skills/Skills';
import Projects from './components/Projects/Projects';
import Showcase from './components/Showcase/Showcase';

import Contact from './components/Contact/Contact';
import Footer from './components/Footer/Footer';

import OceanBackground from './components/OceanBackground/OceanBackground';
import KineticDotsLoader from './components/Loader/KineticDotsLoader';
import { MagneticCursor } from './components/ui/magnetic-cursor';
import ChatbotWidget from './components/ChatbotWidget/ChatbotWidget';

function App() {
  const [loading, setLoading] = useState(true);
  const lenisRef = useRef(null);

  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.0,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      smoothTouch: true,
      touchMultiplier: 1.5,
    });

    lenisRef.current = lenis;
    window.lenis = lenis;

    function raf(time) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);

    return () => {
      lenis.destroy();
    };
  }, []);

  return (
    <MagneticCursor
      magneticFactor={0.1}
      blendMode="difference"
      cursorSize={24}
    >
      <div className="App">
        {loading && <KineticDotsLoader onFinish={() => setLoading(false)} />}
        <OceanBackground lenis={lenisRef} />
        <Header />
        <main>
          <Home />
          <DynamicProfile />
          <Skills />
          <Projects />
          <Showcase />

          <Contact />
        </main>
        <Footer />
        {!loading && <ChatbotWidget />}
      </div>
    </MagneticCursor>
  );
}

export default App;


