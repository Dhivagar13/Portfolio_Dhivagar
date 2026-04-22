import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import ResumeDownload from '../ResumeDownload';
import './About.css';

gsap.registerPlugin(ScrollTrigger);

const About = () => {
  const containerRef = useRef(null);

  useEffect(() => {
    let ctx = gsap.context(() => {
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
    <section id="about" className="container" aria-label="Stage" ref={containerRef}>
      <div className="spacer spacer--top">
        <div className="scroller">
          <span className="dot"></span>Scroll To Explore ??
        </div>
      </div>

      <p className="eyebrow">About Me</p>

      <h2 className="row">
        <span className="fill">I'm Dhivagar B</span>
      </h2>

      <h2 className="row">
        <span className="fill">Full Stack Engineer // Creative Technologist</span>
      </h2>

      <h2 className="row">
        <span className="fill">Crafting elegant & powerful solutions</span>
      </h2>

      <h2 className="row">
        <span className="fill">Mastering Java • React • Spring • Beyond</span>
      </h2>

      <h2 className="row">
        <span className="fill">Building the Extraordinary</span>
      </h2>

      <div style={{ display: 'flex', justifyContent: 'center', margin: '60px 0' }}>
        <ResumeDownload />
      </div>

      <div className="spacer spacer--bottom">
        <div className="scroller">Awesome ????</div>
      </div>
    </section>
  );
};

export default About;
