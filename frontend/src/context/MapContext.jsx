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
        locations, setLocations
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
