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

const PlatformSelector = styled.div`
  display: flex;
  gap: ${theme.spacing[3]};
`;

const PlatformOption = styled.button<{ selected: boolean }>`
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
  text-transform: capitalize;
  
  &:hover:not(:disabled) {
    border-color: ${theme.colors.primary[400]};
    background: ${theme.colors.primary[25]};
  }
`;

const TextArea = styled.textarea`
  width: 100%;
  min-height: 80px;
  padding: ${theme.spacing[3]} ${theme.spacing[4]};
  border: 1px solid ${theme.colors.neutral[300]};
  border-radius: ${theme.borderRadius.md};
  background: ${theme.colors.neutral[0]};
  color: ${theme.colors.neutral[800]};
  font-family: inherit;
  font-size: inherit;
  resize: vertical;
  transition: all ${theme.transitions.fast};
  
  &:focus {
    outline: none;
    border-color: ${theme.colors.primary[500]};
    box-shadow: 0 0 0 3px ${theme.colors.primary[100]};
  }
  
  &::placeholder {
    color: ${theme.colors.neutral[400]};
  }
  
  &:disabled {
    background: ${theme.colors.neutral[100]};
    cursor: not-allowed;
  }
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
    videoUrl: '',
    platform: Platform.TIKTOK,
    caption: '',
    hashtags: '',
    notes: ''
  });
  
  const [showSuccess, setShowSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.videoUrl) return;

    const success = await onSubmit(formData);
    
    if (success) {
      // Reset form and show success message
      setFormData({
        videoUrl: '',
        platform: Platform.TIKTOK,
        caption: '',
        hashtags: '',
        notes: ''
      });
      
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
    }
  };

  const handleChange = (field: keyof SubmissionFormData) => 
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setFormData(prev => ({
        ...prev,
        [field]: e.target.value
      }));
    };

  const handlePlatformSelect = (platform: Platform) => {
    setFormData(prev => ({ ...prev, platform }));
  };

  const detectPlatform = (url: string): Platform => {
    if (url.toLowerCase().includes('tiktok')) return Platform.TIKTOK;
    if (url.toLowerCase().includes('instagram')) return Platform.INSTAGRAM;
    return formData.platform;
  };

  const handleUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const url = e.target.value;
    const detectedPlatform = detectPlatform(url);
    
    setFormData(prev => ({
      ...prev,
      videoUrl: url,
      platform: detectedPlatform
    }));
  };

  return (
    <FormCard className="slide-in">
      <FormTitle>Submit Your Video ✨</FormTitle>
      
      {showSuccess && (
        <SuccessMessage className="fade-in">
          🎉 Video submitted successfully! We'll review it shortly.
        </SuccessMessage>
      )}

      <Form onSubmit={handleSubmit}>
        <InputGroup>
          <Label htmlFor="videoUrl">Video URL *</Label>
          <Input
            id="videoUrl"
            type="url"
            value={formData.videoUrl}
            onChange={handleUrlChange}
            placeholder="Paste your TikTok or Instagram video URL"
            disabled={isSubmitting}
            required
          />
        </InputGroup>

        <InputGroup>
          <Label>Platform</Label>
          <PlatformSelector>
            <PlatformOption
              type="button"
              selected={formData.platform === Platform.TIKTOK}
              onClick={() => handlePlatformSelect(Platform.TIKTOK)}
              disabled={isSubmitting}
            >
              TikTok
            </PlatformOption>
            <PlatformOption
              type="button"
              selected={formData.platform === Platform.INSTAGRAM}
              onClick={() => handlePlatformSelect(Platform.INSTAGRAM)}
              disabled={isSubmitting}
            >
              Instagram
            </PlatformOption>
          </PlatformSelector>
        </InputGroup>

        <InputGroup>
          <Label htmlFor="caption">Caption</Label>
          <Input
            id="caption"
            type="text"
            value={formData.caption}
            onChange={handleChange('caption')}
            placeholder="Add a caption for your video (optional)"
            disabled={isSubmitting}
          />
        </InputGroup>

        <InputGroup>
          <Label htmlFor="hashtags">Hashtags</Label>
          <Input
            id="hashtags"
            type="text"
            value={formData.hashtags}
            onChange={handleChange('hashtags')}
            placeholder="#viral #content #creator (optional)"
            disabled={isSubmitting}
          />
        </InputGroup>

        <InputGroup>
          <Label htmlFor="notes">Notes</Label>
          <TextArea
            id="notes"
            value={formData.notes}
            onChange={handleChange('notes')}
            placeholder="Any additional notes or context (optional)"
            disabled={isSubmitting}
          />
        </InputGroup>

        <SubmitButton
          type="submit"
          size="lg"
          disabled={isSubmitting || !formData.videoUrl}
        >
          {isSubmitting ? (
            <>
              <LoadingSpinner size="sm" color={theme.colors.neutral[0]} />
              Submitting...
            </>
          ) : (
            'Submit Video'
          )}
        </SubmitButton>
      </Form>
    </FormCard>
  );
};