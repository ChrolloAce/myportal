/**
 * DashboardHeader - Clean navigation header for creator dashboard
 * Shows user info and logout functionality
 */

import React from 'react';
import styled from 'styled-components';
import { theme } from '../../styles/theme';
import { Container, Button } from '../../styles/GlobalStyles';
import { CreatorUser } from '../../types';

interface DashboardHeaderProps {
  user: CreatorUser;
  onLogout: () => void;
}

const Header = styled.header`
  background: ${theme.colors.neutral[0]};
  border-bottom: 1px solid ${theme.colors.neutral[200]};
  padding: ${theme.spacing[4]} 0;
`;

const HeaderContent = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const Logo = styled.div`
  display: flex;
  align-items: center;
  gap: ${theme.spacing[3]};
`;

const LogoText = styled.h1`
  font-size: ${theme.typography.fontSize['2xl']};
  font-weight: ${theme.typography.fontWeight.bold};
  color: ${theme.colors.primary[600]};
`;

const LogoIcon = styled.span`
  font-size: ${theme.typography.fontSize['2xl']};
`;

const UserSection = styled.div`
  display: flex;
  align-items: center;
  gap: ${theme.spacing[4]};
`;

const UserInfo = styled.div`
  text-align: right;
`;

const UserName = styled.div`
  font-weight: ${theme.typography.fontWeight.semibold};
  color: ${theme.colors.neutral[800]};
  font-size: ${theme.typography.fontSize.base};
`;

const UserRole = styled.div`
  font-size: ${theme.typography.fontSize.sm};
  color: ${theme.colors.neutral[500]};
  text-transform: capitalize;
`;

const UserStats = styled.div`
  display: flex;
  gap: ${theme.spacing[4]};
  margin-top: ${theme.spacing[1]};
  
  @media (max-width: ${theme.breakpoints.sm}) {
    display: none;
  }
`;

const StatItem = styled.div`
  font-size: ${theme.typography.fontSize.xs};
  color: ${theme.colors.neutral[500]};
  
  span {
    font-weight: ${theme.typography.fontWeight.semibold};
    color: ${theme.colors.primary[600]};
  }
`;

const UserAvatar = styled.div`
  width: 40px;
  height: 40px;
  border-radius: ${theme.borderRadius.full};
  background: linear-gradient(135deg, ${theme.colors.primary[400]}, ${theme.colors.primary[600]});
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${theme.colors.neutral[0]};
  font-weight: ${theme.typography.fontWeight.semibold};
  font-size: ${theme.typography.fontSize.lg};
`;

export const DashboardHeader: React.FC<DashboardHeaderProps> = ({
  user,
  onLogout
}) => {
  const getInitials = (username: string): string => {
    return username
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const approvalRate = user.totalSubmissions > 0 
    ? Math.round((user.approvedSubmissions / user.totalSubmissions) * 100)
    : 0;

  return (
    <Header>
      <Container>
        <HeaderContent>
          <Logo>
            <LogoIcon>🎬</LogoIcon>
            <LogoText>Creator Hub</LogoText>
          </Logo>

          <UserSection>
            <UserInfo>
              <UserName>{user.username}</UserName>
              <UserRole>{user.role}</UserRole>
              <UserStats>
                <StatItem>
                  <span>{user.totalSubmissions}</span> submitted
                </StatItem>
                <StatItem>
                  <span>{user.approvedSubmissions}</span> approved
                </StatItem>
                <StatItem>
                  <span>{approvalRate}%</span> rate
                </StatItem>
              </UserStats>
            </UserInfo>
            
            <UserAvatar>
              {getInitials(user.username)}
            </UserAvatar>
            
            <Button 
              variant="secondary" 
              size="sm"
              onClick={onLogout}
            >
              Logout
            </Button>
          </UserSection>
        </HeaderContent>
      </Container>
    </Header>
  );
};