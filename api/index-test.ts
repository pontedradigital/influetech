import express from 'express';
import cors from 'cors';
import 'dotenv/config';

const app = express();

app.use(cors());
app.use(express.json({ limit: '50mb' }));

// Simple test endpoint
app.get('/api/test', (req, res) => {
    res.json({
        message: 'API is working!',
        timestamp: new Date().toISOString(),
        env: process.env.NODE_ENV
    });
});

// Health check
app.get('/api/health', async (req, res) => {
    try {
        res.json({
            status: 'ok',
            timestamp: new Date(),
            env: {
                nodeEnv: process.env.NODE_ENV,
                hasDatabaseUrl: !!process.env.DATABASE_URL,
                hasJwtSecret: !!process.env.JWT_SECRET
            }
        });
    } catch (error: any) {
        res.status(500).json({ status: 'error', error: error.message });
    }
});

// Simple login test without database
app.post('/api/auth/login-test', (req, res) => {
    const { email, password } = req.body;

    // Hardcoded test
    if (email === 'contato@influetech.com.br' && password === 'test123') {
        res.json({
            token: 'test-token-123',
            user: {
                id: '1',
                name: 'Test User',
                email: email,
                plan: 'PRO'
            }
        });
    } else {
        res.status(400).json({ error: 'Credenciais inválidas' });
    }
});

// Global Error Handler
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
    console.error('Unhandled Error:', err);
    res.status(500).json({ error: 'Internal Server Error', message: err.message });
});

// For local development
if (process.env.NODE_ENV !== 'production') {
    const PORT = process.env.PORT || 3001;
    app.listen(PORT, () => {
        console.log(`Test server running on port ${PORT}`);
    });
}

// Export for Vercel
export default app;
if (typeof module !== 'undefined' && module.exports) {
    module.exports = app;
}
