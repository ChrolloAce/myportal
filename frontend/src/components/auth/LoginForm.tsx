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