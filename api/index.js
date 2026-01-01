// DEBUG VERSION - Minimal code to identify crash point
const express = require('express');

const app = express();

// Enable JSON parsing
app.use(express.json({ limit: '50mb' }));

// CORS - manual implementation to avoid issues
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET,HEAD,PUT,PATCH,POST,DELETE');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    if (req.method === 'OPTIONS') {
        return res.sendStatus(200);
    }
    next();
});

// Simple test - NO DATABASE
app.get('/api/test', (req, res) => {
    res.json({
        message: 'API funcionando!',
        timestamp: new Date().toISOString(),
        env: process.env.NODE_ENV
    });
});

// Health without DB
app.get('/api/health', (req, res) => {
    res.json({
        status: 'ok',
        timestamp: new Date(),
        hasDbUrl: !!process.env.DATABASE_URL,
        hasJwt: !!process.env.JWT_SECRET
    });
});

// Login test WITHOUT database - hardcoded
app.post('/api/auth/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        console.log('Login attempt:', { email, hasPassword: !!password });

        // Hardcoded test user
        if (email === 'contato@influetech.com.br' && password === 'admin123') {
            return res.json({
                token: 'test-token-12345',
                user: {
                    id: '1',
                    name: 'Test User',
                    email: email,
                    plan: 'PRO'
                }
            });
        }

        res.status(400).json({ error: 'Credenciais inválidas (use contato@influetech.com.br / admin123)' });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ error: 'Erro ao realizar login', details: error.message, stack: error.stack });
    }
});

// Catch all for API routes
app.all('/api/*', (req, res) => {
    res.status(404).json({
        error: 'Endpoint não encontrado',
        method: req.method,
        path: req.path
    });
});

// Error handler
app.use((err, req, res, next) => {
    console.error('Unhandled Error:', err);
    res.status(500).json({
        error: 'Internal Server Error',
        message: err.message,
        stack: process.env.NODE_ENV === 'production' ? undefined : err.stack
    });
});

// Local dev only
if (process.env.NODE_ENV !== 'production') {
    const PORT = process.env.PORT || 3001;
    app.listen(PORT, () => {
        console.log(`[DEBUG] Server running on port ${PORT}`);
    });
}

module.exports = app;
