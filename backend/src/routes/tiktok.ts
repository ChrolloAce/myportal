/**
 * TikTok API Routes - Official TikTok API integration
 */

import { Router, Request, Response } from 'express';
import { TikTokAPIManager } from '../managers/TikTokAPIManager';

const router = Router();

/**
 * GET /api/tiktok/video/:videoId
 * Get TikTok video data using official API
 */
router.get('/video/:videoId', async (req: Request, res: Response): Promise<void> => {
  try {
    const { videoId } = req.params;
    
    if (!videoId) {
      return res.status(400).json({ error: 'Video ID is required' });
    }

    console.log('🎵 Fetching TikTok video via official API:', videoId);

    const tiktokManager = TikTokAPIManager.getInstance();
    const videoData = await tiktokManager.getVideoInfo(videoId);

    if (!videoData) {
      return res.status(404).json({ 
        error: 'Video not found or API request failed',
        videoId 
      });
    }

    console.log('✅ Successfully fetched TikTok data:', videoData.title);
    res.json(videoData);

  } catch (error) {
    console.error('❌ Error fetching TikTok video:', error);
    res.status(500).json({ 
      error: 'Failed to fetch TikTok data',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

/**
 * POST /api/tiktok/multiple
 * Fetch multiple TikTok videos at once using official API
 */
router.post('/multiple', async (req: Request, res: Response): Promise<void> => {
  try {
    const { videoIds } = req.body;

    if (!Array.isArray(videoIds) || videoIds.length === 0) {
      return res.status(400).json({ error: 'Video IDs array is required' });
    }

    console.log('🎵 Fetching multiple TikTok videos via official API:', videoIds.length);

    const tiktokManager = TikTokAPIManager.getInstance();
    const videos = await tiktokManager.getMultipleVideoInfo(videoIds);

    res.json({ videos, total: videos.length });

  } catch (error) {
    console.error('❌ Error fetching multiple TikTok videos:', error);
    res.status(500).json({ 
      error: 'Failed to fetch multiple TikTok videos',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

/**
 * POST /api/tiktok/video-from-url
 * Get TikTok video data from URL (extracts video ID automatically)
 */
router.post('/video-from-url', async (req: Request, res: Response): Promise<void> => {
  try {
    const { url } = req.body;
    
    if (!url) {
      return res.status(400).json({ error: 'TikTok URL is required' });
    }

    console.log('🎵 Extracting video ID from URL:', url);

    const tiktokManager = TikTokAPIManager.getInstance();
    const videoId = tiktokManager.extractVideoId(url);

    if (!videoId) {
      return res.status(400).json({ 
        error: 'Invalid TikTok URL format',
        url 
      });
    }

    const videoData = await tiktokManager.getVideoInfo(videoId);

    if (!videoData) {
      return res.status(404).json({ 
        error: 'Video not found or API request failed',
        videoId,
        url
      });
    }

    console.log('✅ Successfully fetched TikTok data from URL:', videoData.title);
    res.json(videoData);

  } catch (error) {
    console.error('❌ Error fetching TikTok video from URL:', error);
    res.status(500).json({ 
      error: 'Failed to fetch TikTok data from URL',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

export default router;