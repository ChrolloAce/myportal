/**
 * Professional OnboardingWizard - Beautiful multi-step onboarding
 * Clean, guided experience for new users
 */

import React, { useState } from 'react';
import styled from 'styled-components';
import { professionalTheme } from '../../styles/professionalTheme';
import { Card, Button, Input, Textarea } from '../../styles/ProfessionalStyles';
import { 
  ArrowLeft, 
  ArrowRight, 
  Check, 
  Building2, 
  Camera
} from 'lucide-react';
import { CreatorOnboardingData, AdminOnboardingData, CorporationOnboarding, UserRole } from '../../types';

interface OnboardingWizardProps {
  userRole: UserRole;
  onComplete: (data: CreatorOnboardingData | (AdminOnboardingData & { corporationData: CorporationOnboarding })) => void;
  onCancel: () => void;
}

const OnboardingContainer = styled.div`
  min-height: 100vh;
  background: linear-gradient(135deg, ${professionalTheme.colors.primary[50]} 0%, ${professionalTheme.colors.gray[50]} 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: ${professionalTheme.spacing[6]};
`;

const OnboardingCard = styled(Card)`
  width: 100%;
  max-width: 600px;
  padding: ${professionalTheme.spacing[8]};
  position: relative;
  overflow: hidden;
`;

const ProgressBar = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 4px;
  background: ${professionalTheme.colors.gray[200]};
`;

const ProgressFill = styled.div<{ progress: number }>`
  height: 100%;
  background: linear-gradient(90deg, ${professionalTheme.colors.primary[500]}, ${professionalTheme.colors.primary[600]});
  width: ${props => props.progress}%;
  transition: ${professionalTheme.transitions.all};
  border-radius: 0 2px 2px 0;
`;

const StepIndicator = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: ${professionalTheme.spacing[4]};
  margin-bottom: ${professionalTheme.spacing[8]};
`;

const StepDot = styled.div<{ isActive: boolean; isCompleted: boolean }>`
  width: 32px;
  height: 32px;
  border-radius: ${professionalTheme.borderRadius.full};
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: ${professionalTheme.typography.fontSize.sm};
  font-weight: ${professionalTheme.typography.fontWeight.semibold};
  transition: ${professionalTheme.transitions.all};
  
  ${props => {
    if (props.isCompleted) {
      return `
        background: ${professionalTheme.colors.success[500]};
        color: ${professionalTheme.colors.white};
      `;
    } else if (props.isActive) {
      return `
        background: ${professionalTheme.colors.primary[500]};
        color: ${professionalTheme.colors.white};
      `;
    } else {
      return `
        background: ${professionalTheme.colors.gray[200]};
        color: ${professionalTheme.colors.gray[500]};
      `;
    }
  }}
`;

const StepConnector = styled.div<{ isCompleted: boolean }>`
  width: 40px;
  height: 2px;
  background: ${props => props.isCompleted 
    ? professionalTheme.colors.success[500] 
    : professionalTheme.colors.gray[200]};
  transition: ${professionalTheme.transitions.all};
`;

const WelcomeSection = styled.div`
  text-align: center;
  margin-bottom: ${professionalTheme.spacing[8]};
`;

const WelcomeIcon = styled.div`
  width: 80px;
  height: 80px;
  margin: 0 auto ${professionalTheme.spacing[6]};
  background: linear-gradient(135deg, ${professionalTheme.colors.primary[500]}, ${professionalTheme.colors.primary[600]});
  border-radius: ${professionalTheme.borderRadius.xl};
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${professionalTheme.colors.white};
  box-shadow: ${professionalTheme.shadows.lg};
`;

const WelcomeTitle = styled.h1`
  font-size: ${professionalTheme.typography.fontSize['3xl']};
  font-weight: ${professionalTheme.typography.fontWeight.bold};
  color: ${professionalTheme.colors.gray[900]};
  margin-bottom: ${professionalTheme.spacing[3]};
`;

const WelcomeSubtitle = styled.p`
  font-size: ${professionalTheme.typography.fontSize.lg};
  color: ${professionalTheme.colors.gray[600]};
  line-height: ${professionalTheme.typography.lineHeight.relaxed};
  max-width: 480px;
  margin: 0 auto;
`;

const StepContent = styled.div`
  min-height: 300px;
  display: flex;
  flex-direction: column;
`;

const StepTitle = styled.h2`
  font-size: ${professionalTheme.typography.fontSize['2xl']};
  font-weight: ${professionalTheme.typography.fontWeight.semibold};
  color: ${professionalTheme.colors.gray[900]};
  margin-bottom: ${professionalTheme.spacing[3]};
`;

const StepDescription = styled.p`
  font-size: ${professionalTheme.typography.fontSize.base};
  color: ${professionalTheme.colors.gray[600]};
  line-height: ${professionalTheme.typography.lineHeight.relaxed};
  margin-bottom: ${professionalTheme.spacing[6]};
`;

const FormGroup = styled.div`
  margin-bottom: ${professionalTheme.spacing[5]};
`;

const FormLabel = styled.label`
  display: block;
  font-size: ${professionalTheme.typography.fontSize.sm};
  font-weight: ${professionalTheme.typography.fontWeight.semibold};
  color: ${professionalTheme.colors.gray[700]};
  margin-bottom: ${professionalTheme.spacing[2]};
`;

const FormActions = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: ${professionalTheme.spacing[4]};
  margin-top: auto;
  padding-top: ${professionalTheme.spacing[6]};
`;

const BackButton = styled(Button)`
  flex: 0 0 auto;
`;

const NextButton = styled(Button)`
  flex: 1;
`;



export const OnboardingWizard: React.FC<OnboardingWizardProps> = ({
  userRole,
  onComplete,
  onCancel
}) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState<any>({
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
      }
    }
  });

  const totalSteps = userRole === UserRole.ADMIN ? 3 : 2;
  const progress = ((currentStep + 1) / totalSteps) * 100;

  const updateFormData = (field: string, value: any) => {
    setFormData((prev: any) => ({ ...prev, [field]: value }));
  };

  const handleNext = () => {
    if (currentStep < totalSteps - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      onComplete(formData);
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 0:
        return (
          <StepContent>
            <WelcomeSection>
              <WelcomeIcon>
                {userRole === UserRole.ADMIN ? <Building2 size={32} /> : <Camera size={32} />}
              </WelcomeIcon>
              <WelcomeTitle>
                Welcome to Portal
              </WelcomeTitle>
              <WelcomeSubtitle>
                Let's get you set up with everything you need to{' '}
                {userRole === UserRole.ADMIN ? 'manage your team' : 'create amazing content'}.
                This will only take a few minutes.
              </WelcomeSubtitle>
            </WelcomeSection>
            
            <FormActions>
              <BackButton variant="secondary" onClick={onCancel}>
                Cancel
              </BackButton>
              <NextButton variant="primary" onClick={handleNext}>
                Get Started
                <ArrowRight size={16} />
              </NextButton>
            </FormActions>
          </StepContent>
        );

      case 1:
        return (
          <StepContent>
            <StepTitle>Personal Information</StepTitle>
            <StepDescription>
              Tell us your name and social media handles to get started.
            </StepDescription>

            <FormGroup>
              <FormLabel>Full Name</FormLabel>
              <Input
                type="text"
                placeholder="Enter your full name"
                value={userRole === UserRole.ADMIN ? (formData.username || '') : (formData.name || '')}
                onChange={(e) => updateFormData(userRole === UserRole.ADMIN ? 'username' : 'name', e.target.value)}
              />
            </FormGroup>

            {userRole === UserRole.CREATOR && (
              <>
                <FormGroup>
                  <FormLabel>Instagram Handle (Optional)</FormLabel>
                  <Input
                    type="text"
                    placeholder="@yourusername"
                    value={formData.instagramHandle || ''}
                    onChange={(e) => updateFormData('instagramHandle', e.target.value)}
                  />
                </FormGroup>

                <FormGroup>
                  <FormLabel>TikTok Handle (Optional)</FormLabel>
                  <Input
                    type="text"
                    placeholder="@yourusername"
                    value={formData.tiktokHandle || ''}
                    onChange={(e) => updateFormData('tiktokHandle', e.target.value)}
                  />
                </FormGroup>
              </>
            )}

            <FormActions>
              <BackButton variant="secondary" onClick={handleBack}>
                <ArrowLeft size={16} />
                Back
              </BackButton>
              <NextButton 
                variant="primary" 
                onClick={handleNext}
                disabled={!formData.name}
              >
                {userRole === UserRole.ADMIN ? 'Next' : 'Complete Setup'}
                <ArrowRight size={16} />
              </NextButton>
            </FormActions>
          </StepContent>
        );

      case 2:
        return (
          <StepContent>
            <StepTitle>Create Your Organization</StepTitle>
            <StepDescription>
              Set up your organization to start inviting team members and managing projects.
            </StepDescription>

            <FormGroup>
              <FormLabel>Organization Name</FormLabel>
              <Input
                type="text"
                placeholder="Enter your organization name"
                value={formData.corporationData?.displayName || ''}
                onChange={(e) => updateFormData('corporationData', {
                  ...formData.corporationData,
                  corporationName: e.target.value,
                  displayName: e.target.value
                })}
              />
            </FormGroup>

            <FormGroup>
              <FormLabel>Description</FormLabel>
              <Textarea
                placeholder="Describe what your organization does..."
                value={formData.corporationData?.description || ''}
                onChange={(e) => updateFormData('corporationData', {
                  ...formData.corporationData,
                  description: e.target.value
                })}
              />
            </FormGroup>

            <FormGroup>
              <FormLabel>Industry</FormLabel>
              <Input
                type="text"
                placeholder="e.g. Marketing, Entertainment, Education"
                value={formData.corporationData?.industry || ''}
                onChange={(e) => updateFormData('corporationData', {
                  ...formData.corporationData,
                  industry: e.target.value
                })}
              />
            </FormGroup>

            <FormGroup>
              <FormLabel>Website (Optional)</FormLabel>
              <Input
                type="url"
                placeholder="https://your-company.com"
                value={formData.corporationData?.website || ''}
                onChange={(e) => updateFormData('corporationData', {
                  ...formData.corporationData,
                  website: e.target.value
                })}
              />
            </FormGroup>

            <FormActions>
              <BackButton variant="secondary" onClick={handleBack}>
                <ArrowLeft size={16} />
                Back
              </BackButton>
              <NextButton 
                variant="primary" 
                onClick={handleNext}
                disabled={!formData.corporationData?.displayName}
              >
                Complete Setup
                <Check size={16} />
              </NextButton>
            </FormActions>
          </StepContent>
        );

      default:
        return null;
    }
  };

  return (
    <OnboardingContainer>
      <OnboardingCard>
        <ProgressBar>
          <ProgressFill progress={progress} />
        </ProgressBar>

        {currentStep > 0 && (
          <StepIndicator>
            {Array.from({ length: totalSteps }, (_, index) => (
              <React.Fragment key={index}>
                <StepDot
                  isActive={index === currentStep}
                  isCompleted={index < currentStep}
                >
                  {index < currentStep ? <Check size={16} /> : index + 1}
                </StepDot>
                {index < totalSteps - 1 && (
                  <StepConnector isCompleted={index < currentStep} />
                )}
              </React.Fragment>
            ))}
          </StepIndicator>
        )}

        {renderStep()}
      </OnboardingCard>
    </OnboardingContainer>
  );
};