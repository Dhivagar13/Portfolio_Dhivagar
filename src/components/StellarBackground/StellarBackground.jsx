import React, { useEffect, useRef } from "react";
import CyberneticGridShader from "../ui/cybernetic-grid-shader";

const StellarBackground = () => {
    const canvasRef = useRef(null);
    const particlesRef = useRef([]);
    const mouseRef = useRef({ x: -1000, y: -1000 });
    const animFrameRef = useRef(0);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        const resize = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        };
        resize();
        window.addEventListener("resize", resize);

        const initParticles = () => {
            const count = Math.min(80, Math.floor(window.innerWidth / 20));
            particlesRef.current = Array.from({ length: count }, () => ({
                x: Math.random() * canvas.width,
                y: Math.random() * canvas.height,
                vx: (Math.random() - 0.5) * 0.5,
                vy: (Math.random() - 0.5) * 0.5,
                size: Math.random() * 2 + 1,
            }));
        };
        initParticles();

        const handleMouse = (e) => {
            mouseRef.current = { x: e.clientX, y: e.clientY };
        };
        window.addEventListener("mousemove", handleMouse);

        const animate = () => {
            if (!canvasRef.current) return;

            ctx.clearRect(0, 0, canvas.width, canvas.height);
            const particles = particlesRef.current;
            const mouse = mouseRef.current;

            // Update and draw particles
            particles.forEach((p) => {
                p.x += p.vx;
                p.y += p.vy;

                if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
                if (p.y < 0 || p.y > canvas.height) p.vy *= -1;

                ctx.beginPath();
                ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
                ctx.fillStyle = "rgba(0, 255, 255, 1.0)";
                ctx.shadowColor = "rgba(0, 255, 255, 1.0)";
                ctx.shadowBlur = 18;
                ctx.fill();
                ctx.shadowBlur = 0;
            });

            // Draw connections between particles
            for (let i = 0; i < particles.length; i++) {
                for (let j = i + 1; j < particles.length; j++) {
                    const dx = particles[i].x - particles[j].x;
                    const dy = particles[i].y - particles[j].y;
                    const dist = Math.sqrt(dx * dx + dy * dy);

                    if (dist < 150) {
                        ctx.beginPath();
                        ctx.moveTo(particles[i].x, particles[i].y);
                        ctx.lineTo(particles[j].x, particles[j].y);
                        ctx.strokeStyle = `rgba(0, 255, 200, ${0.55 * (1 - dist / 150)})`;
                        ctx.lineWidth = 1.0;
                        ctx.shadowColor = "rgba(0, 255, 180, 0.9)";
                        ctx.shadowBlur = 8;
                        ctx.stroke();
                        ctx.shadowBlur = 0;
                    }
                }

                // Connect particles to mouse
                const mdx = particles[i].x - mouse.x;
                const mdy = particles[i].y - mouse.y;
                const mDist = Math.sqrt(mdx * mdx + mdy * mdy);

                if (mDist < 200) {
                    ctx.beginPath();
                    ctx.moveTo(particles[i].x, particles[i].y);
                    ctx.lineTo(mouse.x, mouse.y);
                    ctx.strokeStyle = `rgba(0, 220, 255, ${0.65 * (1 - mDist / 200)})`;
                    ctx.lineWidth = 1.2;
                    ctx.shadowColor = "rgba(0, 220, 255, 1.0)";
                    ctx.shadowBlur = 10;
                    ctx.stroke();
                    ctx.shadowBlur = 0;
                }
            }

            animFrameRef.current = requestAnimationFrame(animate);
        };

        animate();

        return () => {
            window.removeEventListener("resize", resize);
            window.removeEventListener("mousemove", handleMouse);
            cancelAnimationFrame(animFrameRef.current);
        };
    }, []);

    return (
        <>
            {/* Layer 1: Deep cosmic base background */}
            <div
                style={{
                    position: "fixed",
                    top: 0,
                    left: 0,
                    width: "100%",
                    height: "100vh",
                    background: "radial-gradient(ellipse at 50% 60%, #041a2e 0%, #051525 45%, #09090b 100%)",
                    zIndex: -3,
                }}
            />

            {/* Layer 2: Cybernetic WebGL Grid Shader */}
            <div style={{ zIndex: -2, position: "fixed", top: 0, left: 0, width: "100%", height: "100vh", pointerEvents: "none" }}>
                <CyberneticGridShader />
            </div>

            {/* Layer 3: Stellar Particle Network (Canvas) */}
            <canvas
                ref={canvasRef}
                style={{
                    position: "fixed",
                    top: 0,
                    left: 0,
                    width: "100%",
                    height: "100vh",
                    zIndex: -1,
                    pointerEvents: "none",
                }}
            />
        </>
    );
};

export default StellarBackground;
