import React from 'react';
import useIntersectionObserver from '../../hooks/useIntersectionObserver';

const Home = () => {
  const [ref, isVisible] = useIntersectionObserver({ threshold: 0.2 });

  return (
    <section id="home" className="home-section" ref={ref}>
      <div className="container">
        <div className="home-content">
          <div className="home-text">
            <p className={`pre-name ${isVisible ? 'animate-in' : ''}`} style={{ animationDelay: '0s' }}>Hi, I'm</p>
            <h1 className={`name ${isVisible ? 'animate-in' : ''}`} style={{ animationDelay: '0.05s' }}>Dhivagar B</h1>
            <p className={`role ${isVisible ? 'animate-in' : ''}`} style={{ animationDelay: '0.12s' }}><strong>Java Full stack developer</strong></p>
            <p className={`tagline ${isVisible ? 'animate-in' : ''}`} style={{ animationDelay: '0.18s' }}>Software Developer | Problem Solver | Tech Enthusiast</p>
            <p className={`${isVisible ? 'animate-in' : ''}`} style={{ animationDelay: '0.24s' }}>Building interactive web apps with modern technologies. Focused on Problem Solving, Clean Code, Smart Design, and seamless user experience.</p>
            <br/>
            <a href="#projects" className={`cta-button ${isVisible ? 'animate-in' : ''}`} style={{ animationDelay: '0.36s' }}>View My Work</a>
          </div>
          <div className="home-image-frame photo-gap">
            <img src="../Squared_1.jpg" alt="My Picture" />
          </div>
        </div>
      </div>
    </section>
  );
};

export default Home;
