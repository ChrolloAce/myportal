/**
 * UserManagement - Simple user management interface
 * Basic user listing and management features
 */

import React from 'react';
import styled from 'styled-components';
import { Users, UserPlus, Search, Filter } from 'lucide-react';
import { theme } from '../../styles/theme';

const Container = styled.div`
  background: ${theme.colors.neutral[0]};
  border-radius: ${theme.borderRadius.xl};
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  padding: ${theme.spacing[6]};
`;

const Header = styled.div`
  display: flex;
  justify-content: between;
  align-items: center;
  margin-bottom: ${theme.spacing[6]};
`;

const Title = styled.h2`
  font-size: ${theme.typography.fontSize.xl};
  font-weight: ${theme.typography.fontWeight.semibold};
  color: ${theme.colors.neutral[900]};
  display: flex;
  align-items: center;
  gap: ${theme.spacing[2]};
  
  svg {
    width: 24px;
    height: 24px;
    color: ${theme.colors.primary[500]};
  }
`;

const Controls = styled.div`
  display: flex;
  gap: ${theme.spacing[3]};
  align-items: center;
`;

const SearchBox = styled.div`
  position: relative;
  
  input {
    padding: ${theme.spacing[2]} ${theme.spacing[3]} ${theme.spacing[2]} ${theme.spacing[10]};
    border: 1px solid ${theme.colors.neutral[300]};
    border-radius: ${theme.borderRadius.md};
    font-size: ${theme.typography.fontSize.sm};
    width: 240px;
    
    &:focus {
      outline: none;
      border-color: ${theme.colors.primary[500]};
      box-shadow: 0 0 0 3px ${theme.colors.primary[100]};
    }
  }
  
  svg {
    position: absolute;
    left: ${theme.spacing[3]};
    top: 50%;
    transform: translateY(-50%);
    width: 16px;
    height: 16px;
    color: ${theme.colors.neutral[400]};
  }
`;

const ActionButton = styled.button`
  display: flex;
  align-items: center;
  gap: ${theme.spacing[2]};
  padding: ${theme.spacing[2]} ${theme.spacing[4]};
  border: 1px solid ${theme.colors.primary[300]};
  border-radius: ${theme.borderRadius.md};
  background: ${theme.colors.primary[500]};
  color: ${theme.colors.neutral[0]};
  font-size: ${theme.typography.fontSize.sm};
  font-weight: ${theme.typography.fontWeight.medium};
  cursor: pointer;
  transition: all ${theme.transitions.fast};
  
  &:hover {
    background: ${theme.colors.primary[600]};
  }
  
  svg {
    width: 16px;
    height: 16px;
  }
`;

const FilterButton = styled.button`
  display: flex;
  align-items: center;
  gap: ${theme.spacing[2]};
  padding: ${theme.spacing[2]} ${theme.spacing[3]};
  border: 1px solid ${theme.colors.neutral[300]};
  border-radius: ${theme.borderRadius.md};
  background: ${theme.colors.neutral[0]};
  color: ${theme.colors.neutral[700]};
  font-size: ${theme.typography.fontSize.sm};
  cursor: pointer;
  transition: all ${theme.transitions.fast};
  
  &:hover {
    background: ${theme.colors.neutral[50]};
  }
  
  svg {
    width: 16px;
    height: 16px;
  }
`;

const PlaceholderContent = styled.div`
  text-align: center;
  padding: ${theme.spacing[12]} ${theme.spacing[6]};
  color: ${theme.colors.neutral[500]};
`;

const PlaceholderIcon = styled.div`
  font-size: 48px;
  margin-bottom: ${theme.spacing[4]};
`;

const PlaceholderTitle = styled.h3`
  font-size: ${theme.typography.fontSize.lg};
  font-weight: ${theme.typography.fontWeight.semibold};
  color: ${theme.colors.neutral[700]};
  margin-bottom: ${theme.spacing[2]};
`;

const PlaceholderText = styled.p`
  font-size: ${theme.typography.fontSize.base};
  color: ${theme.colors.neutral[500]};
  max-width: 400px;
  margin: 0 auto;
`;

export const UserManagement: React.FC = () => {
  return (
    <Container>
      <Header>
        <Title>
          <Users />
          User Management
        </Title>
        
        <Controls>
          <SearchBox>
            <Search />
            <input
              type="text"
              placeholder="Search users..."
            />
          </SearchBox>
          
          <FilterButton>
            <Filter />
            Filter
          </FilterButton>
          
          <ActionButton>
            <UserPlus />
            Add User
          </ActionButton>
        </Controls>
      </Header>

      <PlaceholderContent>
        <PlaceholderIcon>👥</PlaceholderIcon>
        <PlaceholderTitle>User Management Coming Soon</PlaceholderTitle>
        <PlaceholderText>
          This section will allow you to manage creators and admin users, 
          view their activity, and configure user permissions.
        </PlaceholderText>
      </PlaceholderContent>
    </Container>
  );
};