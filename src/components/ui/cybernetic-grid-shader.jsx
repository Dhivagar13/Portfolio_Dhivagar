import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

const CyberneticGridShader = () => {
    const containerRef = useRef(null);

    useEffect(() => {
        const container = containerRef.current;
        if (!container) return;

        // 1) Renderer, Scene, Camera, Clock
        const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
        renderer.setPixelRatio(window.devicePixelRatio);
        container.appendChild(renderer.domElement);

        const scene = new THREE.Scene();
        const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
        const clock = new THREE.Clock();

        // 2) GLSL Shaders
        const vertexShader = `
      void main() {
        gl_Position = vec4(position, 1.0);
      }
    `;

        const fragmentShader = `
      precision highp float;
      uniform vec2 iResolution;
      uniform float iTime;
      uniform vec2 iMouse;

      float random(vec2 st) {
        return fract(sin(dot(st.xy, vec2(12.9898, 78.233)))
                     * 43758.5453123);
      }

      void main() {
        // normalize coords around center
        vec2 uv    = (gl_FragCoord.xy - 0.5 * iResolution.xy)
                     / iResolution.y;
        vec2 mouse = (iMouse - 0.5 * iResolution.xy)
                     / iResolution.y;

        float t         = iTime * 0.2;
        float mouseDist = length(uv - mouse);

        // warp effect around mouse
        float warp = sin(mouseDist * 20.0 - t * 4.0) * 0.1;
        warp *= smoothstep(0.4, 0.0, mouseDist);
        uv += warp;

        // grid lines
        vec2 gridUv = abs(fract(uv * 10.0) - 0.5);
        float line  = pow(1.0 - min(gridUv.x, gridUv.y), 50.0);

        // neon blue-green mixed base grid color pulsing
        vec3 gridColor = vec3(0.0, 0.9, 1.0); // neon cyan/blue
        vec3 color     = gridColor
                       * line
                       * (0.4 + sin(t * 2.0) * 0.2);

        // green neon accent
        vec3 greenAccent = vec3(0.0, 1.0, 0.5);
        color += greenAccent * line * (0.1 + cos(t * 1.5) * 0.1);

        // energetic pulses along grid (mixed neon — cyan + green)
        float energy = sin(uv.x * 20.0 + t * 5.0)
                     * sin(uv.y * 20.0 + t * 3.0);
        energy = smoothstep(0.8, 1.0, energy);
        // pulse: alternate neon blue and neon green
        vec3 pulseColor = mix(vec3(0.0, 0.8, 1.0), vec3(0.0, 1.0, 0.4), sin(t * 2.0) * 0.5 + 0.5);
        color += pulseColor * energy * line * 1.5;

        // glow around mouse (neon cyan)
        float glow = smoothstep(0.12, 0.0, mouseDist);
        color += vec3(0.0, 1.0, 0.9) * glow * 0.6;

        // subtle noise
        color += random(uv + t * 0.1) * 0.03;

        // keep alpha low so particles layer shows through
        float alpha = min(line * 0.85 + energy * 0.3 + glow * 0.4, 0.92);
        gl_FragColor = vec4(color, alpha);
      }
    `;

        // 3) Uniforms, Material, Mesh
        const uniforms = {
            iTime: { value: 0 },
            iResolution: { value: new THREE.Vector2() },
            iMouse: {
                value: new THREE.Vector2(
                    window.innerWidth / 2,
                    window.innerHeight / 2
                )
            }
        };

        const material = new THREE.ShaderMaterial({
            vertexShader,
            fragmentShader,
            uniforms,
            transparent: true,
        });

        const geometry = new THREE.PlaneGeometry(2, 2);
        const mesh = new THREE.Mesh(geometry, material);
        scene.add(mesh);

        // 4) Resize handler — use actual framebuffer size (CSS × dpr)
        const onResize = () => {
            const w = container.clientWidth;
            const h = container.clientHeight;
            renderer.setSize(w, h);
            // iResolution must match gl_FragCoord space = CSS * dpr
            const dpr = renderer.getPixelRatio();
            uniforms.iResolution.value.set(w * dpr, h * dpr);
        };
        window.addEventListener('resize', onResize);
        onResize();

        // 5) Mouse tracking — scale by dpr to match framebuffer coordinates
        const mouse = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
        const onMouseMove = (e) => {
            const dpr = renderer.getPixelRatio();
            mouse.x = e.clientX * dpr;
            mouse.y = (window.innerHeight - e.clientY) * dpr;
        };
        window.addEventListener('mousemove', onMouseMove);

        // 6) Animation loop with smooth lerp
        const smoothMouse = { x: mouse.x, y: mouse.y };
        const LERP = 0.12;

        renderer.setAnimationLoop(() => {
            uniforms.iTime.value = clock.getElapsedTime();
            smoothMouse.x += (mouse.x - smoothMouse.x) * LERP;
            smoothMouse.y += (mouse.y - smoothMouse.y) * LERP;
            uniforms.iMouse.value.set(smoothMouse.x, smoothMouse.y);
            renderer.render(scene, camera);
        });

        // 7) Cleanup on unmount
        return () => {
            window.removeEventListener('resize', onResize);
            window.removeEventListener('mousemove', onMouseMove);

            renderer.setAnimationLoop(null);

            const canvas = renderer.domElement;
            if (canvas.parentNode) {
                canvas.parentNode.removeChild(canvas);
            }

            material.dispose();
            geometry.dispose();
            renderer.dispose();
        };
    }, []);

    return (
        <div
            ref={containerRef}
            aria-label="Cybernetic Grid animated background"
            style={{
                width: '100%',
                height: '100%',
                pointerEvents: 'none',
            }}
        />
    );
};

export default CyberneticGridShader;
