import { Request, Response } from 'express';
import { dashboardService } from '../services/dashboard.service';

export const dashboardController = {
    async getDashboardStats(req: Request, res: Response) {
        try {
            // Assuming userId is attached to req.user (middleware)
            // or passed as query param for dev/testing if auth not full strict yet
            // In this project, usually req.user.id from JWT
            // If auth middleware is missing, fallback to default admin ID (like ProductController)
            const defaultId = '327aa8c1-7c26-41c2-95d7-b375c25eb896';
            const userId = (req as any).user?.id || defaultId;

            if (!userId) {
                return res.status(401).json({ error: 'User not authenticated' });
            }

            const stats = await dashboardService.getStats(userId);
            res.json(stats);
        } catch (error) {
            console.error('Error fetching dashboard stats:', error);
            res.status(500).json({ error: 'Failed to fetch stats' });
        }
    },

    async getInsights(req: Request, res: Response) {
        try {
            const userId = (req as any).user?.id;
            if (!userId) {
                return res.status(401).json({ error: 'User not authenticated' });
            }

            const insights = await dashboardService.getInsights(userId);
            res.json(insights);
        } catch (error) {
            console.error('Error fetching insights:', error);
            res.status(500).json({ error: 'Failed to fetch insights' });
        }
    },

    // Manual trigger for testing
    async triggerInsights(req: Request, res: Response) {
        try {
            await dashboardService.generateInsights();
            res.json({ message: 'Insights generation triggered.' });
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Failed to trigger insights' });
        }
    }
};
