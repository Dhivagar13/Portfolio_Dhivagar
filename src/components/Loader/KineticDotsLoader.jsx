import React, { useEffect, useState } from 'react';
import './KineticDotsLoader.css';

const KineticDotsLoader = ({ onFinish }) => {
    const [hiding, setHiding] = useState(false);

    useEffect(() => {
        // Show loader for 2.2s then fade out
        const hideTimer = setTimeout(() => setHiding(true), 2200);
        // Unmount after fade completes
        const finishTimer = setTimeout(() => onFinish && onFinish(), 2800);
        return () => {
            clearTimeout(hideTimer);
            clearTimeout(finishTimer);
        };
    }, [onFinish]);

    return (
        <div className={`kdl-overlay ${hiding ? 'kdl-hiding' : ''}`}>
            <div className="kdl-center">
                {/* Brand name */}
                <div className="kdl-brand">&lt;DHIVAGAR/&gt;</div>

                {/* Kinetic dots */}
                <div className="kdl-dots">
                    {[0, 1, 2, 3, 4].map((i) => (
                        <span key={i} className="kdl-dot" style={{ animationDelay: `${i * 0.12}s` }} />
                    ))}
                </div>

                <div className="kdl-label">Loading portfolio...</div>
            </div>
        </div>
    );
};

export default KineticDotsLoader;
