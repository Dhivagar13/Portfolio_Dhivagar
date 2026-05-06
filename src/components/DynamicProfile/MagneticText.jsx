import { useRef, useCallback } from 'react';

const STRENGTH = 90;  // repulsion radius in px
const POWER    = 0.42; // falloff curve

/**
 * MagneticText
 * Splits `text` into individual letter <span>s and repels them from
 * the cursor with a springy transform.
 * Colour is intentionally left to the parent (background-clip: text
 * on .fill handles the GSAP scroll-paint reveal).
 */
function MagneticText({ text }) {
  const spansRef = useRef([]);
  const rafRef   = useRef(null);

  const onMouseMove = useCallback((e) => {
    cancelAnimationFrame(rafRef.current);
    rafRef.current = requestAnimationFrame(() => {
      spansRef.current.forEach((span) => {
        if (!span) return;
        const rect = span.getBoundingClientRect();
        const cx   = rect.left + rect.width  / 2;
        const cy   = rect.top  + rect.height / 2;
        const dx   = e.clientX - cx;
        const dy   = e.clientY - cy;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < STRENGTH) {
          const force = Math.pow(1 - dist / STRENGTH, 1 / POWER);
          const tx = -(dx / dist) * force * 22;
          const ty = -(dy / dist) * force * 12;
          span.style.transform = `translate(${tx}px, ${ty}px)`;
        } else {
          span.style.transform = '';
        }
      });
    });
  }, []);

  const onMouseLeave = useCallback(() => {
    cancelAnimationFrame(rafRef.current);
    spansRef.current.forEach((span) => {
      if (!span) return;
      span.style.transform = '';
    });
  }, []);

  return (
    <span
      className="magnetic-text"
      onMouseMove={onMouseMove}
      onMouseLeave={onMouseLeave}
    >
      {text.split('').map((char, i) => (
        <span
          key={i}
          ref={(el) => { spansRef.current[i] = el; }}
          className="mag-letter"
          style={{ display: char === ' ' ? 'inline' : 'inline-block' }}
        >
          {char === ' ' ? '\u00A0' : char}
        </span>
      ))}
    </span>
  );
}

export default MagneticText;
