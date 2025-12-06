import { Router } from 'express';
import {
    listSales,
    getSale,
    createSale,
    updateSale,
    deleteSale
} from '../controllers/sale.controller';

const router = Router();

router.get('/', listSales);
router.get('/:id', getSale);
router.post('/', createSale);
router.put('/:id', updateSale);
router.delete('/:id', deleteSale);

export default router;
