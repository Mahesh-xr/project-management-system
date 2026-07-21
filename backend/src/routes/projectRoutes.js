import { Router } from 'express';
import {
  getAllProjects,
  getProjectById,
  createProject,
  updateProject,
  deleteProject
} from '../controllers/projectController.js';
import authMiddleware from '../middleware/auth.js';
import { projectValidator } from '../validators/index.js';

const router = Router();

// Apply JWT verification middleware to all project endpoints.
// This guarantees that only authenticated users can perform operations.
router.use(authMiddleware);

// GET /api/projects - Retrieve user's projects (supports search & status filtering)
router.get('/', getAllProjects);

// GET /api/projects/:id - Retrieve a single project
router.get('/:id', getProjectById);

// POST /api/projects - Create a project
router.post('/', projectValidator, createProject);

// PUT /api/projects/:id - Update project details
router.put('/:id', projectValidator, updateProject);

// DELETE /api/projects/:id - Delete a project (cascades task deletion)
router.delete('/:id', deleteProject);

export default router;
