/**
 * TikTok Utilities - Helper functions for TikTok URL parsing and validation
 */

/**
 * Extract TikTok video ID from various URL formats
 */
export function extractTikTokVideoId(url: string): string | null {
  if (!url || typeof url !== 'string') return null;

  // Remove any query parameters and fragments
  const cleanUrl = url.split('?')[0].split('#')[0];
  
  // Pattern 1: https://www.tiktok.com/@username/video/1234567890123456789
  const longFormMatch = cleanUrl.match(/tiktok\.com\/@[^\/]+\/video\/(\d+)/);
  if (longFormMatch) {
    return longFormMatch[1];
  }

  // Pattern 2: https://vm.tiktok.com/ZM8KqQqQq/ (short URLs)
  const shortUrlMatch = cleanUrl.match(/vm\.tiktok\.com\/([A-Za-z0-9]+)/);
  if (shortUrlMatch) {
    // Note: Short URLs need to be resolved to get the actual video ID
    // This would require a backend service to resolve redirects
    return null;
  }

  // Pattern 3: https://m.tiktok.com/v/1234567890123456789.html
  const mobileMatch = cleanUrl.match(/m\.tiktok\.com\/v\/(\d+)/);
  if (mobileMatch) {
    return mobileMatch[1];
  }

  // Pattern 4: Direct video ID (if someone just pastes the ID)
  const directIdMatch = cleanUrl.match(/^(\d{19})$/);
  if (directIdMatch) {
    return directIdMatch[1];
  }

  return null;
}

/**
 * Validate if a URL is a valid TikTok URL
 */
export function isValidTikTokUrl(url: string): boolean {
  if (!url || typeof url !== 'string') return false;
  
  const lowerUrl = url.toLowerCase();
  return (
    lowerUrl.includes('tiktok.com') || 
    lowerUrl.includes('vm.tiktok.com') ||
    lowerUrl.includes('m.tiktok.com')
  );
}

/**
 * Format TikTok video metrics for display
 */
export function formatTikTokMetric(value: number): string {
  if (value >= 1000000) {
    return `${(value / 1000000).toFixed(1)}M`;
  } else if (value >= 1000) {
    return `${(value / 1000).toFixed(1)}K`;
  }
  return value.toString();
}

/**
 * Format duration in seconds to MM:SS format
 */
export function formatDuration(seconds: number): string {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
}

/**
 * Calculate engagement rate for TikTok video
 */
export function calculateEngagementRate(
  likes: number,
  comments: number,
  shares: number,
  views: number
): number {
  if (views === 0) return 0;
  
  const totalEngagement = likes + comments + shares;
  return (totalEngagement / views) * 100;
}

/**
 * Get relative time string (e.g., "2 days ago")
 */
export function getRelativeTime(date: Date): string {
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
  
  if (diffInSeconds < 60) return 'Just now';
  
  const diffInMinutes = Math.floor(diffInSeconds / 60);
  if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
  
  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) return `${diffInHours}h ago`;
  
  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays < 30) return `${diffInDays}d ago`;
  
  const diffInMonths = Math.floor(diffInDays / 30);
  if (diffInMonths < 12) return `${diffInMonths}mo ago`;
  
  const diffInYears = Math.floor(diffInMonths / 12);
  return `${diffInYears}y ago`;
}

/**
 * Generate TikTok embed iframe HTML
 */
export function generateTikTokEmbed(videoId: string, width = 325, height = 578): string {
  return `<iframe 
    width="${width}" 
    height="${height}" 
    src="https://www.tiktok.com/embed/v2/${videoId}" 
    frameborder="0" 
    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
    allowfullscreen>
  </iframe>`;
}

/**
 * Extract username from TikTok URL
 */
export function extractTikTokUsername(url: string): string | null {
  if (!url || typeof url !== 'string') return null;
  
  const match = url.match(/tiktok\.com\/@([^\/\?#]+)/);
  return match ? match[1] : null;
}

/**
 * Check if TikTok video is likely viral based on metrics
 */
export function isViralVideo(views: number, likes: number, shares: number): boolean {
  // Basic viral thresholds (can be adjusted based on requirements)
  const viralThresholds = {
    views: 100000,    // 100K+ views
    likes: 10000,     // 10K+ likes
    shares: 1000,     // 1K+ shares
    engagementRate: 5 // 5%+ engagement rate
  };
  
  const engagementRate = calculateEngagementRate(likes, 0, shares, views);
  
  return (
    views >= viralThresholds.views &&
    (likes >= viralThresholds.likes || shares >= viralThresholds.shares) &&
    engagementRate >= viralThresholds.engagementRate
  );
}

/**
 * Get performance category for a TikTok video
 */
export function getPerformanceCategory(views: number, likes: number, shares: number): 'viral' | 'high' | 'medium' | 'low' {
  if (isViralVideo(views, likes, shares)) return 'viral';
  
  if (views >= 50000 && likes >= 5000) return 'high';
  if (views >= 10000 && likes >= 1000) return 'medium';
  return 'low';
}

/**
 * Sort TikTok analytics by performance metrics
 */
export function sortByPerformance<T extends { metrics: { views: number; likes: number; shares: number; comments: number } }>(
  analytics: T[],
  sortBy: 'views' | 'likes' | 'shares' | 'engagement' = 'views'
): T[] {
  return [...analytics].sort((a, b) => {
    switch (sortBy) {
      case 'views':
        return b.metrics.views - a.metrics.views;
      case 'likes':
        return b.metrics.likes - a.metrics.likes;
      case 'shares':
        return b.metrics.shares - a.metrics.shares;
      case 'engagement':
        const engagementA = calculateEngagementRate(
          a.metrics.likes,
          a.metrics.comments,
          a.metrics.shares,
          a.metrics.views
        );
        const engagementB = calculateEngagementRate(
          b.metrics.likes,
          b.metrics.comments,
          b.metrics.shares,
          b.metrics.views
        );
        return engagementB - engagementA;
      default:
        return 0;
    }
  });
}