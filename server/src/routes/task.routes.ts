import { Router } from 'express';
import {
    listTasks,
    createTask,
    updateTask,
    deleteTask,
    completeTask
} from '../controllers/task.controller';

const router = Router();

router.get('/', listTasks);
router.post('/', createTask);
router.put('/:id', updateTask);
router.delete('/:id', deleteTask);
router.patch('/:id/complete', completeTask);

export default router;
