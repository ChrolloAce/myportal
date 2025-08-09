/**
 * TikTokAPIManager - Official TikTok API integration
 * Uses official TikTok for Developers API with sandbox credentials
 */

import fetch from 'node-fetch';

interface TikTokVideoInfo {
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
  hashtags: string[];
  music?: {
    title: string;
    author: string;
  };
}

interface TikTokAPIResponse {
  data: {
    videos: Array<{
      id: string;
      title: string;
      video_description: string;
      create_time: number;
      cover_image_url: string;
      share_url: string;
      username: string;
      like_count: number;
      comment_count: number;
      share_count: number;
      view_count: number;
    }>;
  };
  error?: {
    code: string;
    message: string;
  };
}

export class TikTokAPIManager {
  private static instance: TikTokAPIManager;
  private clientKey: string;
  private clientSecret: string;
  private accessToken: string | null = null;
  private baseUrl = 'https://open.tiktokapis.com/v2';

  private constructor() {
    this.clientKey = process.env.TIKTOK_CLIENT_KEY || 'sbaw6qi55kaqklt0d5';
    this.clientSecret = process.env.TIKTOK_CLIENT_SECRET || 'LP9VknaI4xzc4LwIpkdyY8lBYAI4aMhJ';
  }

  public static getInstance(): TikTokAPIManager {
    if (!TikTokAPIManager.instance) {
      TikTokAPIManager.instance = new TikTokAPIManager();
    }
    return TikTokAPIManager.instance;
  }

  /**
   * Get client credentials access token (for app-level access)
   */
  private async getClientCredentialsToken(): Promise<string> {
    try {
      const response = await fetch('https://open.tiktokapis.com/v2/oauth/token/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          client_key: this.clientKey,
          client_secret: this.clientSecret,
          grant_type: 'client_credentials'
        })
      });

      const data = await response.json() as any;

      if (!response.ok || data.error) {
        throw new Error(`Token request failed: ${data.error?.message || response.statusText}`);
      }

      this.accessToken = data.access_token;
      console.log('✅ TikTok client credentials token obtained');
      return data.access_token;

    } catch (error) {
      console.error('❌ Failed to get TikTok client credentials token:', error);
      throw error;
    }
  }

  /**
   * Get video information using TikTok video ID
   */
  public async getVideoInfo(videoId: string): Promise<TikTokVideoInfo | null> {
    try {
      console.log('🎵 Fetching TikTok video info via official API:', videoId);

      // Get access token if we don't have one
      if (!this.accessToken) {
        await this.getClientCredentialsToken();
      }

      // Use TikTok's Query Videos endpoint
      const response = await fetch(`${this.baseUrl}/research/video/query/`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          query: {
            video_ids: [videoId]
          },
          fields: [
            'id',
            'title', 
            'video_description',
            'create_time',
            'cover_image_url',
            'share_url',
            'username',
            'like_count',
            'comment_count', 
            'share_count',
            'view_count'
          ]
        })
      });

      const data = await response.json() as TikTokAPIResponse;

      if (!response.ok || data.error) {
        console.error('TikTok API error:', data.error);
        throw new Error(`API request failed: ${data.error?.message || response.statusText}`);
      }

      if (!data.data?.videos || data.data.videos.length === 0) {
        console.warn('No video data found for ID:', videoId);
        return null;
      }

      const video = data.data.videos[0];

      const result: TikTokVideoInfo = {
        id: video.id,
        title: video.title || 'Untitled Video',
        description: video.video_description || '',
        author: video.username || 'Unknown',
        viewCount: video.view_count || 0,
        likeCount: video.like_count || 0,
        shareCount: video.share_count || 0,
        commentCount: video.comment_count || 0,
        createTime: video.create_time || Date.now(),
        coverUrl: video.cover_image_url || '',
        videoUrl: video.share_url || '',
        hashtags: this.extractHashtags(video.video_description || '')
      };

      console.log('✅ Successfully fetched TikTok video data:', result.title);
      return result;

    } catch (error) {
      console.error('❌ Error fetching TikTok video info:', error);
      
      // Return null so the caller can handle the error
      return null;
    }
  }

  /**
   * Get multiple video information
   */
  public async getMultipleVideoInfo(videoIds: string[]): Promise<TikTokVideoInfo[]> {
    try {
      console.log('🎵 Fetching multiple TikTok videos via official API:', videoIds.length);

      if (!this.accessToken) {
        await this.getClientCredentialsToken();
      }

      // TikTok API supports up to 20 video IDs per request
      const batchSize = 20;
      const results: TikTokVideoInfo[] = [];

      for (let i = 0; i < videoIds.length; i += batchSize) {
        const batch = videoIds.slice(i, i + batchSize);
        
        const response = await fetch(`${this.baseUrl}/research/video/query/`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${this.accessToken}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            query: {
              video_ids: batch
            },
            fields: [
              'id',
              'title',
              'video_description', 
              'create_time',
              'cover_image_url',
              'share_url',
              'username',
              'like_count',
              'comment_count',
              'share_count', 
              'view_count'
            ]
          })
        });

        const data = await response.json() as TikTokAPIResponse;

        if (response.ok && data.data?.videos) {
          const batchResults = data.data.videos.map(video => ({
            id: video.id,
            title: video.title || 'Untitled Video',
            description: video.video_description || '',
            author: video.username || 'Unknown', 
            viewCount: video.view_count || 0,
            likeCount: video.like_count || 0,
            shareCount: video.share_count || 0,
            commentCount: video.comment_count || 0,
            createTime: video.create_time || Date.now(),
            coverUrl: video.cover_image_url || '',
            videoUrl: video.share_url || '',
            hashtags: this.extractHashtags(video.video_description || '')
          }));

          results.push(...batchResults);
        } else {
          console.warn('Failed to fetch batch:', data.error);
        }
      }

      console.log(`✅ Successfully fetched ${results.length}/${videoIds.length} TikTok videos`);
      return results;

    } catch (error) {
      console.error('❌ Error fetching multiple TikTok videos:', error);
      return [];
    }
  }

  /**
   * Extract hashtags from video description
   */
  private extractHashtags(description: string): string[] {
    const hashtagRegex = /#[\w\u0590-\u05ff]+/g;
    const hashtags = description.match(hashtagRegex);
    return hashtags ? hashtags.map(tag => tag.substring(1)) : [];
  }

  /**
   * Extract video ID from TikTok URL
   */
  public extractVideoId(url: string): string | null {
    // TikTok URL patterns:
    // https://www.tiktok.com/@username/video/1234567890123456789
    // https://vm.tiktok.com/shortcode/
    // https://m.tiktok.com/v/1234567890123456789.html
    
    const patterns = [
      /tiktok\.com\/@[\w.-]+\/video\/(\d+)/,
      /tiktok\.com\/v\/(\d+)/,
      /vm\.tiktok\.com\/(\w+)/,
      /m\.tiktok\.com\/v\/(\d+)/
    ];

    for (const pattern of patterns) {
      const match = url.match(pattern);
      if (match) {
        return match[1];
      }
    }

    return null;
  }
}