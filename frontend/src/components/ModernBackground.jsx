import React from 'react';

const ModernBackground = () => {
    return (
        <div className="absolute inset-0 w-full h-full -z-10">
            {/* Simple Light Gradient for Mobile */}
            <div className="absolute inset-0 bg-linear-to-br from-blue-50 via-white to-cyan-50" />

            {/* Optional: Very subtle overlay or noise if user wants 'premium' simple, but for 'normal light gradient' clean is best */}
            {/* Let's keep it extremely clean as requested. */}
        </div>
    );
};

export default ModernBackground;
