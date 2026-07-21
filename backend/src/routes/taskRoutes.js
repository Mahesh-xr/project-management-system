import { Router } from 'express';
import {
  getAllTasks,
  getTaskById,
  createTask,
  updateTask,
  deleteTask
} from '../controllers/taskController.js';
import authMiddleware from '../middleware/auth.js';
import { taskValidator } from '../validators/index.js';

const router = Router();

// Apply JWT verification middleware to all task endpoints.
// This guarantees that only authenticated users can perform operations.
router.use(authMiddleware);

// GET /api/tasks - Retrieve user's tasks (supports search, status, priority, and projectId filtering)
router.get('/', getAllTasks);

// GET /api/tasks/:id - Retrieve a single task
router.get('/:id', getTaskById);

// POST /api/tasks - Create a new task (checks parent project ownership)
router.post('/', taskValidator, createTask);

// PUT /api/tasks/:id - Update an existing task (checks ownership)
router.put('/:id', taskValidator, updateTask);

// DELETE /api/tasks/:id - Delete a task (checks ownership)
router.delete('/:id', deleteTask);

export default router;
