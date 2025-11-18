/*
import React from 'react';
import useIntersectionObserver from '../../hooks/useIntersectionObserver';

const Projects = () => {
  const [ref, isVisible] = useIntersectionObserver({ threshold: 0.1 });

  return (
    <section id="projects" ref={ref}>
      <div className="container">
        <h2 className={`section-title ${isVisible ? 'animate-in' : ''}`}>Projects</h2>
        <div className="projects-grid">
          <div 
              className={`project-card ${isVisible ? 'animate-in' : ''}`}
              style={{ animationDelay: `0.1s` }}
          >
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
*/
import React, { useEffect, useRef, useState } from 'react';
import './Projects.css';

const Projects = () => {
  const projectData = [
    {
      title: 'Smart Mentis',
      description:
        'A comprehensive AI-driven career guidance system designed to help individuals make informed career decisions by holistically assessing their aptitude, interests, skills, and potential career trajectories.',
      tech: ['React js', 'Fast API', 'Firebase'],
      link: '#',
      domain:"Smart Education"
    },
   
    
  ];

  const projectsRef = useRef(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setIsVisible(true);
          observer.disconnect(); // trigger only once
        }
      },
      { threshold: 0.3 }
    );

    if (projectsRef.current) {
      observer.observe(projectsRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <section
      id="projects"
      ref={projectsRef}
      className={`projects-section ${isVisible ? 'visible' : ''}`}
    >
      <h2 className="section-title">Some Things I've Built</h2>
      <div className="projects-grid">
        {projectData.map((project, index) => (
          <div key={index} className="project-card" style={{ animationDelay: `0.1s` }}>
            <div className="project-inner">
              <header>
                <div className="project-top">
                  {/* <div className="folder-icon">// Folder Icon</div> */}
                  <a
                    href={project.link}
                    className="external-link"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {/* // Link Icon */}
                  </a>
                </div>
                <h3 className="project-title">{project.title}</h3>
                <div className="project-description">
                  <p>{project.description}</p>
                </div>
                <p className="project-domain"><strong>Domain:</strong> {project.domain}</p>
              </header>
              <footer>
                <ul className="project-tech-list">
                  {project.tech.map((tech, i) => (
                    <li key={i}>{tech}</li>
                  ))}
                </ul>
              </footer>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Projects;
