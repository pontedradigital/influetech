
// Wrapper to catch startup errors
export default async (req, res) => {
    try {
        const app = (await import('../server/src/server')).default;
        app(req, res);
    } catch (error: any) {
        console.error('❌ CRITICAL SERVER ERROR:', error);
        res.status(500).json({
            error: 'Server Startup Failed',
            message: error.message,
            stack: error.stack
        });
    }
};

