import express from 'express';
import { dashboardController } from '../controllers/dashboard.controller';
import { authenticate } from '../middleware/auth.middleware';

const router = express.Router();

router.use(authenticate);

router.get('/stats', dashboardController.getDashboardStats);
router.get('/insights', dashboardController.getInsights);
router.post('/insights/trigger', dashboardController.triggerInsights);

export default router;
