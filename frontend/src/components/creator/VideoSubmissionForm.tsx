/**
 * VideoSubmissionForm - Clean, intuitive video submission interface
 * Single-purpose component for video URL submission
 */

import React, { useState } from 'react';
import styled from 'styled-components';
import { theme } from '../../styles/theme';
import { Card, Button, Input } from '../../styles/GlobalStyles';
import { LoadingSpinner } from '../shared/LoadingSpinner';
import { SubmissionFormData, Platform } from '../../types';

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
  const [videoUrl, setVideoUrl] = useState('');
  const [showSuccess, setShowSuccess] = useState(false);

  const detectPlatform = (url: string): Platform => {
    const lowerUrl = url.toLowerCase();
    if (lowerUrl.includes('tiktok.com') || lowerUrl.includes('vm.tiktok.com')) {
      return Platform.TIKTOK;
    }
    if (lowerUrl.includes('instagram.com') || lowerUrl.includes('instagr.am')) {
      return Platform.INSTAGRAM;
    }
    return Platform.TIKTOK; // Default to TikTok
  };

  const isValidUrl = (url: string): boolean => {
    const lowerUrl = url.toLowerCase();
    return (
      (lowerUrl.includes('tiktok.com') || lowerUrl.includes('vm.tiktok.com')) ||
      (lowerUrl.includes('instagram.com') || lowerUrl.includes('instagr.am'))
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!videoUrl.trim() || !isValidUrl(videoUrl)) return;

    const platform = detectPlatform(videoUrl);
    
    const formData: SubmissionFormData = {
      videoUrl: videoUrl.trim(),
      platform,
      caption: '',
      hashtags: '',
      notes: ''
    };

    const success = await onSubmit(formData);
    
    if (success) {
      // Reset form and show success message
      setVideoUrl('');
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 4000);
    }
  };

  const handleUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setVideoUrl(e.target.value);
  };

  const getPlatformEmoji = (url: string): string => {
    if (!url) return '🎬';
    const platform = detectPlatform(url);
    return platform === Platform.TIKTOK ? '🎵' : '📸';
  };

  return (
    <FormCard className="slide-in">
      <FormTitle>Submit Your Video {getPlatformEmoji(videoUrl)}</FormTitle>
      
      {showSuccess && (
        <SuccessMessage className="fade-in">
          🎉 Video submitted successfully! We'll review it shortly.
        </SuccessMessage>
      )}

      <Form onSubmit={handleSubmit}>
        <InputGroup>
          <Label htmlFor="videoUrl">
            Just paste your link {videoUrl && isValidUrl(videoUrl) ? `(${detectPlatform(videoUrl)} detected)` : ''}
          </Label>
          <Input
            id="videoUrl"
            type="url"
            value={videoUrl}
            onChange={handleUrlChange}
            placeholder="https://www.tiktok.com/... or https://www.instagram.com/..."
            disabled={isSubmitting}
            required
          />
          {videoUrl && !isValidUrl(videoUrl) && (
            <div style={{ 
              color: theme.colors.error.main, 
              fontSize: theme.typography.fontSize.sm,
              marginTop: theme.spacing[1]
            }}>
              Please enter a valid TikTok or Instagram URL
            </div>
          )}
        </InputGroup>

        <SubmitButton
          type="submit"
          size="lg"
          disabled={isSubmitting || !videoUrl.trim() || !isValidUrl(videoUrl)}
        >
          {isSubmitting ? (
            <>
              <LoadingSpinner size="sm" color={theme.colors.neutral[0]} />
              Submitting...
            </>
          ) : (
            `Submit ${videoUrl && isValidUrl(videoUrl) ? detectPlatform(videoUrl) : 'Video'} 🚀`
          )}
        </SubmitButton>
      </Form>
    </FormCard>
  );
};