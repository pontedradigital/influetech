import { Router } from 'express';
import { listRecurringExpenses, createRecurringExpense, toggleActive, deleteRecurringExpense } from '../controllers/recurringExpense.controller';

const router = Router();

router.get('/', listRecurringExpenses);
router.post('/', createRecurringExpense);
router.patch('/:id/toggle', toggleActive);
router.delete('/:id', deleteRecurringExpense);

export default router;
