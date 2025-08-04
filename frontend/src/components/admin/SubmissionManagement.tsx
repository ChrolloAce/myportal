/**
 * SubmissionManagement - Clean table interface for managing video submissions
 * Professional design with status badges and action buttons
 */

import React, { useState } from 'react';
import styled from 'styled-components';
import { ExternalLink, Check, X, Filter, Search } from 'lucide-react';
import { theme } from '../../styles/theme';
import { VideoSubmission, SubmissionStatus, Platform } from '../../types';
import { FirebaseSubmissionManager } from '../../firebase/FirebaseSubmissionManager';

interface SubmissionManagementProps {
  submissions: VideoSubmission[];
  onSubmissionUpdate: () => void;
}

const Container = styled.div`
  background: ${theme.colors.neutral[0]};
  border-radius: ${theme.borderRadius.xl};
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  overflow: hidden;
`;

const TableHeader = styled.div`
  padding: ${theme.spacing[6]};
  border-bottom: 1px solid ${theme.colors.neutral[200]};
  display: flex;
  justify-content: between;
  align-items: center;
  gap: ${theme.spacing[4]};
`;

const HeaderLeft = styled.div`
  flex: 1;
`;

const TableTitle = styled.h2`
  font-size: ${theme.typography.fontSize.xl};
  font-weight: ${theme.typography.fontWeight.semibold};
  color: ${theme.colors.neutral[900]};
  margin-bottom: ${theme.spacing[1]};
`;

const TableSubtitle = styled.p`
  color: ${theme.colors.neutral[600]};
  font-size: ${theme.typography.fontSize.sm};
`;

const HeaderControls = styled.div`
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
    border-color: ${theme.colors.neutral[400]};
  }
  
  svg {
    width: 16px;
    height: 16px;
  }
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
`;

const TableHead = styled.thead`
  background: ${theme.colors.neutral[50]};
`;

const TableRow = styled.tr`
  border-bottom: 1px solid ${theme.colors.neutral[200]};
  
  &:hover {
    background: ${theme.colors.neutral[25]};
  }
`;

const TableHeaderCell = styled.th`
  padding: ${theme.spacing[4]} ${theme.spacing[6]};
  text-align: left;
  font-size: ${theme.typography.fontSize.sm};
  font-weight: ${theme.typography.fontWeight.semibold};
  color: ${theme.colors.neutral[700]};
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;

const TableCell = styled.td`
  padding: ${theme.spacing[4]} ${theme.spacing[6]};
  font-size: ${theme.typography.fontSize.sm};
  color: ${theme.colors.neutral[800]};
  vertical-align: middle;
`;

const UserInfo = styled.div`
  display: flex;
  align-items: center;
  gap: ${theme.spacing[3]};
`;

const UserAvatar = styled.div<{ platform: Platform }>`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: ${({ platform }) => 
    platform === Platform.TIKTOK 
      ? 'linear-gradient(45deg, #ff0050, #00f2ea)' 
      : 'linear-gradient(45deg, #833ab4, #fd1d1d, #fcb045)'
  };
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${theme.colors.neutral[0]};
  font-weight: ${theme.typography.fontWeight.semibold};
  font-size: ${theme.typography.fontSize.sm};
`;

const UserDetails = styled.div``;

const UserName = styled.div`
  font-weight: ${theme.typography.fontWeight.medium};
  color: ${theme.colors.neutral[900]};
`;

const UserEmail = styled.div`
  font-size: ${theme.typography.fontSize.xs};
  color: ${theme.colors.neutral[500]};
`;

const StatusBadge = styled.span<{ status: SubmissionStatus }>`
  display: inline-flex;
  align-items: center;
  padding: ${theme.spacing[1]} ${theme.spacing[3]};
  border-radius: ${theme.borderRadius.full};
  font-size: ${theme.typography.fontSize.xs};
  font-weight: ${theme.typography.fontWeight.semibold};
  text-transform: uppercase;
  letter-spacing: 0.5px;
  
  ${({ status }) => {
    switch (status) {
      case SubmissionStatus.PENDING:
        return `
          background: ${theme.colors.warning.light};
          color: ${theme.colors.warning.dark};
        `;
      case SubmissionStatus.APPROVED:
        return `
          background: ${theme.colors.success.light};
          color: ${theme.colors.success.dark};
        `;
      case SubmissionStatus.REJECTED:
        return `
          background: ${theme.colors.error.light};
          color: ${theme.colors.error.dark};
        `;
      default:
        return `
          background: ${theme.colors.neutral[200]};
          color: ${theme.colors.neutral[700]};
        `;
    }
  }}
`;

const PlatformBadge = styled.span<{ platform: Platform }>`
  display: inline-flex;
  align-items: center;
  padding: ${theme.spacing[1]} ${theme.spacing[2]};
  border-radius: ${theme.borderRadius.md};
  font-size: ${theme.typography.fontSize.xs};
  font-weight: ${theme.typography.fontWeight.medium};
  
  ${({ platform }) => {
    switch (platform) {
      case Platform.TIKTOK:
        return `
          background: rgba(255, 0, 80, 0.1);
          color: #ff0050;
        `;
      case Platform.INSTAGRAM:
        return `
          background: rgba(131, 58, 180, 0.1);
          color: #833ab4;
        `;
      default:
        return `
          background: ${theme.colors.neutral[200]};
          color: ${theme.colors.neutral[700]};
        `;
    }
  }}
`;

const ActionButtons = styled.div`
  display: flex;
  gap: ${theme.spacing[2]};
`;

const ActionButton = styled.button<{ variant?: 'approve' | 'reject' | 'view' }>`
  padding: ${theme.spacing[2]};
  border-radius: ${theme.borderRadius.md};
  border: none;
  cursor: pointer;
  transition: all ${theme.transitions.fast};
  display: flex;
  align-items: center;
  justify-content: center;
  
  ${({ variant }) => {
    switch (variant) {
      case 'approve':
        return `
          background: ${theme.colors.success.main};
          color: ${theme.colors.neutral[0]};
          &:hover {
            background: ${theme.colors.success.dark};
          }
        `;
      case 'reject':
        return `
          background: ${theme.colors.error.main};
          color: ${theme.colors.neutral[0]};
          &:hover {
            background: ${theme.colors.error.dark};
          }
        `;
      case 'view':
      default:
        return `
          background: ${theme.colors.neutral[200]};
          color: ${theme.colors.neutral[700]};
          &:hover {
            background: ${theme.colors.neutral[300]};
          }
        `;
    }
  }}
  
  svg {
    width: 16px;
    height: 16px;
  }
`;

const DateText = styled.span`
  color: ${theme.colors.neutral[600]};
  font-size: ${theme.typography.fontSize.sm};
`;

export const SubmissionManagement: React.FC<SubmissionManagementProps> = ({
  submissions,
  onSubmissionUpdate
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isUpdating, setIsUpdating] = useState<string | null>(null);

  const submissionManager = FirebaseSubmissionManager.getInstance();

  const handleApprove = async (submissionId: string) => {
    try {
      setIsUpdating(submissionId);
      await submissionManager.performAdminAction({
        submissionId,
        action: 'approve',
        feedback: 'Approved for publication'
      });
      onSubmissionUpdate();
    } catch (error) {
      console.error('Failed to approve submission:', error);
    } finally {
      setIsUpdating(null);
    }
  };

  const handleReject = async (submissionId: string) => {
    try {
      setIsUpdating(submissionId);
      await submissionManager.performAdminAction({
        submissionId,
        action: 'reject',
        feedback: 'Content does not meet our guidelines'
      });
      onSubmissionUpdate();
    } catch (error) {
      console.error('Failed to reject submission:', error);
    } finally {
      setIsUpdating(null);
    }
  };

  const getUserInitials = (username: string): string => {
    return username
      .split(' ')
      .map(word => word.charAt(0))
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };

  const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const filteredSubmissions = submissions.filter(submission =>
    submission.creatorUsername.toLowerCase().includes(searchTerm.toLowerCase()) ||
    submission.videoUrl.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Container>
      <TableHeader>
        <HeaderLeft>
          <TableTitle>Submissions</TableTitle>
          <TableSubtitle>{filteredSubmissions.length} total submissions</TableSubtitle>
        </HeaderLeft>
        
        <HeaderControls>
          <SearchBox>
            <Search />
            <input
              type="text"
              placeholder="Search submissions..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </SearchBox>
          
          <FilterButton>
            <Filter />
            Filter
          </FilterButton>
        </HeaderControls>
      </TableHeader>

      <Table>
        <TableHead>
          <TableRow>
            <TableHeaderCell>Creator</TableHeaderCell>
            <TableHeaderCell>Platform</TableHeaderCell>
            <TableHeaderCell>Date</TableHeaderCell>
            <TableHeaderCell>Status</TableHeaderCell>
            <TableHeaderCell>Actions</TableHeaderCell>
          </TableRow>
        </TableHead>
        
        <tbody>
          {filteredSubmissions.map((submission) => (
            <TableRow key={submission.id}>
              <TableCell>
                <UserInfo>
                  <UserAvatar platform={submission.platform}>
                    {getUserInitials(submission.creatorUsername)}
                  </UserAvatar>
                  <UserDetails>
                    <UserName>{submission.creatorUsername}</UserName>
                    <UserEmail>ID: {submission.creatorId.substring(0, 8)}...</UserEmail>
                  </UserDetails>
                </UserInfo>
              </TableCell>
              
              <TableCell>
                <PlatformBadge platform={submission.platform}>
                  {submission.platform === Platform.TIKTOK ? '🎵' : '📸'} {submission.platform}
                </PlatformBadge>
              </TableCell>
              
              <TableCell>
                <DateText>{formatDate(submission.submittedAt)}</DateText>
              </TableCell>
              
              <TableCell>
                <StatusBadge status={submission.status}>
                  {submission.status}
                </StatusBadge>
              </TableCell>
              
              <TableCell>
                <ActionButtons>
                  <ActionButton
                    variant="view"
                    onClick={() => window.open(submission.videoUrl, '_blank')}
                    title="View video"
                  >
                    <ExternalLink />
                  </ActionButton>
                  
                  {submission.status === SubmissionStatus.PENDING && (
                    <>
                      <ActionButton
                        variant="approve"
                        onClick={() => handleApprove(submission.id)}
                        disabled={isUpdating === submission.id}
                        title="Approve submission"
                      >
                        <Check />
                      </ActionButton>
                      
                      <ActionButton
                        variant="reject"
                        onClick={() => handleReject(submission.id)}
                        disabled={isUpdating === submission.id}
                        title="Reject submission"
                      >
                        <X />
                      </ActionButton>
                    </>
                  )}
                </ActionButtons>
              </TableCell>
            </TableRow>
          ))}
        </tbody>
      </Table>
    </Container>
  );
};