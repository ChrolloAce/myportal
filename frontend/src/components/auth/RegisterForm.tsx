/**
 * RegisterForm - Clean registration interface for new users
 * Allows selection between Creator and Admin roles
 */

import React, { useState } from 'react';
import styled from 'styled-components';
import { theme } from '../../styles/theme';
import { Card, Button, Input } from '../../styles/GlobalStyles';
import { LoadingSpinner } from '../shared/LoadingSpinner';
import { RegisterData, UserRole } from '../../types';

interface RegisterFormProps {
  onRegister: (data: RegisterData) => Promise<void>;
  onSwitchToLogin: () => void;
  isLoading: boolean;
  error: string | null;
}

const RegisterContainer = styled.div`
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: ${theme.spacing[4]};
  background: linear-gradient(135deg, ${theme.colors.primary[50]} 0%, ${theme.colors.neutral[50]} 100%);
`;

const RegisterCard = styled(Card)`
  width: 100%;
  max-width: 450px;
  text-align: center;
`;

const Title = styled.h1`
  margin-bottom: ${theme.spacing[2]};
  color: ${theme.colors.neutral[900]};
`;

const Subtitle = styled.p`
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

const RoleSelection = styled.div`
  display: flex;
  gap: ${theme.spacing[3]};
  margin-top: ${theme.spacing[2]};
`;

const RoleOption = styled.button<{ selected: boolean }>`
  flex: 1;
  padding: ${theme.spacing[3]} ${theme.spacing[4]};
  border: 2px solid ${({ selected }) => 
    selected ? theme.colors.primary[500] : theme.colors.neutral[300]};
  border-radius: ${theme.borderRadius.md};
  background: ${({ selected }) => 
    selected ? theme.colors.primary[50] : theme.colors.neutral[0]};
  color: ${({ selected }) => 
    selected ? theme.colors.primary[700] : theme.colors.neutral[600]};
  font-weight: ${theme.typography.fontWeight.medium};
  transition: all ${theme.transitions.fast};
  
  &:hover {
    border-color: ${theme.colors.primary[400]};
    background: ${theme.colors.primary[25]};
  }
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

export const RegisterForm: React.FC<RegisterFormProps> = ({
  onRegister,
  onSwitchToLogin,
  isLoading,
  error
}) => {
  const [formData, setFormData] = useState<RegisterData>({
    email: '',
    password: '',
    username: '',
    role: UserRole.CREATOR
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.email || !formData.password || !formData.username) return;
    
    await onRegister(formData);
  };

  const handleChange = (field: keyof RegisterData) => 
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setFormData(prev => ({
        ...prev,
        [field]: e.target.value
      }));
    };

  const handleRoleSelect = (role: UserRole) => {
    setFormData(prev => ({ ...prev, role }));
  };

  return (
    <RegisterContainer>
      <RegisterCard className="fade-in">
        <Title>Join the Platform</Title>
        <Subtitle>Create your account to get started</Subtitle>

        {error && <ErrorMessage>{error}</ErrorMessage>}

        <Form onSubmit={handleSubmit}>
          <InputGroup>
            <Label htmlFor="username">Username</Label>
            <Input
              id="username"
              type="text"
              value={formData.username}
              onChange={handleChange('username')}
              placeholder="Enter your username"
              disabled={isLoading}
              required
            />
          </InputGroup>

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
              placeholder="Create a password"
              disabled={isLoading}
              required
            />
          </InputGroup>

          <InputGroup>
            <Label>Account Type</Label>
            <RoleSelection>
              <RoleOption
                type="button"
                selected={formData.role === UserRole.CREATOR}
                onClick={() => handleRoleSelect(UserRole.CREATOR)}
                disabled={isLoading}
              >
                Creator
              </RoleOption>
              <RoleOption
                type="button"
                selected={formData.role === UserRole.ADMIN}
                onClick={() => handleRoleSelect(UserRole.ADMIN)}
                disabled={isLoading}
              >
                Admin
              </RoleOption>
            </RoleSelection>
          </InputGroup>

          <Button 
            type="submit" 
            size="lg"
            disabled={isLoading || !formData.email || !formData.password || !formData.username}
          >
            {isLoading ? (
              <>
                <LoadingSpinner size="sm" color={theme.colors.neutral[0]} />
                Creating Account...
              </>
            ) : (
              'Create Account'
            )}
          </Button>
        </Form>

        <SwitchAuthLink 
          type="button" 
          onClick={onSwitchToLogin}
          disabled={isLoading}
        >
          Already have an account? Sign in
        </SwitchAuthLink>
      </RegisterCard>
    </RegisterContainer>
  );
};