import { Router } from 'express';
import { authenticate } from '../middleware/auth.middleware';
import { requireAdmin } from '../middleware/auth.middleware';
import {
    createBugReport,
    getUserBugReports,
    getAllBugReports,
    updateBugReportStatus,
    deleteBugReport
} from '../controllers/bugReport.controller';

const router = Router();

// User routes
router.post('/', authenticate, createBugReport);
router.get('/', authenticate, getUserBugReports);

// Admin routes
router.get('/admin/all', authenticate, requireAdmin, getAllBugReports);
router.patch('/admin/:id', authenticate, requireAdmin, updateBugReportStatus);
router.delete('/admin/:id', authenticate, requireAdmin, deleteBugReport);

export default router;
