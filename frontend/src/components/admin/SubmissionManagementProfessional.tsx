/**
 * Professional SubmissionManagement - Beautiful content hub interface
 * Matches the professional analytics style with modern table design
 */

import React, { useState } from 'react';
import styled from 'styled-components';
import { professionalTheme } from '../../styles/professionalTheme';
import { Card, Button } from '../../styles/ProfessionalStyles';
import { VideoSubmission, SubmissionStatus, Platform } from '../../types';
import { FirebaseSubmissionManager } from '../../firebase/FirebaseSubmissionManager';
import { 
  ExternalLink, 
  Check, 
  X, 
  Search,
  PlayCircle,
  Calendar,
  User,
  Download,
  CheckCircle,
  Clock,
  XCircle
} from 'lucide-react';

interface SubmissionManagementProps {
  submissions: VideoSubmission[];
  onSubmissionUpdate: () => void;
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

const TableCard = styled(Card)`
  overflow: hidden;
`;

const TableContainer = styled.div`
  overflow-x: auto;
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
`;

const TableHeader = styled.thead`
  background: ${professionalTheme.colors.gray[50]};
`;

const TableHeaderCell = styled.th`
  padding: ${professionalTheme.spacing[4]} ${professionalTheme.spacing[6]};
  text-align: left;
  font-size: ${professionalTheme.typography.fontSize.sm};
  font-weight: ${professionalTheme.typography.fontWeight.medium};
  color: ${professionalTheme.colors.gray[700]};
  border-bottom: 1px solid ${professionalTheme.colors.gray[200]};
  white-space: nowrap;
`;

const TableBody = styled.tbody``;

const TableRow = styled.tr`
  transition: all 0.2s ease;
  
  &:hover {
    background: ${professionalTheme.colors.gray[25]};
  }
  
  &:not(:last-child) {
    border-bottom: 1px solid ${professionalTheme.colors.gray[100]};
  }
`;

const TableCell = styled.td`
  padding: ${professionalTheme.spacing[4]} ${professionalTheme.spacing[6]};
  font-size: ${professionalTheme.typography.fontSize.sm};
  color: ${professionalTheme.colors.gray[900]};
  vertical-align: middle;
`;

const SubmissionPreview = styled.div`
  display: flex;
  align-items: center;
  gap: ${professionalTheme.spacing[3]};
`;

const PreviewThumbnail = styled.div`
  width: 48px;
  height: 48px;
  background: ${professionalTheme.colors.gray[100]};
  border-radius: ${professionalTheme.borderRadius.lg};
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${professionalTheme.colors.gray[500]};
  overflow: hidden;
  
  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;

const SubmissionInfo = styled.div``;

const SubmissionTitle = styled.div`
  font-weight: ${professionalTheme.typography.fontWeight.medium};
  color: ${professionalTheme.colors.gray[900]};
  margin-bottom: ${professionalTheme.spacing[1]};
`;

const SubmissionMeta = styled.div`
  font-size: ${professionalTheme.typography.fontSize.xs};
  color: ${professionalTheme.colors.gray[600]};
`;

const StatusBadge = styled.div<{ status: string }>`
  display: inline-flex;
  align-items: center;
  gap: ${professionalTheme.spacing[1]};
  padding: ${professionalTheme.spacing[1]} ${professionalTheme.spacing[3]};
  border-radius: ${professionalTheme.borderRadius.full};
  font-size: ${professionalTheme.typography.fontSize.xs};
  font-weight: ${professionalTheme.typography.fontWeight.medium};
  
  ${props => {
    switch (props.status) {
      case 'approved':
        return `
          background: ${professionalTheme.colors.success[100]};
          color: ${professionalTheme.colors.success[700]};
        `;
      case 'pending':
        return `
          background: ${professionalTheme.colors.warning[100]};
          color: ${professionalTheme.colors.warning[700]};
        `;
      case 'rejected':
        return `
          background: ${professionalTheme.colors.error[100]};
          color: ${professionalTheme.colors.error[700]};
        `;
      default:
        return `
          background: ${professionalTheme.colors.gray[100]};
          color: ${professionalTheme.colors.gray[700]};
        `;
    }
  }}
`;

const PlatformBadge = styled.div<{ platform: string }>`
  display: inline-flex;
  align-items: center;
  padding: ${professionalTheme.spacing[1]} ${professionalTheme.spacing[2]};
  border-radius: ${professionalTheme.borderRadius.md};
  font-size: ${professionalTheme.typography.fontSize.xs};
  font-weight: ${professionalTheme.typography.fontWeight.medium};
  
  ${props => {
    switch (props.platform.toLowerCase()) {
      case 'tiktok':
        return `
          background: ${professionalTheme.colors.gray[900]};
          color: ${professionalTheme.colors.white};
        `;
      case 'instagram':
        return `
          background: linear-gradient(45deg, #f09433 0%,#e6683c 25%,#dc2743 50%,#cc2366 75%,#bc1888 100%);
          color: ${professionalTheme.colors.white};
        `;
      default:
        return `
          background: ${professionalTheme.colors.gray[100]};
          color: ${professionalTheme.colors.gray[700]};
        `;
    }
  }}
`;

const ActionButtons = styled.div`
  display: flex;
  gap: ${professionalTheme.spacing[2]};
`;

const ActionButton = styled.button<{ variant: 'approve' | 'reject' | 'view' }>`
  padding: ${professionalTheme.spacing[2]};
  border: none;
  border-radius: ${professionalTheme.borderRadius.md};
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  
  ${props => {
    switch (props.variant) {
      case 'approve':
        return `
          background: ${professionalTheme.colors.success[100]};
          color: ${professionalTheme.colors.success[600]};
          
          &:hover {
            background: ${professionalTheme.colors.success[200]};
          }
        `;
      case 'reject':
        return `
          background: ${professionalTheme.colors.error[100]};
          color: ${professionalTheme.colors.error[600]};
          
          &:hover {
            background: ${professionalTheme.colors.error[200]};
          }
        `;
      case 'view':
        return `
          background: ${professionalTheme.colors.gray[100]};
          color: ${professionalTheme.colors.gray[600]};
          
          &:hover {
            background: ${professionalTheme.colors.gray[200]};
          }
        `;
      default:
        return '';
    }
  }}
`;

const EmptyState = styled.div`
  text-align: center;
  padding: ${professionalTheme.spacing[12]} ${professionalTheme.spacing[6]};
  color: ${professionalTheme.colors.gray[600]};
`;

const EmptyIcon = styled.div`
  margin-bottom: ${professionalTheme.spacing[4]};
  color: ${professionalTheme.colors.gray[400]};
`;

export const SubmissionManagement: React.FC<SubmissionManagementProps> = ({ 
  submissions, 
  onSubmissionUpdate 
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<SubmissionStatus | 'all'>('all');
  const [platformFilter, setPlatformFilter] = useState<Platform | 'all'>('all');
  const [isUpdating, setIsUpdating] = useState<string | null>(null);

  const submissionManager = FirebaseSubmissionManager.getInstance();

  const handleStatusUpdate = async (submissionId: string, newStatus: SubmissionStatus) => {
    try {
      setIsUpdating(submissionId);
      await submissionManager.performAdminAction({
      submissionId,
      action: newStatus === SubmissionStatus.APPROVED ? 'approve' : 'reject',
      feedback: ''
    });
      onSubmissionUpdate();
    } catch (error) {
      console.error('Failed to update submission:', error);
    } finally {
      setIsUpdating(null);
    }
  };

  const filteredSubmissions = submissions.filter(submission => {
    const matchesSearch = submission.caption?.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         submission.creatorId.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || submission.status === statusFilter;
    const matchesPlatform = platformFilter === 'all' || submission.platform === platformFilter;
    
    return matchesSearch && matchesStatus && matchesPlatform;
  });

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'approved':
        return <CheckCircle size={12} />;
      case 'pending':
        return <Clock size={12} />;
      case 'rejected':
        return <XCircle size={12} />;
      default:
        return <Clock size={12} />;
    }
  };

  return (
    <DashboardLayout>
      {/* Header */}
      <HeaderSection>
        <HeaderContent>
          <HeaderTitle>Content Hub</HeaderTitle>
          <HeaderSubtitle>Review and manage all submitted content</HeaderSubtitle>
        </HeaderContent>
        <Button variant="primary">
          <Download size={16} />
          Export Data
        </Button>
      </HeaderSection>

      {/* Filters */}
      <FiltersRow>
        <SearchBox>
          <Search size={16} />
          <input
            type="text"
            placeholder="Search submissions..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </SearchBox>
        
        <FilterSelect
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value as SubmissionStatus | 'all')}
        >
          <option value="all">All Status</option>
          <option value="pending">Pending</option>
                          <option value={SubmissionStatus.APPROVED}>Approved</option>
                <option value={SubmissionStatus.REJECTED}>Rejected</option>
        </FilterSelect>
        
        <FilterSelect
          value={platformFilter}
          onChange={(e) => setPlatformFilter(e.target.value as Platform | 'all')}
        >
          <option value="all">All Platforms</option>
          <option value="tiktok">TikTok</option>
          <option value="instagram">Instagram</option>
        </FilterSelect>
      </FiltersRow>

      {/* Table */}
      <TableCard>
        <TableContainer>
          <Table>
            <TableHeader>
              <tr>
                <TableHeaderCell>Content</TableHeaderCell>
                <TableHeaderCell>Creator</TableHeaderCell>
                <TableHeaderCell>Platform</TableHeaderCell>
                <TableHeaderCell>Status</TableHeaderCell>
                <TableHeaderCell>Submitted</TableHeaderCell>
                <TableHeaderCell>Actions</TableHeaderCell>
              </tr>
            </TableHeader>
            <TableBody>
              {filteredSubmissions.length === 0 ? (
                <tr>
                  <TableCell colSpan={6}>
                    <EmptyState>
                      <EmptyIcon>
                        <PlayCircle size={48} />
                      </EmptyIcon>
                      <p>No submissions found</p>
                    </EmptyState>
                  </TableCell>
                </tr>
              ) : (
                filteredSubmissions.map((submission) => (
                  <TableRow key={submission.id}>
                    <TableCell>
                      <SubmissionPreview>
                        <PreviewThumbnail>
                                          {submission.videoUrl ? (
                  <PlayCircle size={24} />
                          ) : (
                            <PlayCircle size={20} />
                          )}
                        </PreviewThumbnail>
                        <SubmissionInfo>
                          <SubmissionTitle>
                            {submission.caption || 'Untitled'}
                          </SubmissionTitle>
                          <SubmissionMeta>
                            {submission.videoUrl && (
                              <a 
                                href={submission.videoUrl} 
                                target="_blank" 
                                rel="noopener noreferrer"
                                style={{ 
                                  color: professionalTheme.colors.primary[600],
                                  textDecoration: 'none'
                                }}
                              >
                                View Video
                              </a>
                            )}
                          </SubmissionMeta>
                        </SubmissionInfo>
                      </SubmissionPreview>
                    </TableCell>
                    
                    <TableCell>
                      <div style={{ display: 'flex', alignItems: 'center', gap: professionalTheme.spacing[2] }}>
                        <User size={16} />
                        {submission.creatorId}
                      </div>
                    </TableCell>
                    
                    <TableCell>
                      <PlatformBadge platform={submission.platform}>
                        {submission.platform}
                      </PlatformBadge>
                    </TableCell>
                    
                    <TableCell>
                      <StatusBadge status={submission.status}>
                        {getStatusIcon(submission.status)}
                        {submission.status}
                      </StatusBadge>
                    </TableCell>
                    
                    <TableCell>
                      <div style={{ display: 'flex', alignItems: 'center', gap: professionalTheme.spacing[2] }}>
                        <Calendar size={14} />
                        {new Date(submission.submittedAt).toLocaleDateString()}
                      </div>
                    </TableCell>
                    
                    <TableCell>
                      <ActionButtons>
                        {submission.status === SubmissionStatus.PENDING && (
                          <>
                            <ActionButton
                              variant="approve"
                              onClick={() => handleStatusUpdate(submission.id, SubmissionStatus.APPROVED)}
                              disabled={isUpdating === submission.id}
                              title="Approve"
                            >
                              <Check size={16} />
                            </ActionButton>
                            <ActionButton
                              variant="reject"
                              onClick={() => handleStatusUpdate(submission.id, SubmissionStatus.REJECTED)}
                              disabled={isUpdating === submission.id}
                              title="Reject"
                            >
                              <X size={16} />
                            </ActionButton>
                          </>
                        )}
                        
                        {submission.videoUrl && (
                          <ActionButton
                            variant="view"
                            onClick={() => window.open(submission.videoUrl, '_blank')}
                            title="View Video"
                          >
                            <ExternalLink size={16} />
                          </ActionButton>
                        )}
                      </ActionButtons>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </TableCard>
    </DashboardLayout>
  );
};