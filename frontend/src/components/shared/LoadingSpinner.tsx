/**
 * LoadingSpinner - Reusable loading component
 * Clean, minimal loading indicator following design principles
 */

import React from 'react';
import styled, { keyframes } from 'styled-components';
import { theme } from '../../styles/theme';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  color?: string;
}

const spin = keyframes`
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
`;

const SpinnerContainer = styled.div<{ size: string }>`
  display: inline-block;
  ${({ size }) => {
    switch (size) {
      case 'sm':
        return `
          width: 16px;
          height: 16px;
        `;
      case 'lg':
        return `
          width: 32px;
          height: 32px;
        `;
      default:
        return `
          width: 24px;
          height: 24px;
        `;
    }
  }}
`;

const Spinner = styled.div<{ color: string }>`
  width: 100%;
  height: 100%;
  border: 2px solid ${theme.colors.neutral[200]};
  border-top: 2px solid ${({ color }) => color};
  border-radius: 50%;
  animation: ${spin} 1s linear infinite;
`;

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ 
  size = 'md', 
  color = theme.colors.primary[600] 
}) => {
  return (
    <SpinnerContainer size={size}>
      <Spinner color={color} />
    </SpinnerContainer>
  );
};