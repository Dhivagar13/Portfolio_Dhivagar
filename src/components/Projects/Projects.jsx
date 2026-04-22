import React from 'react';
import './Projects.css';
import useScrollReveal from '../../hooks/useScrollReveal';
import vita5Image from '../../../assests/Vita5.jpeg';
import agriDetectImage from '../../../assests/Agridetect.png';
import smartMentisImage from '../../../assests/Smartmentis.jpeg';

const Projects = () => {
  const revealRef = useScrollReveal({ threshold: 0.1 });

  const projectData = [
    {
      title: 'Vita5',
      subtitle: 'SOS Application',
      bgImg: `url(${vita5Image})`,
      description: 'Mobile safety app // Real-time emergency alerts and location sharing to trusted contacts.',
      tech: 'Modern Stack'
    },
    {
      title: 'AgriDetect',
      subtitle: 'Digital Agriculture',
      bgImg: `url(${agriDetectImage})`,
      description: 'Farmer support system // Livestock management, agricultural marketplace, and expert consultation.',
      tech: 'Modern Stack'
    },
    {
      title: 'Smart Mentis',
      subtitle: 'EdTech',
      bgImg: `url(${smartMentisImage})`,
      description: 'AI career guidance // Intelligent aptitude assessment with personalized recommendations.',
      tech: 'React, FastAPI, Firebase'
    }
  ];

  return (
    <section id="projects" ref={revealRef} className="projects-section reveal-hidden">
      <div className="wrapper">
        <h1 className="parallax-title">Projects</h1>
        <div className="cols">
          {projectData.map((project, index) => (
            <div className="col" key={index} onTouchStart={(e) => e.currentTarget.classList.toggle('hover')}>
              <div className="container">
                <div className="front" style={{ backgroundImage: project.bgImg }}>
                  <div className="inner">
                    <p>{project.title}</p>
                    <span>{project.subtitle}</span>
                  </div>
                </div>
                <div className="back">
                  <div className="inner">
                    <p className="description-text">{project.description}</p>
                    <span className="tech-stack-text">{project.tech}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Projects;
