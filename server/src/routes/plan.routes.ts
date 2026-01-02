import { Router } from 'express';
import * as planController from '../controllers/plan.controller';
import { requireAdmin } from '../middleware/auth.middleware';

const router = Router();

// Public route to get plans
router.get('/', planController.getAllPlans);

// Protected Admin routes
router.post('/', requireAdmin, planController.createPlan);
router.put('/:id', requireAdmin, planController.updatePlan);
router.delete('/:id', requireAdmin, planController.deletePlan);

export default router;

