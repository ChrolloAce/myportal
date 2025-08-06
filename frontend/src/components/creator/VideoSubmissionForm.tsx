/**
 * VideoSubmissionForm - Professional video submission interface
 * Clean, modern component for video URL submission
 */

import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { professionalTheme } from '../../styles/professionalTheme';
import { Card, Button, Input } from '../../styles/ProfessionalStyles';
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
  padding: ${professionalTheme.spacing[6]};
`;

const FormTitle = styled.h2`
  margin-bottom: ${professionalTheme.spacing[6]};
  color: ${professionalTheme.colors.gray[900]};
  font-size: ${professionalTheme.typography.fontSize.xl};
  font-weight: ${professionalTheme.typography.fontWeight.semibold};
  text-align: center;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: ${professionalTheme.spacing[5]};
`;

const InputGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${professionalTheme.spacing[2]};
`;

const Label = styled.label`
  font-weight: ${professionalTheme.typography.fontWeight.medium};
  color: ${professionalTheme.colors.gray[700]};
  font-size: ${professionalTheme.typography.fontSize.sm};
`;

const SubmitButton = styled(Button)`
  margin-top: ${professionalTheme.spacing[2]};
`;

const SuccessMessage = styled.div`
  background: ${professionalTheme.colors.success[50]};
  border: 1px solid ${professionalTheme.colors.success[200]};
  color: ${professionalTheme.colors.success[700]};
  padding: ${professionalTheme.spacing[4]};
  border-radius: ${professionalTheme.borderRadius.md};
  margin-bottom: ${professionalTheme.spacing[4]};
  text-align: center;
  font-weight: ${professionalTheme.typography.fontWeight.medium};
  font-size: ${professionalTheme.typography.fontSize.sm};
`;

const Select = styled.select`
  width: 100%;
  padding: ${professionalTheme.spacing[3]} ${professionalTheme.spacing[4]};
  border: 1px solid ${professionalTheme.borders.color.default};
  border-radius: ${professionalTheme.borderRadius.md};
  font-size: ${professionalTheme.typography.fontSize.sm};
  background: ${professionalTheme.colors.white};
  color: ${professionalTheme.colors.gray[900]};
  transition: ${professionalTheme.transitions.all};
  font-family: ${professionalTheme.typography.fontFamily.sans};
  
  &:focus {
    outline: none;
    border-color: ${professionalTheme.colors.primary[500]};
    box-shadow: 0 0 0 3px ${professionalTheme.colors.primary[100]};
  }
`;

const NoAgencyCard = styled.div`
  background: ${professionalTheme.colors.warning[50]};
  border: 1px solid ${professionalTheme.colors.warning[200]};
  border-radius: ${professionalTheme.borderRadius.lg};
  padding: ${professionalTheme.spacing[8]};
  text-align: center;
`;

const NoAgencyTitle = styled.h3`
  color: ${professionalTheme.colors.warning[700]};
  font-weight: ${professionalTheme.typography.fontWeight.semibold};
  font-size: ${professionalTheme.typography.fontSize.lg};
  margin-bottom: ${professionalTheme.spacing[3]};
`;

const NoAgencyDescription = styled.p`
  color: ${professionalTheme.colors.warning[600]};
  font-size: ${professionalTheme.typography.fontSize.sm};
  margin-bottom: ${professionalTheme.spacing[6]};
  line-height: ${professionalTheme.typography.lineHeight.relaxed};
`;

const JoinAgencyButton = styled(Button)`
  background: ${professionalTheme.colors.primary[500]};
  
  &:hover:not(:disabled) {
    background: ${professionalTheme.colors.primary[600]};
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

  const getFormTitle = (): string => {
    const hasTikTok = formData.tiktokUrl?.trim();
    const hasInstagram = formData.instagramUrl?.trim();
    
    if (hasTikTok && hasInstagram) return 'Submit Multi-Platform Content';
    if (hasTikTok) return 'Submit TikTok Content';
    if (hasInstagram) return 'Submit Instagram Content';
    return 'Submit Your Content';
  };

  // Show no agency prompt if user has no corporation
  if (!user.corporationId) {
    return (
      <FormCard className="slide-in">
        <NoAgencyCard>
          <NoAgencyTitle>Join an Agency First</NoAgencyTitle>
          <NoAgencyDescription>
            To submit content, you need to be part of an agency or brand. 
            Join an agency to start collaborating and submitting your content.
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
      <FormTitle>{getFormTitle()}</FormTitle>
      
      {showSuccess && (
        <SuccessMessage className="fade-in">
          Content submitted successfully! We'll review it shortly.
        </SuccessMessage>
      )}

      {/* Agency Selection */}
      {corporation && (
        <InputGroup>
          <Label>
            Submitting for Agency
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
            fontSize: professionalTheme.typography.fontSize.sm,
            color: professionalTheme.colors.gray[600],
            marginTop: professionalTheme.spacing[2]
          }}>
            Submitting content on behalf of {corporation.displayName}
          </div>
        </InputGroup>
      )}

      <Form onSubmit={handleSubmit}>
        <InputGroup>
          <Label htmlFor="tiktokUrl">
            TikTok URL (optional)
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
              color: professionalTheme.colors.error[700], 
              fontSize: professionalTheme.typography.fontSize.sm,
              marginTop: professionalTheme.spacing[1]
            }}>
              Please enter a valid TikTok URL
            </div>
          )}
        </InputGroup>

        <InputGroup>
          <Label htmlFor="instagramUrl">
            Instagram URL (optional)
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
              color: professionalTheme.colors.error[700], 
              fontSize: professionalTheme.typography.fontSize.sm,
              marginTop: professionalTheme.spacing[1]
            }}>
              Please enter a valid Instagram URL
            </div>
          )}
        </InputGroup>

        {!hasAtLeastOneUrl() && (formData.tiktokUrl !== '' || formData.instagramUrl !== '') && (
          <div style={{ 
            color: professionalTheme.colors.error[700], 
            fontSize: professionalTheme.typography.fontSize.sm,
            textAlign: 'center',
            marginBottom: professionalTheme.spacing[2]
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
              <LoadingSpinner size="sm" color={professionalTheme.colors.white} />
              Submitting...
            </>
          ) : (
            `Submit ${hasAtLeastOneUrl() ? 'Content' : 'Content'}`
          )}
        </SubmitButton>
      </Form>
    </FormCard>
  );
};