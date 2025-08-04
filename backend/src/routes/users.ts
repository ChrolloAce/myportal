/**
 * User management routes
 * Admin-only routes for managing users
 */

import { Router } from 'express';
import Joi from 'joi';
import { UserManager } from '../managers/UserManager';
import { UserRole } from '../models/User';
import { AppError, asyncHandler } from '../middleware/errorHandler';
import { authenticateToken, requireAdmin } from '../middleware/auth';

const router = Router();
const userManager = UserManager.getInstance();

// All routes require admin authentication
router.use(authenticateToken);
router.use(requireAdmin);

// Validation schemas
const querySchema = Joi.object({
  page: Joi.number().integer().min(1).default(1),
  pageSize: Joi.number().integer().min(1).max(100).default(20),
  role: Joi.string().valid('creator', 'admin').optional(),
  isActive: Joi.boolean().optional(),
  search: Joi.string().max(100).optional()
});

const updateUserSchema = Joi.object({
  isActive: Joi.boolean().optional(),
  username: Joi.string().min(3).max(30).optional(),
  email: Joi.string().email().optional()
});

// GET /api/users - Get all users with filtering
router.get('/', asyncHandler(async (req, res) => {
  const { error, value } = querySchema.validate(req.query);
  if (error) {
    throw new AppError(`Query validation error: ${error.details[0].message}`, 400);
  }

  const { page, pageSize, role, isActive, search } = value;

  // Build filters
  const filters: any = {};
  if (role) filters.role = role as UserRole;
  if (isActive !== undefined) filters.isActive = isActive;
  if (search) filters.searchTerm = search;

  const offset = (page - 1) * pageSize;
  const [users, total] = await Promise.all([
    userManager.findUsers(filters, pageSize, offset),
    userManager.getUserCount(filters)
  ]);

  res.json({
    success: true,
    data: {
      items: users.map(user => user.toJSON()),
      total,
      page,
      pageSize,
      totalPages: Math.ceil(total / pageSize)
    }
  });
}));

// GET /api/users/:id - Get specific user
router.get('/:id', asyncHandler(async (req, res) => {
  const user = await userManager.findById(req.params.id);
  if (!user) {
    throw new AppError('User not found', 404);
  }

  res.json({
    success: true,
    data: user.toJSON()
  });
}));

// PUT /api/users/:id - Update user
router.put('/:id', asyncHandler(async (req, res) => {
  const { error, value } = updateUserSchema.validate(req.body);
  if (error) {
    throw new AppError(`Validation error: ${error.details[0].message}`, 400);
  }

  const user = await userManager.findById(req.params.id);
  if (!user) {
    throw new AppError('User not found', 404);
  }

  // Prevent admins from deactivating themselves
  if (user.id === req.user.id && value.isActive === false) {
    throw new AppError('Cannot deactivate your own account', 400);
  }

  // Update user fields
  if (value.username !== undefined) user.username = value.username;
  if (value.email !== undefined) user.email = value.email;
  if (value.isActive !== undefined && user.role === UserRole.CREATOR) {
    if (value.isActive) {
      user.activate();
    } else {
      user.deactivate();
    }
  }

  // Check for email/username conflicts
  if (value.email || value.username) {
    const existingUser = await userManager.findByEmailOrUsername(
      value.email || user.email,
      value.username || user.username
    );
    
    if (existingUser && existingUser.id !== user.id) {
      throw new AppError('User with this email or username already exists', 409);
    }
  }

  await userManager.updateUser(user);

  res.json({
    success: true,
    message: 'User updated successfully',
    data: user.toJSON()
  });
}));

// POST /api/users/:id/activate - Activate user account
router.post('/:id/activate', asyncHandler(async (req, res) => {
  const user = await userManager.findById(req.params.id);
  if (!user) {
    throw new AppError('User not found', 404);
  }

  if (user.role !== UserRole.CREATOR) {
    throw new AppError('Only creator accounts can be activated/deactivated', 400);
  }

  user.activate();
  await userManager.updateUser(user);

  res.json({
    success: true,
    message: 'User activated successfully',
    data: user.toJSON()
  });
}));

// POST /api/users/:id/deactivate - Deactivate user account
router.post('/:id/deactivate', asyncHandler(async (req, res) => {
  const user = await userManager.findById(req.params.id);
  if (!user) {
    throw new AppError('User not found', 404);
  }

  if (user.role !== UserRole.CREATOR) {
    throw new AppError('Only creator accounts can be activated/deactivated', 400);
  }

  // Prevent admins from deactivating themselves
  if (user.id === req.user.id) {
    throw new AppError('Cannot deactivate your own account', 400);
  }

  user.deactivate();
  await userManager.updateUser(user);

  res.json({
    success: true,
    message: 'User deactivated successfully',
    data: user.toJSON()
  });
}));

// DELETE /api/users/:id - Delete user (dangerous operation)
router.delete('/:id', asyncHandler(async (req, res) => {
  const user = await userManager.findById(req.params.id);
  if (!user) {
    throw new AppError('User not found', 404);
  }

  // Prevent admins from deleting themselves
  if (user.id === req.user.id) {
    throw new AppError('Cannot delete your own account', 400);
  }

  // Prevent deleting the last admin
  if (user.role === UserRole.ADMIN) {
    const adminCount = await userManager.getUserCount({ role: UserRole.ADMIN });
    if (adminCount <= 1) {
      throw new AppError('Cannot delete the last admin account', 400);
    }
  }

  await userManager.deleteUser(req.params.id);

  res.json({
    success: true,
    message: 'User deleted successfully'
  });
}));

export { router as userRoutes };