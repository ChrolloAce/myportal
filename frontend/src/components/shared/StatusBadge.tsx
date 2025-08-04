/**
 * StatusBadge - Visual status indicator for submissions
 * Clean, semantic color coding for submission statuses
 */

import React from 'react';
import styled from 'styled-components';
import { theme } from '../../styles/theme';
import { SubmissionStatus } from '../../types';

interface StatusBadgeProps {
  status: SubmissionStatus;
  size?: 'sm' | 'md';
}

const Badge = styled.span<{ 
  status: SubmissionStatus; 
  size: string;
}>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-weight: ${theme.typography.fontWeight.medium};
  border-radius: ${theme.borderRadius.full};
  text-transform: capitalize;
  
  ${({ size }) => {
    switch (size) {
      case 'sm':
        return `
          padding: ${theme.spacing[1]} ${theme.spacing[2]};
          font-size: ${theme.typography.fontSize.xs};
        `;
      default:
        return `
          padding: ${theme.spacing[2]} ${theme.spacing[3]};
          font-size: ${theme.typography.fontSize.sm};
        `;
    }
  }}
  
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
          background: ${theme.colors.neutral[100]};
          color: ${theme.colors.neutral[600]};
        `;
    }
  }}
`;

const StatusIcon = styled.span<{ status: SubmissionStatus }>`
  width: 6px;
  height: 6px;
  border-radius: 50%;
  margin-right: ${theme.spacing[2]};
  
  ${({ status }) => {
    switch (status) {
      case SubmissionStatus.PENDING:
        return `background: ${theme.colors.status.pending};`;
      case SubmissionStatus.APPROVED:
        return `background: ${theme.colors.status.approved};`;
      case SubmissionStatus.REJECTED:
        return `background: ${theme.colors.status.rejected};`;
      default:
        return `background: ${theme.colors.neutral[400]};`;
    }
  }}
`;

export const StatusBadge: React.FC<StatusBadgeProps> = ({ 
  status, 
  size = 'md' 
}) => {
  return (
    <Badge status={status} size={size}>
      <StatusIcon status={status} />
      {status}
    </Badge>
  );
};