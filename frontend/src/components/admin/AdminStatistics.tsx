/**
 * AdminStatistics - Detailed analytics and statistics page
 * Charts and metrics for platform performance
 */

import React from 'react';
import styled from 'styled-components';
import { BarChart3, PieChart, TrendingUp, Users, Calendar } from 'lucide-react';
import { theme } from '../../styles/theme';
import { VideoSubmission, SubmissionStats, Platform, SubmissionStatus } from '../../types';

interface AdminStatisticsProps {
  stats: SubmissionStats | null;
  submissions: VideoSubmission[];
}

const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${theme.spacing[6]};
`;

const StatsRow = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: ${theme.spacing[4]};
`;

const StatCard = styled.div`
  background: ${theme.colors.neutral[0]};
  border-radius: ${theme.borderRadius.xl};
  padding: ${theme.spacing[6]};
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
`;

const CardTitle = styled.h3`
  font-size: ${theme.typography.fontSize.lg};
  font-weight: ${theme.typography.fontWeight.semibold};
  color: ${theme.colors.neutral[900]};
  margin-bottom: ${theme.spacing[4]};
  display: flex;
  align-items: center;
  gap: ${theme.spacing[2]};
  
  svg {
    width: 20px;
    height: 20px;
    color: ${theme.colors.primary[500]};
  }
`;

const MetricGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: ${theme.spacing[4]};
`;

const Metric = styled.div`
  text-align: center;
`;

const MetricValue = styled.div`
  font-size: ${theme.typography.fontSize['2xl']};
  font-weight: ${theme.typography.fontWeight.bold};
  color: ${theme.colors.neutral[900]};
  margin-bottom: ${theme.spacing[1]};
`;

const MetricLabel = styled.div`
  font-size: ${theme.typography.fontSize.sm};
  color: ${theme.colors.neutral[600]};
`;

const PlatformBreakdown = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${theme.spacing[3]};
`;

const PlatformItem = styled.div`
  display: flex;
  justify-content: between;
  align-items: center;
  padding: ${theme.spacing[3]};
  border-radius: ${theme.borderRadius.md};
  background: ${theme.colors.neutral[50]};
`;

const PlatformInfo = styled.div`
  display: flex;
  align-items: center;
  gap: ${theme.spacing[2]};
`;

const PlatformIcon = styled.div<{ platform: Platform }>`
  font-size: ${theme.typography.fontSize.lg};
`;

const PlatformName = styled.span`
  font-weight: ${theme.typography.fontWeight.medium};
  color: ${theme.colors.neutral[900]};
`;

const PlatformCount = styled.span`
  font-weight: ${theme.typography.fontWeight.semibold};
  color: ${theme.colors.primary[600]};
`;

const ProgressBar = styled.div`
  width: 100%;
  height: 8px;
  background: ${theme.colors.neutral[200]};
  border-radius: ${theme.borderRadius.full};
  overflow: hidden;
  margin: ${theme.spacing[2]} 0;
`;

const ProgressFill = styled.div<{ percentage: number; color: string }>`
  height: 100%;
  width: ${({ percentage }) => percentage}%;
  background: ${({ color }) => color};
  transition: width ${theme.transitions.slow};
`;

const ChartPlaceholder = styled.div`
  height: 200px;
  background: ${theme.colors.neutral[100]};
  border-radius: ${theme.borderRadius.lg};
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${theme.colors.neutral[500]};
  font-size: ${theme.typography.fontSize.sm};
`;

export const AdminStatistics: React.FC<AdminStatisticsProps> = ({
  stats,
  submissions
}) => {
  const getPlatformStats = () => {
    const tiktokCount = submissions.filter(s => s.platform === Platform.TIKTOK).length;
    const instagramCount = submissions.filter(s => s.platform === Platform.INSTAGRAM).length;
    const total = tiktokCount + instagramCount;
    
    return {
      tiktok: {
        count: tiktokCount,
        percentage: total > 0 ? (tiktokCount / total) * 100 : 0
      },
      instagram: {
        count: instagramCount,
        percentage: total > 0 ? (instagramCount / total) * 100 : 0
      }
    };
  };

  const getStatusStats = () => {
    const pending = submissions.filter(s => s.status === SubmissionStatus.PENDING).length;
    const approved = submissions.filter(s => s.status === SubmissionStatus.APPROVED).length;
    const rejected = submissions.filter(s => s.status === SubmissionStatus.REJECTED).length;
    const total = pending + approved + rejected;
    
    return {
      pending: { count: pending, percentage: total > 0 ? (pending / total) * 100 : 0 },
      approved: { count: approved, percentage: total > 0 ? (approved / total) * 100 : 0 },
      rejected: { count: rejected, percentage: total > 0 ? (rejected / total) * 100 : 0 }
    };
  };

  const platformStats = getPlatformStats();
  const statusStats = getStatusStats();

  return (
    <Container>
      <StatsRow>
        <StatCard>
          <CardTitle>
            <BarChart3 />
            Platform Distribution
          </CardTitle>
          
          <PlatformBreakdown>
            <PlatformItem>
              <PlatformInfo>
                <PlatformIcon platform={Platform.TIKTOK}>🎵</PlatformIcon>
                <PlatformName>TikTok</PlatformName>
              </PlatformInfo>
              <PlatformCount>{platformStats.tiktok.count}</PlatformCount>
            </PlatformItem>
            <ProgressBar>
              <ProgressFill 
                percentage={platformStats.tiktok.percentage} 
                color="#ff0050"
              />
            </ProgressBar>
            
            <PlatformItem>
              <PlatformInfo>
                <PlatformIcon platform={Platform.INSTAGRAM}>📸</PlatformIcon>
                <PlatformName>Instagram</PlatformName>
              </PlatformInfo>
              <PlatformCount>{platformStats.instagram.count}</PlatformCount>
            </PlatformItem>
            <ProgressBar>
              <ProgressFill 
                percentage={platformStats.instagram.percentage} 
                color="#833ab4"
              />
            </ProgressBar>
          </PlatformBreakdown>
        </StatCard>

        <StatCard>
          <CardTitle>
            <PieChart />
            Status Breakdown
          </CardTitle>
          
          <MetricGrid>
            <Metric>
              <MetricValue style={{ color: theme.colors.warning.main }}>
                {statusStats.pending.count}
              </MetricValue>
              <MetricLabel>Pending</MetricLabel>
            </Metric>
            
            <Metric>
              <MetricValue style={{ color: theme.colors.success.main }}>
                {statusStats.approved.count}
              </MetricValue>
              <MetricLabel>Approved</MetricLabel>
            </Metric>
            
            <Metric>
              <MetricValue style={{ color: theme.colors.error.main }}>
                {statusStats.rejected.count}
              </MetricValue>
              <MetricLabel>Rejected</MetricLabel>
            </Metric>
            
            <Metric>
              <MetricValue>{submissions.length}</MetricValue>
              <MetricLabel>Total</MetricLabel>
            </Metric>
          </MetricGrid>
        </StatCard>
      </StatsRow>

      <StatsRow>
        <StatCard>
          <CardTitle>
            <TrendingUp />
            Submission Trends
          </CardTitle>
          <ChartPlaceholder>
            📈 Submission trends chart coming soon
          </ChartPlaceholder>
        </StatCard>

        <StatCard>
          <CardTitle>
            <Users />
            Creator Activity
          </CardTitle>
          <ChartPlaceholder>
            👥 Creator activity chart coming soon
          </ChartPlaceholder>
        </StatCard>
      </StatsRow>

      <StatCard>
        <CardTitle>
          <Calendar />
          Performance Overview
        </CardTitle>
        
        <MetricGrid style={{ gridTemplateColumns: 'repeat(4, 1fr)' }}>
          <Metric>
            <MetricValue>{stats?.total || 0}</MetricValue>
            <MetricLabel>Total Submissions</MetricLabel>
          </Metric>
          
          <Metric>
            <MetricValue>{stats?.todaySubmissions || 0}</MetricValue>
            <MetricLabel>Today</MetricLabel>
          </Metric>
          
          <Metric>
            <MetricValue>
              {stats?.total ? Math.round((stats.approved / stats.total) * 100) : 0}%
            </MetricValue>
            <MetricLabel>Approval Rate</MetricLabel>
          </Metric>
          
          <Metric>
            <MetricValue>{stats?.mostActiveCreator?.count || 0}</MetricValue>
            <MetricLabel>Top Creator Submissions</MetricLabel>
          </Metric>
        </MetricGrid>
      </StatCard>
    </Container>
  );
};