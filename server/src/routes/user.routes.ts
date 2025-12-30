
import { Router } from 'express';
import { updateProfile, getPublicUsers, toggleLike, getProfileStats, getUser } from '../controllers/user.controller';

const router = Router();

// PUT /api/users/:id - Update user profile
router.put('/:id', updateProfile);

// GET /api/users/public - Get public users list
router.get('/public', getPublicUsers);

// GET /api/users/:id - Get user details
router.get('/:id', getUser);

// POST /api/users/like - Toggle like
router.post('/like', toggleLike);

// GET /api/users/:id/stats - Get user stats
router.get('/:id/stats', getProfileStats);

export default router;
