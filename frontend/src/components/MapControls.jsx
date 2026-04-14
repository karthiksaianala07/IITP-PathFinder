import React from 'react';
import { useMapContext } from '../context/MapContext';

export default function MapControls() {
    const { mapInstance, isTracking, setIsTracking } = useMapContext();

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
            {/* Layers Button */}
            <button className="w-12 h-12 glass-panel rounded-full shadow-lg flex items-center justify-center text-primary hover:bg-white transition-all ring-1 ring-black/5">
                <span className="material-symbols-outlined">layers</span>
            </button>
            
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
