import React, { useEffect, useRef, useState } from 'react';
import './OceanBackground.css';

const NAMES = ["HOME", "ABOUT", "SKILLS", "PROJECTS", "SHOWCASE"];
const N = NAMES.length;

const OceanBackground = () => {
  const canvasRef = useRef(null);
  const [hudPct, setHudPct] = useState("000%");
  const [hudScene, setHudScene] = useState(0);
  const [progWidth, setProgWidth] = useState(0);
  const [theme, setTheme] = useState('dark');

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const gl = canvas.getContext("webgl", {
      alpha: false,
      antialias: false,
      depth: false,
      stencil: false,
      preserveDrawingBuffer: false,
      powerPreference: "high-performance"
    });

    if (!gl) return;

    const vs = `
    attribute vec2 a;
    void main() {
      gl_Position = vec4(a, 0.0, 1.0);
    }
    `;

    const fs = `
    precision highp float;

    uniform vec2  uR;
    uniform float uT, uS, uSc, uBl;
    uniform vec3  uBg;

    #define PI 3.14159265359
    #define MARCH_STEPS 22
    #define REFINE_STEPS 5

    float sat(float x) { return clamp(x, 0.0, 1.0); }

    float smoother(float x) {
      x = sat(x);
      return x * x * x * (x * (x * 6.0 - 15.0) + 10.0);
    }

    vec3 sCol(vec3 c0, vec3 c1, vec3 c2, vec3 c3, vec3 c4) {
      int si = int(uSc);
      vec3 a = c0; vec3 b = c1;
      if (si == 1) { a = c1; b = c2; }
      else if (si == 2) { a = c2; b = c3; }
      else if (si >= 3) { a = c3; b = c4; }
      return mix(a, b, uBl);
    }

    float sF(float c0, float c1, float c2, float c3, float c4) {
      int si = int(uSc);
      float a = c0; float b = c1;
      if (si == 1) { a = c1; b = c2; }
      else if (si == 2) { a = c2; b = c3; }
      else if (si >= 3) { a = c3; b = c4; }
      return mix(a, b, uBl);
    }

    mat2 rot(float a) {
      float c = cos(a), s = sin(a);
      return mat2(c, -s, s, c);
    }

    float hash(vec2 p) {
      return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123);
    }

    float noise(vec2 p) {
      vec2 i = floor(p), f = fract(p);
      f = f * f * (3.0 - 2.0 * f);
      float a = hash(i);
      float b = hash(i + vec2(1.0, 0.0));
      float c = hash(i + vec2(0.0, 1.0));
      float d = hash(i + vec2(1.0, 1.0));
      return mix(mix(a, b, f.x), mix(c, d, f.x), f.y);
    }

    float waveH(vec2 p, float t, float amp, float storm) {
      float h = 0.0;
      vec2 swell1 = normalize(vec2(1.0, 0.28));
      vec2 swell2 = rot(storm * 0.18) * normalize(vec2(-0.48, 0.88));
      vec2 swell3 = rot(-storm * 0.14) * normalize(vec2(0.82, -0.16));

      float d1 = dot(p, swell1), d2 = dot(p, swell2), d3 = dot(p, swell3);
      
      h += amp * 0.66 * sin(d1 * 0.42 + t * 0.38);
      h += amp * 0.22 * sin(d1 * 0.94 - t * 0.62);
      h += amp * 0.14 * sin(d2 * 1.18 - t * 0.82);
      h += amp * 0.09 * sin(d3 * 1.82 + t * 1.04);
      h += amp * (0.11 + storm * 0.07) * sin(p.x * 1.45 - t * 0.76 + p.y * 0.66);
      h += amp * (0.07 + storm * 0.05) * sin(p.x * 2.85 + t * 1.06 - p.y * 0.52);
      h += amp * (0.04 + storm * 0.03) * sin(p.x * 4.60 - t * 1.50 + p.y * 1.02);
      
      float micro = noise(p * 14.0 + vec2(t * 0.18, t * 0.06)) - 0.5;
      h += micro * amp * (0.010 + storm * 0.008);
      
      return h;
    }

    vec3 waveNorm(vec2 p, float t, float amp, float storm) {
      float e = 0.018;
      float hL = waveH(p - vec2(e, 0.0), t, amp, storm);
      float hR = waveH(p + vec2(e, 0.0), t, amp, storm);
      float hD = waveH(p - vec2(0.0, e), t, amp, storm);
      float hU = waveH(p + vec2(0.0, e), t, amp, storm);
      return normalize(vec3(-(hR - hL) / (2.0 * e), 1.0, -(hU - hD) / (2.0 * e)));
    }

    float starField(vec2 uv, float t) {
      vec2 gv = floor(uv), lv = fract(uv) - 0.5;
      float h = hash(gv);
      float size = mix(0.012, 0.0025, h);
      float d = length(lv + vec2(hash(gv + 3.1) - 0.5, hash(gv + 7.3) - 0.5) * 0.25);
      float star = smoothstep(size, 0.0, d) * smoothstep(0.82, 1.0, h);
      // Improved: twinkling stars
      star *= 0.5 + 0.5 * sin(t * (h*10.0+2.0) + h * 100.0);
      return star;
    }

    // Improved design: Add birds flock
    float sdBird(vec2 p) {
        float wing = p.x;
        p.x = abs(p.x);
        float d = length(p - vec2(p.y * 1.2, p.y * p.y * 3.0)) - 0.012;
        // animate flapping
        float flap = sin(wing * 20.0 + uT * 15.0) * 0.05 * p.x;
        d = d - flap;
        // clip bird bounds
        return smoothstep(0.01, 0.0, d) * step(0.0, p.y) * step(p.y, 0.15);
    }

    float flock(vec2 uv) {
       float b = 0.0;
       for(int i=0; i<3; i++) {
           float fi = float(i);
           vec2 p = uv + vec2(-0.8 + fi * -0.15 + mod(uT * 0.05 + fi * 0.2, 2.0) * 1.5, -0.3 + sin(uT * 0.2 + fi) * 0.05 - fi * 0.05);
           b += sdBird(p * 5.0);
       }
       return clamp(b, 0.0, 1.0);
    }

    void main() {
      vec2 uv = (gl_FragCoord.xy - uR * 0.5) / uR.y;
      float s = smoother(uS);

      float camY = mix(1.14, 1.03, s);
      camY += sin(s * PI * 1.4) * 0.028;
      float camZ = mix(0.08, -0.18, s);
      float pitch = mix(0.115, 0.088, s);

      vec3 ro = vec3(0.0, camY, camZ);
      vec3 rd = normalize(vec3(uv.x, uv.y - pitch, -1.4));

      float storm = smoothstep(0.80, 1.0, s);
      float night = smoothstep(0.56, 0.84, s);

      vec3 skyTop = sCol(vec3(0.18, 0.06, 0.24), vec3(0.05, 0.24, 0.68), vec3(0.26, 0.06, 0.04), vec3(0.01, 0.01, 0.05), vec3(0.04, 0.05, 0.09));
      vec3 skyHori = sCol(vec3(0.92, 0.48, 0.18), vec3(0.42, 0.62, 0.90), vec3(0.88, 0.32, 0.04), vec3(0.03, 0.05, 0.14), vec3(0.15, 0.17, 0.23));
      vec3 sunCol = sCol(vec3(1.0, 0.62, 0.22), vec3(1.0, 0.96, 0.80), vec3(1.0, 0.38, 0.05), vec3(0.70, 0.75, 0.94), vec3(0.26, 0.28, 0.34));
      vec3 seaDeep = sCol(vec3(0.08, 0.05, 0.12), vec3(0.03, 0.14, 0.34), vec3(0.10, 0.06, 0.04), vec3(0.00, 0.01, 0.03), vec3(0.03, 0.04, 0.07));
      vec3 seaShlo = sCol(vec3(0.28, 0.17, 0.24), vec3(0.09, 0.38, 0.60), vec3(0.24, 0.13, 0.06), vec3(0.04, 0.06, 0.16), vec3(0.07, 0.10, 0.14));
      vec3 fogCol = sCol(vec3(0.80, 0.50, 0.30), vec3(0.58, 0.72, 0.90), vec3(0.70, 0.28, 0.05), vec3(0.02, 0.03, 0.08), vec3(0.12, 0.14, 0.18));

      float sunProgress = clamp(s / 0.35, 0.0, 1.0);
      float sunAngle = sunProgress * PI;
      vec3 sunDir = normalize(vec3(cos(sunAngle) * -0.75, sin(sunAngle) * 0.38 - 0.08, -1.0));
      vec3 moonDir = normalize(vec3(-0.14, 0.42, -1.0));

      float waveAmp = sF(0.082, 0.070, 0.100, 0.054, 0.30) + storm * 0.020;
      float fogDen = sF(0.020, 0.010, 0.022, 0.034, 0.046);
      float moonAmt = sF(0.0, 0.0, 0.05, 0.92, 0.06);

      float sunAbove = step(0.0, sunDir.y);
      float sunGlow = smoothstep(-0.10, 0.06, sunDir.y);

      vec3 col;

      if (rd.y < 0.0) {
        float stepSize = (ro.y / (-rd.y)) / float(MARCH_STEPS);
        float t = stepSize;
        for (int i = 0; i < MARCH_STEPS; i++) {
          if ((ro.y + rd.y * t) < waveH(ro.xz + rd.xz * t, uT, waveAmp, storm)) break;
          t += stepSize;
        }
        float ta = t - stepSize, tb = t;
        for (int i = 0; i < REFINE_STEPS; i++) {
          float tm = (ta + tb) * 0.5;
          if (ro.y + rd.y * tm < waveH(ro.xz + rd.xz * tm, uT, waveAmp, storm)) tb = tm; else ta = tm;
        }
        t = (ta + tb) * 0.5;

        vec2 wp = ro.xz + rd.xz * t;
        vec3 n = waveNorm(wp, uT, waveAmp, storm);
        float fres = pow(1.0 - clamp(dot(n, -rd), 0.0, 1.0), 4.0);

        vec3 reflSky = mix(skyHori, skyTop, pow(clamp(reflect(rd, n).y, 0.0, 1.0), 0.42));
        reflSky += sunCol * pow(max(dot(reflect(rd, n), sunDir), 0.0), 120.0) * 2.0 * sunGlow;

        if (moonAmt > 0.04) reflSky += vec3(0.72, 0.80, 0.95) * pow(max(dot(reflect(rd,n), moonDir),0.0), 120.0) * 0.78 * moonAmt;

        vec3 waterC = mix(seaDeep, seaShlo, exp(-t * 0.40) * 0.5);
        waterC *= mix(vec3(1.0), vec3(0.85, 0.92, 1.0), clamp(t * 0.25, 0.0, 1.0));
        col = mix(waterC, reflSky, 0.15 + fres * 0.34);
        
        col += sunCol * pow(max(dot(reflect(-sunDir, n), -rd), 0.0), 200.0) * 1.10 * sunAbove;
        col = mix(col, fogCol, 1.0 - exp(-t * fogDen * 1.65));
      } else {
        col = mix(skyHori, skyTop, pow(clamp(rd.y, 0.0, 1.0), 0.38));
      }

      vec3 skyCol = mix(skyHori, skyTop, pow(clamp(rd.y, 0.0, 1.0), 0.38));
      float clouds = smoothstep(0.62, 0.86, noise(rd.x * 5.5 + vec2(rd.y * 3.0, uT * 0.015)) * 0.65 + noise(rd.x * 8.0 - vec2(rd.y * 4.0, uT * 0.010)) * 0.35);
      skyCol = mix(skyCol, mix(skyCol * 0.97, mix(vec3(1.0, 0.82, 0.65), vec3(0.42, 0.48, 0.56), storm), 0.35), clouds * smoothstep(-0.02, 0.24, rd.y) * (0.08 + storm * 0.18));
      
      float sd = max(dot(rd, sunDir), 0.0);
      skyCol += sunCol * pow(sd, 380.0) * 6.8 * sunGlow + sunCol * smoothstep(0.99925, 0.99995, dot(rd, sunDir)) * 2.6 * sunGlow;

      if (night > 0.02) {
        vec2 starUv = (rd.xy / max(0.12, rd.z + 1.6)) * 140.0;
        float stars = starField(starUv, uT) + starField(starUv * 0.55 + 11.7, uT * 0.5) * 0.65;
        skyCol += vec3(0.80, 0.88, 1.0) * stars * night * 0.82 * smoothstep(0.02, 0.26, rd.y) * (1.0 - storm * 0.85);
      }

      // Render birds using the flock function
      float b = flock(rd.xy);
      skyCol = mix(skyCol, vec3(0.05, 0.05, 0.08), b * (1.0 - night) * (1.0 - storm));

      col = mix(col, skyCol, smoothstep(-0.008, 0.008, rd.y));
      col = mix(fogCol, col, smoothstep(-0.008, 0.018, rd.y) * 0.25 + 0.75);

      col += (hash(gl_FragCoord.xy * 0.5 + floor(uT * 12.0)) - 0.5) * 0.006;
      gl_FragColor = vec4(clamp(col, 0.0, 1.0), 1.0);
    }
    `;

    const mkShader = (type, src) => {
      const s = gl.createShader(type);
      gl.shaderSource(s, src);
      gl.compileShader(s);
      if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) {
        console.error(gl.getShaderInfoLog(s));
        return null;
      }
      return s;
    };

    const vert = mkShader(gl.VERTEX_SHADER, vs);
    const frag = mkShader(gl.FRAGMENT_SHADER, fs);
    const prog = gl.createProgram();
    gl.attachShader(prog, vert);
    gl.attachShader(prog, frag);
    gl.linkProgram(prog);

    gl.useProgram(prog);
    gl.disable(gl.DEPTH_TEST);

    const buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1,-1, 1,-1, -1,1, 1,1]), gl.STATIC_DRAW);

    const ap = gl.getAttribLocation(prog, "a");
    gl.enableVertexAttribArray(ap);
    gl.vertexAttribPointer(ap, 2, gl.FLOAT, false, 0, 0);

    const uR = gl.getUniformLocation(prog, "uR");
    const uTi = gl.getUniformLocation(prog, "uT");
    const uScroll = gl.getUniformLocation(prog, "uS");
    const uScene = gl.getUniformLocation(prog, "uSc");
    const uBlend = gl.getUniformLocation(prog, "uBl");
    const uBg = gl.getUniformLocation(prog, "uBg");

    let animationId;
    let t0 = performance.now();
    let smoothScroll = 0;

    const resize = () => {
      const cw = window.innerWidth;
      const ch = window.innerHeight;
      canvas.width = cw;
      canvas.height = ch;
      gl.viewport(0, 0, cw, ch);
      gl.uniform2f(uR, cw, ch);
    };

    window.addEventListener('resize', resize);
    resize();

    const hexToVec3 = (hex) => {
      const n = parseInt(hex.replace("#", ""), 16);
      return [((n >> 16) & 255) / 255, ((n >> 8) & 255) / 255, (n & 255) / 255];
    };

    const bgColors = { dark: "#0a0a0f", light: "#eef4ff" };

    const frame = (now) => {
      const time = (now - t0) / 1000;

      const [r, g, b] = hexToVec3(bgColors[theme] || bgColors.dark);
      gl.uniform3f(uBg, r, g, b);

      let maxScroll = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
      const showcaseEl = document.getElementById('achievements');
      if (showcaseEl) {
          // Finish background transition right as we reach the Showcase
          maxScroll = Math.max(1, showcaseEl.offsetTop);
      }
      
      const scrollTarget = Math.min(1, Math.max(0, window.scrollY / maxScroll));
      
      // Better smooth scroll interpolation
      smoothScroll += (scrollTarget - smoothScroll) * 0.08;
      
      const raw = smoothScroll * (N - 1);
      const si = Math.min(Math.floor(raw), N - 2);
      const bl = raw - si;

      setHudPct(String(Math.round(smoothScroll * 100)).padStart(3, "0") + "%");
      setProgWidth(smoothScroll * 100);
      setHudScene(si);

      gl.uniform1f(uTi, time);
      gl.uniform1f(uScroll, smoothScroll);
      gl.uniform1f(uScene, si);
      gl.uniform1f(uBlend, bl);

      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
      animationId = requestAnimationFrame(frame);
    };

    animationId = requestAnimationFrame(frame);

    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(animationId);
    };
  }, [theme]);

  return (
    <>
      <canvas id="webgl_canvas" ref={canvasRef} />
      
      {/* HUD Layer */}
      <div id="hud">
        <div id="hud_pct">{hudPct}</div>
        <div className="progress-bar">
          <div className="progress-fill" style={{ width: `${progWidth}%` }}></div>
        </div>
        <div className="scene-label">{NAMES[hudScene]}</div>
      </div>

      <button id="theme_toggle" onClick={() => setTheme(prev => prev === 'dark' ? 'light' : 'dark')} aria-label="Toggle themes">
        {theme === 'dark' ? '☀' : '🌙'}
      </button>

      <div id="scene_strip">
        {NAMES.map((name, i) => (
          <div key={i} className={`scene-dot ${i === hudScene ? 'active' : ''}`}></div>
        ))}
      </div>
    </>
  );
};

export default OceanBackground;
