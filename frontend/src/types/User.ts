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
  
  // Social media handles
  socialHandles?: {
    instagram?: string;
    tiktok?: string;
    twitter?: string;
    youtube?: string;
  };
  
  // Profile information
  bio?: string;
  specialties?: string[];
  profilePicture?: string;
  
  // Corporation membership
  corporationId?: string;
  corporationRole?: 'creator' | 'admin';
  joinedCorporationAt?: string;
  
  // Onboarding status
  onboardingCompleted: boolean;
  onboardingSteps: {
    profileSetup: boolean;
    socialHandles: boolean;
    corporationJoin: boolean;
  };
}

export interface AdminUser extends BaseUser {
  role: UserRole.ADMIN;
  permissions: AdminPermission[];
  
  // Corporation ownership/management
  corporationId?: string;
  corporationRole?: 'owner' | 'admin';
  
  // Admin profile
  profilePicture?: string;
  
  // Onboarding status
  onboardingCompleted: boolean;
  onboardingSteps: {
    corporationSetup: boolean;
    profileSetup: boolean;
    inviteSetup: boolean;
  };
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
  role: UserRole;
}

export interface RegisterData extends LoginCredentials {
  username: string;
}

// Onboarding data interfaces
export interface CreatorOnboardingData {
  // Simplified creator onboarding
  name: string;
  instagramHandle?: string;
  tiktokHandle?: string;
  
  // Corporation join (optional)
  inviteCode?: string;
}

export interface AdminOnboardingData {
  // Step 1: Profile Setup
  username: string;
  profilePicture?: string;
  
  // Step 2-4: Corporation setup (will reference Corporation types)
  corporationData?: any; // Will be typed as CorporationOnboarding from Corporation.ts
}

// Utility type for checking onboarding completion
export type OnboardingStep = 'profileSetup' | 'socialHandles' | 'corporationJoin' | 'corporationSetup' | 'inviteSetup';