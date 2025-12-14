import { Router } from 'express';
import { listPlatforms, createPlatform, deletePlatform } from '../controllers/affiliatePlatform.controller';

const router = Router();

router.get('/', listPlatforms);
router.post('/', createPlatform);
router.delete('/:id', deletePlatform);

export default router;
