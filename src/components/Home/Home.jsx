import React from 'react';
import './Home.css';
import profileImage from '../../../assests/dhiv.png';

const Home = () => {
  return (
    <section id="home" className="home-section-dramatic">
      <div className="hero-container">
        {/* Background Text stroke */}
        <div className="hero-name-bg">
          DHIVAGAR B
        </div>
        
        {/* Foreground Portrait */}
        <div className="hero-image-wrapper">
          <img src={profileImage} alt="Dhivagar B" className="hero-portrait" />
        </div>

        {/* Foreground Subtitle */}
        <div className="hero-subtitle-fg">
          FULL STACK ENGINEER
        </div>
      </div>

      {/* Continuously Scrolling Marquee */}
      <div className="hero-marquee-container">
        <div className="hero-marquee-track">
          {Array(4).fill(0).map((_, i) => (
             <div className="hero-marquee-content" key={i}>
                DHIVAGAR B ✦ FULL STACK ENGINEER ✦ CREATIVE TECHNOLOGIST ✦ SYSTEM ARCHITECT ✦ CODE INNOVATOR ✦ SOLUTION BUILDER ✦
             </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Home;
