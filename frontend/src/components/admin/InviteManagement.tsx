/**
 * InviteManagement - Manage corporation invites
 * Create, view, and manage invitation links for the corporation
 */

import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { 
  UserPlus, Copy, Link2, Users, Calendar, Hash, 
  CheckCircle, XCircle, Plus, Edit, Trash2 
} from 'lucide-react';
import { theme } from '../../styles/theme';
import { FirebaseCorporationManager } from '../../firebase/FirebaseCorporationManager';
import { AdminUser, CorporationInvite } from '../../types';

interface InviteManagementProps {
  user: AdminUser;
}

const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
`;

const TopSection = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: ${theme.spacing[6]};
  flex-wrap: wrap;
  gap: ${theme.spacing[4]};
`;

const StatsRow = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: ${theme.spacing[4]};
  margin-bottom: ${theme.spacing[6]};
`;

const StatCard = styled.div`
  background: ${theme.colors.neutral[0]};
  border-radius: ${theme.borderRadius.lg};
  padding: ${theme.spacing[5]};
  box-shadow: ${theme.shadows.sm};
  border: 1px solid ${theme.colors.neutral[200]};
`;

const StatIcon = styled.div<{ color: string }>`
  width: 48px;
  height: 48px;
  background: ${props => props.color};
  border-radius: ${theme.borderRadius.lg};
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: ${theme.spacing[3]};
  
  svg {
    width: 24px;
    height: 24px;
    color: ${theme.colors.neutral[0]};
  }
`;

const StatValue = styled.div`
  font-size: ${theme.typography.fontSize['2xl']};
  font-weight: ${theme.typography.fontWeight.bold};
  color: ${theme.colors.neutral[900]};
  margin-bottom: ${theme.spacing[1]};
`;

const StatLabel = styled.div`
  font-size: ${theme.typography.fontSize.sm};
  color: ${theme.colors.neutral[600]};
`;

const Button = styled.button<{ variant?: 'primary' | 'secondary' }>`
  display: flex;
  align-items: center;
  gap: ${theme.spacing[2]};
  padding: ${theme.spacing[3]} ${theme.spacing[4]};
  border-radius: ${theme.borderRadius.md};
  font-weight: ${theme.typography.fontWeight.medium};
  cursor: pointer;
  transition: all ${theme.transitions.fast};
  border: none;
  
  ${props => props.variant === 'primary' ? `
    background: ${theme.colors.primary[500]};
    color: ${theme.colors.neutral[0]};
    
    &:hover {
      background: ${theme.colors.primary[600]};
    }
  ` : `
    background: ${theme.colors.neutral[100]};
    color: ${theme.colors.neutral[700]};
    border: 1px solid ${theme.colors.neutral[300]};
    
    &:hover {
      background: ${theme.colors.neutral[200]};
    }
  `}
  
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
  
  svg {
    width: 16px;
    height: 16px;
  }
`;

const InviteCard = styled.div`
  background: ${theme.colors.neutral[0]};
  border-radius: ${theme.borderRadius.lg};
  padding: ${theme.spacing[5]};
  box-shadow: ${theme.shadows.sm};
  border: 1px solid ${theme.colors.neutral[200]};
  margin-bottom: ${theme.spacing[4]};
`;

const InviteHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: ${theme.spacing[4]};
`;

const InviteInfo = styled.div`
  flex: 1;
`;

const InviteCode = styled.div`
  font-family: 'Monaco', 'Menlo', monospace;
  font-size: ${theme.typography.fontSize.lg};
  font-weight: ${theme.typography.fontWeight.bold};
  color: ${theme.colors.primary[600]};
  margin-bottom: ${theme.spacing[2]};
`;

const InviteNote = styled.div`
  color: ${theme.colors.neutral[600]};
  margin-bottom: ${theme.spacing[2]};
`;

const InviteStats = styled.div`
  display: flex;
  gap: ${theme.spacing[4]};
  font-size: ${theme.typography.fontSize.sm};
  color: ${theme.colors.neutral[500]};
`;

const InviteActions = styled.div`
  display: flex;
  gap: ${theme.spacing[2]};
  align-items: flex-start;
`;

const StatusBadge = styled.span<{ status: 'active' | 'expired' | 'maxed' }>`
  display: inline-flex;
  align-items: center;
  gap: ${theme.spacing[1]};
  padding: ${theme.spacing[1]} ${theme.spacing[2]};
  border-radius: ${theme.borderRadius.full};
  font-size: ${theme.typography.fontSize.xs};
  font-weight: ${theme.typography.fontWeight.medium};
  
  ${props => {
    switch (props.status) {
      case 'active':
        return `
          background: ${theme.colors.success.light};
          color: ${theme.colors.success.dark};
        `;
      case 'expired':
        return `
          background: ${theme.colors.error.light};
          color: ${theme.colors.error.dark};
        `;
      case 'maxed':
        return `
          background: ${theme.colors.warning.light};
          color: ${theme.colors.warning.dark};
        `;
      default:
        return '';
    }
  }}
`;

const InviteLink = styled.div`
  display: flex;
  align-items: center;
  gap: ${theme.spacing[2]};
  background: ${theme.colors.neutral[50]};
  border: 1px solid ${theme.colors.neutral[200]};
  border-radius: ${theme.borderRadius.md};
  padding: ${theme.spacing[3]};
  margin-top: ${theme.spacing[3]};
  font-family: 'Monaco', 'Menlo', monospace;
  font-size: ${theme.typography.fontSize.sm};
`;

const EmptyState = styled.div`
  text-align: center;
  padding: ${theme.spacing[8]};
  color: ${theme.colors.neutral[500]};
`;

export const InviteManagement: React.FC<InviteManagementProps> = ({ user }) => {
  const [invites, setInvites] = useState<CorporationInvite[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isCreating, setIsCreating] = useState(false);

  const corporationManager = FirebaseCorporationManager.getInstance();

  useEffect(() => {
    loadInvites();
  }, []);

  const loadInvites = async () => {
    if (!user.corporationId) return;

    try {
      setIsLoading(true);
      const inviteList = await corporationManager.getCorporationInvites(user.corporationId);
      setInvites(inviteList);
    } catch (error) {
      console.error('Failed to load invites:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const createInvite = async () => {
    if (!user.corporationId) return;

    try {
      setIsCreating(true);
      const newInvite = await corporationManager.createInvite(
        user.corporationId,
        user.id,
        {
          role: 'creator',
          maxUses: 10,
          expiresInDays: 30,
          note: 'Join our creator team!'
        }
      );
      setInvites(prev => [newInvite, ...prev]);
    } catch (error) {
      console.error('Failed to create invite:', error);
    } finally {
      setIsCreating(false);
    }
  };

  const copyInviteLink = async (inviteLink: string) => {
    try {
      await navigator.clipboard.writeText(inviteLink);
      // Could add a toast notification here
    } catch (error) {
      console.error('Failed to copy link:', error);
    }
  };

  const getInviteStatus = (invite: CorporationInvite): 'active' | 'expired' | 'maxed' => {
    const now = new Date();
    const expiresAt = new Date(invite.expiresAt);
    
    if (now > expiresAt) return 'expired';
    if (invite.maxUses && invite.currentUses >= invite.maxUses) return 'maxed';
    return 'active';
  };

  const getStatusIcon = (status: 'active' | 'expired' | 'maxed') => {
    switch (status) {
      case 'active':
        return <CheckCircle size={12} />;
      case 'expired':
        return <XCircle size={12} />;
      case 'maxed':
        return <Hash size={12} />;
    }
  };

  const getStatusLabel = (status: 'active' | 'expired' | 'maxed') => {
    switch (status) {
      case 'active':
        return 'Active';
      case 'expired':
        return 'Expired';
      case 'maxed':
        return 'Max Uses Reached';
    }
  };

  const activeInvites = invites.filter(invite => getInviteStatus(invite) === 'active');
  const totalUses = invites.reduce((sum, invite) => sum + invite.currentUses, 0);

  if (isLoading) {
    return (
      <Container>
        <EmptyState>Loading invites...</EmptyState>
      </Container>
    );
  }

  return (
    <Container>
      <TopSection>
        <div>
          <h2>Invitation Management</h2>
          <p>Create and manage invitation links for your corporation</p>
        </div>
        <Button 
          variant="primary" 
          onClick={createInvite}
          disabled={isCreating}
        >
          <Plus />
          {isCreating ? 'Creating...' : 'Create Invite'}
        </Button>
      </TopSection>

      <StatsRow>
        <StatCard>
          <StatIcon color={theme.colors.primary[500]}>
            <Link2 />
          </StatIcon>
          <StatValue>{invites.length}</StatValue>
          <StatLabel>Total Invites</StatLabel>
        </StatCard>

        <StatCard>
          <StatIcon color={theme.colors.success[500]}>
            <CheckCircle />
          </StatIcon>
          <StatValue>{activeInvites.length}</StatValue>
          <StatLabel>Active Invites</StatLabel>
        </StatCard>

        <StatCard>
          <StatIcon color={theme.colors.warning[500]}>
            <Users />
          </StatIcon>
          <StatValue>{totalUses}</StatValue>
          <StatLabel>Total Uses</StatLabel>
        </StatCard>
      </StatsRow>

      {invites.length === 0 ? (
        <EmptyState>
          <UserPlus size={48} style={{ marginBottom: theme.spacing[4] }} />
          <h3>No invites created yet</h3>
          <p>Create your first invitation link to start inviting creators to your corporation.</p>
        </EmptyState>
      ) : (
        invites.map((invite) => {
          const status = getInviteStatus(invite);
          return (
            <InviteCard key={invite.id}>
              <InviteHeader>
                <InviteInfo>
                  <InviteCode>{invite.inviteCode}</InviteCode>
                  {invite.note && <InviteNote>{invite.note}</InviteNote>}
                  <InviteStats>
                    <span>Uses: {invite.currentUses}/{invite.maxUses || '∞'}</span>
                    <span>•</span>
                    <span>Expires: {new Date(invite.expiresAt).toLocaleDateString()}</span>
                    <span>•</span>
                    <span>Role: {invite.role}</span>
                  </InviteStats>
                </InviteInfo>
                <InviteActions>
                  <StatusBadge status={status}>
                    {getStatusIcon(status)}
                    {getStatusLabel(status)}
                  </StatusBadge>
                </InviteActions>
              </InviteHeader>
              
              <InviteLink>
                <Link2 size={16} />
                <span style={{ flex: 1 }}>{invite.inviteLink}</span>
                <Button 
                  variant="secondary" 
                  onClick={() => copyInviteLink(invite.inviteLink)}
                >
                  <Copy />
                  Copy
                </Button>
              </InviteLink>
            </InviteCard>
          );
        })
      )}
    </Container>
  );
};