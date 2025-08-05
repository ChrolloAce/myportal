/**
 * Professional AdminDashboard - Modern SaaS-style admin interface
 * Clean, sophisticated design inspired by professional dashboards
 */

import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { professionalTheme } from '../../styles/professionalTheme';
import { Card } from '../../styles/ProfessionalStyles';
import { FirebaseSubmissionManager } from '../../firebase/FirebaseSubmissionManager';
import { AdminUser, VideoSubmission, SubmissionStats } from '../../types';
import { AdminSidebar } from './AdminSidebar';
import { SubmissionManagement } from './SubmissionManagement';
import { AdminOverview } from './AdminOverview';
import { UserManagement } from './UserManagement';
import { AdminStatistics } from './AdminStatistics';
import { CorporationMembers } from './CorporationMembers';
import { InviteManagement } from './InviteManagement';

interface AdminDashboardProps {
  user: AdminUser;
  onLogout: () => void;
}

type AdminView = 'overview' | 'submissions' | 'statistics' | 'users' | 'members' | 'invites' | 'settings';

// Professional Dashboard Layout
const DashboardLayout = styled.div`
  display: flex;
  min-height: 100vh;
  background: ${professionalTheme.colors.gray[25]};
`;

const Sidebar = styled.aside`
  position: fixed;
  top: 0;
  left: 0;
  width: 280px;
  height: 100vh;
  background: ${professionalTheme.colors.white};
  border-right: 1px solid ${professionalTheme.borders.color.light};
  z-index: ${professionalTheme.zIndex.sticky};
  overflow-y: auto;
  
  @media (max-width: ${professionalTheme.breakpoints.lg}) {
    transform: translateX(-100%);
    transition: ${professionalTheme.transitions.transform};
    
    &.open {
      transform: translateX(0);
    }
  }
`;

const MainContent = styled.main`
  flex: 1;
  margin-left: 280px;
  min-height: 100vh;
  
  @media (max-width: ${professionalTheme.breakpoints.lg}) {
    margin-left: 0;
  }
`;

const ContentWrapper = styled.div`
  padding: ${professionalTheme.spacing[8]} ${professionalTheme.spacing[8]} ${professionalTheme.spacing[6]};
  
  @media (max-width: ${professionalTheme.breakpoints.md}) {
    padding: ${professionalTheme.spacing[6]} ${professionalTheme.spacing[4]};
  }
`;

const PageHeader = styled.header`
  margin-bottom: ${professionalTheme.spacing[8]};
`;

const PageTitle = styled.h1`
  font-size: ${professionalTheme.typography.fontSize['3xl']};
  font-weight: ${professionalTheme.typography.fontWeight.bold};
  color: ${professionalTheme.colors.gray[900]};
  line-height: ${professionalTheme.typography.lineHeight.tight};
  margin-bottom: ${professionalTheme.spacing[2]};
`;

const PageSubtitle = styled.p`
  font-size: ${professionalTheme.typography.fontSize.lg};
  color: ${professionalTheme.colors.gray[600]};
  line-height: ${professionalTheme.typography.lineHeight.relaxed};
  max-width: 640px;
`;

const ContentArea = styled.div`
  position: relative;
`;

// Mobile overlay for sidebar
const MobileOverlay = styled.div<{ isOpen: boolean }>`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  z-index: ${professionalTheme.zIndex.overlay};
  opacity: ${({ isOpen }) => (isOpen ? 1 : 0)};
  visibility: ${({ isOpen }) => (isOpen ? 'visible' : 'hidden')};
  transition: ${professionalTheme.transitions.all};
  
  @media (min-width: ${professionalTheme.breakpoints.lg}) {
    display: none;
  }
`;

const MobileMenuButton = styled.button`
  position: fixed;
  top: ${professionalTheme.spacing[4]};
  left: ${professionalTheme.spacing[4]};
  z-index: ${professionalTheme.zIndex.sticky + 1};
  display: none;
  padding: ${professionalTheme.spacing[2]};
  background: ${professionalTheme.colors.white};
  border: 1px solid ${professionalTheme.borders.color.default};
  border-radius: ${professionalTheme.borderRadius.md};
  box-shadow: ${professionalTheme.shadows.sm};
  color: ${professionalTheme.colors.gray[600]};
  
  @media (max-width: ${professionalTheme.breakpoints.lg}) {
    display: flex;
    align-items: center;
    justify-content: center;
  }
  
  &:hover {
    background: ${professionalTheme.colors.gray[50]};
    color: ${professionalTheme.colors.gray[900]};
  }
`;

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ user, onLogout }) => {
  const [currentView, setCurrentView] = useState<AdminView>('overview');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [submissions, setSubmissions] = useState<VideoSubmission[]>([]);
  const [stats, setStats] = useState<SubmissionStats | null>(null);
  const [, setLoading] = useState(true);

  const submissionManager = FirebaseSubmissionManager.getInstance();

  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        setLoading(true);
        
        if (user.corporationId) {
          const [submissionsResponse, statsData] = await Promise.all([
            submissionManager.getSubmissions(),
            submissionManager.getSubmissionStats()
          ]);
          
          setSubmissions(submissionsResponse.data);
          setStats(statsData);
        }
      } catch (error) {
        console.error('Failed to load dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadDashboardData();
  }, [user.corporationId]);

  const getViewTitle = (view: AdminView): { title: string; subtitle: string } => {
    switch (view) {
      case 'overview':
        return {
          title: 'Dashboard Overview',
          subtitle: 'Get a comprehensive view of your organization\'s performance and key metrics.'
        };
      case 'submissions':
        return {
          title: 'Submission Management',
          subtitle: 'Review, approve, and manage video submissions from your creators.'
        };
      case 'statistics':
        return {
          title: 'Analytics & Statistics',
          subtitle: 'Track performance metrics and analyze trends across your organization.'
        };
      case 'users':
        return {
          title: 'User Management',
          subtitle: 'Manage user accounts, permissions, and access controls.'
        };
      case 'members':
        return {
          title: 'Team Members',
          subtitle: 'View and manage your organization\'s team members and their roles.'
        };
      case 'invites':
        return {
          title: 'Invitation Management',
          subtitle: 'Create and manage invitation links to grow your team.'
        };
      case 'settings':
        return {
          title: 'Organization Settings',
          subtitle: 'Configure your organization preferences and account settings.'
        };
      default:
        return {
          title: 'Dashboard',
          subtitle: 'Welcome to your professional dashboard.'
        };
    }
  };

  const renderCurrentView = () => {
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
            onSubmissionUpdate={() => {
              // Reload submissions when updated
              submissionManager.getSubmissions()
                .then(response => setSubmissions(response.data));
            }}
          />
        );
      case 'statistics':
        return <AdminStatistics stats={stats} submissions={submissions} />;
      case 'users':
        return <UserManagement />;
      case 'members':
        return user.corporationId ? (
          <CorporationMembers user={user} corporationId={user.corporationId} />
        ) : null;
      case 'invites':
        return user.corporationId ? (
          <InviteManagement user={user} />
        ) : null;
      case 'settings':
        return (
          <Card>
            <h3>Settings</h3>
            <p>Organization settings coming soon...</p>
          </Card>
        );
      default:
        return null;
    }
  };

  const { title, subtitle } = getViewTitle(currentView);

  return (
    <DashboardLayout>
      {/* Mobile Menu Button */}
      <MobileMenuButton onClick={() => setSidebarOpen(true)}>
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
          <path 
            d="M3 12h18M3 6h18M3 18h18" 
            stroke="currentColor" 
            strokeWidth="2" 
            strokeLinecap="round" 
            strokeLinejoin="round"
          />
        </svg>
      </MobileMenuButton>

      {/* Mobile Overlay */}
      <MobileOverlay 
        isOpen={sidebarOpen} 
        onClick={() => setSidebarOpen(false)} 
      />

      {/* Sidebar */}
      <Sidebar className={sidebarOpen ? 'open' : ''}>
        <AdminSidebar
          user={user}
          currentView={currentView}
          onViewChange={(view) => {
            setCurrentView(view);
            setSidebarOpen(false);
          }}
          onLogout={onLogout}
        />
      </Sidebar>

      {/* Main Content */}
      <MainContent>
        <ContentWrapper>
          <PageHeader>
            <PageTitle>{title}</PageTitle>
            <PageSubtitle>{subtitle}</PageSubtitle>
          </PageHeader>

          <ContentArea>
            {renderCurrentView()}
          </ContentArea>
        </ContentWrapper>
      </MainContent>
    </DashboardLayout>
  );
};