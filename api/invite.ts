
import { createClient } from '@supabase/supabase-js';
import type { VercelRequest, VercelResponse } from '@vercel/node';

// Initialize Supabase Admin Client
// Note: This relies on SUPABASE_SERVICE_ROLE_KEY being set in Vercel Env Vars
const supabaseUrl = process.env.VITE_SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

export default async function handler(req: VercelRequest, res: VercelResponse) {
    // Enable CORS
    res.setHeader('Access-Control-Allow-Credentials', 'true');
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
    res.setHeader(
        'Access-Control-Allow-Headers',
        'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
    );

    if (req.method === 'OPTIONS') {
        res.status(200).end();
        return;
    }

    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    if (!supabaseUrl || !supabaseServiceKey) {
        console.error('Missing Supabase Config', { hasUrl: !!supabaseUrl, hasKey: !!supabaseServiceKey });
        return res.status(500).json({ error: 'Server misconfiguration: Missing Supabase keys' });
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey, {
        auth: {
            autoRefreshToken: false,
            persistSession: false
        }
    });

    try {
        const { email, name, role, plan, planCycle } = req.body;

        if (!email) {
            return res.status(400).json({ error: 'Email required' });
        }

        // Send Official Supabase Invite
        const { data, error } = await supabase.auth.admin.inviteUserByEmail(email, {
            data: { name }, // Metadata
            redirectTo: `${req.headers.origin || 'https://influetech.vercel.app'}/auth/definir-senha`
        });

        if (error) throw error;

        // Optionally upsert into User table immediately to ensure they exist with correct Plan/Role
        // Authentication trigger might do this, but being explicit helps avoid race conditions
        const { error: profileError } = await supabase
            .from('User')
            .upsert({
                id: data.user.id,
                email: email,
                name: name || email.split('@')[0],
                role: role || 'USER',
                plan: plan || 'START',
                planCycle: planCycle || 'MONTHLY',
                active: 1,
                updatedAt: new Date().toISOString()
            }, { onConflict: 'id' });

        if (profileError) {
            console.warn('Profile sync warning:', profileError);
        }

        return res.status(200).json({ message: 'Convite enviado com sucesso!', user: data.user });

    } catch (error: any) {
        console.error('Invite Error:', error);
        return res.status(500).json({ error: error.message || 'Error sending invite' });
    }
}
