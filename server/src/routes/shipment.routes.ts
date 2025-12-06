import { Router } from 'express';
import * as shipmentController from '../controllers/shipment.controller';

const router = Router();

// CRUD routes
router.post('/', shipmentController.create);
router.get('/', shipmentController.list);
router.get('/:id', shipmentController.getById);
router.put('/:id', shipmentController.update);
router.delete('/:id', shipmentController.delete);

export default router;
