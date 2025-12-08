import { Router } from 'express';
import {
    listScheduledPosts,
    getScheduledPost,
    createScheduledPost,
    updateScheduledPost,
    deleteScheduledPost,
    publishScheduledPost
} from '../controllers/scheduledPost.controller';

const router = Router();

router.get('/', listScheduledPosts);
router.get('/:id', getScheduledPost);
router.post('/', createScheduledPost);
router.put('/:id', updateScheduledPost);
router.delete('/:id', deleteScheduledPost);
router.post('/:id/publish', publishScheduledPost);

export default router;
