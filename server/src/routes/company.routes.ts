import { Router } from 'express';
import { listCompanies, createCompany, updateCompany, deleteCompany } from '../controllers/company.controller';

const router = Router();

router.get('/', listCompanies);
router.post('/', createCompany);
router.put('/:id', updateCompany);
router.delete('/:id', deleteCompany);

export default router;
