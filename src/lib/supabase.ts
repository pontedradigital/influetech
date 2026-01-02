import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
    console.error('Missing Supabase credentials:', {
        hasUrl: !!supabaseUrl,
        hasKey: !!supabaseAnonKey
    });
    throw new Error('Supabase credentials not configured');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
