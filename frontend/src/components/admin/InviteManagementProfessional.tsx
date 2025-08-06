/**
 * Professional InviteManagement - Beautiful invite management interface
 * Create and manage invitation links with modern styling
 */

import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { professionalTheme } from '../../styles/professionalTheme';
import { Card, Button } from '../../styles/ProfessionalStyles';
import { FirebaseCorporationManager } from '../../firebase/FirebaseCorporationManager';
import { AdminUser, CorporationInvite } from '../../types';
import { 
  Copy, 
  Users, 
  Hash, 
  CheckCircle, 
  XCircle, 
  Plus,
  Mail,
  Calendar,
  Clock,
  Shield,
  Globe,
  Sparkles
} from 'lucide-react';

interface InviteManagementProps {
  user: AdminUser;
}

const DashboardLayout = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${professionalTheme.spacing[6]};
`;

const HeaderSection = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: ${professionalTheme.spacing[6]};
  
  @media (max-width: ${professionalTheme.breakpoints.md}) {
    flex-direction: column;
    align-items: flex-start;
    gap: ${professionalTheme.spacing[4]};
  }
`;

const HeaderContent = styled.div``;

const HeaderTitle = styled.h2`
  font-size: ${professionalTheme.typography.fontSize['2xl']};
  font-weight: ${professionalTheme.typography.fontWeight.bold};
  color: ${professionalTheme.colors.gray[900]};
  margin: 0 0 ${professionalTheme.spacing[2]} 0;
`;

const HeaderSubtitle = styled.p`
  font-size: ${professionalTheme.typography.fontSize.base};
  color: ${professionalTheme.colors.gray[600]};
  margin: 0;
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: ${professionalTheme.spacing[6]};
  margin-bottom: ${professionalTheme.spacing[8]};
`;

const StatCard = styled(Card)<{ gradient: string }>`
  padding: ${professionalTheme.spacing[6]};
  background: ${props => props.gradient};
  border: none;
  text-align: center;
  position: relative;
  overflow: hidden;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    right: 0;
    width: 80px;
    height: 80px;
    background: rgba(255, 255, 255, 0.1);
    border-radius: 50%;
    transform: translate(30px, -30px);
  }
`;

const StatIcon = styled.div`
  width: 56px;
  height: 56px;
  margin: 0 auto ${professionalTheme.spacing[4]};
  background: rgba(255, 255, 255, 0.2);
  color: ${professionalTheme.colors.white};
  border-radius: ${professionalTheme.borderRadius.xl};
  display: flex;
  align-items: center;
  justify-content: center;
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.3);
  box-shadow: ${professionalTheme.shadows.md};
`;

const StatValue = styled.div`
  font-size: ${professionalTheme.typography.fontSize['2xl']};
  font-weight: ${professionalTheme.typography.fontWeight.bold};
  color: ${professionalTheme.colors.white};
  margin-bottom: ${professionalTheme.spacing[1]};
`;

const StatLabel = styled.div`
  font-size: ${professionalTheme.typography.fontSize.sm};
  color: rgba(255, 255, 255, 0.9);
  font-weight: ${professionalTheme.typography.fontWeight.medium};
`;

const CreateInviteCard = styled(Card)`
  padding: ${professionalTheme.spacing[8]};
  text-align: center;
  background: linear-gradient(135deg, 
    ${professionalTheme.colors.primary[50]} 0%,
    ${professionalTheme.colors.primary[25]} 100%
  );
  border: 2px dashed ${professionalTheme.colors.primary[200]};
  margin-bottom: ${professionalTheme.spacing[6]};
`;

const CreateInviteIcon = styled.div`
  width: 80px;
  height: 80px;
  margin: 0 auto ${professionalTheme.spacing[4]};
  background: ${professionalTheme.colors.primary[100]};
  color: ${professionalTheme.colors.primary[600]};
  border-radius: ${professionalTheme.borderRadius.full};
  display: flex;
  align-items: center;
  justify-content: center;
`;

const CreateInviteTitle = styled.h3`
  font-size: ${professionalTheme.typography.fontSize.xl};
  font-weight: ${professionalTheme.typography.fontWeight.semibold};
  color: ${professionalTheme.colors.gray[900]};
  margin: 0 0 ${professionalTheme.spacing[2]} 0;
`;

const CreateInviteSubtitle = styled.p`
  font-size: ${professionalTheme.typography.fontSize.base};
  color: ${professionalTheme.colors.gray[600]};
  margin: 0 0 ${professionalTheme.spacing[6]} 0;
`;

const InviteForm = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${professionalTheme.spacing[4]};
  max-width: 400px;
  margin: 0 auto;
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${professionalTheme.spacing[2]};
`;

const Label = styled.label`
  font-size: ${professionalTheme.typography.fontSize.sm};
  font-weight: ${professionalTheme.typography.fontWeight.medium};
  color: ${professionalTheme.colors.gray[700]};
`;

const Input = styled.input`
  padding: ${professionalTheme.spacing[3]};
  border: 1px solid ${professionalTheme.colors.gray[300]};
  border-radius: ${professionalTheme.borderRadius.md};
  font-size: ${professionalTheme.typography.fontSize.sm};
  transition: all 0.2s ease;
  
  &:focus {
    outline: none;
    border-color: ${professionalTheme.colors.primary[500]};
    box-shadow: 0 0 0 3px ${professionalTheme.colors.primary[100]};
  }
`;

const Select = styled.select`
  padding: ${professionalTheme.spacing[3]};
  border: 1px solid ${professionalTheme.colors.gray[300]};
  border-radius: ${professionalTheme.borderRadius.md};
  font-size: ${professionalTheme.typography.fontSize.sm};
  background: ${professionalTheme.colors.white};
  transition: all 0.2s ease;
  
  &:focus {
    outline: none;
    border-color: ${professionalTheme.colors.primary[500]};
    box-shadow: 0 0 0 3px ${professionalTheme.colors.primary[100]};
  }
`;

const InvitesList = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${professionalTheme.spacing[4]};
`;

const InviteCard = styled(Card)`
  padding: ${professionalTheme.spacing[6]};
  transition: all 0.2s ease;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: ${professionalTheme.shadows.cardHover};
  }
`;

const InviteHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: ${professionalTheme.spacing[4]};
`;

const InviteInfo = styled.div`
  flex: 1;
`;

const InviteCode = styled.div`
  font-size: ${professionalTheme.typography.fontSize.lg};
  font-weight: ${professionalTheme.typography.fontWeight.semibold};
  color: ${professionalTheme.colors.gray[900]};
  margin-bottom: ${professionalTheme.spacing[2]};
  display: flex;
  align-items: center;
  gap: ${professionalTheme.spacing[2]};
`;

const InviteMeta = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: ${professionalTheme.spacing[4]};
  font-size: ${professionalTheme.typography.fontSize.sm};
  color: ${professionalTheme.colors.gray[600]};
`;

const InviteActions = styled.div`
  display: flex;
  gap: ${professionalTheme.spacing[2]};
`;

const StatusBadge = styled.div<{ status: string }>`
  display: inline-flex;
  align-items: center;
  gap: ${professionalTheme.spacing[1]};
  padding: ${professionalTheme.spacing[1]} ${professionalTheme.spacing[2]};
  border-radius: ${professionalTheme.borderRadius.full};
  font-size: ${professionalTheme.typography.fontSize.xs};
  font-weight: ${professionalTheme.typography.fontWeight.medium};
  
  ${props => {
    switch (props.status) {
      case 'active':
        return `
          background: ${professionalTheme.colors.success[100]};
          color: ${professionalTheme.colors.success[700]};
        `;
      case 'expired':
        return `
          background: ${professionalTheme.colors.error[100]};
          color: ${professionalTheme.colors.error[700]};
        `;
      case 'used':
        return `
          background: ${professionalTheme.colors.gray[100]};
          color: ${professionalTheme.colors.gray[700]};
        `;
      default:
        return `
          background: ${professionalTheme.colors.gray[100]};
          color: ${professionalTheme.colors.gray[700]};
        `;
    }
  }}
`;

export const InviteManagement: React.FC<InviteManagementProps> = ({ user }) => {
  const [invites, setInvites] = useState<CorporationInvite[]>([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    role: 'creator' as 'creator' | 'admin',
    maxUses: 1,
    expiresInDays: 7,
    note: ''
  });

  const corporationManager = FirebaseCorporationManager.getInstance();

  useEffect(() => {
    loadInvites();
  }, [user.corporationId]);

  const loadInvites = async () => {
    if (!user.corporationId) return;
    
    try {
      setLoading(true);
      const invitesList = await corporationManager.getCorporationInvites(user.corporationId);
      setInvites(invitesList);
    } catch (error) {
      console.error('Failed to load invites:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateInvite = async () => {
    if (!user.corporationId) return;
    
    try {
      setCreating(true);
      await corporationManager.createInvite(user.corporationId, user.id, {
        role: formData.role,
        maxUses: formData.maxUses,
        expiresInDays: formData.expiresInDays,
        note: formData.note || undefined
      });
      
      // Reset form and reload invites
      setFormData({ role: 'creator', maxUses: 1, expiresInDays: 7, note: '' });
      setShowForm(false);
      await loadInvites();
    } catch (error) {
      console.error('Failed to create invite:', error);
    } finally {
      setCreating(false);
    }
  };

  const copyInviteLink = (inviteCode: string) => {
    const url = `${window.location.origin}/invite/${inviteCode}`;
    navigator.clipboard.writeText(url);
    // Could add toast notification here
  };

  const activeInvites = invites.filter(inv => inv.isActive);
  const totalUses = invites.reduce((sum, inv) => sum + (inv.currentUses || 0), 0);

  return (
    <DashboardLayout>
      {/* Header */}
      <HeaderSection>
        <HeaderContent>
          <HeaderTitle>Invitation Management</HeaderTitle>
          <HeaderSubtitle>Create and manage invitation links to grow your team</HeaderSubtitle>
        </HeaderContent>
        <Button 
          variant="primary" 
          onClick={() => setShowForm(!showForm)}
          disabled={!user.corporationId}
        >
          <Plus size={16} />
          Create Invite
        </Button>
      </HeaderSection>

      {/* Stats */}
      <StatsGrid>
        <StatCard gradient={`linear-gradient(135deg, ${professionalTheme.colors.primary[500]} 0%, ${professionalTheme.colors.primary[600]} 100%)`}>
          <StatIcon>
            <Mail size={24} />
          </StatIcon>
          <StatValue>{invites.length}</StatValue>
          <StatLabel>Total Invites</StatLabel>
        </StatCard>

        <StatCard gradient={`linear-gradient(135deg, ${professionalTheme.colors.success[500]} 0%, ${professionalTheme.colors.success[600]} 100%)`}>
          <StatIcon>
            <CheckCircle size={24} />
          </StatIcon>
          <StatValue>{activeInvites.length}</StatValue>
          <StatLabel>Active Invites</StatLabel>
        </StatCard>

        <StatCard gradient={`linear-gradient(135deg, ${professionalTheme.colors.warning[500]} 0%, ${professionalTheme.colors.warning[600]} 100%)`}>
          <StatIcon>
            <Users size={24} />
          </StatIcon>
          <StatValue>{totalUses}</StatValue>
          <StatLabel>Total Joins</StatLabel>
        </StatCard>
      </StatsGrid>

      {/* Create Invite Form */}
      {showForm && (
        <CreateInviteCard>
          <CreateInviteIcon>
            <Sparkles size={32} />
          </CreateInviteIcon>
          <CreateInviteTitle>Create New Invitation</CreateInviteTitle>
          <CreateInviteSubtitle>
            Generate a new invite link to add members to your team
          </CreateInviteSubtitle>
          
          <InviteForm>
            <FormGroup>
              <Label>Role</Label>
              <Select 
                value={formData.role}
                onChange={(e) => setFormData(prev => ({ ...prev, role: e.target.value as 'creator' | 'admin' }))}
              >
                <option value="creator">Creator</option>
                <option value="admin">Admin</option>
              </Select>
            </FormGroup>

            <FormGroup>
              <Label>Max Uses</Label>
              <Input 
                type="number"
                min="1"
                max="100"
                value={formData.maxUses}
                onChange={(e) => setFormData(prev => ({ ...prev, maxUses: parseInt(e.target.value) || 1 }))}
              />
            </FormGroup>

            <FormGroup>
              <Label>Expires In (Days)</Label>
              <Input 
                type="number"
                min="1"
                max="365"
                value={formData.expiresInDays}
                onChange={(e) => setFormData(prev => ({ ...prev, expiresInDays: parseInt(e.target.value) || 7 }))}
              />
            </FormGroup>

            <FormGroup>
              <Label>Note (Optional)</Label>
              <Input 
                type="text"
                placeholder="Add a note for this invite..."
                value={formData.note}
                onChange={(e) => setFormData(prev => ({ ...prev, note: e.target.value }))}
              />
            </FormGroup>

            <div style={{ display: 'flex', gap: professionalTheme.spacing[3] }}>
              <Button 
                variant="secondary" 
                onClick={() => setShowForm(false)}
                style={{ flex: 1 }}
              >
                Cancel
              </Button>
              <Button 
                variant="primary" 
                onClick={handleCreateInvite}
                disabled={creating}
                style={{ flex: 1 }}
              >
                {creating ? 'Creating...' : 'Create Invite'}
              </Button>
            </div>
          </InviteForm>
        </CreateInviteCard>
      )}

      {/* Invites List */}
      <Card>
        <div style={{ padding: professionalTheme.spacing[6] }}>
          <h3 style={{ 
            fontSize: professionalTheme.typography.fontSize.lg,
            fontWeight: professionalTheme.typography.fontWeight.semibold,
            color: professionalTheme.colors.gray[900],
            margin: `0 0 ${professionalTheme.spacing[6]} 0`
          }}>
            Recent Invitations
          </h3>
          
          {loading ? (
            <div style={{ textAlign: 'center', padding: professionalTheme.spacing[8] }}>
              Loading invitations...
            </div>
          ) : invites.length === 0 ? (
            <div style={{ textAlign: 'center', padding: professionalTheme.spacing[8] }}>
              <Globe size={48} style={{ color: professionalTheme.colors.gray[400], marginBottom: professionalTheme.spacing[4] }} />
              <p style={{ color: professionalTheme.colors.gray[600] }}>
                No invitations yet. Create your first invite to start growing your team!
              </p>
            </div>
          ) : (
            <InvitesList>
              {invites.map((invite) => (
                <InviteCard key={invite.id}>
                  <InviteHeader>
                    <InviteInfo>
                      <InviteCode>
                        <Hash size={16} />
                        {invite.inviteCode}
                        <StatusBadge status={invite.isActive ? 'active' : 'expired'}>
                          {invite.isActive ? <CheckCircle size={12} /> : <XCircle size={12} />}
                          {invite.isActive ? 'Active' : 'Expired'}
                        </StatusBadge>
                      </InviteCode>
                      <InviteMeta>
                        <span>
                          <Shield size={14} style={{ display: 'inline', marginRight: '4px' }} />
                          Role: {invite.role}
                        </span>
                        <span>
                          <Users size={14} style={{ display: 'inline', marginRight: '4px' }} />
                          Uses: {invite.currentUses || 0}/{invite.maxUses || '∞'}
                        </span>
                        <span>
                          <Calendar size={14} style={{ display: 'inline', marginRight: '4px' }} />
                          Created: {new Date(invite.createdAt).toLocaleDateString()}
                        </span>
                        {invite.expiresAt && (
                          <span>
                            <Clock size={14} style={{ display: 'inline', marginRight: '4px' }} />
                            Expires: {new Date(invite.expiresAt).toLocaleDateString()}
                          </span>
                        )}
                      </InviteMeta>
                    </InviteInfo>
                    <InviteActions>
                      <Button 
                        variant="secondary" 
                        size="sm"
                        onClick={() => copyInviteLink(invite.inviteCode)}
                      >
                        <Copy size={14} />
                        Copy Link
                      </Button>
                    </InviteActions>
                  </InviteHeader>
                  {invite.note && (
                    <p style={{ 
                      fontSize: professionalTheme.typography.fontSize.sm,
                      color: professionalTheme.colors.gray[600],
                      margin: 0,
                      padding: `${professionalTheme.spacing[3]} 0 0 0`,
                      borderTop: `1px solid ${professionalTheme.colors.gray[200]}`
                    }}>
                      Note: {invite.note}
                    </p>
                  )}
                </InviteCard>
              ))}
            </InvitesList>
          )}
        </div>
      </Card>
    </DashboardLayout>
  );
};