/**
 * SimpleTikTokManager - Simplified TikTok data fetching
 * Gets basic video info without requiring OAuth from each user
 */

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

  private constructor() {}

  public static getInstance(): SimpleTikTokManager {
    if (!SimpleTikTokManager.instance) {
      SimpleTikTokManager.instance = new SimpleTikTokManager();
    }
    return SimpleTikTokManager.instance;
  }

  /**
   * Extract video ID from TikTok URL
   */
  public extractVideoId(url: string): string | null {
    if (!url) return null;

    // Pattern: https://www.tiktok.com/@username/video/1234567890123456789
    const match = url.match(/tiktok\.com\/@[^\/]+\/video\/(\d+)/);
    return match ? match[1] : null;
  }

  /**
   * Get video info using TikTok's web API (no OAuth required)
   * This uses publicly available endpoints
   */
  public async getVideoInfo(videoId: string): Promise<SimpleTikTokVideo | null> {
    try {
      // Using TikTok's web API endpoint (publicly accessible)
      const response = await fetch(`https://www.tiktok.com/api/item/detail/?itemId=${videoId}`, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
        }
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch video info: ${response.status}`);
      }

      const data = await response.json();
      
      if (!data.itemInfo?.itemStruct) {
        return null;
      }

      const video = data.itemInfo.itemStruct;
      
      return {
        id: video.id,
        title: video.desc || 'Untitled Video',
        description: video.desc || '',
        author: video.author?.uniqueId || 'Unknown',
        viewCount: parseInt(video.stats?.playCount || '0'),
        likeCount: parseInt(video.stats?.diggCount || '0'),
        shareCount: parseInt(video.stats?.shareCount || '0'),
        commentCount: parseInt(video.stats?.commentCount || '0'),
        createTime: video.createTime,
        coverUrl: video.video?.cover || '',
        videoUrl: video.video?.playAddr || ''
      };
    } catch (error) {
      console.error('Error fetching TikTok video info:', error);
      return null;
    }
  }

  /**
   * Get analytics for multiple videos
   */
  public async getMultipleVideoInfo(videoIds: string[]): Promise<SimpleTikTokVideo[]> {
    const results: SimpleTikTokVideo[] = [];
    
    // Process in batches to avoid rate limiting
    for (let i = 0; i < videoIds.length; i += 5) {
      const batch = videoIds.slice(i, i + 5);
      
      const batchPromises = batch.map(async (videoId) => {
        try {
          const info = await this.getVideoInfo(videoId);
          return info;
        } catch (error) {
          console.error(`Failed to get info for video ${videoId}:`, error);
          return null;
        }
      });

      const batchResults = await Promise.all(batchPromises);
      results.push(...batchResults.filter(Boolean) as SimpleTikTokVideo[]);

      // Add delay between batches to be respectful
      if (i + 5 < videoIds.length) {
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
    }

    return results;
  }

  /**
   * Get video info from URL directly
   */
  public async getVideoInfoFromUrl(url: string): Promise<SimpleTikTokVideo | null> {
    const videoId = this.extractVideoId(url);
    if (!videoId) return null;
    
    return this.getVideoInfo(videoId);
  }
}