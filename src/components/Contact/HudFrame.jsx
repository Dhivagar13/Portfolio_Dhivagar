import React, { useState, useRef, useLayoutEffect } from 'react';
import { generateHudFrameSVG } from './hudFrameGenerator';

const HudFrame = ({ 
  children, 
  seed = 898766, 
  glow = true,
  strokeOuter = "rgba(18,168,255,0.95)",
  strokeInner = "rgba(18,168,255,0.32)",
  accentFill = "rgba(18,168,255,0.55)",
  accentStroke = "rgba(18,168,255,0.78)",
  panelFill = "rgba(4,22,34,0.72)",
  texDotFill = "rgba(18,168,255,0.10)",
}) => {
    const containerRef = useRef(null);
    const [svgMarkup, setSvgMarkup] = useState('');

    useLayoutEffect(() => {
        const resizeObserver = new ResizeObserver((entries) => {
            const entry = entries[0];
            if (entry) {
                const { width, height } = entry.contentRect;
                if (width > 0 && height > 0) {
                     const { svgMarkup } = generateHudFrameSVG({
                         w: width,
                         h: height,
                         seed,
                         glow,
                         strokeOuter,
                         strokeInner,
                         accentFill,
                         accentStroke,
                         panelFill,
                         texDotFill
                     });
                     setSvgMarkup(svgMarkup);
                }
            }
        });
        
        if (containerRef.current) {
            resizeObserver.observe(containerRef.current);
        }

        return () => resizeObserver.disconnect();
    }, [seed, glow, strokeOuter, strokeInner, accentFill, accentStroke, panelFill, texDotFill]);

    return (
        <div ref={containerRef} className="hud-frame-container" style={{ position: 'relative', width: '100%', minHeight: '100%' }}>
            {svgMarkup && (
                <div 
                    className="hud-svg-wrapper" 
                    dangerouslySetInnerHTML={{ __html: svgMarkup }} 
                    style={{ 
                      position: 'absolute', 
                      top: 0, 
                      left: 0, 
                      right: 0, 
                      bottom: 0, 
                      overflow: 'visible', 
                      pointerEvents: 'none',
                      zIndex: 1 
                    }}
                />
            )}
            <div className="hud-content-wrapper" style={{ position: 'relative', zIndex: 10, padding: 'min(5vw, 60px)' }}>
                {children}
            </div>
        </div>
    );
};

export default HudFrame;
