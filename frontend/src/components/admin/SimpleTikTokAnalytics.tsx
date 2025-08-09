/**
 * SimpleTikTokAnalytics - Simple TikTok analytics without OAuth complexity
 * Gets video data directly from TikTok web API for any public video
 */

import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { professionalTheme } from '../../styles/professionalTheme';
import { Card, Button } from '../../styles/ProfessionalStyles';
import { SimpleTikTokManager, SimpleTikTokVideo } from '../../managers/SimpleTikTokManager';
import { VideoSubmission, Platform } from '../../types';
import { 
  formatTikTokMetric, 
  getRelativeTime,
  calculateEngagementRate,
  getPerformanceCategory
} from '../../utils/tiktokUtils';
import { 
  Play,
  Eye,
  Heart,
  MessageCircle,
  Share2,
  TrendingUp,
  Award,
  ExternalLink,
  RefreshCw,
  AlertCircle,
  BarChart3,
  CheckCircle
} from 'lucide-react';

interface SimpleTikTokAnalyticsProps {
  submissions: VideoSubmission[];
}

const AnalyticsContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${professionalTheme.spacing[6]};
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: ${professionalTheme.spacing[6]};
`;

const Title = styled.h2`
  font-size: ${professionalTheme.typography.fontSize['2xl']};
  font-weight: ${professionalTheme.typography.fontWeight.bold};
  color: ${professionalTheme.colors.gray[900]};
  margin: 0;
  display: flex;
  align-items: center;
  gap: ${professionalTheme.spacing[2]};
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: ${professionalTheme.spacing[4]};
  margin-bottom: ${professionalTheme.spacing[6]};
`;

const StatCard = styled(Card)`
  padding: ${professionalTheme.spacing[4]};
  text-align: center;
  border-left: 4px solid ${professionalTheme.colors.primary[500]};
`;

const StatValue = styled.div`
  font-size: ${professionalTheme.typography.fontSize['2xl']};
  font-weight: ${professionalTheme.typography.fontWeight.bold};
  color: ${professionalTheme.colors.gray[900]};
  margin-bottom: ${professionalTheme.spacing[1]};
`;

const StatLabel = styled.div`
  font-size: ${professionalTheme.typography.fontSize.sm};
  color: ${professionalTheme.colors.gray[600]};
`;

const VideoGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: ${professionalTheme.spacing[4]};
`;

const VideoCard = styled(Card)<{ performance: 'viral' | 'high' | 'medium' | 'low' }>`
  padding: ${professionalTheme.spacing[4]};
  transition: all 0.2s ease;
  position: relative;
  border-left: 4px solid ${props => {
    switch (props.performance) {
      case 'viral': return professionalTheme.colors.brand.purple;
      case 'high': return professionalTheme.colors.success[500];
      case 'medium': return professionalTheme.colors.warning[500];
      case 'low': return professionalTheme.colors.gray[400];
      default: return professionalTheme.colors.gray[400];
    }
  }};
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: ${professionalTheme.shadows.lg};
  }
`;

const VideoHeader = styled.div`
  display: flex;
  align-items: flex-start;
  gap: ${professionalTheme.spacing[3]};
  margin-bottom: ${professionalTheme.spacing[4]};
`;

const VideoThumbnail = styled.div`
  width: 60px;
  height: 60px;
  border-radius: ${professionalTheme.borderRadius.lg};
  background: ${professionalTheme.colors.gray[100]};
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  overflow: hidden;
`;

const ThumbnailImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

const PlayIcon = styled.div`
  position: absolute;
  width: 24px;
  height: 24px;
  background: rgba(0, 0, 0, 0.7);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
`;

const VideoInfo = styled.div`
  flex: 1;
`;

const VideoTitle = styled.h3`
  font-size: ${professionalTheme.typography.fontSize.base};
  font-weight: ${professionalTheme.typography.fontWeight.semibold};
  color: ${professionalTheme.colors.gray[900]};
  margin: 0 0 ${professionalTheme.spacing[1]} 0;
  line-height: ${professionalTheme.typography.lineHeight.tight};
`;

const VideoMeta = styled.div`
  font-size: ${professionalTheme.typography.fontSize.xs};
  color: ${professionalTheme.colors.gray[600]};
  display: flex;
  align-items: center;
  gap: ${professionalTheme.spacing[2]};
  flex-wrap: wrap;
`;

const PerformanceBadge = styled.div<{ performance: 'viral' | 'high' | 'medium' | 'low' }>`
  display: inline-flex;
  align-items: center;
  gap: ${professionalTheme.spacing[1]};
  padding: ${professionalTheme.spacing[1]} ${professionalTheme.spacing[2]};
  border-radius: ${professionalTheme.borderRadius.full};
  font-size: ${professionalTheme.typography.fontSize.xs};
  font-weight: ${professionalTheme.typography.fontWeight.medium};
  
  ${props => {
    switch (props.performance) {
      case 'viral':
        return `
          background: ${professionalTheme.colors.primary[100]};
          color: ${professionalTheme.colors.brand.purple};
        `;
      case 'high':
        return `
          background: ${professionalTheme.colors.success[100]};
          color: ${professionalTheme.colors.success[700]};
        `;
      case 'medium':
        return `
          background: ${professionalTheme.colors.warning[100]};
          color: ${professionalTheme.colors.warning[700]};
        `;
      case 'low':
        return `
          background: ${professionalTheme.colors.gray[100]};
          color: ${professionalTheme.colors.gray[700]};
        `;
    }
  }}
`;

const MetricsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: ${professionalTheme.spacing[3]};
  margin-top: ${professionalTheme.spacing[3]};
`;

const MetricItem = styled.div`
  display: flex;
  align-items: center;
  gap: ${professionalTheme.spacing[2]};
`;

const MetricIcon = styled.div`
  width: 16px;
  height: 16px;
  color: ${professionalTheme.colors.gray[500]};
`;

const MetricValue = styled.span`
  font-size: ${professionalTheme.typography.fontSize.sm};
  font-weight: ${professionalTheme.typography.fontWeight.medium};
  color: ${professionalTheme.colors.gray[900]};
`;

const ActionButtons = styled.div`
  display: flex;
  gap: ${professionalTheme.spacing[2]};
  margin-top: ${professionalTheme.spacing[4]};
`;

const SmallButton = styled(Button)`
  padding: ${professionalTheme.spacing[1]} ${professionalTheme.spacing[3]};
  font-size: ${professionalTheme.typography.fontSize.xs};
`;

const SuccessMessage = styled.div`
  display: flex;
  align-items: center;
  gap: ${professionalTheme.spacing[2]};
  padding: ${professionalTheme.spacing[4]};
  background: ${professionalTheme.colors.success[50]};
  border: 1px solid ${professionalTheme.colors.success[200]};
  border-radius: ${professionalTheme.borderRadius.lg};
  color: ${professionalTheme.colors.success[700]};
  margin-bottom: ${professionalTheme.spacing[4]};
`;

const EmptyState = styled.div`
  text-align: center;
  padding: ${professionalTheme.spacing[8]};
  color: ${professionalTheme.colors.gray[600]};
`;

export const SimpleTikTokAnalytics: React.FC<SimpleTikTokAnalyticsProps> = ({
  submissions
}) => {
  const [analytics, setAnalytics] = useState<SimpleTikTokVideo[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const tiktokManager = SimpleTikTokManager.getInstance();

  useEffect(() => {
    loadAnalytics();
  }, [submissions]);

  const loadAnalytics = async () => {
    setLoading(true);
    setError(null);

    try {
      // Filter for approved TikTok submissions
      const tiktokSubmissions = submissions.filter(
        s => s.platform === Platform.TIKTOK && s.status === 'approved'
      );

      if (tiktokSubmissions.length === 0) {
        setAnalytics([]);
        return;
      }

      // Extract video IDs from URLs
      const videoIds: string[] = [];
      for (const submission of tiktokSubmissions) {
        const videoId = tiktokManager.extractVideoId(submission.videoUrl);
        if (videoId) {
          videoIds.push(videoId);
        }
      }

      if (videoIds.length === 0) {
        setError('No valid TikTok video IDs found in submissions');
        return;
      }

      // Fetch analytics data
      const analyticsData = await tiktokManager.getMultipleVideoInfo(videoIds);
      setAnalytics(analyticsData);
    } catch (err) {
      console.error('Failed to load TikTok analytics:', err);
      setError(err instanceof Error ? err.message : 'Failed to load analytics');
    } finally {
      setLoading(false);
    }
  };

  const tiktokSubmissions = submissions.filter(s => s.platform === Platform.TIKTOK && s.status === 'approved');

  if (!tiktokSubmissions.length) {
    return (
      <AnalyticsContainer>
        <EmptyState>
          <BarChart3 size={48} style={{ marginBottom: professionalTheme.spacing[4], color: professionalTheme.colors.gray[400] }} />
          <p>No approved TikTok submissions found</p>
        </EmptyState>
      </AnalyticsContainer>
    );
  }

  // Calculate summary stats
  const totalViews = analytics.reduce((sum, video) => sum + video.viewCount, 0);
  const totalLikes = analytics.reduce((sum, video) => sum + video.likeCount, 0);
  const viralVideos = analytics.filter(video => video.viewCount >= 100000).length;

  const averageEngagement = analytics.length > 0 
    ? analytics.reduce((sum, video) => {
        return sum + calculateEngagementRate(
          video.likeCount,
          video.commentCount,
          video.shareCount,
          video.viewCount
        );
      }, 0) / analytics.length
    : 0;

  return (
    <AnalyticsContainer>
      <Header>
        <Title>
          <BarChart3 size={24} />
          TikTok Analytics
        </Title>
        <Button 
          variant="secondary" 
          size="sm" 
          onClick={loadAnalytics}
          disabled={loading}
        >
          <RefreshCw size={14} />
          {loading ? 'Loading...' : 'Refresh'}
        </Button>
      </Header>

      <SuccessMessage>
        <CheckCircle size={20} />
        <span>✨ No OAuth required! Getting analytics directly from TikTok web API.</span>
      </SuccessMessage>

      {analytics.length > 0 && (
        <StatsGrid>
          <StatCard>
            <StatValue>{formatTikTokMetric(totalViews)}</StatValue>
            <StatLabel>Total Views</StatLabel>
          </StatCard>
          <StatCard>
            <StatValue>{formatTikTokMetric(totalLikes)}</StatValue>
            <StatLabel>Total Likes</StatLabel>
          </StatCard>
          <StatCard>
            <StatValue>{averageEngagement.toFixed(1)}%</StatValue>
            <StatLabel>Avg Engagement</StatLabel>
          </StatCard>
          <StatCard>
            <StatValue>{viralVideos}</StatValue>
            <StatLabel>Viral Videos</StatLabel>
          </StatCard>
        </StatsGrid>
      )}

      {error && (
        <div style={{
          padding: professionalTheme.spacing[4],
          background: professionalTheme.colors.warning[50],
          border: `1px solid ${professionalTheme.colors.warning[200]}`,
          borderRadius: professionalTheme.borderRadius.lg,
          color: professionalTheme.colors.warning[700],
          display: 'flex',
          alignItems: 'center',
          gap: professionalTheme.spacing[2]
        }}>
          <AlertCircle size={20} />
          <span>{error}</span>
        </div>
      )}

      {analytics.length > 0 && (
        <VideoGrid>
          {analytics.map((video) => {
            const performance = getPerformanceCategory(
              video.viewCount,
              video.likeCount,
              video.shareCount
            );
            
            return (
              <VideoCard key={video.id} performance={performance}>
                <VideoHeader>
                  <VideoThumbnail>
                    {video.coverUrl ? (
                      <ThumbnailImage src={video.coverUrl} alt={video.title} />
                    ) : (
                      <Play size={24} color={professionalTheme.colors.gray[400]} />
                    )}
                    <PlayIcon>
                      <Play size={12} />
                    </PlayIcon>
                  </VideoThumbnail>
                  <VideoInfo>
                    <VideoTitle>{video.title}</VideoTitle>
                    <VideoMeta>
                      <span>@{video.author}</span>
                      <span>•</span>
                      {video.createTime && (
                        <>
                          {getRelativeTime(new Date(video.createTime * 1000))}
                          <span>•</span>
                        </>
                      )}
                      <PerformanceBadge performance={performance}>
                        {performance === 'viral' && <Award size={12} />}
                        {performance === 'high' && <TrendingUp size={12} />}
                        {performance.charAt(0).toUpperCase() + performance.slice(1)}
                      </PerformanceBadge>
                    </VideoMeta>
                  </VideoInfo>
                </VideoHeader>

                <MetricsGrid>
                  <MetricItem>
                    <MetricIcon><Eye size={16} /></MetricIcon>
                    <MetricValue>{formatTikTokMetric(video.viewCount)}</MetricValue>
                  </MetricItem>
                  <MetricItem>
                    <MetricIcon><Heart size={16} /></MetricIcon>
                    <MetricValue>{formatTikTokMetric(video.likeCount)}</MetricValue>
                  </MetricItem>
                  <MetricItem>
                    <MetricIcon><MessageCircle size={16} /></MetricIcon>
                    <MetricValue>{formatTikTokMetric(video.commentCount)}</MetricValue>
                  </MetricItem>
                  <MetricItem>
                    <MetricIcon><Share2 size={16} /></MetricIcon>
                    <MetricValue>{formatTikTokMetric(video.shareCount)}</MetricValue>
                  </MetricItem>
                </MetricsGrid>

                <ActionButtons>
                  <SmallButton
                    variant="secondary"
                    size="sm"
                    onClick={() => window.open(`https://www.tiktok.com/@${video.author}/video/${video.id}`, '_blank')}
                  >
                    <ExternalLink size={12} />
                    View
                  </SmallButton>
                </ActionButtons>
              </VideoCard>
            );
          })}
        </VideoGrid>
      )}
    </AnalyticsContainer>
  );
};