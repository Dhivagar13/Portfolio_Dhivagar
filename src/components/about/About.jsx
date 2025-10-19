import React from 'react';
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