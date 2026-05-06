import React, { useEffect, useRef, useState } from 'react';
import './Showcase.css';

/* ── Data ── */
const projectData = [
  {
    type: 'Project',
    title: 'Vita5',
    description: 'Mobile safety app // Real-time emergency alerts and location sharing to trusted contacts.',
    tech: ['Mobile App', 'Real-time Alerts'],
    domain: 'Safety',
    id: 'PRJ-V5',
  },
  {
    type: 'Project',
    title: 'AgriConnect',
    description: 'Farmer support system // Livestock management, agricultural marketplace, and expert consultation.',
    tech: ['Digital Platform', 'Smart Farming'],
    domain: 'Digital Agriculture',
    id: 'PRJ-00',
  },
  {
    type: 'Project',
    title: 'Smart Mentis',
    description: 'AI career guidance // Intelligent aptitude assessment with personalized recommendations.',
    tech: ['React', 'FastAPI', 'Firebase'],
    domain: 'EdTech',
    id: 'PRJ-01',
  },
  {
    type: 'Achievement',
    title: '1st Prize – Paper Presentation × 2',
    source: 'Academic Achievement',
    id: 'ACH-01',
  },
  {
    type: 'Certification',
    title: 'Java Programming Fundamentals',
    source: 'Springboard • Infosys',
    id: 'CRT-01',
  },
  {
    type: 'Project',
    title: 'Career Guidance System',
    source: 'Team Collaboration',
    id: 'PRJ-02',
  },
  {
    type: 'Certification',
    title: 'Python Programming Essentials',
    source: 'Ethnotech',
    id: 'CRT-02',
  },
];

const BIG_TEXTS = ['JAVA', 'PYTHON', 'REACT', 'AI', 'PROJECTS', 'SYSTEM', 'FUTURE', 'DESIGN', 'CODE'];

/* Directional entry variants */
const ENTRY_DIRS = ['left', 'right', 'bottom'];

const CONFIG = {
  itemCount: 24,
  starCount: 120,
  zGap: 800,
  camSpeed: 4.0,
};
CONFIG.loopSize = CONFIG.itemCount * CONFIG.zGap;

/* ── Entry offset by direction ── */
const getEntryOffset = (dir) => {
  switch (dir) {
    case 'left':   return { ox: -window.innerWidth * 0.6, oy: 0,    oz: -1200 };
    case 'right':  return { ox:  window.innerWidth * 0.6, oy: 0,    oz: -1200 };
    case 'bottom': return { ox: 0, oy:  window.innerHeight * 0.5,   oz: -1800 };
    default:       return { ox: 0, oy: 0, oz: -1200 };
  }
};

const Showcase = () => {
  const showcaseRef  = useRef(null);
  const worldRef     = useRef(null);
  const viewportRef  = useRef(null);

  const [fps, setFps]             = useState(60);
  const [velocityStr, setVelocityStr] = useState('0.00');
  const [coordStr, setCoordStr]   = useState('000');

  useEffect(() => {
    if (!showcaseRef.current) return;

    const world = worldRef.current;
    if (!world) return;

    world.innerHTML = '';

    const items = [];

    /* ── Build scene items ── */
    for (let i = 0; i < CONFIG.itemCount; i++) {
      const el = document.createElement('div');
      el.className = 'hyper-item';

      const isHeading = i % 3 === 0;

      if (isHeading) {
        /* Big background word */
        const txt = document.createElement('div');
        txt.className = 'hyper-big-text';
        txt.innerText = BIG_TEXTS[i % BIG_TEXTS.length];
        el.appendChild(txt);

        items.push({
          el,
          type: 'text',
          x: (Math.random() - 0.5) * window.innerWidth * 0.4,
          y: (Math.random() - 0.5) * window.innerHeight * 0.25,
          rot: (Math.random() - 0.5) * 18,
          baseZ: -i * CONFIG.zGap,
          dir: null,
          entryDone: true,   // text has no staged entry
          curX: 0, curY: 0,
        });
      } else {
        /* Card ── assign a directional entry */
        const dir  = ENTRY_DIRS[i % ENTRY_DIRS.length];
        const data = projectData[i % projectData.length];

        const card = document.createElement('div');
        card.className = 'hyper-card';

        const isProject = data.type === 'Project';
        const contentHtml = `
          <h2 class="hyper-title">${data.title}</h2>
          <p  class="hyper-desc">${data.description || data.source || ''}</p>
        `;
        const footerHtml = isProject
          ? `<span>${data.domain || data.source || 'PROJECT'}</span>
             <span>TECH: ${data.tech ? data.tech.length : '—'}</span>`
          : `<span>${data.source || 'CREDENTIAL'}</span>
             <span>${data.type.toUpperCase()}</span>`;

        card.innerHTML = `
          <div class="hyper-card-header">
            <span class="hyper-card-id">${data.id || 'SYS-ID'}</span>
            <div class="hyper-dot"></div>
          </div>
          <div class="hyper-card-body">${contentHtml}</div>
          <div class="hyper-card-footer">${footerHtml}</div>
          <div class="hyper-watermark">0${i}</div>
        `;
        el.appendChild(card);

        /* Spiral destination position */
        const angle   = (i / CONFIG.itemCount) * Math.PI * 8;
        const destX   = Math.cos(angle) * (window.innerWidth  * 0.32);
        const destY   = Math.sin(angle) * (window.innerHeight * 0.28);
        const rot     = (Math.random() - 0.5) * 28;

        /* Start off-screen in the entry direction */
        const { ox, oy } = getEntryOffset(dir);

        items.push({
          el,
          type: 'card',
          dir,
          destX, destY,
          rot,
          baseZ: -i * CONFIG.zGap,
          /* animated current position */
          curX: destX + ox,
          curY: destY + oy,
          entryDone: false,
          entryProgress: 0,   // 0 → 1
        });
      }

      world.appendChild(el);
    }

    /* ── Stars ── */
    for (let i = 0; i < CONFIG.starCount; i++) {
      const el = document.createElement('div');
      el.className = 'hyper-star';
      world.appendChild(el);
      items.push({
        el,
        type: 'star',
        x: (Math.random() - 0.5) * 3000,
        y: (Math.random() - 0.5) * 3000,
        baseZ: -Math.random() * CONFIG.loopSize,
        curX: 0, curY: 0,
        entryDone: true,
      });
    }

    /* ── State ── */
    const state = {
      velocity: 0,
      targetSpeed: 0,
      mouseX: 0,
      mouseY: 0,
    };

    const onMouseMove = (e) => {
      state.mouseX = (e.clientX / window.innerWidth  - 0.5) * 2;
      state.mouseY = (e.clientY / window.innerHeight - 0.5) * 2;
    };
    window.addEventListener('mousemove', onMouseMove, { passive: true });

    let lastTime      = performance.now();
    let lastScrollY   = window.scrollY;
    let animId;
    let isMounted     = true;

    /* ── Ease function for entry animations ── */
    const easeOutCubic = (t) => 1 - Math.pow(1 - t, 3);

    /* ── Render loop ── */
    const renderLoop = (time) => {
      if (!isMounted || !showcaseRef.current) return;

      const delta = time - lastTime;
      lastTime = time;

      if (time % 12 < 1) setFps(Math.round(1000 / (delta || 1)));

      /* Scroll → camera Z */
      const rect        = showcaseRef.current.getBoundingClientRect();
      const sectionScroll = -rect.top;
      const totalScrollable = rect.height - window.innerHeight;

      let localScroll = 0;
      let active = false;

      if (rect.top <= 0 && rect.bottom >= window.innerHeight) {
        active = true;
        localScroll = sectionScroll;
      } else if (rect.bottom < window.innerHeight) {
        localScroll = totalScrollable;
      }

      const currentScrollY = window.scrollY;
      const scrollDelta    = currentScrollY - lastScrollY;
      lastScrollY = currentScrollY;

      state.targetSpeed  = active ? scrollDelta : 0;
      state.velocity    += (state.targetSpeed - state.velocity) * 0.1;

      setVelocityStr(Math.abs(state.velocity).toFixed(2));
      setCoordStr(localScroll.toFixed(0));

      /* Camera tilt */
      const tiltX = state.mouseY * 5 - state.velocity * 0.1;
      const tiltY = state.mouseX * 5;

      if (worldRef.current) {
        worldRef.current.style.transform = `rotateX(${tiltX}deg) rotateY(${tiltY}deg)`;
      }

      /* Dynamic FOV */
      const fov = 1000 - Math.min(Math.abs(state.velocity) * 5, 400);
      if (viewportRef.current) {
        viewportRef.current.style.perspective = `${fov}px`;
      }

      const cameraZ = localScroll * CONFIG.camSpeed;

      /* ── Per-item update ── */
      items.forEach((item, idx) => {
        let relZ  = item.baseZ + cameraZ;
        const modC = CONFIG.loopSize;
        let vizZ   = ((relZ % modC) + modC) % modC;
        if (vizZ > 500) vizZ -= modC;

        /* Visibility */
        let alpha = 1;
        if (vizZ < -3000) alpha = 0;
        else if (vizZ < -2000) alpha = (vizZ + 3000) / 1000;
        if (vizZ > 100 && item.type !== 'star') alpha = 1 - ((vizZ - 100) / 400);
        if (alpha < 0) alpha = 0;

        item.el.style.opacity = alpha;

        if (alpha <= 0) return;

        /* ── Directional entry for cards ── */
        if (item.type === 'card' && !item.entryDone) {
          // Trigger entry animation when the card becomes visible (vizZ in [-2000, 0])
          if (vizZ > -2000 && vizZ < 0) {
            item.entryProgress = Math.min(item.entryProgress + 0.018, 1);
            if (item.entryProgress >= 1) item.entryDone = true;
          }

          const t     = easeOutCubic(item.entryProgress);
          const { ox, oy } = getEntryOffset(item.dir);

          // Interpolate from off-screen entry position to dest
          item.curX = item.destX + ox * (1 - t);
          item.curY = item.destY + oy * (1 - t);
        } else if (item.type === 'card') {
          item.curX = item.destX;
          item.curY = item.destY;
        }

        /* ── Transform per type ── */
        if (item.type === 'star') {
          const stretch = Math.max(1, Math.min(1 + Math.abs(state.velocity) * 0.12, 12));
          item.el.style.transform = `translate3d(${item.x}px, ${item.y}px, ${vizZ}px) scale3d(1, 1, ${stretch})`;

        } else if (item.type === 'text') {
          const offset = state.velocity * 1.5;
          if (Math.abs(state.velocity) > 1) {
            item.el.style.textShadow = `${offset}px 0 rgba(255,0,60,0.8), ${-offset}px 0 rgba(0,243,255,0.8)`;
          } else {
            item.el.style.textShadow = 'none';
          }
          item.el.style.transform = `translate3d(${item.x}px, ${item.y}px, ${vizZ}px) rotateZ(${item.rot}deg)`;

        } else {
          /* Card: floating bob + directional entry */
          const t       = time * 0.001;
          const floatY  = Math.sin(t * 0.8 + idx) * 8;
          const floatRot = Math.cos(t * 0.5 + idx) * 1.5;
          item.el.style.transform = `
            translate3d(${item.curX}px, ${item.curY + floatY}px, ${vizZ}px)
            rotateZ(${item.rot + floatRot}deg)
          `;
        }
      });

      animId = requestAnimationFrame(renderLoop);
    };

    animId = requestAnimationFrame(renderLoop);

    return () => {
      isMounted = false;
      window.removeEventListener('mousemove', onMouseMove);
      cancelAnimationFrame(animId);
    };
  }, []);

  return (
    <section id="achievements" className="showcase-section" ref={showcaseRef}>
      <div className="hyper-sticky">

        {/* Post-processing */}
        <div className="hyper-scanlines" />
        <div className="hyper-vignette" />
        <div className="hyper-noise" />

        {/* HUD */}
        <div className="hyper-hud">
          <div className="hyper-hud-top">
            <span>SYS.READY // ACHIEVEMENTS</span>
            <div className="hyper-hud-line" />
            <span>FPS: <strong>{fps}</strong></span>
          </div>

          <div
            className="hyper-center-nav"
            style={{
              alignSelf: 'flex-start',
              marginTop: 'auto',
              marginBottom: 'auto',
              writingMode: 'vertical-rl',
              transform: 'rotate(180deg)',
              fontSize: '9px',
              letterSpacing: '1.5px',
              color: 'rgba(255,255,255,0.4)',
            }}
          >
            VELOCITY // <strong>{velocityStr}</strong>
          </div>

          <div className="hyper-hud-bottom">
            <span>COORD: <strong>{coordStr}</strong></span>
            <div className="hyper-hud-line" />
            <span>VER 2.1.0 [MOTION]</span>
          </div>
        </div>

        {/* 3D World */}
        <div className="hyper-viewport" ref={viewportRef}>
          <div className="hyper-world" ref={worldRef} />
        </div>

      </div>
    </section>
  );
};

export default Showcase;
