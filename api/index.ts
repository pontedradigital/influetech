import express from 'express';
import cors from 'cors';
import 'dotenv/config';

// Import all routes
import authRoutes from '../server/src/routes/auth.routes';
import productRoutes from '../server/src/routes/product.routes';
import companyRoutes from '../server/src/routes/company.routes';
import saleRoutes from '../server/src/routes/sale.routes';
import financialRoutes from '../server/src/routes/financial.routes';
import userRoutes from '../server/src/routes/user.routes';
import opportunityRoutes from '../server/src/routes/opportunity.routes';
import scheduledPostRoutes from '../server/src/routes/scheduledPost.routes';
import taskRoutes from '../server/src/routes/task.routes';
import alertRoutes from '../server/src/routes/alert.routes';
import bazarRoutes from '../server/src/routes/bazar.routes';
import trendingProductRoutes from '../server/src/routes/trendingProduct.routes';
import shipmentRoutes from '../server/src/routes/shipment.routes';
import recurringExpenseRoutes from '../server/src/routes/recurringExpense.routes';
import financialGoalRoutes from '../server/src/routes/financialGoal.routes';
import affiliatePlatformRoutes from '../server/src/routes/affiliatePlatform.routes';
import affiliateEarningRoutes from '../server/src/routes/affiliateEarning.routes';
import communityRoutes from '../server/src/routes/community.routes';
import mediaKitBrandRoutes from '../server/src/routes/mediaKitBrand.routes';
import dashboardRoutes from '../server/src/routes/dashboard.routes';
import db from '../server/src/db';

const app = express();

app.use(cors());
app.use(express.json({ limit: '50mb' }));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/companies', companyRoutes);
app.use('/api/sales', saleRoutes);
app.use('/api/financial', financialRoutes);
app.use('/api/financial-goals', financialGoalRoutes);
app.use('/api/recurring-expenses', recurringExpenseRoutes);
app.use('/api/affiliate-platforms', affiliatePlatformRoutes);
app.use('/api/affiliate-earnings', affiliateEarningRoutes);
app.use('/api/users', userRoutes);
app.use('/api/opportunities', opportunityRoutes);
app.use('/api/scheduled-posts', scheduledPostRoutes);
app.use('/api/tasks', taskRoutes);
app.use('/api/alerts', alertRoutes);
app.use('/api/bazares', bazarRoutes);
app.use('/api/trending-products', trendingProductRoutes);
app.use('/api/shipments', shipmentRoutes);
app.use('/api/community', communityRoutes);
app.use('/api/media-kit-brands', mediaKitBrandRoutes);
app.use('/api/dashboard', dashboardRoutes);

// Health check
app.get('/api/health', async (req, res) => {
    try {
        await db.$queryRaw`SELECT 1`;
        res.json({ status: 'ok', database: 'connected', timestamp: new Date() });
    } catch (error: any) {
        res.status(500).json({ status: 'error', database: 'disconnected', error: error.message });
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
        console.log(`Server running on port ${PORT}`);
    });
}

// Export for Vercel serverless functions
export default app;
