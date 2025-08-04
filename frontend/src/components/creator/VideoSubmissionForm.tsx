/**
 * VideoSubmissionForm - Clean, intuitive video submission interface
 * Single-purpose component for video URL submission
 */

import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { theme } from '../../styles/theme';
import { Card, Button, Input } from '../../styles/GlobalStyles';
import { LoadingSpinner } from '../shared/LoadingSpinner';
import { SubmissionFormData, CreatorUser, Corporation } from '../../types';
import { FirebaseCorporationManager } from '../../firebase/FirebaseCorporationManager';

interface VideoSubmissionFormProps {
  user: CreatorUser;
  onSubmit: (data: SubmissionFormData) => Promise<boolean>;
  isSubmitting: boolean;
}

const FormCard = styled(Card)`
  height: fit-content;
`;

const FormTitle = styled.h2`
  margin-bottom: ${theme.spacing[6]};
  color: ${theme.colors.neutral[900]};
  text-align: center;
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
`;

const Label = styled.label`
  font-weight: ${theme.typography.fontWeight.medium};
  color: ${theme.colors.neutral[700]};
  font-size: ${theme.typography.fontSize.sm};
`;



const SubmitButton = styled(Button)`
  margin-top: ${theme.spacing[2]};
`;

const SuccessMessage = styled.div`
  padding: ${theme.spacing[3]} ${theme.spacing[4]};
  background: ${theme.colors.success.light};
  color: ${theme.colors.success.dark};
  border-radius: ${theme.borderRadius.md};
  margin-bottom: ${theme.spacing[4]};
  text-align: center;
  font-weight: ${theme.typography.fontWeight.medium};
`;

const Select = styled.select`
  width: 100%;
  padding: ${theme.spacing[3]};
  border: 2px solid ${theme.colors.neutral[200]};
  border-radius: ${theme.borderRadius.md};
  font-size: ${theme.typography.fontSize.base};
  background: ${theme.colors.neutral[0]};
  color: ${theme.colors.neutral[900]};
  transition: all ${theme.transitions.fast};
  
  &:focus {
    outline: none;
    border-color: ${theme.colors.primary[400]};
    box-shadow: 0 0 0 3px ${theme.colors.primary[100]};
  }
`;

const NoAgencyCard = styled.div`
  background: linear-gradient(135deg, ${theme.colors.warning.light} 0%, ${theme.colors.warning.light}40 100%);
  border: 2px solid ${theme.colors.warning.light};
  border-radius: ${theme.borderRadius.lg};
  padding: ${theme.spacing[6]};
  text-align: center;
  margin-bottom: ${theme.spacing[6]};
`;

const NoAgencyTitle = styled.h3`
  color: ${theme.colors.warning.dark};
  font-weight: ${theme.typography.fontWeight.bold};
  margin-bottom: ${theme.spacing[2]};
`;

const NoAgencyDescription = styled.p`
  color: ${theme.colors.warning.dark};
  margin-bottom: ${theme.spacing[4]};
`;

const JoinAgencyButton = styled.button`
  background: ${theme.colors.primary[500]};
  color: white;
  border: none;
  padding: ${theme.spacing[3]} ${theme.spacing[6]};
  border-radius: ${theme.borderRadius.md};
  font-weight: ${theme.typography.fontWeight.semibold};
  cursor: pointer;
  transition: all ${theme.transitions.fast};
  
  &:hover {
    background: ${theme.colors.primary[600]};
    transform: translateY(-1px);
  }
`;

export const VideoSubmissionForm: React.FC<VideoSubmissionFormProps> = ({
  user,
  onSubmit,
  isSubmitting
}) => {
  const [formData, setFormData] = useState<SubmissionFormData>({
    tiktokUrl: '',
    instagramUrl: '',
    caption: '',
    hashtags: '',
    notes: '',
    corporationId: user.corporationId || undefined
  });
  const [showSuccess, setShowSuccess] = useState(false);
  const [corporation, setCorporation] = useState<Corporation | null>(null);
  const [isLoadingCorporation, setIsLoadingCorporation] = useState(false);
  
  const corporationManager = FirebaseCorporationManager.getInstance();

  useEffect(() => {
    if (user.corporationId) {
      loadCorporationInfo();
    }
  }, [user.corporationId]);

  const loadCorporationInfo = async () => {
    if (!user.corporationId) return;
    
    try {
      setIsLoadingCorporation(true);
      const corpData = await corporationManager.getCorporation(user.corporationId);
      setCorporation(corpData);
    } catch (error) {
      console.error('Error loading corporation:', error);
    } finally {
      setIsLoadingCorporation(false);
    }
  };

  const isValidTikTokUrl = (url: string): boolean => {
    if (!url.trim()) return true; // Empty is valid (optional)
    const lowerUrl = url.toLowerCase();
    return lowerUrl.includes('tiktok.com') || lowerUrl.includes('vm.tiktok.com');
  };

  const isValidInstagramUrl = (url: string): boolean => {
    if (!url.trim()) return true; // Empty is valid (optional)
    const lowerUrl = url.toLowerCase();
    return lowerUrl.includes('instagram.com') || lowerUrl.includes('instagr.am');
  };

  const hasAtLeastOneUrl = (): boolean => {
    return (formData.tiktokUrl?.trim() || formData.instagramUrl?.trim()) ? true : false;
  };

  const isFormValid = (): boolean => {
    return (
      hasAtLeastOneUrl() &&
      isValidTikTokUrl(formData.tiktokUrl || '') &&
      isValidInstagramUrl(formData.instagramUrl || '')
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isFormValid()) return;

    const success = await onSubmit(formData);
    
    if (success) {
      // Reset form and show success message
      setFormData({
        tiktokUrl: '',
        instagramUrl: '',
        caption: '',
        hashtags: '',
        notes: ''
      });
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 4000);
    }
  };

  const handleChange = (field: keyof SubmissionFormData) => 
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setFormData(prev => ({
        ...prev,
        [field]: e.target.value
      }));
    };

  const getFormEmoji = (): string => {
    const hasTikTok = formData.tiktokUrl?.trim();
    const hasInstagram = formData.instagramUrl?.trim();
    
    if (hasTikTok && hasInstagram) return '🎬'; // Both platforms
    if (hasTikTok) return '🎵'; // TikTok only
    if (hasInstagram) return '📸'; // Instagram only
    return '✨'; // Default
  };

  // Show no agency prompt if user has no corporation
  if (!user.corporationId) {
    return (
      <FormCard className="slide-in">
        <NoAgencyCard>
          <NoAgencyTitle>🏢 Join an Agency First</NoAgencyTitle>
          <NoAgencyDescription>
            To submit content, you need to be part of an agency or brand. 
            Join an agency to start collaborating and submitting your amazing content!
          </NoAgencyDescription>
          <JoinAgencyButton onClick={() => {/* TODO: Navigate to agency joining */}}>
            Find Agencies to Join
          </JoinAgencyButton>
        </NoAgencyCard>
      </FormCard>
    );
  }

  return (
    <FormCard className="slide-in">
      <FormTitle>Submit Your Content {getFormEmoji()}</FormTitle>
      
      {showSuccess && (
        <SuccessMessage className="fade-in">
          🎉 Content submitted successfully! We'll review it shortly.
        </SuccessMessage>
      )}

      {/* Agency Selection */}
      {corporation && (
        <InputGroup>
          <Label>
            🏢 Submitting for Agency
          </Label>
          <Select
            value={user.corporationId || ''}
            disabled={true}
          >
            <option value={user.corporationId || ''}>
              {isLoadingCorporation ? 'Loading...' : corporation.displayName}
            </option>
          </Select>
          <div style={{ 
            fontSize: theme.typography.fontSize.sm,
            color: theme.colors.neutral[600],
            marginTop: theme.spacing[1]
          }}>
            Submitting content on behalf of {corporation.displayName}
          </div>
        </InputGroup>
      )}

      <Form onSubmit={handleSubmit}>
        <InputGroup>
          <Label htmlFor="tiktokUrl">
            🎵 TikTok URL (optional)
          </Label>
          <Input
            id="tiktokUrl"
            type="url"
            value={formData.tiktokUrl || ''}
            onChange={handleChange('tiktokUrl')}
            placeholder="https://www.tiktok.com/@user/video/..."
            disabled={isSubmitting}
          />
          {formData.tiktokUrl && !isValidTikTokUrl(formData.tiktokUrl) && (
            <div style={{ 
              color: theme.colors.error.main, 
              fontSize: theme.typography.fontSize.sm,
              marginTop: theme.spacing[1]
            }}>
              Please enter a valid TikTok URL
            </div>
          )}
        </InputGroup>

        <InputGroup>
          <Label htmlFor="instagramUrl">
            📸 Instagram URL (optional)
          </Label>
          <Input
            id="instagramUrl"
            type="url"
            value={formData.instagramUrl || ''}
            onChange={handleChange('instagramUrl')}
            placeholder="https://www.instagram.com/p/..."
            disabled={isSubmitting}
          />
          {formData.instagramUrl && !isValidInstagramUrl(formData.instagramUrl) && (
            <div style={{ 
              color: theme.colors.error.main, 
              fontSize: theme.typography.fontSize.sm,
              marginTop: theme.spacing[1]
            }}>
              Please enter a valid Instagram URL
            </div>
          )}
        </InputGroup>

        {!hasAtLeastOneUrl() && (formData.tiktokUrl !== '' || formData.instagramUrl !== '') && (
          <div style={{ 
            color: theme.colors.error.main, 
            fontSize: theme.typography.fontSize.sm,
            textAlign: 'center',
            marginBottom: theme.spacing[2]
          }}>
            Please provide at least one valid URL (TikTok or Instagram)
          </div>
        )}

        <SubmitButton
          type="submit"
          size="lg"
          disabled={isSubmitting || !isFormValid()}
        >
          {isSubmitting ? (
            <>
              <LoadingSpinner size="sm" color={theme.colors.neutral[0]} />
              Submitting...
            </>
          ) : (
            `Submit ${hasAtLeastOneUrl() ? 'Content' : 'Videos'} 🚀`
          )}
        </SubmitButton>
      </Form>
    </FormCard>
  );
};