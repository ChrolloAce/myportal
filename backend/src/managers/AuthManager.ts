/**
 * AuthManager - Handles JWT token generation and validation
 * Clean authentication logic following security best practices
 */

import jwt from 'jsonwebtoken';
import { UserModel } from '../models/User';

export interface TokenPayload {
  userId: string;
  email: string;
  username: string;
  role: string;
}

export interface AuthResult {
  user: any;
  token: string;
  expiresIn: number;
}

export class AuthManager {
  private static instance: AuthManager;
  private jwtSecret: string;
  private tokenExpiry: string;

  private constructor() {
    this.jwtSecret = process.env.JWT_SECRET || 'default-secret-key-change-in-production';
    this.tokenExpiry = process.env.JWT_EXPIRES_IN || '7d';
    
    if (this.jwtSecret === 'default-secret-key-change-in-production') {
      console.warn('⚠️  WARNING: Using default JWT secret. Set JWT_SECRET environment variable in production!');
    }
  }

  public static getInstance(): AuthManager {
    if (!AuthManager.instance) {
      AuthManager.instance = new AuthManager();
    }
    return AuthManager.instance;
  }

  public generateToken(user: UserModel): string {
    const payload: TokenPayload = {
      userId: user.id,
      email: user.email,
      username: user.username,
      role: user.role
    };

    return jwt.sign(payload, this.jwtSecret, {
      expiresIn: this.tokenExpiry,
      issuer: 'video-dashboard-api',
      audience: 'video-dashboard-app'
    });
  }

  public verifyToken(token: string): TokenPayload {
    try {
      const decoded = jwt.verify(token, this.jwtSecret, {
        issuer: 'video-dashboard-api',
        audience: 'video-dashboard-app'
      }) as TokenPayload;

      return decoded;
    } catch (error) {
      if (error instanceof jwt.TokenExpiredError) {
        throw new Error('Token has expired');
      } else if (error instanceof jwt.JsonWebTokenError) {
        throw new Error('Invalid token');
      } else {
        throw new Error('Token verification failed');
      }
    }
  }

  public extractTokenFromHeader(authHeader: string | undefined): string {
    if (!authHeader) {
      throw new Error('Authorization header missing');
    }

    const parts = authHeader.split(' ');
    if (parts.length !== 2 || parts[0] !== 'Bearer') {
      throw new Error('Invalid authorization header format');
    }

    return parts[1];
  }

  public createAuthResult(user: UserModel): AuthResult {
    const token = this.generateToken(user);
    const expiresIn = this.getTokenExpiryTime();

    return {
      user: user.toJSON(),
      token,
      expiresIn
    };
  }

  public refreshToken(currentToken: string): string {
    // Verify current token (this will throw if invalid/expired)
    const payload = this.verifyToken(currentToken);
    
    // Generate new token with same payload
    return jwt.sign(payload, this.jwtSecret, {
      expiresIn: this.tokenExpiry,
      issuer: 'video-dashboard-api',
      audience: 'video-dashboard-app'
    });
  }

  public getTokenExpiryTime(): number {
    // Convert expiry string to seconds
    const match = this.tokenExpiry.match(/^(\d+)([dhm])$/);
    if (!match) return 7 * 24 * 60 * 60; // Default 7 days in seconds

    const value = parseInt(match[1]);
    const unit = match[2];

    switch (unit) {
      case 'd': return value * 24 * 60 * 60; // days to seconds
      case 'h': return value * 60 * 60; // hours to seconds  
      case 'm': return value * 60; // minutes to seconds
      default: return 7 * 24 * 60 * 60;
    }
  }

  public isTokenExpiringSoon(token: string, thresholdMinutes = 30): boolean {
    try {
      const decoded = jwt.decode(token) as any;
      if (!decoded?.exp) return true;

      const now = Math.floor(Date.now() / 1000);
      const timeUntilExpiry = decoded.exp - now;
      const thresholdSeconds = thresholdMinutes * 60;

      return timeUntilExpiry <= thresholdSeconds;
    } catch {
      return true; // If we can't decode, assume it's expiring
    }
  }

  public validateTokenClaims(payload: TokenPayload): boolean {
    return !!(
      payload.userId &&
      payload.email &&
      payload.username &&
      payload.role &&
      ['creator', 'admin'].includes(payload.role)
    );
  }
}