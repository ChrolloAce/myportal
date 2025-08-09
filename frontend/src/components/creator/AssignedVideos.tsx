/**
 * AssignedVideos - Shows pre-approved videos assigned by admin to creator
 * Displays admin-uploaded content assigned to the current creator
 */

import React from 'react';
import styled from 'styled-components';
import { professionalTheme } from '../../styles/professionalTheme';
import { Card } from '../../styles/ProfessionalStyles';
import { VideoSubmission, Platform } from '../../types';
import { 
  Crown,
  ExternalLink,
  Calendar,
  Hash,
  CheckCircle,
  Video
} from 'lucide-react';

interface AssignedVideosProps {
  assignedVideos: VideoSubmission[];
}

const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${professionalTheme.spacing[4]};
`;

const Header = styled.div`
  display: flex;
  align-items: center;
  gap: ${professionalTheme.spacing[2]};
  margin-bottom: ${professionalTheme.spacing[4]};
`;

const Title = styled.h3`
  font-size: ${professionalTheme.typography.fontSize.lg};
  font-weight: ${professionalTheme.typography.fontWeight.semibold};
  color: ${professionalTheme.colors.gray[900]};
  margin: 0;
`;

const Badge = styled.div`
  background: ${professionalTheme.colors.primary[100]};
  color: ${professionalTheme.colors.primary[700]};
  padding: ${professionalTheme.spacing[1]} ${professionalTheme.spacing[2]};
  border-radius: ${professionalTheme.borderRadius.full};
  font-size: ${professionalTheme.typography.fontSize.xs};
  font-weight: ${professionalTheme.typography.fontWeight.medium};
`;

const VideoGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: ${professionalTheme.spacing[4]};
`;

const VideoCard = styled(Card)`
  padding: ${professionalTheme.spacing[4]};
  border-left: 4px solid ${professionalTheme.colors.primary[500]};
  transition: all 0.2s ease;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: ${professionalTheme.shadows.lg};
  }
`;

const VideoHeader = styled.div`
  display: flex;
  align-items: flex-start;
  gap: ${professionalTheme.spacing[3]};
  margin-bottom: ${professionalTheme.spacing[4]};
`;

const PlatformIcon = styled.div<{ platform: Platform }>`
  width: 40px;
  height: 40px;
  border-radius: ${professionalTheme.borderRadius.lg};
  display: flex;
  align-items: center;
  justify-content: center;
  background: ${props => 
    props.platform === Platform.TIKTOK 
      ? professionalTheme.colors.gray[900]
      : 'linear-gradient(45deg, #f09433 0%,#e6683c 25%,#dc2743 50%,#cc2366 75%,#bc1888 100%)'
  };
  color: white;
  font-weight: ${professionalTheme.typography.fontWeight.bold};
  font-size: ${professionalTheme.typography.fontSize.xs};
`;

const VideoInfo = styled.div`
  flex: 1;
`;

const VideoTitle = styled.h4`
  font-size: ${professionalTheme.typography.fontSize.base};
  font-weight: ${professionalTheme.typography.fontWeight.semibold};
  color: ${professionalTheme.colors.gray[900]};
  margin: 0 0 ${professionalTheme.spacing[1]} 0;
  line-height: ${professionalTheme.typography.lineHeight.tight};
`;

const VideoMeta = styled.div`
  display: flex;
  align-items: center;
  gap: ${professionalTheme.spacing[2]};
  font-size: ${professionalTheme.typography.fontSize.xs};
  color: ${professionalTheme.colors.gray[600]};
  margin-bottom: ${professionalTheme.spacing[2]};
`;

const StatusBadge = styled.div`
  display: inline-flex;
  align-items: center;
  gap: ${professionalTheme.spacing[1]};
  padding: ${professionalTheme.spacing[1]} ${professionalTheme.spacing[2]};
  background: ${professionalTheme.colors.success[100]};
  color: ${professionalTheme.colors.success[700]};
  border-radius: ${professionalTheme.borderRadius.full};
  font-size: ${professionalTheme.typography.fontSize.xs};
  font-weight: ${professionalTheme.typography.fontWeight.medium};
`;

const VideoDescription = styled.div`
  color: ${professionalTheme.colors.gray[700]};
  font-size: ${professionalTheme.typography.fontSize.sm};
  line-height: ${professionalTheme.typography.lineHeight.relaxed};
  margin-bottom: ${professionalTheme.spacing[3]};
`;

const HashtagList = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: ${professionalTheme.spacing[1]};
  margin-bottom: ${professionalTheme.spacing[3]};
`;

const Hashtag = styled.span`
  background: ${professionalTheme.colors.primary[50]};
  color: ${professionalTheme.colors.primary[700]};
  padding: ${professionalTheme.spacing[1]} ${professionalTheme.spacing[2]};
  border-radius: ${professionalTheme.borderRadius.md};
  font-size: ${professionalTheme.typography.fontSize.xs};
  font-weight: ${professionalTheme.typography.fontWeight.medium};
`;

const ActionButtons = styled.div`
  display: flex;
  gap: ${professionalTheme.spacing[2]};
  margin-top: ${professionalTheme.spacing[4]};
`;

const ActionButton = styled.button`
  display: flex;
  align-items: center;
  gap: ${professionalTheme.spacing[1]};
  padding: ${professionalTheme.spacing[2]} ${professionalTheme.spacing[3]};
  background: ${professionalTheme.colors.primary[500]};
  color: white;
  border: none;
  border-radius: ${professionalTheme.borderRadius.md};
  font-size: ${professionalTheme.typography.fontSize.xs};
  font-weight: ${professionalTheme.typography.fontWeight.medium};
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:hover {
    background: ${professionalTheme.colors.primary[600]};
  }
`;

const AdminNote = styled.div`
  background: ${professionalTheme.colors.primary[50]};
  border: 1px solid ${professionalTheme.colors.primary[200]};
  border-radius: ${professionalTheme.borderRadius.lg};
  padding: ${professionalTheme.spacing[3]};
  margin-top: ${professionalTheme.spacing[3]};
`;

const AdminNoteHeader = styled.div`
  display: flex;
  align-items: center;
  gap: ${professionalTheme.spacing[2]};
  margin-bottom: ${professionalTheme.spacing[2]};
  font-size: ${professionalTheme.typography.fontSize.sm};
  font-weight: ${professionalTheme.typography.fontWeight.medium};
  color: ${professionalTheme.colors.primary[700]};
`;

const AdminNoteText = styled.div`
  font-size: ${professionalTheme.typography.fontSize.sm};
  color: ${professionalTheme.colors.primary[700]};
  line-height: ${professionalTheme.typography.lineHeight.relaxed};
`;

const EmptyState = styled.div`
  text-align: center;
  padding: ${professionalTheme.spacing[8]};
  color: ${professionalTheme.colors.gray[600]};
`;

export const AssignedVideos: React.FC<AssignedVideosProps> = ({ assignedVideos }) => {
  if (assignedVideos.length === 0) {
    return (
      <Container>
        <Header>
          <Crown size={20} color={professionalTheme.colors.primary[500]} />
          <Title>Assigned Videos</Title>
          <Badge>0</Badge>
        </Header>
        
        <EmptyState>
          <Crown size={48} style={{ marginBottom: professionalTheme.spacing[4], color: professionalTheme.colors.gray[400] }} />
          <p>No videos assigned by admin yet.</p>
          <p style={{ fontSize: professionalTheme.typography.fontSize.sm }}>
            Your admin can upload pre-approved videos and assign them to you.
          </p>
        </EmptyState>
      </Container>
    );
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  return (
    <Container>
      <Header>
        <Crown size={20} color={professionalTheme.colors.primary[500]} />
        <Title>Assigned Videos</Title>
        <Badge>{assignedVideos.length}</Badge>
      </Header>

      <VideoGrid>
        {assignedVideos.map((video) => (
          <VideoCard key={video.id}>
            <VideoHeader>
              <PlatformIcon platform={video.platform}>
                {video.platform === Platform.TIKTOK ? '🎵' : '📸'}
              </PlatformIcon>
              <VideoInfo>
                <VideoTitle>
                  {video.caption || 'Untitled Video'}
                </VideoTitle>
                <VideoMeta>
                  <Calendar size={12} />
                  <span>Assigned {formatDate(video.submittedAt)}</span>
                  <StatusBadge>
                    <CheckCircle size={12} />
                    Pre-approved
                  </StatusBadge>
                </VideoMeta>
              </VideoInfo>
            </VideoHeader>

            {video.caption && (
              <VideoDescription>
                {video.caption}
              </VideoDescription>
            )}

            {video.hashtags && video.hashtags.length > 0 && (
              <HashtagList>
                <Hash size={12} color={professionalTheme.colors.primary[500]} />
                {video.hashtags.map((hashtag, index) => (
                  <Hashtag key={index}>
                    {hashtag.startsWith('#') ? hashtag : `#${hashtag}`}
                  </Hashtag>
                ))}
              </HashtagList>
            )}

            {video.adminFeedback && (
              <AdminNote>
                <AdminNoteHeader>
                  <Crown size={14} />
                  Admin Note
                </AdminNoteHeader>
                <AdminNoteText>
                  {video.adminFeedback}
                </AdminNoteText>
              </AdminNote>
            )}

            <ActionButtons>
              <ActionButton
                onClick={() => window.open(video.videoUrl, '_blank')}
              >
                <ExternalLink size={12} />
                View Video
              </ActionButton>
              
              <ActionButton
                onClick={() => {
                  // Copy URL to clipboard
                  navigator.clipboard.writeText(video.videoUrl);
                  // You could add a toast notification here
                }}
              >
                <Video size={12} />
                Copy URL
              </ActionButton>
            </ActionButtons>
          </VideoCard>
        ))}
      </VideoGrid>
    </Container>
  );
};