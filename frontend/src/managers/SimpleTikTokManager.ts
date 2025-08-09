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
      console.log('🎵 Fetching TikTok data via backend API for video:', videoId);
      
      // Use backend API to avoid CORS issues
      const backendUrl = window.location.hostname === 'localhost' 
        ? 'http://localhost:3001' 
        : 'https://your-backend-domain.com'; // Update this for production
      
      const response = await fetch(`${backendUrl}/api/tiktok/video/${videoId}`, {
        headers: {
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error(`Backend API failed: ${response.status}`);
      }

      const videoData = await response.json();
      
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
      console.warn('⚠️ Backend API failed, using mock data:', error);
      
      // Fallback to mock data
      return {
        id: videoId,
        title: 'TikTok Video (Sandbox Mode)',
        description: 'Sample data - Backend API unavailable',
        author: 'sandbox_user',
        viewCount: Math.floor(Math.random() * 1000000) + 50000,
        likeCount: Math.floor(Math.random() * 80000) + 5000,
        shareCount: Math.floor(Math.random() * 15000) + 1000,
        commentCount: Math.floor(Math.random() * 8000) + 500,
        createTime: Date.now() - Math.floor(Math.random() * 30) * 24 * 60 * 60 * 1000,
        coverUrl: '',
        videoUrl: `https://www.tiktok.com/@user/video/${videoId}`
      };
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
    console.log('🎵 Fetching multiple TikTok videos via backend API:', videoIds.length);
    
    try {
      // Use backend API to avoid CORS issues
      const backendUrl = window.location.hostname === 'localhost' 
        ? 'http://localhost:3001' 
        : 'https://your-backend-domain.com'; // Update this for production
      
      const response = await fetch(`${backendUrl}/api/tiktok/multiple`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ videoIds })
      });

      if (!response.ok) {
        throw new Error(`Backend API failed: ${response.status}`);
      }

      const data = await response.json();
      
      // Convert to SimpleTikTokVideo format
      return data.videos.map((videoData: any) => ({
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
      console.warn('⚠️ Backend API failed, using mock data:', error);
      
      // Fallback to mock data for all videos
      return videoIds.map(videoId => ({
        id: videoId,
        title: 'TikTok Video (Sandbox Mode)',
        description: 'Sample data - Backend API unavailable',
        author: 'sandbox_user',
        viewCount: Math.floor(Math.random() * 1000000) + 50000,
        likeCount: Math.floor(Math.random() * 80000) + 5000,
        shareCount: Math.floor(Math.random() * 15000) + 1000,
        commentCount: Math.floor(Math.random() * 8000) + 500,
        createTime: Date.now() - Math.floor(Math.random() * 30) * 24 * 60 * 60 * 1000,
        coverUrl: '',
        videoUrl: `https://www.tiktok.com/@user/video/${videoId}`
      }));
    }
  }

  /**
   * Extract video ID from TikTok URL
   */
  public extractVideoId(url: string): string | null {
    return this.tiktokAPI.extractVideoId(url);
  }
}