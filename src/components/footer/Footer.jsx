import React from 'react';
import { FaGithub, FaLinkedinIn, FaWhatsapp } from 'react-icons/fa';
import { SiHackerrank } from 'react-icons/si';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="container">
        <div className="social-links">
          <a href="https://github.com/Dhivagar13" target="_blank" rel="noopener noreferrer" aria-label="GitHub">
            <FaGithub />
          </a>
          <a href="https://www.linkedin.com/in/dhivagarb1305" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">
            <FaLinkedinIn />
          </a>
          <a href="https://wa.me/9943167733" target="_blank" rel="noopener noreferrer" aria-label="WhatsApp">
            <FaWhatsapp />
          </a>
          <a href="https://www.hackerrank.com/profile/dhivagar0506" target="_blank" rel="noopener noreferrer" aria-label="HackerRank">
            <SiHackerrank />
          </a>
        </div>
        <p>Designed & Built by Dhivagar B</p>
        <p>&copy; 2025 Dhivagar B. All Rights Reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;
