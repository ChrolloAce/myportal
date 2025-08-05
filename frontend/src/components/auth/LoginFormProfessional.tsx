/**
 * Professional LoginForm - Beautiful, accessible login interface
 * Modern design with smooth interactions and clear UX
 */

import React, { useState } from 'react';
import styled from 'styled-components';
import { professionalTheme } from '../../styles/professionalTheme';
import { Card, Button, Input } from '../../styles/ProfessionalStyles';
import { Eye, EyeOff, Mail, Lock, LogIn } from 'lucide-react';
import { LoginCredentials, UserRole } from '../../types';

interface LoginFormProps {
  onLogin: (credentials: LoginCredentials) => Promise<void>;
  onGoogleSignIn: (role: UserRole) => Promise<void>;
  onSwitchToRegister: () => void;
  isLoading: boolean;
  error: string | null;
}

const LoginContainer = styled.div`
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: ${professionalTheme.spacing[6]};
  background: linear-gradient(135deg, ${professionalTheme.colors.primary[50]} 0%, ${professionalTheme.colors.gray[50]} 100%);
`;

const LoginCard = styled(Card)`
  width: 100%;
  max-width: 400px;
  padding: ${professionalTheme.spacing[8]};
  text-align: center;
`;

const LoginHeader = styled.div`
  margin-bottom: ${professionalTheme.spacing[8]};
`;

const LoginIcon = styled.div`
  width: 64px;
  height: 64px;
  margin: 0 auto ${professionalTheme.spacing[4]};
  background: linear-gradient(135deg, ${professionalTheme.colors.primary[500]}, ${professionalTheme.colors.primary[600]});
  border-radius: ${professionalTheme.borderRadius.xl};
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${professionalTheme.colors.white};
  box-shadow: ${professionalTheme.shadows.lg};
`;

const LoginTitle = styled.h1`
  font-size: ${professionalTheme.typography.fontSize['2xl']};
  font-weight: ${professionalTheme.typography.fontWeight.bold};
  color: ${professionalTheme.colors.gray[900]};
  margin-bottom: ${professionalTheme.spacing[2]};
`;

const LoginSubtitle = styled.p`
  font-size: ${professionalTheme.typography.fontSize.base};
  color: ${professionalTheme.colors.gray[600]};
  line-height: ${professionalTheme.typography.lineHeight.relaxed};
`;

const LoginFormContainer = styled.form`
  display: flex;
  flex-direction: column;
  gap: ${professionalTheme.spacing[5]};
  margin-bottom: ${professionalTheme.spacing[6]};
`;

const FormGroup = styled.div`
  position: relative;
  text-align: left;
`;

const FormLabel = styled.label`
  display: block;
  font-size: ${professionalTheme.typography.fontSize.sm};
  font-weight: ${professionalTheme.typography.fontWeight.semibold};
  color: ${professionalTheme.colors.gray[700]};
  margin-bottom: ${professionalTheme.spacing[2]};
`;

const InputWrapper = styled.div`
  position: relative;
`;

const InputIcon = styled.div`
  position: absolute;
  left: ${professionalTheme.spacing[3]};
  top: 50%;
  transform: translateY(-50%);
  color: ${professionalTheme.colors.gray[400]};
  pointer-events: none;
`;

const StyledInput = styled(Input)`
  padding-left: ${professionalTheme.spacing[10]};
  
  &:focus + ${InputIcon} {
    color: ${professionalTheme.colors.primary[500]};
  }
`;

const PasswordToggle = styled.button`
  position: absolute;
  right: ${professionalTheme.spacing[3]};
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  color: ${professionalTheme.colors.gray[400]};
  cursor: pointer;
  padding: ${professionalTheme.spacing[1]};
  border-radius: ${professionalTheme.borderRadius.sm};
  
  &:hover {
    color: ${professionalTheme.colors.gray[600]};
    background: ${professionalTheme.colors.gray[100]};
  }
  
  &:focus-visible {
    outline: 2px solid ${professionalTheme.colors.primary[500]};
    outline-offset: 2px;
  }
`;

const ErrorMessage = styled.div`
  background: ${professionalTheme.colors.error[50]};
  border: 1px solid ${professionalTheme.colors.error[200]};
  border-radius: ${professionalTheme.borderRadius.md};
  padding: ${professionalTheme.spacing[3]} ${professionalTheme.spacing[4]};
  color: ${professionalTheme.colors.error[700]};
  font-size: ${professionalTheme.typography.fontSize.sm};
  margin-bottom: ${professionalTheme.spacing[4]};
  text-align: left;
`;

const LoginButton = styled(Button)`
  width: 100%;
  height: 48px;
  font-weight: ${professionalTheme.typography.fontWeight.semibold};
`;

const Divider = styled.div`
  display: flex;
  align-items: center;
  margin: ${professionalTheme.spacing[6]} 0;
  
  &::before,
  &::after {
    content: '';
    flex: 1;
    height: 1px;
    background: ${professionalTheme.borders.color.default};
  }
  
  span {
    padding: 0 ${professionalTheme.spacing[4]};
    color: ${professionalTheme.colors.gray[500]};
    font-size: ${professionalTheme.typography.fontSize.sm};
    font-weight: ${professionalTheme.typography.fontWeight.medium};
  }
`;

const GoogleButton = styled(Button)`
  width: 100%;
  height: 48px;
  background: ${professionalTheme.colors.white};
  border: 1px solid ${professionalTheme.borders.color.default};
  color: ${professionalTheme.colors.gray[700]};
  font-weight: ${professionalTheme.typography.fontWeight.semibold};
  
  &:hover:not(:disabled) {
    background: ${professionalTheme.colors.gray[50]};
    border-color: ${professionalTheme.borders.color.medium};
  }
`;

const GoogleIcon = styled.img`
  width: 20px;
  height: 20px;
  margin-right: ${professionalTheme.spacing[2]};
`;

const FooterText = styled.p`
  font-size: ${professionalTheme.typography.fontSize.sm};
  color: ${professionalTheme.colors.gray[600]};
  margin-top: ${professionalTheme.spacing[6]};
`;

const FooterLink = styled.button`
  background: none;
  border: none;
  color: ${professionalTheme.colors.primary[600]};
  font-weight: ${professionalTheme.typography.fontWeight.semibold};
  cursor: pointer;
  text-decoration: underline;
  
  &:hover {
    color: ${professionalTheme.colors.primary[700]};
  }
  
  &:focus-visible {
    outline: 2px solid ${professionalTheme.colors.primary[500]};
    outline-offset: 2px;
    border-radius: ${professionalTheme.borderRadius.sm};
  }
`;

export const LoginForm: React.FC<LoginFormProps> = ({
  onLogin,
  onGoogleSignIn,
  onSwitchToRegister,
  isLoading,
  error
}) => {
  const [credentials, setCredentials] = useState<LoginCredentials>({
    email: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!credentials.email || !credentials.password) return;
    
    try {
      await onLogin({
        ...credentials,
        role: UserRole.CREATOR // Default role, will be determined by backend
      });
    } catch (error) {
      // Error handled by parent component
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      await onGoogleSignIn(UserRole.CREATOR);
    } catch (error) {
      // Error handled by parent component
    }
  };

  return (
    <LoginContainer>
      <LoginCard>
        <LoginHeader>
          <LoginIcon>
            <LogIn size={24} />
          </LoginIcon>
          <LoginTitle>Welcome back</LoginTitle>
          <LoginSubtitle>
            Sign in to your account to continue creating amazing content
          </LoginSubtitle>
        </LoginHeader>

        {error && <ErrorMessage>{error}</ErrorMessage>}

        <LoginFormContainer onSubmit={handleSubmit}>
          <FormGroup>
            <FormLabel htmlFor="email">Email address</FormLabel>
            <InputWrapper>
              <StyledInput
                id="email"
                type="email"
                placeholder="Enter your email"
                value={credentials.email}
                onChange={(e) => setCredentials(prev => ({ 
                  ...prev, 
                  email: e.target.value 
                }))}
                disabled={isLoading}
                required
              />
              <InputIcon>
                <Mail size={20} />
              </InputIcon>
            </InputWrapper>
          </FormGroup>

          <FormGroup>
            <FormLabel htmlFor="password">Password</FormLabel>
            <InputWrapper>
              <StyledInput
                id="password"
                type={showPassword ? 'text' : 'password'}
                placeholder="Enter your password"
                value={credentials.password}
                onChange={(e) => setCredentials(prev => ({ 
                  ...prev, 
                  password: e.target.value 
                }))}
                disabled={isLoading}
                required
              />
              <InputIcon>
                <Lock size={20} />
              </InputIcon>
              <PasswordToggle
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                disabled={isLoading}
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </PasswordToggle>
            </InputWrapper>
          </FormGroup>

          <LoginButton
            type="submit"
            variant="primary"
            disabled={isLoading || !credentials.email || !credentials.password}
            loading={isLoading}
          >
            {isLoading ? 'Signing in...' : 'Sign in'}
          </LoginButton>
        </LoginFormContainer>

        <Divider>
          <span>or</span>
        </Divider>

        <GoogleButton
          type="button"
          variant="secondary"
          onClick={handleGoogleSignIn}
          disabled={isLoading}
        >
          <GoogleIcon 
            src="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZD0iTTIyLjU2IDEyLjI1QzIyLjU2IDExLjQ3IDIyLjQ5IDEwLjcyIDIyLjM2IDEwSDEyVjE0LjI2SDE3LjkxQzE3LjY0IDE1LjU5IDE2Ljk2IDE2Ljc0IDE1Ljk2IDE3LjUzVjIwLjMxSDE5LjM4QzIxLjMxIDE4LjQ3IDIyLjU2IDE1LjYzIDIyLjU2IDEyLjI1WiIgZmlsbD0iIzQyODVGNCIvPgo8cGF0aCBkPSJNMTIgMjNDMTQuOTcgMjMgMTcuNDYgMjIuMDggMTkuMzggMjAuMzFMMTUuOTYgMTcuNTNDMTQuOTYgMTguMjMgMTMuNTggMTguNjkgMTIgMTguNjlDOS4xNCAxOC42OSA2LjcyIDE2Ljg0IDUuODQgMTQuMzFIMi4zOFYxNy4xNkM0LjI5IDE5Ljk3IDcuOTUgMjMgMTIgMjNaIiBmaWxsPSIjMzRBODUzIi8+CjxwYXRoIGQ9Ik01Ljg0IDE0LjMxQzUuNTkgMTMuNjEgNS40NyAxMi44MiA1LjQ3IDEyQzUuNDcgMTEuMTggNS41OSAxMC4zOSA1Ljg0IDkuNjlWNi44NEgyLjM4QzEuNSA4LjU5IDEgMTAuMjMgMSAxMkMxIDEzLjc3IDEuNSAxNS40MSAyLjM4IDE3LjE2TDUuODQgMTQuMzFaIiBmaWxsPSIjRkJCQzA0Ii8+CjxwYXRoIGQ9Ik0xMiA1LjMxQzEzLjc5IDUuMzEgMTUuNDIgNS45NyAxNi43MyA3LjI0TDE5Ljc5IDQuMTlDMTcuNDYgMi4wMSAxNC45NyAxIDEyIDFDNy45NSAxIDQuMjkgNC4wMyAyLjM4IDYuODRMNS44NCA5LjY5QzYuNzIgNy4xNiA5LjE0IDUuMzEgMTIgNS4zMVoiIGZpbGw9IiNFQTQzMzUiLz4KPC9zdmc+Cg==" 
            alt="Google"
          />
          Continue with Google
        </GoogleButton>

        <FooterText>
          Don't have an account?{' '}
          <FooterLink onClick={onSwitchToRegister}>
            Sign up for free
          </FooterLink>
        </FooterText>
      </LoginCard>
    </LoginContainer>
  );
};