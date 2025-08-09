/**
 * PrivacyPolicy - Privacy Policy page component
 * Professional legal document with clean formatting
 */

import React from 'react';
import styled from 'styled-components';
import { professionalTheme } from '../../styles/professionalTheme';
import { Card } from '../../styles/ProfessionalStyles';
import { ArrowLeft, Shield, Eye, Lock, Database, Globe, Mail } from 'lucide-react';

interface PrivacyPolicyProps {
  onBack?: () => void;
}

const Container = styled.div`
  min-height: 100vh;
  background: linear-gradient(135deg, 
    ${professionalTheme.colors.gray[25]} 0%,
    ${professionalTheme.colors.primary[25]} 50%,
    ${professionalTheme.colors.gray[50]} 100%
  );
  padding: ${professionalTheme.spacing[8]};
`;

const ContentCard = styled(Card)`
  max-width: 800px;
  margin: 0 auto;
  padding: ${professionalTheme.spacing[8]};
`;

const Header = styled.div`
  text-align: center;
  margin-bottom: ${professionalTheme.spacing[8]};
`;

const BackButton = styled.button`
  display: flex;
  align-items: center;
  gap: ${professionalTheme.spacing[2]};
  padding: ${professionalTheme.spacing[2]} ${professionalTheme.spacing[4]};
  background: ${professionalTheme.colors.gray[100]};
  border: 1px solid ${professionalTheme.colors.gray[200]};
  border-radius: ${professionalTheme.borderRadius.lg};
  color: ${professionalTheme.colors.gray[700]};
  font-size: ${professionalTheme.typography.fontSize.sm};
  font-weight: ${professionalTheme.typography.fontWeight.medium};
  cursor: pointer;
  transition: all 0.2s ease;
  margin-bottom: ${professionalTheme.spacing[6]};
  
  &:hover {
    background: ${professionalTheme.colors.gray[200]};
    color: ${professionalTheme.colors.gray[900]};
  }
`;

const Title = styled.h1`
  font-size: ${professionalTheme.typography.fontSize['4xl']};
  font-weight: ${professionalTheme.typography.fontWeight.bold};
  color: ${professionalTheme.colors.gray[900]};
  margin: 0 0 ${professionalTheme.spacing[4]} 0;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: ${professionalTheme.spacing[3]};
`;

const Subtitle = styled.p`
  font-size: ${professionalTheme.typography.fontSize.lg};
  color: ${professionalTheme.colors.gray[600]};
  margin: 0 0 ${professionalTheme.spacing[2]} 0;
`;

const LastUpdated = styled.p`
  font-size: ${professionalTheme.typography.fontSize.sm};
  color: ${professionalTheme.colors.gray[500]};
  margin: 0;
`;

const Section = styled.section`
  margin-bottom: ${professionalTheme.spacing[8]};
`;

const SectionTitle = styled.h2`
  font-size: ${professionalTheme.typography.fontSize['2xl']};
  font-weight: ${professionalTheme.typography.fontWeight.semibold};
  color: ${professionalTheme.colors.gray[900]};
  margin: 0 0 ${professionalTheme.spacing[4]} 0;
  display: flex;
  align-items: center;
  gap: ${professionalTheme.spacing[2]};
`;

const SectionContent = styled.div`
  color: ${professionalTheme.colors.gray[700]};
  line-height: ${professionalTheme.typography.lineHeight.relaxed};
  
  p {
    margin-bottom: ${professionalTheme.spacing[4]};
    font-size: ${professionalTheme.typography.fontSize.base};
  }
  
  ul {
    padding-left: ${professionalTheme.spacing[6]};
    margin-bottom: ${professionalTheme.spacing[4]};
    
    li {
      margin-bottom: ${professionalTheme.spacing[2]};
      font-size: ${professionalTheme.typography.fontSize.base};
    }
  }
  
  strong {
    font-weight: ${professionalTheme.typography.fontWeight.semibold};
    color: ${professionalTheme.colors.gray[900]};
  }
`;

const ContactInfo = styled.div`
  background: ${professionalTheme.colors.primary[50]};
  padding: ${professionalTheme.spacing[6]};
  border-radius: ${professionalTheme.borderRadius.lg};
  border: 1px solid ${professionalTheme.colors.primary[200]};
  margin-top: ${professionalTheme.spacing[8]};
`;

const ContactTitle = styled.h3`
  font-size: ${professionalTheme.typography.fontSize.lg};
  font-weight: ${professionalTheme.typography.fontWeight.semibold};
  color: ${professionalTheme.colors.gray[900]};
  margin: 0 0 ${professionalTheme.spacing[3]} 0;
  display: flex;
  align-items: center;
  gap: ${professionalTheme.spacing[2]};
`;

export const PrivacyPolicy: React.FC<PrivacyPolicyProps> = ({ onBack }) => {
  return (
    <Container>
      <ContentCard>
        {onBack && (
          <BackButton onClick={onBack}>
            <ArrowLeft size={16} />
            Back
          </BackButton>
        )}
        
        <Header>
          <Title>
            <Shield size={36} />
            Privacy Policy
          </Title>
          <Subtitle>
            Your privacy is important to us. This policy explains how we collect, use, and protect your information.
          </Subtitle>
          <LastUpdated>
            Last updated: {new Date().toLocaleDateString()}
          </LastUpdated>
        </Header>

        <Section>
          <SectionTitle>
            <Eye size={24} />
            Information We Collect
          </SectionTitle>
          <SectionContent>
            <p>
              We collect information you provide directly to us, such as when you create an account, 
              submit content, or contact us for support.
            </p>
            <ul>
              <li><strong>Account Information:</strong> Username, email address, and profile details</li>
              <li><strong>Content Data:</strong> Video URLs, captions, hashtags, and submission notes</li>
              <li><strong>Usage Data:</strong> How you interact with our platform and services</li>
              <li><strong>Technical Data:</strong> IP address, browser type, and device information</li>
            </ul>
          </SectionContent>
        </Section>

        <Section>
          <SectionTitle>
            <Database size={24} />
            How We Use Your Information
          </SectionTitle>
          <SectionContent>
            <p>
              We use the information we collect to provide, maintain, and improve our services:
            </p>
            <ul>
              <li>Process and manage your video submissions</li>
              <li>Facilitate communication between creators and administrators</li>
              <li>Provide customer support and respond to inquiries</li>
              <li>Analyze platform usage to improve our services</li>
              <li>Send important updates about your account or our services</li>
              <li>Ensure platform security and prevent fraudulent activity</li>
            </ul>
          </SectionContent>
        </Section>

        <Section>
          <SectionTitle>
            <Globe size={24} />
            Information Sharing
          </SectionTitle>
          <SectionContent>
            <p>
              We do not sell, trade, or rent your personal information to third parties. We may share 
              your information only in the following circumstances:
            </p>
            <ul>
              <li><strong>With your consent:</strong> When you explicitly agree to share information</li>
              <li><strong>Service providers:</strong> With trusted partners who help us operate our platform</li>
              <li><strong>Legal compliance:</strong> When required by law or to protect our rights</li>
              <li><strong>Business transfers:</strong> In connection with a merger, acquisition, or sale of assets</li>
            </ul>
          </SectionContent>
        </Section>

        <Section>
          <SectionTitle>
            <Lock size={24} />
            Data Security
          </SectionTitle>
          <SectionContent>
            <p>
              We implement appropriate security measures to protect your personal information against 
              unauthorized access, alteration, disclosure, or destruction:
            </p>
            <ul>
              <li>Encryption of data in transit and at rest</li>
              <li>Regular security assessments and updates</li>
              <li>Access controls and authentication measures</li>
              <li>Secure hosting infrastructure with industry-standard protections</li>
            </ul>
            <p>
              While we strive to protect your information, no method of transmission over the internet 
              or electronic storage is 100% secure.
            </p>
          </SectionContent>
        </Section>

        <Section>
          <SectionTitle>
            <Eye size={24} />
            Your Rights and Choices
          </SectionTitle>
          <SectionContent>
            <p>
              You have certain rights regarding your personal information:
            </p>
            <ul>
              <li><strong>Access:</strong> Request a copy of the personal information we hold about you</li>
              <li><strong>Correction:</strong> Update or correct inaccurate personal information</li>
              <li><strong>Deletion:</strong> Request deletion of your personal information</li>
              <li><strong>Portability:</strong> Request a copy of your data in a structured format</li>
              <li><strong>Objection:</strong> Object to certain uses of your personal information</li>
            </ul>
            <p>
              To exercise these rights, please contact us using the information provided below.
            </p>
          </SectionContent>
        </Section>

        <Section>
          <SectionTitle>
            <Database size={24} />
            Data Retention
          </SectionTitle>
          <SectionContent>
            <p>
              We retain your personal information for as long as necessary to provide our services 
              and fulfill the purposes outlined in this privacy policy:
            </p>
            <ul>
              <li>Account information is retained while your account is active</li>
              <li>Submission data is retained for business and legal compliance purposes</li>
              <li>Usage data is typically retained for analytical purposes for up to 2 years</li>
              <li>We may retain certain information longer if required by law</li>
            </ul>
          </SectionContent>
        </Section>

        <Section>
          <SectionTitle>
            <Globe size={24} />
            Third-Party Services
          </SectionTitle>
          <SectionContent>
            <p>
              Our platform may integrate with third-party services (such as TikTok and Instagram) 
              to provide our services. These third parties have their own privacy policies:
            </p>
            <ul>
              <li>We only access public information from these platforms</li>
              <li>We do not store your social media credentials</li>
              <li>Video analytics data is fetched in real-time and not permanently stored</li>
              <li>Please review the privacy policies of these third-party services</li>
            </ul>
          </SectionContent>
        </Section>

        <Section>
          <SectionTitle>
            <Shield size={24} />
            Children's Privacy
          </SectionTitle>
          <SectionContent>
            <p>
              Our services are not intended for children under 13 years of age. We do not knowingly 
              collect personal information from children under 13. If we become aware that we have 
              collected personal information from a child under 13, we will take steps to delete 
              such information.
            </p>
          </SectionContent>
        </Section>

        <Section>
          <SectionTitle>
            <Database size={24} />
            Changes to This Policy
          </SectionTitle>
          <SectionContent>
            <p>
              We may update this privacy policy from time to time. We will notify you of any 
              material changes by posting the new privacy policy on this page and updating the 
              "Last updated" date.
            </p>
            <p>
              Your continued use of our services after any changes to this privacy policy 
              constitutes your acceptance of such changes.
            </p>
          </SectionContent>
        </Section>

        <ContactInfo>
          <ContactTitle>
            <Mail size={20} />
            Contact Us
          </ContactTitle>
          <p>
            If you have any questions about this privacy policy or our privacy practices, 
            please contact us at:
          </p>
          <p>
            <strong>Email:</strong> privacy@myportal.com<br />
            <strong>Address:</strong> 123 Privacy Street, Data City, DC 12345
          </p>
        </ContactInfo>
      </ContentCard>
    </Container>
  );
};