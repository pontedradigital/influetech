import { Router } from 'express';
import {
    getSuggestions,
    listBazarEvents,
    createBazarEvent,
    updateBazarEvent,
    deleteBazarEvent
} from '../controllers/bazar.controller';

const router = Router();

router.get('/suggestions', getSuggestions);
router.get('/', listBazarEvents);
router.post('/', createBazarEvent);
router.put('/:id', updateBazarEvent);
router.delete('/:id', deleteBazarEvent);

export default router;
