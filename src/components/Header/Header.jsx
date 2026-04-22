import React, { useState, useEffect, useRef } from 'react';
import gsap from 'gsap';
import './Header.css';

const Header = () => {
  const [isDown, setIsDown] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const navLinksRef = useRef([]);

  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 20;
      setScrolled(isScrolled);
    };

    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  useEffect(() => {
    const navLinks = document.querySelectorAll('.nav-link');
    navLinksRef.current = navLinks;

    navLinks.forEach((link) => {
      link.addEventListener('click', (e) => {
        handlePrevious();
        handleCurrent(link);
      });
    });

    // Set first link as active by default
    if (navLinks.length > 0) {
      handleCurrent(navLinks[0]);
    }

    return () => {
      navLinks.forEach((link) => {
        link.removeEventListener('click', (e) => {
          handlePrevious();
          handleCurrent(link);
        });
      });
    };
  }, []);

  const getNodes = (container, selector) => {
    return gsap.utils.selector(container)(selector);
  };

  const handleCurrent = (current) => {
    current.classList.add('active');
    const blueNode = getNodes(current, '.glitch-blue');
    const pinkNode = getNodes(current, '.glitch-pink');

    if (blueNode[0]) {
      gsap.to(blueNode[0], {
        duration: 1.6,
        ease: 'elastic.out(1.4, 0.1)',
        x: 0,
        opacity: 1,
      });
    }

    if (pinkNode[0]) {
      gsap.to(pinkNode[0], {
        duration: 1.6,
        ease: 'elastic.out(1.4, 0.1)',
        x: 0,
        opacity: 1,
      });
    }
  };

  const handlePrevious = () => {
    const previous = document.querySelector('.nav-link.active');
    if (previous) {
      previous.classList.remove('active');
      const blueNode = getNodes(previous, '.glitch-blue');
      const pinkNode = getNodes(previous, '.glitch-pink');

      if (blueNode[0] || pinkNode[0]) {
        gsap.killTweensOf([blueNode[0], pinkNode[0]]);

        if (blueNode[0]) {
          gsap.to(blueNode[0], {
            duration: 0.2,
            ease: 'power1.out',
            x: 10,
            opacity: 0,
          });
        }

        if (pinkNode[0]) {
          gsap.to(pinkNode[0], {
            duration: 0.2,
            ease: 'power2.inOut',
            x: -10,
            opacity: 0,
          });
        }
      }
    }
  };

  return (
    <header className={`navbar-fixed-top ${isDown ? 'is-slid-up' : ''} ${scrolled ? 'scrolled' : ''}`}>
      <nav className="navbar-inner header-main">
        <div className="container nav-container">
          
          <div className="brand">
            <a href="#home" data-magnetic>&lt;DHIVAGAR/&gt;</a>
          </div>

          <ul className="nav-list pull-right">
            <li className="nav-item">
              <a href="#about" className="nav-link" data-magnetic>
                <span className="glitch-pink">ABOUT</span>
                <span className="glitch-blue">ABOUT</span>
                <span className="label">ABOUT</span>
              </a>
            </li>
            <li className="nav-item">
              <a href="#skills" className="nav-link" data-magnetic>
                <span className="glitch-pink">STACK</span>
                <span className="glitch-blue">STACK</span>
                <span className="label">STACK</span>
              </a>
            </li>
            <li className="nav-item">
              <a href="#projects" className="nav-link" data-magnetic>
                <span className="glitch-pink">WORK</span>
                <span className="glitch-blue">WORK</span>
                <span className="label">WORK</span>
              </a>
            </li>
            <li className="nav-item">
              <a href="#achievements" className="nav-link" data-magnetic>
                <span className="glitch-pink">RECORDS</span>
                <span className="glitch-blue">RECORDS</span>
                <span className="label">RECORDS</span>
              </a>
            </li>
            <li className="nav-item">
              <a href="#contact" className="nav-link" data-magnetic>
                <span className="glitch-pink">LET'S TALK</span>
                <span className="glitch-blue">LET'S TALK</span>
                <span className="label">LET'S TALK</span>
              </a>
            </li>
          </ul>

        </div>

        <div 
          className="triangle-down center" 
          onClick={() => setIsDown(!isDown)}
          data-magnetic
        >
          <p>
            <svg 
              className={`toggle-icon ${isDown ? 'rotated' : ''}`} 
              width="24" 
              height="24" 
              viewBox="0 0 24 24" 
              fill="none" 
              stroke="currentColor" 
              strokeWidth="2" 
              strokeLinecap="round" 
              strokeLinejoin="round"
            >
              <polyline points="6 9 12 15 18 9"></polyline>
            </svg>
          </p>
        </div>
      </nav>
    </header>
  );
};

export default Header;
