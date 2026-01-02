
import { Router } from 'express';
import { updateProfile, getPublicUsers, toggleLike, getProfileStats, getUser } from '../controllers/user.controller';
import { authenticate } from '../middleware/auth.middleware';

const router = Router();

// GET /api/users/public - Get public users list
router.get('/public', getPublicUsers);

// GET /api/users/:id/stats - Get user stats (Public/Private hybrid? Assuming public for now or handled by controller)
// Ideally stats should be public if profile is public. Let's keep it protected for now unless requested.
// actually, user stats might be needed for public profile view. Let's move public first.

router.use(authenticate);

// PUT /api/users/:id - Update user profile
router.put('/:id', updateProfile);

// GET /api/users/:id - Get user details
router.get('/:id', getUser);

// POST /api/users/like - Toggle like
router.post('/like', toggleLike);

// GET /api/users/:id/stats - Get user stats (Private mainly, or authenticated view)
router.get('/:id/stats', getProfileStats);

export default router;
