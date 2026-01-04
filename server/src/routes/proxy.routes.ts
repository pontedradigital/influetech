import express from 'express';


const router = express.Router();

router.get('/image', async (req, res) => {
    const { url } = req.query;

    if (!url || typeof url !== 'string') {
        return res.status(400).json({ error: 'Missing or invalid URL parameter' });
    }

    try {
        // Simple validation to prevent SSRF vulnerabilities - basic check
        // In production, you might want to whitelist domains or allow only specific patterns
        if (!url.startsWith('http')) {
            return res.status(400).json({ error: 'Invalid URL protocol' });
        }

        const response = await fetch(url);

        if (!response.ok) {
            return res.status(response.status).json({ error: 'Failed to fetch image from source' });
        }

        const contentType = response.headers.get('content-type');
        if (contentType) {
            res.setHeader('Content-Type', contentType);
        }

        // Read the body as an ArrayBuffer and convert to Buffer
        const arrayBuffer = await response.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);

        res.send(buffer);

    } catch (error: any) {
        console.error('Proxy Error:', error);
        res.status(500).json({ error: 'Internal Server Error fetching image', details: error.message });
    }
});

export default router;
