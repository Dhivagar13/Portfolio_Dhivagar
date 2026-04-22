
import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import './KineticDotsLoader.css';

const KineticDotsLoader = ({ onFinish }) => {
    const [hiding, setHiding] = useState(false);
    const wrapRef = useRef(null);

    useEffect(() => {
        const hideTimer = setTimeout(() => setHiding(true), 3500); // give it a bit longer to see the animation
        const finishTimer = setTimeout(() => onFinish && onFinish(), 4100);

        let $wrap = wrapRef.current;
        if (!$wrap) return;

        let canvassize = window.innerWidth > 600 ? 500 : window.innerWidth * 0.9;
        
        let length = 30, radius = 5.6;
        let rotatevalue = 0.035;
        let acceleration = 0, animatestep = 0, toend = false;
        
        const pi2 = Math.PI * 2;
        
        const scene = new THREE.Scene();
        const group = new THREE.Group();
        scene.add(group);

        const camera = new THREE.PerspectiveCamera(65, 1, 1, 10000);
        camera.position.z = 150;

        class CustomCurve extends THREE.Curve {
            constructor(scale = 1) {
                super();
                this.scale = scale;
            }
            getPoint(percent, optionalTarget = new THREE.Vector3()) {
                let x = length * Math.sin(pi2 * percent),
                    y = radius * Math.cos(pi2 * 3 * percent),
                    z, t;

                t = percent % 0.25 / 0.25;
                t = percent % 0.25 - (2 * (1 - t) * t * -0.0185 + t * t * 0.25);
                if (Math.floor(percent / 0.25) === 0 || Math.floor(percent / 0.25) === 2) {
                    t *= -1;
                }
                z = radius * Math.sin(pi2 * 2 * (percent - t));
                return optionalTarget.set(x, y, z).multiplyScalar(this.scale);
            }
        }

        const path = new CustomCurve();
        const geometry = new THREE.TubeGeometry(path, 200, 1.1, 8, true);
        const material = new THREE.MeshBasicMaterial({ color: 0xffffff });
        const mesh = new THREE.Mesh(geometry, material);
        group.add(mesh);

        // fake shadow
        for (let i = 0; i < 10; i++) {
            const plain = new THREE.Mesh(
                new THREE.PlaneGeometry(length * 2 + 1, radius * 3, 1), 
                new THREE.MeshBasicMaterial({ color: 0xd1684e, transparent: true, opacity: 0.13 })
            );
            plain.position.z = -2.5 + i * 0.5;
            group.add(plain);
        }

        const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
        renderer.setPixelRatio(window.devicePixelRatio);
        renderer.setSize(canvassize, canvassize);
        renderer.setClearColor('#d1684e', 0); // Use CSS background

        $wrap.appendChild(renderer.domElement);

        let animationFrameId;
        
        function easing(t, b, c, d) {
            if ((t /= d / 2) < 1) return c / 2 * t * t + b;
            return c / 2 * ((t -= 2) * t * t + 2) + b;
        }

        function render() {
            animatestep = Math.max(0, Math.min(240, toend ? animatestep + 1 : animatestep - 4));
            acceleration = easing(animatestep, 0, 1, 240);
            // Removed the turning/ring logic, so it purely spins
            renderer.render(scene, camera);
        }

        function animate() {
            mesh.rotation.x += rotatevalue + acceleration;
            render();
            animationFrameId = requestAnimationFrame(animate);
        }

        animate();

        const start = () => { toend = true; };
        const back = () => { toend = false; };

        window.addEventListener('mousedown', start, false);
        window.addEventListener('touchstart', start, { passive: true });
        window.addEventListener('mouseup', back, false);
        window.addEventListener('touchend', back, { passive: true });

        return () => {
            clearTimeout(hideTimer);
            clearTimeout(finishTimer);
            window.removeEventListener('mousedown', start);
            window.removeEventListener('touchstart', start);
            window.removeEventListener('mouseup', back);
            window.removeEventListener('touchend', back);
            cancelAnimationFrame(animationFrameId);
            renderer.dispose();
            if ($wrap.contains(renderer.domElement)) {
                $wrap.removeChild(renderer.domElement);
            }
            geometry.dispose();
            material.dispose();
        };
    }, [onFinish]);

    return (
        <div className={`kdl-overlay ${hiding ? 'kdl-hiding' : ''}`}>
            <div id="wrap" ref={wrapRef}></div>
            <p className="kdl-info">* Mouse or finger press to spin faster!</p>
        </div>
    );
};

export default KineticDotsLoader;
