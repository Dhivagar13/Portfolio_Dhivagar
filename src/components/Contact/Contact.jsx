import React, { useState } from 'react';
import './Contact.css';
import useScrollReveal from '../../hooks/useScrollReveal';
import HudFrame from './HudFrame';

const Contact = () => {
  const revealRef = useScrollReveal({ threshold: 0.15 });
  const [result, setResult] = useState("");

  const onSubmit = async (event) => {
    event.preventDefault();
    setResult("INITIALIZING TRANSMISSION...");
    const formData = new FormData(event.target);
    formData.append("access_key", "32f751e5-1f04-4a07-9ba2-b944bad270fe");

    try {
      const response = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        body: formData
      });

      const data = await response.json();
      if (data.success) {
        setResult("SUCCESS // TRANSMISSION COMPLETE.");
        event.target.reset();
      } else {
        setResult("ERROR // TRANSMISSION FAILED.");
      }
    } catch (error) {
      setResult("ERROR // CONNECTION LOST.");
    }
  };

  return (
    <section
      id="contact"
      ref={revealRef}
      className="contact-section reveal-hidden"
    >
      <div className="cyber-panel" style={{ background: 'transparent', border: 'none', padding: 0, boxShadow: 'none' }}>
        <HudFrame seed={898766}>
          <form className="contact-form" onSubmit={onSubmit}>
            <div className="form-row">
              <div className="form-group">
                <label>NAME</label>
                <input type="text" name="name" placeholder="Your Name" required />
              </div>
              <div className="form-group">
                <label>EMAIL</label>
                <input type="email" name="email" placeholder="your@email.com" required />
              </div>
            </div>
            <div className="form-group">
              <label>MESSAGE</label>
              <textarea name="message" rows="6" placeholder="Tell me about your project..." required></textarea>
            </div>
            <div className="form-submit">
              <button type="submit" className="cyber-button">SEND MESSAGE</button>
            </div>
            {result && (
              <p className="cyber-result" style={{ 
                marginTop: '20px', 
                textAlign: 'center', 
                color: result.includes('SUCCESS') ? '#00f0ff' : result.includes('TRANSMISSION...') ? '#fff' : '#ff3366', 
                fontFamily: 'monospace',
                letterSpacing: '1px'
              }}>
                {result}
              </p>
            )}
          </form>
        </HudFrame>
      </div>
    </section>
  );
};

export default Contact;
