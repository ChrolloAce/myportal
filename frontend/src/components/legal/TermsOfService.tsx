/**
 * TermsOfService - Terms of Service page component
 * Professional legal document with clean formatting
 */

import React from 'react';
import styled from 'styled-components';
import { professionalTheme } from '../../styles/professionalTheme';
import { Card } from '../../styles/ProfessionalStyles';
import { ArrowLeft, FileText, Scale, Shield, AlertTriangle, Users, Zap, Mail } from 'lucide-react';

interface TermsOfServiceProps {
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
  
  ol {
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

const WarningBox = styled.div`
  background: ${professionalTheme.colors.warning[50]};
  padding: ${professionalTheme.spacing[4]};
  border-radius: ${professionalTheme.borderRadius.lg};
  border: 1px solid ${professionalTheme.colors.warning[200]};
  margin: ${professionalTheme.spacing[4]} 0;
  display: flex;
  align-items: flex-start;
  gap: ${professionalTheme.spacing[3]};
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

export const TermsOfService: React.FC<TermsOfServiceProps> = ({ onBack }) => {
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
            <Scale size={36} />
            Terms of Service
          </Title>
          <Subtitle>
            Please read these terms carefully before using our platform.
          </Subtitle>
          <LastUpdated>
            Last updated: {new Date().toLocaleDateString()}
          </LastUpdated>
        </Header>

        <WarningBox>
          <AlertTriangle size={20} color={professionalTheme.colors.warning[600]} />
          <div>
            <strong>Important:</strong> By using our platform, you agree to be bound by these terms. 
            If you do not agree to these terms, please do not use our services.
          </div>
        </WarningBox>

        <Section>
          <SectionTitle>
            <FileText size={24} />
            Acceptance of Terms
          </SectionTitle>
          <SectionContent>
            <p>
              By accessing and using this video submission platform ("the Platform"), you accept 
              and agree to be bound by the terms and provision of this agreement.
            </p>
            <p>
              These Terms of Service ("Terms") govern your use of our platform and services. 
              We may update these Terms from time to time, and your continued use of the Platform 
              constitutes acceptance of any changes.
            </p>
          </SectionContent>
        </Section>

        <Section>
          <SectionTitle>
            <Users size={24} />
            User Accounts and Responsibilities
          </SectionTitle>
          <SectionContent>
            <p>
              To use our platform, you must create an account and provide accurate information:
            </p>
            <ul>
              <li>You must be at least 13 years old to create an account</li>
              <li>You are responsible for maintaining the confidentiality of your account</li>
              <li>You must provide accurate and complete information during registration</li>
              <li>You are responsible for all activities that occur under your account</li>
              <li>You must notify us immediately of any unauthorized use of your account</li>
            </ul>
          </SectionContent>
        </Section>

        <Section>
          <SectionTitle>
            <FileText size={24} />
            Content Submission and Ownership
          </SectionTitle>
          <SectionContent>
            <p>
              When you submit content to our platform:
            </p>
            <ul>
              <li>You retain ownership of your original content</li>
              <li>You grant us a license to use, display, and analyze your submitted content</li>
              <li>You represent that you have the right to submit the content</li>
              <li>You are responsible for ensuring your content complies with all applicable laws</li>
              <li>We reserve the right to review, approve, or reject any submitted content</li>
            </ul>
            
            <h3 style={{ marginTop: professionalTheme.spacing[6], marginBottom: professionalTheme.spacing[3] }}>
              Content Guidelines
            </h3>
            <p>All submitted content must:</p>
            <ul>
              <li>Be original or properly licensed</li>
              <li>Not infringe on any third-party rights</li>
              <li>Not contain harmful, offensive, or inappropriate material</li>
              <li>Comply with the terms of service of the original platform (TikTok, Instagram, etc.)</li>
              <li>Not violate any applicable laws or regulations</li>
            </ul>
          </SectionContent>
        </Section>

        <Section>
          <SectionTitle>
            <Shield size={24} />
            Prohibited Uses
          </SectionTitle>
          <SectionContent>
            <p>
              You may not use our platform for any unlawful purpose or in any way that could 
              damage, disable, or impair our services. Prohibited activities include:
            </p>
            <ul>
              <li>Submitting copyrighted content without proper authorization</li>
              <li>Uploading malicious content or attempting to hack our systems</li>
              <li>Impersonating others or providing false information</li>
              <li>Spamming or sending unsolicited communications</li>
              <li>Attempting to circumvent our content review processes</li>
              <li>Using automated tools to access or interact with our platform</li>
              <li>Violating any applicable laws or regulations</li>
            </ul>
          </SectionContent>
        </Section>

        <Section>
          <SectionTitle>
            <Zap size={24} />
            Platform Availability and Modifications
          </SectionTitle>
          <SectionContent>
            <p>
              We strive to provide reliable service, but:
            </p>
            <ul>
              <li>We do not guarantee uninterrupted or error-free service</li>
              <li>We may modify, suspend, or discontinue services at any time</li>
              <li>We may impose limits on certain features or restrict access</li>
              <li>Scheduled maintenance may temporarily affect service availability</li>
            </ul>
            <p>
              We will provide reasonable notice of significant changes to our services when possible.
            </p>
          </SectionContent>
        </Section>

        <Section>
          <SectionTitle>
            <Scale size={24} />
            Privacy and Data Protection
          </SectionTitle>
          <SectionContent>
            <p>
              Your privacy is important to us. Our collection and use of personal information 
              is governed by our Privacy Policy, which is incorporated into these Terms by reference.
            </p>
            <p>
              By using our platform, you consent to:
            </p>
            <ul>
              <li>The collection and use of your information as described in our Privacy Policy</li>
              <li>The analysis of your submitted content for platform improvement</li>
              <li>The use of analytics data to provide insights to administrators</li>
            </ul>
          </SectionContent>
        </Section>

        <Section>
          <SectionTitle>
            <AlertTriangle size={24} />
            Disclaimers and Limitation of Liability
          </SectionTitle>
          <SectionContent>
            <p>
              <strong>DISCLAIMER:</strong> Our platform is provided "as is" without any warranties, 
              express or implied. We disclaim all warranties, including but not limited to:
            </p>
            <ul>
              <li>Warranties of merchantability and fitness for a particular purpose</li>
              <li>Warranties regarding the accuracy or completeness of content</li>
              <li>Warranties regarding uninterrupted or error-free service</li>
            </ul>
            
            <p>
              <strong>LIMITATION OF LIABILITY:</strong> To the maximum extent permitted by law, 
              we shall not be liable for any indirect, incidental, special, or consequential damages 
              arising from your use of our platform.
            </p>
          </SectionContent>
        </Section>

        <Section>
          <SectionTitle>
            <Shield size={24} />
            Indemnification
          </SectionTitle>
          <SectionContent>
            <p>
              You agree to indemnify and hold us harmless from any claims, damages, losses, 
              or expenses (including reasonable attorneys' fees) arising from:
            </p>
            <ul>
              <li>Your use of our platform</li>
              <li>Your violation of these Terms</li>
              <li>Your violation of any rights of another party</li>
              <li>Your submitted content</li>
            </ul>
          </SectionContent>
        </Section>

        <Section>
          <SectionTitle>
            <Scale size={24} />
            Termination
          </SectionTitle>
          <SectionContent>
            <p>
              Either party may terminate this agreement:
            </p>
            <ul>
              <li>You may terminate by discontinuing use of our platform</li>
              <li>We may terminate or suspend your access for violation of these Terms</li>
              <li>We may terminate with or without cause upon reasonable notice</li>
            </ul>
            <p>
              Upon termination:
            </p>
            <ul>
              <li>Your right to use the platform will cease immediately</li>
              <li>We may delete your account and associated data</li>
              <li>Provisions regarding liability and indemnification will survive termination</li>
            </ul>
          </SectionContent>
        </Section>

        <Section>
          <SectionTitle>
            <FileText size={24} />
            Governing Law and Disputes
          </SectionTitle>
          <SectionContent>
            <p>
              These Terms shall be governed by and construed in accordance with the laws of 
              [Your Jurisdiction], without regard to its conflict of law principles.
            </p>
            <p>
              Any disputes arising under these Terms shall be resolved through:
            </p>
            <ol>
              <li>Good faith negotiation between the parties</li>
              <li>Mediation, if negotiation fails</li>
              <li>Binding arbitration, if mediation fails</li>
            </ol>
          </SectionContent>
        </Section>

        <Section>
          <SectionTitle>
            <FileText size={24} />
            General Provisions
          </SectionTitle>
          <SectionContent>
            <ul>
              <li><strong>Entire Agreement:</strong> These Terms constitute the entire agreement between you and us</li>
              <li><strong>Severability:</strong> If any provision is found unenforceable, the remainder will remain in effect</li>
              <li><strong>Waiver:</strong> Our failure to enforce any provision does not constitute a waiver</li>
              <li><strong>Assignment:</strong> You may not assign these Terms without our written consent</li>
              <li><strong>Force Majeure:</strong> We are not liable for delays caused by circumstances beyond our control</li>
            </ul>
          </SectionContent>
        </Section>

        <ContactInfo>
          <ContactTitle>
            <Mail size={20} />
            Contact Information
          </ContactTitle>
          <p>
            If you have any questions about these Terms of Service, please contact us:
          </p>
          <p>
            <strong>Email:</strong> legal@myportal.com<br />
            <strong>Address:</strong> 123 Legal Street, Terms City, TC 12345<br />
            <strong>Phone:</strong> (555) 123-4567
          </p>
        </ContactInfo>
      </ContentCard>
    </Container>
  );
};