/**
 * VideoSubmissionForm - Clean, intuitive video submission interface
 * Single-purpose component for video URL submission
 */

import React, { useState } from 'react';
import styled from 'styled-components';
import { theme } from '../../styles/theme';
import { Card, Button, Input } from '../../styles/GlobalStyles';
import { LoadingSpinner } from '../shared/LoadingSpinner';
import { SubmissionFormData } from '../../types';

interface VideoSubmissionFormProps {
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

export const VideoSubmissionForm: React.FC<VideoSubmissionFormProps> = ({
  onSubmit,
  isSubmitting
}) => {
  const [formData, setFormData] = useState<SubmissionFormData>({
    tiktokUrl: '',
    instagramUrl: '',
    caption: '',
    hashtags: '',
    notes: ''
  });
  const [showSuccess, setShowSuccess] = useState(false);

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

  return (
    <FormCard className="slide-in">
      <FormTitle>Submit Your Content {getFormEmoji()}</FormTitle>
      
      {showSuccess && (
        <SuccessMessage className="fade-in">
          🎉 Content submitted successfully! We'll review it shortly.
        </SuccessMessage>
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