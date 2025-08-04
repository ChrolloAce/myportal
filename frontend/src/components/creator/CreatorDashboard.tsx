/**
 * CreatorDashboard - Main interface for content creators
 * Simple, joyful experience focused on video submission
 */

import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { theme } from '../../styles/theme';
import { Container } from '../../styles/GlobalStyles';
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
  background: ${theme.colors.neutral[50]};
`;

const MainContent = styled.main`
  padding: ${theme.spacing[6]} 0;
`;

const DashboardGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: ${theme.spacing[8]};
  align-items: start;
  
  @media (max-width: ${theme.breakpoints.lg}) {
    grid-template-columns: 1fr;
    gap: ${theme.spacing[6]};
  }
`;

const WelcomeSection = styled.section`
  margin-bottom: ${theme.spacing[8]};
`;

const WelcomeTitle = styled.h1`
  margin-bottom: ${theme.spacing[2]};
  color: ${theme.colors.neutral[900]};
`;

const WelcomeMessage = styled.p`
  font-size: ${theme.typography.fontSize.lg};
  color: ${theme.colors.neutral[600]};
`;

const LoadingContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 200px;
`;

const ErrorMessage = styled.div`
  padding: ${theme.spacing[4]};
  background: ${theme.colors.error.light};
  color: ${theme.colors.error.dark};
  border-radius: ${theme.borderRadius.md};
  margin-bottom: ${theme.spacing[6]};
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
            <WelcomeTitle>Welcome back, {user.username}! 👋</WelcomeTitle>
            <WelcomeMessage>
              Ready to share your latest creation? Submit your video below and track its progress.
            </WelcomeMessage>
          </WelcomeSection>

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
              <h2 style={{ marginBottom: theme.spacing[4] }}>Your Submissions</h2>
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