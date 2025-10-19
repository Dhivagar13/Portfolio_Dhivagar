import React from 'react';
import Header from './header/Header';
import Footer from './footer/Footer';
import Home from './home/Home';
import About from './about/About';
import Skills from './skills/Skills';
import Projects from './projects/Projects';
import Credentials from './credentials/Credentials';
import Contact from './contact/Contact';

function App() {
  return (
    <>
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
    </>
  );
}

export default App;