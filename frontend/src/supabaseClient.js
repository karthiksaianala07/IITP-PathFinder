import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
    console.error("🚨 Supabase Configuration Missing! Please add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY to your Render Environment Variables.");
}

export const supabase = createClient(
    supabaseUrl || 'https://placeholder-url.supabase.co', 
    supabaseKey || 'placeholder-key'
);
