/**
 * CorporationMembers - Displays and manages corporation members
 * Shows creators, admins, and pending members with management actions
 */

import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { theme } from '../../styles/theme';
import { 
  Users, UserCheck, UserX, Mail, Instagram, 
  Twitter, MessageSquare, Crown,
  Shield, User, Clock, CheckCircle, XCircle,
  Plus
} from 'lucide-react';
import { FirebaseCorporationManager } from '../../firebase/FirebaseCorporationManager';
import { CorporationMember, AdminUser } from '../../types';

interface CorporationMembersProps {
  user: AdminUser;
  corporationId: string;
}

interface MemberWithProfile {
  member: CorporationMember;
  profile: {
    username: string;
    email: string;
    socialHandles?: {
      instagram?: string;
      tiktok?: string;
      twitter?: string;
      youtube?: string;
    };
    bio?: string;
    totalSubmissions?: number;
    approvedSubmissions?: number;
  };
}

const MembersContainer = styled.div`
  background: ${theme.colors.neutral[0]};
  border-radius: 16px;
  padding: 2rem;
`;

const MembersHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
`;

const HeaderTitle = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
`;

const Title = styled.h2`
  font-size: 1.5rem;
  font-weight: 700;
  margin: 0;
  color: ${theme.colors.neutral[900]};
`;

const MemberCount = styled.span`
  background: ${theme.colors.primary[100]};
  color: ${theme.colors.primary[700]};
  padding: 0.25rem 0.75rem;
  border-radius: 12px;
  font-size: 0.875rem;
  font-weight: 600;
`;

const InviteButton = styled.button`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background: ${theme.colors.primary[500]};
  color: white;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 12px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:hover {
    background: ${theme.colors.primary[600]};
    transform: translateY(-1px);
  }
`;

const FilterTabs = styled.div`
  display: flex;
  gap: 1rem;
  margin-bottom: 2rem;
  border-bottom: 1px solid ${theme.colors.neutral[200]};
`;

const FilterTab = styled.button<{ active: boolean }>`
  padding: 0.75rem 1rem;
  border: none;
  background: none;
  font-weight: 600;
  font-size: 0.9rem;
  cursor: pointer;
  border-bottom: 2px solid transparent;
  transition: all 0.2s ease;
  
  ${props => props.active ? `
    color: ${theme.colors.primary[600]};
    border-bottom-color: ${theme.colors.primary[500]};
  ` : `
    color: ${theme.colors.neutral[600]};
    
    &:hover {
      color: ${theme.colors.neutral[800]};
    }
  `}
`;

const MembersList = styled.div`
  display: grid;
  gap: 1rem;
`;

const MemberCard = styled.div`
  background: ${theme.colors.neutral[25]};
  border: 1px solid ${theme.colors.neutral[200]};
  border-radius: 12px;
  padding: 1.5rem;
  transition: all 0.2s ease;
  
  &:hover {
    border-color: ${theme.colors.primary[200]};
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  }
`;

const MemberHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 1rem;
`;

const MemberInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
`;

const MemberAvatar = styled.div<{ role: string }>`
  width: 48px;
  height: 48px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  font-size: 1.2rem;
  color: white;
  
  ${props => {
    if (props.role === 'owner') return `background: ${theme.colors.purple[500]};`;
    if (props.role === 'admin') return `background: ${theme.colors.primary[500]};`;
    return `background: ${theme.colors.success.main};`;
  }}
`;

const MemberDetails = styled.div`
  flex: 1;
`;

const MemberName = styled.h3`
  margin: 0 0 0.25rem 0;
  font-size: 1.1rem;
  font-weight: 700;
  color: ${theme.colors.neutral[900]};
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const RoleIcon = styled.div<{ role: string }>`
  display: flex;
  align-items: center;
  
  ${props => {
    if (props.role === 'owner') return `color: ${theme.colors.purple[500]};`;
    if (props.role === 'admin') return `color: ${theme.colors.primary[500]};`;
    return `color: ${theme.colors.success.main};`;
  }}
`;

const MemberEmail = styled.p`
  margin: 0 0 0.5rem 0;
  color: ${theme.colors.neutral[600]};
  font-size: 0.9rem;
`;

const MemberStats = styled.div`
  display: flex;
  gap: 1rem;
  margin-bottom: 1rem;
`;

const StatItem = styled.div`
  text-align: center;
`;

const StatValue = styled.div`
  font-size: 1.2rem;
  font-weight: 700;
  color: ${theme.colors.neutral[900]};
`;

const StatLabel = styled.div`
  font-size: 0.75rem;
  color: ${theme.colors.neutral[600]};
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;

const SocialHandles = styled.div`
  display: flex;
  gap: 0.5rem;
  margin-bottom: 1rem;
`;

const SocialHandle = styled.a`
  display: flex;
  align-items: center;
  gap: 0.25rem;
  padding: 0.25rem 0.5rem;
  background: ${theme.colors.neutral[100]};
  border-radius: 6px;
  font-size: 0.75rem;
  color: ${theme.colors.neutral[700]};
  text-decoration: none;
  transition: all 0.2s ease;
  
  &:hover {
    background: ${theme.colors.neutral[200]};
    transform: translateY(-1px);
  }
`;

const MemberActions = styled.div`
  display: flex;
  gap: 0.5rem;
`;

const ActionButton = styled.button<{ variant?: 'primary' | 'success' | 'danger' }>`
  display: flex;
  align-items: center;
  gap: 0.25rem;
  padding: 0.5rem 0.75rem;
  border: none;
  border-radius: 8px;
  font-size: 0.8rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  
  ${props => {
    switch (props.variant) {
      case 'success':
        return `
          background: ${theme.colors.success.light};
          color: ${theme.colors.success.dark};
          &:hover { background: ${theme.colors.success.main}20; }
        `;
      case 'danger':
        return `
          background: ${theme.colors.error.light};
          color: ${theme.colors.error.dark};
          &:hover { background: ${theme.colors.error.main}20; }
        `;
      default:
        return `
          background: ${theme.colors.primary[100]};
          color: ${theme.colors.primary[700]};
          &:hover { background: ${theme.colors.primary[200]}; }
        `;
    }
  }}
`;

const StatusBadge = styled.div<{ status: string }>`
  display: inline-flex;
  align-items: center;
  gap: 0.25rem;
  padding: 0.25rem 0.5rem;
  border-radius: 6px;
  font-size: 0.75rem;
  font-weight: 600;
  
  ${props => {
    switch (props.status) {
      case 'active':
        return `
          background: ${theme.colors.success.light};
          color: ${theme.colors.success.dark};
        `;
      case 'pending':
        return `
          background: ${theme.colors.warning.light};
          color: ${theme.colors.warning.dark};
        `;
      default:
        return `
          background: ${theme.colors.neutral[100]};
          color: ${theme.colors.neutral[700]};
        `;
    }
  }}
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 3rem 1rem;
  color: ${theme.colors.neutral[600]};
`;

const EmptyIcon = styled.div`
  font-size: 3rem;
  margin-bottom: 1rem;
  opacity: 0.5;
`;

export const CorporationMembers: React.FC<CorporationMembersProps> = ({
  user,
  corporationId
}) => {
  const [members, setMembers] = useState<MemberWithProfile[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState<'all' | 'active' | 'pending'>('all');
  const corporationManager = FirebaseCorporationManager.getInstance();

  useEffect(() => {
    loadMembers();
  }, [corporationId]);

  const loadMembers = async () => {
    try {
      setIsLoading(true);
      const membersList = await corporationManager.getCorporationMembers(corporationId);
      
      // TODO: Load user profiles for each member
      // For now, create mock data structure
      const membersWithProfiles: MemberWithProfile[] = membersList.map(member => ({
        member,
        profile: {
          username: `User_${member.userId.slice(-4)}`,
          email: `user${member.userId.slice(-4)}@example.com`,
          socialHandles: {
            instagram: '@creator_handle',
            tiktok: '@tiktok_user'
          },
          bio: 'Content creator passionate about...',
          totalSubmissions: Math.floor(Math.random() * 50),
          approvedSubmissions: Math.floor(Math.random() * 30)
        }
      }));
      
      setMembers(membersWithProfiles);
    } catch (error) {
      console.error('Error loading members:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleApproveMember = async (memberId: string) => {
    // TODO: Implement member approval
    console.log('Approve member:', memberId);
  };

  const handleRejectMember = async (memberId: string) => {
    // TODO: Implement member rejection
    console.log('Reject member:', memberId);
  };

  const handleRemoveMember = async (memberId: string) => {
    // TODO: Implement member removal
    console.log('Remove member:', memberId);
  };

  const filteredMembers = members.filter(({ member }) => {
    if (activeFilter === 'all') return true;
    return member.status === activeFilter;
  });

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'owner': return <Crown size={16} />;
      case 'admin': return <Shield size={16} />;
      default: return <User size={16} />;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active': return <CheckCircle size={12} />;
      case 'pending': return <Clock size={12} />;
      default: return <XCircle size={12} />;
    }
  };

  if (isLoading) {
    return (
      <MembersContainer>
        <div style={{ textAlign: 'center', padding: '2rem' }}>
          Loading members...
        </div>
      </MembersContainer>
    );
  }

  return (
    <MembersContainer>
      <MembersHeader>
        <HeaderTitle>
          <Users size={24} color={theme.colors.primary[500]} />
          <div>
            <Title>Corporation Members</Title>
            <MemberCount>{members.length} members</MemberCount>
          </div>
        </HeaderTitle>
        <InviteButton>
          <Plus size={16} />
          Invite Creators
        </InviteButton>
      </MembersHeader>

      <FilterTabs>
        <FilterTab 
          active={activeFilter === 'all'} 
          onClick={() => setActiveFilter('all')}
        >
          All ({members.length})
        </FilterTab>
        <FilterTab 
          active={activeFilter === 'active'} 
          onClick={() => setActiveFilter('active')}
        >
          Active ({members.filter(m => m.member.status === 'active').length})
        </FilterTab>
        <FilterTab 
          active={activeFilter === 'pending'} 
          onClick={() => setActiveFilter('pending')}
        >
          Pending ({members.filter(m => m.member.status === 'pending').length})
        </FilterTab>
      </FilterTabs>

      <MembersList>
        {filteredMembers.length === 0 ? (
          <EmptyState>
            <EmptyIcon>👥</EmptyIcon>
            <h3>No members found</h3>
            <p>Invite creators to join your corporation and start collaborating!</p>
          </EmptyState>
        ) : (
          filteredMembers.map(({ member, profile }) => (
            <MemberCard key={member.userId}>
              <MemberHeader>
                <MemberInfo>
                  <MemberAvatar role={member.role}>
                    {profile.username.charAt(0).toUpperCase()}
                  </MemberAvatar>
                  <MemberDetails>
                    <MemberName>
                      {profile.username}
                      <RoleIcon role={member.role}>
                        {getRoleIcon(member.role)}
                      </RoleIcon>
                      <StatusBadge status={member.status}>
                        {getStatusIcon(member.status)}
                        {member.status}
                      </StatusBadge>
                    </MemberName>
                    <MemberEmail>{profile.email}</MemberEmail>
                    {profile.bio && (
                      <div style={{ fontSize: '0.875rem', color: theme.colors.neutral[600], marginBottom: '0.5rem' }}>
                        {profile.bio}
                      </div>
                    )}
                  </MemberDetails>
                </MemberInfo>
              </MemberHeader>

              {member.role === 'creator' && (
                <MemberStats>
                  <StatItem>
                    <StatValue>{profile.totalSubmissions || 0}</StatValue>
                    <StatLabel>Submissions</StatLabel>
                  </StatItem>
                  <StatItem>
                    <StatValue>{profile.approvedSubmissions || 0}</StatValue>
                    <StatLabel>Approved</StatLabel>
                  </StatItem>
                  <StatItem>
                    <StatValue>
                      {profile.totalSubmissions ? 
                        Math.round(((profile.approvedSubmissions || 0) / profile.totalSubmissions) * 100) : 0}%
                    </StatValue>
                    <StatLabel>Success Rate</StatLabel>
                  </StatItem>
                </MemberStats>
              )}

              {profile.socialHandles && (
                <SocialHandles>
                  {profile.socialHandles.instagram && (
                    <SocialHandle href={`https://instagram.com/${profile.socialHandles.instagram.replace('@', '')}`} target="_blank">
                      <Instagram size={12} />
                      {profile.socialHandles.instagram}
                    </SocialHandle>
                  )}
                  {profile.socialHandles.tiktok && (
                    <SocialHandle href={`https://tiktok.com/${profile.socialHandles.tiktok.replace('@', '')}`} target="_blank">
                      <MessageSquare size={12} />
                      {profile.socialHandles.tiktok}
                    </SocialHandle>
                  )}
                  {profile.socialHandles.twitter && (
                    <SocialHandle href={`https://twitter.com/${profile.socialHandles.twitter.replace('@', '')}`} target="_blank">
                      <Twitter size={12} />
                      {profile.socialHandles.twitter}
                    </SocialHandle>
                  )}
                </SocialHandles>
              )}

              <MemberActions>
                {member.status === 'pending' && member.role !== 'owner' && (
                  <>
                    <ActionButton variant="success" onClick={() => handleApproveMember(member.userId)}>
                      <UserCheck size={14} />
                      Approve
                    </ActionButton>
                    <ActionButton variant="danger" onClick={() => handleRejectMember(member.userId)}>
                      <UserX size={14} />
                      Reject
                    </ActionButton>
                  </>
                )}
                
                {member.status === 'active' && member.role !== 'owner' && user.corporationRole === 'owner' && (
                  <ActionButton variant="danger" onClick={() => handleRemoveMember(member.userId)}>
                    <UserX size={14} />
                    Remove
                  </ActionButton>
                )}
                
                <ActionButton>
                  <Mail size={14} />
                  Message
                </ActionButton>
              </MemberActions>
            </MemberCard>
          ))
        )}
      </MembersList>
    </MembersContainer>
  );
};