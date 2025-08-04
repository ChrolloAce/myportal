/**
 * CreatorDashboard - Modern, clean creator interface
 * Beautiful dashboard inspired by professional design systems
 */

import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { Upload, History, LogOut, TrendingUp, Clock, CheckCircle, Video, Building2 } from 'lucide-react';
import { theme } from '../../styles/theme';
import { VideoSubmissionForm } from './VideoSubmissionForm';
import { SubmissionHistory } from './SubmissionHistory';
import { AgencyInfo } from './AgencyInfo';
import { CreatorUser, VideoSubmission, SubmissionFormData, SubmissionStatus } from '../../types';
import { FirebaseSubmissionManager } from '../../firebase/FirebaseSubmissionManager';
import { LoadingSpinner } from '../shared/LoadingSpinner';

interface CreatorDashboardProps {
  user: CreatorUser;
  onLogout: () => void;
}

type CreatorView = 'overview' | 'submit' | 'history' | 'agency';

const DashboardContainer = styled.div`
  min-height: 100vh;
  background: ${theme.colors.neutral[50]};
  display: flex;
`;

const Sidebar = styled.div`
  width: 280px;
  background: linear-gradient(180deg, #1e40af 0%, #1d4ed8 100%);
  padding: ${theme.spacing[6]} ${theme.spacing[4]};
  display: flex;
  flex-direction: column;
  position: fixed;
  height: 100vh;
  left: 0;
  top: 0;
  z-index: 1000;
  
  @media (max-width: 768px) {
    transform: translateX(-100%);
    transition: transform 0.3s ease;
    
    &.open {
      transform: translateX(0);
    }
  }
`;

const Logo = styled.div`
  color: ${theme.colors.neutral[0]};
  font-size: ${theme.typography.fontSize['2xl']};
  font-weight: ${theme.typography.fontWeight.bold};
  margin-bottom: ${theme.spacing[8]};
  text-align: center;
`;

const Navigation = styled.nav`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: ${theme.spacing[2]};
`;

const NavItem = styled.button<{ active?: boolean }>`
  display: flex;
  align-items: center;
  gap: ${theme.spacing[3]};
  width: 100%;
  padding: ${theme.spacing[3]} ${theme.spacing[4]};
  border-radius: ${theme.borderRadius.lg};
  background: ${({ active }) => active ? 'rgba(255, 255, 255, 0.2)' : 'transparent'};
  color: ${({ active }) => active ? theme.colors.neutral[0] : 'rgba(255, 255, 255, 0.8)'};
  border: none;
  font-size: ${theme.typography.fontSize.base};
  font-weight: ${({ active }) => active ? theme.typography.fontWeight.semibold : theme.typography.fontWeight.medium};
  cursor: pointer;
  transition: all ${theme.transitions.fast};
  text-align: left;
  
  &:hover {
    background: rgba(255, 255, 255, 0.15);
    color: ${theme.colors.neutral[0]};
  }
  
  svg {
    width: 20px;
    height: 20px;
  }
`;

const UserSection = styled.div`
  border-top: 1px solid rgba(255, 255, 255, 0.2);
  padding-top: ${theme.spacing[4]};
  margin-top: ${theme.spacing[4]};
`;

const UserInfo = styled.div`
  display: flex;
  align-items: center;
  gap: ${theme.spacing[3]};
  padding: ${theme.spacing[3]};
  margin-bottom: ${theme.spacing[3]};
`;

const UserAvatar = styled.div`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.2);
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${theme.colors.neutral[0]};
  font-weight: ${theme.typography.fontWeight.semibold};
  font-size: ${theme.typography.fontSize.sm};
`;

const UserDetails = styled.div`
  flex: 1;
`;

const UserName = styled.div`
  color: ${theme.colors.neutral[0]};
  font-weight: ${theme.typography.fontWeight.semibold};
  font-size: ${theme.typography.fontSize.sm};
`;

const UserRole = styled.div`
  color: rgba(255, 255, 255, 0.7);
  font-size: ${theme.typography.fontSize.xs};
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;

const LogoutButton = styled.button`
  display: flex;
  align-items: center;
  gap: ${theme.spacing[3]};
  width: 100%;
  padding: ${theme.spacing[3]} ${theme.spacing[4]};
  border-radius: ${theme.borderRadius.lg};
  background: rgba(255, 255, 255, 0.1);
  color: rgba(255, 255, 255, 0.8);
  border: none;
  font-size: ${theme.typography.fontSize.sm};
  font-weight: ${theme.typography.fontWeight.medium};
  cursor: pointer;
  transition: all ${theme.transitions.fast};
  
  &:hover {
    background: rgba(255, 255, 255, 0.2);
    color: ${theme.colors.neutral[0]};
  }
  
  svg {
    width: 16px;
    height: 16px;
  }
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

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: ${theme.spacing[4]};
  margin-bottom: ${theme.spacing[6]};
`;

const StatCard = styled.div`
  background: ${theme.colors.neutral[0]};
  border-radius: ${theme.borderRadius.xl};
  padding: ${theme.spacing[6]};
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  border: 1px solid ${theme.colors.neutral[200]};
`;

const StatHeader = styled.div`
  display: flex;
  justify-content: between;
  align-items: flex-start;
  margin-bottom: ${theme.spacing[2]};
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

const StatValue = styled.div`
  font-size: ${theme.typography.fontSize['2xl']};
  font-weight: ${theme.typography.fontWeight.bold};
  color: ${theme.colors.neutral[900]};
  text-align: right;
`;

const StatLabel = styled.div`
  font-size: ${theme.typography.fontSize.sm};
  color: ${theme.colors.neutral[600]};
  text-align: right;
`;

const LoadingContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 400px;
  font-size: ${theme.typography.fontSize.lg};
  color: ${theme.colors.neutral[600]};
`;

export const CreatorDashboard: React.FC<CreatorDashboardProps> = ({
  user,
  onLogout
}) => {
  const [currentView, setCurrentView] = useState<CreatorView>('overview');
  const [submissions, setSubmissions] = useState<VideoSubmission[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const submissionManager = FirebaseSubmissionManager.getInstance();

  useEffect(() => {
    loadSubmissions();
  }, []);

  const loadSubmissions = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await submissionManager.getCreatorSubmissions();
      setSubmissions(response.items);
    } catch (error) {
      console.error('Failed to load submissions:', error);
      setError(error instanceof Error ? error.message : 'Failed to load submissions');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (formData: SubmissionFormData): Promise<boolean> => {
    try {
      setIsSubmitting(true);
      setError(null);
      await submissionManager.submitVideo(formData);
      await loadSubmissions();
      return true;
    } catch (error) {
      console.error('Submission failed:', error);
      setError(error instanceof Error ? error.message : 'Submission failed');
      return false;
    } finally {
      setIsSubmitting(false);
    }
  };

  const getUserInitials = (name: string): string => {
    return name
      .split(' ')
      .map(word => word.charAt(0))
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };

  const getViewTitle = (view: CreatorView): { title: string; subtitle: string } => {
    switch (view) {
      case 'overview':
        return {
          title: `Welcome back, ${user.username}! 👋`,
          subtitle: 'Ready to share your amazing content with the world?'
        };
      case 'submit':
        return {
          title: 'Submit Your Content ✨',
          subtitle: 'Share your TikTok or Instagram videos for review.'
        };
      case 'history':
        return {
          title: 'Your Submissions 📚',
          subtitle: 'Track the status of all your submitted content.'
        };
      case 'agency':
        return {
          title: 'My Agency 🏢',
          subtitle: 'Connect with your team and agency information.'
        };
      default:
        return {
          title: 'Creator Dashboard',
          subtitle: 'Your creative journey starts here'
        };
    }
  };

  const getStats = () => {
    const total = submissions.length;
    const pending = submissions.filter(s => s.status === SubmissionStatus.PENDING).length;
    const approved = submissions.filter(s => s.status === SubmissionStatus.APPROVED).length;
    
    return { total, pending, approved };
  };

  const renderCurrentView = () => {
    if (currentView === 'submit') {
      return (
        <VideoSubmissionForm
          user={user}
          onSubmit={handleSubmit}
          isSubmitting={isSubmitting}
        />
      );
    }
    
    if (currentView === 'history') {
      if (isLoading) {
        return (
          <LoadingContainer>
            <LoadingSpinner size="lg" />
          </LoadingContainer>
        );
      }
      
      return (
        <SubmissionHistory
          submissions={submissions}
          onRefresh={loadSubmissions}
        />
      );
    }
    
    if (currentView === 'agency') {
      return (
        <AgencyInfo user={user} />
      );
    }

    // Overview
    const stats = getStats();
    
    return (
      <>
        <StatsGrid>
          <StatCard>
            <StatHeader>
              <StatIcon color={theme.colors.primary[500]}>
                <Video />
              </StatIcon>
              <div>
                <StatValue>{stats.total}</StatValue>
                <StatLabel>Total Submissions</StatLabel>
              </div>
            </StatHeader>
          </StatCard>
          
          <StatCard>
            <StatHeader>
              <StatIcon color={theme.colors.warning.main}>
                <Clock />
              </StatIcon>
              <div>
                <StatValue>{stats.pending}</StatValue>
                <StatLabel>Under Review</StatLabel>
              </div>
            </StatHeader>
          </StatCard>
          
          <StatCard>
            <StatHeader>
              <StatIcon color={theme.colors.success.main}>
                <CheckCircle />
              </StatIcon>
              <div>
                <StatValue>{stats.approved}</StatValue>
                <StatLabel>Approved</StatLabel>
              </div>
            </StatHeader>
          </StatCard>
        </StatsGrid>
        
        <VideoSubmissionForm
          user={user}
          onSubmit={handleSubmit}
          isSubmitting={isSubmitting}
        />
      </>
    );
  };

  const navigationItems = [
    {
      id: 'overview' as CreatorView,
      label: 'Overview',
      icon: TrendingUp
    },
    {
      id: 'submit' as CreatorView,
      label: 'Submit Content',
      icon: Upload
    },
    {
      id: 'agency' as CreatorView,
      label: 'My Agency',
      icon: Building2
    },
    {
      id: 'history' as CreatorView,
      label: 'My Submissions',
      icon: History
    }
  ];

  const { title, subtitle } = getViewTitle(currentView);

  return (
    <DashboardContainer>
      <Sidebar>
        <Logo>
          🎬 VideoPortal
        </Logo>

        <Navigation>
          {navigationItems.map((item) => {
            const IconComponent = item.icon;
            return (
              <NavItem
                key={item.id}
                active={currentView === item.id}
                onClick={() => setCurrentView(item.id)}
              >
                <IconComponent />
                {item.label}
              </NavItem>
            );
          })}
        </Navigation>

        <UserSection>
          <UserInfo>
            <UserAvatar>
              {getUserInitials(user.username)}
            </UserAvatar>
            <UserDetails>
              <UserName>{user.username}</UserName>
              <UserRole>Creator</UserRole>
            </UserDetails>
          </UserInfo>

          <LogoutButton onClick={onLogout}>
            <LogOut />
            Logout
          </LogoutButton>
        </UserSection>
      </Sidebar>

      <MainContent>
        <ContentHeader>
          <PageTitle>{title}</PageTitle>
          <PageSubtitle>{subtitle}</PageSubtitle>
        </ContentHeader>

        {error && (
          <div style={{
            background: theme.colors.error.light,
            color: theme.colors.error.dark,
            padding: theme.spacing[4],
            borderRadius: theme.borderRadius.md,
            marginBottom: theme.spacing[4]
          }}>
            {error}
          </div>
        )}

        {renderCurrentView()}
      </MainContent>
    </DashboardContainer>
  );
};