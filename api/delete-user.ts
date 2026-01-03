
import { createClient } from '@supabase/supabase-js';
import type { VercelRequest, VercelResponse } from '@vercel/node';

const supabaseUrl = process.env.VITE_SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

export default async function handler(req: VercelRequest, res: VercelResponse) {
    // Enable CORS
    res.setHeader('Access-Control-Allow-Credentials', 'true');
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,DELETE,POST,PUT');
    res.setHeader(
        'Access-Control-Allow-Headers',
        'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
    );

    if (req.method === 'OPTIONS') {
        res.status(200).end();
        return;
    }

    if (req.method !== 'DELETE' && req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    if (!supabaseUrl || !supabaseServiceKey) {
        return res.status(500).json({ error: 'Server misconfiguration: Missing Supabase keys' });
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey, {
        auth: {
            autoRefreshToken: false,
            persistSession: false
        }
    });

    try {
        const { userId } = req.body;

        if (!userId) {
            return res.status(400).json({ error: 'User ID is required' });
        }

        // 1. Delete from Auth (This is the critical part that frontend cannot do)
        const { error: authError } = await supabase.auth.admin.deleteUser(userId);

        if (authError) {
            console.error('Auth delete error:', authError);
            throw authError;
        }

        // 2. Delete from Public Table (Just in case Cascade is not enabled)
        // We catch error here but don't fail the request if it fails (e.g. already deleted via cascade)
        const { error: dbError } = await supabase.from('User').delete().eq('id', userId);

        if (dbError) {
            console.warn('Public DB delete warning (might be handled by cascade):', dbError);
        }

        return res.status(200).json({ message: 'User deleted successfully from Auth and Database' });

    } catch (error: any) {
        console.error('Delete User Error:', error);
        return res.status(500).json({ error: error.message || 'Error deleting user' });
    }
}
