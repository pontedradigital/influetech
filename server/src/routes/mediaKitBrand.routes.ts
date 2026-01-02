import { Router } from 'express';
import * as MediaKitBrandController from '../controllers/mediaKitBrand.controller';
import { authenticate } from '../middleware/auth.middleware';

const router = Router();

router.use(authenticate);

router.get('/', MediaKitBrandController.getAll);
router.post('/', MediaKitBrandController.create);
router.delete('/:id', MediaKitBrandController.deleteBrand);

export default router;
