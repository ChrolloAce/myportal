/**
 * DatabaseManager - Centralized database operations manager
 * Handles SQLite database connection and setup following singleton pattern
 */

import sqlite3 from 'sqlite3';
import { promisify } from 'util';

export class DatabaseManager {
  private static instance: DatabaseManager;
  private db: sqlite3.Database | null = null;
  private dbPath: string;

  private constructor(dbPath: string = './database.db') {
    this.dbPath = dbPath;
  }

  public static getInstance(dbPath?: string): DatabaseManager {
    if (!DatabaseManager.instance) {
      DatabaseManager.instance = new DatabaseManager(dbPath);
    }
    return DatabaseManager.instance;
  }

  public async initialize(): Promise<void> {
    return new Promise((resolve, reject) => {
      this.db = new sqlite3.Database(this.dbPath, (err) => {
        if (err) {
          reject(new Error(`Failed to connect to database: ${err.message}`));
          return;
        }
        
        console.log('Connected to SQLite database');
        this.setupTables()
          .then(() => resolve())
          .catch(reject);
      });
    });
  }

  public async close(): Promise<void> {
    return new Promise((resolve, reject) => {
      if (this.db) {
        this.db.close((err) => {
          if (err) {
            reject(new Error(`Failed to close database: ${err.message}`));
            return;
          }
          console.log('Database connection closed');
          resolve();
        });
      } else {
        resolve();
      }
    });
  }

  public getDatabase(): sqlite3.Database {
    if (!this.db) {
      throw new Error('Database not initialized. Call initialize() first.');
    }
    return this.db;
  }

  public async run(sql: string, params: any[] = []): Promise<sqlite3.RunResult> {
    const db = this.getDatabase();
    const runAsync = promisify(db.run.bind(db));
    return runAsync(sql, params);
  }

  public async get(sql: string, params: any[] = []): Promise<any> {
    const db = this.getDatabase();
    const getAsync = promisify(db.get.bind(db));
    return getAsync(sql, params);
  }

  public async all(sql: string, params: any[] = []): Promise<any[]> {
    const db = this.getDatabase();
    const allAsync = promisify(db.all.bind(db));
    return allAsync(sql, params);
  }

  private async setupTables(): Promise<void> {
    const createUsersTable = `
      CREATE TABLE IF NOT EXISTS users (
        id TEXT PRIMARY KEY,
        email TEXT UNIQUE NOT NULL,
        username TEXT UNIQUE NOT NULL,
        password_hash TEXT NOT NULL,
        role TEXT NOT NULL CHECK (role IN ('creator', 'admin')),
        is_active BOOLEAN DEFAULT 1,
        total_submissions INTEGER DEFAULT 0,
        approved_submissions INTEGER DEFAULT 0,
        permissions TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `;

    const createSubmissionsTable = `
      CREATE TABLE IF NOT EXISTS submissions (
        id TEXT PRIMARY KEY,
        creator_id TEXT NOT NULL,
        creator_username TEXT NOT NULL,
        video_url TEXT NOT NULL,
        platform TEXT NOT NULL CHECK (platform IN ('tiktok', 'instagram')),
        caption TEXT,
        hashtags TEXT,
        notes TEXT,
        status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
        admin_feedback TEXT,
        admin_id TEXT,
        submitted_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        reviewed_at DATETIME,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (creator_id) REFERENCES users (id),
        FOREIGN KEY (admin_id) REFERENCES users (id)
      )
    `;

    const createIndexes = [
      'CREATE INDEX IF NOT EXISTS idx_users_email ON users (email)',
      'CREATE INDEX IF NOT EXISTS idx_users_username ON users (username)',
      'CREATE INDEX IF NOT EXISTS idx_submissions_creator ON submissions (creator_id)',
      'CREATE INDEX IF NOT EXISTS idx_submissions_status ON submissions (status)',
      'CREATE INDEX IF NOT EXISTS idx_submissions_platform ON submissions (platform)',
      'CREATE INDEX IF NOT EXISTS idx_submissions_submitted_at ON submissions (submitted_at)'
    ];

    try {
      await this.run(createUsersTable);
      await this.run(createSubmissionsTable);
      
      for (const indexSql of createIndexes) {
        await this.run(indexSql);
      }
      
      console.log('Database tables and indexes created successfully');
    } catch (error) {
      throw new Error(`Failed to setup database tables: ${error}`);
    }
  }

  public async beginTransaction(): Promise<void> {
    await this.run('BEGIN TRANSACTION');
  }

  public async commit(): Promise<void> {
    await this.run('COMMIT');
  }

  public async rollback(): Promise<void> {
    await this.run('ROLLBACK');
  }

  public async executeTransaction(operations: (() => Promise<any>)[]): Promise<any[]> {
    await this.beginTransaction();
    
    try {
      const results = [];
      for (const operation of operations) {
        const result = await operation();
        results.push(result);
      }
      
      await this.commit();
      return results;
    } catch (error) {
      await this.rollback();
      throw error;
    }
  }
}