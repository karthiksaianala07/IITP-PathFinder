import React from 'react';

export default function ActiveMarker() {
    return (
        <div className="absolute top-[40%] left-[60%] pointer-events-auto">
            <div className="flex flex-col items-center">
                <div className="bg-primary text-white p-1 rounded-full shadow-xl border-2 border-white animate-bounce">
                    <span 
                        className="material-symbols-outlined text-xl" 
                        style={{ fontVariationSettings: "'FILL' 1" }}
                    >
                        location_on
                    </span>
                </div>
                <div className="mt-2 glass-panel px-3 py-1 rounded-full shadow-lg border border-white/50">
                    <span className="text-xs font-bold text-primary font-manrope">Block 9</span>
                </div>
            </div>
        </div>
    );
}
