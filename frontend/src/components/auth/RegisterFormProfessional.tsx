/**
 * Professional RegisterForm - Beautiful registration interface
 * Modern design with role selection and smooth UX
 */

import React, { useState } from 'react';
import styled from 'styled-components';
import { professionalTheme } from '../../styles/professionalTheme';
import { Card, Button, Input } from '../../styles/ProfessionalStyles';
import { Eye, EyeOff, Mail, Lock, User, UserPlus, Camera, Building2 } from 'lucide-react';
import { RegisterData, UserRole } from '../../types';

interface RegisterFormProps {
  onRegister: (data: RegisterData) => Promise<void>;
  onGoogleSignIn: (role: UserRole) => Promise<void>;
  onSwitchToLogin: () => void;
  isLoading: boolean;
  error: string | null;
}

const RegisterContainer = styled.div`
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: ${professionalTheme.spacing[6]};
  background: linear-gradient(135deg, ${professionalTheme.colors.primary[50]} 0%, ${professionalTheme.colors.gray[50]} 100%);
`;

const RegisterCard = styled(Card)`
  width: 100%;
  max-width: 480px;
  padding: ${professionalTheme.spacing[8]};
  text-align: center;
`;

const RegisterHeader = styled.div`
  margin-bottom: ${professionalTheme.spacing[8]};
`;

const RegisterIcon = styled.div`
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

const RegisterTitle = styled.h1`
  font-size: ${professionalTheme.typography.fontSize['2xl']};
  font-weight: ${professionalTheme.typography.fontWeight.bold};
  color: ${professionalTheme.colors.gray[900]};
  margin-bottom: ${professionalTheme.spacing[2]};
`;

const RegisterSubtitle = styled.p`
  font-size: ${professionalTheme.typography.fontSize.base};
  color: ${professionalTheme.colors.gray[600]};
  line-height: ${professionalTheme.typography.lineHeight.relaxed};
`;

const RoleSelection = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: ${professionalTheme.spacing[4]};
  margin-bottom: ${professionalTheme.spacing[6]};
`;

const RoleCard = styled.button<{ isSelected: boolean }>`
  padding: ${professionalTheme.spacing[4]};
  border: 2px solid ${props => props.isSelected 
    ? professionalTheme.colors.primary[500] 
    : professionalTheme.borders.color.default};
  border-radius: ${professionalTheme.borderRadius.lg};
  background: ${props => props.isSelected 
    ? professionalTheme.colors.primary[50] 
    : professionalTheme.colors.white};
  cursor: pointer;
  transition: ${professionalTheme.transitions.all};
  text-align: center;
  
  &:hover {
    border-color: ${professionalTheme.colors.primary[400]};
    background: ${professionalTheme.colors.primary[25]};
  }
  
  &:focus-visible {
    outline: 2px solid ${professionalTheme.colors.primary[500]};
    outline-offset: 2px;
  }
`;

const RoleIcon = styled.div<{ color: string }>`
  width: 40px;
  height: 40px;
  margin: 0 auto ${professionalTheme.spacing[2]};
  background: ${props => props.color}20;
  color: ${props => props.color};
  border-radius: ${professionalTheme.borderRadius.lg};
  display: flex;
  align-items: center;
  justify-content: center;
`;

const RoleTitle = styled.h3`
  font-size: ${professionalTheme.typography.fontSize.sm};
  font-weight: ${professionalTheme.typography.fontWeight.semibold};
  color: ${professionalTheme.colors.gray[900]};
  margin-bottom: ${professionalTheme.spacing[1]};
`;

const RoleDescription = styled.p`
  font-size: ${professionalTheme.typography.fontSize.xs};
  color: ${professionalTheme.colors.gray[600]};
  line-height: ${professionalTheme.typography.lineHeight.relaxed};
`;

const RegisterFormContainer = styled.form`
  display: flex;
  flex-direction: column;
  gap: ${professionalTheme.spacing[4]};
  margin-bottom: ${professionalTheme.spacing[6]};
  text-align: left;
`;

const FormGroup = styled.div`
  position: relative;
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

const RegisterButton = styled(Button)`
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

export const RegisterForm: React.FC<RegisterFormProps> = ({
  onRegister,
  onGoogleSignIn,
  onSwitchToLogin,
  isLoading,
  error
}) => {
  const [formData, setFormData] = useState<RegisterData>({
    username: '',
    email: '',
    password: '',
    role: UserRole.CREATOR
  });
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.username || !formData.email || !formData.password) return;
    
    try {
      await onRegister(formData);
    } catch (error) {
      // Error handled by parent component
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      await onGoogleSignIn(formData.role);
    } catch (error) {
      // Error handled by parent component
    }
  };

  const updateFormData = (field: keyof RegisterData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <RegisterContainer>
      <RegisterCard>
        <RegisterHeader>
          <RegisterIcon>
            <UserPlus size={24} />
          </RegisterIcon>
          <RegisterTitle>Create your account</RegisterTitle>
          <RegisterSubtitle>
            Join thousands of creators and teams building amazing content together
          </RegisterSubtitle>
        </RegisterHeader>

        {error && <ErrorMessage>{error}</ErrorMessage>}

        <RoleSelection>
          <RoleCard
            type="button"
            isSelected={formData.role === UserRole.CREATOR}
            onClick={() => updateFormData('role', UserRole.CREATOR)}
          >
            <RoleIcon color={professionalTheme.colors.primary[500]}>
              <Camera size={20} />
            </RoleIcon>
            <RoleTitle>Creator</RoleTitle>
            <RoleDescription>
              Create and submit content
            </RoleDescription>
          </RoleCard>

          <RoleCard
            type="button"
            isSelected={formData.role === UserRole.ADMIN}
            onClick={() => updateFormData('role', UserRole.ADMIN)}
          >
            <RoleIcon color={professionalTheme.colors.brand.purple}>
              <Building2 size={20} />
            </RoleIcon>
            <RoleTitle>Admin</RoleTitle>
            <RoleDescription>
              Manage team and organization
            </RoleDescription>
          </RoleCard>
        </RoleSelection>

        <RegisterFormContainer onSubmit={handleSubmit}>
          <FormGroup>
            <FormLabel htmlFor="name">Full name</FormLabel>
            <InputWrapper>
              <StyledInput
                id="name"
                type="text"
                placeholder="Enter your full name"
                value={formData.username}
                onChange={(e) => updateFormData('username', e.target.value)}
                disabled={isLoading}
                required
              />
              <InputIcon>
                <User size={20} />
              </InputIcon>
            </InputWrapper>
          </FormGroup>

          <FormGroup>
            <FormLabel htmlFor="email">Email address</FormLabel>
            <InputWrapper>
              <StyledInput
                id="email"
                type="email"
                placeholder="Enter your email"
                value={formData.email}
                onChange={(e) => updateFormData('email', e.target.value)}
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
                placeholder="Create a strong password"
                value={formData.password}
                onChange={(e) => updateFormData('password', e.target.value)}
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

          <RegisterButton
            type="submit"
            variant="primary"
            disabled={isLoading || !formData.username || !formData.email || !formData.password}
            loading={isLoading}
          >
            {isLoading ? 'Creating account...' : 'Create account'}
          </RegisterButton>
        </RegisterFormContainer>

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
          Already have an account?{' '}
          <FooterLink onClick={onSwitchToLogin}>
            Sign in
          </FooterLink>
        </FooterText>
        
        <FooterText style={{ marginTop: professionalTheme.spacing[4], fontSize: professionalTheme.typography.fontSize.sm }}>
          By creating an account, you agree to our{' '}
          <FooterLink as="a" href="/terms" target="_blank" rel="noopener noreferrer">
            Terms of Service
          </FooterLink>
          {' '}and{' '}
          <FooterLink as="a" href="/privacy" target="_blank" rel="noopener noreferrer">
            Privacy Policy
          </FooterLink>
        </FooterText>
      </RegisterCard>
    </RegisterContainer>
  );
};