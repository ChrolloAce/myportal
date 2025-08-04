/**
 * AdminOnboarding - Multi-step corporation setup for admins
 * Steps: Profile → Corporation Info → Social Media → Settings → First Invite
 */

import React, { useState } from 'react';
import styled from 'styled-components';
import { theme } from '../../styles/theme';
import { 
  User, Building2, Instagram, Settings, UserPlus, 
  ArrowRight, ArrowLeft, Check, Copy, Link2, Globe, 
  Shield, Users
} from 'lucide-react';
import { AdminOnboardingData, CorporationOnboarding } from '../../types';

interface AdminOnboardingProps {
  onComplete: (data: AdminOnboardingData & { corporationData: CorporationOnboarding }) => Promise<void>;
  isLoading: boolean;
}

const StepsContainer = styled.div`
  padding: 2rem;
`;

const StepIndicator = styled.div`
  display: flex;
  justify-content: center;
  margin-bottom: 3rem;
  flex-wrap: wrap;
  gap: 0.5rem;
`;

const Step = styled.div<{ active: boolean; completed: boolean }>`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  border-radius: 20px;
  font-weight: 600;
  font-size: 0.8rem;
  transition: all 0.3s ease;
  
  ${props => props.completed && `
    background: ${theme.colors.success.light};
    color: ${theme.colors.success.dark};
  `}
  
  ${props => props.active && !props.completed && `
    background: ${theme.colors.primary[100]};
    color: ${theme.colors.primary[700]};
    transform: scale(1.05);
  `}
  
  ${props => !props.active && !props.completed && `
    background: ${theme.colors.neutral[100]};
    color: ${theme.colors.neutral[500]};
  `}
`;

const StepContent = styled.div`
  max-width: 600px;
  margin: 0 auto;
`;

const StepTitle = styled.h2`
  font-size: 1.8rem;
  font-weight: 700;
  text-align: center;
  margin-bottom: 0.5rem;
  color: ${theme.colors.neutral[800]};
`;

const StepDescription = styled.p`
  text-align: center;
  color: ${theme.colors.neutral[600]};
  margin-bottom: 2rem;
  font-size: 1.1rem;
  line-height: 1.6;
`;

const FormRow = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
  margin-bottom: 1.5rem;
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const FormGroup = styled.div`
  margin-bottom: 1.5rem;
`;

const Label = styled.label`
  display: block;
  font-weight: 600;
  margin-bottom: 0.5rem;
  color: ${theme.colors.neutral[700]};
`;

const Input = styled.input`
  width: 100%;
  padding: 1rem;
  border: 2px solid ${theme.colors.neutral[200]};
  border-radius: 12px;
  font-size: 1rem;
  transition: all 0.2s ease;
  
  &:focus {
    outline: none;
    border-color: ${theme.colors.primary[400]};
    box-shadow: 0 0 0 3px ${theme.colors.primary[100]};
  }
`;

const TextArea = styled.textarea`
  width: 100%;
  padding: 1rem;
  border: 2px solid ${theme.colors.neutral[200]};
  border-radius: 12px;
  font-size: 1rem;
  min-height: 100px;
  resize: vertical;
  font-family: inherit;
  transition: all 0.2s ease;
  
  &:focus {
    outline: none;
    border-color: ${theme.colors.primary[400]};
    box-shadow: 0 0 0 3px ${theme.colors.primary[100]};
  }
`;

const Select = styled.select`
  width: 100%;
  padding: 1rem;
  border: 2px solid ${theme.colors.neutral[200]};
  border-radius: 12px;
  font-size: 1rem;
  background: white;
  transition: all 0.2s ease;
  
  &:focus {
    outline: none;
    border-color: ${theme.colors.primary[400]};
    box-shadow: 0 0 0 3px ${theme.colors.primary[100]};
  }
`;

const SocialInputGroup = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-bottom: 1rem;
`;

const SocialIcon = styled.div`
  width: 40px;
  height: 40px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  
  &.instagram {
    background: linear-gradient(45deg, #f09433 0%,#e6683c 25%,#dc2743 50%,#cc2366 75%,#bc1888 100%);
  }
  
  &.tiktok {
    background: #000000;
  }
  
  &.twitter {
    background: #1DA1F2;
  }
  
  &.linkedin {
    background: #0077B5;
  }
`;

const SettingsCard = styled.div`
  background: ${theme.colors.neutral[50]};
  border: 1px solid ${theme.colors.neutral[200]};
  border-radius: 12px;
  padding: 1.5rem;
  margin-bottom: 1rem;
`;

const SettingRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
  
  &:last-child {
    margin-bottom: 0;
  }
`;

const SettingInfo = styled.div`
  flex: 1;
`;

const SettingTitle = styled.h4`
  margin: 0 0 0.25rem 0;
  color: ${theme.colors.neutral[800]};
`;

const SettingDescription = styled.p`
  margin: 0;
  font-size: 0.9rem;
  color: ${theme.colors.neutral[600]};
`;

const Switch = styled.label`
  position: relative;
  display: inline-block;
  width: 50px;
  height: 24px;
  margin-left: 1rem;
`;

const SwitchInput = styled.input`
  opacity: 0;
  width: 0;
  height: 0;
`;

const SwitchSlider = styled.span`
  position: absolute;
  cursor: pointer;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: ${theme.colors.neutral[300]};
  transition: 0.3s;
  border-radius: 24px;
  
  &:before {
    position: absolute;
    content: "";
    height: 18px;
    width: 18px;
    left: 3px;
    bottom: 3px;
    background-color: white;
    transition: 0.3s;
    border-radius: 50%;
  }
  
  ${SwitchInput}:checked + & {
    background-color: ${theme.colors.primary[500]};
  }
  
  ${SwitchInput}:checked + &:before {
    transform: translateX(26px);
  }
`;

const InvitePreview = styled.div`
  background: ${theme.colors.primary[50]};
  border: 2px solid ${theme.colors.primary[200]};
  border-radius: 12px;
  padding: 1.5rem;
  text-align: center;
  margin: 1rem 0;
`;

const InviteLink = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background: white;
  padding: 0.75rem;
  border-radius: 8px;
  margin: 1rem 0;
  font-family: monospace;
  font-size: 0.9rem;
  border: 1px solid ${theme.colors.primary[200]};
`;

const ButtonGroup = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 3rem;
  padding-top: 2rem;
  border-top: 1px solid ${theme.colors.neutral[200]};
`;

const Button = styled.button<{ variant?: 'primary' | 'secondary' }>`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 1rem 2rem;
  border-radius: 12px;
  font-weight: 600;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.2s ease;
  border: none;
  
  ${props => props.variant === 'primary' ? `
    background: ${theme.colors.primary[500]};
    color: white;
    
    &:hover:not(:disabled) {
      background: ${theme.colors.primary[600]};
      transform: translateY(-2px);
      box-shadow: 0 8px 25px rgba(0,0,0,0.15);
    }
  ` : `
    background: ${theme.colors.neutral[100]};
    color: ${theme.colors.neutral[700]};
    
    &:hover:not(:disabled) {
      background: ${theme.colors.neutral[200]};
    }
  `}
  
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

export const AdminOnboarding: React.FC<AdminOnboardingProps> = ({
  onComplete,
  isLoading
}) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<AdminOnboardingData>({
    username: '',
    profilePicture: '',
    corporationData: {
      corporationName: '',
      displayName: '',
      industry: '',
      description: '',
      socialMedia: {},
      settings: {
        allowPublicJoin: false,
        requireApproval: true,
        maxCreators: 50
      },
      createFirstInvite: true,
      firstInviteNote: ''
    }
  });

  const totalSteps = 5;

  const steps = [
    { id: 1, title: 'Profile', icon: User },
    { id: 2, title: 'Corporation', icon: Building2 },
    { id: 3, title: 'Social Media', icon: Instagram },
    { id: 4, title: 'Settings', icon: Settings },
    { id: 5, title: 'Invite', icon: UserPlus }
  ];

  const industries = [
    'Technology', 'Fashion & Beauty', 'Food & Beverage', 'Travel & Lifestyle',
    'Gaming', 'Fitness & Health', 'Education', 'Entertainment', 'Business',
    'Art & Design', 'Music', 'Sports', 'Other'
  ];

  const handleNext = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(prev => prev + 1);
    } else {
      // Ensure corporationData is always provided for the onComplete call
      const completeData = {
        ...formData,
        corporationData: formData.corporationData!
      };
      onComplete(completeData);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const updateFormData = (updates: Partial<AdminOnboardingData>) => {
    setFormData(prev => ({ ...prev, ...updates }));
  };

  const updateCorporationData = (updates: Partial<CorporationOnboarding>) => {
    setFormData(prev => ({
      ...prev,
      corporationData: { ...prev.corporationData!, ...updates }
    }));
  };

  const canProceed = () => {
    switch (currentStep) {
      case 1:
        return formData.username.trim().length > 0;
      case 2:
        return formData.corporationData?.corporationName.trim().length > 0 &&
               formData.corporationData?.displayName.trim().length > 0 &&
               formData.corporationData?.industry.length > 0;
      case 3:
      case 4:
      case 5:
        return true;
      default:
        return false;
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <StepContent>
            <StepTitle>👋 Your Profile</StepTitle>
            <StepDescription>
              Let's start with your personal information
            </StepDescription>
            
            <FormGroup>
              <Label>Username *</Label>
              <Input
                type="text"
                value={formData.username}
                onChange={(e) => updateFormData({ username: e.target.value })}
                placeholder="Your professional username"
              />
            </FormGroup>
          </StepContent>
        );
        
      case 2:
        return (
          <StepContent>
            <StepTitle>🏢 Corporation Details</StepTitle>
            <StepDescription>
              Tell us about your corporation or brand
            </StepDescription>
            
            <FormRow>
              <FormGroup>
                <Label>Corporation Name *</Label>
                <Input
                  type="text"
                  value={formData.corporationData?.corporationName || ''}
                  onChange={(e) => updateCorporationData({ corporationName: e.target.value })}
                  placeholder="Acme Corp"
                />
              </FormGroup>
              
              <FormGroup>
                <Label>Display Name *</Label>
                <Input
                  type="text"
                  value={formData.corporationData?.displayName || ''}
                  onChange={(e) => updateCorporationData({ displayName: e.target.value })}
                  placeholder="ACME Corporation"
                />
              </FormGroup>
            </FormRow>
            
            <FormGroup>
              <Label>Industry *</Label>
              <Select
                value={formData.corporationData?.industry || ''}
                onChange={(e) => updateCorporationData({ industry: e.target.value })}
              >
                <option value="">Select an industry</option>
                {industries.map(industry => (
                  <option key={industry} value={industry}>{industry}</option>
                ))}
              </Select>
            </FormGroup>
            
            <FormGroup>
              <Label>Description</Label>
              <TextArea
                value={formData.corporationData?.description || ''}
                onChange={(e) => updateCorporationData({ description: e.target.value })}
                placeholder="Tell creators what your corporation is about..."
              />
            </FormGroup>
          </StepContent>
        );
        
      case 3:
        return (
          <StepContent>
            <StepTitle>🔗 Social Media Presence</StepTitle>
            <StepDescription>
              Connect your corporation's social media accounts
            </StepDescription>
            
            <SocialInputGroup>
              <SocialIcon className="instagram">
                <Instagram size={20} />
              </SocialIcon>
              <Input
                type="text"
                value={formData.corporationData?.socialMedia?.instagram || ''}
                onChange={(e) => updateCorporationData({ 
                  socialMedia: { 
                    ...formData.corporationData?.socialMedia,
                    instagram: e.target.value 
                  }
                })}
                placeholder="@yourcorp"
              />
            </SocialInputGroup>
            
            <SocialInputGroup>
              <SocialIcon className="tiktok">
                <span style={{ fontWeight: 'bold', fontSize: '14px' }}>TT</span>
              </SocialIcon>
              <Input
                type="text"
                value={formData.corporationData?.socialMedia?.tiktok || ''}
                onChange={(e) => updateCorporationData({ 
                  socialMedia: { 
                    ...formData.corporationData?.socialMedia,
                    tiktok: e.target.value 
                  }
                })}
                placeholder="@yourcorp"
              />
            </SocialInputGroup>
            
            <SocialInputGroup>
              <SocialIcon className="twitter">
                <Globe size={20} />
              </SocialIcon>
              <Input
                type="text"
                value={formData.corporationData?.socialMedia?.twitter || ''}
                onChange={(e) => updateCorporationData({ 
                  socialMedia: { 
                    ...formData.corporationData?.socialMedia,
                    twitter: e.target.value 
                  }
                })}
                placeholder="@yourcorp"
              />
            </SocialInputGroup>
            
            <SocialInputGroup>
              <SocialIcon className="linkedin">
                <span style={{ fontWeight: 'bold', fontSize: '14px' }}>in</span>
              </SocialIcon>
              <Input
                type="text"
                value={formData.corporationData?.socialMedia?.linkedin || ''}
                onChange={(e) => updateCorporationData({ 
                  socialMedia: { 
                    ...formData.corporationData?.socialMedia,
                    linkedin: e.target.value 
                  }
                })}
                placeholder="company/yourcorp"
              />
            </SocialInputGroup>
          </StepContent>
        );
        
      case 4:
        return (
          <StepContent>
            <StepTitle>⚙️ Corporation Settings</StepTitle>
            <StepDescription>
              Configure how creators can join your corporation
            </StepDescription>
            
            <SettingsCard>
              <SettingRow>
                <SettingInfo>
                  <SettingTitle><Shield size={16} style={{ display: 'inline', marginRight: '0.5rem' }} />Require Approval</SettingTitle>
                  <SettingDescription>Manually approve creators before they can join</SettingDescription>
                </SettingInfo>
                <Switch>
                  <SwitchInput
                    type="checkbox"
                    checked={formData.corporationData?.settings.requireApproval || false}
                    onChange={(e) => updateCorporationData({
                      settings: {
                        ...formData.corporationData?.settings!,
                        requireApproval: e.target.checked
                      }
                    })}
                  />
                  <SwitchSlider />
                </Switch>
              </SettingRow>
              
              <SettingRow>
                <SettingInfo>
                  <SettingTitle><Users size={16} style={{ display: 'inline', marginRight: '0.5rem' }} />Allow Public Join</SettingTitle>
                  <SettingDescription>Let creators find and join without invites</SettingDescription>
                </SettingInfo>
                <Switch>
                  <SwitchInput
                    type="checkbox"
                    checked={formData.corporationData?.settings.allowPublicJoin || false}
                    onChange={(e) => updateCorporationData({
                      settings: {
                        ...formData.corporationData?.settings!,
                        allowPublicJoin: e.target.checked
                      }
                    })}
                  />
                  <SwitchSlider />
                </Switch>
              </SettingRow>
            </SettingsCard>
            
            <FormGroup>
              <Label>Maximum Creators</Label>
              <Input
                type="number"
                min="1"
                max="1000"
                value={formData.corporationData?.settings.maxCreators || 50}
                onChange={(e) => updateCorporationData({
                  settings: {
                    ...formData.corporationData?.settings!,
                    maxCreators: parseInt(e.target.value) || 50
                  }
                })}
              />
            </FormGroup>
          </StepContent>
        );
        
      case 5:
        return (
          <StepContent>
            <StepTitle>📨 Create Your First Invite</StepTitle>
            <StepDescription>
              Generate an invite link to start building your creator team
            </StepDescription>
            
            <SettingsCard>
              <SettingRow>
                <SettingInfo>
                  <SettingTitle>Create First Invite Link</SettingTitle>
                  <SettingDescription>Generate an invite link to share with creators</SettingDescription>
                </SettingInfo>
                <Switch>
                  <SwitchInput
                    type="checkbox"
                    checked={formData.corporationData?.createFirstInvite || false}
                    onChange={(e) => updateCorporationData({
                      createFirstInvite: e.target.checked
                    })}
                  />
                  <SwitchSlider />
                </Switch>
              </SettingRow>
            </SettingsCard>
            
            {formData.corporationData?.createFirstInvite && (
              <>
                <FormGroup>
                  <Label>Invite Note (Optional)</Label>
                  <TextArea
                    value={formData.corporationData?.firstInviteNote || ''}
                    onChange={(e) => updateCorporationData({ firstInviteNote: e.target.value })}
                    placeholder="Add a personal message for creators..."
                    rows={3}
                  />
                </FormGroup>
                
                <InvitePreview>
                  <Link2 size={32} color="#3B82F6" style={{ margin: '0 auto 1rem' }} />
                  <h3 style={{ margin: '0 0 0.5rem 0', color: '#1F2937' }}>Invite Link Preview</h3>
                  <p style={{ margin: '0 0 1rem 0', color: '#6B7280', fontSize: '0.9rem' }}>
                    Your invite link will be generated after setup
                  </p>
                  
                  <InviteLink>
                    <Link2 size={16} />
                    <span>https://myportal.app/invite/ABC123</span>
                    <Copy size={16} style={{ marginLeft: 'auto', cursor: 'pointer' }} />
                  </InviteLink>
                </InvitePreview>
              </>
            )}
          </StepContent>
        );
        
      default:
        return null;
    }
  };

  return (
    <StepsContainer>
      <StepIndicator>
        {steps.map((step) => (
          <Step key={step.id} active={currentStep === step.id} completed={currentStep > step.id}>
            {currentStep > step.id ? <Check size={14} /> : <step.icon size={14} />}
            {step.title}
          </Step>
        ))}
      </StepIndicator>
      
      {renderStepContent()}
      
      <ButtonGroup>
        <Button
          variant="secondary"
          onClick={handleBack}
          disabled={currentStep === 1}
        >
          <ArrowLeft size={16} />
          Back
        </Button>
        
        <Button
          variant="primary"
          onClick={handleNext}
          disabled={!canProceed() || isLoading}
        >
          {currentStep === totalSteps ? 'Complete Setup' : 'Continue'}
          {currentStep !== totalSteps && <ArrowRight size={16} />}
        </Button>
      </ButtonGroup>
    </StepsContainer>
  );
};