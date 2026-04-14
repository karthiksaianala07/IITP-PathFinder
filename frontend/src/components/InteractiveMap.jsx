import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { useMapContext } from '../context/MapContext';

// Fix for default Leaflet markers in React
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
    iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
    shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
});

const redIcon = new L.Icon({
    iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
});

const center = [25.5358, 84.8511]; // IIT Patna Center

// Internal component to manage Map Instance and events
function MapEffects() {
    const map = useMap();
    const { setMapInstance, isTracking, setIsTracking, navigationMode } = useMapContext();
    const [liveLocation, setLiveLocation] = useState(null);

    useEffect(() => {
        setMapInstance(map);
    }, [map, setMapInstance]);

    useEffect(() => {
        if (isTracking) {
            map.locate({ setView: true, maxZoom: 18, watch: true, enableHighAccuracy: true });

            map.on('locationfound', (e) => {
                setLiveLocation({ lat: e.latlng.lat, lng: e.latlng.lng, heading: e.heading || 0 });
            });
        } else {
            map.stopLocate();
            map.off('locationfound');
            setLiveLocation(null);
        }

        const onLocationError = (e) => {
            console.error("GPS Error:", e.message);
            setIsTracking(false);
            alert("Could not access your location. Please check browser permissions.");
        };

        map.on('locationerror', onLocationError);
        return () => {
            map.off('locationerror', onLocationError);
            map.off('locationfound');
            map.stopLocate();
        };
    }, [isTracking, map, setIsTracking]);

    if (!isTracking || !liveLocation) return null;

    const isWalking = navigationMode === 'foot-walking';

    const renderHtml = isWalking
        ? '<div class="gps-pulsating-dot"></div>'
        : `<div class="gps-pulsating-arrow-box"><svg viewBox="0 0 24 24" fill="#4285F4" stroke="white" stroke-width="2" style="width:24px;height:24px;transform: rotate(${liveLocation.heading}deg); filter: drop-shadow(0px 0px 3px rgba(0,0,0,0.5));"><path d="M12 4L22 22L12 18L2 22Z" /></svg></div>`;

    const pulsatingIcon = L.divIcon({
        className: isWalking ? 'gps-pulsating-dot-container' : 'gps-pulsating-arrow-container',
        html: renderHtml,
        iconSize: [24, 24],
        iconAnchor: [12, 12]
    });

    return (
        <Marker
            position={liveLocation}
            icon={pulsatingIcon}
            zIndexOffset={9999}
        />
    );
}

// Bounding box component to fit routes exactly
function RouteBounder() {
    const map = useMap();
    const { routeData, activeRouteIndex } = useMapContext();

    useEffect(() => {
        if (routeData.length > 0 && routeData[activeRouteIndex]) {
            const activeRoute = routeData[activeRouteIndex];
            // GeoJSON coordinates are [lng, lat], Leaflet wants [lat, lng]
            const positions = activeRoute.geometry.coordinates.map(coord => [coord[1], coord[0]]);
            if (positions.length > 0) {
                const bounds = L.latLngBounds(positions);
                // Padding ensures the route isn't hidden under the UI overlays
                map.fitBounds(bounds, { paddingBottomRight: [50, 250], paddingTopLeft: [50, 50] });
            }
        }
    }, [routeData, activeRouteIndex, map]);

    return null;
}


export default function InteractiveMap() {
    const {
        activeCategory, searchQuery,
        setTargetDestination, setRouteData,
        routeData, activeRouteIndex, setActiveRouteIndex,
        locations, activeInput, setActiveInput,
        startLocation, setStartLocation
    } = useMapContext();

    // Filter logic
    const filteredLocations = locations.filter(loc => {
        const matchesCategory = activeCategory ? loc.category === activeCategory : true;
        const matchesSearch = searchQuery ? loc.name.toLowerCase().includes(searchQuery.toLowerCase()) : true;
        return matchesCategory && matchesSearch;
    });

    return (
        <div className="fixed inset-0 z-0">
            <MapContainer
                center={center}
                zoom={15}
                style={{ height: '100%', width: '100%', zIndex: 0 }}
                zoomControl={false}
            >
                <TileLayer
                    attribution='&copy; <a href="https://www.mapbox.com/about/maps/">Mapbox</a> | &copy; <a href="https://openrouteservice.org/">OpenRouteService</a>'
                    url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
                />

                <MapEffects />
                <RouteBounder />

                {/* Alternative Routes Rendering */}
                {routeData.map((route, idx) => {
                    const positions = route.geometry.coordinates.map(coord => [coord[1], coord[0]]);
                    const isActive = idx === activeRouteIndex;
                    return (
                        <Polyline
                            key={idx}
                            positions={positions}
                            pathOptions={{
                                color: isActive ? '#3b82f6' : '#94a3b8',
                                weight: isActive ? 6 : 4,
                                opacity: isActive ? 1 : 0.6
                            }}
                            eventHandlers={{
                                click: () => setActiveRouteIndex(idx)
                            }}
                        />
                    );
                })}

                {/* Explicit Red Marker for Start Location */}
                {startLocation && (
                    <Marker
                        position={[startLocation.lat, startLocation.lng]}
                        icon={redIcon}
                        zIndexOffset={1000}
                    >
                        <Popup>
                            <strong>Start Point</strong><br />
                            <span className="text-xs text-slate-500">{startLocation.name}</span>
                        </Popup>
                    </Marker>
                )}

                {/* DB Marker Renderings */}
                {filteredLocations.map((loc) => (
                    <Marker
                        key={loc.id}
                        position={[loc.lat, loc.lng]}
                        eventHandlers={{
                            click: () => {
                                if (activeInput === 'start') {
                                    setStartLocation({ name: loc.name, lat: loc.lat, lng: loc.lng });
                                    setActiveInput('none'); // Unfocus the start intent
                                } else {
                                    setTargetDestination({
                                        name: loc.name,
                                        lat: loc.lat,
                                        lng: loc.lng,
                                        hint: `Category: ${loc.category}`
                                    });
                                }
                                setRouteData([]); // Reset routing paths when a core node changes
                            },
                        }}
                    >
                        <Popup>
                            <strong>{loc.name}</strong><br />
                            <span style={{ textTransform: 'capitalize' }} className="text-xs text-slate-500">{loc.category}</span>
                        </Popup>
                    </Marker>
                ))}
            </MapContainer>
        </div>
    );
}
