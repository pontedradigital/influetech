import { Router } from 'express';
import * as MediaKitBrandController from '../controllers/mediaKitBrand.controller';

const router = Router();

router.get('/', MediaKitBrandController.getAll);
router.post('/', MediaKitBrandController.create);
router.delete('/:id', MediaKitBrandController.deleteBrand);

export default router;
