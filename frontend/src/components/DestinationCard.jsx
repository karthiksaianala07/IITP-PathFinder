import React, { useState, useEffect, useRef } from 'react';
import { useMapContext } from '../context/MapContext';

export default function DestinationCard() {
    const { 
        targetDestination, setTargetDestination,
        navigationMode, setNavigationMode,
        routeData, setRouteData,
        activeRouteIndex, setActiveRouteIndex,
        startLocation, setStartLocation,
        locations, activeInput, setActiveInput,
        isTracking, setIsTracking
    } = useMapContext();

    const [isNavMode, setIsNavMode] = useState(false);
    const [startQuery, setStartQuery] = useState('');
    const [isFetching, setIsFetching] = useState(false);
    
    const [suggestions, setSuggestions] = useState([]);
    const [showSuggestions, setShowSuggestions] = useState(false);
    const debounceRef = useRef(null);

    // Sync input string when starting point is set via Map Click or GPS
    useEffect(() => {
        if (startLocation) {
            setStartQuery(startLocation.name);
            setShowSuggestions(false); // hide suggestions if populated from an external click
        }
    }, [startLocation]);

    // Autocomplete Engine
    useEffect(() => {
        if (!startQuery || (startLocation && startQuery === startLocation.name)) {
            setSuggestions([]);
            setShowSuggestions(false);
            return;
        } // Don't search if it's empty or exactly matches the locked-in choice

        setShowSuggestions(true);

        if (debounceRef.current) clearTimeout(debounceRef.current);

        debounceRef.current = setTimeout(async () => {
            const queryRaw = startQuery.toLowerCase().trim();
            if (!queryRaw) return setSuggestions([]);

            // 1. Local Database Search (Instant)
            const localMatches = locations
                .filter(loc => loc.name.toLowerCase().includes(queryRaw))
                .slice(0, 5)
                .map(loc => ({
                    id: `local-${loc.id}`,
                    name: loc.name,
                    subtext: 'IIT Patna Campus',
                    lat: loc.lat,
                    lng: loc.lng,
                    source: 'local'
                }));

            // 2. Global Mapbox Search (Fallback/Addition if local matches < 5)
            let globalMatches = [];
            if (localMatches.length < 5) {
                try {
                    const geoRes = await fetch(`/api/geocode?query=${encodeURIComponent(queryRaw)}`);
                    const geoData = await geoRes.json();
                    if (geoData.features) {
                        globalMatches = geoData.features.slice(0, 5 - localMatches.length).map(f => ({
                            id: f.id,
                            name: f.text,
                            subtext: f.place_name,
                            lat: f.center[1], // Mapbox is [lng, lat]
                            lng: f.center[0],
                            source: 'global'
                        }));
                    }
                } catch (e) {
                    console.error("Geocoding fetch failed", e);
                }
            }

            setSuggestions([...localMatches, ...globalMatches]);
        }, 400); // 400ms debounce
        
        return () => clearTimeout(debounceRef.current);
    }, [startQuery, locations, startLocation]);


    const handleSelectSuggestion = (sug) => {
        setStartLocation({ name: sug.name, lat: sug.lat, lng: sug.lng });
        setStartQuery(sug.name);
        setShowSuggestions(false);
        setActiveInput('none');
    };

    const captureGPS = () => {
        if (!navigator.geolocation) {
            alert("Geolocation is not supported by your browser");
            return;
        }
        setIsFetching(true);
        navigator.geolocation.getCurrentPosition((pos) => {
            setStartLocation({
                name: "📍 Current Location",
                lat: pos.coords.latitude,
                lng: pos.coords.longitude
            });
            setIsFetching(false);
        }, (err) => {
            alert("Location Error: " + err.message);
            setIsFetching(false);
        });
    };

    const handleClose = () => {
        setTargetDestination(null);
        setIsNavMode(false);
        setRouteData([]);
        setActiveInput('none');
    };

    const fetchRoute = async () => {
        if (!startLocation) {
            alert("Please select a specific starting location from the dropdown, map, or GPS.");
            return;
        }
        setIsFetching(true);
        try {
            // Already have coordinate objects!
            const startStr = `${startLocation.lng},${startLocation.lat}`;
            const endStr = `${targetDestination.lng},${targetDestination.lat}`;
            
            const routeRes = await fetch(`/api/route?profile=${navigationMode}&start=${startStr}&end=${endStr}`);
            const routeJson = await routeRes.json();
            
            if (routeJson.features && routeJson.features.length > 0) {
                setRouteData(routeJson.features);
                setActiveRouteIndex(0);
            } else if (routeJson.error) {
                alert(`Routing Engine Error: ${routeJson.error.message || JSON.stringify(routeJson.error)}`);
            } else {
                alert("Could not calculate a clear route between these points. Try adjusting your start location slightly.");
            }
            
        } catch (err) {
            console.error("Routing error:", err);
            alert("Error fetching route. The servers might be down.");
        }
        setIsFetching(false);
        setActiveInput('none');
    };

    if (!targetDestination) return null;

    if (isNavMode) {
        return (
            <div className="absolute top-4 left-4 right-4 sm:left-6 sm:max-w-md pointer-events-auto z-[1000]">
                <div className="glass-panel p-5 rounded-3xl shadow-2xl border border-white/40 overflow-visible relative">
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-xl font-extrabold text-primary font-manrope">Navigation Details</h2>
                        <button onClick={handleClose} className="p-2 bg-slate-100 hover:bg-slate-200 rounded-full transition-colors flex shrink-0">
                            <span className="material-symbols-outlined text-slate-600">close</span>
                        </button>
                    </div>

                    <div className="space-y-3 relative mb-4">
                        {/* Start Input Group */}
                        <div className="flex flex-col gap-1">
                            <button 
                                onClick={captureGPS}
                                className="self-start text-blue-600 font-bold text-xs flex items-center mb-1 hover:text-blue-800 transition-colors bg-blue-50 px-3 py-1.5 rounded-full ring-1 ring-blue-100"
                            >
                                <span className="material-symbols-outlined text-sm mr-1.5">my_location</span>
                                Use My Current Location
                            </button>
                            
                            <div className={`relative flex items-center gap-3 bg-white/70 p-2 rounded-xl ring-2 transition-all ${activeInput === 'start' ? 'ring-blue-400 bg-white' : 'ring-slate-200'}`}>
                                <span className="material-symbols-outlined text-blue-500 pl-1 shrink-0">search</span>
                                <input 
                                    className="w-full bg-transparent border-none focus:ring-0 text-sm font-body px-0" 
                                    placeholder="Start: Search or Tap Map" 
                                    value={startQuery}
                                    onFocus={() => {
                                        setActiveInput('start');
                                        setShowSuggestions(true);
                                    }}
                                    onChange={(e) => {
                                        setStartQuery(e.target.value);
                                        if (startLocation) setStartLocation(null); // clear locked coord if they start typing
                                    }}
                                />
                                {/* Autocomplete Dropdown */}
                                {showSuggestions && suggestions.length > 0 && activeInput === 'start' && (
                                    <div className="absolute top-full mt-2 left-0 right-0 bg-white/95 backdrop-blur-xl border border-slate-200 rounded-xl shadow-2xl z-50 overflow-hidden">
                                        {suggestions.map((sug) => (
                                            <div 
                                                key={sug.id}
                                                onClick={() => handleSelectSuggestion(sug)}
                                                className="p-3 border-b border-slate-100 hover:bg-blue-50 cursor-pointer transition-colors flex flex-col"
                                            >
                                                <div className="flex items-center gap-2">
                                                    {sug.source === 'local' 
                                                        ? <span className="material-symbols-outlined text-blue-500 text-sm">apartment</span>
                                                        : <span className="material-symbols-outlined text-purple-500 text-sm">public</span>
                                                    }
                                                    <span className="font-bold text-slate-800 text-sm">{sug.name}</span>
                                                </div>
                                                <span className="text-xs text-slate-500 truncate ml-6">{sug.subtext}</span>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="absolute left-6 top-8 bottom-8 w-0.5 bg-slate-300 -z-10"></div>
                        
                        {/* Destination Display */}
                        <div className="flex items-center gap-3 bg-white/50 p-2 pl-3 rounded-xl ring-1 ring-slate-200">
                            <span className="material-symbols-outlined text-red-500 text-xl">location_on</span>
                            <div className="text-sm font-bold text-slate-700 truncate">{targetDestination.name}</div>
                        </div>
                    </div>

                    {/* Mode Selector */}
                    <div className="flex justify-between gap-2 mb-4 bg-slate-100 p-1.5 rounded-2xl">
                        {[
                            { id: 'driving-car', icon: 'directions_car' },
                            { id: 'cycling-regular', icon: 'pedal_bike' },
                            { id: 'foot-walking', icon: 'directions_walk' }
                        ].map((mode) => (
                            <button
                                key={mode.id}
                                onClick={() => setNavigationMode(mode.id)}
                                className={`flex-1 flex justify-center items-center py-2 rounded-xl transition-all ${navigationMode === mode.id ? 'bg-white shadow-md text-primary font-bold' : 'text-slate-500 hover:text-primary'}`}
                            >
                                <span className="material-symbols-outlined">{mode.icon}</span>
                            </button>
                        ))}
                    </div>

                    <button 
                        onClick={fetchRoute}
                        disabled={isFetching || !startLocation}
                        className="w-full bg-primary text-white py-3 rounded-2xl font-bold flex items-center justify-center gap-2 shadow-lg hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-50 disabled:hover:scale-100"
                    >
                        {isFetching ? "Calculating..." : "Find Route"}
                    </button>

                    {/* Active Routes List */}
                    {routeData.length > 0 && (
                        <div className="mt-4 border-t border-slate-200 pt-4 space-y-2">
                            <div className="text-xs font-bold text-slate-500 uppercase tracking-widest pl-1">Available Routes</div>
                            {routeData.map((route, idx) => (
                                <div 
                                    key={idx}
                                    onClick={() => setActiveRouteIndex(idx)}
                                    className={`p-3 rounded-xl cursor-pointer transition-all border ${activeRouteIndex === idx ? 'bg-blue-50 border-blue-300 shadow-sm' : 'bg-white border-transparent hover:bg-slate-50'}`}
                                >
                                    <div className="flex justify-between items-center">
                                        <span className="font-bold text-primary">Route Option {idx + 1}</span>
                                        <span className="text-sm font-bold text-green-600">
                                            {Math.round(route.properties.summary.duration / 60)} mins
                                        </span>
                                    </div>
                                    <div className="text-xs text-slate-500 mt-1">
                                        {(route.properties.summary.distance / 1000).toFixed(1)} km
                                    </div>
                                </div>
                            ))}
                            
                            <button 
                                onClick={() => setIsTracking(!isTracking)}
                                className={`w-full mt-4 py-3 rounded-2xl font-bold flex items-center justify-center gap-2 shadow-lg hover:scale-[1.02] active:scale-95 transition-all ${isTracking ? 'bg-red-500 text-white shadow-red-500/30 hover:bg-red-600' : 'bg-green-500 text-white shadow-green-500/30 hover:bg-green-600'}`}
                            >
                                <span className="material-symbols-outlined text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>
                                    {isTracking ? 'stop_circle' : 'navigation'}
                                </span>
                                {isTracking ? "Stop Navigation" : "Start Live Navigation"}
                            </button>
                        </div>
                    )}
                </div>
            </div>
        );
    }

    return (
        <div className="absolute bottom-6 left-6 max-w-sm w-full pointer-events-auto z-40">
            <div className="glass-panel p-5 rounded-3xl shadow-2xl border border-white/40 overflow-hidden group">
                <div className="flex justify-between items-start mb-4">
                    <div>
                        <span className="text-[10px] font-black text-tertiary tracking-widest uppercase">Target Destination</span>
                        <h2 className="text-xl font-extrabold text-primary font-manrope tracking-tight leading-tight mt-1">{targetDestination.name}</h2>
                        <div className="flex items-center gap-2 mt-1">
                            <span className="text-xs text-green-600 font-bold flex items-center">
                                <span className="material-symbols-outlined text-xs mr-0.5">location_on</span>
                                Mapped Location
                            </span>
                            <span className="text-slate-400 text-xs">•</span>
                            <span className="text-xs text-slate-500 font-body">{targetDestination.hint}</span>
                        </div>
                    </div>
                    <button onClick={handleClose} className="p-2 bg-slate-100 hover:bg-slate-200 rounded-full transition-colors flex shrink-0 ml-2">
                        <span className="material-symbols-outlined text-slate-600">close</span>
                    </button>
                </div>
                <div className="flex gap-2">
                    <button onClick={() => setIsNavMode(true)} className="flex-1 bg-primary text-white py-3.5 rounded-2xl font-bold flex items-center justify-center gap-2 shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-all">
                        <span className="material-symbols-outlined text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>directions</span>
                        Directions
                    </button>
                </div>
            </div>
        </div>
    );
}
