import React from 'react';
import { FaGithub, FaLinkedinIn, FaWhatsapp } from 'react-icons/fa';
import { SiHackerrank } from 'react-icons/si';
import { SiLeetcode } from 'react-icons/si';
import './Footer.css';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="container">
        <div className="social-links">
          <a href="https://github.com/Dhivagar13" target="_blank" rel="noopener noreferrer" aria-label="GitHub">
            <FaGithub size={40}/>
          </a>
          <a href="https://www.linkedin.com/in/dhivagarb1305" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">
            <FaLinkedinIn size={40}/>
          </a>
          <a href="https://wa.me/9943167733" target="_blank" rel="noopener noreferrer" aria-label="WhatsApp">
            <FaWhatsapp size={40}/>
          </a>
          <a href="https://www.hackerrank.com/profile/dhivagar0506" target="_blank" rel="noopener noreferrer" aria-label="HackerRank">
            <SiHackerrank size={40}/>
          </a>
          <a href="https://leetcode.com/u/Dhivagar_B_13052006/" target="_blank" rel="noopener noreferrer"> <SiLeetcode size={40} /></a>

        </div>
        <p>Designed & Built by Dhivagar B</p>
        {/* <p>&copy; 2025 Dhivagar B. All Rights Reserved.</p> */}
      </div>
    </footer>
  );
};

export default Footer;
