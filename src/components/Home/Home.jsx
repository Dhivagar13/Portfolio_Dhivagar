/*
import React from 'react';
import useIntersectionObserver from '../../hooks/useIntersectionObserver';
import MyPhoto from '../../assets/Squared_1.jpg';

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
            <img src={MyPhoto} alt="My Picture" />
          </div>
        </div>
      </div>
    </section>
  );
};

export default Home;
*/
import React, { useEffect, useState } from 'react';
import './Home.css';
import { FaDownload } from "react-icons/fa";
import profileImage from '../../assets/Squared_1.jpg';

const Home = () => {
  const [visible, setVisible] = useState(false);
  const [text, setText] = useState("");
  const [wordIndex, setWordIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);

  const words = [
    "Full Stack Developer",
    "Web Designer",
    "Tech Enthusiast",
    "Problem Solver"
  ];

  useEffect(() => {
    const timer = setTimeout(() => setVisible(true), 200);
    return () => clearTimeout(timer);
  }, []);

  // Typing animation logic
  useEffect(() => {
    const current = words[wordIndex];
    let typingSpeed = isDeleting ? 50 : 120;

    const type = () => {
      setText(prev =>
        isDeleting
          ? current.substring(0, prev.length - 1)
          : current.substring(0, prev.length + 1)
      );

      if (!isDeleting && text === current) {
        setTimeout(() => setIsDeleting(true), 1000);
      } else if (isDeleting && text === "") {
        setIsDeleting(false);
        setWordIndex(prev => (prev + 1) % words.length);
      }
    };

    const timer = setTimeout(type, typingSpeed);
    return () => clearTimeout(timer);
  }, [text, isDeleting, wordIndex]);

  return (
    <section id="home" className={`home-section ${visible ? 'visible' : ''}`}>
      <div className="home-content pop-up">
        {/* Left side - Image */}
        <div className="about-image">
          <div className="image-wrapper">
            <div className="image-placeholder">
              <img src={profileImage} alt="Profile" className="profile-image" />
            </div>
          </div>
        </div>

        {/* Right side - Text */}
        <div className="text-content">
          <h1 className="greeting">Hi, I'm</h1>
          <h2 className="name">Dhivagar B</h2>
          <h3 className="subtitle">
            {text}
            <span className="cursor">|</span>
          </h3>
          <p className="intro-text">
            Building interactive web apps with modern technologies. Focused on Problem Solving,
            Clean Code, Smart Design, and seamless user experience.
          </p>
          <div className="button-container">
            <a className="scroll-button" onClick={() => document.getElementById('contact').scrollIntoView({ behavior: 'smooth' })}>
              <span>Get In Touch</span>
            </a>
            <a href="https://drive.google.com/uc?export=download&id=1Y7DUKj1Va2nSTfeLGxj3sdF5fC89fGD0" download="Dhivagar_B_CV.pdf" className="download-btn" target="_blank" rel="noopener noreferrer">
              Download CV <FaDownload />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Home;
