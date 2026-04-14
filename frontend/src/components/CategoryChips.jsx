import React from 'react';
import { useMapContext } from '../context/MapContext';

export default function CategoryChips() {
    const { activeCategory, setActiveCategory } = useMapContext();

    const categories = [
        { id: 'academic', icon: 'account_balance', label: 'Academic' },
        { id: 'hostels', icon: 'hotel', label: 'Hostels' },
        { id: 'dining', icon: 'restaurant', label: 'Dining' },
        { id: 'library', icon: 'local_library', label: 'Library' }
    ];

    const toggleCategory = (catId) => {
        // Deselect if already active, otherwise select
        setActiveCategory(prev => prev === catId ? null : catId);
    };

    return (
        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide no-scrollbar pointer-events-auto">
            {categories.map((cat) => (
                <button 
                    key={cat.id}
                    onClick={() => toggleCategory(cat.id)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-full shadow-md border transition-colors whitespace-nowrap
                        ${activeCategory === cat.id 
                            ? 'bg-primary text-white border-primary' 
                            : 'bg-white border-slate-100 hover:bg-slate-50 text-slate-700'
                        }`}
                >
                    <span className={`material-symbols-outlined text-sm ${activeCategory === cat.id ? 'text-white' : 'text-primary'}`}>
                        {cat.icon}
                    </span>
                    <span className="text-xs font-bold">
                        {cat.label}
                    </span>
                </button>
            ))}
        </div>
    );
}
