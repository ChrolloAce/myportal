/**
 * Request logging middleware
 * Clean request/response logging for development and monitoring
 */

import { Request, Response, NextFunction } from 'express';

export const requestLogger = (req: Request, res: Response, next: NextFunction): void => {
  const start = Date.now();
  const timestamp = new Date().toISOString();
  
  // Log request
  console.log(`📨 ${timestamp} ${req.method} ${req.url} - ${req.ip}`);
  
  // Log request body for non-GET requests (excluding sensitive data)
  if (req.method !== 'GET' && req.body) {
    const logBody = { ...req.body };
    
    // Remove sensitive fields from logs
    if (logBody.password) logBody.password = '[REDACTED]';
    if (logBody.passwordHash) logBody.passwordHash = '[REDACTED]';
    if (logBody.token) logBody.token = '[REDACTED]';
    
    console.log(`📤 Request body:`, logBody);
  }

  // Override res.json to log responses
  const originalJson = res.json;
  res.json = function(body: any) {
    const duration = Date.now() - start;
    const statusCode = res.statusCode;
    const statusEmoji = getStatusEmoji(statusCode);
    
    console.log(`${statusEmoji} ${statusCode} ${req.method} ${req.url} - ${duration}ms`);
    
    // Log error responses
    if (statusCode >= 400) {
      console.log(`❌ Error Response:`, body);
    }
    
    return originalJson.call(this, body);
  };

  next();
};

function getStatusEmoji(statusCode: number): string {
  if (statusCode >= 200 && statusCode < 300) return '✅';
  if (statusCode >= 300 && statusCode < 400) return '🔀';
  if (statusCode >= 400 && statusCode < 500) return '⚠️';
  if (statusCode >= 500) return '🔥';
  return '📡';
}