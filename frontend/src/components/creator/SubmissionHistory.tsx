/**
 * SubmissionHistory - Clean history view for creator submissions
 * Shows status, feedback, and submission details
 */

import React from 'react';
import styled from 'styled-components';
import { theme } from '../../styles/theme';
import { Card, Button } from '../../styles/GlobalStyles';
import { StatusBadge } from '../shared/StatusBadge';
import { VideoSubmission } from '../../types';

interface SubmissionHistoryProps {
  submissions: VideoSubmission[];
  onRefresh: () => Promise<void>;
}

const HistoryContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${theme.spacing[4]};
`;

const EmptyState = styled(Card)`
  text-align: center;
  padding: ${theme.spacing[8]} ${theme.spacing[4]};
  color: ${theme.colors.neutral[500]};
`;

const EmptyIcon = styled.div`
  font-size: ${theme.typography.fontSize['4xl']};
  margin-bottom: ${theme.spacing[4]};
`;

const EmptyMessage = styled.p`
  font-size: ${theme.typography.fontSize.lg};
  margin-bottom: ${theme.spacing[2]};
`;

const EmptySubtext = styled.p`
  font-size: ${theme.typography.fontSize.sm};
`;

const SubmissionCard = styled(Card)`
  transition: all ${theme.transitions.fast};
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: ${theme.shadows.md};
  }
`;

const SubmissionHeader = styled.div`
  display: flex;
  justify-content: between;
  align-items: flex-start;
  gap: ${theme.spacing[4]};
  margin-bottom: ${theme.spacing[4]};
`;

const SubmissionInfo = styled.div`
  flex: 1;
`;

const VideoUrl = styled.a`
  display: block;
  font-weight: ${theme.typography.fontWeight.medium};
  color: ${theme.colors.primary[600]};
  text-decoration: none;
  margin-bottom: ${theme.spacing[2]};
  word-break: break-all;
  
  &:hover {
    text-decoration: underline;
  }
`;

const SubmissionMeta = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: ${theme.spacing[3]};
  font-size: ${theme.typography.fontSize.sm};
  color: ${theme.colors.neutral[500]};
`;

const Platform = styled.span`
  background: ${theme.colors.neutral[100]};
  color: ${theme.colors.neutral[700]};
  padding: ${theme.spacing[1]} ${theme.spacing[2]};
  border-radius: ${theme.borderRadius.sm};
  font-weight: ${theme.typography.fontWeight.medium};
  text-transform: capitalize;
`;

const SubmissionContent = styled.div`
  margin-bottom: ${theme.spacing[4]};
`;

const Caption = styled.p`
  color: ${theme.colors.neutral[700]};
  margin-bottom: ${theme.spacing[2]};
  font-style: italic;
`;

const Hashtags = styled.p`
  color: ${theme.colors.primary[600]};
  font-size: ${theme.typography.fontSize.sm};
  margin-bottom: ${theme.spacing[2]};
`;

const Notes = styled.p`
  color: ${theme.colors.neutral[600]};
  font-size: ${theme.typography.fontSize.sm};
  background: ${theme.colors.neutral[50]};
  padding: ${theme.spacing[3]};
  border-radius: ${theme.borderRadius.md};
  margin-bottom: ${theme.spacing[3]};
`;

const AdminFeedback = styled.div`
  background: ${theme.colors.primary[50]};
  border-left: 4px solid ${theme.colors.primary[500]};
  padding: ${theme.spacing[3]} ${theme.spacing[4]};
  border-radius: 0 ${theme.borderRadius.md} ${theme.borderRadius.md} 0;
`;

const FeedbackLabel = styled.div`
  font-weight: ${theme.typography.fontWeight.semibold};
  color: ${theme.colors.primary[700]};
  font-size: ${theme.typography.fontSize.sm};
  margin-bottom: ${theme.spacing[1]};
`;

const FeedbackText = styled.p`
  color: ${theme.colors.primary[800]};
  font-size: ${theme.typography.fontSize.sm};
`;

const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

export const SubmissionHistory: React.FC<SubmissionHistoryProps> = ({
  submissions,
  onRefresh
}) => {
  if (submissions.length === 0) {
    return (
      <EmptyState className="fade-in">
        <EmptyIcon>📹</EmptyIcon>
        <EmptyMessage>No submissions yet</EmptyMessage>
        <EmptySubtext>
          Submit your first video using the form on the left to get started!
        </EmptySubtext>
        <Button 
          variant="ghost" 
          onClick={onRefresh}
          style={{ marginTop: theme.spacing[4] }}
        >
          Refresh
        </Button>
      </EmptyState>
    );
  }

  return (
    <HistoryContainer>
      {submissions.map((submission, index) => (
        <SubmissionCard 
          key={submission.id} 
          className="fade-in"
          style={{ animationDelay: `${index * 50}ms` }}
        >
          <SubmissionHeader>
            <SubmissionInfo>
              <VideoUrl 
                href={submission.videoUrl}
                target="_blank"
                rel="noopener noreferrer"
              >
                {submission.videoUrl}
              </VideoUrl>
              <SubmissionMeta>
                <Platform>{submission.platform}</Platform>
                <span>•</span>
                <span>{formatDate(submission.submittedAt)}</span>
              </SubmissionMeta>
            </SubmissionInfo>
            <StatusBadge status={submission.status} />
          </SubmissionHeader>

          <SubmissionContent>
            {submission.caption && (
              <Caption>"{submission.caption}"</Caption>
            )}
            
            {submission.hashtags && submission.hashtags.length > 0 && (
              <Hashtags>
                {submission.hashtags.join(' ')}
              </Hashtags>
            )}
            
            {submission.notes && (
              <Notes>{submission.notes}</Notes>
            )}
          </SubmissionContent>

          {submission.adminFeedback && (
            <AdminFeedback className="slide-in">
              <FeedbackLabel>Admin Feedback:</FeedbackLabel>
              <FeedbackText>{submission.adminFeedback}</FeedbackText>
            </AdminFeedback>
          )}
        </SubmissionCard>
      ))}
      
      <Button 
        variant="ghost" 
        onClick={onRefresh}
        style={{ alignSelf: 'center' }}
      >
        Refresh History
      </Button>
    </HistoryContainer>
  );
};