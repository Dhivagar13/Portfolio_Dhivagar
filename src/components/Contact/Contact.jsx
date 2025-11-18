// import React from 'react';
// import useIntersectionObserver from '../../hooks/useIntersectionObserver';

// const Contact = () => {
//   const [ref, isVisible] = useIntersectionObserver({ threshold: 0.1 });

//   return (
//     <section id="contact" className="contact-section" ref={ref}>
//       <div className="container">
//         <h3 className={`section-subtitle ${isVisible ? 'animate-in' : ''}`}>What's Next?</h3>
//         <h2 className={`section-title ${isVisible ? 'animate-in' : ''}`}>Get In Touch</h2>
//         <p className={`${isVisible ? 'animate-in' : ''}`} style={{ animationDelay: '0.12s' }}>I'm currently looking for new opportunities, and my inbox is always open. Whether you have a question or just want to say hi, I'll do my best to get back to you!</p>
//         <a href="mailto:dhivagar0506@gmail.com" className={`cta-button ${isVisible ? 'animate-in' : ''}`} style={{ animationDelay: '0.22s' }}>Say Hello</a>
//       </div>
//     </section>
//   );
// };

// export default Contact;
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
      id="contact"
      ref={sectionRef}
      className={`contact-section ${visible ? 'visible' : ''}`}
    >
      <h2 className="section-title">What's Next?</h2>
      <h3 className="contact-subtitle">Get In Touch</h3>
      <p>
        I'm currently looking for new opportunities, and my inbox is always open. 
        Whether you have a question or just want to say hi, I'll do my best to get back to you!
      </p>
      <a 
        href="mailto:dhivagar0506@gmail.com" 
        className="cta-button"
      >
        Say Hello
      </a>
    </section>
  );
};

export default Contact;
