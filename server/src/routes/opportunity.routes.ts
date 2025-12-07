
import { Router } from 'express';
import { listOpportunities, createOpportunity, deleteOpportunity } from '../controllers/opportunity.controller';

const router = Router();

router.get('/', listOpportunities);
router.post('/', createOpportunity);
router.delete('/:id', deleteOpportunity);

export default router;
