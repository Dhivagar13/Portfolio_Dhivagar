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
