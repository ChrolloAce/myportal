/**
 * AdminDashboard - Modern admin interface with sidebar navigation
 * Inspired by clean, professional dashboard design
 */

import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { theme } from '../../styles/theme';
import { FirebaseSubmissionManager } from '../../firebase/FirebaseSubmissionManager';
import { AdminUser, VideoSubmission, SubmissionStats } from '../../types';
import { AdminSidebar } from './AdminSidebar';
import { SubmissionManagement } from './SubmissionManagement';
import { AdminOverview } from './AdminOverview';
import { UserManagement } from './UserManagement';
import { AdminStatistics } from './AdminStatistics';
import { CorporationMembers } from './CorporationMembers';

interface AdminDashboardProps {
  user: AdminUser;
  onLogout: () => void;
}

type AdminView = 'overview' | 'submissions' | 'statistics' | 'users' | 'members' | 'settings';

const DashboardContainer = styled.div`
  display: flex;
  min-height: 100vh;
  background: ${theme.colors.neutral[50]};
`;

const MainContent = styled.div`
  flex: 1;
  margin-left: 280px;
  padding: ${theme.spacing[6]};
  
  @media (max-width: 768px) {
    margin-left: 0;
    padding: ${theme.spacing[4]};
  }
`;

const ContentHeader = styled.div`
  margin-bottom: ${theme.spacing[6]};
`;

const PageTitle = styled.h1`
  font-size: ${theme.typography.fontSize['2xl']};
  font-weight: ${theme.typography.fontWeight.bold};
  color: ${theme.colors.neutral[900]};
  margin-bottom: ${theme.spacing[2]};
`;

const PageSubtitle = styled.p`
  font-size: ${theme.typography.fontSize.lg};
  color: ${theme.colors.neutral[600]};
`;

const LoadingContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 400px;
  font-size: ${theme.typography.fontSize.lg};
  color: ${theme.colors.neutral[600]};
`;

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  user,
  onLogout
}) => {
  const [currentView, setCurrentView] = useState<AdminView>('overview');
  const [submissions, setSubmissions] = useState<VideoSubmission[]>([]);
  const [stats, setStats] = useState<SubmissionStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const submissionManager = FirebaseSubmissionManager.getInstance();

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setIsLoading(true);
      setError(null);

      // Load submissions and stats in parallel
      const [submissionsResponse, statsData] = await Promise.all([
        submissionManager.getSubmissions({}, 1, 50),
        submissionManager.getSubmissionStats()
      ]);

      setSubmissions(submissionsResponse.items);
      setStats(statsData);
    } catch (error) {
      console.error('Failed to load dashboard data:', error);
      setError(error instanceof Error ? error.message : 'Failed to load data');
    } finally {
      setIsLoading(false);
    }
  };

  const getViewTitle = (view: AdminView): { title: string; subtitle: string } => {
    switch (view) {
      case 'overview':
        return {
          title: 'Dashboard Overview',
          subtitle: 'Welcome back! Here\'s what\'s happening with your platform.'
        };
      case 'submissions':
        return {
          title: 'Submission Management',
          subtitle: 'Review and manage creator video submissions.'
        };
      case 'statistics':
        return {
          title: 'Analytics & Statistics',
          subtitle: 'Detailed insights into platform performance.'
        };
      case 'users':
        return {
          title: 'User Management',
          subtitle: 'Manage creators and admin accounts.'
        };
      case 'members':
        return {
          title: 'Corporation Members',
          subtitle: 'Manage your corporation members, creators, and team.'
        };
      case 'settings':
        return {
          title: 'Platform Settings',
          subtitle: 'Configure platform settings and preferences.'
        };
      default:
        return {
          title: 'Dashboard',
          subtitle: 'Admin panel'
        };
    }
  };

  const renderCurrentView = () => {
    if (isLoading) {
      return (
        <LoadingContainer>
          Loading dashboard data...
        </LoadingContainer>
      );
    }

    if (error) {
      return (
        <LoadingContainer>
          Error: {error}
        </LoadingContainer>
      );
    }

    switch (currentView) {
      case 'overview':
        return (
          <AdminOverview
            stats={stats}
            recentSubmissions={submissions.slice(0, 5)}
            onViewAllSubmissions={() => setCurrentView('submissions')}
          />
        );
      case 'submissions':
        return (
          <SubmissionManagement
            submissions={submissions}
            onSubmissionUpdate={loadDashboardData}
          />
        );
      case 'statistics':
        return (
          <AdminStatistics
            stats={stats}
            submissions={submissions}
          />
        );
      case 'users':
        return (
          <UserManagement />
        );
      case 'members':
        return user.corporationId ? (
          <CorporationMembers 
            user={user}
            corporationId={user.corporationId}
          />
        ) : (
          <div>No corporation found. Please complete your onboarding process.</div>
        );
      case 'settings':
        return (
          <div>Settings panel coming soon...</div>
        );
      default:
        return null;
    }
  };

  const { title, subtitle } = getViewTitle(currentView);

  return (
    <DashboardContainer>
      <AdminSidebar
        user={user}
        currentView={currentView}
        onViewChange={setCurrentView}
        onLogout={onLogout}
      />
      
      <MainContent>
        <ContentHeader>
          <PageTitle>{title}</PageTitle>
          <PageSubtitle>{subtitle}</PageSubtitle>
        </ContentHeader>

        {renderCurrentView()}
      </MainContent>
    </DashboardContainer>
  );
};