import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

Deno.serve(async (req) => {
    // Handle CORS preflight
    if (req.method === 'OPTIONS') {
        return new Response('ok', { headers: corsHeaders });
    }

    try {
        const { email, password } = await req.json();

        // Create Supabase client with service role
        const supabaseAdmin = createClient(
            Deno.env.get('SUPABASE_URL') ?? '',
            Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
        );

        // Query user from database
        const { data: user, error } = await supabaseAdmin
            .from('User')
            .select('id, name, email, password, plan')
            .eq('email', email)
            .single();

        if (error || !user) {
            return new Response(
                JSON.stringify({ error: 'Usuário não encontrado' }),
                {
                    status: 400,
                    headers: { ...corsHeaders, 'Content-Type': 'application/json' }
                }
            );
        }

        // Verify password (you'll need bcrypt comparison)
        // For now, direct comparison (INSECURE - just for testing)
        const bcrypt = await import('https://deno.land/x/bcrypt@v0.4.1/mod.ts');
        const valid = await bcrypt.compare(password, user.password);

        if (!valid) {
            return new Response(
                JSON.stringify({ error: 'Senha inválida' }),
                {
                    status: 400,
                    headers: { ...corsHeaders, 'Content-Type': 'application/json' }
                }
            );
        }

        // Generate JWT token
        const jwt = await import('https://deno.land/x/djwt@v3.0.2/mod.ts');
        const key = await jwt.crypto.subtle.importKey(
            'raw',
            new TextEncoder().encode(Deno.env.get('JWT_SECRET') || 'supersecretkey'),
            { name: 'HMAC', hash: 'SHA-256' },
            true,
            ['sign', 'verify']
        );

        const token = await jwt.create({ alg: 'HS256', typ: 'JWT' }, { id: user.id }, key);

        // Return success
        return new Response(
            JSON.stringify({
                token,
                user: {
                    id: user.id,
                    name: user.name,
                    email: user.email,
                    plan: user.plan
                }
            }),
            {
                headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            }
        );

    } catch (error) {
        return new Response(
            JSON.stringify({ error: 'Erro ao realizar login', details: error.message }),
            {
                status: 500,
                headers: { ...corsHeaders, 'Content-Type': 'application/json' }
            }
        );
    }
});
