/**
 * InviteLanding - Landing page for corporation invite links
 * Handles invite code processing and corporation joining
 */

import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { theme } from '../../styles/theme';
import { 
  Building2, UserPlus, CheckCircle, XCircle,
  Instagram, Twitter, Globe, ArrowRight, LogIn, UserPlus as UserPlusIcon
} from 'lucide-react';
import { FirebaseCorporationManager } from '../../firebase/FirebaseCorporationManager';
import { FirebaseAuthManager } from '../../firebase/FirebaseAuthManager';
import { Corporation, CorporationInvite, LoginCredentials, RegisterData, UserRole } from '../../types';
import { LoginForm } from '../auth/LoginForm';
import { RegisterForm } from '../auth/RegisterForm';

interface InviteLandingProps {
  inviteCode: string;
  onJoinSuccess: () => void;
}

const LandingContainer = styled.div`
  min-height: 100vh;
  background: linear-gradient(135deg, ${theme.colors.primary[50]} 0%, ${theme.colors.primary[100]} 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem;
`;

const InviteCard = styled.div`
  background: ${theme.colors.neutral[0]};
  border-radius: 20px;
  padding: 3rem;
  max-width: 600px;
  width: 100%;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
  text-align: center;
`;

const InviteHeader = styled.div`
  margin-bottom: 2rem;
`;

const InviteIcon = styled.div`
  width: 80px;
  height: 80px;
  background: linear-gradient(135deg, ${theme.colors.primary[500]} 0%, ${theme.colors.primary[600]} 100%);
  border-radius: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 1.5rem;
  color: white;
`;

const InviteTitle = styled.h1`
  font-size: 2rem;
  font-weight: 700;
  color: ${theme.colors.neutral[900]};
  margin-bottom: 0.5rem;
`;

const InviteSubtitle = styled.p`
  font-size: 1.1rem;
  color: ${theme.colors.neutral[600]};
  margin-bottom: 2rem;
`;

const CorporationInfo = styled.div`
  background: ${theme.colors.neutral[50]};
  border-radius: 16px;
  padding: 2rem;
  margin-bottom: 2rem;
`;

const CorporationLogo = styled.div`
  width: 60px;
  height: 60px;
  background: ${theme.colors.primary[500]};
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 1rem;
  color: white;
  font-size: 1.5rem;
`;

const CorporationName = styled.h2`
  font-size: 1.5rem;
  font-weight: 700;
  color: ${theme.colors.neutral[900]};
  margin-bottom: 0.5rem;
`;

const CorporationDescription = styled.p`
  color: ${theme.colors.neutral[600]};
  margin-bottom: 1rem;
`;

const CorporationStats = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
  gap: 1rem;
  margin-bottom: 1rem;
`;

const StatItem = styled.div`
  text-align: center;
`;

const StatValue = styled.div`
  font-size: 1.5rem;
  font-weight: 700;
  color: ${theme.colors.primary[600]};
`;

const StatLabel = styled.div`
  font-size: 0.875rem;
  color: ${theme.colors.neutral[600]};
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;

const SocialLinks = styled.div`
  display: flex;
  gap: 0.5rem;
  justify-content: center;
`;

const SocialLink = styled.a`
  display: flex;
  align-items: center;
  gap: 0.25rem;
  padding: 0.5rem 0.75rem;
  background: ${theme.colors.neutral[100]};
  border-radius: 8px;
  color: ${theme.colors.neutral[700]};
  text-decoration: none;
  font-size: 0.875rem;
  transition: all 0.2s ease;
  
  &:hover {
    background: ${theme.colors.neutral[200]};
    transform: translateY(-1px);
  }
`;

const ActionButtons = styled.div`
  display: flex;
  gap: 1rem;
  justify-content: center;
`;

const JoinButton = styled.button`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background: ${theme.colors.primary[500]};
  color: white;
  border: none;
  padding: 1rem 2rem;
  border-radius: 12px;
  font-weight: 600;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:hover:not(:disabled) {
    background: ${theme.colors.primary[600]};
    transform: translateY(-2px);
    box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
  }
  
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

const DeclineButton = styled.button`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background: ${theme.colors.neutral[100]};
  color: ${theme.colors.neutral[700]};
  border: none;
  padding: 1rem 2rem;
  border-radius: 12px;
  font-weight: 600;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:hover {
    background: ${theme.colors.neutral[200]};
  }
`;

const LoadingState = styled.div`
  padding: 2rem;
  text-align: center;
  color: ${theme.colors.neutral[600]};
`;

const ErrorState = styled.div`
  background: ${theme.colors.error.light};
  border: 2px solid ${theme.colors.error.light};
  border-radius: 12px;
  padding: 2rem;
  text-align: center;
  color: ${theme.colors.error.dark};
`;

const SuccessState = styled.div`
  background: ${theme.colors.success.light};
  border: 2px solid ${theme.colors.success.light};
  border-radius: 12px;
  padding: 2rem;
  text-align: center;
  color: ${theme.colors.success.dark};
`;

export const InviteLanding: React.FC<InviteLandingProps> = ({
  inviteCode,
  onJoinSuccess
}) => {
  const [invite, setInvite] = useState<CorporationInvite | null>(null);
  const [corporation, setCorporation] = useState<Corporation | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isJoining, setIsJoining] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [joinSuccess, setJoinSuccess] = useState(false);
  const [authMode, setAuthMode] = useState<'none' | 'login' | 'register'>('none');
  const [shouldAutoJoin, setShouldAutoJoin] = useState(false);

  const corporationManager = FirebaseCorporationManager.getInstance();
  const authManager = FirebaseAuthManager.getInstance();

  useEffect(() => {
    loadInviteInfo();
  }, [inviteCode]);

  const loadInviteInfo = async () => {
    try {
      setIsLoading(true);
      setError(null);

      // Debug logging for mobile issues
      console.log('🔍 Loading invite with code:', inviteCode);
      console.log('🔍 Invite code length:', inviteCode?.length);
      console.log('🔍 Invite code type:', typeof inviteCode);

      // Get invite information
      const inviteData = await corporationManager.getInviteByCode(inviteCode);
      console.log('🔍 Invite data received:', inviteData ? 'Found' : 'Not found');
      
      if (!inviteData) {
        throw new Error('Invite not found or expired');
      }

      // Check if invite is still valid
      if (!inviteData.isActive) {
        throw new Error('This invite is no longer active');
      }

      if (inviteData.expiresAt && new Date(inviteData.expiresAt) < new Date()) {
        throw new Error('This invite has expired');
      }

      if (inviteData.maxUses && inviteData.currentUses >= inviteData.maxUses) {
        throw new Error('This invite has reached its usage limit');
      }

      setInvite(inviteData);

      // Load corporation info
      const corpData = await corporationManager.getCorporation(inviteData.corporationId);
      setCorporation(corpData);

    } catch (error) {
      console.error('Error loading invite:', error);
      setError(error instanceof Error ? error.message : 'Failed to load invite');
    } finally {
      setIsLoading(false);
    }
  };

  const handleJoinCorporation = async () => {
    if (!invite || !corporation) return;

    const currentUser = authManager.getCurrentUser();
    if (!currentUser) {
      // Show authentication options instead of error
      setAuthMode('login');
      setShouldAutoJoin(true);
      return;
    }

    try {
      setIsJoining(true);
      setError(null);

      await corporationManager.joinCorporationWithInvite(inviteCode, currentUser.id);
      setJoinSuccess(true);
      
      // Wait a moment then call success callback
      setTimeout(() => {
        onJoinSuccess();
      }, 2000);

    } catch (error) {
      console.error('Error joining corporation:', error);
      setError(error instanceof Error ? error.message : 'Failed to join corporation');
    } finally {
      setIsJoining(false);
    }
  };

  const handleLogin = async (credentials: LoginCredentials) => {
    try {
      setError(null);
      await authManager.login(credentials);
      setAuthMode('none');
      
      // Auto-join after successful login
      if (shouldAutoJoin) {
        setShouldAutoJoin(false);
        setTimeout(() => handleJoinCorporation(), 500);
      }
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Login failed');
    }
  };

  const handleRegister = async (data: RegisterData) => {
    try {
      setError(null);
      await authManager.register(data);
      setAuthMode('none');
      
      // Auto-join after successful registration
      if (shouldAutoJoin) {
        setShouldAutoJoin(false);
        setTimeout(() => handleJoinCorporation(), 500);
      }
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Registration failed');
    }
  };

  const handleGoogleSignIn = async (role: UserRole = UserRole.CREATOR) => {
    try {
      setError(null);
      await authManager.signInWithGoogle();
      setAuthMode('none');
      
      // Auto-join after successful Google sign-in
      if (shouldAutoJoin) {
        setShouldAutoJoin(false);
        setTimeout(() => handleJoinCorporation(), 500);
      }
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Google sign-in failed');
    }
  };

  if (isLoading) {
    return (
      <LandingContainer>
        <InviteCard>
          <LoadingState>
            Loading invite information...
          </LoadingState>
        </InviteCard>
      </LandingContainer>
    );
  }

  if (error) {
    return (
      <LandingContainer>
        <InviteCard>
          <ErrorState>
            <XCircle size={48} style={{ marginBottom: '1rem' }} />
            <h3>Invite Error</h3>
            <p>{error}</p>
          </ErrorState>
        </InviteCard>
      </LandingContainer>
    );
  }

  if (joinSuccess) {
    return (
      <LandingContainer>
        <InviteCard>
          <SuccessState>
            <CheckCircle size={48} style={{ marginBottom: '1rem' }} />
            <h3>Welcome to the Team! 🎉</h3>
            <p>You've successfully joined {corporation?.displayName}. Redirecting you to your dashboard...</p>
          </SuccessState>
        </InviteCard>
      </LandingContainer>
    );
  }

  if (!invite || !corporation) {
    return (
      <LandingContainer>
        <InviteCard>
          <ErrorState>
            <XCircle size={48} style={{ marginBottom: '1rem' }} />
            <h3>Invalid Invite</h3>
            <p>This invite link is not valid or has expired.</p>
          </ErrorState>
        </InviteCard>
      </LandingContainer>
    );
  }

  // Show auth forms when user needs to login/register
  if (authMode === 'login') {
    return (
      <LandingContainer>
        <InviteCard>
          <InviteHeader>
            <InviteIcon>
              <LogIn size={40} />
            </InviteIcon>
            <InviteTitle>Sign In to Join</InviteTitle>
            <InviteSubtitle>
              Sign in to join {corporation.displayName}
            </InviteSubtitle>
          </InviteHeader>

          <LoginForm
            onLogin={handleLogin}
            onGoogleSignIn={handleGoogleSignIn}
            onSwitchToRegister={() => setAuthMode('register')}
            isLoading={false}
            error={error}
          />

          <div style={{ marginTop: '1rem', textAlign: 'center' }}>
            <p style={{ color: theme.colors.neutral[600], fontSize: '0.9rem' }}>
              Don't have an account?{' '}
              <button
                onClick={() => setAuthMode('register')}
                style={{
                  background: 'none',
                  border: 'none',
                  color: theme.colors.primary[500],
                  cursor: 'pointer',
                  textDecoration: 'underline'
                }}
              >
                Create one
              </button>
            </p>
          </div>
        </InviteCard>
      </LandingContainer>
    );
  }

  if (authMode === 'register') {
    return (
      <LandingContainer>
        <InviteCard>
          <InviteHeader>
            <InviteIcon>
              <UserPlusIcon size={40} />
            </InviteIcon>
            <InviteTitle>Create Account to Join</InviteTitle>
            <InviteSubtitle>
              Create an account to join {corporation.displayName}
            </InviteSubtitle>
          </InviteHeader>

          <RegisterForm
            onRegister={handleRegister}
            onGoogleSignIn={handleGoogleSignIn}
            onSwitchToLogin={() => setAuthMode('login')}
            isLoading={false}
            error={error}
          />

          <div style={{ marginTop: '1rem', textAlign: 'center' }}>
            <p style={{ color: theme.colors.neutral[600], fontSize: '0.9rem' }}>
              Already have an account?{' '}
              <button
                onClick={() => setAuthMode('login')}
                style={{
                  background: 'none',
                  border: 'none',
                  color: theme.colors.primary[500],
                  cursor: 'pointer',
                  textDecoration: 'underline'
                }}
              >
                Sign in
              </button>
            </p>
          </div>
        </InviteCard>
      </LandingContainer>
    );
  }

  return (
    <LandingContainer>
      <InviteCard>
        <InviteHeader>
          <InviteIcon>
            <UserPlus size={40} />
          </InviteIcon>
          <InviteTitle>You've Been Invited!</InviteTitle>
          <InviteSubtitle>
            Join an amazing team of creators and start collaborating on exciting projects.
          </InviteSubtitle>
        </InviteHeader>

        <CorporationInfo>
          <CorporationLogo>
            <Building2 size={30} />
          </CorporationLogo>
          <CorporationName>{corporation.displayName}</CorporationName>
          {corporation.description && (
            <CorporationDescription>{corporation.description}</CorporationDescription>
          )}

          <CorporationStats>
            <StatItem>
              <StatValue>{corporation.memberCount}</StatValue>
              <StatLabel>Members</StatLabel>
            </StatItem>
            <StatItem>
              <StatValue>{corporation.industry}</StatValue>
              <StatLabel>Industry</StatLabel>
            </StatItem>
          </CorporationStats>

          {corporation.socialMedia && (
            <SocialLinks>
              {corporation.socialMedia.instagram && (
                <SocialLink href={`https://instagram.com/${corporation.socialMedia.instagram.replace('@', '')}`} target="_blank">
                  <Instagram size={14} />
                  Instagram
                </SocialLink>
              )}
              {corporation.socialMedia.twitter && (
                <SocialLink href={`https://twitter.com/${corporation.socialMedia.twitter.replace('@', '')}`} target="_blank">
                  <Twitter size={14} />
                  Twitter
                </SocialLink>
              )}
              {corporation.website && (
                <SocialLink href={corporation.website} target="_blank">
                  <Globe size={14} />
                  Website
                </SocialLink>
              )}
            </SocialLinks>
          )}
        </CorporationInfo>

        <ActionButtons>
          <JoinButton
            onClick={handleJoinCorporation}
            disabled={isJoining}
          >
            {isJoining ? (
              'Joining...'
            ) : (
              <>
                <UserPlus size={20} />
                Join Team
                <ArrowRight size={16} />
              </>
            )}
          </JoinButton>
          
          <DeclineButton onClick={() => window.history.back()}>
            <XCircle size={16} />
            Maybe Later
          </DeclineButton>
        </ActionButtons>
      </InviteCard>
    </LandingContainer>
  );
};