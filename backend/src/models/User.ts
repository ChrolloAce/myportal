/**
 * User model - Database schema and business logic for users
 * Following OOP principles with clear separation of concerns
 */

export enum UserRole {
  CREATOR = 'creator',
  ADMIN = 'admin'
}

export interface BaseUser {
  id: string;
  email: string;
  username: string;
  password_hash: string;
  role: UserRole;
  created_at: Date;
  updated_at: Date;
}

export interface CreatorUser extends BaseUser {
  role: UserRole.CREATOR;
  is_active: boolean;
  total_submissions: number;
  approved_submissions: number;
}

export interface AdminUser extends BaseUser {
  role: UserRole.ADMIN;
  permissions: string[];
}

export class UserModel {
  public id: string;
  public email: string;
  public username: string;
  public passwordHash: string;
  public role: UserRole;
  public createdAt: Date;
  public updatedAt: Date;
  
  // Creator-specific fields
  public isActive?: boolean;
  public totalSubmissions?: number;
  public approvedSubmissions?: number;
  
  // Admin-specific fields
  public permissions?: string[];

  constructor(data: Partial<BaseUser & CreatorUser & AdminUser>) {
    this.id = data.id || this.generateId();
    this.email = data.email!;
    this.username = data.username!;
    this.passwordHash = data.password_hash!;
    this.role = data.role!;
    this.createdAt = data.created_at || new Date();
    this.updatedAt = data.updated_at || new Date();
    
    if (this.role === UserRole.CREATOR) {
      this.isActive = data.is_active ?? true;
      this.totalSubmissions = data.total_submissions ?? 0;
      this.approvedSubmissions = data.approved_submissions ?? 0;
    }
    
    if (this.role === UserRole.ADMIN) {
      this.permissions = data.permissions || ['manage_submissions', 'view_analytics'];
    }
  }

  public toJSON(): any {
    const base = {
      id: this.id,
      email: this.email,
      username: this.username,
      role: this.role,
      createdAt: this.createdAt.toISOString(),
      updatedAt: this.updatedAt.toISOString()
    };

    if (this.role === UserRole.CREATOR) {
      return {
        ...base,
        isActive: this.isActive,
        totalSubmissions: this.totalSubmissions,
        approvedSubmissions: this.approvedSubmissions
      };
    }

    if (this.role === UserRole.ADMIN) {
      return {
        ...base,
        permissions: this.permissions
      };
    }

    return base;
  }

  public toDatabaseRow(): BaseUser & Partial<CreatorUser & AdminUser> {
    const base = {
      id: this.id,
      email: this.email,
      username: this.username,
      password_hash: this.passwordHash,
      role: this.role,
      created_at: this.createdAt,
      updated_at: this.updatedAt
    };

    if (this.role === UserRole.CREATOR) {
      return {
        ...base,
        is_active: this.isActive!,
        total_submissions: this.totalSubmissions!,
        approved_submissions: this.approvedSubmissions!
      };
    }

    if (this.role === UserRole.ADMIN) {
      return {
        ...base,
        permissions: this.permissions!
      };
    }

    return base;
  }

  public updateSubmissionCount(approved: boolean = false): void {
    if (this.role === UserRole.CREATOR) {
      this.totalSubmissions = (this.totalSubmissions || 0) + 1;
      if (approved) {
        this.approvedSubmissions = (this.approvedSubmissions || 0) + 1;
      }
      this.updatedAt = new Date();
    }
  }

  public deactivate(): void {
    if (this.role === UserRole.CREATOR) {
      this.isActive = false;
      this.updatedAt = new Date();
    }
  }

  public activate(): void {
    if (this.role === UserRole.CREATOR) {
      this.isActive = true;
      this.updatedAt = new Date();
    }
  }

  private generateId(): string {
    return 'user_' + Date.now().toString(36) + Math.random().toString(36).substr(2);
  }
}