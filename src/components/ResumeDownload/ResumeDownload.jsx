import React, { useRef } from 'react';
import gsap from 'gsap';
import './ResumeDownload.css';

const ResumeDownload = () => {
  const buttonRef = useRef(null);
  const textRef = useRef(null);
  const progressBarRef = useRef(null);
  const svgRef = useRef(null);
  const checkRef = useRef(null);
  const timelineRef = useRef(null);

  React.useEffect(() => {
    if (!timelineRef.current) {
      // Set up the SVG path
      const pathEl = checkRef.current;
      if (pathEl) {
        const length = pathEl.getTotalLength();
        pathEl.setAttribute('stroke-dasharray', length);
        pathEl.setAttribute('stroke-dashoffset', length);

        // Create timeline
        const timeline = gsap.timeline({ paused: true });

        timeline
          .to(textRef.current, {
            duration: 0.5,
            opacity: 0,
          }, 0)
          .to(
            buttonRef.current,
            {
              duration: 1.3,
              height: 10,
              width: 300,
              backgroundColor: '#2B2D2F',
              borderRadius: 100,
              ease: 'power2.inOut',
            },
            0
          )
          .to(
            progressBarRef.current,
            {
              duration: 2,
              width: 300,
              ease: 'linear',
            },
            0.3
          )
          .to(
            buttonRef.current,
            {
              duration: 0.1,
              width: 0,
            }
          )
          .to(
            progressBarRef.current,
            {
              duration: 0.75,
              width: 80,
              height: 80,
              delay: 0.5,
              borderRadius: 80,
              backgroundColor: '#71DFBE',
            }
          )
          .to(
            pathEl,
            {
              duration: 0.2,
              strokeDashoffset: 0,
              ease: 'easeInOutSine',
            }
          )
          .to({}, { duration: 1 }) // Delay before download
          .call(() => {
            // Download resume
            downloadResume();
            // Reset animation after 1 second
            setTimeout(() => {
              resetAnimation();
            }, 1000);
          });

        timelineRef.current = timeline;
      }
    }
  }, []);

  const downloadResume = () => {
    // Open Google Drive link in new tab
    window.open('https://drive.google.com/file/d/1E1ruhRPK9mgI0B9Bla5Lbib3U-w-3nPX/view?usp=drive_link', '_blank');
  };

  const resetAnimation = () => {
    if (timelineRef.current) {
      const pathEl = checkRef.current;
      const length = pathEl.getTotalLength();
      
      // Reset all elements to initial state
      gsap.to(textRef.current, {
        duration: 0.3,
        opacity: 1,
        overwrite: 'auto',
      });

      gsap.to(buttonRef.current, {
        duration: 0.3,
        height: 80,
        width: 200,
        backgroundColor: '#2B2D2F',
        borderRadius: 8,
        overwrite: 'auto',
      });

      gsap.to(progressBarRef.current, {
        duration: 0.3,
        width: 0,
        height: 10,
        borderRadius: 200,
        backgroundColor: '#71DFBE',
        overwrite: 'auto',
      });

      gsap.to(pathEl, {
        duration: 0.3,
        strokeDashoffset: length,
        overwrite: 'auto',
      });

      // Reset timeline for next click
      timelineRef.current.pause(0);
    }
  };

  const handleClick = () => {
    if (timelineRef.current) {
      timelineRef.current.restart();
    }
  };

  return (
    <div className="resume-download-container">
      <div
        className="resume-button"
        ref={buttonRef}
        onClick={handleClick}
        role="button"
        tabIndex={0}
        onKeyPress={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            handleClick();
          }
        }}
      >
        <div className="text" ref={textRef}>
          Download Resume
        </div>
      </div>

      <div className="progress-bar" ref={progressBarRef}></div>

      <svg
        ref={svgRef}
        x="0px"
        y="0px"
        viewBox="0 0 25 30"
        style={{ enableBackground: 'new 0 0 25 30' }}
      >
        <path
          ref={checkRef}
          className="check"
          d="M2,19.2C5.9,23.6,9.4,28,9.4,28L23,2"
        />
      </svg>
    </div>
  );
};

export default ResumeDownload;
