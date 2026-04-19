import React from 'react';
import { useMapContext } from '../context/MapContext';

export default function CategoryChips() {
    const { 
        activeCategory, setActiveCategory, 
        locations, setTargetDestination,
        setRouteData, setActiveInput
    } = useMapContext();

    const categories = [
        { id: 'academic', icon: 'account_balance', label: 'Academic' },
        { id: 'hostels', icon: 'hotel', label: 'Hostels' },
        { id: 'dining', icon: 'restaurant', label: 'Dining' },
        { id: 'library', icon: 'local_library', label: 'Library' }
    ];

    // Filter results matching the active category
    const filteredLocations = activeCategory 
        ? locations.filter(loc => loc.category.toLowerCase() === activeCategory.toLowerCase())
        : [];

    const toggleCategory = (catId) => {
        // Deselect if already active, otherwise select
        setActiveCategory(prev => prev === catId ? null : catId);
    };

    const handleSelectLocation = (loc) => {
        setTargetDestination({
            name: loc.name,
            lat: loc.lat,
            lng: loc.lng,
            hint: `IIT Patna • ${loc.category}`
        });
        setRouteData([]); // Reset route if browsing new locations
        setActiveInput('none');
    };

    return (
        <div className="flex flex-col gap-3 w-full animate-in fade-in slide-in-from-top-4 duration-500">
            {/* Horizontal Chips Row */}
            <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide no-scrollbar pointer-events-auto">
                {categories.map((cat) => (
                    <button 
                        key={cat.id}
                        onClick={() => toggleCategory(cat.id)}
                        className={`flex items-center gap-2 px-4 py-2.5 rounded-full shadow-lg border transition-all duration-300 whitespace-nowrap active:scale-95
                            ${activeCategory === cat.id 
                                ? 'bg-primary text-white border-primary ring-4 ring-primary/10' 
                                : 'bg-white/80 backdrop-blur-md border-white/50 hover:bg-white text-slate-700 hover:border-primary/30'
                            }`}
                    >
                        <span className={`material-symbols-outlined text-[18px] ${activeCategory === cat.id ? 'text-white' : 'text-primary'}`}>
                            {cat.icon}
                        </span>
                        <span className="text-xs font-black tracking-tight uppercase">
                            {cat.label}
                        </span>
                    </button>
                ))}
            </div>

            {/* Vertical Results List (Appears when category is active) */}
            {activeCategory && (
                <div className="glass-panel p-2 rounded-2xl shadow-xl border border-white/40 pointer-events-auto max-h-[50vh] overflow-y-auto animate-in zoom-in-95 duration-300 no-scrollbar">
                    {filteredLocations.length > 0 ? (
                        <>
                            <div className="p-2 pb-1 text-[10px] font-black text-slate-400 tracking-widest uppercase flex justify-between items-center">
                                <span>{filteredLocations.length} Results in {activeCategory}</span>
                                <span className="material-symbols-outlined text-[14px]">expand_more</span>
                            </div>
                            <div className="flex flex-col gap-1 mt-1">
                                {filteredLocations.map((loc) => (
                                    <div 
                                        key={loc.id}
                                        onClick={() => handleSelectLocation(loc)}
                                        className="flex items-center gap-3 p-3 rounded-xl hover:bg-primary/5 cursor-pointer transition-all group active:scale-[0.98]"
                                    >
                                        <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-colors">
                                            <span className="material-symbols-outlined text-sm">
                                                {categories.find(c => c.id === activeCategory)?.icon || 'location_on'}
                                            </span>
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <h4 className="font-bold text-slate-800 text-sm truncate">{loc.name}</h4>
                                            <p className="text-[10px] text-slate-500 font-medium tracking-tight">IIT Patna Campus • {loc.category}</p>
                                        </div>
                                        <span className="material-symbols-outlined text-slate-300 group-hover:text-primary transition-colors text-sm">
                                            chevron_right
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </>
                    ) : (
                        <div className="p-4 text-center text-xs text-slate-500 font-medium italic">
                            No markers mapped for this category yet.
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
