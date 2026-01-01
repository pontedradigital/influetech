import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/auth.routes';
import productRoutes from './routes/product.routes';
import companyRoutes from './routes/company.routes';
import saleRoutes from './routes/sale.routes';
import financialRoutes from './routes/financial.routes';
import userRoutes from './routes/user.routes';
import opportunityRoutes from './routes/opportunity.routes';
import scheduledPostRoutes from './routes/scheduledPost.routes';
import taskRoutes from './routes/task.routes';
import alertRoutes from './routes/alert.routes';
import bazarRoutes from './routes/bazar.routes';
import trendingProductRoutes from './routes/trendingProduct.routes';
import shipmentRoutes from './routes/shipment.routes';

import recurringExpenseRoutes from './routes/recurringExpense.routes';
import financialGoalRoutes from './routes/financialGoal.routes';
import affiliatePlatformRoutes from './routes/affiliatePlatform.routes';
import affiliateEarningRoutes from './routes/affiliateEarning.routes';
import communityRoutes from './routes/community.routes';
import mediaKitBrandRoutes from './routes/mediaKitBrand.routes';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

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

import db from './db';

app.get('/api/health', async (req, res) => {
    try {
        // Simple DB check
        await db.$queryRaw`SELECT 1`;
        res.json({ status: 'ok', database: 'connected', timestamp: new Date() });
    } catch (error: any) {
        console.error('Health Check Failed:', error);
        res.status(500).json({ status: 'error', database: 'disconnected', error: error.message });
    }
});

import dashboardRoutes from './routes/dashboard.routes';
import { dashboardService } from './services/dashboard.service';

app.use('/api/dashboard', dashboardRoutes);

// Note: SchedulerService and Intervals removed for Serverless compatibility.
// Use Vercel Cron Jobs if needed.

// Global Error Handler
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
    console.error('Unhandled Error:', err);
    res.status(500).json({
        error: 'Internal Server Error',
        message: err.message,
        path: req.path
    });
});

// Start server (Railway, local dev, etc)
app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
    console.log(`📦 Environment: ${process.env.NODE_ENV || 'development'}`);
});

export default app;
