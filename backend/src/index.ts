/**
 * Main server entry point
 * Sets up Express application with clean architecture
 */

import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import path from 'path';

import { DatabaseManager } from './managers/DatabaseManager';
import { authRoutes } from './routes/auth';
import { submissionRoutes } from './routes/submissions';
import { userRoutes } from './routes/users';
import tiktokRoutes from './routes/tiktok';
import { errorHandler } from './middleware/errorHandler';
import { requestLogger } from './middleware/requestLogger';

// Load environment variables
dotenv.config();

class Server {
  private app: express.Application;
  private port: number;
  private dbManager: DatabaseManager;

  constructor() {
    this.app = express();
    this.port = parseInt(process.env.PORT || '3001');
    this.dbManager = DatabaseManager.getInstance();
    
    this.setupMiddleware();
    this.setupRoutes();
    this.setupErrorHandling();
  }

  private setupMiddleware(): void {
    // Security middleware
    this.app.use(helmet({
      crossOriginEmbedderPolicy: false,
      contentSecurityPolicy: {
        directives: {
          defaultSrc: ["'self'"],
          styleSrc: ["'self'", "'unsafe-inline'"],
          scriptSrc: ["'self'"],
          imgSrc: ["'self'", "data:", "https:"],
        },
      },
    }));

    // CORS configuration
    this.app.use(cors({
      origin: process.env.FRONTEND_URL || 'http://localhost:5173',
      credentials: true,
      methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
      allowedHeaders: ['Content-Type', 'Authorization']
    }));

    // Body parsing
    this.app.use(express.json({ limit: '10mb' }));
    this.app.use(express.urlencoded({ extended: true }));

    // Request logging
    this.app.use(requestLogger);

    // Serve static files from frontend build (in production)
    if (process.env.NODE_ENV === 'production') {
      this.app.use(express.static(path.join(__dirname, '../../frontend/dist')));
    }
  }

  private setupRoutes(): void {
    // Health check endpoint
    this.app.get('/api/health', (req, res) => {
      res.json({
        status: 'ok',
        timestamp: new Date().toISOString(),
        version: process.env.npm_package_version || '1.0.0'
      });
    });

    // API routes
    this.app.use('/api/auth', authRoutes);
    this.app.use('/api/submissions', submissionRoutes);
    this.app.use('/api/users', userRoutes);
    this.app.use('/api/tiktok', tiktokRoutes);

    // Catch-all handler for SPA routing (in production)
    if (process.env.NODE_ENV === 'production') {
      this.app.get('*', (req, res) => {
        res.sendFile(path.join(__dirname, '../../frontend/dist/index.html'));
      });
    }

    // 404 handler for API routes
    this.app.use('/api/*', (req, res) => {
      res.status(404).json({
        success: false,
        message: 'API endpoint not found'
      });
    });
  }

  private setupErrorHandling(): void {
    this.app.use(errorHandler);
  }

  public async start(): Promise<void> {
    try {
      // Initialize database
      console.log('🔄 Initializing database...');
      await this.dbManager.initialize();
      console.log('✅ Database initialized successfully');

      // Start server
      this.app.listen(this.port, () => {
        console.log(`🚀 Server running on port ${this.port}`);
        console.log(`📱 API available at http://localhost:${this.port}/api`);
        console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
      });
    } catch (error) {
      console.error('❌ Failed to start server:', error);
      process.exit(1);
    }
  }

  public async stop(): Promise<void> {
    console.log('🔄 Shutting down server...');
    await this.dbManager.close();
    console.log('✅ Server shut down successfully');
  }
}

// Create and start server
const server = new Server();

// Graceful shutdown handling
process.on('SIGTERM', async () => {
  console.log('📡 SIGTERM received');
  await server.stop();
  process.exit(0);
});

process.on('SIGINT', async () => {
  console.log('📡 SIGINT received');
  await server.stop();
  process.exit(0);
});

// Handle uncaught exceptions
process.on('uncaughtException', (error) => {
  console.error('💥 Uncaught Exception:', error);
  process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('💥 Unhandled Rejection at:', promise, 'reason:', reason);
  process.exit(1);
});

// Start the server
server.start().catch((error) => {
  console.error('💥 Failed to start server:', error);
  process.exit(1);
});