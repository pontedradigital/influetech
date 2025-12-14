import { Router } from 'express';
import { listGoals, createGoal, updateGoalAmount, deleteGoal, addFundsWithTransaction } from '../controllers/financialGoal.controller';

const router = Router();

router.get('/', listGoals);
router.post('/', createGoal);
router.put('/:id/amount', updateGoalAmount);
router.post('/:id/fund', addFundsWithTransaction);
router.delete('/:id', deleteGoal);

export default router;
