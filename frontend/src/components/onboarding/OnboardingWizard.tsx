/**
 * OnboardingWizard - Beautiful step-by-step onboarding flow
 * Handles both creator and admin onboarding with professional design
 */

import React, { useState } from 'react';
import styled from 'styled-components';
import { theme } from '../../styles/theme';
import { UserRole } from '../../types';
import { CreatorOnboarding } from './CreatorOnboarding';
import { AdminOnboarding } from './AdminOnboarding';

interface OnboardingWizardProps {
  userRole: UserRole;
  onComplete: (data: any) => Promise<void>;
  onSkip?: () => void;
}

const OnboardingContainer = styled.div`
  min-height: 100vh;
  background: linear-gradient(135deg, ${theme.colors.primary[50]} 0%, ${theme.colors.primary[100]} 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem;
`;

const OnboardingCard = styled.div`
  background: white;
  border-radius: 20px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.1);
  max-width: 800px;
  width: 100%;
  overflow: hidden;
  position: relative;
`;

const OnboardingHeader = styled.div`
  background: ${theme.colors.primary[500]};
  color: white;
  padding: 2rem;
  text-align: center;
  position: relative;
  overflow: hidden;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(45deg, transparent 30%, rgba(255,255,255,0.1) 50%, transparent 70%);
    transform: translateX(-100%);
    animation: shine 3s infinite;
  }
  
  @keyframes shine {
    0% { transform: translateX(-100%); }
    100% { transform: translateX(100%); }
  }
`;

const WelcomeTitle = styled.h1`
  font-size: 2.5rem;
  font-weight: 700;
  margin: 0 0 0.5rem 0;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
`;

const WelcomeSubtitle = styled.p`
  font-size: 1.2rem;
  opacity: 0.9;
  margin: 0;
  font-weight: 300;
`;

const OnboardingContent = styled.div`
  padding: 0;
`;

const SkipButton = styled.button`
  position: absolute;
  top: 1rem;
  right: 1rem;
  background: rgba(255, 255, 255, 0.2);
  color: white;
  border: 1px solid rgba(255, 255, 255, 0.3);
  border-radius: 8px;
  padding: 0.5rem 1rem;
  font-size: 0.9rem;
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:hover {
    background: rgba(255, 255, 255, 0.3);
    transform: translateY(-1px);
  }
`;

export const OnboardingWizard: React.FC<OnboardingWizardProps> = ({
  userRole,
  onComplete,
  onSkip
}) => {
  const [isLoading, setIsLoading] = useState(false);

  const handleComplete = async (data: any) => {
    setIsLoading(true);
    try {
      await onComplete(data);
    } catch (error) {
      console.error('Onboarding completion error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getWelcomeContent = () => {
    if (userRole === UserRole.CREATOR) {
      return {
        emoji: '🎬',
        title: 'Welcome, Creator!',
        subtitle: 'Let\'s set up your profile and connect your social media accounts'
      };
    } else {
      return {
        emoji: '🏢',
        title: 'Welcome, Admin!',
        subtitle: 'Let\'s set up your corporation and start building your team'
      };
    }
  };

  const { emoji, title, subtitle } = getWelcomeContent();

  return (
    <OnboardingContainer>
      <OnboardingCard>
        <OnboardingHeader>
          {onSkip && (
            <SkipButton onClick={onSkip}>
              Skip for now
            </SkipButton>
          )}
          <WelcomeTitle>
            <span style={{ fontSize: '3rem' }}>{emoji}</span>
            {title}
          </WelcomeTitle>
          <WelcomeSubtitle>{subtitle}</WelcomeSubtitle>
        </OnboardingHeader>
        
        <OnboardingContent>
          {userRole === UserRole.CREATOR ? (
            <CreatorOnboarding 
              onComplete={handleComplete}
              isLoading={isLoading}
            />
          ) : (
            <AdminOnboarding 
              onComplete={handleComplete}
              isLoading={isLoading}
            />
          )}
        </OnboardingContent>
      </OnboardingCard>
    </OnboardingContainer>
  );
};