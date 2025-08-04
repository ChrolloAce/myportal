/**
 * AdminOverview - Dashboard overview with statistics cards and recent activity
 * Clean, modern design with key metrics and quick actions
 */

import React from 'react';
import styled from 'styled-components';
import { TrendingUp, FileText, Clock, CheckCircle, ArrowRight } from 'lucide-react';
import { theme } from '../../styles/theme';
import { VideoSubmission, SubmissionStats, Platform, SubmissionStatus } from '../../types';

interface AdminOverviewProps {
  stats: SubmissionStats | null;
  recentSubmissions: VideoSubmission[];
  onViewAllSubmissions: () => void;
}

const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${theme.spacing[6]};
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: ${theme.spacing[4]};
`;

const StatCard = styled.div`
  background: ${theme.colors.neutral[0]};
  border-radius: ${theme.borderRadius.xl};
  padding: ${theme.spacing[6]};
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  border: 1px solid ${theme.colors.neutral[200]};
  transition: all ${theme.transitions.fast};
  
  &:hover {
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    transform: translateY(-1px);
  }
`;

const StatHeader = styled.div`
  display: flex;
  justify-content: between;
  align-items: flex-start;
  margin-bottom: ${theme.spacing[4]};
`;

const StatIcon = styled.div<{ color: string }>`
  width: 48px;
  height: 48px;
  border-radius: ${theme.borderRadius.lg};
  background: ${({ color }) => color};
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${theme.colors.neutral[0]};
  
  svg {
    width: 24px;
    height: 24px;
  }
`;

const StatContent = styled.div`
  flex: 1;
  text-align: right;
`;

const StatValue = styled.div`
  font-size: ${theme.typography.fontSize['2xl']};
  font-weight: ${theme.typography.fontWeight.bold};
  color: ${theme.colors.neutral[900]};
  margin-bottom: ${theme.spacing[1]};
`;

const StatLabel = styled.div`
  font-size: ${theme.typography.fontSize.sm};
  color: ${theme.colors.neutral[600]};
  margin-bottom: ${theme.spacing[2]};
`;

const StatChange = styled.div<{ positive?: boolean }>`
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: ${theme.spacing[1]};
  font-size: ${theme.typography.fontSize.xs};
  color: ${({ positive }) => 
    positive ? theme.colors.success.main : theme.colors.error.main
  };
  font-weight: ${theme.typography.fontWeight.medium};
`;

const RecentActivity = styled.div`
  background: ${theme.colors.neutral[0]};
  border-radius: ${theme.borderRadius.xl};
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  overflow: hidden;
`;

const ActivityHeader = styled.div`
  padding: ${theme.spacing[6]};
  border-bottom: 1px solid ${theme.colors.neutral[200]};
  display: flex;
  justify-content: between;
  align-items: center;
`;

const ActivityTitle = styled.h3`
  font-size: ${theme.typography.fontSize.lg};
  font-weight: ${theme.typography.fontWeight.semibold};
  color: ${theme.colors.neutral[900]};
`;

const ViewAllButton = styled.button`
  display: flex;
  align-items: center;
  gap: ${theme.spacing[1]};
  color: ${theme.colors.primary[600]};
  font-size: ${theme.typography.fontSize.sm};
  font-weight: ${theme.typography.fontWeight.medium};
  background: none;
  border: none;
  cursor: pointer;
  padding: ${theme.spacing[2]} ${theme.spacing[3]};
  border-radius: ${theme.borderRadius.md};
  transition: all ${theme.transitions.fast};
  
  &:hover {
    background: ${theme.colors.primary[50]};
    color: ${theme.colors.primary[700]};
  }
  
  svg {
    width: 16px;
    height: 16px;
  }
`;

const ActivityList = styled.div`
  max-height: 400px;
  overflow-y: auto;
`;

const ActivityItem = styled.div`
  padding: ${theme.spacing[4]} ${theme.spacing[6]};
  border-bottom: 1px solid ${theme.colors.neutral[100]};
  display: flex;
  align-items: center;
  gap: ${theme.spacing[4]};
  
  &:last-child {
    border-bottom: none;
  }
  
  &:hover {
    background: ${theme.colors.neutral[25]};
  }
`;

const ActivityAvatar = styled.div<{ platform: Platform }>`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: ${({ platform }) => 
    platform === Platform.TIKTOK 
      ? 'linear-gradient(45deg, #ff0050, #00f2ea)' 
      : 'linear-gradient(45deg, #833ab4, #fd1d1d, #fcb045)'
  };
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${theme.colors.neutral[0]};
  font-weight: ${theme.typography.fontWeight.semibold};
  font-size: ${theme.typography.fontSize.sm};
`;

const ActivityContent = styled.div`
  flex: 1;
`;

const ActivityText = styled.div`
  font-size: ${theme.typography.fontSize.sm};
  color: ${theme.colors.neutral[900]};
  margin-bottom: ${theme.spacing[1]};
`;

const ActivityMeta = styled.div`
  font-size: ${theme.typography.fontSize.xs};
  color: ${theme.colors.neutral[500]};
`;

const ActivityStatus = styled.div<{ status: SubmissionStatus }>`
  padding: ${theme.spacing[1]} ${theme.spacing[2]};
  border-radius: ${theme.borderRadius.md};
  font-size: ${theme.typography.fontSize.xs};
  font-weight: ${theme.typography.fontWeight.medium};
  
  ${({ status }) => {
    switch (status) {
      case SubmissionStatus.PENDING:
        return `
          background: ${theme.colors.warning.light};
          color: ${theme.colors.warning.dark};
        `;
      case SubmissionStatus.APPROVED:
        return `
          background: ${theme.colors.success.light};
          color: ${theme.colors.success.dark};
        `;
      case SubmissionStatus.REJECTED:
        return `
          background: ${theme.colors.error.light};
          color: ${theme.colors.error.dark};
        `;
      default:
        return `
          background: ${theme.colors.neutral[200]};
          color: ${theme.colors.neutral[700]};
        `;
    }
  }}
`;

export const AdminOverview: React.FC<AdminOverviewProps> = ({
  stats,
  recentSubmissions,
  onViewAllSubmissions
}) => {
  const getUserInitials = (username: string): string => {
    return username
      .split(' ')
      .map(word => word.charAt(0))
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };

  const formatTimeAgo = (dateString: string): string => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${diffInHours}h ago`;
    return `${Math.floor(diffInHours / 24)}d ago`;
  };

  const statCards = [
    {
      icon: FileText,
      label: 'Total Submissions',
      value: stats?.total || 0,
      color: theme.colors.primary[500],
      change: '+12%'
    },
    {
      icon: Clock,
      label: 'Pending Review',
      value: stats?.pending || 0,
      color: theme.colors.warning.main,
      change: '+3%'
    },
    {
      icon: CheckCircle,
      label: 'Approved',
      value: stats?.approved || 0,
      color: theme.colors.success.main,
      change: '+18%'
    },
    {
      icon: TrendingUp,
      label: 'Today\'s Submissions',
      value: stats?.todaySubmissions || 0,
      color: theme.colors.purple[500],
      change: '+25%'
    }
  ];

  return (
    <Container>
      <StatsGrid>
        {statCards.map((card, index) => (
          <StatCard key={index}>
            <StatHeader>
              <StatIcon color={card.color}>
                <card.icon />
              </StatIcon>
              <StatContent>
                <StatValue>{card.value}</StatValue>
                <StatLabel>{card.label}</StatLabel>
                <StatChange positive={card.change.startsWith('+')}>
                  <TrendingUp size={12} />
                  {card.change} this week
                </StatChange>
              </StatContent>
            </StatHeader>
          </StatCard>
        ))}
      </StatsGrid>

      <RecentActivity>
        <ActivityHeader>
          <ActivityTitle>Recent Submissions</ActivityTitle>
          <ViewAllButton onClick={onViewAllSubmissions}>
            View all
            <ArrowRight />
          </ViewAllButton>
        </ActivityHeader>

        <ActivityList>
          {recentSubmissions.length === 0 ? (
            <ActivityItem>
              <div style={{ textAlign: 'center', width: '100%', padding: theme.spacing[4] }}>
                No recent submissions
              </div>
            </ActivityItem>
          ) : (
            recentSubmissions.map((submission) => (
              <ActivityItem key={submission.id}>
                <ActivityAvatar platform={submission.platform}>
                  {getUserInitials(submission.creatorUsername)}
                </ActivityAvatar>
                
                <ActivityContent>
                  <ActivityText>
                    <strong>{submission.creatorUsername}</strong> submitted a {submission.platform} video
                  </ActivityText>
                  <ActivityMeta>
                    {formatTimeAgo(submission.submittedAt)} • ID: {submission.id.substring(0, 8)}
                  </ActivityMeta>
                </ActivityContent>
                
                <ActivityStatus status={submission.status}>
                  {submission.status}
                </ActivityStatus>
              </ActivityItem>
            ))
          )}
        </ActivityList>
      </RecentActivity>
    </Container>
  );
};