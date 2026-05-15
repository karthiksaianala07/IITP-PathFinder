import React, { useState } from 'react';
import { useMapContext } from '../context/MapContext';

export default function MapControls() {
    const { mapInstance, isTracking, setIsTracking, mapStyle, setMapStyle } = useMapContext();
    const [showLayers, setShowLayers] = useState(false);

    const handleZoomIn = () => {
        if (mapInstance) mapInstance.zoomIn();
    };

    const handleZoomOut = () => {
        if (mapInstance) mapInstance.zoomOut();
    };

    const toggleTracking = () => {
        setIsTracking(!isTracking);
    };

    return (
        <div className="absolute bottom-6 right-6 flex flex-col gap-3 pointer-events-auto">
            {/* Layers Button & Popover */}
            <div className="relative flex justify-end">
                {showLayers && (
                    <div className="absolute bottom-14 right-0 flex flex-col gap-2 p-2 glass-panel rounded-2xl shadow-xl animate-in zoom-in-95 duration-200 z-10 w-36 border border-white/40">
                        <button 
                            onClick={() => { setMapStyle('light'); setShowLayers(false); }} 
                            className={`flex items-center gap-2 px-3 py-2.5 rounded-xl text-sm font-bold transition-all ${mapStyle === 'light' ? 'bg-primary text-white shadow-md' : 'hover:bg-primary/10 text-slate-700'}`}
                        >
                            <span className="material-symbols-outlined text-[18px]">light_mode</span> Light
                        </button>
                        <button 
                            onClick={() => { setMapStyle('dark'); setShowLayers(false); }} 
                            className={`flex items-center gap-2 px-3 py-2.5 rounded-xl text-sm font-bold transition-all ${mapStyle === 'dark' ? 'bg-primary text-white shadow-md' : 'hover:bg-primary/10 text-slate-700'}`}
                        >
                            <span className="material-symbols-outlined text-[18px]">dark_mode</span> Dark
                        </button>
                        <button 
                            onClick={() => { setMapStyle('satellite'); setShowLayers(false); }} 
                            className={`flex items-center gap-2 px-3 py-2.5 rounded-xl text-sm font-bold transition-all ${mapStyle === 'satellite' ? 'bg-primary text-white shadow-md' : 'hover:bg-primary/10 text-slate-700'}`}
                        >
                            <span className="material-symbols-outlined text-[18px]">satellite_alt</span> Satellite
                        </button>
                    </div>
                )}
                <button 
                    onClick={() => setShowLayers(!showLayers)}
                    className={`w-12 h-12 glass-panel rounded-full shadow-lg flex items-center justify-center transition-all ring-1 ring-black/5 ${showLayers ? 'bg-primary text-white' : 'text-primary hover:bg-white'}`}
                >
                    <span className="material-symbols-outlined">layers</span>
                </button>
            </div>
            
            {/* My Location Button (Toggles Tracking Mode) */}
            <button 
                onClick={toggleTracking}
                className={`w-12 h-12 glass-panel rounded-full shadow-lg flex items-center justify-center transition-all ring-1 ring-black/5 ${isTracking ? 'bg-primary text-white hover:bg-primary-container' : 'text-primary hover:bg-white'}`}
                title={isTracking ? "Stop tracking" : "Start live tracking"}
            >
                <span className="material-symbols-outlined">
                    {isTracking ? 'my_location' : 'location_searching'}
                </span>
            </button>
            
            {/* Zoom Controls */}
            <div className="flex flex-col glass-panel rounded-2xl shadow-lg ring-1 ring-black/5 overflow-hidden">
                <button onClick={handleZoomIn} className="w-12 h-12 flex items-center justify-center text-primary hover:bg-white border-b border-slate-100">
                    <span className="material-symbols-outlined">add</span>
                </button>
                <button onClick={handleZoomOut} className="w-12 h-12 flex items-center justify-center text-primary hover:bg-white">
                    <span className="material-symbols-outlined">remove</span>
                </button>
            </div>
        </div>
    );
}
