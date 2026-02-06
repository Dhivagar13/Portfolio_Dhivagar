/*
import React from 'react';
import { FaReact, FaGitAlt, FaGithub, FaDocker, FaChartBar } from 'react-icons/fa';
import { SiSpringboot, SiFastapi, SiMongodb, SiPostgresql, SiFirebase, SiMysql } from 'react-icons/si';
import useIntersectionObserver from '../../hooks/useIntersectionObserver';

const Skills = () => {
  const [ref, isVisible] = useIntersectionObserver({ threshold: 0.2 });

  return (
    <section id="skills" ref={ref}>
      <div className="container">
        <h2 className={`section-title ${isVisible ? 'animate-in' : ''}`}>Skills</h2>
        <div className="skills-grid">
          {[
            { icon: <FaReact />, name: "React" },
            { icon: <SiSpringboot />, name: "Spring Boot" },
            { icon: <SiFastapi />, name: "FastAPI" },
            { icon: <SiMysql />, name: "MySQL" },
            { icon: <SiMongodb />, name: "MongoDB" },
            { icon: <SiPostgresql />, name: "PostgreSQL" },
            { icon: <SiFirebase />, name: "Firebase" },
            { icon: <><FaGitAlt /> Git & <FaGithub /> GitHub</> },
            { icon: <FaDocker />, name: "Docker" },
            { icon: <FaChartBar />, name: "PowerBI" }
          ].map((skill, index) => (
            <div 
              key={skill.name || index}
              className={`skill-item ${isVisible ? 'animate-in' : ''}`}
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              {skill.icon} {skill.name}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Skills;
*/
import React, { useEffect, useRef, useState } from 'react';
import './Skills.css';
import { DiJava, DiReact, DiMongodb } from 'react-icons/di';
import { FaBolt, FaLightbulb, FaGithub } from 'react-icons/fa';
import { SiSpringboot, SiPostman, SiMetabase, SiDocker, SiPostgresql } from 'react-icons/si';
import { MdOutlineRecordVoiceOver } from "react-icons/md";

const Skills = () => {
  const skillsRef = useRef(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setIsVisible(true);
          observer.disconnect(); // run once
        }
      },
      { threshold: 0.3 }
    );

    if (skillsRef.current) {
      observer.observe(skillsRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <section
      id="skills"
      ref={skillsRef}
      className={`skills-section ${isVisible ? 'visible' : ''}`}
    >
      <h2 className="section-title">My Skills</h2>
      <div className="skills-grid">
        {[
          { icon: <DiJava />, name: "Java" },
          { icon: <DiReact />, name: "React JS" },
          { icon: <SiSpringboot />, name: "Spring Boot" },
          { icon: <FaGithub />, name: "Git & GitHub" },
          { icon: <SiPostman />, name: "Postman" },
          { icon: <DiMongodb />, name: "MongoDB" },
          { icon: <SiPostgresql />, name: "PostgreSQL" },
          { icon: <SiMetabase />, name: "Metabase" },
          { icon: <SiDocker />, name: "Docker" },
          // { icon: <FaLightbulb />, name: "Problem Solving" },
          { icon: <FaBolt />, name: "Fast Learner" },
          { icon: <MdOutlineRecordVoiceOver />, name: "Good in communication" }
        ].map((skill, index) => (
          <div
            key={skill.name || index}
            className={`skill-item ${isVisible ? 'animate-in' : ''}`}
            style={{ animationDelay: `${index * 0.1}s` }}
          >
            {skill.icon} {skill.name}
          </div>
        ))}
      </div>
    </section>
  );
};

export default Skills;
