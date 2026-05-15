# Technologies & Resources Used 💻

This document provides a comprehensive overview of every programming language, framework, API, and design concept utilized to build the IITP PathFinder application.

## 1. Core Programming Languages

*   **JavaScript (ES6+)**: The foundational scripting language used across both the frontend (React) and backend (Node.js/Express). It handles everything from DOM manipulation and API fetching to complex state management and map logic.
*   **HTML5**: Used for structuring the base of the web application (`index.html`).
*   **CSS3**: Used primarily for custom animations (like the pulsating GPS dot) and global resets that extend beyond the capabilities of the utility framework.
*   **SQL (PostgreSQL)**: Used to define the database schema, write data ingestion scripts, and create database triggers (e.g., automatically generating user profiles upon authentication).

## 2. Frontend Frameworks & Libraries

*   **React 18**: The core frontend library used for building a dynamic, component-based Single Page Application (SPA). It allows for efficient DOM updates and complex UI state management using Context API and Hooks.
*   **Vite**: A modern frontend build tool that replaces Create React App. It provides a significantly faster development server and highly optimized production builds using Rollup.
*   **React Router DOM**: The standard routing library for React, used to navigate between the main map interface, the login portal, and the admin dashboard without reloading the page.
*   **Tailwind CSS**: A utility-first CSS framework used for almost all styling. It enabled the rapid creation of the responsive layout and the complex "Glassmorphism" UI design directly within the JSX markup.

## 3. Mapping & Geospatial Technologies

*   **Leaflet (`react-leaflet`)**: An open-source JavaScript library for mobile-friendly interactive maps. It handles the core rendering of the map, panning, zooming, and placing markers.
*   **CartoDB Voyager Tiles**: The specific map tiles (images) loaded into Leaflet. Chosen for their clean, modern aesthetic and efficient, free-tier loading.
*   **OpenRouteService (ORS)**: A highly customizable routing engine based on OpenStreetMap data. It calculates the exact paths, distances, and ETAs for driving, cycling, and walking across the IIT Patna campus.
*   **Mapbox Geocoding API**: A powerful search API used to translate human-readable text (e.g., "Library") into precise latitude and longitude coordinates.

## 4. Backend Infrastructure & Database

*   **Node.js & Express.js**: The runtime environment and web framework used to build the backend server. It acts as a secure intermediary layer, keeping sensitive API keys (like the Mapbox and ORS keys) hidden from the public client.
*   **Supabase**: An open-source Firebase alternative that provides the entire database infrastructure.
    *   **PostgreSQL**: The underlying relational database.
    *   **PostGIS**: A spatial database extender for PostgreSQL, allowing the database to efficiently store and query geographic objects (points, polygons).
    *   **Supabase Auth**: A complete user authentication system used to handle secure logins via Email, Google OAuth, and Microsoft Entra ID.

## 5. UI/UX Design Concepts

*   **Glassmorphism**: The dominant visual style of the application, characterized by semi-transparent backgrounds, deep background blurs (`backdrop-blur`), and subtle borders. This creates a modern, "frosted glass" effect that allows the map to remain partially visible underneath the UI panels.
*   **Progressive Disclosure**: A design pattern used in the Navigation Drawer and Destination Cards, where advanced options or detailed information are hidden by default and only revealed when the user interacts with the UI.

## 6. Development Tools & Resources

*   **Git & GitHub**: Used for version control and collaborative repository management.
*   **Material Symbols**: Google's official icon library, used extensively throughout the application for clean, scalable vector icons.
*   **Google Fonts**: Used to import the modern typography (Inter and Manrope fonts) that gives the application its premium feel.
