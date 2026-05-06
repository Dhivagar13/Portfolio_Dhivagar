import React from 'react';

export function GooeyMarquee({ text, className = "", speed = 16 }) {
  return (
    <div className={`relative w-full overflow-hidden flex items-center justify-center ${className}`}>
      {/* Blur layer with wider mask so it stays visible longer at the edges */}
      <div
        className="absolute inset-0 flex items-center justify-center"
        style={{
          backgroundColor: "transparent",
          maskImage: 'linear-gradient(to right, transparent, black 5%, black 95%, transparent)',
          WebkitMaskImage: 'linear-gradient(to right, transparent, black 5%, black 95%, transparent)'
        }}
      >
        <p
          className="absolute min-w-full whitespace-nowrap"
          style={{
            filter: "blur(4px)",
            animation: `gooey-marquee ${speed}s infinite linear`,
          }}
        >
          {text}
        </p>
      </div>

      {/* Clear text layer with narrower mask so it fades into the blur at the edges */}
      <div className="relative flex items-center justify-center invisible">
        <p className="min-w-full whitespace-nowrap">
          {text}
        </p>
      </div>
      
      <div className="absolute inset-0 flex items-center justify-center"
        style={{
          maskImage: 'linear-gradient(to right, transparent, black 15%, black 85%, transparent)',
          WebkitMaskImage: 'linear-gradient(to right, transparent, black 15%, black 85%, transparent)'
        }}
      >
        <p
          className="absolute min-w-full whitespace-nowrap"
          style={{
            animation: `gooey-marquee ${speed}s infinite linear`,
          }}
        >
          {text}
        </p>
      </div>
    </div>
  );
}
