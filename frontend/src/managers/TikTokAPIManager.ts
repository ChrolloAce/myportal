/**
 * TikTokAPIManager - Handles TikTok API integration for video analytics
 * Implements TikTok Query Videos API v2 for fetching video metrics
 */

import { VideoSubmission, Platform } from '../types';

export interface TikTokVideoData {
  id: string;
  title: string;
  create_time: number;
  cover_image_url: string;
  share_url: string;
  video_description: string;
  duration: number;
  height: number;
  width: number;
  embed_html?: string;
  embed_link?: string;
  like_count?: number;
  comment_count?: number;
  share_count?: number;
  view_count?: number;
}

export interface TikTokQueryResponse {
  data: {
    videos: TikTokVideoData[];
  };
  error: {
    code: number;
    message: string;
  };
}

export interface TikTokVideoAnalytics {
  videoId: string;
  submissionId: string;
  title: string;
  description: string;
  duration: number;
  createdAt: Date;
  coverImageUrl: string;
  shareUrl: string;
  embedLink?: string;
  metrics: {
    views: number;
    likes: number;
    comments: number;
    shares: number;
  };
  lastUpdated: Date;
}

export interface TikTokAPIConfig {
  accessToken: string;
  apiBaseUrl?: string;
}

export class TikTokAPIManager {
  private static instance: TikTokAPIManager;
  private config: TikTokAPIConfig | null = null;
  private readonly API_BASE_URL = 'https://open-api.tiktok.com';

  private constructor() {}

  public static getInstance(): TikTokAPIManager {
    if (!TikTokAPIManager.instance) {
      TikTokAPIManager.instance = new TikTokAPIManager();
    }
    return TikTokAPIManager.instance;
  }

  /**
   * Configure the TikTok API manager with access token
   */
  public configure(config: TikTokAPIConfig): void {
    this.config = {
      ...config,
      apiBaseUrl: config.apiBaseUrl || this.API_BASE_URL
    };
  }

  /**
   * Extract TikTok video ID from various TikTok URL formats
   */
  public extractVideoId(url: string): string | null {
    if (!url || typeof url !== 'string') return null;

    // Remove any query parameters and fragments
    const cleanUrl = url.split('?')[0].split('#')[0];
    
    // Pattern 1: https://www.tiktok.com/@username/video/1234567890123456789
    const longFormMatch = cleanUrl.match(/tiktok\.com\/@[^\/]+\/video\/(\d+)/);
    if (longFormMatch) {
      return longFormMatch[1];
    }

    // Pattern 2: https://vm.tiktok.com/ZM8KqQqQq/ (short URLs - need to resolve)
    const shortUrlMatch = cleanUrl.match(/vm\.tiktok\.com\/([A-Za-z0-9]+)/);
    if (shortUrlMatch) {
      // For short URLs, we'd need to resolve them first
      // This is a placeholder - in production you'd resolve the redirect
      console.warn('Short TikTok URLs need to be resolved first:', url);
      return null;
    }

    // Pattern 3: https://m.tiktok.com/v/1234567890123456789.html
    const mobileMatch = cleanUrl.match(/m\.tiktok\.com\/v\/(\d+)/);
    if (mobileMatch) {
      return mobileMatch[1];
    }

    return null;
  }

  /**
   * Query TikTok videos by their IDs to get analytics data
   */
  public async queryVideos(
    videoIds: string[],
    fields?: string[]
  ): Promise<TikTokVideoData[]> {
    if (!this.config) {
      throw new Error('TikTok API not configured. Call configure() first.');
    }

    if (!videoIds.length) {
      return [];
    }

    if (videoIds.length > 20) {
      throw new Error('Cannot query more than 20 videos at once');
    }

    const defaultFields = [
      'id',
      'title',
      'create_time',
      'cover_image_url',
      'share_url',
      'video_description',
      'duration',
      'height',
      'width',
      'embed_link',
      'like_count',
      'comment_count',
      'share_count',
      'view_count'
    ];

    const requestBody = {
      access_token: this.config.accessToken,
      filters: {
        video_ids: videoIds
      },
      fields: fields || defaultFields
    };

    try {
      const response = await fetch(`${this.config.apiBaseUrl}/video/query/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(requestBody)
      });

      if (!response.ok) {
        throw new Error(`TikTok API request failed: ${response.status} ${response.statusText}`);
      }

      const data: TikTokQueryResponse = await response.json();

      if (data.error.code !== 0) {
        throw new Error(`TikTok API error: ${data.error.message} (Code: ${data.error.code})`);
      }

      return data.data.videos;
    } catch (error) {
      console.error('TikTok API query failed:', error);
      throw error;
    }
  }

  /**
   * Get analytics for approved TikTok submissions
   */
  public async getSubmissionAnalytics(
    submissions: VideoSubmission[]
  ): Promise<TikTokVideoAnalytics[]> {
    // Filter for approved TikTok submissions
    const tiktokSubmissions = submissions.filter(
      submission => 
        submission.platform === Platform.TIKTOK && 
        submission.status === 'approved'
    );

    if (!tiktokSubmissions.length) {
      return [];
    }

    // Extract video IDs from URLs
    const videoIdMap = new Map<string, VideoSubmission>();
    const videoIds: string[] = [];

    for (const submission of tiktokSubmissions) {
      const videoId = this.extractVideoId(submission.videoUrl);
      if (videoId) {
        videoIds.push(videoId);
        videoIdMap.set(videoId, submission);
      }
    }

    if (!videoIds.length) {
      console.warn('No valid TikTok video IDs found in submissions');
      return [];
    }

    try {
      // Query TikTok API for video data
      const videoData = await this.queryVideos(videoIds);

      // Transform to analytics format
      const analytics: TikTokVideoAnalytics[] = videoData.map(video => {
        const submission = videoIdMap.get(video.id)!;
        
        return {
          videoId: video.id,
          submissionId: submission.id,
          title: video.title || submission.caption || 'Untitled Video',
          description: video.video_description || submission.caption || '',
          duration: video.duration,
          createdAt: new Date(video.create_time * 1000),
          coverImageUrl: video.cover_image_url,
          shareUrl: video.share_url,
          embedLink: video.embed_link,
          metrics: {
            views: video.view_count || 0,
            likes: video.like_count || 0,
            comments: video.comment_count || 0,
            shares: video.share_count || 0
          },
          lastUpdated: new Date()
        };
      });

      return analytics;
    } catch (error) {
      console.error('Failed to get TikTok analytics:', error);
      throw error;
    }
  }

  /**
   * Batch process submissions to get analytics in chunks
   */
  public async getBatchAnalytics(
    submissions: VideoSubmission[],
    chunkSize: number = 20
  ): Promise<TikTokVideoAnalytics[]> {
    const tiktokSubmissions = submissions.filter(
      submission => 
        submission.platform === Platform.TIKTOK && 
        submission.status === 'approved'
    );

    const results: TikTokVideoAnalytics[] = [];
    
    // Process in chunks of 20 (TikTok API limit)
    for (let i = 0; i < tiktokSubmissions.length; i += chunkSize) {
      const chunk = tiktokSubmissions.slice(i, i + chunkSize);
      try {
        const chunkAnalytics = await this.getSubmissionAnalytics(chunk);
        results.push(...chunkAnalytics);
      } catch (error) {
        console.error(`Failed to process chunk ${i / chunkSize + 1}:`, error);
        // Continue with other chunks even if one fails
      }
    }

    return results;
  }

  /**
   * Check if the API is configured and ready to use
   */
  public isConfigured(): boolean {
    return this.config !== null && !!this.config.accessToken;
  }

  /**
   * Get configuration status for debugging
   */
  public getStatus(): { configured: boolean; hasToken: boolean } {
    return {
      configured: this.config !== null,
      hasToken: !!(this.config?.accessToken)
    };
  }
}