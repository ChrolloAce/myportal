/**
 * AgencyInfo - Shows creator's agency/corporation information and team members
 * Displays agency details, fellow creators, and joining options
 */

import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { theme } from '../../styles/theme';
import { 
  Building2, Users, Crown, Shield, User,
  Instagram, Twitter, MessageSquare,
  UserPlus, Globe
} from 'lucide-react';
import { FirebaseCorporationManager } from '../../firebase/FirebaseCorporationManager';
import { Corporation, CorporationMember, CreatorUser } from '../../types';

interface AgencyInfoProps {
  user: CreatorUser;
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

const AgencyContainer = styled.div`
  background: ${theme.colors.neutral[0]};
  border-radius: 16px;
  padding: 2rem;
  margin-bottom: 2rem;
`;

const AgencyHeader = styled.div`
  text-align: center;
  padding: 2rem;
  background: linear-gradient(135deg, ${theme.colors.primary[500]} 0%, ${theme.colors.primary[600]} 100%);
  border-radius: 12px;
  color: white;
  margin-bottom: 2rem;
`;

const AgencyLogo = styled.div`
  width: 80px;
  height: 80px;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 2rem;
  margin: 0 auto 1rem;
`;

const AgencyName = styled.h1`
  font-size: 2rem;
  font-weight: 700;
  margin: 0 0 0.5rem 0;
`;

const AgencyDescription = styled.p`
  font-size: 1.1rem;
  opacity: 0.9;
  margin: 0;
  max-width: 600px;
  margin: 0 auto;
`;

const AgencyStats = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 1rem;
  margin-bottom: 2rem;
`;

const StatCard = styled.div`
  background: ${theme.colors.neutral[50]};
  border: 1px solid ${theme.colors.neutral[200]};
  border-radius: 12px;
  padding: 1.5rem;
  text-align: center;
`;

const StatValue = styled.div`
  font-size: 2rem;
  font-weight: 700;
  color: ${theme.colors.primary[600]};
  margin-bottom: 0.5rem;
`;

const StatLabel = styled.div`
  font-size: 0.875rem;
  color: ${theme.colors.neutral[600]};
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;

const SocialLinks = styled.div`
  display: flex;
  gap: 1rem;
  justify-content: center;
  margin: 1.5rem 0;
`;

const SocialLink = styled.a`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 8px;
  color: white;
  text-decoration: none;
  font-size: 0.875rem;
  transition: all 0.2s ease;
  
  &:hover {
    background: rgba(255, 255, 255, 0.3);
    transform: translateY(-1px);
  }
`;

const MembersSection = styled.div`
  margin-top: 2rem;
`;

const SectionTitle = styled.h3`
  font-size: 1.5rem;
  font-weight: 700;
  color: ${theme.colors.neutral[900]};
  margin-bottom: 1rem;
  display: flex;
  align-items: center;
  gap: 0.75rem;
`;

const MembersList = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
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
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  }
`;

const MemberHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1rem;
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

const MemberInfo = styled.div`
  flex: 1;
`;

const MemberName = styled.h4`
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
  margin: 0;
  color: ${theme.colors.neutral[600]};
  font-size: 0.9rem;
`;

const MemberSocials = styled.div`
  display: flex;
  gap: 0.5rem;
  margin-top: 0.75rem;
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

const NoAgencyCard = styled.div`
  background: linear-gradient(135deg, ${theme.colors.neutral[50]} 0%, ${theme.colors.neutral[100]} 100%);
  border: 2px dashed ${theme.colors.neutral[300]};
  border-radius: 16px;
  padding: 3rem 2rem;
  text-align: center;
`;

const NoAgencyIcon = styled.div`
  font-size: 4rem;
  margin-bottom: 1rem;
  opacity: 0.5;
`;

const NoAgencyTitle = styled.h3`
  font-size: 1.5rem;
  font-weight: 700;
  color: ${theme.colors.neutral[800]};
  margin-bottom: 1rem;
`;

const NoAgencyDescription = styled.p`
  color: ${theme.colors.neutral[600]};
  margin-bottom: 2rem;
  max-width: 500px;
  margin-left: auto;
  margin-right: auto;
`;

const JoinButton = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  background: ${theme.colors.primary[500]};
  color: white;
  border: none;
  padding: 1rem 2rem;
  border-radius: 12px;
  font-weight: 600;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:hover {
    background: ${theme.colors.primary[600]};
    transform: translateY(-2px);
    box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
  }
`;

export const AgencyInfo: React.FC<AgencyInfoProps> = ({ user }) => {
  const [corporation, setCorporation] = useState<Corporation | null>(null);
  const [members, setMembers] = useState<MemberWithProfile[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const corporationManager = FirebaseCorporationManager.getInstance();

  useEffect(() => {
    if (user.corporationId) {
      loadAgencyInfo();
    } else {
      setIsLoading(false);
    }
  }, [user.corporationId]);

  const loadAgencyInfo = async () => {
    if (!user.corporationId) return;
    
    try {
      setIsLoading(true);
      const [corpData, membersData] = await Promise.all([
        corporationManager.getCorporation(user.corporationId),
        corporationManager.getCorporationMembers(user.corporationId)
      ]);

      setCorporation(corpData);

      // TODO: Load actual user profiles
      const membersWithProfiles: MemberWithProfile[] = membersData.map(member => ({
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
      console.error('Error loading agency info:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'owner': return <Crown size={16} />;
      case 'admin': return <Shield size={16} />;
      default: return <User size={16} />;
    }
  };

  if (isLoading) {
    return (
      <AgencyContainer>
        <div style={{ textAlign: 'center', padding: '2rem' }}>
          Loading agency information...
        </div>
      </AgencyContainer>
    );
  }

  if (!user.corporationId || !corporation) {
    return (
      <AgencyContainer>
        <NoAgencyCard>
          <NoAgencyIcon>🏢</NoAgencyIcon>
          <NoAgencyTitle>Join an Agency</NoAgencyTitle>
          <NoAgencyDescription>
            Connect with brands and agencies to collaborate on exciting content projects. 
            Join an agency to access exclusive opportunities and work with fellow creators.
          </NoAgencyDescription>
          <JoinButton>
            <UserPlus size={20} />
            Find Agencies
          </JoinButton>
        </NoAgencyCard>
      </AgencyContainer>
    );
  }

  const creatorMembers = members.filter(m => m.member.role === 'creator');
  const adminMembers = members.filter(m => m.member.role !== 'creator');

  return (
    <AgencyContainer>
      <AgencyHeader>
        <AgencyLogo>
          <Building2 size={40} />
        </AgencyLogo>
        <AgencyName>{corporation.displayName}</AgencyName>
        <AgencyDescription>
          {corporation.description || 'Building amazing content together'}
        </AgencyDescription>
        
        {corporation.socialMedia && (
          <SocialLinks>
            {corporation.socialMedia.instagram && (
              <SocialLink href={`https://instagram.com/${corporation.socialMedia.instagram.replace('@', '')}`} target="_blank">
                <Instagram size={16} />
                {corporation.socialMedia.instagram}
              </SocialLink>
            )}
            {corporation.socialMedia.tiktok && (
              <SocialLink href={`https://tiktok.com/${corporation.socialMedia.tiktok.replace('@', '')}`} target="_blank">
                <MessageSquare size={16} />
                {corporation.socialMedia.tiktok}
              </SocialLink>
            )}
            {corporation.socialMedia.twitter && (
              <SocialLink href={`https://twitter.com/${corporation.socialMedia.twitter.replace('@', '')}`} target="_blank">
                <Twitter size={16} />
                {corporation.socialMedia.twitter}
              </SocialLink>
            )}
            {corporation.website && (
              <SocialLink href={corporation.website} target="_blank">
                <Globe size={16} />
                Website
              </SocialLink>
            )}
          </SocialLinks>
        )}
      </AgencyHeader>

      <AgencyStats>
        <StatCard>
          <StatValue>{corporation.memberCount}</StatValue>
          <StatLabel>Total Members</StatLabel>
        </StatCard>
        <StatCard>
          <StatValue>{creatorMembers.length}</StatValue>
          <StatLabel>Creators</StatLabel>
        </StatCard>
        <StatCard>
          <StatValue>{adminMembers.length}</StatValue>
          <StatLabel>Managers</StatLabel>
        </StatCard>
        <StatCard>
          <StatValue>{corporation.industry}</StatValue>
          <StatLabel>Industry</StatLabel>
        </StatCard>
      </AgencyStats>

      {adminMembers.length > 0 && (
        <MembersSection>
          <SectionTitle>
            <Shield size={24} color={theme.colors.primary[500]} />
            Agency Management
          </SectionTitle>
          <MembersList>
            {adminMembers.map(({ member, profile }) => (
              <MemberCard key={member.userId}>
                <MemberHeader>
                  <MemberAvatar role={member.role}>
                    {profile.username.charAt(0).toUpperCase()}
                  </MemberAvatar>
                  <MemberInfo>
                    <MemberName>
                      {profile.username}
                      <RoleIcon role={member.role}>
                        {getRoleIcon(member.role)}
                      </RoleIcon>
                    </MemberName>
                    <MemberEmail>{profile.email}</MemberEmail>
                  </MemberInfo>
                </MemberHeader>
              </MemberCard>
            ))}
          </MembersList>
        </MembersSection>
      )}

      <MembersSection>
        <SectionTitle>
          <Users size={24} color={theme.colors.success.main} />
          Fellow Creators ({creatorMembers.length})
        </SectionTitle>
        <MembersList>
          {creatorMembers.map(({ member, profile }) => (
            <MemberCard key={member.userId}>
              <MemberHeader>
                <MemberAvatar role={member.role}>
                  {profile.username.charAt(0).toUpperCase()}
                </MemberAvatar>
                <MemberInfo>
                  <MemberName>
                    {profile.username}
                    {member.userId === user.id && (
                      <span style={{ 
                        fontSize: '0.75rem', 
                        background: theme.colors.primary[100],
                        color: theme.colors.primary[700],
                        padding: '0.25rem 0.5rem',
                        borderRadius: '4px',
                        fontWeight: '600'
                      }}>
                        You
                      </span>
                    )}
                  </MemberName>
                  <MemberEmail>{profile.email}</MemberEmail>
                </MemberInfo>
              </MemberHeader>
              
              {profile.socialHandles && (
                <MemberSocials>
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
                </MemberSocials>
              )}
            </MemberCard>
          ))}
        </MembersList>
      </MembersSection>
    </AgencyContainer>
  );
};