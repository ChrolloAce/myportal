export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { videoIds } = req.body;

  if (!videoIds || !Array.isArray(videoIds)) {
    return res.status(400).json({ error: 'Video IDs array is required' });
  }

  try {
    // Get access token using client credentials
    const tokenResponse = await fetch('https://open.tiktokapis.com/v2/oauth/token/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        client_key: process.env.TIKTOK_CLIENT_KEY || 'sbaw6qi55kaqklt0d5',
        client_secret: process.env.TIKTOK_CLIENT_SECRET || 'LP9VknaI4xzc4LwIpkdyY8lBYAI4aMhJ',
        grant_type: 'client_credentials',
      }),
    });

    if (!tokenResponse.ok) {
      throw new Error(`Token request failed: ${tokenResponse.status}`);
    }

    const tokenData = await tokenResponse.json();
    const accessToken = tokenData.access_token;

    // Get video data for multiple videos
    const videoResponse = await fetch('https://open.tiktokapis.com/v2/research/video/query/', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        filters: {
          video_id: videoIds,
        },
        fields: [
          'id',
          'title',
          'video_description',
          'create_time',
          'username',
          'view_count',
          'like_count',
          'comment_count',
          'share_count',
        ],
        max_count: videoIds.length,
      }),
    });

    if (!videoResponse.ok) {
      throw new Error(`Video request failed: ${videoResponse.status}`);
    }

    const videoData = await videoResponse.json();
    
    const videos = (videoData.data?.videos || []).map((video: any) => ({
      id: video.id,
      title: video.title || 'TikTok Video',
      description: video.video_description || '',
      author: video.username || 'unknown',
      viewCount: video.view_count || 0,
      likeCount: video.like_count || 0,
      shareCount: video.share_count || 0,
      commentCount: video.comment_count || 0,
      createTime: video.create_time || Date.now(),
      coverUrl: '',
      videoUrl: `https://www.tiktok.com/@${video.username}/video/${video.id}`,
    }));

    res.status(200).json({ videos });
  } catch (error) {
    console.error('TikTok API error:', error);
    res.status(500).json({ 
      error: 'Failed to fetch video data',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}