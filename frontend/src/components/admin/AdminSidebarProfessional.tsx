/**
 * Professional AdminSidebar - Clean navigation for admin dashboard
 * Modern design with clear hierarchy and beautiful interactions
 */

import React from 'react';
import styled from 'styled-components';
import { professionalTheme } from '../../styles/professionalTheme';
import { Badge } from '../../styles/ProfessionalStyles';
import { 
  LayoutDashboard, 
  FileText, 
  BarChart3, 
  Users, 
  UserPlus,
  Settings,
  LogOut,
  Building2,
  Crown
} from 'lucide-react';
import { AdminUser } from '../../types';

interface AdminSidebarProps {
  user: AdminUser;
  currentView: string;
  onViewChange: (view: string) => void;
  onLogout: () => void;
}

const SidebarContainer = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  background: ${professionalTheme.colors.white};
`;

const SidebarHeader = styled.div`
  padding: ${professionalTheme.spacing[6]} ${professionalTheme.spacing[6]} ${professionalTheme.spacing[4]};
  border-bottom: 1px solid ${professionalTheme.borders.color.light};
`;

const Logo = styled.div`
  display: flex;
  align-items: center;
  gap: ${professionalTheme.spacing[3]};
  margin-bottom: ${professionalTheme.spacing[4]};
`;

const LogoIcon = styled.div`
  width: 32px;
  height: 32px;
  background: ${professionalTheme.colors.primary[500]};
  border-radius: ${professionalTheme.borderRadius.lg};
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${professionalTheme.colors.white};
`;

const LogoText = styled.h1`
  font-size: ${professionalTheme.typography.fontSize.xl};
  font-weight: ${professionalTheme.typography.fontWeight.bold};
  color: ${professionalTheme.colors.gray[900]};
`;

const UserInfo = styled.div`
  display: flex;
  align-items: center;
  gap: ${professionalTheme.spacing[3]};
  padding: ${professionalTheme.spacing[3]};
  background: ${professionalTheme.colors.gray[50]};
  border-radius: ${professionalTheme.borderRadius.lg};
  border: 1px solid ${professionalTheme.borders.color.light};
`;

const UserAvatar = styled.div`
  width: 40px;
  height: 40px;
  background: ${professionalTheme.colors.primary[100]};
  border-radius: ${professionalTheme.borderRadius.full};
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${professionalTheme.colors.primary[600]};
  font-weight: ${professionalTheme.typography.fontWeight.semibold};
  font-size: ${professionalTheme.typography.fontSize.sm};
`;

const UserDetails = styled.div`
  flex: 1;
  min-width: 0;
`;

const UserName = styled.div`
  font-size: ${professionalTheme.typography.fontSize.sm};
  font-weight: ${professionalTheme.typography.fontWeight.semibold};
  color: ${professionalTheme.colors.gray[900]};
  margin-bottom: ${professionalTheme.spacing[0.5]};
  truncate: ellipsis;
  overflow: hidden;
  white-space: nowrap;
`;

const UserRole = styled.div`
  display: flex;
  align-items: center;
  gap: ${professionalTheme.spacing[1]};
`;

const SidebarNav = styled.nav`
  flex: 1;
  padding: ${professionalTheme.spacing[4]} ${professionalTheme.spacing[2]};
  overflow-y: auto;
`;

const NavSection = styled.div`
  margin-bottom: ${professionalTheme.spacing[6]};
  
  &:last-child {
    margin-bottom: 0;
  }
`;

const NavSectionTitle = styled.h6`
  font-size: ${professionalTheme.typography.fontSize.xs};
  font-weight: ${professionalTheme.typography.fontWeight.semibold};
  color: ${professionalTheme.colors.gray[500]};
  text-transform: uppercase;
  letter-spacing: ${professionalTheme.typography.letterSpacing.wide};
  margin-bottom: ${professionalTheme.spacing[3]};
  padding: 0 ${professionalTheme.spacing[4]};
`;

const NavItem = styled.button<{ isActive?: boolean }>`
  width: 100%;
  display: flex;
  align-items: center;
  gap: ${professionalTheme.spacing[3]};
  padding: ${professionalTheme.spacing[3]} ${professionalTheme.spacing[4]};
  border-radius: ${professionalTheme.borderRadius.md};
  background: none;
  border: none;
  cursor: pointer;
  transition: ${professionalTheme.transitions.all};
  text-align: left;
  margin-bottom: ${professionalTheme.spacing[1]};
  
  ${({ isActive }) => isActive ? `
    background: ${professionalTheme.colors.primary[50]};
    color: ${professionalTheme.colors.primary[700]};
    font-weight: ${professionalTheme.typography.fontWeight.semibold};
    
    svg {
      color: ${professionalTheme.colors.primary[600]};
    }
  ` : `
    color: ${professionalTheme.colors.gray[700]};
    
    &:hover {
      background: ${professionalTheme.colors.gray[50]};
      color: ${professionalTheme.colors.gray[900]};
    }
    
    svg {
      color: ${professionalTheme.colors.gray[500]};
    }
  `}
  
  &:focus-visible {
    outline: 2px solid ${professionalTheme.colors.primary[500]};
    outline-offset: -2px;
  }
`;

const NavItemIcon = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 20px;
  height: 20px;
`;

const NavItemText = styled.span`
  flex: 1;
  font-size: ${professionalTheme.typography.fontSize.sm};
  font-weight: inherit;
`;

const SidebarFooter = styled.div`
  padding: ${professionalTheme.spacing[4]} ${professionalTheme.spacing[6]};
  border-top: 1px solid ${professionalTheme.borders.color.light};
`;

const LogoutButton = styled.button`
  width: 100%;
  display: flex;
  align-items: center;
  gap: ${professionalTheme.spacing[3]};
  padding: ${professionalTheme.spacing[3]} ${professionalTheme.spacing[4]};
  border-radius: ${professionalTheme.borderRadius.md};
  background: none;
  border: none;
  cursor: pointer;
  transition: ${professionalTheme.transitions.all};
  color: ${professionalTheme.colors.gray[600]};
  font-size: ${professionalTheme.typography.fontSize.sm};
  
  &:hover {
    background: ${professionalTheme.colors.error[50]};
    color: ${professionalTheme.colors.error[700]};
    
    svg {
      color: ${professionalTheme.colors.error[600]};
    }
  }
  
  &:focus-visible {
    outline: 2px solid ${professionalTheme.colors.primary[500]};
    outline-offset: -2px;
  }
  
  svg {
    color: ${professionalTheme.colors.gray[500]};
    transition: ${professionalTheme.transitions.colors};
  }
`;

export const AdminSidebar: React.FC<AdminSidebarProps> = ({
  user,
  currentView,
  onViewChange,
  onLogout
}) => {
  const navigation = [
    {
      section: 'Overview',
      items: [
        { id: 'overview', label: 'Dashboard', icon: LayoutDashboard },
        { id: 'submissions', label: 'Submissions', icon: FileText },
        { id: 'statistics', label: 'Analytics', icon: BarChart3 },
      ]
    },
    {
      section: 'Management',
      items: [
        { id: 'members', label: 'Team Members', icon: Users },
        { id: 'invites', label: 'Invitations', icon: UserPlus },
        { id: 'users', label: 'User Management', icon: Users },
      ]
    },
    {
      section: 'Configuration',
      items: [
        { id: 'settings', label: 'Settings', icon: Settings },
      ]
    }
  ];

  const getUserInitials = (username: string): string => {
    return username
      .split(' ')
      .map(word => word.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <SidebarContainer>
      <SidebarHeader>
        <Logo>
          <LogoIcon>
            <Building2 size={20} />
          </LogoIcon>
          <LogoText>Portal</LogoText>
        </Logo>

        <UserInfo>
          <UserAvatar>
            {getUserInitials(user.username)}
          </UserAvatar>
          <UserDetails>
            <UserName title={user.username}>{user.username}</UserName>
            <UserRole>
              <Crown size={12} />
              <Badge variant="info" size="sm">Admin</Badge>
            </UserRole>
          </UserDetails>
        </UserInfo>
      </SidebarHeader>

      <SidebarNav>
        {navigation.map((section) => (
          <NavSection key={section.section}>
            <NavSectionTitle>{section.section}</NavSectionTitle>
            {section.items.map((item) => {
              const IconComponent = item.icon;
              return (
                <NavItem
                  key={item.id}
                  isActive={currentView === item.id}
                  onClick={() => onViewChange(item.id)}
                  type="button"
                >
                  <NavItemIcon>
                    <IconComponent size={20} />
                  </NavItemIcon>
                  <NavItemText>{item.label}</NavItemText>
                </NavItem>
              );
            })}
          </NavSection>
        ))}
      </SidebarNav>

      <SidebarFooter>
        <LogoutButton onClick={onLogout} type="button">
          <LogOut size={20} />
          Sign Out
        </LogoutButton>
      </SidebarFooter>
    </SidebarContainer>
  );
};