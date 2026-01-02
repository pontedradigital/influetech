import { Router } from 'express';
import {
    listUsers,
    inviteUser,
    updateUser,
    deleteUser,
    getPaymentStats,
    getTransactions
} from '../controllers/admin.controller';
import { getNotifications, markAsRead, markAllAsRead } from '../controllers/notification.controller';
import { requireAdmin } from '../middleware/auth.middleware';

const router = Router();

// Proteção Total: Todas as rotas requerem ADMIN
router.use(requireAdmin); // Only admin for now, based on file location

router.get('/notifications', getNotifications);
router.post('/notifications/read', markAsRead);
router.post('/notifications/read-all', markAllAsRead);

router.get('/', listUsers);
router.post('/invite', inviteUser);
router.put('/:id', updateUser);
router.delete('/:id', deleteUser);
router.get('/payments/stats', getPaymentStats);
router.get('/payments/transactions', getTransactions);

export default router;
