/**
 * AdminSidebar - Blue sidebar navigation for admin dashboard
 * Clean, modern design with navigation items and user profile
 */

import React from 'react';
import styled from 'styled-components';
import { BarChart3, Users, FileText, Settings, LogOut, Home } from 'lucide-react';
import { theme } from '../../styles/theme';
import { AdminUser } from '../../types';

interface AdminSidebarProps {
  user: AdminUser;
  currentView: string;
  onViewChange: (view: any) => void;
  onLogout: () => void;
}

const SidebarContainer = styled.div`
  position: fixed;
  left: 0;
  top: 0;
  width: 280px;
  height: 100vh;
  background: linear-gradient(180deg, #1e40af 0%, #1d4ed8 100%);
  padding: ${theme.spacing[6]} ${theme.spacing[4]};
  display: flex;
  flex-direction: column;
  z-index: 1000;
  
  @media (max-width: 768px) {
    transform: translateX(-100%);
    transition: transform 0.3s ease;
    
    &.open {
      transform: translateX(0);
    }
  }
`;

const Logo = styled.div`
  color: ${theme.colors.neutral[0]};
  font-size: ${theme.typography.fontSize['2xl']};
  font-weight: ${theme.typography.fontWeight.bold};
  margin-bottom: ${theme.spacing[8]};
  text-align: center;
`;

const Navigation = styled.nav`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: ${theme.spacing[2]};
`;

const NavItem = styled.button<{ active?: boolean }>`
  display: flex;
  align-items: center;
  gap: ${theme.spacing[3]};
  width: 100%;
  padding: ${theme.spacing[3]} ${theme.spacing[4]};
  border-radius: ${theme.borderRadius.lg};
  background: ${({ active }) => active ? 'rgba(255, 255, 255, 0.2)' : 'transparent'};
  color: ${({ active }) => active ? theme.colors.neutral[0] : 'rgba(255, 255, 255, 0.8)'};
  border: none;
  font-size: ${theme.typography.fontSize.base};
  font-weight: ${({ active }) => active ? theme.typography.fontWeight.semibold : theme.typography.fontWeight.medium};
  cursor: pointer;
  transition: all ${theme.transitions.fast};
  text-align: left;
  
  &:hover {
    background: rgba(255, 255, 255, 0.15);
    color: ${theme.colors.neutral[0]};
  }
  
  svg {
    width: 20px;
    height: 20px;
  }
`;

const UserSection = styled.div`
  border-top: 1px solid rgba(255, 255, 255, 0.2);
  padding-top: ${theme.spacing[4]};
  margin-top: ${theme.spacing[4]};
`;

const UserInfo = styled.div`
  display: flex;
  align-items: center;
  gap: ${theme.spacing[3]};
  padding: ${theme.spacing[3]};
  margin-bottom: ${theme.spacing[3]};
`;

const UserAvatar = styled.div`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.2);
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${theme.colors.neutral[0]};
  font-weight: ${theme.typography.fontWeight.semibold};
  font-size: ${theme.typography.fontSize.sm};
`;

const UserDetails = styled.div`
  flex: 1;
`;

const UserName = styled.div`
  color: ${theme.colors.neutral[0]};
  font-weight: ${theme.typography.fontWeight.semibold};
  font-size: ${theme.typography.fontSize.sm};
`;

const UserRole = styled.div`
  color: rgba(255, 255, 255, 0.7);
  font-size: ${theme.typography.fontSize.xs};
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;

const LogoutButton = styled.button`
  display: flex;
  align-items: center;
  gap: ${theme.spacing[3]};
  width: 100%;
  padding: ${theme.spacing[3]} ${theme.spacing[4]};
  border-radius: ${theme.borderRadius.lg};
  background: rgba(255, 255, 255, 0.1);
  color: rgba(255, 255, 255, 0.8);
  border: none;
  font-size: ${theme.typography.fontSize.sm};
  font-weight: ${theme.typography.fontWeight.medium};
  cursor: pointer;
  transition: all ${theme.transitions.fast};
  
  &:hover {
    background: rgba(255, 255, 255, 0.2);
    color: ${theme.colors.neutral[0]};
  }
  
  svg {
    width: 16px;
    height: 16px;
  }
`;

export const AdminSidebar: React.FC<AdminSidebarProps> = ({
  user,
  currentView,
  onViewChange,
  onLogout
}) => {
  const navigationItems = [
    {
      id: 'overview',
      label: 'Dashboard',
      icon: Home
    },
    {
      id: 'submissions',
      label: 'Submissions',
      icon: FileText
    },
    {
      id: 'statistics',
      label: 'Analytics',
      icon: BarChart3
    },
    {
      id: 'users',
      label: 'Users',
      icon: Users
    },
    {
      id: 'settings',
      label: 'Settings',
      icon: Settings
    }
  ];

  const getUserInitials = (name: string): string => {
    return name
      .split(' ')
      .map(word => word.charAt(0))
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };

  return (
    <SidebarContainer>
      <Logo>
        🎬 VideoPortal
      </Logo>

      <Navigation>
        {navigationItems.map((item) => {
          const IconComponent = item.icon;
          return (
            <NavItem
              key={item.id}
              active={currentView === item.id}
              onClick={() => onViewChange(item.id)}
            >
              <IconComponent />
              {item.label}
            </NavItem>
          );
        })}
      </Navigation>

      <UserSection>
        <UserInfo>
          <UserAvatar>
            {getUserInitials(user.username)}
          </UserAvatar>
          <UserDetails>
            <UserName>{user.username}</UserName>
            <UserRole>Administrator</UserRole>
          </UserDetails>
        </UserInfo>

        <LogoutButton onClick={onLogout}>
          <LogOut />
          Logout
        </LogoutButton>
      </UserSection>
    </SidebarContainer>
  );
};