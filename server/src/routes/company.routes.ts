import { Router } from 'express';
import { listCompanies, createCompany, updateCompany, deleteCompany } from '../controllers/company.controller';
import { authenticate } from '../middleware/auth.middleware';

const router = Router();

router.use(authenticate);

router.get('/', listCompanies);
router.post('/', createCompany);
router.put('/:id', updateCompany);
router.delete('/:id', deleteCompany);


export default router;
