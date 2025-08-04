/**
 * Authentication routes
 * Handles login, registration, and token management
 */

import { Router } from 'express';
import Joi from 'joi';
import { UserManager } from '../managers/UserManager';
import { AuthManager } from '../managers/AuthManager';
import { UserRole } from '../models/User';
import { AppError, asyncHandler } from '../middleware/errorHandler';
import { authenticateToken } from '../middleware/auth';

const router = Router();
const userManager = UserManager.getInstance();
const authManager = AuthManager.getInstance();

// Validation schemas
const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required()
});

const registerSchema = Joi.object({
  email: Joi.string().email().required(),
  username: Joi.string().min(3).max(30).required(),
  password: Joi.string().min(6).required(),
  role: Joi.string().valid('creator', 'admin').required()
});

// POST /api/auth/login
router.post('/login', asyncHandler(async (req, res) => {
  // Validate request body
  const { error, value } = loginSchema.validate(req.body);
  if (error) {
    throw new AppError(`Validation error: ${error.details[0].message}`, 400);
  }

  const { email, password } = value;

  // Find user by email
  const user = await userManager.findByEmail(email);
  if (!user) {
    throw new AppError('Invalid email or password', 401);
  }

  // Validate password
  const isValidPassword = await userManager.validatePassword(user, password);
  if (!isValidPassword) {
    throw new AppError('Invalid email or password', 401);
  }

  // Check if creator is active
  if (user.role === UserRole.CREATOR && !user.isActive) {
    throw new AppError('Account is inactive. Please contact support.', 401);
  }

  // Generate auth result
  const authResult = authManager.createAuthResult(user);

  res.json({
    success: true,
    message: 'Login successful',
    data: authResult
  });
}));

// POST /api/auth/register
router.post('/register', asyncHandler(async (req, res) => {
  // Validate request body
  const { error, value } = registerSchema.validate(req.body);
  if (error) {
    throw new AppError(`Validation error: ${error.details[0].message}`, 400);
  }

  const { email, username, password, role } = value;

  // Check if user already exists
  const existingUser = await userManager.findByEmailOrUsername(email, username);
  if (existingUser) {
    throw new AppError('User with this email or username already exists', 409);
  }

  // Create new user
  const user = await userManager.createUser({
    email,
    username,
    password,
    role: role as UserRole
  });

  // Generate auth result
  const authResult = authManager.createAuthResult(user);

  res.status(201).json({
    success: true,
    message: 'Registration successful',
    data: authResult
  });
}));

// POST /api/auth/refresh
router.post('/refresh', authenticateToken, asyncHandler(async (req, res) => {
  const currentToken = authManager.extractTokenFromHeader(req.headers.authorization);
  
  // Check if token is expiring soon
  if (!authManager.isTokenExpiringSoon(currentToken)) {
    throw new AppError('Token refresh not needed yet', 400);
  }

  // Generate new token
  const user = await userManager.findById(req.user.id);
  if (!user) {
    throw new AppError('User not found', 401);
  }

  const authResult = authManager.createAuthResult(user);

  res.json({
    success: true,
    message: 'Token refreshed successfully',
    data: authResult
  });
}));

// GET /api/auth/me
router.get('/me', authenticateToken, asyncHandler(async (req, res) => {
  const user = await userManager.findById(req.user.id);
  if (!user) {
    throw new AppError('User not found', 401);
  }

  res.json({
    success: true,
    data: user.toJSON()
  });
}));

// POST /api/auth/logout
router.post('/logout', authenticateToken, asyncHandler(async (req, res) => {
  // In a more sophisticated setup, we might invalidate the token
  // For now, we just return success and let the client handle token removal
  
  res.json({
    success: true,
    message: 'Logout successful'
  });
}));

export { router as authRoutes };