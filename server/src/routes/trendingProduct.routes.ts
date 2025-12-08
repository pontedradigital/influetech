import { Router, Request, Response } from 'express';
import * as trendingProductController from '../controllers/trendingProduct.controller';

const router = Router();

// Get all trending products with filters
router.get('/', trendingProductController.getAllTrendingProducts);

// Get trending product by ID
router.get('/:id', trendingProductController.getTrendingProductById);

// Get trending products statistics
router.get('/stats/summary', trendingProductController.getTrendingStats);

// Get product categories
router.get('/categories/list', trendingProductController.getCategories);

// Refresh trending data (manual trigger)
router.post('/refresh', trendingProductController.refreshTrendingData);

export default router;
