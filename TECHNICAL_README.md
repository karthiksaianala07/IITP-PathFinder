# IITP PathFinder - Technical Documentation ⚙️

This document outlines the architecture, environment configurations, and technical implementation details of the IITP PathFinder application.

## 🏗️ System Architecture

The application is built on a decoupled Client-Server architecture:
1.  **Frontend (Client)**: A Single Page Application (SPA) built with React and Vite. It handles all UI rendering, map interactions, and client-side state management.
2.  **Backend (Server)**: A Node.js/Express server that acts as a secure proxy for external APIs (Mapbox, ORS) and provides custom endpoints for the frontend.
3.  **Database (Supabase)**: A PostgreSQL database utilizing the PostGIS extension for spatial data storage and Supabase Auth for identity management.

## 🗄️ Database Schema (Supabase)

The primary table is `locations`, which stores all Campus Points of Interest (POIs).

| Column | Type | Description |
| :--- | :--- | :--- |
| `id` | `uuid` | Primary Key, auto-generated. |
| `name` | `text` | The display name of the location (e.g., "Block 9"). |
| `category` | `text` | The classification (academic, hostels, dining, library). |
| `lat` | `numeric` | Latitude coordinate. |
| `lng` | `numeric` | Longitude coordinate. |
| `created_at` | `timestamp` | Record creation time. |

*Note: The database also utilizes Supabase's built-in `auth.users` table for user management, with a custom trigger that syncs new signups to a public `profiles` table.*

## 🔌 API Endpoints (Backend)

The Express backend (`server.js`) exposes the following endpoints:

*   `GET /api/health`: Basic health check.
*   `GET /api/locations`: Fetches all POIs from the Supabase database.
*   `GET /api/geocode`: A secure proxy route that forwards search queries to the Mapbox Geocoding API, protecting the Mapbox API key.
*   `GET /api/route`: A secure proxy route that interacts with OpenRouteService (ORS) to generate pathfinding GeoJSON data based on coordinates and transportation profiles (driving, walking, cycling).

## 🗺️ Map Rendering & Routing Logic

1.  **Tiles**: The map base uses CartoDB Voyager tiles, loaded via `react-leaflet`.
2.  **Routing Engine**: When a user selects a start and end point, the frontend requests `/api/route`. The backend queries ORS. The resulting GeoJSON path is rendered on the Leaflet map using the `<Polyline>` component.
3.  **Live GPS**: The `InteractiveMap.jsx` component utilizes Leaflet's built-in `map.locate()` API to hook into the device's GPS hardware, providing real-time coordinate updates and map panning.

## 🔐 Environment Variables

To run this project locally or in production, the following environment variables are required.

**Frontend (`frontend/.env`)**
```env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
VITE_MAPBOX_KEY=your_mapbox_public_key (Optional, used if hitting directly)
VITE_ORS_KEY=your_ors_key (Optional, used if hitting directly)
```

**Backend (`backend/.env`)**
```env
PORT=5000
MAPBOX_KEY=your_mapbox_secret_key
ORS_KEY=your_openrouteservice_key
```

## 🎨 Styling System
The project uses **Tailwind CSS** combined with custom CSS for specialized animations (like the pulsating GPS dot). A "Glassmorphism" design system is heavily utilized, relying on Tailwind's `backdrop-blur`, `bg-white/10`, and complex `box-shadow` utilities to create floating, translucent UI components.
