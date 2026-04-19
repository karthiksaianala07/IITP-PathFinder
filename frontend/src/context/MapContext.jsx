import React, { createContext, useContext, useState, useEffect } from 'react';

const MapContext = createContext();

export function MapProvider({ children }) {
    // Basic Tracking
    const [mapInstance, setMapInstance] = useState(null);
    const [isTracking, setIsTracking] = useState(false);
    
    // UI Filters
    const [activeCategory, setActiveCategory] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');
    
    // Active POI for the Destination Card
    const [targetDestination, setTargetDestination] = useState(null);

    // Advanced Navigation State
    const [navigationMode, setNavigationMode] = useState('driving-car'); // driving-car, cycling-regular, foot-walking
    const [startLocation, setStartLocation] = useState(null); // { name, lat, lng }
    const [routeData, setRouteData] = useState([]); // Holds fetched ORS GeoJSON routes
    const [activeRouteIndex, setActiveRouteIndex] = useState(0);

    // Phase 6 Additions
    const [activeInput, setActiveInput] = useState('none');
    const [locations, setLocations] = useState([]); // Database fetch

    // Phase 7: Persistence & Settings
    const [savedPlaces, setSavedPlaces] = useState(() => {
        const saved = localStorage.getItem('iitp_saved_places');
        return saved ? JSON.parse(saved) : [];
    });
    
    const [recentHistory, setRecentHistory] = useState(() => {
        const saved = localStorage.getItem('iitp_recent_history');
        return saved ? JSON.parse(saved) : [];
    });

    const [appSettings, setAppSettings] = useState(() => {
        const saved = localStorage.getItem('iitp_settings');
        return saved ? JSON.parse(saved) : { darkMode: false, defaultMode: 'driving-car' };
    });

    useEffect(() => {
        localStorage.setItem('iitp_saved_places', JSON.stringify(savedPlaces));
    }, [savedPlaces]);

    useEffect(() => {
        localStorage.setItem('iitp_recent_history', JSON.stringify(recentHistory));
    }, [recentHistory]);

    useEffect(() => {
        localStorage.setItem('iitp_settings', JSON.stringify(appSettings));
        if (appSettings.darkMode) document.documentElement.classList.add('dark');
        else document.documentElement.classList.remove('dark');
    }, [appSettings]);

    // Handle adding to history on destination change
    useEffect(() => {
        if (targetDestination) {
            setRecentHistory(prev => {
                const filtered = prev.filter(p => p.name !== targetDestination.name);
                return [targetDestination, ...filtered].slice(0, 10);
            });
        }
    }, [targetDestination]);

    const toggleSavedPlace = (place) => {
        setSavedPlaces(prev => {
            const exists = prev.find(p => p.name === place.name);
            if (exists) return prev.filter(p => p.name !== place.name);
            return [...prev, place];
        });
    };

    useEffect(() => {
        const fetchLocations = async () => {
            try {
                const response = await fetch('/api/locations');
                if (response.ok) {
                    const { data } = await response.json();
                    setLocations(data || []);
                }
            } catch (err) {
                console.error("Link to backend API failed:", err);
            }
        };
        fetchLocations();
    }, []);

    const value = {
        mapInstance, setMapInstance,
        isTracking, setIsTracking,
        activeCategory, setActiveCategory,
        searchQuery, setSearchQuery,
        targetDestination, setTargetDestination,
        navigationMode, setNavigationMode,
        startLocation, setStartLocation,
        routeData, setRouteData,
        activeRouteIndex, setActiveRouteIndex,
        activeInput, setActiveInput,
        locations, setLocations,
        savedPlaces, toggleSavedPlace,
        recentHistory,
        appSettings, setAppSettings
    };

    return (
        <MapContext.Provider value={value}>
            {children}
        </MapContext.Provider>
    );
}

export function useMapContext() {
    return useContext(MapContext);
}
