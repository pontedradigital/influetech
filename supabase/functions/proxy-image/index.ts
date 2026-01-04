import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

serve(async (req: Request) => {
    const corsHeaders = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
    }

    if (req.method === 'OPTIONS') {
        return new Response('ok', { headers: corsHeaders })
    }

    try {
        const url = new URL(req.url)
        const imageUrl = url.searchParams.get('url')

        if (!imageUrl) {
            return new Response(JSON.stringify({ error: 'Missing url parameter' }), {
                status: 400,
                headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            })
        }

        const imageResponse = await fetch(imageUrl)

        // Create new headers object to manage what we send back
        const newHeaders = new Headers(imageResponse.headers)

        // Ensure CORS headers are present
        newHeaders.set('Access-Control-Allow-Origin', '*')
        newHeaders.set('Access-Control-Allow-Headers', 'authorization, x-client-info, apikey, content-type')

        // Stream response body
        return new Response(imageResponse.body, {
            status: imageResponse.status,
            headers: newHeaders,
        })

    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        return new Response(JSON.stringify({ error: errorMessage }), {
            status: 500,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        })
    }
})
