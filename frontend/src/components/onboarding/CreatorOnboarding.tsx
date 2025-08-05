/**
 * CreatorOnboarding - Multi-step onboarding flow for creators
 * Steps: Profile Setup → Social Media → Corporation Invite (optional)
 */

import React, { useState } from 'react';
import styled from 'styled-components';
import { theme } from '../../styles/theme';
import { User, Instagram, Twitter, Youtube, ArrowRight, ArrowLeft, Check, Users, Link2 } from 'lucide-react';
import { CreatorOnboardingData } from '../../types';

interface CreatorOnboardingProps {
  onComplete: (data: CreatorOnboardingData) => Promise<void>;
  isLoading: boolean;
}

const StepsContainer = styled.div`
  padding: 2rem;
`;

const StepIndicator = styled.div`
  display: flex;
  justify-content: center;
  margin-bottom: 3rem;
`;

const Step = styled.div<{ active: boolean; completed: boolean }>`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.5rem;
  border-radius: 30px;
  font-weight: 600;
  font-size: 0.9rem;
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

const StepConnector = styled.div<{ completed: boolean }>`
  width: 3rem;
  height: 2px;
  background: ${props => props.completed ? theme.colors.success.main : theme.colors.neutral[200]};
  margin: 0 0.5rem;
  transition: all 0.3s ease;
`;

const StepContent = styled.div`
  max-width: 500px;
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
  
  &.youtube {
    background: #FF0000;
  }
`;

const InviteCodeCard = styled.div`
  background: ${theme.colors.neutral[50]};
  border: 2px dashed ${theme.colors.neutral[200]};
  border-radius: 12px;
  padding: 2rem;
  text-align: center;
  margin: 1rem 0;
`;

const InviteCodeInput = styled.div`
  display: flex;
  gap: 0.5rem;
  margin-top: 1rem;
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

export const CreatorOnboarding: React.FC<CreatorOnboardingProps> = ({
  onComplete,
  isLoading
}) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<CreatorOnboardingData>({
    name: '',
    instagramHandle: '',
    tiktokHandle: '',
    inviteCode: ''
  });

  const totalSteps = 3;

  const steps = [
    { id: 1, title: 'Profile', icon: User, completed: currentStep > 1 },
    { id: 2, title: 'Social Media', icon: Instagram, completed: currentStep > 2 },
    { id: 3, title: 'Join Team', icon: Users, completed: currentStep > 3 }
  ];

  const handleNext = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(prev => prev + 1);
    } else {
      onComplete(formData);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const updateFormData = (updates: Partial<CreatorOnboardingData>) => {
    setFormData(prev => ({ ...prev, ...updates }));
  };

  const canProceed = () => {
    switch (currentStep) {
      case 1:
        return formData.name.trim().length > 0;
      case 2:
        return true; // Social media is optional
      case 3:
        return true; // Invite code is optional
      default:
        return false;
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <StepContent>
            <StepTitle>✨ Set Up Your Profile</StepTitle>
            <StepDescription>
              Tell us your name to get started
            </StepDescription>
            
            <FormGroup>
              <Label>Full Name *</Label>
              <Input
                type="text"
                value={formData.name}
                onChange={(e) => updateFormData({ name: e.target.value })}
                placeholder="Enter your full name"
              />
            </FormGroup>
          </StepContent>
        );
        
      case 2:
        return (
          <StepContent>
            <StepTitle>🔗 Connect Your Socials</StepTitle>
            <StepDescription>
              Add your Instagram and TikTok handles (optional)
            </StepDescription>
            
            <SocialInputGroup>
              <SocialIcon className="instagram">
                <Instagram size={20} />
              </SocialIcon>
              <Input
                type="text"
                value={formData.instagramHandle || ''}
                onChange={(e) => updateFormData({ instagramHandle: e.target.value })}
                placeholder="@yourhandle"
              />
            </SocialInputGroup>
            
            <SocialInputGroup>
              <SocialIcon className="tiktok">
                <span style={{ fontWeight: 'bold', fontSize: '14px' }}>TT</span>
              </SocialIcon>
              <Input
                type="text"
                value={formData.tiktokHandle || ''}
                onChange={(e) => updateFormData({ tiktokHandle: e.target.value })}
                placeholder="@yourhandle"
              />
            </SocialInputGroup>
          </StepContent>
        );
        
      case 3:
        return (
          <StepContent>
            <StepTitle>🏢 Join a Corporation</StepTitle>
            <StepDescription>
              Got an invite code? Join a corporation to collaborate with brands and teams
            </StepDescription>
            
            <InviteCodeCard>
              <Link2 size={32} color="#6B7280" style={{ margin: '0 auto 1rem' }} />
              <h3 style={{ margin: '0 0 0.5rem 0', color: '#374151' }}>Have an invite code?</h3>
              <p style={{ margin: '0 0 1rem 0', color: '#6B7280', fontSize: '0.9rem' }}>
                Enter your invite code below to join a corporation
              </p>
              
              <InviteCodeInput>
                <Input
                  type="text"
                  value={formData.inviteCode || ''}
                  onChange={(e) => updateFormData({ inviteCode: e.target.value })}
                  placeholder="Enter invite code"
                  style={{ textAlign: 'center', textTransform: 'uppercase', letterSpacing: '0.1em' }}
                />
              </InviteCodeInput>
            </InviteCodeCard>
            
            <p style={{ 
              textAlign: 'center', 
              color: '#6B7280', 
              fontSize: '0.9rem',
              marginTop: '1rem'
            }}>
              Don't have an invite code? No problem! You can join a corporation later from your dashboard.
            </p>
          </StepContent>
        );
        
      default:
        return null;
    }
  };

  return (
    <StepsContainer>
      <StepIndicator>
        {steps.map((step, index) => (
          <React.Fragment key={step.id}>
            <Step active={currentStep === step.id} completed={step.completed}>
              {step.completed ? <Check size={16} /> : <step.icon size={16} />}
              {step.title}
            </Step>
            {index < steps.length - 1 && (
              <StepConnector completed={step.completed} />
            )}
          </React.Fragment>
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