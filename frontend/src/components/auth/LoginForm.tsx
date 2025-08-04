/**
 * LoginForm - Clean, welcoming authentication interface
 * Handles both creator and admin login with premium feel
 */

import React, { useState } from 'react';
import styled from 'styled-components';
import { theme } from '../../styles/theme';
import { Card, Button, Input } from '../../styles/GlobalStyles';
import { LoadingSpinner } from '../shared/LoadingSpinner';
import { LoginCredentials } from '../../types';

interface LoginFormProps {
  onLogin: (credentials: LoginCredentials) => Promise<void>;
  onGoogleSignIn: () => Promise<void>;
  onSwitchToRegister: () => void;
  isLoading: boolean;
  error: string | null;
}

const LoginContainer = styled.div`
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: ${theme.spacing[4]};
  background: linear-gradient(135deg, ${theme.colors.primary[50]} 0%, ${theme.colors.neutral[50]} 100%);
`;

const LoginCard = styled(Card)`
  width: 100%;
  max-width: 400px;
  text-align: center;
`;

const WelcomeTitle = styled.h1`
  margin-bottom: ${theme.spacing[2]};
  color: ${theme.colors.neutral[900]};
`;

const WelcomeSubtitle = styled.p`
  margin-bottom: ${theme.spacing[8]};
  color: ${theme.colors.neutral[600]};
  font-size: ${theme.typography.fontSize.lg};
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: ${theme.spacing[4]};
`;

const InputGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${theme.spacing[2]};
  text-align: left;
`;

const Label = styled.label`
  font-weight: ${theme.typography.fontWeight.medium};
  color: ${theme.colors.neutral[700]};
  font-size: ${theme.typography.fontSize.sm};
`;

const ErrorMessage = styled.div`
  padding: ${theme.spacing[3]} ${theme.spacing[4]};
  background: ${theme.colors.error.light};
  color: ${theme.colors.error.dark};
  border-radius: ${theme.borderRadius.md};
  font-size: ${theme.typography.fontSize.sm};
  margin-bottom: ${theme.spacing[4]};
`;

const GoogleButton = styled(Button)`
  background: ${theme.colors.neutral[0]};
  color: ${theme.colors.neutral[700]};
  border: 1px solid ${theme.colors.neutral[300]};
  display: flex;
  align-items: center;
  justify-content: center;
  gap: ${theme.spacing[3]};
  
  &:hover:not(:disabled) {
    background: ${theme.colors.neutral[50]};
    border-color: ${theme.colors.neutral[400]};
  }
  
  &:active:not(:disabled) {
    background: ${theme.colors.neutral[100]};
  }
`;

const OrDivider = styled.div`
  display: flex;
  align-items: center;
  margin: ${theme.spacing[6]} 0;
  
  &::before,
  &::after {
    content: '';
    flex: 1;
    height: 1px;
    background: ${theme.colors.neutral[300]};
  }
  
  span {
    padding: 0 ${theme.spacing[4]};
    color: ${theme.colors.neutral[500]};
    font-size: ${theme.typography.fontSize.sm};
  }
`;

const SwitchAuthLink = styled.button`
  color: ${theme.colors.primary[600]};
  font-weight: ${theme.typography.fontWeight.medium};
  margin-top: ${theme.spacing[4]};
  
  &:hover {
    color: ${theme.colors.primary[700]};
    text-decoration: underline;
  }
`;

export const LoginForm: React.FC<LoginFormProps> = ({
  onLogin,
  onGoogleSignIn,
  onSwitchToRegister,
  isLoading,
  error
}) => {
  const [formData, setFormData] = useState<LoginCredentials>({
    email: '',
    password: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.email || !formData.password) return;
    
    await onLogin(formData);
  };

  const handleChange = (field: keyof LoginCredentials) => 
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setFormData(prev => ({
        ...prev,
        [field]: e.target.value
      }));
    };

  const handleGoogleSignIn = async () => {
    await onGoogleSignIn();
  };

  return (
    <LoginContainer>
      <LoginCard className="fade-in">
        <WelcomeTitle>Welcome Back</WelcomeTitle>
        <WelcomeSubtitle>Sign in to your dashboard</WelcomeSubtitle>

        {error && <ErrorMessage>{error}</ErrorMessage>}

        <Form onSubmit={handleSubmit}>
          <InputGroup>
            <Label htmlFor="email">Email Address</Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={handleChange('email')}
              placeholder="Enter your email"
              disabled={isLoading}
              required
            />
          </InputGroup>

          <InputGroup>
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              value={formData.password}
              onChange={handleChange('password')}
              placeholder="Enter your password"
              disabled={isLoading}
              required
            />
          </InputGroup>

          <Button 
            type="submit" 
            size="lg"
            disabled={isLoading || !formData.email || !formData.password}
          >
            {isLoading ? (
              <>
                <LoadingSpinner size="sm" color={theme.colors.neutral[0]} />
                Signing In...
              </>
            ) : (
              'Sign In'
            )}
          </Button>
        </Form>

        <OrDivider>
          <span>or</span>
        </OrDivider>

        <GoogleButton 
          type="button"
          size="lg"
          onClick={handleGoogleSignIn}
          disabled={isLoading}
        >
          {isLoading ? (
            <>
              <LoadingSpinner size="sm" color={theme.colors.neutral[600]} />
              Signing In...
            </>
          ) : (
            <>
              <svg width="20" height="20" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              Continue with Google
            </>
          )}
        </GoogleButton>

        <SwitchAuthLink 
          type="button" 
          onClick={onSwitchToRegister}
          disabled={isLoading}
        >
          Don't have an account? Sign up
        </SwitchAuthLink>
      </LoginCard>
    </LoginContainer>
  );
};