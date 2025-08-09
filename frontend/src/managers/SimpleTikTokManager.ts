/**
 * SimpleTikTokManager - Frontend TikTok API integration
 * Uses official TikTok API directly from frontend
 */

import { TikTokAPIManager } from './TikTokAPIManager';

export interface SimpleTikTokVideo {
  id: string;
  title: string;
  description: string;
  author: string;
  viewCount: number;
  likeCount: number;
  shareCount: number;
  commentCount: number;
  createTime: number;
  coverUrl: string;
  videoUrl: string;
}

export class SimpleTikTokManager {
  private static instance: SimpleTikTokManager;
  private tiktokAPI: TikTokAPIManager;

  private constructor() {
    this.tiktokAPI = TikTokAPIManager.getInstance();
  }

  public static getInstance(): SimpleTikTokManager {
    if (!SimpleTikTokManager.instance) {
      SimpleTikTokManager.instance = new SimpleTikTokManager();
    }
    return SimpleTikTokManager.instance;
  }

  // extractVideoId method moved to end of class

  /**
   * Get video info using TikTok's web API (no OAuth required)
   * This uses publicly available endpoints
   */
  public async getVideoInfo(videoId: string): Promise<SimpleTikTokVideo | null> {
    try {
      console.log('🎵 Fetching TikTok data via official API for video:', videoId);
      
      const videoData = await this.tiktokAPI.getVideoInfo(videoId);
      
      if (!videoData) {
        return null;
      }

      // Convert to SimpleTikTokVideo format
      return {
        id: videoData.id,
        title: videoData.title,
        description: videoData.description,
        author: videoData.author,
        viewCount: videoData.viewCount,
        likeCount: videoData.likeCount,
        shareCount: videoData.shareCount,
        commentCount: videoData.commentCount,
        createTime: videoData.createTime,
        coverUrl: videoData.coverUrl,
        videoUrl: videoData.videoUrl
      };
    } catch (error) {
      console.error('Error fetching TikTok video info:', error);
      return null;
    }
  }

  /**
   * Get video info directly from TikTok URL
   */
  public async getVideoInfoFromUrl(url: string): Promise<SimpleTikTokVideo | null> {
    try {
      console.log('🎵 Fetching TikTok data from URL via official API:', url);
      
      const videoData = await this.tiktokAPI.getVideoInfoFromUrl(url);
      
      if (!videoData) {
        return null;
      }

      // Convert to SimpleTikTokVideo format
      return {
        id: videoData.id,
        title: videoData.title,
        description: videoData.description,
        author: videoData.author,
        viewCount: videoData.viewCount,
        likeCount: videoData.likeCount,
        shareCount: videoData.shareCount,
        commentCount: videoData.commentCount,
        createTime: videoData.createTime,
        coverUrl: videoData.coverUrl,
        videoUrl: videoData.videoUrl
      };
    } catch (error) {
      console.error('Error fetching TikTok video info from URL:', error);
      return null;
    }
  }

  /**
   * Get analytics for multiple videos
   */
  public async getMultipleVideoInfo(videoIds: string[]): Promise<SimpleTikTokVideo[]> {
    console.log('🎵 Fetching multiple TikTok videos via official API:', videoIds.length);
    
    try {
      const videosData = await this.tiktokAPI.getMultipleVideoInfo(videoIds);
      
      // Convert to SimpleTikTokVideo format
      return videosData.map(videoData => ({
        id: videoData.id,
        title: videoData.title,
        description: videoData.description,
        author: videoData.author,
        viewCount: videoData.viewCount,
        likeCount: videoData.likeCount,
        shareCount: videoData.shareCount,
        commentCount: videoData.commentCount,
        createTime: videoData.createTime,
        coverUrl: videoData.coverUrl,
        videoUrl: videoData.videoUrl
      }));
    } catch (error) {
      console.error('Error fetching multiple TikTok videos:', error);
      return [];
    }
  }

  /**
   * Extract video ID from TikTok URL
   */
  public extractVideoId(url: string): string | null {
    return this.tiktokAPI.extractVideoId(url);
  }
}