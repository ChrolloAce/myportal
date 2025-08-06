/**
 * UserManagement - Professional user management interface
 * Clean, modern user listing and management features
 */

import React from 'react';
import styled from 'styled-components';
import { Users, UserPlus, Search, Filter } from 'lucide-react';
import { professionalTheme } from '../../styles/professionalTheme';
import { Card, Button, Input } from '../../styles/ProfessionalStyles';

const Container = styled(Card)`
  padding: ${professionalTheme.spacing[8]};
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: ${professionalTheme.spacing[8]};
`;

const Title = styled.h2`
  font-size: ${professionalTheme.typography.fontSize.xl};
  font-weight: ${professionalTheme.typography.fontWeight.semibold};
  color: ${professionalTheme.colors.gray[900]};
  display: flex;
  align-items: center;
  gap: ${professionalTheme.spacing[3]};
  
  svg {
    width: 24px;
    height: 24px;
    color: ${professionalTheme.colors.primary[500]};
  }
`;

const Controls = styled.div`
  display: flex;
  gap: ${professionalTheme.spacing[3]};
  align-items: center;
`;

const SearchBox = styled.div`
  position: relative;
  
  svg {
    position: absolute;
    left: ${professionalTheme.spacing[3]};
    top: 50%;
    transform: translateY(-50%);
    width: 16px;
    height: 16px;
    color: ${professionalTheme.colors.gray[400]};
    z-index: 1;
  }
`;

const SearchInput = styled(Input)`
  padding-left: ${professionalTheme.spacing[10]};
  width: 280px;
`;

const ActionButton = styled(Button)`
  display: flex;
  align-items: center;
  gap: ${professionalTheme.spacing[2]};
  
  svg {
    width: 16px;
    height: 16px;
  }
`;

const FilterButton = styled(Button)`
  display: flex;
  align-items: center;
  gap: ${professionalTheme.spacing[2]};
  
  svg {
    width: 16px;
    height: 16px;
  }
`;

const PlaceholderContent = styled.div`
  text-align: center;
  padding: ${professionalTheme.spacing[16]} ${professionalTheme.spacing[8]};
  color: ${professionalTheme.colors.gray[500]};
`;

const PlaceholderIcon = styled.div`
  display: flex;
  justify-content: center;
  margin-bottom: ${professionalTheme.spacing[6]};
  
  svg {
    width: 64px;
    height: 64px;
    color: ${professionalTheme.colors.gray[300]};
  }
`;

const PlaceholderTitle = styled.h3`
  font-size: ${professionalTheme.typography.fontSize.xl};
  font-weight: ${professionalTheme.typography.fontWeight.semibold};
  color: ${professionalTheme.colors.gray[700]};
  margin-bottom: ${professionalTheme.spacing[3]};
`;

const PlaceholderText = styled.p`
  font-size: ${professionalTheme.typography.fontSize.base};
  color: ${professionalTheme.colors.gray[500]};
  max-width: 500px;
  margin: 0 auto;
  line-height: ${professionalTheme.typography.lineHeight.relaxed};
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
            <SearchInput
              type="text"
              placeholder="Search users..."
            />
          </SearchBox>
          
          <FilterButton variant="secondary">
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
        <PlaceholderIcon>
          <Users />
        </PlaceholderIcon>
        <PlaceholderTitle>User Management</PlaceholderTitle>
        <PlaceholderText>
          This section will allow you to manage creators and admin users, 
          view their activity, and configure user permissions. Advanced user 
          management features are coming soon.
        </PlaceholderText>
      </PlaceholderContent>
    </Container>
  );
};