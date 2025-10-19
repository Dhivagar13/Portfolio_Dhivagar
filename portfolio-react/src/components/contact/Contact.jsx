import React from 'react';
import useIntersectionObserver from '../../hooks/useIntersectionObserver';

const Contact = () => {
  const [ref, isVisible] = useIntersectionObserver({ threshold: 0.1 });

  return (
    <section id="contact" className="contact-section" ref={ref}>
      <div className="container">
        <h3 className={`section-subtitle ${isVisible ? 'animate-in' : ''}`}>What's Next?</h3>
        <h2 className={`section-title ${isVisible ? 'animate-in' : ''}`}>Get In Touch</h2>
        <p className={`${isVisible ? 'animate-in' : ''}`} style={{ animationDelay: '0.12s' }}>I'm currently looking for new opportunities, and my inbox is always open. Whether you have a question or just want to say hi, I'll do my best to get back to you!</p>
        <a href="mailto:dhivagar0506@gmail.com" className={`cta-button ${isVisible ? 'animate-in' : ''}`} style={{ animationDelay: '0.22s' }}>Say Hello</a>
      </div>
    </section>
  );
};

export default Contact;