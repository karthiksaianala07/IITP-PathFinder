import React, { useState, useEffect, useRef } from 'react';
import { useMapContext } from '../context/MapContext';
import logo from '../assets/logo.png';

export default function SearchBar({ onMenuClick }) {
    const { 
        searchQuery, setSearchQuery, 
        locations, setTargetDestination, 
        activeInput, setActiveInput, setRouteData 
    } = useMapContext();

    const [showSuggestions, setShowSuggestions] = useState(false);
    const [suggestions, setSuggestions] = useState([]);
    const debounceRef = useRef(null);

    // Global Autocomplete Engine
    useEffect(() => {
        if (!searchQuery) {
            setSuggestions([]);
            setShowSuggestions(false);
            return;
        }

        if (activeInput !== 'mainSearch') return;

        setShowSuggestions(true);

        if (debounceRef.current) clearTimeout(debounceRef.current);

        debounceRef.current = setTimeout(async () => {
            const queryRaw = searchQuery.toLowerCase().trim();
            if (!queryRaw) return setSuggestions([]);

            // 1. Local Database Priority Search
            const localMatches = locations
                .filter(loc => loc.name.toLowerCase().includes(queryRaw))
                .slice(0, 5)
                .map(loc => ({
                    id: `local-${loc.id}`,
                    name: loc.name,
                    subtext: `Category: ${loc.category}`,
                    lat: loc.lat,
                    lng: loc.lng,
                    source: 'local'
                }));

            // 2. Global Mapbox Fallback
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
                            lat: f.center[1],
                            lng: f.center[0],
                            source: 'global'
                        }));
                    }
                } catch (e) {
                    console.error("Geocoding fetch failed", e);
                }
            }

            setSuggestions([...localMatches, ...globalMatches]);
        }, 400);
        
        return () => clearTimeout(debounceRef.current);
    }, [searchQuery, locations, activeInput]);
    
    const handleSelectSuggestion = (sug) => {
        setTargetDestination({ name: sug.name, lat: sug.lat, lng: sug.lng, hint: sug.subtext });
        setSearchQuery(""); // Clear main search since UI shifts into routing navigation mode
        setShowSuggestions(false);
        setActiveInput('none');
        setRouteData([]); 
    };

    return (
        <div className="relative glass-panel rounded-full shadow-lg border border-white/50 flex items-center px-4 py-2 gap-3 h-14 pointer-events-auto">
            <button 
                onClick={onMenuClick}
                className="p-2 hover:bg-slate-100 rounded-full transition-colors shrink-0"
            >
                <span className="material-symbols-outlined text-slate-600">menu</span>
            </button>
            <div className="flex-1 flex items-center min-w-0">
                <button 
                  onClick={() => window.location.href = '/'} 
                  className="hidden sm:flex items-center shrink-0 hover:scale-[1.02] active:scale-95 transition-transform"
                  title="Reset to Home"
                >
                    <img src={logo} alt="IITP PathFinder" className="h-8 mr-3 object-contain cursor-pointer" />
                </button>
                <input 
                    className="w-full bg-transparent border-none focus:ring-0 text-sm font-body placeholder-slate-500 outline-none" 
                    placeholder="Search academic blocks, rooms, cities..." 
                    type="text"
                    value={searchQuery}
                    onFocus={() => setActiveInput('mainSearch')}
                    onChange={(e) => setSearchQuery(e.target.value)}
                />
            </div>
            <div className="flex items-center gap-1 shrink-0">
                <button className="p-2 text-slate-500 hover:text-primary transition-colors">
                    <span className="material-symbols-outlined">search</span>
                </button>
            </div>

            {/* Smart Autocomplete Dropdown */}
            {showSuggestions && suggestions.length > 0 && activeInput === 'mainSearch' && (
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
                                <span className="font-bold text-slate-800 text-sm truncate">{sug.name}</span>
                            </div>
                            <span className="text-xs text-slate-500 truncate ml-6">{sug.subtext}</span>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
