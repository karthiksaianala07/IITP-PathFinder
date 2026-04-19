import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

export default function AdminDashboard() {
    const { isAdmin, signOut } = useAuth();
    const navigate = useNavigate();
    const [locations, setLocations] = useState([]);
    const [isEditing, setIsEditing] = useState(null); // ID of location being edited
    const [formData, setFormData] = useState({ name: '', category: '', lat: '', lng: '' });
    const [message, setMessage] = useState(null);

    useEffect(() => {
        fetchLocations();
    }, []);

    const fetchLocations = async () => {
        const { data } = await supabase.from('locations').select('*').order('name');
        setLocations(data || []);
    };

    const handleSave = async (e) => {
        e.preventDefault();
        setMessage("Saving...");
        
        const payload = { 
            name: formData.name, 
            category: formData.category, 
            lat: parseFloat(formData.lat), 
            lng: parseFloat(formData.lng) 
        };

        let result;
        if (isEditing) {
            result = await supabase.from('locations').update(payload).eq('id', isEditing);
        } else {
            result = await supabase.from('locations').insert([payload]);
        }

        if (!result.error) {
            setMessage("Success!");
            setFormData({ name: '', category: '', lat: '', lng: '' });
            setIsEditing(null);
            fetchLocations();
            setTimeout(() => setMessage(null), 3000);
        } else {
            setMessage("Error: " + result.error.message);
        }
    };

    const startEdit = (loc) => {
        setIsEditing(loc.id);
        setFormData({ name: loc.name, category: loc.category, lat: loc.lat, lng: loc.lng });
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Delete this location forever?")) return;
        const { error } = await supabase.from('locations').delete().eq('id', id);
        if (!error) fetchLocations();
    };

    const handleLogout = async () => {
        await signOut();
        navigate('/login');
    };

    return (
        <div className="min-h-screen bg-slate-50 p-4 md:p-8 font-manrope">
            {/* Header */}
            <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
                <div>
                    <h1 className="text-3xl font-black text-slate-800 tracking-tight">Campus Manager</h1>
                    <p className="text-slate-500 text-sm font-body">Manage POIs, markers, and campus data.</p>
                </div>
                <div className="flex gap-3">
                    <button onClick={() => navigate('/')} className="bg-white border border-slate-200 px-5 py-2.5 rounded-xl font-bold text-slate-600 hover:bg-slate-50 transition-all text-sm">View Map</button>
                    <button onClick={handleLogout} className="bg-red-50 text-red-600 px-5 py-2.5 rounded-xl font-bold hover:bg-red-100 transition-all text-sm">Sign Out</button>
                </div>
            </div>

            <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8 pointer-events-auto">
                {/* Editor Panel */}
                <div className="glass-panel p-6 rounded-3xl shadow-xl border border-white/50 h-fit lg:sticky lg:top-8">
                    <h2 className="text-lg font-black text-slate-800 mb-6 flex items-center gap-2">
                        <span className="material-symbols-outlined text-primary">{isEditing ? 'edit' : 'add_circle'}</span>
                        {isEditing ? 'Edit Location' : 'Add New Location'}
                    </h2>

                    <form onSubmit={handleSave} className="space-y-4">
                        <div className="space-y-1 text-left">
                            <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Location Name</label>
                            <input 
                                className="w-full bg-white border border-slate-200 py-3 px-4 rounded-xl outline-none focus:border-primary transition-all text-sm font-bold"
                                placeholder="e.g. Block 9 (Academics)"
                                value={formData.name}
                                onChange={e => setFormData({...formData, name: e.target.value})}
                                required
                            />
                        </div>

                        <div className="space-y-1 text-left">
                            <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Category</label>
                            <select 
                                className="w-full bg-white border border-slate-200 py-3 px-4 rounded-xl outline-none focus:border-primary transition-all text-sm font-bold appearance-none"
                                value={formData.category}
                                onChange={e => setFormData({...formData, category: e.target.value})}
                                required
                            >
                                <option value="">Select Category</option>
                                <option value="Academic">Academic</option>
                                <option value="Hostel">Hostel</option>
                                <option value="Dining">Dining</option>
                                <option value="Amenity">Amenity</option>
                                <option value="Sports">Sports</option>
                            </select>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-1 text-left">
                                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Latitude</label>
                                <input 
                                    className="w-full bg-white border border-slate-200 py-3 px-4 rounded-xl outline-none focus:border-primary transition-all text-sm font-body"
                                    placeholder="25.53..."
                                    type="number" step="0.00000001"
                                    value={formData.lat}
                                    onChange={e => setFormData({...formData, lat: e.target.value})}
                                    required
                                />
                            </div>
                            <div className="space-y-1 text-left">
                                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Longitude</label>
                                <input 
                                    className="w-full bg-white border border-slate-200 py-3 px-4 rounded-xl outline-none focus:border-primary transition-all text-sm font-body"
                                    placeholder="84.85..."
                                    type="number" step="0.00000001"
                                    value={formData.lng}
                                    onChange={e => setFormData({...formData, lng: e.target.value})}
                                    required
                                />
                            </div>
                        </div>

                        <div className="pt-4 flex gap-2">
                            <button type="submit" className="flex-1 bg-primary text-white py-3.5 rounded-2xl font-bold shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-all">
                                {isEditing ? 'Update Marker' : 'Publish Marker'}
                            </button>
                            {isEditing && (
                                <button 
                                    type="button" 
                                    onClick={() => { setIsEditing(null); setFormData({name:'', category:'', lat:'', lng:''}); }}
                                    className="p-3 bg-slate-100 rounded-2xl text-slate-500 hover:bg-slate-200 transition-all"
                                >
                                    <span className="material-symbols-outlined">close</span>
                                </button>
                            )}
                        </div>
                        {message && <p className="text-[10px] font-black uppercase text-center text-primary mt-2">{message}</p>}
                    </form>
                </div>

                {/* Locations Table */}
                <div className="lg:col-span-2 space-y-4 overflow-x-auto">
                    <div className="bg-white rounded-3xl shadow-sm border border-slate-100 min-w-[600px]">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-slate-50/50 border-b border-slate-100">
                                    <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400">Name</th>
                                    <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400">Category</th>
                                    <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {locations.map(loc => (
                                    <tr key={loc.id} className="border-b border-slate-50 last:border-0 hover:bg-slate-50/20 transition-colors group">
                                        <td className="px-6 py-4">
                                            <div className="font-bold text-slate-700 text-sm">{loc.name}</div>
                                            <div className="text-[10px] text-slate-400 font-body">{loc.lat}, {loc.lng}</div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="px-2.5 py-1 bg-primary/5 text-primary text-[10px] font-black rounded-lg uppercase tracking-wider">{loc.category}</span>
                                        </td>
                                        <td className="px-6 py-4 text-right space-x-2">
                                            <button onClick={() => startEdit(loc)} className="p-2 text-slate-400 hover:text-primary transition-colors hover:bg-primary/5 rounded-full">
                                                <span className="material-symbols-outlined text-[20px]">edit</span>
                                            </button>
                                            <button onClick={() => handleDelete(loc.id)} className="p-2 text-slate-400 hover:text-red-500 transition-colors hover:bg-red-50 rounded-full">
                                                <span className="material-symbols-outlined text-[20px]">delete</span>
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                                {locations.length === 0 && (
                                    <tr>
                                        <td colSpan="3" className="px-6 py-10 text-center text-slate-400 italic text-sm">No locations found. Add your first marker!</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
}
