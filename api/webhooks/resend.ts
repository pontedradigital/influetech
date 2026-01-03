
import { createClient } from '@supabase/supabase-js';
import type { VercelRequest, VercelResponse } from '@vercel/node';

// Initialize Supabase Admin Client
const supabaseUrl = process.env.VITE_SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

export default async function handler(req: VercelRequest, res: VercelResponse) {
    // 1. Enable CORS (Optional but good for testing)
    res.setHeader('Access-Control-Allow-Credentials', 'true');
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST,OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') {
        res.status(200).end();
        return;
    }

    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    // 2. Validate Config
    if (!supabaseUrl || !supabaseServiceKey) {
        console.error('Missing Supabase Config');
        return res.status(500).json({ error: 'Server configuration error' });
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    try {
        const event = req.body;

        // 3. Check Event Type
        // Resend events: email.sent, email.delivered, email.delivery_delayed, email.complained, email.bounced, email.opened, email.clicked
        const relevantEvents = ['email.bounced', 'email.delivery_delayed', 'email.complained'];

        if (!event || !relevantEvents.includes(event.type)) {
            // We acknowledge success to Resend so it doesn't retry events we don't care about
            return res.status(200).json({ message: 'Event ignored' });
        }

        const { data: { to, subject }, type } = event;
        const recipient = Array.isArray(to) ? to.join(', ') : to;

        // 4. Determine Notification Message based on type
        let title = 'Problema de E-mail';
        let message = `Ocorreu um evento de e-mail: ${type}`;

        if (type === 'email.bounced') {
            title = 'Falha na Entrega (Bounce)';
            message = `O e-mail enviado para ${recipient} voltou (Bounced). Verifique se o endereço está correto.`;
        } else if (type === 'email.complained') {
            title = 'Reclamação de Spam';
            message = `O destinatário ${recipient} marcou um e-mail como Spam.`;
        } else if (type === 'email.delivery_delayed') {
            title = 'Entrega Atrasada';
            message = `A entrega do e-mail para ${recipient} está atrasada. O servidor tentará novamente.`;
        }

        // 5. Find Admins to Notify
        const { data: admins, error: adminError } = await supabase
            .from('User')
            .select('id')
            .eq('role', 'ADMIN');

        if (adminError) throw adminError;

        if (admins && admins.length > 0) {
            // 6. Create Notifications for each Admin
            const notifications = admins.map(admin => ({
                userId: admin.id,
                title: title,
                message: message,
                type: 'ERROR',
                read: false,
                link: '/area-administrativa/usuarios' // Direction to check users maybe?
            }));

            const { error: notifyError } = await supabase
                .from('Notification')
                .insert(notifications);

            if (notifyError) throw notifyError;
        }

        return res.status(200).json({ message: 'Webhook processed' });

    } catch (error: any) {
        console.error('Webhook Error:', error);
        return res.status(500).json({ error: error.message });
    }
}
