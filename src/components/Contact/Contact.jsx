import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FaEnvelope } from 'react-icons/fa';
import './Contact.css';
import useScrollReveal from '../../hooks/useScrollReveal';
import HudFrame from './HudFrame';

const Contact = () => {
  const revealRef = useScrollReveal({ threshold: 0.15 });
  const [result, setResult] = useState("");
  const [flipped, setFlipped] = useState(false);
  const [loading, setLoading] = useState(false);

  const onSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
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
    setLoading(false);
  };

  return (
    <section
      id="contact"
      ref={revealRef}
      className="contact-section reveal-hidden"
    >
      <div className="w-full max-w-4xl mx-auto" style={{ perspective: 1000 }}>
        <motion.div
          className="relative w-full"
          animate={{ rotateY: flipped ? 180 : 0 }}
          transition={{ duration: 0.8, type: "spring", bounce: 0.3 }}
          style={{ transformStyle: "preserve-3d" }}
        >
          {/* FRONT SIDE - INTRO */}
          <div className="absolute inset-0 flex flex-col items-center justify-center z-10 pointer-events-none" style={{ backfaceVisibility: "hidden" }}>
            {/* We use pointer-events-none on the container, but auto on the actual card so we can click it */}
            <div className="cyber-panel pointer-events-auto" style={{ background: 'transparent', border: 'none', padding: 0, boxShadow: 'none', width: '100%', maxWidth: '600px', margin: '0 auto' }}>
              <HudFrame seed={123456}>
                <div className="flex flex-col items-center justify-center p-10 text-center space-y-6 bg-black/40 backdrop-blur-sm rounded-lg h-[450px]">
                  <FaEnvelope className="text-6xl text-[#00f0ff] mb-4" />
                  <h2 className="text-4xl font-syne font-bold text-white tracking-wider uppercase">Initiate Contact</h2>
                  <p className="text-[#9aa3b2] font-space-grotesk text-sm max-w-md">
                    Secure channel ready. Establish a direct link to discuss projects, collaborations, or general inquiries.
                  </p>
                  <button 
                    type="button"
                    className="cyber-button mt-8" 
                    onClick={() => setFlipped(true)}
                  >
                    OPEN CHANNEL
                  </button>
                </div>
              </HudFrame>
            </div>
          </div>

          {/* BACK SIDE - FORM (Relative to give height to motion.div) */}
          <div 
            className="relative w-full flex flex-col items-center justify-center"
            style={{ transform: "rotateY(180deg)", backfaceVisibility: "hidden" }}
          >
            <div className="cyber-panel w-full" style={{ background: 'transparent', border: 'none', padding: 0, boxShadow: 'none' }}>
              <HudFrame seed={898766}>
                <div className="p-4 sm:p-8 bg-black/40 backdrop-blur-sm rounded-lg min-h-[450px] flex flex-col justify-center">
                  <div className="flex justify-between items-center mb-6">
                    <h3 className="text-[#00f0ff] font-space-grotesk font-bold text-lg tracking-widest uppercase">Direct Link</h3>
                    <button 
                      type="button" 
                      className="text-[#ff3366] font-space-grotesk text-xs hover:text-white transition-colors uppercase"
                      onClick={() => { setFlipped(false); setResult(""); }}
                    >
                      [X] Abort
                    </button>
                  </div>
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
                      <textarea name="message" rows="5" placeholder="Tell me about your project..." required></textarea>
                    </div>
                    <div className="form-submit">
                      <button type="submit" className="cyber-button w-full sm:w-auto" disabled={loading}>
                        {loading ? "TRANSMITTING..." : "SEND MESSAGE"}
                      </button>
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
                </div>
              </HudFrame>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Contact;
