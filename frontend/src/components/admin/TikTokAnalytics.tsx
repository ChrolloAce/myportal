/**
 * TikTokAnalytics - Component for displaying TikTok video analytics
 * Shows performance metrics for approved TikTok submissions
 */

import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { professionalTheme } from '../../styles/professionalTheme';
import { Card, Button } from '../../styles/ProfessionalStyles';
import { TikTokAPIManager, TikTokVideoAnalytics } from '../../managers/TikTokAPIManager';
import { VideoSubmission, AnalyticsStats, Platform } from '../../types';
import { 
  formatTikTokMetric, 
  formatDuration, 
  getRelativeTime,
  calculateEngagementRate,
  getPerformanceCategory,
  sortByPerformance
} from '../../utils/tiktokUtils';
import { 
  Play,
  Eye,
  Heart,
  MessageCircle,
  Share2,
  TrendingUp,
  Award,
  Clock,
  ExternalLink,
  RefreshCw,
  AlertCircle,
  BarChart3
} from 'lucide-react';

interface TikTokAnalyticsProps {
  submissions: VideoSubmission[];
  accessToken?: string;
}

const AnalyticsContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${professionalTheme.spacing[6]};
`;

const Header = styled.div`
  display: flex;
  justify-content: between;
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
      case 'viral': return professionalTheme.colors.purple[500];
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
          background: ${professionalTheme.colors.purple[100]};
          color: ${professionalTheme.colors.purple[700]};
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

const ErrorMessage = styled.div`
  display: flex;
  align-items: center;
  gap: ${professionalTheme.spacing[2]};
  padding: ${professionalTheme.spacing[4]};
  background: ${professionalTheme.colors.error[50]};
  border: 1px solid ${professionalTheme.colors.error[200]};
  border-radius: ${professionalTheme.borderRadius.lg};
  color: ${professionalTheme.colors.error[700]};
`;

const EmptyState = styled.div`
  text-align: center;
  padding: ${professionalTheme.spacing[8]};
  color: ${professionalTheme.colors.gray[600]};
`;

export const TikTokAnalytics: React.FC<TikTokAnalyticsProps> = ({
  submissions,
  accessToken
}) => {
  const [analytics, setAnalytics] = useState<TikTokVideoAnalytics[]>([]);
  const [stats, setStats] = useState<AnalyticsStats | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<'views' | 'likes' | 'shares' | 'engagement'>('views');

  const tiktokManager = TikTokAPIManager.getInstance();

  useEffect(() => {
    if (accessToken) {
      tiktokManager.configure({ accessToken });
      loadAnalytics();
    }
  }, [accessToken, submissions]);

  const loadAnalytics = async () => {
    if (!accessToken) {
      setError('TikTok access token not configured');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const analyticsData = await tiktokManager.getBatchAnalytics(submissions);
      setAnalytics(analyticsData);
      calculateStats(analyticsData);
    } catch (err) {
      console.error('Failed to load TikTok analytics:', err);
      setError(err instanceof Error ? err.message : 'Failed to load analytics');
    } finally {
      setLoading(false);
    }
  };

  const calculateStats = (analyticsData: TikTokVideoAnalytics[]) => {
    if (!analyticsData.length) {
      setStats(null);
      return;
    }

    const totalViews = analyticsData.reduce((sum, video) => sum + video.metrics.views, 0);
    const totalLikes = analyticsData.reduce((sum, video) => sum + video.metrics.likes, 0);
    const totalComments = analyticsData.reduce((sum, video) => sum + video.metrics.comments, 0);
    const totalShares = analyticsData.reduce((sum, video) => sum + video.metrics.shares, 0);
    
    const averageEngagement = analyticsData.reduce((sum, video) => {
      return sum + calculateEngagementRate(
        video.metrics.likes,
        video.metrics.comments,
        video.metrics.shares,
        video.metrics.views
      );
    }, 0) / analyticsData.length;

    const topPerformer = analyticsData.reduce((top, current) => 
      current.metrics.views > top.metrics.views ? current : top
    );

    const viralVideos = analyticsData.filter(video => video.metrics.views >= 100000).length;

    setStats({
      totalViews,
      totalLikes,
      totalComments,
      totalShares,
      averageEngagement,
      topPerformer: {
        videoId: topPerformer.videoId,
        title: topPerformer.title,
        views: topPerformer.metrics.views
      },
      viralVideos
    });
  };

  const sortedAnalytics = sortByPerformance(analytics, sortBy);

  const tiktokSubmissions = submissions.filter(s => s.platform === Platform.TIKTOK && s.status === 'approved');

  if (!accessToken) {
    return (
      <AnalyticsContainer>
        <ErrorMessage>
          <AlertCircle size={20} />
          <span>TikTok API access token is required to display analytics</span>
        </ErrorMessage>
      </AnalyticsContainer>
    );
  }

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

  return (
    <AnalyticsContainer>
      <Header>
        <Title>
          <BarChart3 size={24} />
          TikTok Analytics
        </Title>
        <div style={{ display: 'flex', gap: professionalTheme.spacing[2] }}>
          <Button 
            variant="secondary" 
            size="sm" 
            onClick={loadAnalytics}
            disabled={loading}
          >
            <RefreshCw size={14} />
            {loading ? 'Loading...' : 'Refresh'}
          </Button>
        </div>
      </Header>

      {error && (
        <ErrorMessage>
          <AlertCircle size={20} />
          <span>{error}</span>
        </ErrorMessage>
      )}

      {stats && (
        <StatsGrid>
          <StatCard>
            <StatValue>{formatTikTokMetric(stats.totalViews)}</StatValue>
            <StatLabel>Total Views</StatLabel>
          </StatCard>
          <StatCard>
            <StatValue>{formatTikTokMetric(stats.totalLikes)}</StatValue>
            <StatLabel>Total Likes</StatLabel>
          </StatCard>
          <StatCard>
            <StatValue>{stats.averageEngagement.toFixed(1)}%</StatValue>
            <StatLabel>Avg Engagement</StatLabel>
          </StatCard>
          <StatCard>
            <StatValue>{stats.viralVideos}</StatValue>
            <StatLabel>Viral Videos</StatLabel>
          </StatCard>
        </StatsGrid>
      )}

      {analytics.length > 0 && (
        <>
          <div style={{ display: 'flex', gap: professionalTheme.spacing[2], marginBottom: professionalTheme.spacing[4] }}>
            <span style={{ fontSize: professionalTheme.typography.fontSize.sm, color: professionalTheme.colors.gray[600] }}>
              Sort by:
            </span>
            {(['views', 'likes', 'shares', 'engagement'] as const).map((option) => (
              <Button
                key={option}
                variant={sortBy === option ? 'primary' : 'secondary'}
                size="sm"
                onClick={() => setSortBy(option)}
              >
                {option.charAt(0).toUpperCase() + option.slice(1)}
              </Button>
            ))}
          </div>

          <VideoGrid>
            {sortedAnalytics.map((video) => {
              const performance = getPerformanceCategory(
                video.metrics.views,
                video.metrics.likes,
                video.metrics.shares
              );
              
              return (
                <VideoCard key={video.videoId} performance={performance}>
                  <VideoHeader>
                    <VideoThumbnail>
                      {video.coverImageUrl ? (
                        <ThumbnailImage src={video.coverImageUrl} alt={video.title} />
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
                        <Clock size={12} />
                        {formatDuration(video.duration)}
                        <span>•</span>
                        {getRelativeTime(video.createdAt)}
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
                      <MetricValue>{formatTikTokMetric(video.metrics.views)}</MetricValue>
                    </MetricItem>
                    <MetricItem>
                      <MetricIcon><Heart size={16} /></MetricIcon>
                      <MetricValue>{formatTikTokMetric(video.metrics.likes)}</MetricValue>
                    </MetricItem>
                    <MetricItem>
                      <MetricIcon><MessageCircle size={16} /></MetricIcon>
                      <MetricValue>{formatTikTokMetric(video.metrics.comments)}</MetricValue>
                    </MetricItem>
                    <MetricItem>
                      <MetricIcon><Share2 size={16} /></MetricIcon>
                      <MetricValue>{formatTikTokMetric(video.metrics.shares)}</MetricValue>
                    </MetricItem>
                  </MetricsGrid>

                  <ActionButtons>
                    <SmallButton
                      variant="secondary"
                      size="sm"
                      onClick={() => window.open(video.shareUrl, '_blank')}
                    >
                      <ExternalLink size={12} />
                      View
                    </SmallButton>
                    {video.embedLink && (
                      <SmallButton
                        variant="secondary"
                        size="sm"
                        onClick={() => window.open(video.embedLink, '_blank')}
                      >
                        Embed
                      </SmallButton>
                    )}
                  </ActionButtons>
                </VideoCard>
              );
            })}
          </VideoGrid>
        </>
      )}
    </AnalyticsContainer>
  );
};