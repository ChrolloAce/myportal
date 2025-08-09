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
  // TikTok-specific fields
  tiktokVideoId?: string;
  tiktokAnalytics?: TikTokVideoMetrics;
  // Admin upload fields
  isAdminUpload?: boolean;
  assignedByAdmin?: boolean;
}

export interface SubmissionFormData {
  tiktokUrl?: string;
  instagramUrl?: string;
  caption?: string;
  hashtags?: string;
  notes?: string;
  corporationId?: string;
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

// TikTok Analytics Types
export interface TikTokVideoMetrics {
  views: number;
  likes: number;
  comments: number;
  shares: number;
  engagementRate: number;
  lastUpdated: string;
}

export interface TikTokVideoData {
  id: string;
  title: string;
  description: string;
  duration: number;
  createdAt: string;
  coverImageUrl: string;
  shareUrl: string;
  embedLink?: string;
  width: number;
  height: number;
  metrics: TikTokVideoMetrics;
}

export interface TikTokAnalyticsResponse {
  videoId: string;
  submissionId: string;
  data: TikTokVideoData;
  error?: string;
}

export interface AnalyticsStats {
  totalViews: number;
  totalLikes: number;
  totalComments: number;
  totalShares: number;
  averageEngagement: number;
  topPerformer: {
    videoId: string;
    title: string;
    views: number;
  } | null;
  viralVideos: number; // Videos with >100K views
}