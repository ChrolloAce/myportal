/**
 * CreatorDashboard - Professional interface for content creators
 * Clean, modern experience focused on video submission
 */

import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { professionalTheme } from '../../styles/professionalTheme';
import { Container, Card } from '../../styles/ProfessionalStyles';
import { VideoSubmissionForm } from './VideoSubmissionForm';
import { SubmissionHistory } from './SubmissionHistory';
import { DashboardHeader } from './DashboardHeader';
import { CreatorUser, VideoSubmission, SubmissionFormData } from '../../types';
import { FirebaseSubmissionManager } from '../../firebase/FirebaseSubmissionManager';
import { LoadingSpinner } from '../shared/LoadingSpinner';

interface CreatorDashboardProps {
  user: CreatorUser;
  onLogout: () => void;
}

const DashboardContainer = styled.div`
  min-height: 100vh;
  background: ${professionalTheme.colors.gray[25]};
`;

const MainContent = styled.main`
  padding: ${professionalTheme.spacing[8]} 0;
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: ${professionalTheme.spacing[6]};
  margin-bottom: ${professionalTheme.spacing[8]};
`;

const StatCard = styled(Card)`
  padding: ${professionalTheme.spacing[6]};
  background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%);
  color: ${professionalTheme.colors.white};
  border: none;
  
  &:nth-child(2) {
    background: linear-gradient(135deg, #10b981 0%, #047857 100%);
  }
  
  &:nth-child(3) {
    background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%);
  }
`;

const StatValue = styled.div`
  font-size: ${professionalTheme.typography.fontSize['3xl']};
  font-weight: ${professionalTheme.typography.fontWeight.bold};
  margin-bottom: ${professionalTheme.spacing[2]};
`;

const StatLabel = styled.div`
  font-size: ${professionalTheme.typography.fontSize.sm};
  opacity: 0.9;
  margin-bottom: ${professionalTheme.spacing[1]};
`;

const StatChange = styled.div`
  font-size: ${professionalTheme.typography.fontSize.xs};
  opacity: 0.8;
`;

const DashboardGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: ${professionalTheme.spacing[8]};
  align-items: start;
  
  @media (max-width: ${professionalTheme.breakpoints.lg}) {
    grid-template-columns: 1fr;
    gap: ${professionalTheme.spacing[6]};
  }
`;

const WelcomeSection = styled.section`
  margin-bottom: ${professionalTheme.spacing[8]};
`;

const WelcomeTitle = styled.h1`
  margin-bottom: ${professionalTheme.spacing[4]};
  color: ${professionalTheme.colors.gray[900]};
  font-size: ${professionalTheme.typography.fontSize['2xl']};
  font-weight: ${professionalTheme.typography.fontWeight.semibold};
`;

const WelcomeMessage = styled.p`
  font-size: ${professionalTheme.typography.fontSize.base};
  color: ${professionalTheme.colors.gray[600]};
  margin-bottom: ${professionalTheme.spacing[6]};
`;

const LoadingContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 200px;
`;

const ErrorMessage = styled.div`
  background: ${professionalTheme.colors.error[50]};
  border: 1px solid ${professionalTheme.colors.error[200]};
  color: ${professionalTheme.colors.error[700]};
  padding: ${professionalTheme.spacing[4]};
  border-radius: ${professionalTheme.borderRadius.md};
  margin-bottom: ${professionalTheme.spacing[6]};
  font-size: ${professionalTheme.typography.fontSize.sm};
`;

const SectionTitle = styled.h2`
  font-size: ${professionalTheme.typography.fontSize.lg};
  font-weight: ${professionalTheme.typography.fontWeight.semibold};
  color: ${professionalTheme.colors.gray[900]};
  margin-bottom: ${professionalTheme.spacing[4]};
`;

export const CreatorDashboard: React.FC<CreatorDashboardProps> = ({
  user,
  onLogout
}) => {
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
      const response = await submissionManager.getCreatorSubmissions(1, 20);
      setSubmissions(response.items);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load submissions');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmitVideo = async (formData: SubmissionFormData) => {
    try {
      setIsSubmitting(true);
      setError(null);
      
      const newSubmission = await submissionManager.submitVideo(formData);
      setSubmissions(prev => [newSubmission, ...prev]);
      
      return true; // Success signal for form reset
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Submission failed');
      return false;
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <DashboardContainer>
      <DashboardHeader user={user} onLogout={onLogout} />
      
      <Container>
        <MainContent>
          <WelcomeSection className="fade-in">
            <WelcomeTitle>Welcome back, {user.username}</WelcomeTitle>
            <WelcomeMessage>
              Track performance metrics and analyze trends across your content submissions.
            </WelcomeMessage>
          </WelcomeSection>

          <StatsGrid>
            <StatCard>
              <StatValue>12</StatValue>
              <StatLabel>Total Submissions</StatLabel>
              <StatChange>+2.5% vs last month</StatChange>
            </StatCard>
            
            <StatCard>
              <StatValue>8</StatValue>
              <StatLabel>Approved Content</StatLabel>
              <StatChange>+18.2% vs last month</StatChange>
            </StatCard>
            
            <StatCard>
              <StatValue>67%</StatValue>
              <StatLabel>Approval Rate</StatLabel>
              <StatChange>+12% vs last month</StatChange>
            </StatCard>
          </StatsGrid>

          {error && (
            <ErrorMessage className="slide-in">
              {error}
            </ErrorMessage>
          )}

          <DashboardGrid>
            <VideoSubmissionForm
              user={user}
              onSubmit={handleSubmitVideo}
              isSubmitting={isSubmitting}
            />
            
            <div>
              <SectionTitle>Your Submissions</SectionTitle>
              {isLoading ? (
                <LoadingContainer>
                  <LoadingSpinner size="lg" />
                </LoadingContainer>
              ) : (
                <SubmissionHistory 
                  submissions={submissions}
                  onRefresh={loadSubmissions}
                />
              )}
            </div>
          </DashboardGrid>
        </MainContent>
      </Container>
    </DashboardContainer>
  );
};