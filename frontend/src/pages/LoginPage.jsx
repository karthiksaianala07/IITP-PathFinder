import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Navigate } from 'react-router-dom';

export default function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(null);
    const { signIn, signInWithSocial, user, isAdmin, loading } = useAuth();
    const navigate = useNavigate();

    if (!loading && user) {
        if (isAdmin) return <Navigate to="/admin" />;
        return <Navigate to="/" />;
    }

    const handleLogin = async (e) => {
        e.preventDefault();
        setError(null);
        const { error } = await signIn(email, password);
        if (error) setError(error.message);
    };

    const handleSocialLogin = async (provider) => {
        setError(null);
        const { error } = await signInWithSocial(provider);
        if (error) setError(error.message);
    };

    return (
        <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6 font-manrope">
            <div className="glass-panel w-full max-w-sm p-8 rounded-3xl shadow-2xl border border-white/50">
                <div className="text-center mb-8">
                    <div className="w-16 h-16 bg-primary rounded-2xl flex items-center justify-center text-white mx-auto mb-4 shadow-lg shadow-primary/20">
                        <span className="material-symbols-outlined text-3xl">account_circle</span>
                    </div>
                    <h1 className="text-2xl font-black text-slate-800 tracking-tight">Welcome Back</h1>
                    <p className="text-sm text-slate-500 mt-1 font-body">Sign in to sync your campus data</p>
                </div>

                {error && (
                    <div className="bg-red-50 border border-red-100 text-red-600 text-xs py-3 px-4 rounded-xl mb-6 flex items-center gap-2">
                        <span className="material-symbols-outlined text-sm">error</span>
                        {error}
                    </div>
                )}

                <div className="grid grid-cols-2 gap-3 mb-6">
                    <button 
                        onClick={() => handleSocialLogin('google')}
                        className="flex items-center justify-center gap-2 py-3 px-4 bg-white border border-slate-200 rounded-2xl hover:bg-slate-50 transition-all text-xs font-bold text-slate-700 shadow-sm"
                    >
                        <img src="https://www.google.com/favicon.ico" className="w-4 h-4" alt="G" />
                        Google
                    </button>
                    <button 
                        onClick={() => handleSocialLogin('azure')}
                        className="flex items-center justify-center gap-2 py-3 px-4 bg-white border border-slate-200 rounded-2xl hover:bg-slate-50 transition-all text-xs font-bold text-slate-700 shadow-sm"
                    >
                        <img src="https://www.microsoft.com/favicon.ico" className="w-4 h-4" alt="M" />
                        Microsoft
                    </button>
                </div>

                <div className="relative mb-6">
                    <div className="absolute inset-0 flex items-center">
                        <div className="w-full border-t border-slate-200"></div>
                    </div>
                    <div className="relative flex justify-center text-[10px] uppercase font-black tracking-widest text-slate-400">
                        <span className="bg-slate-50 px-3">Or email login</span>
                    </div>
                </div>

                <form onSubmit={handleLogin} className="space-y-4">
                    <div className="space-y-1.5">
                        <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1 text-left block">Email Address</label>
                        <input 
                            type="email" 
                            required
                            placeholder="mail@example.com"
                            className="w-full bg-white/50 border border-slate-200 py-3.5 px-4 rounded-2xl outline-none focus:border-primary focus:ring-4 focus:ring-primary/5 transition-all text-sm"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>

                    <div className="space-y-1.5">
                        <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1 text-left block">Password</label>
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
