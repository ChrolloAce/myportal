/**
 * Professional CreatorDashboard - Modern creator interface
 * Clean, inspiring design for content creators
 */

import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { professionalTheme } from '../../styles/professionalTheme';
import { Card, Button, Badge } from '../../styles/ProfessionalStyles';
import { CreatorUser, VideoSubmission, SubmissionFormData } from '../../types';
import { FirebaseSubmissionManager } from '../../firebase/FirebaseSubmissionManager';
import { FirebaseProfileManager } from '../../firebase/FirebaseProfileManager';
import { VideoSubmissionForm } from './VideoSubmissionForm';
import { 
  Upload, 
  Video, 
  TrendingUp, 
  Calendar,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  Building2,
  LogOut,
  Plus,
  Eye,
  Download,
  Settings,
  Edit3,
  Camera,
  Instagram,
  Music,
  Sparkles,
  BarChart3,
  Award,
  Zap,
  Star,
  Heart,
  Users,
  Globe,
  Palette
} from 'lucide-react';

interface CreatorDashboardProps {
  user: CreatorUser;
  onLogout: () => void;
}

const DashboardLayout = styled.div`
  min-height: 100vh;
  background: linear-gradient(135deg, 
    ${professionalTheme.colors.gray[25]} 0%,
    ${professionalTheme.colors.primary[25]} 50%,
    ${professionalTheme.colors.gray[50]} 100%
  );
`;

const DashboardHeader = styled.header`
  background: linear-gradient(135deg, 
    ${professionalTheme.colors.white} 0%,
    rgba(255, 255, 255, 0.98) 100%
  );
  backdrop-filter: blur(10px);
  border-bottom: 1px solid ${professionalTheme.borders.color.light};
  padding: ${professionalTheme.spacing[4]} ${professionalTheme.spacing[6]};
  box-shadow: ${professionalTheme.shadows.sm};
`;

const HeaderContent = styled.div`
  max-width: 1400px;
  margin: 0 auto;
  display: flex;
  align-items: center;
  justify-content: between;
  gap: ${professionalTheme.spacing[4]};
`;

const HeaderLeft = styled.div`
  display: flex;
  align-items: center;
  gap: ${professionalTheme.spacing[4]};
  flex: 1;
`;

const Logo = styled.div`
  display: flex;
  align-items: center;
  gap: ${professionalTheme.spacing[2]};
`;

const LogoIcon = styled.div`
  width: 32px;
  height: 32px;
  background: linear-gradient(135deg, 
    ${professionalTheme.colors.primary[500]} 0%,
    ${professionalTheme.colors.primary[600]} 100%
  );
  border-radius: ${professionalTheme.borderRadius.lg};
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${professionalTheme.colors.white};
  box-shadow: ${professionalTheme.shadows.sm};
`;

const LogoText = styled.h1`
  font-size: ${professionalTheme.typography.fontSize.xl};
  font-weight: ${professionalTheme.typography.fontWeight.bold};
  color: ${professionalTheme.colors.gray[900]};
`;

const WelcomeSection = styled.div`
  flex: 1;
  margin-left: ${professionalTheme.spacing[8]};
`;

const WelcomeTitle = styled.h2`
  font-size: ${professionalTheme.typography.fontSize.lg};
  font-weight: ${professionalTheme.typography.fontWeight.semibold};
  color: ${professionalTheme.colors.gray[900]};
  margin-bottom: ${professionalTheme.spacing[1]};
`;

const WelcomeSubtitle = styled.p`
  font-size: ${professionalTheme.typography.fontSize.sm};
  color: ${professionalTheme.colors.gray[600]};
`;

const HeaderActions = styled.div`
  display: flex;
  align-items: center;
  gap: ${professionalTheme.spacing[3]};
`;

const UserMenu = styled.div`
  display: flex;
  align-items: center;
  gap: ${professionalTheme.spacing[3]};
  padding: ${professionalTheme.spacing[2]} ${professionalTheme.spacing[3]};
  background: ${professionalTheme.colors.gray[50]};
  border-radius: ${professionalTheme.borderRadius.lg};
  border: 1px solid ${professionalTheme.borders.color.light};
`;

const UserAvatar = styled.div`
  width: 32px;
  height: 32px;
  background: ${professionalTheme.colors.primary[100]};
  border-radius: ${professionalTheme.borderRadius.full};
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${professionalTheme.colors.primary[600]};
  font-weight: ${professionalTheme.typography.fontWeight.semibold};
  font-size: ${professionalTheme.typography.fontSize.sm};
`;

const UserInfo = styled.div``;

const UserName = styled.div`
  font-size: ${professionalTheme.typography.fontSize.sm};
  font-weight: ${professionalTheme.typography.fontWeight.medium};
  color: ${professionalTheme.colors.gray[900]};
`;

const MainContent = styled.main`
  max-width: 1400px;
  margin: 0 auto;
  padding: ${professionalTheme.spacing[8]} ${professionalTheme.spacing[6]};
  
  @media (max-width: ${professionalTheme.breakpoints.md}) {
    padding: ${professionalTheme.spacing[6]} ${professionalTheme.spacing[4]};
  }
`;

const ContentGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 320px;
  gap: ${professionalTheme.spacing[8]};
  
  @media (max-width: ${professionalTheme.breakpoints.lg}) {
    grid-template-columns: 1fr;
    gap: ${professionalTheme.spacing[6]};
  }
`;

const MainColumn = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${professionalTheme.spacing[6]};
`;

const SideColumn = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${professionalTheme.spacing[6]};
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: ${professionalTheme.spacing[4]};
  margin-bottom: ${professionalTheme.spacing[6]};
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

const StatIcon = styled.div<{ color: string }>`
  width: 56px;
  height: 56px;
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

const SectionTitle = styled.h3`
  font-size: ${professionalTheme.typography.fontSize.lg};
  font-weight: ${professionalTheme.typography.fontWeight.semibold};
  color: ${professionalTheme.colors.gray[900]};
  margin-bottom: ${professionalTheme.spacing[4]};
`;

const SubmissionsList = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${professionalTheme.spacing[3]};
`;

const SubmissionCard = styled(Card)<{ status: string }>`
  padding: ${professionalTheme.spacing[4]};
  transition: ${professionalTheme.transitions.all};
  cursor: pointer;
  border-left: 4px solid ${props => {
    switch (props.status) {
      case 'approved': return professionalTheme.colors.success[500];
      case 'rejected': return professionalTheme.colors.error[500];
      case 'pending': return professionalTheme.colors.warning[500];
      default: return professionalTheme.colors.gray[300];
    }
  }};
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: ${professionalTheme.shadows.cardHover};
  }
`;

const SubmissionHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: between;
  margin-bottom: ${professionalTheme.spacing[3]};
`;

const SubmissionTitle = styled.h4`
  font-size: ${professionalTheme.typography.fontSize.base};
  font-weight: ${professionalTheme.typography.fontWeight.semibold};
  color: ${professionalTheme.colors.gray[900]};
  margin-bottom: ${professionalTheme.spacing[1]};
`;

const SubmissionMeta = styled.div`
  display: flex;
  align-items: center;
  gap: ${professionalTheme.spacing[4]};
  font-size: ${professionalTheme.typography.fontSize.sm};
  color: ${professionalTheme.colors.gray[600]};
`;

const QuickActionsCard = styled(Card)`
  padding: ${professionalTheme.spacing[6]};
`;

const ActionButton = styled(Button)`
  width: 100%;
  margin-bottom: ${professionalTheme.spacing[3]};
  
  &:last-child {
    margin-bottom: 0;
  }
`;

const AgencyCard = styled(Card)`
  padding: ${professionalTheme.spacing[6]};
  text-align: center;
`;

const AgencyIcon = styled.div`
  width: 64px;
  height: 64px;
  margin: 0 auto ${professionalTheme.spacing[4]};
  background: ${professionalTheme.colors.primary[100]};
  color: ${professionalTheme.colors.primary[600]};
  border-radius: ${professionalTheme.borderRadius.xl};
  display: flex;
  align-items: center;
  justify-content: center;
`;

const AgencyName = styled.h4`
  font-size: ${professionalTheme.typography.fontSize.lg};
  font-weight: ${professionalTheme.typography.fontWeight.semibold};
  color: ${professionalTheme.colors.gray[900]};
  margin-bottom: ${professionalTheme.spacing[2]};
`;

const AgencyDescription = styled.p`
  font-size: ${professionalTheme.typography.fontSize.sm};
  color: ${professionalTheme.colors.gray[600]};
  line-height: ${professionalTheme.typography.lineHeight.relaxed};
`;

const SubmissionFormModal = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 1000;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: ${professionalTheme.spacing[4]};
`;

const SubmissionFormOverlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(4px);
`;

const SubmissionFormContent = styled.div`
  position: relative;
  background: ${professionalTheme.colors.white};
  border-radius: ${professionalTheme.borderRadius.xl};
  box-shadow: ${professionalTheme.shadows.xl};
  max-width: 600px;
  width: 100%;
  max-height: 90vh;
  overflow-y: auto;
`;

const SubmissionFormHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: ${professionalTheme.spacing[6]};
  border-bottom: 1px solid ${professionalTheme.colors.gray[200]};
  
  h2 {
    font-size: ${professionalTheme.typography.fontSize.xl};
    font-weight: ${professionalTheme.typography.fontWeight.semibold};
    color: ${professionalTheme.colors.gray[900]};
    margin: 0;
  }
`;

const ErrorMessage = styled.div`
  background: ${professionalTheme.colors.error[50]};
  border: 1px solid ${professionalTheme.colors.error[200]};
  color: ${professionalTheme.colors.error[700]};
  padding: ${professionalTheme.spacing[3]};
  margin: ${professionalTheme.spacing[4]} ${professionalTheme.spacing[6]};
  border-radius: ${professionalTheme.borderRadius.md};
  font-size: ${professionalTheme.typography.fontSize.sm};
`;

// Profile Edit Modal Styles
const ProfileEditModal = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 1000;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: ${professionalTheme.spacing[4]};
`;

const ProfileEditOverlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(4px);
`;

const ProfileEditContent = styled.div`
  position: relative;
  background: ${professionalTheme.colors.white};
  border-radius: ${professionalTheme.borderRadius.xl};
  box-shadow: ${professionalTheme.shadows.xl};
  max-width: 500px;
  width: 100%;
  max-height: 90vh;
  overflow-y: auto;
`;

const ProfileEditHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: ${professionalTheme.spacing[6]};
  border-bottom: 1px solid ${professionalTheme.colors.gray[200]};
  
  h2 {
    font-size: ${professionalTheme.typography.fontSize.xl};
    font-weight: ${professionalTheme.typography.fontWeight.semibold};
    color: ${professionalTheme.colors.gray[900]};
    margin: 0;
    display: flex;
    align-items: center;
    gap: ${professionalTheme.spacing[2]};
  }
`;

const ProfileEditForm = styled.form`
  padding: ${professionalTheme.spacing[6]};
`;

const FormGroup = styled.div`
  margin-bottom: ${professionalTheme.spacing[4]};
`;

const Label = styled.label`
  display: block;
  font-size: ${professionalTheme.typography.fontSize.sm};
  font-weight: ${professionalTheme.typography.fontWeight.medium};
  color: ${professionalTheme.colors.gray[700]};
  margin-bottom: ${professionalTheme.spacing[2]};
`;

const Input = styled.input`
  width: 100%;
  padding: ${professionalTheme.spacing[3]};
  border: 1px solid ${professionalTheme.colors.gray[300]};
  border-radius: ${professionalTheme.borderRadius.md};
  font-size: ${professionalTheme.typography.fontSize.sm};
  transition: all 0.2s ease;
  
  &:focus {
    outline: none;
    border-color: ${professionalTheme.colors.primary[500]};
    box-shadow: 0 0 0 3px ${professionalTheme.colors.primary[100]};
  }
  
  &:disabled {
    background-color: ${professionalTheme.colors.gray[50]};
    color: ${professionalTheme.colors.gray[500]};
    cursor: not-allowed;
  }
`;

const ProfilePictureSection = styled.div`
  display: flex;
  align-items: center;
  gap: ${professionalTheme.spacing[4]};
  margin-bottom: ${professionalTheme.spacing[6]};
  padding: ${professionalTheme.spacing[4]};
  background: ${professionalTheme.colors.gray[50]};
  border-radius: ${professionalTheme.borderRadius.lg};
`;

const ProfilePicturePreview = styled.div`
  width: 80px;
  height: 80px;
  border-radius: ${professionalTheme.borderRadius.full};
  background: linear-gradient(135deg, 
    ${professionalTheme.colors.primary[400]} 0%,
    ${professionalTheme.colors.primary[600]} 100%
  );
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${professionalTheme.colors.white};
  font-size: ${professionalTheme.typography.fontSize.xl};
  font-weight: ${professionalTheme.typography.fontWeight.bold};
  position: relative;
  overflow: hidden;
`;

const ProfilePictureUpload = styled.div`
  flex: 1;
`;

const UploadButton = styled.label`
  display: inline-flex;
  align-items: center;
  gap: ${professionalTheme.spacing[2]};
  padding: ${professionalTheme.spacing[2]} ${professionalTheme.spacing[4]};
  background: ${professionalTheme.colors.primary[500]};
  color: ${professionalTheme.colors.white};
  border-radius: ${professionalTheme.borderRadius.md};
  font-size: ${professionalTheme.typography.fontSize.sm};
  font-weight: ${professionalTheme.typography.fontWeight.medium};
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:hover {
    background: ${professionalTheme.colors.primary[600]};
  }
  
  input {
    display: none;
  }
`;

const FormActions = styled.div`
  display: flex;
  gap: ${professionalTheme.spacing[3]};
  padding-top: ${professionalTheme.spacing[4]};
  border-top: 1px solid ${professionalTheme.colors.gray[200]};
`;

export const CreatorDashboard: React.FC<CreatorDashboardProps> = ({ user, onLogout }) => {
  const [submissions, setSubmissions] = useState<VideoSubmission[]>([]);
  const [loading, setLoading] = useState(true);
  const [showSubmissionForm, setShowSubmissionForm] = useState(false);
  const [showProfileEdit, setShowProfileEdit] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSavingProfile, setIsSavingProfile] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [profileData, setProfileData] = useState({
    username: user.username,
    instagramHandle: user.socialHandles?.instagram || '',
    tiktokHandle: user.socialHandles?.tiktok || '',
    profilePicture: user.profilePicture || null
  });

  const submissionManager = FirebaseSubmissionManager.getInstance();
  const profileManager = FirebaseProfileManager.getInstance();

  useEffect(() => {
    const loadSubmissions = async () => {
      try {
        setLoading(true);
        const submissionsResponse = await submissionManager.getCreatorSubmissions();
        setSubmissions(submissionsResponse.items);
      } catch (error) {
        console.error('Failed to load submissions:', error);
      } finally {
        setLoading(false);
      }
    };

    loadSubmissions();
  }, [user.id]);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'approved':
        return <CheckCircle size={16} />;
      case 'rejected':
        return <XCircle size={16} />;
      case 'pending':
        return <Clock size={16} />;
      default:
        return <AlertCircle size={16} />;
    }
  };

  const getStatusVariant = (status: string): 'success' | 'error' | 'warning' | 'default' => {
    switch (status) {
      case 'approved': return 'success';
      case 'rejected': return 'error';
      case 'pending': return 'warning';
      default: return 'default';
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

  const handleSubmitVideo = async (formData: SubmissionFormData): Promise<boolean> => {
    try {
      setIsSubmitting(true);
      setError(null);
      
      await submissionManager.submitVideo(formData);
      
      // Reload submissions to show the new one
      const submissionsResponse = await submissionManager.getCreatorSubmissions();
      setSubmissions(submissionsResponse.items);
      
      setShowSubmissionForm(false);
      return true;
    } catch (error) {
      console.error('Submission failed:', error);
      setError(error instanceof Error ? error.message : 'Submission failed');
      return false;
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setIsSavingProfile(true);
      setError(null);
      
      // Update profile via Firebase
      await profileManager.updateProfile(user.id, {
        username: profileData.username,
        instagramHandle: profileData.instagramHandle,
        tiktokHandle: profileData.tiktokHandle,
        profilePicture: profileData.profilePicture
      });
      
      setShowProfileEdit(false);
      
      // Show success message (could be improved with a toast notification)
      console.log('✅ Profile updated successfully!');
    } catch (error) {
      console.error('Profile update failed:', error);
      setError(error instanceof Error ? error.message : 'Profile update failed');
    } finally {
      setIsSavingProfile(false);
    }
  };

  const handleProfileInputChange = (field: string, value: string) => {
    setProfileData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleProfilePictureUpload = async (file: File) => {
    try {
      setError(null);
      
      // Upload to Firebase Storage
      const downloadURL = await profileManager.uploadProfilePicture(user.id, file);
      
      // Update local state
      setProfileData(prev => ({
        ...prev,
        profilePicture: downloadURL
      }));
      
      console.log('✅ Profile picture uploaded successfully!');
    } catch (error) {
      console.error('Profile picture upload failed:', error);
      setError(error instanceof Error ? error.message : 'Profile picture upload failed');
    }
  };

  const stats = {
    totalSubmissions: submissions.length,
    approvedSubmissions: submissions.filter(s => s.status === 'approved').length,
    pendingSubmissions: submissions.filter(s => s.status === 'pending').length,
    rejectedSubmissions: submissions.filter(s => s.status === 'rejected').length,
  };

  return (
    <DashboardLayout>
      <DashboardHeader>
        <HeaderContent>
          <HeaderLeft>
            <Logo>
              <LogoIcon>
                <Video size={20} />
              </LogoIcon>
              <LogoText>Creator Portal</LogoText>
            </Logo>
            
            <WelcomeSection>
              <WelcomeTitle>Welcome back, {user.username.split(' ')[0]}!</WelcomeTitle>
              <WelcomeSubtitle>Ready to create something amazing today?</WelcomeSubtitle>
            </WelcomeSection>
          </HeaderLeft>

          <HeaderActions>
            <Button variant="secondary" size="sm" onClick={() => setShowProfileEdit(true)}>
              <Settings size={16} />
              Profile
            </Button>
            <Button variant="primary" size="sm" onClick={() => setShowSubmissionForm(true)}>
              <Plus size={16} />
              New Submission
            </Button>
            
            <UserMenu>
              <UserAvatar>
                {getUserInitials(user.username)}
              </UserAvatar>
              <UserInfo>
                <UserName>{user.username}</UserName>
              </UserInfo>
              <Button variant="ghost" size="sm" onClick={onLogout}>
                <LogOut size={16} />
              </Button>
            </UserMenu>
          </HeaderActions>
        </HeaderContent>
      </DashboardHeader>

      <MainContent>
        <StatsGrid>
          <StatCard gradient={`linear-gradient(135deg, ${professionalTheme.colors.primary[500]} 0%, ${professionalTheme.colors.primary[600]} 100%)`}>
            <StatIcon color={professionalTheme.colors.primary[500]}>
              <Sparkles />
            </StatIcon>
            <StatValue>{stats.totalSubmissions}</StatValue>
            <StatLabel>Total Creations</StatLabel>
          </StatCard>

          <StatCard gradient={`linear-gradient(135deg, ${professionalTheme.colors.success[500]} 0%, ${professionalTheme.colors.success[600]} 100%)`}>
            <StatIcon color={professionalTheme.colors.success[500]}>
              <Award />
            </StatIcon>
            <StatValue>{stats.approvedSubmissions}</StatValue>
            <StatLabel>Approved</StatLabel>
          </StatCard>

          <StatCard gradient={`linear-gradient(135deg, ${professionalTheme.colors.warning[500]} 0%, ${professionalTheme.colors.warning[600]} 100%)`}>
            <StatIcon color={professionalTheme.colors.warning[500]}>
              <Zap />
            </StatIcon>
            <StatValue>{stats.pendingSubmissions}</StatValue>
            <StatLabel>In Review</StatLabel>
          </StatCard>

          <StatCard gradient={`linear-gradient(135deg, ${professionalTheme.colors.error[500]} 0%, ${professionalTheme.colors.error[600]} 100%)`}>
            <StatIcon color={professionalTheme.colors.error[500]}>
              <Heart />
            </StatIcon>
            <StatValue>{stats.rejectedSubmissions}</StatValue>
            <StatLabel>Needs Work</StatLabel>
          </StatCard>
        </StatsGrid>

        <ContentGrid>
          <MainColumn>
            <div>
              <SectionTitle>Recent Submissions</SectionTitle>
              {loading ? (
                <Card padding="lg">
                  <p>Loading submissions...</p>
                </Card>
              ) : submissions.length === 0 ? (
                <Card padding="lg">
                  <p>No submissions yet. Create your first submission to get started!</p>
                </Card>
              ) : (
                <SubmissionsList>
                  {submissions.slice(0, 5).map((submission) => (
                    <SubmissionCard key={submission.id} status={submission.status}>
                      <SubmissionHeader>
                        <div>
                          <SubmissionTitle>{submission.caption || `${submission.platform} Submission`}</SubmissionTitle>
                          <SubmissionMeta>
                            <span>
                              <Calendar size={14} />
                              {new Date(submission.submittedAt).toLocaleDateString()}
                            </span>
                            <Badge variant={getStatusVariant(submission.status)} size="sm">
                              {getStatusIcon(submission.status)}
                              {submission.status.charAt(0).toUpperCase() + submission.status.slice(1)}
                            </Badge>
                          </SubmissionMeta>
                        </div>
                        <Button variant="ghost" size="sm">
                          <Eye size={16} />
                        </Button>
                      </SubmissionHeader>
                    </SubmissionCard>
                  ))}
                </SubmissionsList>
              )}
            </div>
          </MainColumn>

          <SideColumn>
            <QuickActionsCard>
              <SectionTitle>Quick Actions</SectionTitle>
              <ActionButton variant="primary" onClick={() => setShowSubmissionForm(true)}>
                <Upload size={16} />
                Create Content
              </ActionButton>
              <ActionButton variant="secondary">
                <BarChart3 size={16} />
                Analytics
              </ActionButton>
              <ActionButton variant="secondary">
                <Palette size={16} />
                Brand Kit
              </ActionButton>
              <ActionButton variant="secondary" onClick={() => setShowProfileEdit(true)}>
                <Settings size={16} />
                Settings
              </ActionButton>
            </QuickActionsCard>

            {user.corporationId && (
              <AgencyCard>
                <AgencyIcon>
                  <Users size={24} />
                </AgencyIcon>
                <AgencyName>Creative Team</AgencyName>
                <AgencyDescription>
                  You're part of an amazing creative collective. Collaborate and create together!
                </AgencyDescription>
                <Button variant="ghost" size="sm" style={{ marginTop: professionalTheme.spacing[3] }}>
                  <Globe size={14} />
                  View Team
                </Button>
              </AgencyCard>
            )}
          </SideColumn>
        </ContentGrid>
      </MainContent>

      {showSubmissionForm && (
        <SubmissionFormModal>
          <SubmissionFormOverlay onClick={() => setShowSubmissionForm(false)} />
          <SubmissionFormContent>
            <SubmissionFormHeader>
              <h2>Submit New Video</h2>
              <Button variant="ghost" onClick={() => setShowSubmissionForm(false)}>
                ×
              </Button>
            </SubmissionFormHeader>
            {error && (
              <ErrorMessage>{error}</ErrorMessage>
            )}
            <VideoSubmissionForm
              user={user}
              onSubmit={handleSubmitVideo}
              isSubmitting={isSubmitting}
            />
          </SubmissionFormContent>
        </SubmissionFormModal>
      )}

      {showProfileEdit && (
        <ProfileEditModal>
          <ProfileEditOverlay onClick={() => setShowProfileEdit(false)} />
          <ProfileEditContent>
            <ProfileEditHeader>
              <h2>
                <Edit3 size={20} />
                Edit Profile
              </h2>
              <Button variant="ghost" onClick={() => setShowProfileEdit(false)}>
                ×
              </Button>
            </ProfileEditHeader>
            
            <ProfileEditForm onSubmit={handleSaveProfile}>
              <ProfilePictureSection>
                <ProfilePicturePreview>
                  {profileData.profilePicture ? (
                    <img 
                      src={profileData.profilePicture} 
                      alt="Profile" 
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                  ) : (
                    getUserInitials(profileData.username)
                  )}
                </ProfilePicturePreview>
                <ProfilePictureUpload>
                  <p style={{ 
                    fontSize: professionalTheme.typography.fontSize.sm, 
                    color: professionalTheme.colors.gray[600],
                    marginBottom: professionalTheme.spacing[2]
                  }}>
                    Update your profile picture
                  </p>
                  <UploadButton>
                    <Camera size={16} />
                    Choose Photo
                    <input 
                      type="file" 
                      accept="image/*"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          handleProfilePictureUpload(file);
                        }
                      }}
                    />
                  </UploadButton>
                </ProfilePictureUpload>
              </ProfilePictureSection>

              <FormGroup>
                <Label>Username</Label>
                <Input
                  type="text"
                  value={profileData.username}
                  onChange={(e) => handleProfileInputChange('username', e.target.value)}
                  placeholder="Enter your username"
                />
              </FormGroup>

              <FormGroup>
                <Label>
                  <Instagram size={16} style={{ display: 'inline', marginRight: '8px' }} />
                  Instagram Handle
                </Label>
                <Input
                  type="text"
                  value={profileData.instagramHandle}
                  onChange={(e) => handleProfileInputChange('instagramHandle', e.target.value)}
                  placeholder="@yourusername"
                />
              </FormGroup>

              <FormGroup>
                <Label>
                  <Music size={16} style={{ display: 'inline', marginRight: '8px' }} />
                  TikTok Handle
                </Label>
                <Input
                  type="text"
                  value={profileData.tiktokHandle}
                  onChange={(e) => handleProfileInputChange('tiktokHandle', e.target.value)}
                  placeholder="@yourusername"
                />
              </FormGroup>

              <FormActions>
                <Button 
                  type="button" 
                  variant="secondary" 
                  onClick={() => setShowProfileEdit(false)}
                  disabled={isSavingProfile}
                >
                  Cancel
                </Button>
                <Button 
                  type="submit" 
                  variant="primary"
                  disabled={isSavingProfile}
                >
                  {isSavingProfile ? 'Saving...' : 'Save Changes'}
                </Button>
              </FormActions>
            </ProfileEditForm>
          </ProfileEditContent>
        </ProfileEditModal>
      )}
    </DashboardLayout>
  );
};