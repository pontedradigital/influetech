import { Router } from 'express';
import {
    listSales,
    getSale,
    createSale,
    updateSale,
    deleteSale
} from '../controllers/sale.controller';
import { authenticate } from '../middleware/auth.middleware';

const router = Router();

router.use(authenticate);

router.get('/', listSales);
router.get('/:id', getSale);
router.post('/', createSale);
router.put('/:id', updateSale);
router.delete('/:id', deleteSale);

export default router;
