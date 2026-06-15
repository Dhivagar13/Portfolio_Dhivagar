import { useState, useEffect, useRef, useCallback } from 'react';
import './TerminalBio.css';

const LINES = [
  { cmd: 'cat /home/dhivagar/profile.json', out: null },
  { cmd: null, out: '{' },
  { cmd: null, out: '  "name": "Dhivagar B",' },
  { cmd: null, out: '  "title": "Full Stack Engineer",' },
  { cmd: null, out: '  "specialty": "AI / ML Integration",' },
  { cmd: null, out: '  "mission": "Transforming ideas into intelligent solutions",' },
  { cmd: null, out: '  "superpower": "Shipping production-grade apps",' },
  { cmd: null, out: '  "status": "open to work",' },
  { cmd: null, out: '}' },
  { cmd: 'echo $STATUS', out: null },
  { cmd: null, out: '> 🚀 Available for exciting opportunities' },
];

const LINE_MS = 45;
const LINE_GAP = 220;

const TerminalBio = () => {
  const [visibleLines, setVisibleLines] = useState(0);
  const [progress, setProgress] = useState(0);
  const canvasRef = useRef(null);
  const frameRef = useRef(null);
  const tRef = useRef(0);

  useEffect(() => {
    const total = LINES.length;
    let idx = 0;
    setVisibleLines(0);
    setProgress(0);
    tRef.current = 0;

    const interval = setInterval(() => {
      idx++;
      tRef.current++;
      if (idx <= total) {
        setProgress(idx / total);
      }
      if (idx <= total) {
        setVisibleLines(idx);
      }
      if (idx > total) {
        clearInterval(interval);
      }
    }, LINE_GAP);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (visibleLines > 0) {
      setProgress(visibleLines / LINES.length);
    }
  }, [visibleLines]);

  const drawRadar = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const w = canvas.width;
    const h = canvas.height;
    const cx = w / 2;
    const cy = h / 2;
    const r = Math.min(w, h) * 0.35;

    ctx.clearRect(0, 0, w, h);

    const angle = (Date.now() / 1800) % (Math.PI * 2);

    ctx.strokeStyle = 'rgba(0, 240, 255, 0.15)';
    ctx.lineWidth = 0.5;
    for (let i = 0; i < 4; i++) {
      const a = (i / 4) * Math.PI * 2;
      ctx.beginPath();
      ctx.moveTo(cx, cy);
      ctx.lineTo(cx + Math.cos(a) * r, cy + Math.sin(a) * r);
      ctx.stroke();
    }
    for (let i = 1; i <= 3; i++) {
      ctx.beginPath();
      ctx.arc(cx, cy, (r / 3) * i, 0, Math.PI * 2);
      ctx.stroke();
    }

    ctx.save();
    ctx.beginPath();
    ctx.moveTo(cx, cy);
    ctx.arc(cx, cy, r, angle - 0.45, angle);
    ctx.closePath();
    const grad = ctx.createRadialGradient(cx, cy, 0, cx, cy, r);
    grad.addColorStop(0, 'rgba(0, 240, 255, 0.25)');
    grad.addColorStop(1, 'rgba(0, 240, 255, 0)');
    ctx.fillStyle = grad;
    ctx.fill();
    ctx.restore();

    ctx.strokeStyle = '#00f0ff';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(cx, cy);
    ctx.lineTo(cx + Math.cos(angle) * r, cy + Math.sin(angle) * r);
    ctx.stroke();

    const dotR = 2.5;
    ctx.fillStyle = '#00ff99';
    ctx.beginPath();
    ctx.arc(cx + Math.cos(angle) * r, cy + Math.sin(angle) * r, dotR, 0, Math.PI * 2);
    ctx.fill();

    frameRef.current = requestAnimationFrame(drawRadar);
  }, []);

  useEffect(() => {
    frameRef.current = requestAnimationFrame(drawRadar);
    return () => cancelAnimationFrame(frameRef.current);
  }, [drawRadar]);

  return (
    <div className="terminal-bio">
      <div className="terminal-bio-header">
        <span className="terminal-bio-dot" style={{ background: '#ff5f56' }} />
        <span className="terminal-bio-dot" style={{ background: '#ffbd2e' }} />
        <span className="terminal-bio-dot" style={{ background: '#27c93f' }} />
        <span className="terminal-bio-title">bio.sh</span>
        <div className="terminal-bio-progress">
          <div className="terminal-bio-progress-bar" style={{ width: `${progress * 100}%` }} />
        </div>
      </div>
      <div className="terminal-bio-body">
        <canvas ref={canvasRef} className="terminal-bio-canvas" width="160" height="160" />
        <div className="terminal-bio-lines">
          {LINES.slice(0, visibleLines).map((line, i) => (
            <div key={i} className="terminal-bio-line" style={{ animationDelay: `${i * 0.05}s` }}>
              {line.cmd !== null ? (
                <><span className="terminal-bio-prompt">$</span> <Typewriter text={line.cmd} speed={LINE_MS} start={i === visibleLines - 1} /></>
              ) : (
                <span className="terminal-bio-output">{line.out}</span>
              )}
            </div>
          ))}
          {visibleLines < LINES.length && (
            <div className="terminal-bio-line">
              <span className="terminal-bio-cursor" />
            </div>
          )}
          {visibleLines >= LINES.length && (
            <div className="terminal-bio-line terminal-bio-done">
              <span className="terminal-bio-prompt">$</span> <span className="terminal-bio-cursor-blink">_</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

function Typewriter({ text, speed, start }) {
  const [key, setKey] = useState(0);
  const [chars, setChars] = useState(0);

  useEffect(() => {
    if (!start) { setChars(text.length); return; }
    setKey(k => k + 1);
  }, [start, text.length]);

  useEffect(() => {
    if (!start) return;
    setChars(0);
    let i = 0;
    const interval = setInterval(() => {
      i++;
      setChars(i);
      if (i >= text.length) clearInterval(interval);
    }, speed);
    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key, speed, text]);

  return <span>{text.slice(0, chars)}</span>;
}

export default TerminalBio;
