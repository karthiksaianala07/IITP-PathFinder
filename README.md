# IITP PathFinder 🗺️

**IITP PathFinder** is a dedicated, hyper-accurate campus navigation and routing application designed exclusively for the Indian Institute of Technology Patna (IIT Patna) Bihta campus. 

Navigating a massive university campus can be challenging for freshers, visitors, and even returning students. IITP PathFinder solves this by providing custom-mapped footpaths, building-to-building routing, and a categorized directory of all campus points of interest (POIs).

## ✨ Key Features

*   **Hyper-Accurate Campus Routing:** Uses custom OpenStreetMap data and OpenRouteService to provide exact walking, cycling, and driving routes across campus, including small pedestrian pathways that mainstream map apps ignore.
*   **Interactive Map:** A beautiful, responsive map interface powered by Leaflet and CartoDB Voyager tiles.
*   **Smart Search & Filtering:** Quickly find Academic Blocks, Hostels, Dining halls, and the Library using category filters or the Mapbox-powered smart search bar.
*   **Live GPS Navigation:** Real-time tracking with a pulsating location indicator that keeps your position centered as you move across campus.
*   **User Personalization:** Secure login (via Email, Google, or Microsoft) to save favorite places and view recent search history.
*   **Admin Dashboard:** A secured portal for administrators to dynamically add, edit, or remove campus locations without touching the codebase.
*   **Offline Mode:** Download essential campus map data for use without internet access.

## 🚀 Quick Start

### Prerequisites
*   Node.js (v16 or higher)
*   npm or yarn
*   A Supabase Account (for database & auth)

### Installation
1. Clone the repository.
2. Navigate to the backend and install dependencies:
   ```bash
   cd backend
   npm install
   ```
3. Navigate to the frontend and install dependencies:
   ```bash
   cd ../frontend
   npm install
   ```

### Running the App
Start the backend server (runs on port 5000):
```bash
cd backend
npm start
```

Start the frontend development server (runs on port 5173):
```bash
cd frontend
npm run dev
```

## 🔐 Authentication & Roles
The app features two main user roles:
*   **Guest/Student:** Can view the map, search locations, and get routes. Logged-in users can also save favorite places.
*   **Administrator:** Accesses the hidden `/admin` portal to manage the database of locations.

## 👥 Meet the Team
This project was built by a dedicated team of student developers as part of the Capstone Project. Check out the **Developer Details** section in the app's sidebar to see the minds behind PathFinder!
