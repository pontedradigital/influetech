import { Router } from 'express';
import { createPost, getFeed, toggleReaction, createComment, getComments, deletePost } from '../controllers/community.controller';

const router = Router();

// Feed & Posts
router.get('/posts', getFeed);
router.post('/posts', createPost);
router.delete('/posts/:id', deletePost);

// Interactions
router.post('/posts/:id/react', toggleReaction);
router.post('/posts/:id/comments', createComment);
router.get('/posts/:id/comments', getComments);

export default router;
