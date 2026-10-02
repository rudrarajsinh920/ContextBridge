import { Request, Response, NextFunction } from 'express';
import { Project } from '../models/Project.js';
import { isDatabaseConnected } from '../config/database.js';

/**
 * Helper to ensure database is available before executing queries.
 */
const checkDatabaseAvailability = (res: Response): boolean => {
  if (!isDatabaseConnected()) {
    res.status(503).json({
      status: 'error',
      statusCode: 503,
      message: 'Database service is currently unavailable. Please verify MongoDB connection.',
    });
    return false;
  }
  return true;
};

/**
 * POST /api/projects
 * Creates a new Project entity.
 */
export const createProject = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    if (!checkDatabaseAvailability(res)) return;

    const { name, description, status } = req.body;

    const project = await Project.create({
      name: name.trim(),
      description: description !== undefined ? description.trim() : '',
      status: status || 'active',
    });

    res.status(201).json({
      status: 'success',
      data: project,
    });
  } catch (err) {
    next(err);
  }
};

/**
 * GET /api/projects
 * Lists all projects ordered by newest first.
 */
export const getProjects = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    if (!checkDatabaseAvailability(res)) return;

    const projects = await Project.find().sort({ createdAt: -1 });

    res.status(200).json({
      status: 'success',
      count: projects.length,
      data: projects,
    });
  } catch (err) {
    next(err);
  }
};

/**
 * GET /api/projects/:id
 * Fetches a single project by its ObjectId.
 */
export const getProjectById = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    if (!checkDatabaseAvailability(res)) return;

    const { id } = req.params;
    const project = await Project.findById(id);

    if (!project) {
      res.status(404).json({
        status: 'error',
        statusCode: 404,
        message: `Project with ID '${id}' not found.`,
      });
      return;
    }

    res.status(200).json({
      status: 'success',
      data: project,
    });
  } catch (err) {
    next(err);
  }
};

/**
 * PATCH /api/projects/:id
 * Partially updates an existing project.
 */
export const updateProject = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    if (!checkDatabaseAvailability(res)) return;

    const { id } = req.params;
    const { name, description, status } = req.body;

    const updateFields: Record<string, unknown> = {};
    if (name !== undefined) updateFields.name = name.trim();
    if (description !== undefined) updateFields.description = description.trim();
    if (status !== undefined) updateFields.status = status;

    const updatedProject = await Project.findByIdAndUpdate(
      id,
      { $set: updateFields },
      { returnDocument: 'after', runValidators: true }
    );

    if (!updatedProject) {
      res.status(404).json({
        status: 'error',
        statusCode: 404,
        message: `Project with ID '${id}' not found.`,
      });
      return;
    }

    res.status(200).json({
      status: 'success',
      data: updatedProject,
    });
  } catch (err) {
    next(err);
  }
};

/**
 * DELETE /api/projects/:id
 * Deletes a project by its ObjectId.
 */
export const deleteProject = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    if (!checkDatabaseAvailability(res)) return;

    const { id } = req.params;
    const deletedProject = await Project.findByIdAndDelete(id);

    if (!deletedProject) {
      res.status(404).json({
        status: 'error',
        statusCode: 404,
        message: `Project with ID '${id}' not found.`,
      });
      return;
    }

    res.status(200).json({
      status: 'success',
      message: `Project '${deletedProject.name}' (${id}) was successfully deleted.`,
      data: {
        id,
      },
    });
  } catch (err) {
    next(err);
  }
};
