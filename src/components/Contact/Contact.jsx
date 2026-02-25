import React, { useEffect, useRef, useState } from 'react';
import './Contact.css';

const Contact = () => {
  const sectionRef = useRef(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.2 }
    );

    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section
      id="contact"
      ref={sectionRef}
      className={`contact-section ${visible ? 'visible' : ''}`}
    >
      <h2 className="section-title">What's Next?</h2>

      <div className="contact-card">
        {/* Neon accent top bar */}
        <div className="contact-card-bar" />

        <h3 className="contact-subtitle">Get In Touch</h3>
        <p className="contact-desc">
          I'm currently looking for new opportunities, and my inbox is always open.
          Whether you have a question or just want to say hi, I'll do my best to get back to you!
        </p>

        {/* Social / contact links row */}
        <div className="contact-links">
          <a href="mailto:dhivagar0506@gmail.com" className="contact-link-pill" title="Email">
            <span className="contact-link-icon">✉</span>
            <span>dhivagar0506@gmail.com</span>
          </a>
          <a href="https://github.com/Dhivagar13" target="_blank" rel="noreferrer" className="contact-link-pill" title="GitHub">
            <span className="contact-link-icon">⌥</span>
            <span>GitHub</span>
          </a>
          <a href="https://linkedin.com/in/dhivagar-b" target="_blank" rel="noreferrer" className="contact-link-pill" title="LinkedIn">
            <span className="contact-link-icon">in</span>
            <span>LinkedIn</span>
          </a>
        </div>

        <a
          href="mailto:dhivagar0506@gmail.com"
          className="cta-button"
        >
          Say Hello 👋
        </a>
      </div>
    </section>
  );
};

export default Contact;
