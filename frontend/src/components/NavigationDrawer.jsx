import React, { useEffect, useRef } from 'react';

export default function NavigationDrawer({ isOpen, onClose }) {
    const drawerRef = useRef(null);

    // Close on clicking outside drawer (for better UX)
    useEffect(() => {
        const handleClickOutside = (event) => {
            // Check if drawer is open AND click is outside the drawer
            if (isOpen && drawerRef.current && !drawerRef.current.contains(event.target)) {
                // Ensure we aren't clicking the menu button (which toggles it)
                const isMenuButton = event.target.closest('button')?.innerText?.includes('menu') || 
                                     event.target.closest('button')?.querySelector('.material-symbols-outlined')?.innerText === 'menu';
                
                if (!isMenuButton) {
                    onClose();
                }
            }
        };

        document.addEventListener('click', handleClickOutside);
        return () => {
            document.removeEventListener('click', handleClickOutside);
        };
    }, [isOpen, onClose]);

    return (
        <div 
            ref={drawerRef}
            className={`fixed inset-y-0 left-0 w-80 bg-white shadow-2xl z-50 transition-transform duration-300 ease-in-out pointer-events-auto ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}
        >
            <div className="p-6 h-full flex flex-col">
                <div className="flex items-center justify-between mb-8">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center text-white">
                            <span className="material-symbols-outlined">explore</span>
                        </div>
                        <span className="text-xl font-black text-primary font-manrope">Navigator</span>
                    </div>
                    <button 
                        className="p-2 hover:bg-slate-100 rounded-full transition-colors" 
                        onClick={onClose}
                    >
                        <span className="material-symbols-outlined">chevron_left</span>
                    </button>
                </div>
                <nav className="flex-1 space-y-1">
                    <a className="flex items-center px-4 py-3 gap-4 text-slate-700 font-bold hover:bg-slate-50 rounded-xl transition-colors" href="#">
                        <span className="material-symbols-outlined">bookmark</span>
                        <span>Saved Places</span>
                    </a>
                    <a className="flex items-center px-4 py-3 gap-4 text-slate-700 font-bold hover:bg-slate-50 rounded-xl transition-colors" href="#">
                        <span className="material-symbols-outlined">history</span>
                        <span>Recent History</span>
                    </a>
                    <a className="flex items-center px-4 py-3 gap-4 text-slate-700 font-bold hover:bg-slate-50 rounded-xl transition-colors" href="#">
                        <span className="material-symbols-outlined">newspaper</span>
                        <span>Campus News</span>
                    </a>
                    <a className="flex items-center px-4 py-3 gap-4 text-slate-700 font-bold hover:bg-slate-50 rounded-xl transition-colors" href="#">
                        <span className="material-symbols-outlined">event</span>
                        <span>All Events</span>
                    </a>
                    <div className="h-px bg-slate-100 my-4"></div>
                    <a className="flex items-center px-4 py-3 gap-4 text-slate-700 font-bold hover:bg-slate-50 rounded-xl transition-colors" href="#">
                        <span className="material-symbols-outlined">settings</span>
                        <span>Settings</span>
                    </a>
                </nav>
                <div className="mt-auto pt-6 border-t border-slate-100">
                    <div className="bg-blue-50 p-4 rounded-2xl">
                        <h5 className="text-xs font-black text-primary uppercase tracking-widest mb-2">Campus Map Offline</h5>
                        <p className="text-[10px] text-slate-500 mb-3 leading-relaxed">Download map data for Bihta campus to use without internet.</p>
                        <button className="w-full py-2 bg-white text-primary text-xs font-bold rounded-lg border border-primary/20 hover:bg-primary hover:text-white transition-all">Download (12 MB)</button>
                    </div>
                </div>
            </div>
        </div>
    );
}
