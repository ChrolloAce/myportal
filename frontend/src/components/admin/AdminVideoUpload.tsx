/**
 * AdminVideoUpload - Admin component for uploading pre-approved videos and assigning to users
 * Allows admins to create content and assign it directly to agency creators
 */

import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { professionalTheme } from '../../styles/professionalTheme';
import { Card, Button } from '../../styles/ProfessionalStyles';
import { FirebaseSubmissionManager } from '../../firebase/FirebaseSubmissionManager';
import { FirebaseCorporationManager } from '../../firebase/FirebaseCorporationManager';
import { FirebaseProfileManager } from '../../firebase/FirebaseProfileManager';
import { AdminUser, CreatorUser, Platform, VideoSubmission } from '../../types';
import { 
  Upload,
  User,
  CheckCircle,
  AlertCircle,
  Video,
  Users,
  Crown
} from 'lucide-react';

interface AdminVideoUploadProps {
  user: AdminUser;
}

interface UploadFormData {
  tiktokUrl: string;
  instagramUrl: string;
  caption: string;
  hashtags: string;
  notes: string;
  assignedUserId: string;
}

const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${professionalTheme.spacing[6]};
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: ${professionalTheme.spacing[6]};
`;

const Title = styled.h2`
  font-size: ${professionalTheme.typography.fontSize['2xl']};
  font-weight: ${professionalTheme.typography.fontWeight.bold};
  color: ${professionalTheme.colors.gray[900]};
  margin: 0;
  display: flex;
  align-items: center;
  gap: ${professionalTheme.spacing[2]};
`;

const Subtitle = styled.p`
  color: ${professionalTheme.colors.gray[600]};
  margin: ${professionalTheme.spacing[2]} 0 0 0;
  font-size: ${professionalTheme.typography.fontSize.base};
`;

const FormCard = styled(Card)`
  padding: ${professionalTheme.spacing[6]};
`;

const FormGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 300px;
  gap: ${professionalTheme.spacing[6]};
  
  @media (max-width: ${professionalTheme.breakpoints.lg}) {
    grid-template-columns: 1fr;
  }
`;

const FormSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${professionalTheme.spacing[4]};
`;

const AssignmentSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${professionalTheme.spacing[4]};
`;

const SectionTitle = styled.h3`
  font-size: ${professionalTheme.typography.fontSize.lg};
  font-weight: ${professionalTheme.typography.fontWeight.semibold};
  color: ${professionalTheme.colors.gray[900]};
  margin: 0;
  display: flex;
  align-items: center;
  gap: ${professionalTheme.spacing[2]};
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${professionalTheme.spacing[2]};
`;

const Label = styled.label`
  font-size: ${professionalTheme.typography.fontSize.sm};
  font-weight: ${professionalTheme.typography.fontWeight.medium};
  color: ${professionalTheme.colors.gray[700]};
`;

const Input = styled.input`
  padding: ${professionalTheme.spacing[3]};
  border: 1px solid ${professionalTheme.colors.gray[300]};
  border-radius: ${professionalTheme.borderRadius.lg};
  font-size: ${professionalTheme.typography.fontSize.sm};
  transition: all 0.2s ease;
  
  &:focus {
    outline: none;
    border-color: ${professionalTheme.colors.primary[500]};
    box-shadow: 0 0 0 3px ${professionalTheme.colors.primary[100]};
  }
  
  &::placeholder {
    color: ${professionalTheme.colors.gray[400]};
  }
`;

const TextArea = styled.textarea`
  padding: ${professionalTheme.spacing[3]};
  border: 1px solid ${professionalTheme.colors.gray[300]};
  border-radius: ${professionalTheme.borderRadius.lg};
  font-size: ${professionalTheme.typography.fontSize.sm};
  min-height: 100px;
  resize: vertical;
  font-family: inherit;
  transition: all 0.2s ease;
  
  &:focus {
    outline: none;
    border-color: ${professionalTheme.colors.primary[500]};
    box-shadow: 0 0 0 3px ${professionalTheme.colors.primary[100]};
  }
  
  &::placeholder {
    color: ${professionalTheme.colors.gray[400]};
  }
`;

// Removed unused Select component

const UserCard = styled.div<{ selected: boolean }>`
  padding: ${professionalTheme.spacing[4]};
  border: 2px solid ${props => props.selected ? professionalTheme.colors.primary[500] : professionalTheme.colors.gray[200]};
  border-radius: ${professionalTheme.borderRadius.lg};
  background: ${props => props.selected ? professionalTheme.colors.primary[50] : professionalTheme.colors.white};
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  gap: ${professionalTheme.spacing[3]};
  
  &:hover {
    border-color: ${professionalTheme.colors.primary[300]};
    background: ${professionalTheme.colors.primary[25]};
  }
`;

const UserAvatar = styled.div`
  width: 40px;
  height: 40px;
  border-radius: ${professionalTheme.borderRadius.full};
  background: ${professionalTheme.colors.primary[100]};
  color: ${professionalTheme.colors.primary[600]};
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: ${professionalTheme.typography.fontWeight.semibold};
  font-size: ${professionalTheme.typography.fontSize.sm};
`;

const UserInfo = styled.div`
  flex: 1;
`;

const UserName = styled.div`
  font-size: ${professionalTheme.typography.fontSize.sm};
  font-weight: ${professionalTheme.typography.fontWeight.medium};
  color: ${professionalTheme.colors.gray[900]};
`;

const UserEmail = styled.div`
  font-size: ${professionalTheme.typography.fontSize.xs};
  color: ${professionalTheme.colors.gray[600]};
`;

const SelectedIndicator = styled.div`
  width: 20px;
  height: 20px;
  border-radius: ${professionalTheme.borderRadius.full};
  background: ${professionalTheme.colors.primary[500]};
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: ${professionalTheme.spacing[3]};
  margin-top: ${professionalTheme.spacing[6]};
`;

const SuccessMessage = styled.div`
  display: flex;
  align-items: center;
  gap: ${professionalTheme.spacing[2]};
  padding: ${professionalTheme.spacing[4]};
  background: ${professionalTheme.colors.success[50]};
  border: 1px solid ${professionalTheme.colors.success[200]};
  border-radius: ${professionalTheme.borderRadius.lg};
  color: ${professionalTheme.colors.success[700]};
  margin-bottom: ${professionalTheme.spacing[4]};
`;

const ErrorMessage = styled.div`
  display: flex;
  align-items: center;
  gap: ${professionalTheme.spacing[2]};
  padding: ${professionalTheme.spacing[4]};
  background: ${professionalTheme.colors.error[50]};
  border: 1px solid ${professionalTheme.colors.error[200]};
  border-radius: ${professionalTheme.borderRadius.lg};
  color: ${professionalTheme.colors.error[700]};
  margin-bottom: ${professionalTheme.spacing[4]};
`;

const RecentUploadsCard = styled(Card)`
  padding: ${professionalTheme.spacing[6]};
  margin-top: ${professionalTheme.spacing[6]};
`;

const RecentUploadsList = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${professionalTheme.spacing[3]};
  margin-top: ${professionalTheme.spacing[4]};
`;

const RecentUploadItem = styled.div`
  display: flex;
  align-items: center;
  gap: ${professionalTheme.spacing[3]};
  padding: ${professionalTheme.spacing[3]};
  background: ${professionalTheme.colors.gray[50]};
  border-radius: ${professionalTheme.borderRadius.lg};
`;

export const AdminVideoUpload: React.FC<AdminVideoUploadProps> = ({ user }) => {
  const [formData, setFormData] = useState<UploadFormData>({
    tiktokUrl: '',
    instagramUrl: '',
    caption: '',
    hashtags: '',
    notes: '',
    assignedUserId: ''
  });
  const [creators, setCreators] = useState<CreatorUser[]>([]);
  const [recentUploads, setRecentUploads] = useState<VideoSubmission[]>([]);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const submissionManager = FirebaseSubmissionManager.getInstance();
  const corporationManager = FirebaseCorporationManager.getInstance();
  const profileManager = FirebaseProfileManager.getInstance();

  useEffect(() => {
    loadCreators();
    loadRecentUploads();
  }, []);

  const loadCreators = async () => {
    try {
      console.log('Loading creators for corporation:', user.corporationId);
      
      if (!user.corporationId) {
        console.log('No corporation ID found for user');
        setCreators([]);
        return;
      }

      // Get corporation members
      const members = await corporationManager.getCorporationMembers(user.corporationId);
      console.log('Found corporation members:', members.length);

      // Filter for creators (not admins) and get their full profiles
      const creatorMembers = members.filter(member => member.role === 'creator');
      console.log('Creator members:', creatorMembers.length);

      // Load full user profiles for each creator
      const creatorProfiles: CreatorUser[] = [];
      for (const member of creatorMembers) {
        try {
          const profile = await profileManager.getProfile(member.userId);
          if (profile && profile.role === 'creator') {
            creatorProfiles.push({
              ...profile,
              corporationId: user.corporationId,
              corporationRole: member.role,
              joinedCorporationAt: member.joinedAt
            } as CreatorUser);
          }
        } catch (profileError) {
          console.warn('Failed to load profile for creator:', member.userId, profileError);
        }
      }

      console.log('Loaded creator profiles:', creatorProfiles.length);
      setCreators(creatorProfiles);
    } catch (error) {
      console.error('Error loading creators:', error);
      setCreators([]);
    }
  };

  const loadRecentUploads = async () => {
    try {
      const response = await submissionManager.getSubmissions();
      // Filter for admin-created submissions
      const adminUploads = response.items.filter(submission => 
        submission.adminId === user.id && submission.status === 'approved'
      );
      setRecentUploads(adminUploads.slice(0, 5));
    } catch (error) {
      console.error('Error loading recent uploads:', error);
    }
  };

  const handleInputChange = (field: keyof UploadFormData) => (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setFormData(prev => ({
      ...prev,
      [field]: e.target.value
    }));
  };

  const handleUserSelect = (userId: string) => {
    setFormData(prev => ({
      ...prev,
      assignedUserId: userId
    }));
  };

  const isValidUrl = (url: string, platform: 'tiktok' | 'instagram'): boolean => {
    if (!url.trim()) return true; // Empty is valid (optional)
    
    if (platform === 'tiktok') {
      return url.toLowerCase().includes('tiktok.com');
    } else {
      return url.toLowerCase().includes('instagram.com') || url.toLowerCase().includes('instagr.am');
    }
  };

  const hasAtLeastOneUrl = (): boolean => {
    return !!(formData.tiktokUrl?.trim() || formData.instagramUrl?.trim());
  };

  const isFormValid = (): boolean => {
    return (
      hasAtLeastOneUrl() &&
      isValidUrl(formData.tiktokUrl, 'tiktok') &&
      isValidUrl(formData.instagramUrl, 'instagram') &&
      formData.assignedUserId.trim() !== ''
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isFormValid()) return;

    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const urls: { url: string; platform: Platform }[] = [];
      
      if (formData.tiktokUrl?.trim()) {
        urls.push({ url: formData.tiktokUrl.trim(), platform: Platform.TIKTOK });
      }
      if (formData.instagramUrl?.trim()) {
        urls.push({ url: formData.instagramUrl.trim(), platform: Platform.INSTAGRAM });
      }

      // Create submissions for each URL
      for (const { url, platform } of urls) {
        // Create a pre-approved submission assigned to the selected user
        const submissionData = {
          creatorId: formData.assignedUserId,
          creatorUsername: creators.find(c => c.id === formData.assignedUserId)?.username || 'Assigned User',
          videoUrl: url,
          platform,
          caption: formData.caption || undefined,
          hashtags: formData.hashtags ? formData.hashtags.split(',').map(tag => tag.trim()) : undefined,
          notes: formData.notes || `Admin upload assigned to user. ${formData.notes}`.trim(),
          status: 'approved' as const,
          adminId: user.id,
          adminFeedback: 'Pre-approved by admin',
          reviewedAt: new Date().toISOString()
        };

        // TODO: Create the submission with admin override
        console.log('Creating admin submission:', submissionData);
      }

      setSuccess(`Successfully uploaded and assigned ${urls.length} video${urls.length > 1 ? 's' : ''} to user!`);
      
      // Reset form
      setFormData({
        tiktokUrl: '',
        instagramUrl: '',
        caption: '',
        hashtags: '',
        notes: '',
        assignedUserId: ''
      });

      // Reload recent uploads
      loadRecentUploads();

      // Clear success message after 5 seconds
      setTimeout(() => setSuccess(null), 5000);

    } catch (err) {
      console.error('Error uploading video:', err);
      setError(err instanceof Error ? err.message : 'Failed to upload video');
    } finally {
      setLoading(false);
    }
  };

  const getUserInitials = (username: string): string => {
    return username
      .split(' ')
      .map(word => word.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <Container>
      <Header>
        <div>
          <Title>
            <Upload size={24} />
            Upload Pre-Approved Videos
          </Title>
          <Subtitle>
            Upload videos and assign them directly to creators in your agency. 
            These will appear as approved content in their dashboards.
          </Subtitle>
        </div>
      </Header>

      {success && (
        <SuccessMessage>
          <CheckCircle size={20} />
          <span>{success}</span>
        </SuccessMessage>
      )}

      {error && (
        <ErrorMessage>
          <AlertCircle size={20} />
          <span>{error}</span>
        </ErrorMessage>
      )}

      <FormCard>
        <form onSubmit={handleSubmit}>
          <FormGrid>
            <FormSection>
              <SectionTitle>
                <Video size={20} />
                Video Information
              </SectionTitle>

              <FormGroup>
                <Label htmlFor="tiktokUrl">TikTok URL (optional)</Label>
                <Input
                  id="tiktokUrl"
                  type="url"
                  value={formData.tiktokUrl}
                  onChange={handleInputChange('tiktokUrl')}
                  placeholder="https://www.tiktok.com/@user/video/..."
                  disabled={loading}
                />
                {formData.tiktokUrl && !isValidUrl(formData.tiktokUrl, 'tiktok') && (
                  <span style={{ color: professionalTheme.colors.error[600], fontSize: professionalTheme.typography.fontSize.sm }}>
                    Please enter a valid TikTok URL
                  </span>
                )}
              </FormGroup>

              <FormGroup>
                <Label htmlFor="instagramUrl">Instagram URL (optional)</Label>
                <Input
                  id="instagramUrl"
                  type="url"
                  value={formData.instagramUrl}
                  onChange={handleInputChange('instagramUrl')}
                  placeholder="https://www.instagram.com/p/..."
                  disabled={loading}
                />
                {formData.instagramUrl && !isValidUrl(formData.instagramUrl, 'instagram') && (
                  <span style={{ color: professionalTheme.colors.error[600], fontSize: professionalTheme.typography.fontSize.sm }}>
                    Please enter a valid Instagram URL
                  </span>
                )}
              </FormGroup>

              <FormGroup>
                <Label htmlFor="caption">Caption</Label>
                <TextArea
                  id="caption"
                  value={formData.caption}
                  onChange={handleInputChange('caption')}
                  placeholder="Video caption or description..."
                  disabled={loading}
                />
              </FormGroup>

              <FormGroup>
                <Label htmlFor="hashtags">Hashtags (comma separated)</Label>
                <Input
                  id="hashtags"
                  type="text"
                  value={formData.hashtags}
                  onChange={handleInputChange('hashtags')}
                  placeholder="#marketing, #content, #viral"
                  disabled={loading}
                />
              </FormGroup>

              <FormGroup>
                <Label htmlFor="notes">Notes (optional)</Label>
                <TextArea
                  id="notes"
                  value={formData.notes}
                  onChange={handleInputChange('notes')}
                  placeholder="Internal notes about this video..."
                  disabled={loading}
                />
              </FormGroup>
            </FormSection>

            <AssignmentSection>
              <SectionTitle>
                <Users size={20} />
                Assign to Creator
              </SectionTitle>

              {creators.length === 0 ? (
                <div style={{
                  padding: professionalTheme.spacing[4],
                  textAlign: 'center',
                  color: professionalTheme.colors.gray[600],
                  background: professionalTheme.colors.gray[50],
                  borderRadius: professionalTheme.borderRadius.lg
                }}>
                  <User size={32} style={{ marginBottom: professionalTheme.spacing[2] }} />
                  <p>No creators found in your agency.</p>
                  <p style={{ fontSize: professionalTheme.typography.fontSize.sm }}>
                    Invite creators to your agency first.
                  </p>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: professionalTheme.spacing[2] }}>
                  {creators.map((creator) => (
                    <UserCard
                      key={creator.id}
                      selected={formData.assignedUserId === creator.id}
                      onClick={() => handleUserSelect(creator.id)}
                    >
                      <UserAvatar>
                        {getUserInitials(creator.username)}
                      </UserAvatar>
                      <UserInfo>
                        <UserName>{creator.username}</UserName>
                        <UserEmail>{creator.email}</UserEmail>
                      </UserInfo>
                      {formData.assignedUserId === creator.id && (
                        <SelectedIndicator>
                          <CheckCircle size={12} />
                        </SelectedIndicator>
                      )}
                    </UserCard>
                  ))}
                </div>
              )}
            </AssignmentSection>
          </FormGrid>

          <ButtonGroup>
            <Button
              type="submit"
              variant="primary"
              disabled={loading || !isFormValid()}
              loading={loading}
            >
              {loading ? 'Uploading...' : 'Upload & Assign Video'}
            </Button>
            
            <Button
              type="button"
              variant="secondary"
              onClick={() => {
                setFormData({
                  tiktokUrl: '',
                  instagramUrl: '',
                  caption: '',
                  hashtags: '',
                  notes: '',
                  assignedUserId: ''
                });
                setError(null);
                setSuccess(null);
              }}
              disabled={loading}
            >
              Clear Form
            </Button>
          </ButtonGroup>
        </form>
      </FormCard>

      <RecentUploadsCard>
        <SectionTitle>
          <Crown size={20} />
          Recent Admin Uploads
        </SectionTitle>
        
        {recentUploads.length === 0 ? (
          <div style={{
            textAlign: 'center',
            padding: professionalTheme.spacing[6],
            color: professionalTheme.colors.gray[600]
          }}>
            <Upload size={48} style={{ marginBottom: professionalTheme.spacing[4] }} />
            <p>No recent uploads found.</p>
          </div>
        ) : (
          <RecentUploadsList>
            {recentUploads.map((upload) => (
              <RecentUploadItem key={upload.id}>
                <div style={{
                  width: 40,
                  height: 40,
                  borderRadius: professionalTheme.borderRadius.lg,
                  background: professionalTheme.colors.success[100],
                  color: professionalTheme.colors.success[600],
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <CheckCircle size={20} />
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ 
                    fontWeight: professionalTheme.typography.fontWeight.medium,
                    color: professionalTheme.colors.gray[900],
                    fontSize: professionalTheme.typography.fontSize.sm
                  }}>
                    {upload.caption || 'Untitled Video'}
                  </div>
                  <div style={{ 
                    color: professionalTheme.colors.gray[600],
                    fontSize: professionalTheme.typography.fontSize.xs
                  }}>
                    Assigned to {upload.creatorUsername} • {upload.platform} • {new Date(upload.submittedAt).toLocaleDateString()}
                  </div>
                </div>
              </RecentUploadItem>
            ))}
          </RecentUploadsList>
        )}
      </RecentUploadsCard>
    </Container>
  );
};