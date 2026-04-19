import express from 'express';
import cors from 'cors';
import { supabase } from './supabaseClient.js';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();

// Recreate __dirname for ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 5000;

// Health check endpoint
app.get('/api/health', (req, res) => {
    res.json({ status: 'healthy', database: 'Supabase PostGIS Ready' });
});

// Example route for fetching POIs from Supabase PostGIS
app.get('/api/locations', async (req, res) => {
    try {
        // Querying the real 'locations' table in Supabase
        const { data, error } = await supabase
            .from('locations')
            .select('*');
            
        if (error) throw error;
        
        res.json({ data });
    } catch (error) {
        console.error("Backend Supabase Fetch Error:", error.message);
        res.status(500).json({ error: "Failed to connect to database. " + error.message });
    }
});

// Secure Proxy: Mapbox Geocoding API
app.get('/api/geocode', async (req, res) => {
    const { query } = req.query;
    if (!query) return res.status(400).json({ error: 'Query is required' });
    try {
        const url = `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(query)}.json?country=in&limit=5&access_token=${process.env.MAPBOX_KEY}`;
        const response = await fetch(url);
        const data = await response.json();
        res.json(data);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Secure Proxy: OpenRouteService API
app.get('/api/route', async (req, res) => {
    // profile options: driving-car, cycling-regular, foot-walking
    const { profile = 'driving-car', start, end } = req.query; 
    if (!start || !end) return res.status(400).json({ error: 'start and end coordinates required' });

    const startCoords = start.split(',').map(Number);
    const endCoords = end.split(',').map(Number);

    const bodyWithAlts = {
        coordinates: [startCoords, endCoords],
        alternative_routes: { target_count: 3 },
        radiuses: [-1, -1],
        options: { avoid_borders: "all" }
    };

    try {
        const url = `https://api.openrouteservice.org/v2/directions/${profile}/geojson`;
        
        let response = await fetch(url, {
            method: 'POST',
            headers: {
                'Authorization': process.env.ORS_KEY,
                'Content-Type': 'application/json',
                'Accept': 'application/json, application/geo+json' 
            },
            body: JSON.stringify(bodyWithAlts)
        });
        
        let data = await response.json();

        // Error 2004: Distance limits for 'alternative_routes' (150km) or other profile limits exceeded.
        if (data.error && data.error.code === 2004) {
            console.log("ORS limits hit. Synthesizing cross-country alternatives...");
            
            // Bypass ORS limits by sending 2 isolated single-route queries using different pathfinding parameters!
            const fetchPreference = async (pref) => {
                const b = {
                    coordinates: [startCoords, endCoords],
                    preference: pref,
                    radiuses: [-1, -1],
                    options: { avoid_borders: "all" }
                };
                const r = await fetch(url, {
                    method: 'POST',
                    headers: {
                        'Authorization': process.env.ORS_KEY,
                        'Content-Type': 'application/json',
                        'Accept': 'application/json, application/geo+json'
                    },
                    body: JSON.stringify(b)
                });
                return r.json();
            };

            // Fire both mathematical models simultaneously
            const [fastestPath, shortestPath] = await Promise.all([
                fetchPreference('fastest'),
                fetchPreference('shortest')
            ]);

            data = fastestPath;
            
            // If the strictly 'shortest' path is functionally different from the 'fastest' path (highway), 
            // inject it into the GeoJSON array as a completely valid alternative route!
            if (shortestPath.features && shortestPath.features.length > 0 && data.features?.length > 0) {
                const dFast = data.features[0].properties.summary.distance;
                const dShort = shortestPath.features[0].properties.summary.distance;
                if (Math.abs(dFast - dShort) > 1000) { // Difference > 1KM
                    data.features.push(shortestPath.features[0]);
                }
            }
        }
        res.json(data);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Serve frontend static files in Production
const distPath = path.join(__dirname, '../frontend/dist');
console.log(`[Production] Static files path: ${distPath}`);
app.use(express.static(distPath));

// SPA Wildcard fallback to let React Router (if any) or basic index handle direct URL access
app.get('*', (req, res) => {
    const indexPath = path.join(distPath, 'index.html');
    console.log(`[Production] Serving SPA fallback: ${indexPath}`);
    res.sendFile(indexPath);
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
