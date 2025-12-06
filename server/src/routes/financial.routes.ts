import { Router } from 'express';
import {
    listTransactions,
    getTransaction,
    createTransaction,
    updateTransaction,
    deleteTransaction,
    getSummary,
    getHistory
} from '../controllers/financial.controller';

const router = Router();

router.get('/', listTransactions);
router.get('/summary', getSummary);
router.get('/history', getHistory);
router.get('/:id', getTransaction);
router.post('/', createTransaction);
router.put('/:id', updateTransaction);
router.delete('/:id', deleteTransaction);

export default router;
