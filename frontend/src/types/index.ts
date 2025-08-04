/**
 * Central export point for all type definitions
 * Provides clean imports throughout the application
 */

export * from './User';
export * from './Submission';

// API Response types
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

// Common UI types
export interface SelectOption {
  value: string;
  label: string;
}

export interface LoadingState {
  isLoading: boolean;
  error: string | null;
}