/**
 * User-related type definitions
 * Following single responsibility principle for type organization
 */

export enum UserRole {
  CREATOR = 'creator',
  ADMIN = 'admin'
}

export interface BaseUser {
  id: string;
  email: string;
  username: string;
  role: UserRole;
  createdAt: string;
  updatedAt: string;
}

export interface CreatorUser extends BaseUser {
  role: UserRole.CREATOR;
  isActive: boolean;
  totalSubmissions: number;
  approvedSubmissions: number;
}

export interface AdminUser extends BaseUser {
  role: UserRole.ADMIN;
  permissions: AdminPermission[];
}

export enum AdminPermission {
  MANAGE_SUBMISSIONS = 'manage_submissions',
  MANAGE_CREATORS = 'manage_creators',
  VIEW_ANALYTICS = 'view_analytics'
}

export interface AuthResponse {
  user: BaseUser;
  token: string;
  expiresIn: number;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData extends LoginCredentials {
  username: string;
  role: UserRole;
}