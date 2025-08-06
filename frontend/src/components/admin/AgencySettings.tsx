/**
 * AgencySettings - Professional agency/corporation settings management
 * Allows admins to edit agency details, settings, and preferences
 */

import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { professionalTheme } from '../../styles/professionalTheme';
import { Card, Button, Input, Textarea } from '../../styles/ProfessionalStyles';
import { FirebaseCorporationManager } from '../../firebase/FirebaseCorporationManager';
import { AdminUser, Corporation } from '../../types';
import { 
  Building2, 
  Save, 
  Mail, 
  Users,
  Bell
} from 'lucide-react';

interface AgencySettingsProps {
  user: AdminUser;
}

const SettingsContainer = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: ${professionalTheme.spacing[8]};
  
  @media (max-width: ${professionalTheme.breakpoints.lg}) {
    grid-template-columns: 1fr;
    gap: ${professionalTheme.spacing[6]};
  }
`;

const SettingsCard = styled(Card)`
  padding: ${professionalTheme.spacing[8]};
`;

const CardHeader = styled.div`
  display: flex;
  align-items: center;
  gap: ${professionalTheme.spacing[3]};
  margin-bottom: ${professionalTheme.spacing[6]};
  
  svg {
    width: 24px;
    height: 24px;
    color: ${professionalTheme.colors.primary[500]};
  }
`;

const CardTitle = styled.h3`
  font-size: ${professionalTheme.typography.fontSize.lg};
  font-weight: ${professionalTheme.typography.fontWeight.semibold};
  color: ${professionalTheme.colors.gray[900]};
  margin: 0;
`;

const FormGroup = styled.div`
  margin-bottom: ${professionalTheme.spacing[6]};
`;

const Label = styled.label`
  display: block;
  font-size: ${professionalTheme.typography.fontSize.sm};
  font-weight: ${professionalTheme.typography.fontWeight.medium};
  color: ${professionalTheme.colors.gray[700]};
  margin-bottom: ${professionalTheme.spacing[2]};
`;

const FormActions = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: ${professionalTheme.spacing[3]};
  margin-top: ${professionalTheme.spacing[8]};
  padding-top: ${professionalTheme.spacing[6]};
  border-top: 1px solid ${professionalTheme.colors.gray[200]};
`;

const SuccessMessage = styled.div`
  background: ${professionalTheme.colors.success[50]};
  border: 1px solid ${professionalTheme.colors.success[200]};
  color: ${professionalTheme.colors.success[700]};
  padding: ${professionalTheme.spacing[4]};
  border-radius: ${professionalTheme.borderRadius.md};
  margin-bottom: ${professionalTheme.spacing[6]};
  font-size: ${professionalTheme.typography.fontSize.sm};
`;

const SettingItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: ${professionalTheme.spacing[4]} 0;
  border-bottom: 1px solid ${professionalTheme.colors.gray[100]};
  
  &:last-child {
    border-bottom: none;
  }
`;

const SettingLabel = styled.div`
  font-size: ${professionalTheme.typography.fontSize.sm};
  font-weight: ${professionalTheme.typography.fontWeight.medium};
  color: ${professionalTheme.colors.gray[900]};
`;

const SettingDescription = styled.div`
  font-size: ${professionalTheme.typography.fontSize.xs};
  color: ${professionalTheme.colors.gray[500]};
  margin-top: ${professionalTheme.spacing[1]};
`;

const Switch = styled.button<{ isOn: boolean }>`
  width: 44px;
  height: 24px;
  border-radius: ${professionalTheme.borderRadius.full};
  border: none;
  cursor: pointer;
  position: relative;
  transition: ${professionalTheme.transitions.all};
  
  background: ${props => props.isOn ? professionalTheme.colors.primary[500] : professionalTheme.colors.gray[300]};
  
  &::after {
    content: '';
    position: absolute;
    top: 2px;
    left: ${props => props.isOn ? '22px' : '2px'};
    width: 20px;
    height: 20px;
    border-radius: ${professionalTheme.borderRadius.full};
    background: ${professionalTheme.colors.white};
    transition: ${professionalTheme.transitions.all};
  }
`;

export const AgencySettings: React.FC<AgencySettingsProps> = ({ user }) => {
  const [corporation, setCorporation] = useState<Corporation | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [formData, setFormData] = useState({
    displayName: '',
    description: '',
    industry: '',
    website: '',
    email: '',
    phone: '',
    address: ''
  });
  const [settings, setSettings] = useState({
    allowPublicJoin: false,
    requireApproval: true,
    emailNotifications: true,
    weeklyReports: true
  });
  
  const corporationManager = FirebaseCorporationManager.getInstance();

  useEffect(() => {
    loadCorporationData();
  }, []);

  const loadCorporationData = async () => {
    if (!user.corporationId) return;
    
    try {
      setIsLoading(true);
      const corpData = await corporationManager.getCorporation(user.corporationId);
      if (corpData) {
        setCorporation(corpData);
        setFormData({
          displayName: corpData.displayName || '',
          description: corpData.description || '',
          industry: corpData.industry || '',
          website: corpData.website || '',
          email: corpData.email || '',
          phone: corpData.phone || '',
          address: corpData.address || ''
        });
        setSettings({
          allowPublicJoin: corpData.settings?.allowPublicJoin || false,
          requireApproval: corpData.settings?.requireApproval || true,
          emailNotifications: corpData.settings?.emailNotifications || true,
          weeklyReports: corpData.settings?.weeklyReports || true
        });
      }
    } catch (error) {
      console.error('Error loading corporation data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSettingToggle = (setting: string) => {
    setSettings(prev => ({ ...prev, [setting]: !prev[setting as keyof typeof prev] }));
  };

  const handleSave = async () => {
    if (!user.corporationId) return;
    
    try {
      setIsSaving(true);
      await corporationManager.updateCorporation(user.corporationId, {
        ...formData,
        settings: {
          ...corporation?.settings,
          ...settings
        }
      });
      
      setSuccessMessage('Agency settings updated successfully!');
      setTimeout(() => setSuccessMessage(''), 3000);
      
      // Reload data
      await loadCorporationData();
    } catch (error) {
      console.error('Error updating corporation:', error);
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return <div>Loading agency settings...</div>;
  }

  if (!corporation) {
    return <div>No agency found. Please complete your onboarding process.</div>;
  }

  return (
    <div>
      {successMessage && (
        <SuccessMessage>{successMessage}</SuccessMessage>
      )}
      
      <SettingsContainer>
        <SettingsCard>
          <CardHeader>
            <Building2 />
            <CardTitle>Agency Information</CardTitle>
          </CardHeader>
          
          <FormGroup>
            <Label>Agency Name</Label>
            <Input
              value={formData.displayName}
              onChange={(e) => handleInputChange('displayName', e.target.value)}
              placeholder="Enter agency name"
            />
          </FormGroup>
          
          <FormGroup>
            <Label>Description</Label>
            <Textarea
              value={formData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              placeholder="Describe your agency..."
              rows={4}
            />
          </FormGroup>
          
          <FormGroup>
            <Label>Industry</Label>
            <Input
              value={formData.industry}
              onChange={(e) => handleInputChange('industry', e.target.value)}
              placeholder="e.g. Marketing, Entertainment, Education"
            />
          </FormGroup>
          
          <FormGroup>
            <Label>Website</Label>
            <Input
              type="url"
              value={formData.website}
              onChange={(e) => handleInputChange('website', e.target.value)}
              placeholder="https://your-agency.com"
            />
          </FormGroup>
        </SettingsCard>

        <SettingsCard>
          <CardHeader>
            <Mail />
            <CardTitle>Contact Information</CardTitle>
          </CardHeader>
          
          <FormGroup>
            <Label>Email Address</Label>
            <Input
              type="email"
              value={formData.email}
              onChange={(e) => handleInputChange('email', e.target.value)}
              placeholder="contact@agency.com"
            />
          </FormGroup>
          
          <FormGroup>
            <Label>Phone Number</Label>
            <Input
              type="tel"
              value={formData.phone}
              onChange={(e) => handleInputChange('phone', e.target.value)}
              placeholder="+1 (555) 123-4567"
            />
          </FormGroup>
          
          <FormGroup>
            <Label>Address</Label>
            <Textarea
              value={formData.address}
              onChange={(e) => handleInputChange('address', e.target.value)}
              placeholder="Enter your business address..."
              rows={3}
            />
          </FormGroup>
        </SettingsCard>

        <SettingsCard>
          <CardHeader>
            <Users />
            <CardTitle>Team Settings</CardTitle>
          </CardHeader>
          
          <SettingItem>
            <div>
              <SettingLabel>Allow Public Join</SettingLabel>
              <SettingDescription>
                Allow creators to join your agency without an invitation
              </SettingDescription>
            </div>
            <Switch
              isOn={settings.allowPublicJoin}
              onClick={() => handleSettingToggle('allowPublicJoin')}
            />
          </SettingItem>
          
          <SettingItem>
            <div>
              <SettingLabel>Require Approval</SettingLabel>
              <SettingDescription>
                Require admin approval for new member requests
              </SettingDescription>
            </div>
            <Switch
              isOn={settings.requireApproval}
              onClick={() => handleSettingToggle('requireApproval')}
            />
          </SettingItem>
        </SettingsCard>

        <SettingsCard>
          <CardHeader>
            <Bell />
            <CardTitle>Notifications</CardTitle>
          </CardHeader>
          
          <SettingItem>
            <div>
              <SettingLabel>Email Notifications</SettingLabel>
              <SettingDescription>
                Receive email alerts for new submissions and activities
              </SettingDescription>
            </div>
            <Switch
              isOn={settings.emailNotifications}
              onClick={() => handleSettingToggle('emailNotifications')}
            />
          </SettingItem>
          
          <SettingItem>
            <div>
              <SettingLabel>Weekly Reports</SettingLabel>
              <SettingDescription>
                Get weekly performance reports via email
              </SettingDescription>
            </div>
            <Switch
              isOn={settings.weeklyReports}
              onClick={() => handleSettingToggle('weeklyReports')}
            />
          </SettingItem>
        </SettingsCard>
      </SettingsContainer>
      
      <FormActions>
        <Button variant="secondary" onClick={loadCorporationData}>
          Reset Changes
        </Button>
        <Button onClick={handleSave} loading={isSaving}>
          <Save size={16} />
          Save Changes
        </Button>
      </FormActions>
    </div>
  );
};