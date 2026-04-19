import React, { useState } from 'react';
import SearchBar from '../components/SearchBar';
import CategoryChips from '../components/CategoryChips';
import DestinationCard from '../components/DestinationCard';
import EventsPanel from '../components/EventsPanel';
import MapControls from '../components/MapControls';
import NavigationDrawer from '../components/NavigationDrawer';
import InteractiveMap from '../components/InteractiveMap';
import SettingsModal from '../components/SettingsModal';

export default function Home() {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  return (
    <>
      {/* Interactive Map Background */}
      <InteractiveMap />

      {/* UI Overlay Layer */}
      <div className="relative z-10 h-full w-full pointer-events-none p-4 md:p-6">
        {/* Top Left Section: Search & Categories */}
        <div className="flex flex-col gap-4 max-w-lg w-full">
          <SearchBar onMenuClick={() => setIsDrawerOpen(true)} />
          <CategoryChips />
        </div>

        {/* Overlays */}
        <DestinationCard />
        <EventsPanel />
        <MapControls />
      </div>

      {/* Navigation Drawer */}
      <NavigationDrawer 
        isOpen={isDrawerOpen} 
        onClose={() => setIsDrawerOpen(false)} 
        onSettingsClick={() => setIsSettingsOpen(true)}
      />

      {/* Configuration Overlays */}
      <SettingsModal 
        isOpen={isSettingsOpen} 
        onClose={() => setIsSettingsOpen(false)} 
      />
    </>
  );
}
