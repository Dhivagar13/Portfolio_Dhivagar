import React, { useRef, useState } from 'react';
import './Skills.css';
import { DiJava, DiReact, DiMongodb } from 'react-icons/di';
import { FaBolt, FaGithub } from 'react-icons/fa';
import { SiSpringboot, SiPostman, SiMetabase, SiDocker, SiPostgresql } from 'react-icons/si';
import { MdOutlineRecordVoiceOver } from "react-icons/md";
import useScrollReveal from '../../hooks/useScrollReveal';
import ElectricBorder from './ElectricBorder';

const AtvCard = ({ icon, name, index }) => {
  const cardRef = useRef(null);
  const [transform, setTransform] = useState('');
  const [shineBg, setShineBg] = useState('');
  const [shineTransform, setShineTransform] = useState('');
  const [isHovered, setIsHovered] = useState(false);
  const [layer2Transform, setLayer2Transform] = useState('');

  const handleMouseMove = (e) => {
    const elem = cardRef.current;
    if (!elem) return;

    const offsets = elem.getBoundingClientRect();
    const w = elem.clientWidth;
    const h = elem.clientHeight;
    
    const pageX = e.clientX;
    const pageY = e.clientY;

    const wMultiple = 320 / w;
    const offsetX = 0.52 - (pageX - offsets.left) / w;
    const offsetY = 0.52 - (pageY - offsets.top) / h;
    const dy = (pageY - offsets.top) - h / 2;
    const dx = (pageX - offsets.left) - w / 2;
    const yRotate = (offsetX - dx) * (0.07 * wMultiple);
    const xRotate = (dy - offsetY) * (0.1 * wMultiple);
    
    let imgCSS = `rotateX(${xRotate}deg) rotateY(${yRotate}deg)`;
    if (isHovered) {
      imgCSS += ' scale3d(1.07,1.07,1.07)';
    }
    setTransform(imgCSS);

    let arad = Math.atan2(dy, dx);
    let angle = (arad * 180) / Math.PI - 90;
    if (angle < 0) {
      angle = angle + 360;
    }
    
    setShineBg(`linear-gradient(${angle}deg, rgba(255,255,255,${(pageY - offsets.top) / h * 0.4}) 0%,rgba(255,255,255,0) 80%)`);
    setShineTransform(`translateX(${(offsetX * 2) - 0.1}px) translateY(${(offsetY * 2) - 0.1}px)`);

    // Foreground Layer Parallax
    setLayer2Transform(`translateX(${(offsetX * 1) * (1 * 2.5 / wMultiple)}px) translateY(${(offsetY * 2) * (1 * 2.5 / wMultiple)}px)`);
  };

  const handleMouseEnter = () => setIsHovered(true);
  const handleMouseLeave = () => {
    setIsHovered(false);
    setTransform('');
    setShineBg('');
    setShineTransform('');
    setLayer2Transform('');
  };

  return (
    <div 
      className="skill-cover" 
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      style={{ animationDelay: `${index * 0.07}s` }}
    >
      <div className={`atvImg-container ${isHovered ? 'over' : ''}`} style={{ transform }}>
        <ElectricBorder
          color="#7df9ff"
          speed={1}
          chaos={0.12}
          thickness={2}
          style={{ borderRadius: 12, width: '100%', height: '100%' }}
        >
          <div className="atvImg-shadow"></div>
          <div className="atvImg-layers">
            
            <div className="atvImg-layer atvImg-layer-base"></div>
            
            <div className="atvImg-layer" style={{ transform: layer2Transform }}>
              <div className="atvImg-layer-content">
                {icon} 
                <span className="skill-name-label">{name}</span>
              </div>
            </div>

          </div>
          <div className="atvImg-shine" style={{ background: shineBg, transform: shineTransform }}></div>
        </ElectricBorder>
      </div>
    </div>
  );
};

const Skills = () => {
  const revealRef = useScrollReveal({ threshold: 0.1 });

  return (
    <section
      id="skills"
      ref={revealRef}
      className="skills-section reveal-hidden"
    >
      <h2 className="section-title">Technical Arsenal</h2>
      <div className="skills-grid">
        {[
          { icon: <DiJava size={56} />, name: "Java" },
          { icon: <DiReact size={56} />, name: "React" },
          { icon: <SiSpringboot size={56} />, name: "Spring" },
          { icon: <FaGithub size={56} />, name: "Git" },
          { icon: <SiPostman size={56} />, name: "Postman" },
          { icon: <DiMongodb size={56} />, name: "MongoDB" },
          { icon: <SiPostgresql size={56} />, name: "PostgreSQL" },
          { icon: <SiMetabase size={56} />, name: "Analytics" },
          { icon: <SiDocker size={56} />, name: "Docker" },
          { icon: <FaBolt size={56} />, name: "Rapid Learner" },
          { icon: <MdOutlineRecordVoiceOver size={56} />, name: "Expert Comm" }
        ].map((skill, index) => (
          <AtvCard key={skill.name || index} icon={skill.icon} name={skill.name} index={index} />
        ))}
      </div>
    </section>
  );
};

export default Skills;
