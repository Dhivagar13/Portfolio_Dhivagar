import React from 'react';
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