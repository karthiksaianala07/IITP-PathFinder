import React, { useEffect, useRef, useState } from 'react';
import { useMapContext } from '../context/MapContext';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import logo from '../assets/logo.png';
import DeveloperModal from './DeveloperModal';

export default function NavigationDrawer({ isOpen, onClose, onSettingsClick }) {
    const drawerRef = useRef(null);
    const { 
        savedPlaces, recentHistory, 
        setTargetDestination, setRouteData, setActiveInput,
        toggleSavedPlace
    } = useMapContext();
    
    const { user, signOut } = useAuth();
    const navigate = useNavigate();
    
    const [expandedSection, setExpandedSection] = useState(null); // 'saved' or 'history'
    const [downloadProgress, setDownloadProgress] = useState(null);
    const [isDevModalOpen, setIsDevModalOpen] = useState(false);

    // Close on clicking outside drawer
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (isOpen && drawerRef.current && !drawerRef.current.contains(event.target)) {
                const isMenuButton = event.target.closest('button')?.innerText?.includes('menu') || 
                                     event.target.closest('button')?.querySelector('.material-symbols-outlined')?.innerText === 'menu';
                if (!isMenuButton) onClose();
            }
        };
        document.addEventListener('click', handleClickOutside);
        return () => document.removeEventListener('click', handleClickOutside);
    }, [isOpen, onClose]);

    const handleSelectPlace = (place) => {
        setTargetDestination(place);
        setRouteData([]);
        setActiveInput('none');
        onClose();
    };

    const downloadOfflineMap = async () => {
        setDownloadProgress("Preparing...");
        try {
            const cache = await caches.open('iitp-tile-cache');
            
            // Focus on Zoom Levels 14 and 15 (most useful for campus overview)
            const tiles = [];
            const subdomains = ['a', 'b', 'c'];
            
            for(let z=14; z<=15; z++) {
                const n = Math.pow(2, z);
                const xtile = Math.floor((84.8511 + 180) / 360 * n);
                const ytile = Math.floor((1 - Math.log(Math.tan(25.5358 * Math.PI / 180) + 1 / Math.cos(25.5358 * Math.PI / 180)) / Math.PI) / 2 * n);
                
                // Cache a 5x5 grid at each zoom level
                for(let x = xtile-2; x <= xtile+2; x++) {
                    for(let y = ytile-2; y <= ytile+2; y++) {
                        const s = subdomains[Math.floor(Math.random() * 3)];
                        tiles.push(`https://${s}.basemaps.cartocdn.com/rastertiles/voyager/${z}/${x}/${y}.png`);
                    }
                }
            }

            let count = 0;
            const batchSize = 5; // Download in small batches to avoid stall
            for (let i = 0; i < tiles.length; i += batchSize) {
                const batch = tiles.slice(i, i + batchSize);
                await Promise.all(batch.map(url => cache.add(url).catch(e => console.warn("Failed tile:", url))));
                count += batch.length;
                setDownloadProgress(`${Math.round((count / tiles.length) * 100)}%`);
            }

            setDownloadProgress("Complete!");
            setTimeout(() => setDownloadProgress(null), 3000);
        } catch (e) {
            console.error(e);
            setDownloadProgress("Error!");
            setTimeout(() => setDownloadProgress(null), 3000);
        }
    };

    return (
        <div 
            ref={drawerRef}
            className={`fixed inset-y-0 left-0 w-80 bg-white shadow-2xl z-50 transition-transform duration-300 ease-in-out pointer-events-auto ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}
        >
            <div className="p-6 h-full flex flex-col">
                <div className="flex items-center justify-between mb-8">
                    <div className="flex items-center">
                        <img src={logo} alt="IITP PathFinder" className="h-10 object-contain" />
                    </div>
                    <button className="p-2 hover:bg-slate-100 rounded-full transition-colors" onClick={onClose}>
                        <span className="material-symbols-outlined">chevron_left</span>
                    </button>
                </div>

                <nav className="flex-1 space-y-1 overflow-y-auto no-scrollbar">
                    {user ? (
                        <>
                            {/* Saved Places */}
                            <div>
                                <button 
                                    onClick={() => setExpandedSection(expandedSection === 'saved' ? null : 'saved')}
                                    className="w-full flex items-center px-4 py-3 gap-4 text-slate-700 font-bold hover:bg-slate-50 rounded-xl transition-colors"
                                >
                                    <span className="material-symbols-outlined text-yellow-500">bookmark</span>
                                    <span className="flex-1 text-left">Saved Places</span>
                                    <span className="text-xs text-slate-400 font-medium">{savedPlaces.length}</span>
                                </button>
                                {expandedSection === 'saved' && (
                                    <div className="mt-1 ml-10 space-y-1 animate-in slide-in-from-top-2 duration-300">
                                        {savedPlaces.length > 0 ? savedPlaces.map((p, i) => (
                                            <div key={i} className="flex items-center justify-between group">
                                                <button 
                                                    onClick={() => handleSelectPlace(p)}
                                                    className="text-sm text-slate-500 hover:text-primary transition-colors py-1 truncate flex-1 text-left"
                                                >
                                                    {p.name}
                                                </button>
                                                <button onClick={() => toggleSavedPlace(p)} className="p-1 opacity-0 group-hover:opacity-100 text-slate-300 hover:text-red-400">
                                                    <span className="material-symbols-outlined text-xs">close</span>
                                                </button>
                                            </div>
                                        )) : <div className="text-[10px] text-slate-400 italic py-2">No saved places yet.</div>}
                                    </div>
                                )}
                            </div>

                            {/* Recent History */}
                            <div>
                                <button 
                                    onClick={() => setExpandedSection(expandedSection === 'history' ? null : 'history')}
                                    className="w-full flex items-center px-4 py-3 gap-4 text-slate-700 font-bold hover:bg-slate-50 rounded-xl transition-colors"
                                >
                                    <span className="material-symbols-outlined text-blue-500">history</span>
                                    <span className="flex-1 text-left">Recent History</span>
                                </button>
                                {expandedSection === 'history' && (
                                    <div className="mt-1 ml-10 space-y-2 animate-in slide-in-from-top-2 duration-300">
                                        {recentHistory.length > 0 ? recentHistory.map((h, i) => (
                                            <button 
                                                key={i} 
                                                onClick={() => handleSelectPlace(h)}
                                                className="w-full text-left text-sm text-slate-500 hover:text-primary transition-colors py-1 truncate block"
                                            >
                                                {h.name}
                                            </button>
                                        )) : <div className="text-[10px] text-slate-400 italic py-2">History is empty.</div>}
                                    </div>
                                )}
                            </div>
                        </>
                    ) : (
                        <div className="bg-slate-50 p-4 rounded-2xl mb-4 border border-slate-100">
                            <h5 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Personalization</h5>
                            <p className="text-[10px] text-slate-500 mb-3 leading-relaxed">Log in to save your favorite spots and view your navigation history across devices.</p>
                            <button 
                                onClick={() => { onClose(); navigate('/login'); }}
                                className="w-full py-2 bg-white text-primary text-xs font-bold rounded-lg border border-primary/20 hover:bg-primary hover:text-white transition-all shadow-sm"
                            >
                                Sign In to Sync
                            </button>
                        </div>
                    )}

                    <div className="h-px bg-slate-100 my-4"></div>
                    <button 
                        onClick={() => {
                            onClose();
                            onSettingsClick();
                        }}
                        className="w-full flex items-center px-4 py-3 gap-4 text-slate-700 font-bold hover:bg-slate-50 rounded-xl transition-colors"
                    >
                        <span className="material-symbols-outlined text-slate-400">settings</span>
                        <span>Settings</span>
                    </button>
                    <button 
                        onClick={user ? () => { signOut(); onClose(); } : () => { onClose(); navigate('/login'); }}
                        className={`w-full flex items-center px-4 py-3 gap-4 font-bold rounded-xl transition-colors mt-2 ${user ? 'text-red-500 hover:bg-red-50' : 'text-primary hover:bg-primary/5'}`}
                    >
                        <span className="material-symbols-outlined">{user ? 'logout' : 'login'}</span>
                        <span>{user ? 'Sign Out' : 'Sign In'}</span>
                    </button>
                </nav>

                <div className="mt-auto pt-6 border-t border-slate-100">
                    <div className="bg-blue-50 p-4 rounded-2xl">
                        <h5 className="text-xs font-black text-primary uppercase tracking-widest mb-2">Campus Map Offline</h5>
                        <p className="text-[10px] text-slate-500 mb-3 leading-relaxed">Download map data for Bihta campus to use without internet.</p>
                        <button 
                            onClick={downloadOfflineMap}
                            disabled={downloadProgress !== null}
                            className="w-full py-2 bg-white text-primary text-xs font-bold rounded-lg border border-primary/20 hover:bg-primary hover:text-white transition-all disabled:opacity-50"
                        >
                            {downloadProgress || "Download (12 MB)"}
                        </button>
                    </div>
                    
                    {/* Passive Footer Link */}
                    <button 
                        onClick={() => setIsDevModalOpen(true)}
                        className="w-full flex items-center justify-center gap-2 mt-4 text-[10px] text-slate-400 hover:text-primary transition-colors font-medium group"
                    >
                        <span className="material-symbols-outlined text-sm opacity-60 group-hover:opacity-100 transition-opacity">code</span>
                        <span>Developer Details</span>
                    </button>
                </div>
            </div>

            <DeveloperModal 
                isOpen={isDevModalOpen} 
                onClose={() => setIsDevModalOpen(false)} 
            />
        </div>
    );
}
