import React, { useEffect, useRef, useState } from 'react';
import './Showcase.css';

const projectData = [
  {
    type: 'Project',
    title: 'Vita5',
    description: 'Mobile safety app // Real-time emergency alerts and location sharing to trusted contacts.',
    tech: ['Mobile App', 'Real-time Alerts'],
    domain: "Safety",
    id: "PRJ-V5"
  },
  {
    type: 'Project',
    title: 'AgriConnect',
    description: 'Farmer support system // Livestock management, agricultural marketplace, and expert consultation.',
    tech: ['Digital Platform', 'Smart Farming'],
    domain: "Digital Agriculture",
    id: "PRJ-00"
  },
  {
    type: 'Project',
    title: 'Smart Mentis',
    description: 'AI career guidance // Intelligent aptitude assessment with personalized recommendations.',
    tech: ['React', 'FastAPI', 'Firebase'],
    domain: "EdTech",
    id: "PRJ-01"
  },
  {
    type: 'Achievement',
    title: '🏆 1st Prize Winner - Paper Presentation (2 times)',
    source: 'Academic Achievement',
  },
  {
    type: 'Certification',
    title: 'Java Programming Fundamentals',
    source: 'Springboard • Infosys',
  },
  {
    type: 'Project',
    title: 'Career Guidance System',
    source: 'Team Collaboration',
  },
  {
    type: 'Certification',
    title: 'Python Programming Essentials',
    source: 'Ethnotech',
  }
];

const allData = [...projectData];

// Big text chunks to scatter
const BIG_TEXTS = ["JAVA", "PYTHON", "REACT", "AI", "PROJECTS", "SYSTEM", "FUTURE", "DESIGN", "CODE"];

const CONFIG = {
  itemCount: 24, 
  starCount: 120,
  zGap: 800,
  camSpeed: 4.0,
};
CONFIG.loopSize = CONFIG.itemCount * CONFIG.zGap;

const Showcase = () => {
  const showcaseRef = useRef(null);
  const worldRef = useRef(null);
  const viewportRef = useRef(null);
  
  const [fps, setFps] = useState(60);
  const [velocityStr, setVelocityStr] = useState("0.00");
  const [coordStr, setCoordStr] = useState("000.000");

  useEffect(() => {
    if (!showcaseRef.current) return;
    
    const items = [];
    const world = worldRef.current;
    if (!world) return;
    
    // Clear existing innerHTML to prevent React strict mode duplication
    world.innerHTML = '';
    
    // Create Items
    for (let i = 0; i < CONFIG.itemCount; i++) {
        const el = document.createElement('div');
        el.className = 'hyper-item';

        const isHeading = i % 3 === 0;

        if (isHeading) {
            const txt = document.createElement('div');
            txt.className = 'hyper-big-text';
            txt.innerText = BIG_TEXTS[i % BIG_TEXTS.length];
            el.appendChild(txt);
            items.push({
                el, type: 'text',
                x: 0, y: 0, rot: 0,
                baseZ: -i * CONFIG.zGap
            });
        } else {
            const dataItem = allData[i % allData.length];
            const card = document.createElement('div');
            card.className = 'hyper-card';
            
            let footerHtml = '';
            let contentHtml = '';
            
            if (dataItem.type === 'Project') {
               contentHtml = `<h2 class="hyper-title">${dataItem.title}</h2>
                              <p class="hyper-desc">${dataItem.description}</p>`;
               footerHtml = `<span>${dataItem.domain || dataItem.source || 'PROJECT'}</span>
                             <span>TECH: ${dataItem.tech ? dataItem.tech.length : 'N/A'}</span>`;
            } else {
               contentHtml = `<h2 class="hyper-title">${dataItem.title}</h2>
                              <p class="hyper-desc">${dataItem.description}</p>`;
               footerHtml = `<span>${dataItem.source || 'CREDENTIAL'}</span>
                             <span>${dataItem.type.toUpperCase()}</span>`;
            }
            
            card.innerHTML = `
                <div class="hyper-card-header">
                    <span class="hyper-card-id">${dataItem.id || 'SYS-ID'}</span>
                    <div class="hyper-dot"></div>
                </div>
                <div class="hyper-card-body">
                  ${contentHtml}
                </div>
                <div class="hyper-card-footer">
                    ${footerHtml}
                </div>
                <div class="hyper-watermark">0${i}</div>
            `;
            el.appendChild(card);

            // Spiral / Chaos positioning
            const angle = (i / CONFIG.itemCount) * Math.PI * 8;
            const x = Math.cos(angle) * (window.innerWidth * 0.35); 
            const y = Math.sin(angle) * (window.innerHeight * 0.3);
            const rot = (Math.random() - 0.5) * 30;

            items.push({
                el, type: 'card',
                x, y, rot,
                baseZ: -i * CONFIG.zGap
            });
        }
        world.appendChild(el);
    }

    // Create Stars
    for (let i = 0; i < CONFIG.starCount; i++) {
        const el = document.createElement('div');
        el.className = 'hyper-star';
        world.appendChild(el);
        items.push({
            el, type: 'star',
            x: (Math.random() - 0.5) * 3000,
            y: (Math.random() - 0.5) * 3000,
            baseZ: -Math.random() * CONFIG.loopSize
        });
    }

    const state = {
      velocity: 0,
      targetSpeed: 0,
      scrollProgress: 0, // from 0 to total track distance
      mouseX: 0,
      mouseY: 0
    };

    const handleMouseMove = (e) => {
        state.mouseX = (e.clientX / window.innerWidth - 0.5) * 2; 
        state.mouseY = (e.clientY / window.innerHeight - 0.5) * 2;
    };
    window.addEventListener('mousemove', handleMouseMove);

    let lastTime = performance.now();
    let animationFrameId;
    let lastScrollY = window.scrollY;
    let isMounted = true;

    const renderLoop = (time) => {
      if (!isMounted || !showcaseRef.current) {
        return;
      }
        const delta = time - lastTime;
        lastTime = time;
        if (time % 10 < 1) setFps(Math.round(1000 / (delta || 1)));

        // Calculate scroll relative to the Showcase component bounding rect
      const rect = showcaseRef.current.getBoundingClientRect();
        const sectionScroll = -rect.top; // pixels scrolled past the top of the container
        const totalScrollable = rect.height - window.innerHeight;
        
        let localScroll = 0;
        let active = false;

        if (rect.top <= 0 && rect.bottom >= window.innerHeight) {
           active = true;
           localScroll = sectionScroll;
        } else if (rect.bottom < window.innerHeight) {
           localScroll = totalScrollable;
        } else if (rect.top > 0) {
           localScroll = 0;
        }

        // Calculate target speed based on local delta or global delta
        const currentScrollY = window.scrollY;
        const scrollDelta = currentScrollY - lastScrollY;
        lastScrollY = currentScrollY;

        if (active) {
            state.targetSpeed = scrollDelta;
        } else {
            state.targetSpeed = 0;
        }

        state.velocity += (state.targetSpeed - state.velocity) * 0.1;
        
        setVelocityStr(Math.abs(state.velocity).toFixed(2));
        setCoordStr(localScroll.toFixed(0));

        // 1. Camera Tilt & Shake
        const tiltX = state.mouseY * 5 - state.velocity * 0.1;
        const tiltY = state.mouseX * 5;

        if (worldRef.current) {
            worldRef.current.style.transform = `
                rotateX(${tiltX}deg) 
                rotateY(${tiltY}deg)
            `;
        }

        // 2. Dynamic Perspective
        const baseFov = 1000;
        const fov = baseFov - Math.min(Math.abs(state.velocity) * 5, 400);
        if (viewportRef.current) {
            viewportRef.current.style.perspective = `${fov}px`;
        }

        // 3. Item Loop
        // localScroll acts as the main driver for the Z-axis camera push
        const cameraZ = localScroll * CONFIG.camSpeed;

        items.forEach(item => {
            let relZ = item.baseZ + cameraZ;

            const modC = CONFIG.loopSize;
            let vizZ = ((relZ % modC) + modC) % modC;
            if (vizZ > 500) vizZ -= modC; 

            let alpha = 1;
            if (vizZ < -3000) alpha = 0;
            else if (vizZ < -2000) alpha = (vizZ + 3000) / 1000;

            if (vizZ > 100 && item.type !== 'star') alpha = 1 - ((vizZ - 100) / 400);

            if (alpha < 0) alpha = 0;
            item.el.style.opacity = alpha;

            if (alpha > 0) {
                let trans = `translate3d(${item.x}px, ${item.y}px, ${vizZ}px)`;

                if (item.type === 'star') {
                    const stretch = Math.max(1, Math.min(1 + Math.abs(state.velocity) * 0.1, 10));
                    trans += ` scale3d(1, 1, ${stretch})`;
                } else if (item.type === 'text') {
                    trans += ` rotateZ(${item.rot}deg)`;
                    if (Math.abs(state.velocity) > 1) {
                        const offset = state.velocity * 1.5;
                        item.el.style.textShadow = `${offset}px 0 rgba(255,0,60,0.8), ${-offset}px 0 rgba(0,243,255,0.8)`;
                    } else {
                        item.el.style.textShadow = 'none';
                    }
                } else {
                    const t = time * 0.001;
                    const float = Math.sin(t + item.x) * 10;
                    trans += ` rotateZ(${item.rot}deg) rotateY(${float}deg)`;
                }

                item.el.style.transform = trans;
            }
        });

        animationFrameId = requestAnimationFrame(renderLoop);
    };

    animationFrameId = requestAnimationFrame(renderLoop);

    return () => {
      isMounted = false;
      window.removeEventListener('mousemove', handleMouseMove);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <section id="achievements" className="showcase-section" ref={showcaseRef}>
      <div className="hyper-sticky">
        
        {/* OVERLAYS */}
        <div className="hyper-scanlines"></div>
        <div className="hyper-vignette"></div>
        <div className="hyper-noise"></div>

        {/* HUD */}
        <div className="hyper-hud">
            <div className="hyper-hud-top">
                <span>SYS.READY // ACHIEVEMENTS</span>
                <div className="hyper-hud-line"></div>
                <span>FPS: <strong>{fps}</strong></span>
            </div>
            <div className="hyper-center-nav" style={{ alignSelf: 'flex-start', marginTop: 'auto', marginBottom: 'auto', writingMode: 'vertical-rl', transform: 'rotate(180deg)' }}>
                VELOCITY // <strong>{velocityStr}</strong>
            </div>
            <div className="hyper-hud-bottom">
                <span>COORD: <strong>{coordStr}</strong></span>
                <div className="hyper-hud-line"></div>
                <span>VER 2.0.4 [BRUTAL]</span>
            </div>
        </div>

        {/* 3D WORLD */}
        <div className="hyper-viewport" ref={viewportRef}>
            <div className="hyper-world" ref={worldRef}></div>
        </div>
        
      </div>
    </section>
  );
};

export default Showcase;
