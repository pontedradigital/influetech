import { Router } from 'express';
import { listEarnings, createEarning, deleteEarning } from '../controllers/affiliateEarning.controller';

const router = Router();

router.get('/', listEarnings);
router.post('/', createEarning);
router.delete('/:id', deleteEarning);

export default router;
