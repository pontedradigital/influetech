
import { Router } from 'express';
import { radarBrandController } from '../controllers/radarBrand.controller';
import { authenticate, requireAdmin } from '../middleware/auth.middleware';

const router = Router();

// Public read (for Dashboard user) or authentication required?
// Usually authenticated. Admin only for write.

router.get('/', authenticate, radarBrandController.getAll);
router.post('/', authenticate, requireAdmin, radarBrandController.create);
router.post('/analyze', authenticate, requireAdmin, radarBrandController.analyze);
router.put('/:id', authenticate, requireAdmin, radarBrandController.update);
router.delete('/:id', authenticate, requireAdmin, radarBrandController.delete);

export default router;
