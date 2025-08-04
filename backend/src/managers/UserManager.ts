/**
 * UserManager - Handles all user-related database operations
 * Following single responsibility and OOP principles
 */

import bcrypt from 'bcryptjs';
import { DatabaseManager } from './DatabaseManager';
import { UserModel, UserRole } from '../models/User';

export interface CreateUserData {
  email: string;
  username: string;
  password: string;
  role: UserRole;
}

export interface UserFilters {
  role?: UserRole;
  isActive?: boolean;
  searchTerm?: string;
}

export class UserManager {
  private static instance: UserManager;
  private dbManager: DatabaseManager;

  private constructor() {
    this.dbManager = DatabaseManager.getInstance();
  }

  public static getInstance(): UserManager {
    if (!UserManager.instance) {
      UserManager.instance = new UserManager();
    }
    return UserManager.instance;
  }

  public async createUser(userData: CreateUserData): Promise<UserModel> {
    const existingUser = await this.findByEmailOrUsername(userData.email, userData.username);
    if (existingUser) {
      throw new Error('User with this email or username already exists');
    }

    const passwordHash = await this.hashPassword(userData.password);
    
    const user = new UserModel({
      email: userData.email,
      username: userData.username,
      password_hash: passwordHash,
      role: userData.role
    });

    const dbRow = user.toDatabaseRow();
    
    const sql = `
      INSERT INTO users (
        id, email, username, password_hash, role, is_active, 
        total_submissions, approved_submissions, permissions, 
        created_at, updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    const params = [
      dbRow.id,
      dbRow.email,
      dbRow.username,
      dbRow.password_hash,
      dbRow.role,
      dbRow.is_active ?? null,
      dbRow.total_submissions ?? null,
      dbRow.approved_submissions ?? null,
      dbRow.permissions ? JSON.stringify(dbRow.permissions) : null,
      dbRow.created_at.toISOString(),
      dbRow.updated_at.toISOString()
    ];

    await this.dbManager.run(sql, params);
    return user;
  }

  public async findById(id: string): Promise<UserModel | null> {
    const sql = 'SELECT * FROM users WHERE id = ?';
    const row = await this.dbManager.get(sql, [id]);
    
    return row ? this.rowToUserModel(row) : null;
  }

  public async findByEmail(email: string): Promise<UserModel | null> {
    const sql = 'SELECT * FROM users WHERE email = ?';
    const row = await this.dbManager.get(sql, [email]);
    
    return row ? this.rowToUserModel(row) : null;
  }

  public async findByUsername(username: string): Promise<UserModel | null> {
    const sql = 'SELECT * FROM users WHERE username = ?';
    const row = await this.dbManager.get(sql, [username]);
    
    return row ? this.rowToUserModel(row) : null;
  }

  public async findByEmailOrUsername(email: string, username: string): Promise<UserModel | null> {
    const sql = 'SELECT * FROM users WHERE email = ? OR username = ?';
    const row = await this.dbManager.get(sql, [email, username]);
    
    return row ? this.rowToUserModel(row) : null;
  }

  public async validatePassword(user: UserModel, password: string): Promise<boolean> {
    return bcrypt.compare(password, user.passwordHash);
  }

  public async updateUser(user: UserModel): Promise<void> {
    const dbRow = user.toDatabaseRow();
    
    const sql = `
      UPDATE users SET
        email = ?, username = ?, is_active = ?, total_submissions = ?,
        approved_submissions = ?, permissions = ?, updated_at = ?
      WHERE id = ?
    `;

    const params = [
      dbRow.email,
      dbRow.username,
      dbRow.is_active ?? null,
      dbRow.total_submissions ?? null,
      dbRow.approved_submissions ?? null,
      dbRow.permissions ? JSON.stringify(dbRow.permissions) : null,
      dbRow.updated_at.toISOString(),
      dbRow.id
    ];

    await this.dbManager.run(sql, params);
  }

  public async findUsers(filters: UserFilters = {}, limit = 50, offset = 0): Promise<UserModel[]> {
    let sql = 'SELECT * FROM users WHERE 1=1';
    const params: any[] = [];

    if (filters.role) {
      sql += ' AND role = ?';
      params.push(filters.role);
    }

    if (filters.isActive !== undefined) {
      sql += ' AND is_active = ?';
      params.push(filters.isActive ? 1 : 0);
    }

    if (filters.searchTerm) {
      sql += ' AND (username LIKE ? OR email LIKE ?)';
      const searchPattern = `%${filters.searchTerm}%`;
      params.push(searchPattern, searchPattern);
    }

    sql += ' ORDER BY created_at DESC LIMIT ? OFFSET ?';
    params.push(limit, offset);

    const rows = await this.dbManager.all(sql, params);
    return rows.map(row => this.rowToUserModel(row));
  }

  public async getUserCount(filters: UserFilters = {}): Promise<number> {
    let sql = 'SELECT COUNT(*) as count FROM users WHERE 1=1';
    const params: any[] = [];

    if (filters.role) {
      sql += ' AND role = ?';
      params.push(filters.role);
    }

    if (filters.isActive !== undefined) {
      sql += ' AND is_active = ?';
      params.push(filters.isActive ? 1 : 0);
    }

    if (filters.searchTerm) {
      sql += ' AND (username LIKE ? OR email LIKE ?)';
      const searchPattern = `%${filters.searchTerm}%`;
      params.push(searchPattern, searchPattern);
    }

    const result = await this.dbManager.get(sql, params);
    return result.count;
  }

  public async deleteUser(id: string): Promise<void> {
    const sql = 'DELETE FROM users WHERE id = ?';
    await this.dbManager.run(sql, [id]);
  }

  private async hashPassword(password: string): Promise<string> {
    const saltRounds = 12;
    return bcrypt.hash(password, saltRounds);
  }

  private rowToUserModel(row: any): UserModel {
    return new UserModel({
      id: row.id,
      email: row.email,
      username: row.username,
      password_hash: row.password_hash,
      role: row.role,
      is_active: row.is_active === 1,
      total_submissions: row.total_submissions,
      approved_submissions: row.approved_submissions,
      permissions: row.permissions ? JSON.parse(row.permissions) : undefined,
      created_at: new Date(row.created_at),
      updated_at: new Date(row.updated_at)
    });
  }
}