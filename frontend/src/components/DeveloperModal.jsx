import React from 'react';
import { createPortal } from 'react-dom';
import kundanImage from '../assets/kundan_sahani.jpeg';
import aksImage from '../assets/AKS.jpg';

const TEAM = [
    { name: "Kundan Sahani", id: 1, image: kundanImage },
    { name: "AKS", id: 2, image: aksImage },
    { name: "Team Member 3", id: 3 },
    { name: "Team Member 4", id: 4 },
    { name: "Team Member 5", id: 5 },
];

export default function DeveloperModal({ isOpen, onClose }) {
    if (!isOpen) return null;

    const modalContent = (
        <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4 md:p-8 overflow-hidden pointer-events-none">
            {/* Backdrop with blur */}
            <div 
                className="absolute inset-0 bg-slate-900/60 backdrop-blur-md animate-in fade-in duration-300 pointer-events-auto"
                onClick={onClose}
            />
            
            {/* Glassmorphic Modal Content - Fixed Layout */}
            <div className="relative bg-white/10 backdrop-blur-2xl rounded-[3rem] border border-white/20 shadow-[0_35px_60px_-15px_rgba(0,0,0,0.5)] max-w-4xl w-full p-8 md:p-12 animate-in zoom-in-95 duration-500 origin-center pointer-events-auto">
                <button 
                    onClick={onClose}
                    className="absolute top-6 right-6 p-2 hover:bg-white/10 rounded-full transition-all text-white/80 hover:text-white"
                >
                    <span className="material-symbols-outlined text-2xl">close</span>
                </button>

                <div className="text-center mb-10">
                    <div className="inline-block px-4 py-1 bg-primary/20 border border-primary/30 rounded-full text-[9px] font-black text-primary uppercase tracking-[0.2em] mb-4">
                        Credits
                    </div>
                    <h2 className="text-3xl md:text-4xl font-black text-white tracking-tight">The Development Team</h2>
                </div>

                <div className="space-y-10">
                    {/* Top Row: 3 People */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 md:gap-12">
                        {TEAM.slice(0, 3).map((dev) => (
                            <DevCard key={dev.id} dev={dev} />
                        ))}
                    </div>

                    {/* Bottom Row: 2 People (Centered) */}
                    <div className="flex flex-wrap justify-center gap-8 md:gap-12">
                        {TEAM.slice(3, 5).map((dev) => (
                            <div key={dev.id} className="w-full sm:w-[calc(33.33%-1rem)] md:w-[calc(33.33%-2rem)]">
                                <DevCard dev={dev} />
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );

    return createPortal(modalContent, document.body);
}

function DevCard({ dev }) {
    return (
        <div className="flex flex-col items-center group">
            <div className="relative w-24 h-24 md:w-32 md:h-32 rounded-[2rem] bg-gradient-to-br from-white/20 to-white/5 border border-white/30 p-1 mb-4 transition-all duration-500 group-hover:scale-105 group-hover:-translate-y-2 shadow-[0_15px_35px_-5px_rgba(0,0,0,0.3)] group-hover:shadow-[0_25px_50px_-12px_rgba(0,0,0,0.5)]">
                <div className="w-full h-full rounded-[1.6rem] bg-white/5 flex items-center justify-center overflow-hidden">
                    {dev.image ? (
                        <img src={dev.image} alt={dev.name} className="w-full h-full object-cover" />
                    ) : (
                        <span className="material-symbols-outlined text-4xl text-white/20 group-hover:text-white/40 transition-colors">person</span>
                    )}
                </div>
                <div className="absolute inset-0 rounded-[2rem] bg-primary/20 opacity-0 group-hover:opacity-100 blur-2xl transition-opacity duration-500 -z-10" />
            </div>
            <h3 className="font-black text-white text-base md:text-lg tracking-tight">{dev.name}</h3>
        </div>
    );
}
