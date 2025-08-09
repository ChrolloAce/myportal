/**
 * TikTokOAuthSetup - Helper component for TikTok OAuth setup
 * Provides UI to help admins get their TikTok access token
 */

import React, { useState } from 'react';
import styled from 'styled-components';
import { professionalTheme } from '../../styles/professionalTheme';
import { Card, Button } from '../../styles/ProfessionalStyles';
import { ExternalLink, Copy, Check, AlertCircle, Key, Zap } from 'lucide-react';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${professionalTheme.spacing[6]};
`;

const SetupCard = styled(Card)`
  padding: ${professionalTheme.spacing[6]};
`;

const Title = styled.h2`
  font-size: ${professionalTheme.typography.fontSize['2xl']};
  font-weight: ${professionalTheme.typography.fontWeight.bold};
  color: ${professionalTheme.colors.gray[900]};
  margin: 0 0 ${professionalTheme.spacing[4]} 0;
  display: flex;
  align-items: center;
  gap: ${professionalTheme.spacing[2]};
`;

const StepSection = styled.div`
  margin-bottom: ${professionalTheme.spacing[6]};
`;

const StepTitle = styled.h3`
  font-size: ${professionalTheme.typography.fontSize.lg};
  font-weight: ${professionalTheme.typography.fontWeight.semibold};
  color: ${professionalTheme.colors.gray[900]};
  margin: 0 0 ${professionalTheme.spacing[3]} 0;
`;

const StepDescription = styled.p`
  color: ${professionalTheme.colors.gray[600]};
  margin-bottom: ${professionalTheme.spacing[4]};
  line-height: ${professionalTheme.typography.lineHeight.relaxed};
`;

const CodeBlock = styled.div`
  background: ${professionalTheme.colors.gray[50]};
  border: 1px solid ${professionalTheme.colors.gray[200]};
  border-radius: ${professionalTheme.borderRadius.lg};
  padding: ${professionalTheme.spacing[4]};
  font-family: ${professionalTheme.typography.fontFamily.mono};
  font-size: ${professionalTheme.typography.fontSize.sm};
  color: ${professionalTheme.colors.gray[800]};
  position: relative;
  overflow-x: auto;
`;

const CopyButton = styled.button`
  position: absolute;
  top: ${professionalTheme.spacing[2]};
  right: ${professionalTheme.spacing[2]};
  padding: ${professionalTheme.spacing[1]} ${professionalTheme.spacing[2]};
  background: ${professionalTheme.colors.white};
  border: 1px solid ${professionalTheme.colors.gray[300]};
  border-radius: ${professionalTheme.borderRadius.md};
  color: ${professionalTheme.colors.gray[600]};
  font-size: ${professionalTheme.typography.fontSize.xs};
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: ${professionalTheme.spacing[1]};
  transition: all 0.2s ease;
  
  &:hover {
    background: ${professionalTheme.colors.gray[50]};
    color: ${professionalTheme.colors.gray[900]};
  }
`;

const WarningBox = styled.div`
  display: flex;
  align-items: flex-start;
  gap: ${professionalTheme.spacing[3]};
  padding: ${professionalTheme.spacing[4]};
  background: ${professionalTheme.colors.warning[50]};
  border: 1px solid ${professionalTheme.colors.warning[200]};
  border-radius: ${professionalTheme.borderRadius.lg};
  margin: ${professionalTheme.spacing[4]} 0;
`;

const WarningText = styled.div`
  color: ${professionalTheme.colors.warning[800]};
  font-size: ${professionalTheme.typography.fontSize.sm};
  line-height: ${professionalTheme.typography.lineHeight.relaxed};
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: ${professionalTheme.spacing[3]};
  margin-top: ${professionalTheme.spacing[4]};
`;

export const TikTokOAuthSetup: React.FC = () => {
  const [copiedItem, setCopiedItem] = useState<string | null>(null);

  const clientKey = process.env.REACT_APP_TIKTOK_CLIENT_KEY || 'sbaw6qi55kaqklt0d5';
  const clientSecret = process.env.REACT_APP_TIKTOK_CLIENT_SECRET || 'LP9VknaI4xzc4LwIpkdyY8lBYAI4aMhJ';

  const copyToClipboard = (text: string, item: string) => {
    navigator.clipboard.writeText(text);
    setCopiedItem(item);
    setTimeout(() => setCopiedItem(null), 2000);
  };

  const authUrl = `https://www.tiktok.com/v2/auth/authorize/?client_key=${clientKey}&scope=video.list&response_type=code&redirect_uri=https://your-app.com/callback&state=random_state_string`;

  const curlCommand = `curl -X POST "https://open-api.tiktok.com/oauth/access_token/" \\
  -H "Content-Type: application/x-www-form-urlencoded" \\
  -d "client_key=${clientKey}" \\
  -d "client_secret=${clientSecret}" \\
  -d "code=AUTHORIZATION_CODE_FROM_CALLBACK" \\
  -d "grant_type=authorization_code" \\
  -d "redirect_uri=https://your-app.com/callback"`;

  return (
    <Container>
      <SetupCard>
        <Title>
          <Key size={24} />
          TikTok OAuth Setup
        </Title>
        
        <WarningBox>
          <AlertCircle size={20} color={professionalTheme.colors.warning[600]} />
          <WarningText>
            <strong>Access Token Required:</strong> To use TikTok Analytics, you need to complete the OAuth flow 
            to get an access token. Your Client Key and Client Secret are already configured.
          </WarningText>
        </WarningBox>

        <StepSection>
          <StepTitle>Step 1: Your App Credentials</StepTitle>
          <StepDescription>
            These are already configured in your environment variables:
          </StepDescription>
          
          <CodeBlock>
            Client Key: {clientKey}
            <CopyButton onClick={() => copyToClipboard(clientKey, 'clientKey')}>
              {copiedItem === 'clientKey' ? <Check size={12} /> : <Copy size={12} />}
              {copiedItem === 'clientKey' ? 'Copied!' : 'Copy'}
            </CopyButton>
          </CodeBlock>
          
          <CodeBlock style={{ marginTop: professionalTheme.spacing[2] }}>
            Client Secret: {clientSecret}
            <CopyButton onClick={() => copyToClipboard(clientSecret, 'clientSecret')}>
              {copiedItem === 'clientSecret' ? <Check size={12} /> : <Copy size={12} />}
              {copiedItem === 'clientSecret' ? 'Copied!' : 'Copy'}
            </CopyButton>
          </CodeBlock>
        </StepSection>

        <StepSection>
          <StepTitle>Step 2: Authorization URL</StepTitle>
          <StepDescription>
            Direct users to this URL to authorize your app (replace redirect_uri with your actual callback URL):
          </StepDescription>
          
          <CodeBlock>
            {authUrl}
            <CopyButton onClick={() => copyToClipboard(authUrl, 'authUrl')}>
              {copiedItem === 'authUrl' ? <Check size={12} /> : <Copy size={12} />}
              {copiedItem === 'authUrl' ? 'Copied!' : 'Copy'}
            </CopyButton>
          </CodeBlock>

          <ButtonGroup>
            <Button
              variant="secondary"
              size="sm"
              onClick={() => window.open(authUrl.replace('https://your-app.com/callback', window.location.origin + '/callback'), '_blank')}
            >
              <ExternalLink size={14} />
              Test Authorization
            </Button>
          </ButtonGroup>
        </StepSection>

        <StepSection>
          <StepTitle>Step 3: Exchange Code for Access Token</StepTitle>
          <StepDescription>
            After user authorization, use this curl command to exchange the authorization code for an access token:
          </StepDescription>
          
          <CodeBlock>
            {curlCommand}
            <CopyButton onClick={() => copyToClipboard(curlCommand, 'curl')}>
              {copiedItem === 'curl' ? <Check size={12} /> : <Copy size={12} />}
              {copiedItem === 'curl' ? 'Copied!' : 'Copy'}
            </CopyButton>
          </CodeBlock>
        </StepSection>

        <StepSection>
          <StepTitle>Step 4: Update Environment Variables</StepTitle>
          <StepDescription>
            Once you get the access token, add it to your .env.local file:
          </StepDescription>
          
          <CodeBlock>
            REACT_APP_TIKTOK_ACCESS_TOKEN=act.your_actual_access_token_here
            <CopyButton onClick={() => copyToClipboard('REACT_APP_TIKTOK_ACCESS_TOKEN=act.your_actual_access_token_here', 'env')}>
              {copiedItem === 'env' ? <Check size={12} /> : <Copy size={12} />}
              {copiedItem === 'env' ? 'Copied!' : 'Copy'}
            </CopyButton>
          </CodeBlock>
        </StepSection>

        <WarningBox>
          <Zap size={20} color={professionalTheme.colors.warning[600]} />
          <WarningText>
            <strong>Quick Test:</strong> You can temporarily use a placeholder token to test the UI. 
            The TikTok Analytics component will show an error but you can see the interface working.
          </WarningText>
        </WarningBox>
      </SetupCard>
    </Container>
  );
};