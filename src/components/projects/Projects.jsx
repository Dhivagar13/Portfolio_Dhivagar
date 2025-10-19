import React from 'react';
import useIntersectionObserver from '../../hooks/useIntersectionObserver';

const Projects = () => {
  const [ref, isVisible] = useIntersectionObserver({ threshold: 0.1 });

  return (
    <section id="projects" ref={ref}>
      <div className="container">
        <h2 className={`section-title ${isVisible ? 'animate-in' : ''}`}>Projects</h2>
        <div className="projects-grid">
          <div className="project-card">
            <h3>Smart Mentis</h3>
            <p className="project-domain">Smart Education</p>
            <p>An AI-driven career guidance system for assessing aptitude, interests, and skills to provide personalized career recommendations.</p>
            <p className="project-stack"><strong>Stack:</strong> React JS, FastAPI, Firebase</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Projects;