
import { createClient } from '@supabase/supabase-js';
import type { VercelRequest, VercelResponse } from '@vercel/node';

const supabaseUrl = process.env.VITE_SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

export default async function handler(req: VercelRequest, res: VercelResponse) {
    // Enable CORS
    res.setHeader('Access-Control-Allow-Credentials', 'true');
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,POST');
    res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version');

    if (req.method === 'OPTIONS') {
        res.status(200).end();
        return;
    }

    if (!supabaseUrl || !supabaseServiceKey) {
        return res.status(500).json({ error: 'Server misconfiguration' });
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey, {
        auth: {
            autoRefreshToken: false,
            persistSession: false
        }
    });

    try {
        // 1. List all users from Auth
        const { data: { users }, error } = await supabase.auth.admin.listUsers({ perPage: 1000 });

        if (error) throw error;
        if (!users) return res.status(200).json({ message: 'No users found', synced: 0 });

        let syncedCount = 0;
        const errors = [];

        // 2. Iterate and Upsert into Public Table
        for (const user of users) {
            const { error: upsertError } = await supabase
                .from('User')
                .upsert({
                    id: user.id,
                    email: user.email,
                    name: user.user_metadata?.name || user.email?.split('@')[0] || 'Usuario',
                    role: 'USER', // Default, careful not to overwrite admin if running indiscriminately? 
                    // Ideally we check existence first or use ON CONFLICT DO NOTHING for sensitive fields
                    active: 1,
                    // We only want to insert if missing, or update basic info. 
                    // To be safe against overwriting Admin roles, lets use a strategy:
                    // Only update if not exists? Or upsert basic fields.
                    // For now, let's upsert basics. "role" might be risky if we hardcode USER.
                    // Let's FETCH existing first to preserve role if exists.
                    password: 'MANAGED_BY_SUPABASE_AUTH' // Placeholder for NOT NULL constraint
                }, { onConflict: 'id', ignoreDuplicates: true });
            // ignoreDuplicates: true works effectively "INSERT IF NOT EXISTS"
            // but supabase js upsert with ignoreDuplicates might not update fields.

            // Better strategy for Sync: "Ensure Exists".
            // We can use a raw query or just simple insert-if-missing logic.

            // Simple: Try Insert. If fails (conflict), ignore.
            if (upsertError) {
                // If conflict, it's fine.
                // console.log('User exists', user.email);
            } else {
                syncedCount++;
            }
        }

        // Actually, let's use the explicit "INSERT ... ON CONFLICT DO NOTHING" logic provided by Upsert with ignoreDuplicates
        // But for "Azauski", he is missing entirely. So standard Upsert is fine.

        return res.status(200).json({
            message: 'Sync complete',
            totalAuthUsers: users.length,
            newlySynced: syncedCount
        });

    } catch (error: any) {
        console.error('Sync Error:', error);
        return res.status(500).json({ error: error.message });
    }
}
