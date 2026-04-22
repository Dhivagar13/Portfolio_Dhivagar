import React, { useId, useRef, useEffect } from 'react';
import './ElectricBorder.css';

const ElectricBorder = ({
  children,
  color = "#7df9ff",
  speed = 1,
  chaos = 0.12,
  thickness = 2,
  style = {},
  className = ""
}) => {
  const filterId = useId().replace(/:/g, '');
  const turbulenceRef = useRef(null);

  useEffect(() => {
    let animationFrame;
    let time = 0;
    
    // Animate turbulence seed/frequency slightly to create chaotic electric jitter
    const animate = () => {
      time += speed * 0.05;
      if (turbulenceRef.current) {
        turbulenceRef.current.setAttribute('seed', Math.floor(time * 10).toString());
      }
      animationFrame = requestAnimationFrame(animate);
    };
    
    animate();
    
    return () => cancelAnimationFrame(animationFrame);
  }, [speed]);

  const cornerRadius = style.borderRadius || 16;

  return (
    <div 
      className={`electric-border-wrapper ${className}`} 
      style={{ 
        ...style, 
        '--e-color': color, 
        '--e-thickness': `${thickness}px`, 
        '--e-speed': `${2 / speed}s`,
        borderRadius: cornerRadius
      }}
    >
      <div className="electric-border-layer">
        <svg className="electric-svg" preserveAspectRatio="none">
           <filter id={`electric-filter-${filterId}`} x="-20%" y="-20%" width="140%" height="140%">
             <feTurbulence 
               ref={turbulenceRef}
               type="fractalNoise" 
               baseFrequency={chaos} 
               numOctaves="1" 
               result="turbulence" 
             />
             <feDisplacementMap 
               in="SourceGraphic" 
               in2="turbulence" 
               scale={thickness * 6} 
               xChannelSelector="R" 
               yChannelSelector="G" 
               result="displacement"
             />
             <feGaussianBlur in="displacement" stdDeviation="1.5" result="blur" />
             <feMerge>
                <feMergeNode in="blur"/>
                <feMergeNode in="SourceGraphic"/>
             </feMerge>
           </filter>

           {/* Glowing bounding box */}
           <rect 
             x={thickness / 2} 
             y={thickness / 2} 
             width={`calc(100% - ${thickness}px)`} 
             height={`calc(100% - ${thickness}px)`} 
             className="electric-base"
             rx={cornerRadius}
           />
           {/* Electric chaotic rays */}
           <rect 
             x={thickness / 2} 
             y={thickness / 2} 
             width={`calc(100% - ${thickness}px)`} 
             height={`calc(100% - ${thickness}px)`} 
             className="electric-ray"
             rx={cornerRadius}
             filter={`url(#electric-filter-${filterId})`}
           />
           <rect 
             x={thickness / 2} 
             y={thickness / 2} 
             width={`calc(100% - ${thickness}px)`} 
             height={`calc(100% - ${thickness}px)`} 
             className="electric-ray ray-reverse"
             rx={cornerRadius}
             filter={`url(#electric-filter-${filterId})`}
           />
        </svg>
      </div>

      <div className="electric-border-content" style={{ borderRadius: cornerRadius }}>
        {children}
      </div>
    </div>
  );
};

export default ElectricBorder;
