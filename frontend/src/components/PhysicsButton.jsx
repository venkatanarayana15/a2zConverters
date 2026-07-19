import React, { useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { cn } from '../lib/utils';

const PhysicsButton = ({ children, onClick, className = "", variant = "primary" }) => {
    const ref = useRef(null);
    const [position, setPosition] = useState({ x: 0, y: 0 });

    const handleMouseMove = (e) => {
        const { clientX, clientY } = e;
        const { left, top, width, height } = ref.current.getBoundingClientRect();

        const x = clientX - (left + width / 2);
        const y = clientY - (top + height / 2);

        setPosition({ x: x * 0.2, y: y * 0.2 });
    };

    const handleMouseLeave = () => {
        setPosition({ x: 0, y: 0 });
    };

    const baseStyles = "relative px-8 py-4 rounded-xl font-bold text-lg flex items-center transition-colors group overflow-hidden";
    const variants = {
        primary: "bg-primary text-white shadow-lg shadow-primary/30",
        outline: "bg-white text-gray-900 border border-gray-200 hover:bg-gray-50 shadow-sm",
        electric: "text-white shadow-lg shadow-cyan-500/30 overflow-hidden bg-gray-900 border border-transparent"
    };

    return (
        <motion.button
            ref={ref}
            onClick={onClick}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            animate={{ x: position.x, y: position.y }}
            transition={{ type: "spring", stiffness: 150, damping: 15, mass: 0.1 }}
            whileTap={{ scale: 0.95 }}
            className={cn(baseStyles, variants[variant] || variants.primary, className)}
        >
            {variant === 'electric' && (
                <>
                    {/* Spinning Gradient Background - Radar Sweep Effect */}
                    <div className="absolute inset-[-100%] animate-[spin_2s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,#0000_0%,#0284c7_50%,#0000_100%)] opacity-100" />
                    {/* Inner Black/Dark Overlay to create border effect */}
                    <div className="absolute inset-[2px] rounded-[10px] bg-gray-900 z-0" />
                </>
            )}
            <span className="relative z-10 flex items-center">{children}</span>
        </motion.button>
    );
};

export default PhysicsButton;
