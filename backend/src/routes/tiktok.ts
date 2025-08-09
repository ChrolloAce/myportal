/**
 * TikTok API Proxy - Bypass CORS by proxying through backend
 */

import { Router, Request, Response } from 'express';
import fetch from 'node-fetch';

const router = Router();

/**
 * GET /api/tiktok/video/:videoId
 * Proxy TikTok API requests to bypass CORS
 */
router.get('/video/:videoId', async (req: Request, res: Response) => {
  try {
    const { videoId } = req.params;
    
    if (!videoId) {
      return res.status(400).json({ error: 'Video ID is required' });
    }

    console.log('🎵 Proxying TikTok request for video:', videoId);

    // Fetch from TikTok API (server-side, no CORS restrictions)
    const response = await fetch(`https://www.tiktok.com/api/item/detail/?itemId=${videoId}`, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
        'Accept': 'application/json, text/plain, */*',
        'Accept-Language': 'en-US,en;q=0.9',
        'Cache-Control': 'no-cache',
        'Pragma': 'no-cache',
        'Referer': 'https://www.tiktok.com/',
        'Sec-Fetch-Dest': 'empty',
        'Sec-Fetch-Mode': 'cors',
        'Sec-Fetch-Site': 'same-origin'
      }
    });

    if (!response.ok) {
      throw new Error(`TikTok API returned ${response.status}`);
    }

    const data = await response.json();

    // Validate response structure
    if (!data.itemInfo?.itemStruct) {
      return res.status(404).json({ 
        error: 'Video not found or invalid response',
        videoId 
      });
    }

    const video = data.itemInfo.itemStruct;

    // Return formatted response
    const formattedResponse = {
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
      videoUrl: video.video?.playAddr || '',
      hashtags: video.textExtra?.filter((item: any) => item.hashtagName)?.map((item: any) => item.hashtagName) || [],
      music: video.music ? {
        title: video.music.title,
        author: video.music.authorName
      } : null
    };

    console.log('✅ Successfully fetched TikTok data:', formattedResponse.title);
    res.json(formattedResponse);

  } catch (error) {
    console.error('❌ Error proxying TikTok request:', error);
    res.status(500).json({ 
      error: 'Failed to fetch TikTok data',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

/**
 * GET /api/tiktok/multiple
 * Fetch multiple TikTok videos at once
 */
router.post('/multiple', async (req: Request, res: Response) => {
  try {
    const { videoIds } = req.body;

    if (!Array.isArray(videoIds) || videoIds.length === 0) {
      return res.status(400).json({ error: 'Video IDs array is required' });
    }

    console.log('🎵 Fetching multiple TikTok videos:', videoIds.length);

    const results = await Promise.allSettled(
      videoIds.map(async (videoId: string) => {
        const response = await fetch(`http://localhost:${process.env.PORT || 3001}/api/tiktok/video/${videoId}`);
        if (!response.ok) throw new Error(`Failed to fetch ${videoId}`);
        return response.json();
      })
    );

    const videos = results
      .filter((result): result is PromiseFulfilledResult<any> => result.status === 'fulfilled')
      .map(result => result.value);

    res.json({ videos, total: videos.length });

  } catch (error) {
    console.error('❌ Error fetching multiple TikTok videos:', error);
    res.status(500).json({ 
      error: 'Failed to fetch multiple TikTok videos',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

export default router;