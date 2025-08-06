/**
 * Professional AdminOverview - Beautiful dashboard overview
 * Matches the professional analytics style with gradient cards and modern design
 */

import React from 'react';
import styled from 'styled-components';
import { professionalTheme } from '../../styles/professionalTheme';
import { Card, Button } from '../../styles/ProfessionalStyles';
import { VideoSubmission, SubmissionStats } from '../../types';
import { 
  TrendingUp, 
  FileText, 
  Clock, 
  CheckCircle, 
  ArrowRight,
  Users,
  Award,
  Eye,
  PlayCircle,
  BarChart3
} from 'lucide-react';

interface AdminOverviewProps {
  stats: SubmissionStats | null;
  recentSubmissions: VideoSubmission[];
  onViewAllSubmissions: () => void;
}

const DashboardLayout = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${professionalTheme.spacing[6]};
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: ${professionalTheme.spacing[6]};
  margin-bottom: ${professionalTheme.spacing[8]};
`;

const StatCard = styled(Card)<{ gradient: string }>`
  padding: ${professionalTheme.spacing[6]};
  background: ${props => props.gradient};
  border: none;
  position: relative;
  overflow: hidden;
  transition: all 0.3s ease;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    right: 0;
    width: 100px;
    height: 100px;
    background: rgba(255, 255, 255, 0.1);
    border-radius: 50%;
    transform: translate(30px, -30px);
  }
  
  &:hover {
    transform: translateY(-4px);
    box-shadow: ${professionalTheme.shadows.cardHover};
  }
`;

const StatHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: ${professionalTheme.spacing[4]};
`;

const StatIcon = styled.div`
  width: 56px;
  height: 56px;
  background: rgba(255, 255, 255, 0.2);
  color: ${professionalTheme.colors.white};
  border-radius: ${professionalTheme.borderRadius.xl};
  display: flex;
  align-items: center;
  justify-content: center;
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.3);
  box-shadow: ${professionalTheme.shadows.md};
`;

const StatValue = styled.div`
  font-size: ${professionalTheme.typography.fontSize['3xl']};
  font-weight: ${professionalTheme.typography.fontWeight.bold};
  color: ${professionalTheme.colors.white};
  margin-bottom: ${professionalTheme.spacing[2]};
`;

const StatLabel = styled.div`
  font-size: ${professionalTheme.typography.fontSize.base};
  color: rgba(255, 255, 255, 0.9);
  font-weight: ${professionalTheme.typography.fontWeight.medium};
  margin-bottom: ${professionalTheme.spacing[3]};
`;

const StatChange = styled.div<{ isPositive: boolean }>`
  display: flex;
  align-items: center;
  gap: ${professionalTheme.spacing[1]};
  font-size: ${professionalTheme.typography.fontSize.sm};
  color: rgba(255, 255, 255, 0.9);
`;

const ContentGrid = styled.div`
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: ${professionalTheme.spacing[6]};
  
  @media (max-width: ${professionalTheme.breakpoints.lg}) {
    grid-template-columns: 1fr;
  }
`;

const RecentActivityCard = styled(Card)`
  padding: ${professionalTheme.spacing[6]};
`;

const ActivityHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: ${professionalTheme.spacing[6]};
`;

const ActivityHeaderTitle = styled.h3`
  font-size: ${professionalTheme.typography.fontSize.xl};
  font-weight: ${professionalTheme.typography.fontWeight.semibold};
  color: ${professionalTheme.colors.gray[900]};
  margin: 0;
`;

const ActivityList = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${professionalTheme.spacing[4]};
`;

const ActivityItem = styled.div`
  display: flex;
  align-items: center;
  gap: ${professionalTheme.spacing[4]};
  padding: ${professionalTheme.spacing[4]};
  background: ${professionalTheme.colors.gray[50]};
  border-radius: ${professionalTheme.borderRadius.lg};
  transition: all 0.2s ease;
  
  &:hover {
    background: ${professionalTheme.colors.gray[100]};
  }
`;

const ActivityIcon = styled.div<{ status: string }>`
  width: 40px;
  height: 40px;
  border-radius: ${professionalTheme.borderRadius.full};
  display: flex;
  align-items: center;
  justify-content: center;
  
  ${props => {
    switch (props.status) {
      case 'approved':
        return `
          background: ${professionalTheme.colors.success[100]};
          color: ${professionalTheme.colors.success[600]};
        `;
      case 'pending':
        return `
          background: ${professionalTheme.colors.warning[100]};
          color: ${professionalTheme.colors.warning[600]};
        `;
      case 'rejected':
        return `
          background: ${professionalTheme.colors.error[100]};
          color: ${professionalTheme.colors.error[600]};
        `;
      default:
        return `
          background: ${professionalTheme.colors.gray[100]};
          color: ${professionalTheme.colors.gray[600]};
        `;
    }
  }}
`;

const ActivityContent = styled.div`
  flex: 1;
`;

const ActivityTitle = styled.div`
  font-size: ${professionalTheme.typography.fontSize.sm};
  font-weight: ${professionalTheme.typography.fontWeight.medium};
  color: ${professionalTheme.colors.gray[900]};
  margin-bottom: ${professionalTheme.spacing[1]};
`;

const ActivityMeta = styled.div`
  font-size: ${professionalTheme.typography.fontSize.xs};
  color: ${professionalTheme.colors.gray[600]};
`;

const QuickActionsCard = styled(Card)`
  padding: ${professionalTheme.spacing[6]};
`;

const QuickActionsGrid = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${professionalTheme.spacing[4]};
`;

const QuickActionItem = styled.div`
  display: flex;
  align-items: center;
  gap: ${professionalTheme.spacing[3]};
  padding: ${professionalTheme.spacing[4]};
  background: ${professionalTheme.colors.gray[50]};
  border-radius: ${professionalTheme.borderRadius.lg};
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:hover {
    background: ${professionalTheme.colors.primary[50]};
    transform: translateX(4px);
  }
`;

const ActionIcon = styled.div`
  width: 40px;
  height: 40px;
  background: ${professionalTheme.colors.primary[100]};
  color: ${professionalTheme.colors.primary[600]};
  border-radius: ${professionalTheme.borderRadius.lg};
  display: flex;
  align-items: center;
  justify-content: center;
`;

const ActionContent = styled.div`
  flex: 1;
`;

const ActionTitle = styled.div`
  font-size: ${professionalTheme.typography.fontSize.sm};
  font-weight: ${professionalTheme.typography.fontWeight.medium};
  color: ${professionalTheme.colors.gray[900]};
  margin-bottom: ${professionalTheme.spacing[1]};
`;

const ActionDescription = styled.div`
  font-size: ${professionalTheme.typography.fontSize.xs};
  color: ${professionalTheme.colors.gray[600]};
`;

const StatusBadge = styled.div<{ status: string }>`
  display: inline-flex;
  align-items: center;
  gap: ${professionalTheme.spacing[1]};
  padding: ${professionalTheme.spacing[1]} ${professionalTheme.spacing[2]};
  border-radius: ${professionalTheme.borderRadius.full};
  font-size: ${professionalTheme.typography.fontSize.xs};
  font-weight: ${professionalTheme.typography.fontWeight.medium};
  
  ${props => {
    switch (props.status) {
      case 'approved':
        return `
          background: ${professionalTheme.colors.success[100]};
          color: ${professionalTheme.colors.success[700]};
        `;
      case 'pending':
        return `
          background: ${professionalTheme.colors.warning[100]};
          color: ${professionalTheme.colors.warning[700]};
        `;
      case 'rejected':
        return `
          background: ${professionalTheme.colors.error[100]};
          color: ${professionalTheme.colors.error[700]};
        `;
      default:
        return `
          background: ${professionalTheme.colors.gray[100]};
          color: ${professionalTheme.colors.gray[700]};
        `;
    }
  }}
`;

export const AdminOverview: React.FC<AdminOverviewProps> = ({ 
  stats, 
  recentSubmissions, 
  onViewAllSubmissions 
}) => {
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'approved':
        return <CheckCircle size={20} />;
      case 'pending':
        return <Clock size={20} />;
      case 'rejected':
        return <FileText size={20} />;
      default:
        return <FileText size={20} />;
    }
  };

  return (
    <DashboardLayout>
      {/* Stats Grid */}
      <StatsGrid>
        <StatCard gradient={`linear-gradient(135deg, ${professionalTheme.colors.primary[500]} 0%, ${professionalTheme.colors.primary[600]} 100%)`}>
          <StatHeader>
            <div>
              <StatValue>{stats?.total || 0}</StatValue>
              <StatLabel>Total Submissions</StatLabel>
              <StatChange isPositive={true}>
                <TrendingUp size={14} />
                +12% from last month
              </StatChange>
            </div>
            <StatIcon>
              <FileText size={24} />
            </StatIcon>
          </StatHeader>
        </StatCard>

        <StatCard gradient={`linear-gradient(135deg, ${professionalTheme.colors.success[500]} 0%, ${professionalTheme.colors.success[600]} 100%)`}>
          <StatHeader>
            <div>
              <StatValue>{stats?.approved || 0}</StatValue>
              <StatLabel>Approved</StatLabel>
              <StatChange isPositive={true}>
                <TrendingUp size={14} />
                +8% from last month
              </StatChange>
            </div>
            <StatIcon>
              <CheckCircle size={24} />
            </StatIcon>
          </StatHeader>
        </StatCard>

        <StatCard gradient={`linear-gradient(135deg, ${professionalTheme.colors.warning[500]} 0%, ${professionalTheme.colors.warning[600]} 100%)`}>
          <StatHeader>
            <div>
              <StatValue>{stats?.pending || 0}</StatValue>
              <StatLabel>Pending Review</StatLabel>
              <StatChange isPositive={false}>
                <Clock size={14} />
                Needs attention
              </StatChange>
            </div>
            <StatIcon>
              <Clock size={24} />
            </StatIcon>
          </StatHeader>
        </StatCard>

        <StatCard gradient={`linear-gradient(135deg, ${professionalTheme.colors.brand.purple} 0%, ${professionalTheme.colors.brand.indigo} 100%)`}>
          <StatHeader>
            <div>
              <StatValue>{stats?.todaySubmissions || 0}</StatValue>
              <StatLabel>Today's Activity</StatLabel>
              <StatChange isPositive={true}>
                <Eye size={14} />
                Active day
              </StatChange>
            </div>
            <StatIcon>
              <BarChart3 size={24} />
            </StatIcon>
          </StatHeader>
        </StatCard>
      </StatsGrid>

      {/* Content Grid */}
      <ContentGrid>
        {/* Recent Activity */}
        <RecentActivityCard>
          <ActivityHeader>
            <ActivityHeaderTitle>Recent Activity</ActivityHeaderTitle>
            <Button variant="secondary" size="sm" onClick={onViewAllSubmissions}>
              View All
              <ArrowRight size={14} />
            </Button>
          </ActivityHeader>
          
          <ActivityList>
            {recentSubmissions.length === 0 ? (
              <div style={{ 
                textAlign: 'center', 
                padding: professionalTheme.spacing[8],
                color: professionalTheme.colors.gray[600]
              }}>
                <PlayCircle size={48} style={{ marginBottom: professionalTheme.spacing[4] }} />
                <p>No recent submissions</p>
              </div>
            ) : (
              recentSubmissions.slice(0, 5).map((submission) => (
                <ActivityItem key={submission.id}>
                  <ActivityIcon status={submission.status}>
                    {getStatusIcon(submission.status)}
                  </ActivityIcon>
                  <ActivityContent>
                    <ActivityTitle>{submission.caption || 'Untitled Submission'}</ActivityTitle>
                    <ActivityMeta>
                      {submission.platform} • {new Date(submission.submittedAt).toLocaleDateString()}
                    </ActivityMeta>
                  </ActivityContent>
                  <StatusBadge status={submission.status}>
                    {submission.status}
                  </StatusBadge>
                </ActivityItem>
              ))
            )}
          </ActivityList>
        </RecentActivityCard>

        {/* Quick Actions */}
        <QuickActionsCard>
          <ActivityHeaderTitle style={{ marginBottom: professionalTheme.spacing[6] }}>
            Quick Actions
          </ActivityHeaderTitle>
          
          <QuickActionsGrid>
            <QuickActionItem onClick={onViewAllSubmissions}>
              <ActionIcon>
                <FileText size={20} />
              </ActionIcon>
              <ActionContent>
                <ActionTitle>Review Submissions</ActionTitle>
                <ActionDescription>Approve or reject pending content</ActionDescription>
              </ActionContent>
            </QuickActionItem>

            <QuickActionItem>
              <ActionIcon>
                <Users size={20} />
              </ActionIcon>
              <ActionContent>
                <ActionTitle>Manage Team</ActionTitle>
                <ActionDescription>Add or edit team members</ActionDescription>
              </ActionContent>
            </QuickActionItem>

            <QuickActionItem>
              <ActionIcon>
                <BarChart3 size={20} />
              </ActionIcon>
              <ActionContent>
                <ActionTitle>View Analytics</ActionTitle>
                <ActionDescription>Check performance metrics</ActionDescription>
              </ActionContent>
            </QuickActionItem>

            <QuickActionItem>
              <ActionIcon>
                <Award size={20} />
              </ActionIcon>
              <ActionContent>
                <ActionTitle>Create Invite</ActionTitle>
                <ActionDescription>Invite new team members</ActionDescription>
              </ActionContent>
            </QuickActionItem>
          </QuickActionsGrid>
        </QuickActionsCard>
      </ContentGrid>
    </DashboardLayout>
  );
};