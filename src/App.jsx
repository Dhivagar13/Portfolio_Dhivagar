import React, { useState } from 'react';
import './App.css';

// Import Components
import Header from './components/Header/Header';
import Home from './components/Home/Home';
import About from './components/About/About';
import Skills from './components/Skills/Skills';
import Projects from './components/Projects/Projects';
import Credentials from "./components/Achievements/Achievements";
import Contact from './components/Contact/Contact';
import Footer from './components/Footer/Footer';

import StellarBackground from './components/StellarBackground/StellarBackground';
import KineticDotsLoader from './components/Loader/KineticDotsLoader';

function App() {
  const [loading, setLoading] = useState(true);

  return (
    <div className="App">
      {loading && <KineticDotsLoader onFinish={() => setLoading(false)} />}
      <StellarBackground />
      <Header />
      <main>
        <Home />
        <About />
        <Skills />
        <Projects />
        <Credentials />
        <Contact />
      </main>
      <Footer />
    </div>
  );
}

export default App;


