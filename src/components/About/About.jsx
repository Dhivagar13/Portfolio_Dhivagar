/*import React from 'react';
import useIntersectionObserver from '../../hooks/useIntersectionObserver';

const About = () => {
  const [ref, isVisible] = useIntersectionObserver({ threshold: 0.1 });

  return (
    <section id="about" ref={ref}>
      <div className="container">
        <h2 className={`section-title ${isVisible ? 'animate-in' : ''}`}>About Me</h2>
        <div className="about-content">
          <p className={`${isVisible ? 'animate-in' : ''}`} style={{ animationDelay: '0.08s' }}>
            I'm Dhivagar B, a passionate Java Full Stack Developer with a strong enthusiasm for technology and problem-solving. I am driven by the opportunity to tackle complex challenges and build meaningful, high-quality solutions.
          </p>
          <p className={`${isVisible ? 'animate-in' : ''}`} style={{ animationDelay: '0.16s' }}>
            As a quick learner and dedicated developer, I am continuously expanding my expertise across the full stack, with a focus on front-end and back-end technologies like Java, React, Spring Boot, and MongoDB. I thrive in collaborative team environments and enjoy bringing creative and technically excellent projects to life.
          </p>
          <p className={`${isVisible ? 'animate-in' : ''}`} style={{ animationDelay: '0.24s' }}>
            Beyond coding, I am deeply committed to continuous improvement, constantly exploring new technologies, and seeking opportunities to contribute to impactful projects that make a real difference.
          </p>
        </div>
      </div>
    </section>
  );
};

export default About;
*/
import React, { useEffect, useRef, useState } from 'react';
import './About.css';
import { DiJava, DiReact, DiMongodb, DiHtml5, DiCss3 } from 'react-icons/di';
import { SiSpringboot } from 'react-icons/si';

const About = () => {
  const aboutRef = useRef(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setIsVisible(true);
          observer.disconnect(); // run once
        }
      },
      { threshold: 0.3 } // trigger when 30% is visible
    );

    if (aboutRef.current) {
      observer.observe(aboutRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <section
      id="about"
      ref={aboutRef}
      className={`about-section ${isVisible ? 'visible' : ''}`}
    >
      <h2 className="section-title">About Me</h2>

      <div className="about-content-grid">
        <div className="about-text">
          <p className="para">
            I'm <span className="glow-text">Dhivagar B</span>, currently focused on{' '}
            <span className="glow-text">Full Stack Development</span>.
            I have a strong passion for technology and problem-solving,
            always eager to tackle challenges and build meaningful solutions.
          </p>

          <p>
            As a <span className="glow-text">quick learner</span> and enthusiastic developer, I continuously expand my
            skills across front-end and back-end technologies, including{' '}
            <span className="glow-text">Java</span>,{' '}
            <span className="glow-text">React</span>,{' '}
            <span className="glow-text">Spring Boot</span>, and{' '}
            <span className="glow-text">MongoDB</span>. I thrive in collaborative environments and enjoy creating projects that combine creativity with technical expertise.
          </p>

          <p>
            Beyond coding, I am deeply committed to continuous improvement, constantly exploring new technologies, and seeking opportunities to contribute to impactful projects that make a real difference.
          </p>
        </div>
      </div>
    </section>
  );
};

export default About;
