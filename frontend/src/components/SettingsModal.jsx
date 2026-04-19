import React from 'react';
import { useMapContext } from '../context/MapContext';

export default function SettingsModal({ isOpen, onClose }) {
    const { appSettings, setAppSettings } = useMapContext();

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[2000] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-300 pointer-events-auto">
            <div className="glass-panel w-full max-w-sm rounded-3xl shadow-2xl border border-white/50 p-6 animate-in zoom-in-95 duration-300">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-black text-primary font-manrope">App Settings</h2>
                    <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-full transition-colors">
                        <span className="material-symbols-outlined">close</span>
                    </button>
                </div>

                <div className="space-y-6">
                    {/* Dark Mode Toggle */}
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <span className="material-symbols-outlined text-slate-600">dark_mode</span>
                            <span className="font-bold text-slate-700">Dark Mode</span>
                        </div>
                        <button 
                            onClick={() => setAppSettings(prev => ({ ...prev, darkMode: !prev.darkMode }))}
                            className={`w-12 h-6 rounded-full transition-all relative ${appSettings.darkMode ? 'bg-primary' : 'bg-slate-200'}`}
                        >
                            <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all ${appSettings.darkMode ? 'left-7' : 'left-1'}`}></div>
                        </button>
                    </div>

                    {/* Default Transport Mode */}
                    <div className="space-y-3">
                        <div className="flex items-center gap-3 mb-1">
                            <span className="material-symbols-outlined text-slate-600">directions</span>
                            <span className="font-bold text-slate-700">Default Transport</span>
                        </div>
                        <div className="grid grid-cols-3 gap-2">
                            {[
                                { id: 'driving-car', icon: 'directions_car' },
                                { id: 'cycling-regular', icon: 'pedal_bike' },
                                { id: 'foot-walking', icon: 'directions_walk' }
                            ].map(mode => (
                                <button
                                    key={mode.id}
                                    onClick={() => setAppSettings(prev => ({ ...prev, defaultMode: mode.id }))}
                                    className={`py-3 rounded-xl border flex flex-col items-center gap-1 transition-all ${appSettings.defaultMode === mode.id ? 'bg-primary/5 border-primary text-primary shadow-sm' : 'bg-slate-50 border-transparent text-slate-400 hover:text-slate-600'}`}
                                >
                                    <span className="material-symbols-outlined text-[20px]">{mode.icon}</span>
                                </button>
                            ))}
                        </div>
                        <p className="text-[10px] text-slate-400 italic text-center">Your preferred way to move around campus by default.</p>
                    </div>
                </div>

                <div className="mt-8 pt-6 border-t border-slate-100">
                    <button 
                        onClick={onClose}
                        className="w-full bg-primary text-white py-4 rounded-2xl font-bold shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-all"
                    >
                        Save Preferences
                    </button>
                </div>
            </div>
        </div>
    );
}
