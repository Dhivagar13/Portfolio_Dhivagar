import React from 'react';
import { FaGithub, FaLinkedinIn, FaWhatsapp } from 'react-icons/fa';
import { SiHackerrank, SiLeetcode } from 'react-icons/si';
import './Footer.css';

const socialLinks = [
  {
    label: 'GitHub',
    href: 'https://github.com/Dhivagar13',
    Icon: FaGithub,
  },
  {
    label: 'LinkedIn',
    href: 'https://www.linkedin.com/in/dhivagarb1305',
    Icon: FaLinkedinIn,
  },
  {
    label: 'WhatsApp',
    href: 'https://wa.me/9943167733',
    Icon: FaWhatsapp,
  },
  {
    label: 'HackerRank',
    href: 'https://www.hackerrank.com/profile/dhivagar0506',
    Icon: SiHackerrank,
  },
  {
    label: 'LeetCode',
    href: 'https://leetcode.com/u/Dhivagar_B_13052006/',
    Icon: SiLeetcode,
  },
];

const Dock = ({ children }) => <div className="footer-dock">{children}</div>;

const DockIcon = ({ href, label, Icon }) => (
  <a
    className="footer-dock__item"
    href={href}
    target="_blank"
    rel="noopener noreferrer"
    aria-label={label}
  >
    <span className="footer-dock__tooltip" aria-hidden="true">
      {label}
    </span>
    <Icon className="footer-dock__icon" size={28} aria-hidden="true" />
  </a>
);

const Footer = () => {
  return (
    <footer className="footer-white">
      <div className="footer-white-container">
        <div className="footer-branding">
          <p className="footer-kicker">Connect with</p>
          <h2 className="footer-brand">DHIVAGAR</h2>
        </div>

        <div className="footer-actions">
          <Dock>
            {socialLinks.map(({ label, href, Icon }) => (
              <DockIcon key={label} label={label} href={href} Icon={Icon} />
            ))}
          </Dock>

          <p className="footer-motto">BUILT_WITH_PURE_DESIRE</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
