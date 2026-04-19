import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Navigate } from 'react-router-dom';

export default function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(null);
    const { signIn, user, isAdmin } = useAuth();
    const navigate = useNavigate();

    if (user && isAdmin) return <Navigate to="/admin" />;

    const handleLogin = async (e) => {
        e.preventDefault();
        setError(null);
        const { error } = await signIn(email, password);
        if (error) setError(error.message);
        else navigate('/admin');
    };

    return (
        <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6 font-manrope">
            <div className="glass-panel w-full max-w-md p-8 rounded-3xl shadow-2xl border border-white/50">
                <div className="text-center mb-8">
                    <div className="w-16 h-16 bg-primary rounded-2xl flex items-center justify-center text-white mx-auto mb-4 shadow-lg shadow-primary/20">
                        <span className="material-symbols-outlined text-3xl">lock</span>
                    </div>
                    <h1 className="text-2xl font-black text-slate-800 tracking-tight">Admin Gate</h1>
                    <p className="text-sm text-slate-500 mt-1 font-body">IITP PathFinder Management Portal</p>
                </div>

                {error && (
                    <div className="bg-red-50 border border-red-100 text-red-600 text-xs py-3 px-4 rounded-xl mb-6 flex items-center gap-2">
                        <span className="material-symbols-outlined text-sm">error</span>
                        {error}
                    </div>
                )}

                <form onSubmit={handleLogin} className="space-y-4">
                    <div className="space-y-1.5">
                        <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Email Address</label>
                        <input 
                            type="email" 
                            required
                            placeholder="admin@iitp.ac.in"
                            className="w-full bg-white/50 border border-slate-200 py-3.5 px-4 rounded-2xl outline-none focus:border-primary focus:ring-4 focus:ring-primary/5 transition-all text-sm"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>

                    <div className="space-y-1.5 text-left">
                        <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Password</label>
                        <input 
                            type="password" 
                            required
                            placeholder="••••••••"
                            className="w-full bg-white/50 border border-slate-200 py-3.5 px-4 rounded-2xl outline-none focus:border-primary focus:ring-4 focus:ring-primary/5 transition-all text-sm"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>

                    <button 
                        type="submit"
                        className="w-full bg-primary text-white py-4 rounded-2xl font-bold shadow-lg shadow-primary/30 hover:scale-[1.02] active:scale-95 transition-all mt-4"
                    >
                        Sign In
                    </button>
                    <button 
                        type="button"
                        onClick={() => navigate('/')}
                        className="w-full text-slate-400 text-xs mt-4 hover:text-slate-600 transition-colors"
                    >
                        Back to Map
                    </button>
                </form>
            </div>
        </div>
    );
}
