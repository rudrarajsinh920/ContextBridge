import { Request, Response, NextFunction } from 'express';
import mongoose from 'mongoose';

const ALLOWED_PROJECT_FIELDS = ['name', 'description', 'status'];
const VALID_STATUSES = ['active', 'archived'];

/**
 * Validates that the :id route parameter is a valid MongoDB ObjectId.
 */
export const validateObjectId = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const { id } = req.params;

  if (
    typeof id !== 'string' ||
    !/^[0-9a-fA-F]{24}$/.test(id) ||
    !mongoose.Types.ObjectId.isValid(id)
  ) {
    res.status(400).json({
      status: 'error',
      statusCode: 400,
      message: `Invalid project ID format: '${String(id)}'. Must be a 24-character hexadecimal ObjectId.`,
    });
    return;
  }

  next();
};

/**
 * Validates request body for creating a new project.
 * Rejects unexpected fields and enforces strict validation rules.
 */
export const validateCreateProject = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const body = req.body;

  if (!body || typeof body !== 'object' || Array.isArray(body)) {
    res.status(400).json({
      status: 'error',
      statusCode: 400,
      message: 'Request body must be a valid JSON object.',
    });
    return;
  }

  // Reject unexpected fields
  const providedFields = Object.keys(body);
  const unexpectedFields = providedFields.filter(
    (key) => !ALLOWED_PROJECT_FIELDS.includes(key)
  );

  if (unexpectedFields.length > 0) {
    res.status(400).json({
      status: 'error',
      statusCode: 400,
      message: `Unexpected field(s) rejected: [${unexpectedFields.join(
        ', '
      )}]. Allowed fields: [${ALLOWED_PROJECT_FIELDS.join(', ')}].`,
    });
    return;
  }

  // Validate 'name'
  if (typeof body.name !== 'string') {
    res.status(400).json({
      status: 'error',
      statusCode: 400,
      message: "Field 'name' is required and must be a string.",
    });
    return;
  }

  const trimmedName = body.name.trim();
  if (trimmedName.length === 0) {
    res.status(400).json({
      status: 'error',
      statusCode: 400,
      message: "Field 'name' cannot be empty or whitespace only.",
    });
    return;
  }

  if (trimmedName.length > 100) {
    res.status(400).json({
      status: 'error',
      statusCode: 400,
      message: "Field 'name' cannot exceed 100 characters.",
    });
    return;
  }

  // Validate 'description' if provided
  if (body.description !== undefined) {
    if (typeof body.description !== 'string') {
      res.status(400).json({
        status: 'error',
        statusCode: 400,
        message: "Field 'description', if provided, must be a string.",
      });
      return;
    }

    if (body.description.length > 1000) {
      res.status(400).json({
        status: 'error',
        statusCode: 400,
        message: "Field 'description' cannot exceed 1000 characters.",
      });
      return;
    }
  }

  // Validate 'status' if provided
  if (body.status !== undefined) {
    if (typeof body.status !== 'string' || !VALID_STATUSES.includes(body.status)) {
      res.status(400).json({
        status: 'error',
        statusCode: 400,
        message: `Field 'status' must be one of: [${VALID_STATUSES.join(', ')}].`,
      });
      return;
    }
  }

  next();
};

/**
 * Validates request body for updating an existing project (PATCH).
 * Requires at least one allowed field, rejects unexpected fields.
 */
export const validateUpdateProject = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const body = req.body;

  if (!body || typeof body !== 'object' || Array.isArray(body)) {
    res.status(400).json({
      status: 'error',
      statusCode: 400,
      message: 'Request body must be a valid JSON object.',
    });
    return;
  }

  const providedFields = Object.keys(body);

  if (providedFields.length === 0) {
    res.status(400).json({
      status: 'error',
      statusCode: 400,
      message: 'Request body cannot be empty. Provide at least one field to update.',
    });
    return;
  }

  // Reject unexpected fields
  const unexpectedFields = providedFields.filter(
    (key) => !ALLOWED_PROJECT_FIELDS.includes(key)
  );

  if (unexpectedFields.length > 0) {
    res.status(400).json({
      status: 'error',
      statusCode: 400,
      message: `Unexpected field(s) rejected: [${unexpectedFields.join(
        ', '
      )}]. Allowed fields: [${ALLOWED_PROJECT_FIELDS.join(', ')}].`,
    });
    return;
  }

  // Validate 'name' if provided
  if (body.name !== undefined) {
    if (typeof body.name !== 'string') {
      res.status(400).json({
        status: 'error',
        statusCode: 400,
        message: "Field 'name' must be a string.",
      });
      return;
    }

    const trimmedName = body.name.trim();
    if (trimmedName.length === 0) {
      res.status(400).json({
        status: 'error',
        statusCode: 400,
        message: "Field 'name' cannot be empty or whitespace only.",
      });
      return;
    }

    if (trimmedName.length > 100) {
      res.status(400).json({
        status: 'error',
        statusCode: 400,
        message: "Field 'name' cannot exceed 100 characters.",
      });
      return;
    }
  }

  // Validate 'description' if provided
  if (body.description !== undefined) {
    if (typeof body.description !== 'string') {
      res.status(400).json({
        status: 'error',
        statusCode: 400,
        message: "Field 'description' must be a string.",
      });
      return;
    }

    if (body.description.length > 1000) {
      res.status(400).json({
        status: 'error',
        statusCode: 400,
        message: "Field 'description' cannot exceed 1000 characters.",
      });
      return;
    }
  }

  // Validate 'status' if provided
  if (body.status !== undefined) {
    if (typeof body.status !== 'string' || !VALID_STATUSES.includes(body.status)) {
      res.status(400).json({
        status: 'error',
        statusCode: 400,
        message: `Field 'status' must be one of: [${VALID_STATUSES.join(', ')}].`,
      });
      return;
    }
  }

  next();
};
