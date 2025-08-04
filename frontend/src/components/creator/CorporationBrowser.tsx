/**
 * CorporationBrowser - Browse and join public corporations
 * Allows creators to discover and join agencies without invite codes
 */

import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { 
  Building2, Users, Globe, Instagram, MessageSquare, 
  Twitter, ArrowLeft, Check, Clock, User, Search
} from 'lucide-react';
import { theme } from '../../styles/theme';
import { FirebaseCorporationManager } from '../../firebase/FirebaseCorporationManager';
import { Corporation, CreatorUser } from '../../types';

interface CorporationBrowserProps {
  user: CreatorUser;
  onBack: () => void;
  onJoinSuccess: () => void;
}

const BrowserContainer = styled.div`
  background: ${theme.colors.neutral[0]};
  border-radius: 16px;
  padding: 2rem;
  max-width: 1200px;
  margin: 0 auto;
`;

const BrowserHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 2rem;
  flex-wrap: wrap;
  gap: 1rem;
`;

const BackButton = styled.button`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background: ${theme.colors.neutral[100]};
  border: 1px solid ${theme.colors.neutral[300]};
  padding: 0.75rem 1rem;
  border-radius: 8px;
  cursor: pointer;
  transition: all ${theme.transitions.fast};
  color: ${theme.colors.neutral[700]};
  
  &:hover {
    background: ${theme.colors.neutral[200]};
  }
`;

const SearchBox = styled.div`
  position: relative;
  flex: 1;
  max-width: 400px;
`;

const SearchInput = styled.input`
  width: 100%;
  padding: 0.75rem 1rem 0.75rem 2.5rem;
  border: 2px solid ${theme.colors.neutral[200]};
  border-radius: 8px;
  font-size: 1rem;
  
  &:focus {
    outline: none;
    border-color: ${theme.colors.primary[400]};
  }
`;

const SearchIcon = styled.div`
  position: absolute;
  left: 0.75rem;
  top: 50%;
  transform: translateY(-50%);
  color: ${theme.colors.neutral[400]};
`;

const CorporationGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 1.5rem;
  margin-top: 2rem;
`;

const CorporationCard = styled.div`
  background: ${theme.colors.neutral[25]};
  border: 1px solid ${theme.colors.neutral[200]};
  border-radius: 12px;
  padding: 1.5rem;
  transition: all ${theme.transitions.fast};
  
  &:hover {
    border-color: ${theme.colors.primary[200]};
    transform: translateY(-2px);
    box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
  }
`;

const CorporationHeader = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 1rem;
  margin-bottom: 1rem;
`;

const CorporationLogo = styled.div`
  width: 56px;
  height: 56px;
  background: ${theme.colors.primary[500]};
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 1.5rem;
  flex-shrink: 0;
`;

const CorporationInfo = styled.div`
  flex: 1;
`;

const CorporationName = styled.h3`
  font-size: 1.25rem;
  font-weight: 700;
  color: ${theme.colors.neutral[900]};
  margin: 0 0 0.25rem 0;
`;

const CorporationIndustry = styled.div`
  font-size: 0.875rem;
  color: ${theme.colors.primary[600]};
  background: ${theme.colors.primary[50]};
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  display: inline-block;
  margin-bottom: 0.5rem;
`;

const CorporationDescription = styled.p`
  color: ${theme.colors.neutral[600]};
  font-size: 0.9rem;
  line-height: 1.5;
  margin: 0.75rem 0;
`;

const CorporationStats = styled.div`
  display: flex;
  gap: 1rem;
  margin: 1rem 0;
  font-size: 0.875rem;
`;

const StatItem = styled.div`
  display: flex;
  align-items: center;
  gap: 0.25rem;
  color: ${theme.colors.neutral[600]};
`;

const SocialLinks = styled.div`
  display: flex;
  gap: 0.5rem;
  margin: 1rem 0;
`;

const SocialLink = styled.div`
  display: flex;
  align-items: center;
  gap: 0.25rem;
  padding: 0.25rem 0.5rem;
  background: ${theme.colors.neutral[100]};
  border-radius: 6px;
  font-size: 0.75rem;
  color: ${theme.colors.neutral[700]};
`;

const JoinButton = styled.button<{ variant?: 'primary' | 'pending' }>`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 0.75rem 1rem;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: all ${theme.transitions.fast};
  border: none;
  margin-top: 1rem;
  
  ${props => props.variant === 'pending' ? `
    background: ${theme.colors.warning.light};
    color: ${theme.colors.warning.dark};
    cursor: not-allowed;
  ` : `
    background: ${theme.colors.primary[500]};
    color: white;
    
    &:hover:not(:disabled) {
      background: ${theme.colors.primary[600]};
      transform: translateY(-1px);
    }
  `}
  
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 3rem;
  color: ${theme.colors.neutral[500]};
`;

const RequiresApproval = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.8rem;
  color: ${theme.colors.warning.dark};
  background: ${theme.colors.warning.light};
  padding: 0.5rem;
  border-radius: 6px;
  margin-top: 0.5rem;
`;

export const CorporationBrowser: React.FC<CorporationBrowserProps> = ({
  user,
  onBack,
  onJoinSuccess
}) => {
  const [corporations, setCorporations] = useState<Corporation[]>([]);
  const [filteredCorporations, setFilteredCorporations] = useState<Corporation[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [joiningIds, setJoiningIds] = useState<Set<string>>(new Set());

  const corporationManager = FirebaseCorporationManager.getInstance();

  useEffect(() => {
    loadPublicCorporations();
  }, []);

  useEffect(() => {
    if (searchTerm.trim() === '') {
      setFilteredCorporations(corporations);
    } else {
      const filtered = corporations.filter(corp => 
        corp.displayName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (corp.industry && corp.industry.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (corp.description && corp.description.toLowerCase().includes(searchTerm.toLowerCase()))
      );
      setFilteredCorporations(filtered);
    }
  }, [searchTerm, corporations]);

  const loadPublicCorporations = async () => {
    try {
      setIsLoading(true);
      const publicCorps = await corporationManager.getPublicCorporations();
      setCorporations(publicCorps);
      setFilteredCorporations(publicCorps);
    } catch (error) {
      console.error('Failed to load public corporations:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleJoinCorporation = async (corporationId: string) => {
    try {
      setJoiningIds(prev => new Set(prev).add(corporationId));
      await corporationManager.joinPublicCorporation(user.id, corporationId);
      onJoinSuccess();
    } catch (error) {
      console.error('Failed to join corporation:', error);
      // Could add toast notification here
    } finally {
      setJoiningIds(prev => {
        const newSet = new Set(prev);
        newSet.delete(corporationId);
        return newSet;
      });
    }
  };

  if (isLoading) {
    return (
      <BrowserContainer>
        <EmptyState>Loading available agencies...</EmptyState>
      </BrowserContainer>
    );
  }

  return (
    <BrowserContainer>
      <BrowserHeader>
        <BackButton onClick={onBack}>
          <ArrowLeft size={16} />
          Back
        </BackButton>
        
        <SearchBox>
          <SearchIcon>
            <Search size={16} />
          </SearchIcon>
          <SearchInput
            type="text"
            placeholder="Search agencies by name or industry..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </SearchBox>
      </BrowserHeader>

      <div>
        <h2>Discover Agencies ({filteredCorporations.length})</h2>
        <p>Browse and join agencies that are open to new creators</p>
      </div>

      {filteredCorporations.length === 0 ? (
        <EmptyState>
          <Building2 size={48} style={{ marginBottom: '1rem' }} />
          <h3>No agencies found</h3>
          <p>Try adjusting your search or check back later for new opportunities.</p>
        </EmptyState>
      ) : (
        <CorporationGrid>
          {filteredCorporations.map((corp) => (
            <CorporationCard key={corp.id}>
              <CorporationHeader>
                <CorporationLogo>
                  <Building2 size={24} />
                </CorporationLogo>
                <CorporationInfo>
                  <CorporationName>{corp.displayName}</CorporationName>
                  <CorporationIndustry>{corp.industry || 'General'}</CorporationIndustry>
                </CorporationInfo>
              </CorporationHeader>

              <CorporationDescription>
                {corp.description || 'Building amazing content together'}
              </CorporationDescription>

              <CorporationStats>
                <StatItem>
                  <Users size={14} />
                  {corp.memberCount} creators
                </StatItem>
                {corp.activeInvites > 0 && (
                  <StatItem>
                    <User size={14} />
                    Actively recruiting
                  </StatItem>
                )}
              </CorporationStats>

              {corp.socialMedia && (
                <SocialLinks>
                  {corp.socialMedia.instagram && (
                    <SocialLink>
                      <Instagram size={12} />
                      {corp.socialMedia.instagram}
                    </SocialLink>
                  )}
                  {corp.socialMedia.tiktok && (
                    <SocialLink>
                      <MessageSquare size={12} />
                      {corp.socialMedia.tiktok}
                    </SocialLink>
                  )}
                  {corp.socialMedia.twitter && (
                    <SocialLink>
                      <Twitter size={12} />
                      {corp.socialMedia.twitter}
                    </SocialLink>
                  )}
                  {corp.website && (
                    <SocialLink>
                      <Globe size={12} />
                      Website
                    </SocialLink>
                  )}
                </SocialLinks>
              )}

              {corp.settings.requireApproval && (
                <RequiresApproval>
                  <Clock size={14} />
                  Requires approval to join
                </RequiresApproval>
              )}

              <JoinButton
                onClick={() => handleJoinCorporation(corp.id)}
                disabled={joiningIds.has(corp.id)}
                variant={corp.settings.requireApproval ? 'pending' : 'primary'}
              >
                {joiningIds.has(corp.id) ? (
                  <>
                    <div className="spinner" />
                    Joining...
                  </>
                ) : corp.settings.requireApproval ? (
                  <>
                    <Clock size={16} />
                    Request to Join
                  </>
                ) : (
                  <>
                    <Check size={16} />
                    Join Agency
                  </>
                )}
              </JoinButton>
            </CorporationCard>
          ))}
        </CorporationGrid>
      )}
    </BrowserContainer>
  );
};