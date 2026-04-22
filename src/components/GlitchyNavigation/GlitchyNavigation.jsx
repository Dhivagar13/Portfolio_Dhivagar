import React, { useRef, useEffect } from 'react';
import gsap from 'gsap';
import './GlitchyNavigation.css';
import { MdHome, MdWork, MdSchool, MdEmail } from 'react-icons/md';

const GlitchyNavigation = ({ onNavigate }) => {
  const navRef = useRef(null);
  const anchorsRef = useRef([]);

  useEffect(() => {
    const navigation = navRef.current;
    if (!navigation) return;

    const anchors = navigation.querySelectorAll('a');
    anchorsRef.current = anchors;

    const handleClick = (e, anchor) => {
      e.preventDefault();
      handlePrevious();
      handleCurrent(anchor);
      
      // Call the onNavigate callback if provided
      if (onNavigate) {
        const href = anchor.getAttribute('href');
        onNavigate(href);
      }
    };

    anchors.forEach((anchor) => {
      anchor.addEventListener('click', (e) => handleClick(e, anchor));
    });

    // Set the first anchor as active by default
    if (anchors.length > 0) {
      handleCurrent(anchors[0]);
    }

    return () => {
      anchors.forEach((anchor) => {
        anchor.removeEventListener('click', (e) => handleClick(e, anchor));
      });
    };
  }, [onNavigate]);

  const getNodes = (container, selector) => {
    return gsap.utils.selector(container)(selector);
  };

  const handleCurrent = (current) => {
    current.classList.add('active');
    const blueNode = getNodes(current, 'i.blue');
    const pinkNode = getNodes(current, 'i.pink');

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
    const previous = document.querySelector('nav.glitchy-nav a.active');
    if (previous) {
      previous.classList.remove('active');
      const blueNode = getNodes(previous, 'i.blue');
      const pinkNode = getNodes(previous, 'i.pink');

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
    <nav className="glitchy-nav" ref={navRef}>
      <a href="#home" title="Home">
        <i className="icon pink"><MdHome /></i>
        <i className="icon blue"><MdHome /></i>
        <i className="icon"><MdHome /></i>
        <span className="label">Home</span>
      </a>

      <a href="#work" title="Work">
        <i className="icon pink"><MdWork /></i>
        <i className="icon blue"><MdWork /></i>
        <i className="icon"><MdWork /></i>
        <span className="label">Work</span>
      </a>

      <a href="#about" title="About">
        <i className="icon pink"><MdSchool /></i>
        <i className="icon blue"><MdSchool /></i>
        <i className="icon"><MdSchool /></i>
        <span className="label">About</span>
      </a>

      <a href="#contact" title="Contact">
        <i className="icon pink"><MdEmail /></i>
        <i className="icon blue"><MdEmail /></i>
        <i className="icon"><MdEmail /></i>
        <span className="label">Contact</span>
      </a>
    </nav>
  );
};

export default GlitchyNavigation;
