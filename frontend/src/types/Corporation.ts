/**
 * Corporation types for organization management
 * Supports corporation setup, member management, and invite system
 */

export interface Corporation {
  id: string;
  name: string;
  displayName: string;
  description?: string;
  industry?: string;
  website?: string;
  logo?: string;
  
  // Contact information
  email?: string;
  phone?: string;
  address?: string;
  
  // Social media info
  socialMedia?: {
    instagram?: string;
    tiktok?: string;
    twitter?: string;
    linkedin?: string;
  };
  
  // Settings
  settings?: {
    allowPublicJoin: boolean;
    requireApproval: boolean;
    maxCreators?: number;
    emailNotifications?: boolean;
    weeklyReports?: boolean;
  };
  
  // Metadata
  ownerId: string; // Admin who created the corporation
  createdAt: string;
  updatedAt: string;
  memberCount: number;
  activeInvites: number;
}

export interface CorporationMember {
  id: string;
  userId: string;
  corporationId: string;
  role: 'owner' | 'admin' | 'creator';
  joinedAt: string;
  invitedBy?: string;
  status: 'active' | 'pending' | 'suspended';
}

export interface CorporationInvite {
  id: string;
  corporationId: string;
  inviteCode: string;
  inviteLink: string;
  
  // Invite details
  createdBy: string;
  createdAt: string;
  expiresAt: string;
  maxUses?: number;
  currentUses: number;
  
  // Restrictions
  role: 'creator' | 'admin';
  isActive: boolean;
  
  // Optional targeting
  email?: string; // For specific invites
  note?: string;
}

export interface CorporationOnboarding {
  // Step 1: Basic Info
  corporationName: string;
  displayName: string;
  industry: string;
  description: string;
  
  // Step 2: Social Media
  socialMedia: {
    instagram?: string;
    tiktok?: string;
    twitter?: string;
    linkedin?: string;
  };
  
  // Step 3: Settings
  settings: {
    allowPublicJoin: boolean;
    requireApproval: boolean;
    maxCreators?: number;
    emailNotifications?: boolean;
    weeklyReports?: boolean;
  };
  
  // Step 4: First Invite (optional)
  createFirstInvite: boolean;
  firstInviteNote?: string;
}

export interface JoinCorporationData {
  inviteCode: string;
  // Additional creator info collected during join
  creatorInfo: {
    instagramHandle?: string;
    tiktokHandle?: string;
    bio?: string;
    specialties?: string[];
  };
}

// Utility types
export type CorporationRole = 'owner' | 'admin' | 'creator';
export type InviteStatus = 'active' | 'expired' | 'used' | 'cancelled';