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

const CONFIG = {
  itemCount: 24,
  starCount: 200,
  zGap: 1000,
  camSpeed: 4.0,
};
CONFIG.loopSize = CONFIG.itemCount * CONFIG.zGap;

const Showcase = () => {
  const showcaseRef  = useRef(null);
  const worldRef     = useRef(null);
  const viewportRef  = useRef(null);

  const fpsRef = useRef(null);
  const velRef = useRef(null);
  const coordRef = useRef(null);

  useEffect(() => {
    if (!showcaseRef.current) return;

    const world = worldRef.current;
    if (!world) return;

    world.innerHTML = '';

    const items = [];
    const w = window.innerWidth;
    const h = window.innerHeight;
    const tunnelRadius = Math.min(w, h) * 0.28;

    /* ── Build scene items — all approach from deep Z space ── */
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
          x: (Math.random() - 0.5) * w * 0.5,
          y: (Math.random() - 0.5) * h * 0.3,
          rot: (Math.random() - 0.5) * 18,
          baseZ: -i * CONFIG.zGap - Math.random() * CONFIG.zGap * 0.4,
        });
      } else {
        /* Card */
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

        /* Tunnel spiral — items orbit as they approach from deep space */
        const angle = (i / CONFIG.itemCount) * Math.PI * 10 + Math.random() * 0.5;
        const r = tunnelRadius * (0.6 + 0.4 * (i / CONFIG.itemCount));
        const rot = (Math.random() - 0.5) * 20;

        items.push({
          el,
          type: 'card',
          x: Math.cos(angle) * r,
          y: Math.sin(angle) * r * 0.65,
          rot,
          baseZ: -i * CONFIG.zGap - Math.random() * CONFIG.zGap * 0.3,
        });
      }

      world.appendChild(el);
    }

    /* ── Stars — dense field for deep-space feel ── */
    for (let i = 0; i < CONFIG.starCount; i++) {
      const el = document.createElement('div');
      el.className = 'hyper-star';
      world.appendChild(el);
      items.push({
        el,
        type: 'star',
        x: (Math.random() - 0.5) * 5000,
        y: (Math.random() - 0.5) * 5000,
        size: 1 + Math.random() * 2,
        baseZ: -(Math.random() * CONFIG.loopSize * 1.5),
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

    /* ── Render loop — items approach from deep Z space ── */
    const renderLoop = (time) => {
      if (!isMounted || !showcaseRef.current) return;

      const delta = time - lastTime;
      lastTime = time;

      if (time % 12 < 1 && fpsRef.current) fpsRef.current.innerText = String(Math.round(1000 / (delta || 1)));

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

      // Use Lenis velocity if available for smoother scroll detection
      let scrollDelta;
      if (window.lenis) {
        scrollDelta = window.lenis.velocity * 0.5;
      } else {
        const currentScrollY = window.scrollY;
        scrollDelta = currentScrollY - lastScrollY;
        lastScrollY = currentScrollY;
      }

      state.targetSpeed  = active ? scrollDelta : 0;
      state.velocity    += (state.targetSpeed - state.velocity) * 0.08;

      if (velRef.current) velRef.current.innerText = Math.abs(state.velocity).toFixed(2);
      if (coordRef.current) coordRef.current.innerText = localScroll.toFixed(0);

      /* Camera tilt (mouse + speed) */
      const tiltX = state.mouseY * 5 - state.velocity * 0.1;
      const tiltY = state.mouseX * 5;
      if (worldRef.current) {
        worldRef.current.style.transform = `rotateX(${tiltX}deg) rotateY(${tiltY}deg)`;
      }

      /* Dynamic FOV — tighter at speed for warp feel */
      const fov = 1000 - Math.min(Math.abs(state.velocity) * 5, 400);
      if (viewportRef.current) {
        viewportRef.current.style.perspective = `${fov}px`;
      }

      const cameraZ = localScroll * CONFIG.camSpeed;
      const now = time * 0.001;

      /* ── Per-item update ── */
      items.forEach((item, idx) => {
        let relZ  = item.baseZ + cameraZ;
        const modC = CONFIG.loopSize;
        let vizZ   = ((relZ % modC) + modC) % modC;
        if (vizZ > 500) vizZ -= modC;

        /* ── Depth scale: items grow as they approach from deep space ── */
        // vizZ goes from -loopSize/2 (~ -12000) to +500
        // Map to approach factor: 0 = far behind, 1 = at camera plane
        const approach = Math.max(0, Math.min(1, (vizZ + 3500) / 3000));
        const depthScale = approach;  // 0 → 1 as item approaches camera

        /* ── Visibility: fade in from deep space, fade out past camera ── */
        let alpha = 1;
        if (vizZ < -3500) alpha = 0;
        else if (vizZ < -2000) alpha = (vizZ + 3500) / 1500;
        if (vizZ > 80) alpha = Math.max(0, 1 - (vizZ - 80) / 300);
        if (alpha < 0) alpha = 0;

        item.el.style.opacity = alpha * alpha;  // square for smoother fade

        if (alpha <= 0.01 || vizZ > 350) return;

        /* ── Transform per type ── */
        if (item.type === 'star') {
          // Stars streak more at higher velocity (warp effect)
          const streak = Math.max(1, Math.min(1 + Math.abs(state.velocity) * 0.15, 20));
          item.el.style.transform = `
            translate3d(${item.x}px, ${item.y}px, ${vizZ}px)
            scale3d(1, 1, ${streak})
          `;
        } else if (item.type === 'text') {
          // Text emerges from deep space — slight 3D rotation settles as it approaches
          const rotSettle = (1 - approach) * 20;
          item.el.style.transform = `
            translate3d(${item.x}px, ${item.y}px, ${vizZ}px)
            rotateX(${rotSettle * (Math.random() > 0.5 ? 1 : -1)}deg)
            rotateY(${rotSettle * (Math.random() > 0.5 ? 1 : -1)}deg)
            rotateZ(${item.rot}deg)
            scale(${depthScale})
          `;
        } else {
          /* Card: floats gently while approaching from deep space */
          const floatY  = Math.sin(now * 0.8 + idx) * 6 * depthScale;
          const floatRot = Math.cos(now * 0.5 + idx) * 1.2 * depthScale;
          // Cards scale up as they approach
          const cardScale = 0.3 + 0.7 * depthScale;
          item.el.style.transform = `
            translate3d(${item.x}px, ${item.y + floatY}px, ${vizZ}px)
            rotateZ(${item.rot + floatRot}deg)
            scale(${cardScale})
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
            <span>FPS: <strong ref={fpsRef}>60</strong></span>
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
            VELOCITY // <strong ref={velRef}>0.00</strong>
          </div>

          <div className="hyper-hud-bottom">
            <span>COORD: <strong ref={coordRef}>000</strong></span>
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
