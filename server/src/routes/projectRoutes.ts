import { Router } from 'express';
import {
  createProject,
  getProjects,
  getProjectById,
  updateProject,
  deleteProject,
} from '../controllers/projectController.js';
import {
  validateObjectId,
  validateCreateProject,
  validateUpdateProject,
} from '../middleware/validate.js';

const router = Router();

// POST /api/projects
router.post('/', validateCreateProject, createProject);

// GET /api/projects
router.get('/', getProjects);

// GET /api/projects/:id
router.get('/:id', validateObjectId, getProjectById);

// PATCH /api/projects/:id
router.patch('/:id', validateObjectId, validateUpdateProject, updateProject);

// DELETE /api/projects/:id
router.delete('/:id', validateObjectId, deleteProject);

export default router;
