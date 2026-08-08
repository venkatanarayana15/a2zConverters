import React, { useEffect, useRef } from 'react';

const Premium3DBackground = () => {
    const canvasRef = useRef(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        let animationFrameId;

        let width, height;
        let time = 0;
        let mouseX = 0, mouseY = 0;
        let smoothMouseX = 0, smoothMouseY = 0;

        const resize = () => {
            const dpr = Math.min(window.devicePixelRatio || 1, 2);
            width = canvas.parentElement?.offsetWidth || window.innerWidth;
            height = canvas.parentElement?.offsetHeight || window.innerHeight;
            canvas.width = width * dpr;
            canvas.height = height * dpr;
            canvas.style.width = width + 'px';
            canvas.style.height = height + 'px';
            ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
        };

        const handleMouseMove = (e) => {
            const rect = canvas.getBoundingClientRect();
            // -1 to 1 normalized coordinates
            mouseX = ((e.clientX - rect.left) / width) * 2 - 1;
            mouseY = ((e.clientY - rect.top) / height) * 2 - 1;
        };

        window.addEventListener('resize', resize);
        window.addEventListener('mousemove', handleMouseMove);
        resize();

        // CONFIG
        const ROWS = 35;
        const COLS = 45;
        const GAP = 34;
        const BASE_Y = 140;

        const project = (x, y, z) => {
            const fov = 600;
            const scale = fov / (fov + z);
            return {
                x: x * scale + width / 2,
                y: y * scale + height / 2,
                scale
            };
        };

        const isDark = () => document.documentElement.classList.contains('dark');
        const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

        const renderFrame = () => {
            time += 0.006;
            smoothMouseX += (mouseX - smoothMouseX) * 0.08;
            smoothMouseY += (mouseY - smoothMouseY) * 0.08;

            ctx.clearRect(0, 0, width, height);

            // Theme-aware Background Gradient
            const dark = isDark();
            const bgGrad = ctx.createRadialGradient(width / 2, height / 2, 0, width / 2, height / 2, width);
            if (dark) {
                bgGrad.addColorStop(0, '#020617');
                bgGrad.addColorStop(1, '#0f172a');
            } else {
                bgGrad.addColorStop(0, '#ffffff');
                bgGrad.addColorStop(1, '#f1f5f9');
            }
            ctx.fillStyle = bgGrad;
            ctx.fillRect(0, 0, width, height);

            const grid = [];
            for (let i = 0; i <= ROWS; i++) {
                grid[i] = [];
                for (let j = 0; j <= COLS; j++) {
                    let worldX = (j - COLS / 2) * GAP;
                    let worldZ = (i - ROWS / 2) * GAP;

                    // 1. MAGNETIC WARP (X/Z distortion)
                    const mDistX = worldX - (smoothMouseX * width * 0.5);
                    const mDistZ = worldZ - (smoothMouseY * height * 0.2);
                    const distToMouse = Math.max(0.0001, Math.sqrt(mDistX * mDistX + mDistZ * mDistZ));
                    const pull = Math.exp(-distToMouse * 0.005) * 40;

                    worldX -= (mDistX / distToMouse) * pull;
                    worldZ -= (mDistZ / distToMouse) * pull;

                    // 2. MULTI-WAVE HEIGHT
                    const distFromCenter = Math.sqrt(worldX * worldX + worldZ * worldZ);
                    const ripple = Math.sin(distFromCenter * 0.01 - time * 2) * 25;
                    const surface = Math.cos(worldX * 0.01 + time) * 15;

                    // Mouse "dent" or "peak" effect
                    const mouseEffect = Math.exp(-distToMouse * 0.01) * 60 * Math.sin(distToMouse * 0.02 - time * 5);

                    const worldY = BASE_Y + ripple + surface + mouseEffect;

                    const p = project(worldX, worldY, worldZ + 600);
                    grid[i][j] = { ...p, h: worldY - BASE_Y, iz: i / ROWS };
                }
            }

            // PAINTER'S ALGO: BACK TO FRONT
            for (let i = 0; i < ROWS; i++) {
                for (let j = 0; j < COLS; j++) {
                    const p1 = grid[i][j];
                    const p2 = grid[i][j + 1];
                    const p3 = grid[i + 1][j + 1];
                    const p4 = grid[i + 1][j];

                    // Opacity based on height and depth
                    const heightFactor = (p1.h + 50) / 100;
                    const alpha = (0.05 + p1.iz * 0.2) * (0.8 + heightFactor * 0.2);

                    // Dynamic Color (Cyan to Blue) — dimmer/softer in dark mode
                    const hue = 190 + heightFactor * 30;
                    const light = dark ? 30 + heightFactor * 18 : 60 + heightFactor * 20;
                    const alphaScale = dark ? 0.85 : 1;

                    ctx.beginPath();
                    ctx.moveTo(p1.x, p1.y);
                    ctx.lineTo(p2.x, p2.y);
                    ctx.lineTo(p3.x, p3.y);
                    ctx.lineTo(p4.x, p4.y);
                    ctx.closePath();

                    ctx.fillStyle = `hsla(${hue}, 80%, ${light}%, ${alpha * alphaScale})`;
                    ctx.fill();

                    // Edge highlight (Subtle wireframe)
                    ctx.strokeStyle = `hsla(${hue}, 80%, ${light - 10}%, ${alpha * 0.5 * alphaScale})`;
                    ctx.lineWidth = 0.5;
                    ctx.stroke();
                }
            }
        };

        const draw = () => {
            if (prefersReducedMotion) {
                renderFrame();
                return;
            }
            try {
                renderFrame();
            } finally {
                animationFrameId = requestAnimationFrame(draw);
            }
        };

        const handleVisibility = () => {
            if (document.hidden) {
                cancelAnimationFrame(animationFrameId);
            } else if (!prefersReducedMotion) {
                draw();
            }
        };
        document.addEventListener('visibilitychange', handleVisibility);

        draw();

        return () => {
            window.removeEventListener('resize', resize);
            window.removeEventListener('mousemove', handleMouseMove);
            document.removeEventListener('visibilitychange', handleVisibility);
            cancelAnimationFrame(animationFrameId);
        };
    }, []);

    return (
        <div className="fixed inset-0 z-[-1] overflow-hidden">
            <canvas ref={canvasRef} className="block w-full h-full" />
            {/* Grain texture for premium look */}
            <div className="absolute inset-0 pointer-events-none opacity-[0.03] bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />
        </div>
    );
};

export default Premium3DBackground;
