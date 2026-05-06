import React, { useEffect, useRef, useState } from 'react';
import './Home.css';
import profileImage from '../../../assests/dhiv.png';

const Home = () => {
  const [scrollY, setScrollY] = useState(0);
  const heroRef = useRef(null);
  const targetTilt = useRef({ x: 0, y: 0 });
  const currentTilt = useRef({ x: 0, y: 0 });
  const rafRef = useRef(null);

  /* ── Scroll tracking ── */
  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  /* ── Smooth mouse tilt on text layers ── */
  useEffect(() => {
    const el = heroRef.current;
    if (!el) return;

    const onMove = (e) => {
      const rect = el.getBoundingClientRect();
      targetTilt.current = {
        x: ((e.clientX - rect.left) / rect.width - 0.5) * 2,
        y: ((e.clientY - rect.top) / rect.height - 0.5) * 2,
      };
    };

    const onLeave = () => {
      targetTilt.current = { x: 0, y: 0 };
    };

    const tick = () => {
      // Lerp towards target for smoothness
      currentTilt.current.x += (targetTilt.current.x - currentTilt.current.x) * 0.08;
      currentTilt.current.y += (targetTilt.current.y - currentTilt.current.y) * 0.08;

      const { x, y } = currentTilt.current;

      // Layer 1: background name text – maximum tilt
      const nameBg = el.querySelector('.hero-name-bg');
      if (nameBg) {
        nameBg.style.transform = `
          translate(-50%, -50%)
          perspective(900px)
          rotateY(${x * 12}deg)
          rotateX(${-y * 7}deg)
          translateZ(8px)
        `;
      }

      // Layer 2: subtitle text – moderate tilt
      const sub = el.querySelector('.hero-subtitle-fg');
      if (sub) {
        sub.style.transform = `
          translateX(-50%)
          perspective(900px)
          rotateY(${x * 6}deg)
          rotateX(${-y * 4}deg)
          translateZ(4px)
        `;
      }

      rafRef.current = requestAnimationFrame(tick);
    };

    el.addEventListener('mousemove', onMove, { passive: true });
    el.addEventListener('mouseleave', onLeave);
    rafRef.current = requestAnimationFrame(tick);

    return () => {
      el.removeEventListener('mousemove', onMove);
      el.removeEventListener('mouseleave', onLeave);
      cancelAnimationFrame(rafRef.current);
    };
  }, []);

  /* Subtle scroll parallax on whole hero */
  const parallaxY = scrollY * 0.12;

  return (
    <section id="home" className="home-section" aria-label="Hero">
      <div
        className="hero-container"
        ref={heroRef}
        style={{ transform: `translateY(${parallaxY}px)` }}
      >
        {/* Background stroke name – deepest layer */}
        <div className="hero-name-bg">DHIVAGAR B</div>

        {/* Portrait */}
        <div className="hero-image-wrapper">
          <img src={profileImage} alt="Dhivagar B" className="hero-portrait" />
        </div>

        {/* Subtitle – foreground layer */}
        <div className="hero-subtitle-fg">FULL STACK ENGINEER</div>
      </div>

      {/* Full-width marquee plane – touches both edges */}
      <div className="hero-marquee-container" aria-hidden="true">
        <div className="hero-marquee-track">
          {Array(6).fill(0).map((_, i) => (
            <span className="hero-marquee-content" key={i}>
              DHIVAGAR B&nbsp;✦&nbsp;FULL STACK ENGINEER&nbsp;✦&nbsp;CREATIVE TECHNOLOGIST&nbsp;✦&nbsp;SYSTEM ARCHITECT&nbsp;✦&nbsp;CODE INNOVATOR&nbsp;✦&nbsp;SOLUTION BUILDER&nbsp;✦&nbsp;
            </span>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Home;
