import React from 'react';
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

import VantaBackground from './components/VantaBackground/VantaBackground';

function App() {
  return (
    <div className="App">
      <VantaBackground />
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


