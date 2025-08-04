/**
 * Submission-related type definitions
 * Handles video submission data structures
 */

export enum SubmissionStatus {
  PENDING = 'pending',
  APPROVED = 'approved',
  REJECTED = 'rejected'
}

export enum Platform {
  TIKTOK = 'tiktok',
  INSTAGRAM = 'instagram'
}

export interface VideoSubmission {
  id: string;
  creatorId: string;
  creatorUsername: string;
  videoUrl: string;
  platform: Platform;
  caption?: string;
  hashtags?: string[];
  notes?: string;
  status: SubmissionStatus;
  adminFeedback?: string;
  adminId?: string;
  submittedAt: string;
  reviewedAt?: string;
  updatedAt: string;
}

export interface SubmissionFormData {
  tiktokUrl?: string;
  instagramUrl?: string;
  caption?: string;
  hashtags?: string;
  notes?: string;
}

// Legacy interface for backward compatibility
export interface LegacySubmissionFormData {
  videoUrl: string;
  platform: Platform;
  caption?: string;
  hashtags?: string;
  notes?: string;
}

export interface SubmissionFilters {
  status?: SubmissionStatus;
  platform?: Platform;
  creatorId?: string;
  dateFrom?: string;
  dateTo?: string;
  searchTerm?: string;
}

export interface SubmissionStats {
  total: number;
  pending: number;
  approved: number;
  rejected: number;
  todaySubmissions: number;
  mostActiveCreator: {
    username: string;
    count: number;
  } | null;
}

export interface AdminAction {
  submissionId: string;
  action: 'approve' | 'reject';
  feedback?: string;
}