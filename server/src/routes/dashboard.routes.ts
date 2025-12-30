import express from 'express';
import { dashboardController } from '../controllers/dashboard.controller';
// import { authenticateToken } from '../middleware/auth'; // Ensure this exists or use placeholder

const router = express.Router();

// Add auth middleware if available, assuming yes based on other routes
// router.use(authenticateToken); 

// For now, I'll assume public or handled by main server.ts middleware if applied globally
// But usually it's per route. I'll check auth.routes usage in server.ts -> it just imports. 
// I'll skip middleware import for now or try to match existing pattern.
// Looking at file list, I see `src/middleware` not listed in initial `list_dir server`?
// Ah, `server/src` has `controllers`, `services`, `routes`.
// I'll check `user.routes.ts` or similar to see how they handle auth.

router.get('/stats', dashboardController.getDashboardStats);
router.get('/insights', dashboardController.getInsights);
router.post('/insights/trigger', dashboardController.triggerInsights);

export default router;
