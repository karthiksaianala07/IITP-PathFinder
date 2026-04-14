import React from 'react';

export default function EventsPanel() {
    return (
        <div className="absolute top-6 right-6 w-64 hidden lg:block pointer-events-auto">
            <div className="glass-panel p-4 rounded-2xl shadow-xl border border-white/20">
                <div className="flex items-center justify-between mb-3">
                    <h3 className="text-xs font-extrabold text-primary font-manrope uppercase tracking-wider">On Campus</h3>
                    <span className="material-symbols-outlined text-slate-400 text-sm">expand_more</span>
                </div>
                <div className="space-y-3">
                    <div className="flex gap-3 group cursor-pointer hover:bg-white/40 p-1 -m-1 rounded-xl transition-colors">
                        <div className="w-10 h-10 rounded-lg bg-tertiary-fixed flex flex-col items-center justify-center shrink-0">
                            <span className="text-[8px] font-black text-on-tertiary-fixed">OCT</span>
                            <span className="text-sm font-black text-on-tertiary-fixed -mt-1">24</span>
                        </div>
                        <div className="min-w-0">
                            <h4 className="text-[11px] font-bold text-on-surface truncate">AI Ethics Symposium</h4>
                            <p className="text-[9px] text-slate-500 font-body">Block 3 • 2:00 PM</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
