/**
 * Professional UserManagement - Beautiful user management interface
 * Matches the professional analytics style with modern user cards
 */

import React, { useState } from 'react';
import styled from 'styled-components';
import { professionalTheme } from '../../styles/professionalTheme';
import { Card, Button } from '../../styles/ProfessionalStyles';
import { 
  Users, 
  UserPlus, 
  Search, 
  MoreHorizontal,
  Mail,
  Calendar,
  Shield,
  Crown,
  User,
  Edit,
  Trash2,
  Settings
} from 'lucide-react';

interface User {
  id: string;
  username: string;
  email: string;
  role: 'creator' | 'admin';
  joinedAt: string;
  isActive: boolean;
  profilePicture?: string;
  corporationId?: string;
}

interface UserManagementProps {
  users?: User[];
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
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: ${professionalTheme.spacing[4]};
  margin-bottom: ${professionalTheme.spacing[6]};
`;

const StatCard = styled(Card)<{ gradient: string }>`
  padding: ${professionalTheme.spacing[5]};
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
    width: 60px;
    height: 60px;
    background: rgba(255, 255, 255, 0.1);
    border-radius: 50%;
    transform: translate(20px, -20px);
  }
`;

const StatIcon = styled.div`
  width: 48px;
  height: 48px;
  margin: 0 auto ${professionalTheme.spacing[3]};
  background: rgba(255, 255, 255, 0.2);
  color: ${professionalTheme.colors.white};
  border-radius: ${professionalTheme.borderRadius.lg};
  display: flex;
  align-items: center;
  justify-content: center;
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.3);
`;

const StatValue = styled.div`
  font-size: ${professionalTheme.typography.fontSize.xl};
  font-weight: ${professionalTheme.typography.fontWeight.bold};
  color: ${professionalTheme.colors.white};
  margin-bottom: ${professionalTheme.spacing[1]};
`;

const StatLabel = styled.div`
  font-size: ${professionalTheme.typography.fontSize.sm};
  color: rgba(255, 255, 255, 0.9);
  font-weight: ${professionalTheme.typography.fontWeight.medium};
`;

const FiltersRow = styled.div`
  display: flex;
  gap: ${professionalTheme.spacing[4]};
  margin-bottom: ${professionalTheme.spacing[6]};
  flex-wrap: wrap;
`;

const SearchBox = styled.div`
  position: relative;
  flex: 1;
  min-width: 300px;
  
  input {
    width: 100%;
    padding: ${professionalTheme.spacing[3]} ${professionalTheme.spacing[3]} ${professionalTheme.spacing[3]} ${professionalTheme.spacing[10]};
    border: 1px solid ${professionalTheme.colors.gray[300]};
    border-radius: ${professionalTheme.borderRadius.lg};
    font-size: ${professionalTheme.typography.fontSize.sm};
    background: ${professionalTheme.colors.white};
    transition: all 0.2s ease;
    
    &:focus {
      outline: none;
      border-color: ${professionalTheme.colors.primary[500]};
      box-shadow: 0 0 0 3px ${professionalTheme.colors.primary[100]};
    }
    
    &::placeholder {
      color: ${professionalTheme.colors.gray[500]};
    }
  }
  
  svg {
    position: absolute;
    left: ${professionalTheme.spacing[3]};
    top: 50%;
    transform: translateY(-50%);
    color: ${professionalTheme.colors.gray[400]};
  }
`;

const FilterSelect = styled.select`
  padding: ${professionalTheme.spacing[3]};
  border: 1px solid ${professionalTheme.colors.gray[300]};
  border-radius: ${professionalTheme.borderRadius.lg};
  font-size: ${professionalTheme.typography.fontSize.sm};
  background: ${professionalTheme.colors.white};
  color: ${professionalTheme.colors.gray[700]};
  min-width: 120px;
  
  &:focus {
    outline: none;
    border-color: ${professionalTheme.colors.primary[500]};
    box-shadow: 0 0 0 3px ${professionalTheme.colors.primary[100]};
  }
`;

const UsersGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
  gap: ${professionalTheme.spacing[6]};
`;

const UserCard = styled(Card)`
  padding: ${professionalTheme.spacing[6]};
  transition: all 0.3s ease;
  
  &:hover {
    transform: translateY(-4px);
    box-shadow: ${professionalTheme.shadows.cardHover};
  }
`;

const UserHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: ${professionalTheme.spacing[4]};
`;

const UserInfo = styled.div`
  display: flex;
  gap: ${professionalTheme.spacing[3]};
  flex: 1;
`;

const UserAvatar = styled.div`
  width: 56px;
  height: 56px;
  border-radius: ${professionalTheme.borderRadius.full};
  background: ${professionalTheme.colors.gray[100]};
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  
  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;

const UserDetails = styled.div`
  flex: 1;
`;

const UserName = styled.h3`
  font-size: ${professionalTheme.typography.fontSize.lg};
  font-weight: ${professionalTheme.typography.fontWeight.semibold};
  color: ${professionalTheme.colors.gray[900]};
  margin: 0 0 ${professionalTheme.spacing[1]} 0;
`;

const UserEmail = styled.div`
  font-size: ${professionalTheme.typography.fontSize.sm};
  color: ${professionalTheme.colors.gray[600]};
  margin-bottom: ${professionalTheme.spacing[2]};
  display: flex;
  align-items: center;
  gap: ${professionalTheme.spacing[2]};
`;

const UserMeta = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: ${professionalTheme.spacing[3]};
  font-size: ${professionalTheme.typography.fontSize.xs};
  color: ${professionalTheme.colors.gray[600]};
  margin-bottom: ${professionalTheme.spacing[4]};
`;

const RoleBadge = styled.div<{ role: string }>`
  display: inline-flex;
  align-items: center;
  gap: ${professionalTheme.spacing[1]};
  padding: ${professionalTheme.spacing[1]} ${professionalTheme.spacing[2]};
  border-radius: ${professionalTheme.borderRadius.full};
  font-size: ${professionalTheme.typography.fontSize.xs};
  font-weight: ${professionalTheme.typography.fontWeight.medium};
  
  ${props => {
    switch (props.role) {
      case 'admin':
        return `
          background: ${professionalTheme.colors.primary[100]};
          color: ${professionalTheme.colors.primary[700]};
        `;
      case 'creator':
        return `
          background: ${professionalTheme.colors.success[100]};
          color: ${professionalTheme.colors.success[700]};
        `;
      default:
        return `
          background: ${professionalTheme.colors.gray[100]};
          color: ${professionalTheme.colors.gray[700]};
        `;
    }
  }}
`;

const StatusBadge = styled.div<{ isActive: boolean }>`
  display: inline-flex;
  align-items: center;
  gap: ${professionalTheme.spacing[1]};
  padding: ${professionalTheme.spacing[1]} ${professionalTheme.spacing[2]};
  border-radius: ${professionalTheme.borderRadius.full};
  font-size: ${professionalTheme.typography.fontSize.xs};
  font-weight: ${professionalTheme.typography.fontWeight.medium};
  
  ${props => props.isActive ? `
    background: ${professionalTheme.colors.success[100]};
    color: ${professionalTheme.colors.success[700]};
  ` : `
    background: ${professionalTheme.colors.gray[100]};
    color: ${professionalTheme.colors.gray[700]};
  `}
`;

const UserActions = styled.div`
  display: flex;
  gap: ${professionalTheme.spacing[2]};
`;

const ActionButton = styled.button`
  padding: ${professionalTheme.spacing[2]};
  border: 1px solid ${professionalTheme.colors.gray[300]};
  border-radius: ${professionalTheme.borderRadius.md};
  background: ${professionalTheme.colors.white};
  color: ${professionalTheme.colors.gray[600]};
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  
  &:hover {
    background: ${professionalTheme.colors.gray[50]};
    border-color: ${professionalTheme.colors.gray[400]};
  }
`;

const EmptyState = styled.div`
  text-align: center;
  padding: ${professionalTheme.spacing[12]} ${professionalTheme.spacing[6]};
  color: ${professionalTheme.colors.gray[600]};
  grid-column: 1 / -1;
`;

const EmptyIcon = styled.div`
  margin-bottom: ${professionalTheme.spacing[4]};
  color: ${professionalTheme.colors.gray[400]};
`;

// Mock data for demonstration
const mockUsers: User[] = [
  {
    id: '1',
    username: 'john_creator',
    email: 'john@example.com',
    role: 'creator',
    joinedAt: '2024-01-15',
    isActive: true,
    corporationId: 'corp1'
  },
  {
    id: '2',
    username: 'sarah_admin',
    email: 'sarah@example.com',
    role: 'admin',
    joinedAt: '2024-01-10',
    isActive: true,
    corporationId: 'corp1'
  },
  {
    id: '3',
    username: 'mike_creator',
    email: 'mike@example.com',
    role: 'creator',
    joinedAt: '2024-01-20',
    isActive: false,
    corporationId: 'corp1'
  }
];

export const UserManagement: React.FC<UserManagementProps> = ({ users = mockUsers }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState<'all' | 'creator' | 'admin'>('all');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'inactive'>('all');

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = roleFilter === 'all' || user.role === roleFilter;
    const matchesStatus = statusFilter === 'all' || 
                         (statusFilter === 'active' && user.isActive) ||
                         (statusFilter === 'inactive' && !user.isActive);
    
    return matchesSearch && matchesRole && matchesStatus;
  });

  const totalUsers = users.length;
  const activeUsers = users.filter(u => u.isActive).length;
  const adminUsers = users.filter(u => u.role === 'admin').length;
  const creatorUsers = users.filter(u => u.role === 'creator').length;

  return (
    <DashboardLayout>
      {/* Header */}
      <HeaderSection>
        <HeaderContent>
          <HeaderTitle>User Management</HeaderTitle>
          <HeaderSubtitle>Manage team members and their permissions</HeaderSubtitle>
        </HeaderContent>
        <Button variant="primary">
          <UserPlus size={16} />
          Add User
        </Button>
      </HeaderSection>

      {/* Stats */}
      <StatsGrid>
        <StatCard gradient={`linear-gradient(135deg, ${professionalTheme.colors.primary[500]} 0%, ${professionalTheme.colors.primary[600]} 100%)`}>
          <StatIcon>
            <Users size={20} />
          </StatIcon>
          <StatValue>{totalUsers}</StatValue>
          <StatLabel>Total Users</StatLabel>
        </StatCard>

        <StatCard gradient={`linear-gradient(135deg, ${professionalTheme.colors.success[500]} 0%, ${professionalTheme.colors.success[600]} 100%)`}>
          <StatIcon>
            <User size={20} />
          </StatIcon>
          <StatValue>{activeUsers}</StatValue>
          <StatLabel>Active Users</StatLabel>
        </StatCard>

        <StatCard gradient={`linear-gradient(135deg, ${professionalTheme.colors.brand.purple} 0%, ${professionalTheme.colors.brand.indigo} 100%)`}>
          <StatIcon>
            <Crown size={20} />
          </StatIcon>
          <StatValue>{adminUsers}</StatValue>
          <StatLabel>Admins</StatLabel>
        </StatCard>

        <StatCard gradient={`linear-gradient(135deg, ${professionalTheme.colors.warning[500]} 0%, ${professionalTheme.colors.warning[600]} 100%)`}>
          <StatIcon>
            <Shield size={20} />
          </StatIcon>
          <StatValue>{creatorUsers}</StatValue>
          <StatLabel>Creators</StatLabel>
        </StatCard>
      </StatsGrid>

      {/* Filters */}
      <FiltersRow>
        <SearchBox>
          <Search size={16} />
          <input
            type="text"
            placeholder="Search users..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </SearchBox>
        
        <FilterSelect
          value={roleFilter}
          onChange={(e) => setRoleFilter(e.target.value as 'all' | 'creator' | 'admin')}
        >
          <option value="all">All Roles</option>
          <option value="creator">Creators</option>
          <option value="admin">Admins</option>
        </FilterSelect>
        
        <FilterSelect
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value as 'all' | 'active' | 'inactive')}
        >
          <option value="all">All Status</option>
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
        </FilterSelect>
      </FiltersRow>

      {/* Users Grid */}
      <UsersGrid>
        {filteredUsers.length === 0 ? (
          <EmptyState>
            <EmptyIcon>
              <Users size={48} />
            </EmptyIcon>
            <p>No users found</p>
          </EmptyState>
        ) : (
          filteredUsers.map((user) => (
            <UserCard key={user.id}>
              <UserHeader>
                <UserInfo>
                  <UserAvatar>
                    {user.profilePicture ? (
                      <img src={user.profilePicture} alt={user.username} />
                    ) : (
                      <User size={24} color={professionalTheme.colors.gray[500]} />
                    )}
                  </UserAvatar>
                  <UserDetails>
                    <UserName>{user.username}</UserName>
                    <UserEmail>
                      <Mail size={14} />
                      {user.email}
                    </UserEmail>
                  </UserDetails>
                </UserInfo>
                <ActionButton>
                  <MoreHorizontal size={16} />
                </ActionButton>
              </UserHeader>

              <UserMeta>
                <div style={{ display: 'flex', alignItems: 'center', gap: professionalTheme.spacing[1] }}>
                  <Calendar size={12} />
                  Joined {new Date(user.joinedAt).toLocaleDateString()}
                </div>
              </UserMeta>

              <div style={{ display: 'flex', gap: professionalTheme.spacing[2], marginBottom: professionalTheme.spacing[4] }}>
                <RoleBadge role={user.role}>
                  {user.role === 'admin' ? <Crown size={12} /> : <Shield size={12} />}
                  {user.role}
                </RoleBadge>
                <StatusBadge isActive={user.isActive}>
                  {user.isActive ? 'Active' : 'Inactive'}
                </StatusBadge>
              </div>

              <UserActions>
                <ActionButton title="Edit User">
                  <Edit size={14} />
                </ActionButton>
                <ActionButton title="Settings">
                  <Settings size={14} />
                </ActionButton>
                <ActionButton title="Remove User">
                  <Trash2 size={14} />
                </ActionButton>
              </UserActions>
            </UserCard>
          ))
        )}
      </UsersGrid>
    </DashboardLayout>
  );
};