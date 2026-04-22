import React, { useState } from 'react';
import './App.css';

// Import Components
import Header from './components/Header/Header';
import Home from './components/Home/Home';
import About from './components/About/About';
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

  return (
    <MagneticCursor
      magneticFactor={0.1}
      blendMode="difference"
      cursorSize={24}
    >
      <div className="App">
        {loading && <KineticDotsLoader onFinish={() => setLoading(false)} />}
        <OceanBackground />
        <Header />
        <main>
          <Home />
          <About />
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


