/*import React from 'react';
import useIntersectionObserver from '../../hooks/useIntersectionObserver';

const Credentials = () => {
  const [ref, isVisible] = useIntersectionObserver({ threshold: 0.2 });

  const items = [
    { title: 'Achievement', text: 'We won the 1st prize Twice in the Paper Presentation.' },
    { title: 'Certification', text: 'Java Programming Fundamentals course - Springboard, Infosys' },
    { title: 'Project', text: 'Career Guidance System - Team work project' },
    { title: 'Certification', text: 'Python Programming - Ethnotech' }
  ];

  return (
    <section id="credentials" ref={ref}>
      <div className="container">
        <h2 className={`section-title ${isVisible ? 'animate-in' : ''}`}>My Credentials</h2>
        <div className="credentials-grid">
          {items.map((it, idx) => (
            <div
              key={idx}
              className={`credential-item ${isVisible ? 'animate-in' : ''}`}
              style={{ animationDelay: `${idx * 0.12}s` }}
            >
              <h3>{it.title}</h3>
              <p>{it.text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Credentials;
*/
import React, { useEffect, useRef, useState } from 'react';
import './Achievements.css';
import { FaTrophy } from "react-icons/fa";


const Credentials = () => {
  const credentialData = [
    {
      type: 'Achievement',
      title: <>We won the 1st prize <FaTrophy /> Twice in the Paper Presentation.</>,
      source: 'presentation',
    },
    {
      type: 'Certification',
      title: 'Java Programming Fundamentals course',
      source: 'Springboard, Infosys',
    },
    {
      type: 'Project',
      title: 'Career Guidance System',
      source: 'Team work project',
    },
    {
      type: 'Certification',
      title: 'Python Programming ',
      source: 'Ethnotech',
    }
   
  ];

  const sectionRef = useRef(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setVisible(true);
          observer.disconnect(); // trigger once
        }
      },
      { threshold: 0.3 }
    );

    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section
      id="credentials"
      ref={sectionRef}
      className={`credentials-section ${visible ? 'visible' : ''}`}
    >
      <h2 className={`section-title ${visible ? 'animate-in' : ''}`}>My Credentials</h2>
      <div className="credentials-grid">
        {credentialData.map((item, index) => (
          <div
            key={index}
            className={`credential-card ${visible ? 'animate-in' : ''}`}
            style={{ animationDelay: `${index * 0.12}s` }}
          >
            <div className="credential-type">{item.type}</div>
            <h3 className="credential-title">{item.title}</h3>
            <p className="credential-source">{item.source}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Credentials;
