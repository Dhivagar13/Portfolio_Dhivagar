import React, { useRef, useState, useEffect } from 'react';

/**
 * Generates an SVG path string for a futuristic, chamfered corner frame.
 */
function generateHudFrameSVG(w, h, cornerSize = 20) {
  // A path that starts top left, goes to top right (with a cut), etc.
  return `
    M ${cornerSize},0
    L ${w - cornerSize},0
    L ${w},${cornerSize}
    L ${w},${h - cornerSize}
    L ${w - cornerSize},${h}
    L ${cornerSize},${h}
    L 0,${h - cornerSize}
    L 0,${cornerSize}
    Z
  `;
}

function HudFrame({ children, cornerSize = 20, strokeColor = '#00f0ff', fillColor = 'rgba(10, 25, 50, 0.65)' }) {
  const containerRef = useRef(null);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

  useEffect(() => {
    if (!containerRef.current) return;
    
    const observer = new ResizeObserver((entries) => {
      for (let entry of entries) {
        setDimensions({
          width: entry.contentRect.width,
          height: entry.contentRect.height,
        });
      }
    });

    observer.observe(containerRef.current);
    
    return () => {
      observer.disconnect();
    };
  }, []);

  const { width, height } = dimensions;

  return (
    <div 
      ref={containerRef} 
      style={{ position: 'relative', width: '100%', display: 'flex' }}
      className="hud-frame-container"
    >
      {/* Background SVG Frame */}
      {width > 0 && height > 0 && (
        <svg
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            pointerEvents: 'none',
            zIndex: 0
          }}
          width={width}
          height={height}
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d={generateHudFrameSVG(width, height, cornerSize)}
            fill={fillColor}
            stroke={strokeColor}
            strokeWidth="2"
            vectorEffect="non-scaling-stroke"
          />
          {/* Accent corners */}
          <path
            d={`
              M 0,${cornerSize + 10} L 0,${cornerSize} L ${cornerSize},0 L ${cornerSize + 10},0
              M ${width - cornerSize - 10},0 L ${width - cornerSize},0 L ${width},${cornerSize} L ${width},${cornerSize + 10}
              M ${width},${height - cornerSize - 10} L ${width},${height - cornerSize} L ${width - cornerSize},${height} L ${width - cornerSize - 10},${height}
              M ${cornerSize + 10},${height} L ${cornerSize},${height} L 0,${height - cornerSize} L 0,${height - cornerSize - 10}
            `}
            fill="none"
            stroke={strokeColor}
            strokeWidth="4"
            filter="drop-shadow(0 0 6px rgba(0,240,255,0.8))"
          />
        </svg>
      )}

      {/* Content wrapper */}
      <div 
        style={{ 
          position: 'relative', 
          zIndex: 1, 
          width: '100%', 
          height: '100%', 
          padding: '2px' // ensures children don't get clipped exactly at border
        }}
      >
        {children}
      </div>
    </div>
  );
}

export default HudFrame;
