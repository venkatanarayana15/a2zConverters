import React, { useEffect, useRef } from 'react';

const MathGridBackground = () => {
    const canvasRef = useRef(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        let animationFrameId;

        let width = canvas.width = window.innerWidth;
        let height = canvas.height = window.innerHeight;

        const spacing = 40; // Grid spacing
        const points = [];

        // Initialize points in Row-Major order (Y then X)
        // This ensures sequential points in array are neighbors in X (Row)
        const initPoints = () => {
            points.length = 0;
            for (let y = 0; y <= height + spacing; y += spacing) {
                for (let x = 0; x <= width + spacing; x += spacing) {
                    points.push({
                        x,
                        y,
                        originX: x,
                        originY: y,
                        vx: 0,
                        vy: 0,
                    });
                }
            }
        };

        initPoints();

        const mouse = { x: -1000, y: -1000 };

        const handleMouseMove = (e) => {
            const rect = canvas.getBoundingClientRect();
            mouse.x = e.clientX - rect.left;
            mouse.y = e.clientY - rect.top;
        };

        const handleResize = () => {
            width = canvas.width = window.innerWidth;
            height = canvas.height = window.innerHeight;
            initPoints();
        };

        window.addEventListener('mousemove', handleMouseMove);
        window.addEventListener('resize', handleResize);

        // Physics constants
        const tension = 0.05;
        const friction = 0.85; // Damping
        const mouseRadius = 250; // Increased radius for better visibility
        const mouseForce = 0.8; // Stronger force

        const animate = () => {
            ctx.clearRect(0, 0, width, height);

            // Debug log every 100 frames
            if (Math.random() < 0.01) console.log('Animating MathGrid...', points.length);

            // Update points
            points.forEach(p => {
                // ... physics ...
                // Distance from mouse
                const dx = mouse.x - p.x;
                const dy = mouse.y - p.y;
                const dist = Math.sqrt(dx * dx + dy * dy);

                // Mouse interaction (repulsion)
                if (dist < mouseRadius) {
                    const angle = Math.atan2(dy, dx);
                    const force = (mouseRadius - dist) / mouseRadius;
                    const fx = Math.cos(angle) * force * mouseForce * -50;
                    const fy = Math.sin(angle) * force * mouseForce * -50;
                    p.vx += fx;
                    p.vy += fy;
                }

                // Spring back to origin
                const ox = p.originX - p.x;
                const oy = p.originY - p.y;

                p.vx += ox * tension;
                p.vy += oy * tension;

                // Apply velocity and friction
                p.vx *= friction;
                p.vy *= friction;

                p.x += p.vx;
                p.y += p.vy;
            });

            // Draw Grid Lines
            ctx.beginPath();
            ctx.strokeStyle = 'rgba(7, 89, 133, 0.6)'; // Sky-800
            ctx.lineWidth = 1.5;

            // Calculate number of points in a row for vertical connection
            const cols = Math.floor((width + spacing) / spacing) + 1;

            for (let i = 0; i < points.length; i++) {
                const p = points[i];

                // Right neighbor (i + 1) in array
                // Connect if not the last in the row
                if ((i + 1) < points.length && (i + 1) % cols !== 0) {
                    const pRight = points[i + 1];
                    ctx.moveTo(p.x, p.y);
                    ctx.lineTo(pRight.x, pRight.y);
                }

                // Bottom neighbor (i + cols) in array
                if ((i + cols) < points.length) {
                    const pBottom = points[i + cols];
                    ctx.moveTo(p.x, p.y);
                    ctx.lineTo(pBottom.x, pBottom.y);
                }
            }
            ctx.stroke();

            // Draw Dots at vertices
            ctx.fillStyle = 'rgba(14, 165, 233, 0.5)';
            ctx.beginPath();
            for (let i = 0; i < points.length; i++) {
                const p = points[i];
                ctx.moveTo(p.x, p.y);
                ctx.arc(p.x, p.y, 1.5, 0, Math.PI * 2);
            }
            ctx.fill();

            animationFrameId = requestAnimationFrame(animate);
        };

        animate();

        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('resize', handleResize);
            cancelAnimationFrame(animationFrameId);
        };
    }, []);

    return (
        <canvas
            ref={canvasRef}
            className="absolute top-0 left-0 w-full h-full pointer-events-none"
        />
    );
};

export default MathGridBackground;
