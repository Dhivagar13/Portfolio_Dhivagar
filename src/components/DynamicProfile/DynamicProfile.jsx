import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import ResumeDownload from '../ResumeDownload';
import MagneticText from './MagneticText';
import TerminalBio from './TerminalBio';
import './DynamicProfile.css';

gsap.registerPlugin(ScrollTrigger);

/* ── Quick-stat data ── */
const STATS = [
  { value: '3+', label: 'Years Coding' },
  { value: '10+', label: 'Projects Built' },
  { value: '5+', label: 'Tech Stacks' },
  { value: '∞', label: 'Curiosity' },
];

/* ── About row data ── */
const ROWS = [
  { text: "I'm Dhivagar B",                           tag: 'Intro' },
  { text: 'Full Stack Engineer // AI Specialist',      tag: 'Role' },
  { text: 'Transforming ideas into intelligent solutions', tag: 'Mission' },
  { text: 'Java • React • Spring Boot • ML/AI • Cloud', tag: 'Stack' },
  { text: 'Open Source Contributor & Mentor',          tag: 'Community' },
  { text: 'Building robust systems that scale',        tag: 'Ethos' },
  { text: 'Engineering solutions that make a difference', tag: 'Vision' },
];

const DynamicProfile = () => {
  const containerRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const rows = gsap.utils.toArray('.row');

      rows.forEach((row) => {
        const fill = row.querySelector('.fill');

        gsap.fromTo(
          fill,
          { backgroundSize: '0% 100%, 35% 100%' },
          {
            backgroundSize: '100% 100%, 35% 100%',
            ease: 'none',
            scrollTrigger: {
              trigger: row,
              start: 'top 100%',
              end: 'bottom 20%',
              scrub: true,
            },
          }
        );
      });
    }, containerRef);

    ScrollTrigger.refresh();

    return () => ctx.revert();
  }, []);

  return (
    <section id="about" className="container" aria-label="About Dhivagar" ref={containerRef}>
      {/* Top spacer */}
      <div className="spacer spacer--top">
        <div className="scroller">
          <span className="dot" />
          Scroll To Explore ↓
        </div>
      </div>

      <p className="eyebrow">My Profile</p>

      {/* Stats grid */}
      <div className="stats-grid" aria-label="Key stats">
        {STATS.map(({ value, label }) => (
          <div className="stat-item" key={label}>
            <span className="stat-value">{value}</span>
            <span className="stat-label">{label}</span>
          </div>
        ))}
      </div>

      {/* Resume download */}
      <div style={{ display: 'flex', justifyContent: 'center', margin: '40px 0' }}>
        <ResumeDownload />
      </div>

      <div className="about-columns">
        <div className="about-rows-col">
          {ROWS.map(({ text, tag }, i) => (
            <h2 className="row" key={i} tabIndex={0}>
              <span className="fill">
                <MagneticText text={text} />
                <span className="row-tag">{tag}</span>
              </span>
            </h2>
          ))}
        </div>
        <div className="about-terminal-col">
          <TerminalBio />
        </div>
      </div>

      {/* Bottom spacer */}
      <div className="spacer spacer--bottom">
        <div className="scroller">Awesome 🚀</div>
      </div>
    </section>
  );
};

export default DynamicProfile;
