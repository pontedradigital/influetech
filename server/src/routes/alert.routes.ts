import { Router } from 'express';
import {
    listAlerts,
    createAlert,
    markAlertAsRead,
    deleteAlert,
    generateAutomaticAlerts
} from '../controllers/alert.controller';

const router = Router();

router.get('/', listAlerts);
router.post('/', createAlert);
router.patch('/:id/read', markAlertAsRead);
router.delete('/:id', deleteAlert);
router.post('/generate', generateAutomaticAlerts);

export default router;
