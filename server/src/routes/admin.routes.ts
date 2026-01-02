import { Router } from 'express';
import {
    listUsers,
    inviteUser,
    updateUser,
    deleteUser,
    getPaymentStats
} from '../controllers/admin.controller';
import { requireAdmin } from '../middleware/auth.middleware';

const router = Router();

// Proteção Total: Todas as rotas requerem ADMIN
router.use(requireAdmin);

router.get('/', listUsers);
router.post('/invite', inviteUser);
router.put('/:id', updateUser);
router.delete('/:id', deleteUser);
router.get('/payments/stats', getPaymentStats);

export default router;
