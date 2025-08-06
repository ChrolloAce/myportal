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
import { AdminSidebar } from './AdminSidebarProfessional';
import { SubmissionManagement } from './SubmissionManagementProfessional';
import { AdminOverview } from './AdminOverviewProfessional';
import { UserManagement } from './UserManagementProfessional';
import { AdminStatistics } from './AdminStatisticsProfessional';
import { CorporationMembers } from './CorporationMembers';
import { InviteManagement } from './InviteManagementProfessional';
import { 
  Users,
  TrendingUp,
  Award,
  Zap,
  Crown,
  Shield,
  UserCheck
} from 'lucide-react';

interface AdminDashboardProps {
  user: AdminUser;
  onLogout: () => void;
}

type AdminView = 'overview' | 'submissions' | 'statistics' | 'users' | 'members' | 'invites' | 'settings';

// Professional Dashboard Layout with Gradient
const DashboardLayout = styled.div`
  display: flex;
  min-height: 100vh;
  background: linear-gradient(135deg, 
    ${professionalTheme.colors.gray[25]} 0%,
    ${professionalTheme.colors.primary[25]} 50%,
    ${professionalTheme.colors.gray[50]} 100%
  );
`;

const Sidebar = styled.aside`
  position: fixed;
  top: 0;
  left: 0;
  width: 280px;
  height: 100vh;
  background: linear-gradient(180deg, 
    ${professionalTheme.colors.white} 0%,
    rgba(255, 255, 255, 0.98) 100%
  );
  backdrop-filter: blur(10px);
  border-right: 1px solid ${professionalTheme.borders.color.light};
  box-shadow: ${professionalTheme.shadows.lg};
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

// Beautiful Stats Cards
const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: ${professionalTheme.spacing[6]};
  margin-bottom: ${professionalTheme.spacing[8]};
`;

const StatCard = styled(Card)<{ gradient: string }>`
  padding: ${professionalTheme.spacing[6]};
  text-align: center;
  background: ${props => props.gradient};
  border: none;
  transition: all 0.3s ease;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(45deg, rgba(255,255,255,0.1) 0%, transparent 100%);
    opacity: 0;
    transition: opacity 0.3s ease;
  }
  
  &:hover {
    transform: translateY(-4px);
    box-shadow: ${professionalTheme.shadows.xl};
    
    &::before {
      opacity: 1;
    }
  }
`;

const StatIcon = styled.div`
  width: 64px;
  height: 64px;
  margin: 0 auto ${professionalTheme.spacing[4]};
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
  margin-bottom: ${professionalTheme.spacing[1]};
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

const StatLabel = styled.div`
  font-size: ${professionalTheme.typography.fontSize.sm};
  color: rgba(255, 255, 255, 0.9);
  font-weight: ${professionalTheme.typography.fontWeight.medium};
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
`;

const StatTrend = styled.div<{ isPositive: boolean }>`
  font-size: ${professionalTheme.typography.fontSize.xs};
  color: ${props => props.isPositive ? 'rgba(255, 255, 255, 0.9)' : 'rgba(255, 255, 255, 0.7)'};
  margin-top: ${professionalTheme.spacing[2]};
  display: flex;
  align-items: center;
  justify-content: center;
  gap: ${professionalTheme.spacing[1]};
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
          
          setSubmissions(submissionsResponse.items);
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
                .then(response => setSubmissions(response.items));
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
            setCurrentView(view as AdminView);
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

          {/* Beautiful Stats Cards */}
          {currentView === 'overview' && stats && (
            <StatsGrid>
              <StatCard gradient={`linear-gradient(135deg, ${professionalTheme.colors.primary[500]} 0%, ${professionalTheme.colors.primary[600]} 100%)`}>
                <StatIcon>
                  <Crown size={28} />
                </StatIcon>
                <StatValue>{stats.total || 0}</StatValue>
                <StatLabel>Total Submissions</StatLabel>
                <StatTrend isPositive={true}>
                  <TrendingUp size={12} />
                  +12% this month
                </StatTrend>
              </StatCard>

              <StatCard gradient={`linear-gradient(135deg, ${professionalTheme.colors.success[500]} 0%, ${professionalTheme.colors.success[600]} 100%)`}>
                <StatIcon>
                  <Award size={28} />
                </StatIcon>
                <StatValue>{stats.approved || 0}</StatValue>
                <StatLabel>Approved Content</StatLabel>
                <StatTrend isPositive={true}>
                  <TrendingUp size={12} />
                  +8% this week
                </StatTrend>
              </StatCard>

              <StatCard gradient={`linear-gradient(135deg, ${professionalTheme.colors.warning[500]} 0%, ${professionalTheme.colors.warning[600]} 100%)`}>
                <StatIcon>
                  <Zap size={28} />
                </StatIcon>
                <StatValue>{stats.pending || 0}</StatValue>
                <StatLabel>Pending Review</StatLabel>
                <StatTrend isPositive={false}>
                  <Shield size={12} />
                  Awaiting action
                </StatTrend>
              </StatCard>

              <StatCard gradient={`linear-gradient(135deg, ${professionalTheme.colors.gray[600]} 0%, ${professionalTheme.colors.gray[700]} 100%)`}>
                <StatIcon>
                  <Users size={28} />
                </StatIcon>
                <StatValue>{user.corporationId ? '12' : '0'}</StatValue>
                <StatLabel>Team Members</StatLabel>
                <StatTrend isPositive={true}>
                  <UserCheck size={12} />
                  3 active today
                </StatTrend>
              </StatCard>
            </StatsGrid>
          )}

          <ContentArea>
            {renderCurrentView()}
          </ContentArea>
        </ContentWrapper>
      </MainContent>
    </DashboardLayout>
  );
};