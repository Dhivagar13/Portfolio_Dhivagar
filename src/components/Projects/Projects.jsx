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
      domain: 'Mobile Safety',
      bgImg: `url(${vita5Image})`,
      description: 'A mobile safety app designed for immediate emergency response and coordinate sharing.',
      features: [
        'Real-time GPS location sharing',
        'One-tap instant SOS alerts',
        'Trusted contacts notification system',
        'Background location tracking during emergency'
      ],
      tech: ['React Native', 'Node.js', 'Express', 'MongoDB', 'Socket.io', 'Google Maps API']
    },
    {
      title: 'AgriDetect',
      subtitle: 'Digital Agriculture',
      domain: 'AgriTech Platform',
      bgImg: `url(${agriDetectImage})`,
      description: 'An integrated farmer support platform streamlining agricultural operations and commerce.',
      features: [
        'Livestock health & management tracker',
        'Direct peer-to-peer agriculture marketplace',
        'Expert consultation and diagnostic module',
        'Weather integration and crop advisory'
      ],
      tech: ['React', 'Spring Boot', 'Java', 'PostgreSQL', 'RESTful APIs', 'Hibernate']
    },
    {
      title: 'Smart Mentis',
      subtitle: 'AI Career Guidance',
      domain: 'EdTech / Generative AI',
      bgImg: `url(${smartMentisImage})`,
      description: 'An AI-driven career assistant that builds customized roadmaps and skill learning paths.',
      features: [
        'AI chatbot for personalized career advisory',
        'Intelligent aptitude assessment engine',
        'Dynamic YouTube API resource curator',
        'User progress tracking & skill roadmaps',
        'Secure Firebase authentication'
      ],
      tech: ['React.js', 'FastAPI', 'Python', 'Gemini API', 'YouTube API', 'Firebase']
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
                  <div className="front-overlay"></div>
                  <div className="inner">
                    <span className="project-index">0{index + 1}</span>
                    <span className="project-badge">{project.domain}</span>
                    <p className="project-title">{project.title}</p>
                    <span className="project-subtitle">{project.subtitle}</span>
                    <div className="hover-hint">Hover to explore details //</div>
                  </div>
                </div>
                <div className="back">
                  <div className="inner">
                    <span className="project-back-domain">{project.domain}</span>
                    <p className="description-text">{project.description}</p>
                    <ul className="features-list">
                      {project.features.map((feat, fidx) => (
                        <li key={fidx}>{feat}</li>
                      ))}
                    </ul>
                    <div className="tech-badges">
                      {project.tech.map((t, tidx) => (
                        <span className="tech-badge" key={tidx}>{t}</span>
                      ))}
                    </div>
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
