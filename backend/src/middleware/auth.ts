/**
 * Authentication middleware
 * JWT token validation and user authorization
 */

import { Request, Response, NextFunction } from 'express';
import { AuthManager } from '../managers/AuthManager';
import { UserManager } from '../managers/UserManager';
import { AppError } from './errorHandler';

// Extend Request interface to include user
declare global {
  namespace Express {
    interface Request {
      user?: any;
    }
  }
}

export const authenticateToken = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const authManager = AuthManager.getInstance();
    const userManager = UserManager.getInstance();

    // Extract token from header
    const token = authManager.extractTokenFromHeader(req.headers.authorization);
    
    // Verify token
    const payload = authManager.verifyToken(token);
    
    // Validate token claims
    if (!authManager.validateTokenClaims(payload)) {
      throw new AppError('Invalid token claims', 401);
    }

    // Get user from database to ensure they still exist and are active
    const user = await userManager.findById(payload.userId);
    if (!user) {
      throw new AppError('User not found', 401);
    }

    // Check if creator is active (admins don't have isActive field)
    if (user.role === 'creator' && !user.isActive) {
      throw new AppError('Account is inactive', 401);
    }

    // Attach user to request
    req.user = user.toJSON();
    
    next();
  } catch (error) {
    if (error instanceof AppError) {
      next(error);
    } else {
      next(new AppError('Authentication failed', 401));
    }
  }
};

export const requireRole = (...roles: string[]) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    if (!req.user) {
      next(new AppError('Authentication required', 401));
      return;
    }

    if (!roles.includes(req.user.role)) {
      next(new AppError('Insufficient permissions', 403));
      return;
    }

    next();
  };
};

export const requireAdmin = requireRole('admin');
export const requireCreator = requireRole('creator');
export const requireAnyRole = requireRole('admin', 'creator');