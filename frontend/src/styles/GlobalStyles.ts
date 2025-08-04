/**
 * Global styles for the application
 * Establishes premium, minimal foundation
 */

import styled, { createGlobalStyle } from 'styled-components';
import { theme } from './theme';

export const GlobalStyles = createGlobalStyle`
  * {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
  }

  html {
    font-size: 16px;
    scroll-behavior: smooth;
  }

  body {
    font-family: ${theme.typography.fontFamily.primary};
    font-size: ${theme.typography.fontSize.base};
    font-weight: ${theme.typography.fontWeight.normal};
    line-height: ${theme.typography.lineHeight.normal};
    color: ${theme.colors.neutral[800]};
    background-color: ${theme.colors.neutral[50]};
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }

  #root {
    min-height: 100vh;
    display: flex;
    flex-direction: column;
  }

  h1, h2, h3, h4, h5, h6 {
    font-weight: ${theme.typography.fontWeight.semibold};
    color: ${theme.colors.neutral[900]};
    line-height: ${theme.typography.lineHeight.tight};
  }

  h1 {
    font-size: ${theme.typography.fontSize['3xl']};
  }

  h2 {
    font-size: ${theme.typography.fontSize['2xl']};
  }

  h3 {
    font-size: ${theme.typography.fontSize.xl};
  }

  h4 {
    font-size: ${theme.typography.fontSize.lg};
  }

  p {
    color: ${theme.colors.neutral[600]};
    line-height: ${theme.typography.lineHeight.relaxed};
  }

  a {
    color: ${theme.colors.primary[600]};
    text-decoration: none;
    transition: color ${theme.transitions.fast};

    &:hover {
      color: ${theme.colors.primary[700]};
    }
  }

  button {
    font-family: inherit;
    cursor: pointer;
    border: none;
    outline: none;
    background: none;
    transition: all ${theme.transitions.fast};

    &:disabled {
      cursor: not-allowed;
      opacity: 0.6;
    }
  }

  input, textarea, select {
    font-family: inherit;
    font-size: inherit;
    outline: none;
    border: none;
    background: none;
  }

  /* Custom scrollbar */
  ::-webkit-scrollbar {
    width: 8px;
  }

  ::-webkit-scrollbar-track {
    background: ${theme.colors.neutral[100]};
  }

  ::-webkit-scrollbar-thumb {
    background: ${theme.colors.neutral[300]};
    border-radius: ${theme.borderRadius.full};
    
    &:hover {
      background: ${theme.colors.neutral[400]};
    }
  }

  /* Focus styles */
  *:focus-visible {
    outline: 2px solid ${theme.colors.primary[500]};
    outline-offset: 2px;
  }

  /* Animations */
  @keyframes fadeIn {
    from {
      opacity: 0;
      transform: translateY(10px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  @keyframes slideIn {
    from {
      opacity: 0;
      transform: translateX(-20px);
    }
    to {
      opacity: 1;
      transform: translateX(0);
    }
  }

  .fade-in {
    animation: fadeIn 0.3s ease-out;
  }

  .slide-in {
    animation: slideIn 0.3s ease-out;
  }
`;

// Common styled components for reuse
export const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 ${theme.spacing[6]};
  
  @media (max-width: ${theme.breakpoints.sm}) {
    padding: 0 ${theme.spacing[4]};
  }
`;

export const Card = styled.div`
  background: ${theme.colors.neutral[0]};
  border-radius: ${theme.borderRadius.lg};
  box-shadow: ${theme.shadows.base};
  padding: ${theme.spacing[6]};
  border: 1px solid ${theme.colors.neutral[200]};
`;

export const Button = styled.button<{
  variant?: 'primary' | 'secondary' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
}>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: ${theme.spacing[2]};
  font-weight: ${theme.typography.fontWeight.medium};
  border-radius: ${theme.borderRadius.md};
  transition: all ${theme.transitions.fast};
  white-space: nowrap;
  
  ${({ size = 'md' }) => {
    switch (size) {
      case 'sm':
        return `
          padding: ${theme.spacing[2]} ${theme.spacing[3]};
          font-size: ${theme.typography.fontSize.sm};
        `;
      case 'lg':
        return `
          padding: ${theme.spacing[4]} ${theme.spacing[6]};
          font-size: ${theme.typography.fontSize.lg};
        `;
      default:
        return `
          padding: ${theme.spacing[3]} ${theme.spacing[4]};
          font-size: ${theme.typography.fontSize.base};
        `;
    }
  }}
  
  ${({ variant = 'primary' }) => {
    switch (variant) {
      case 'secondary':
        return `
          background: ${theme.colors.neutral[100]};
          color: ${theme.colors.neutral[700]};
          border: 1px solid ${theme.colors.neutral[300]};
          
          &:hover:not(:disabled) {
            background: ${theme.colors.neutral[200]};
            border-color: ${theme.colors.neutral[400]};
          }
        `;
      case 'ghost':
        return `
          background: transparent;
          color: ${theme.colors.neutral[600]};
          
          &:hover:not(:disabled) {
            background: ${theme.colors.neutral[100]};
            color: ${theme.colors.neutral[700]};
          }
        `;
      default:
        return `
          background: ${theme.colors.primary[600]};
          color: ${theme.colors.neutral[0]};
          
          &:hover:not(:disabled) {
            background: ${theme.colors.primary[700]};
            transform: translateY(-1px);
            box-shadow: ${theme.shadows.md};
          }
        `;
    }
  }}
`;

export const Input = styled.input`
  width: 100%;
  padding: ${theme.spacing[3]} ${theme.spacing[4]};
  border: 1px solid ${theme.colors.neutral[300]};
  border-radius: ${theme.borderRadius.md};
  background: ${theme.colors.neutral[0]};
  color: ${theme.colors.neutral[800]};
  transition: all ${theme.transitions.fast};
  
  &:focus {
    border-color: ${theme.colors.primary[500]};
    box-shadow: 0 0 0 3px ${theme.colors.primary[100]};
  }
  
  &::placeholder {
    color: ${theme.colors.neutral[400]};
  }
  
  &:disabled {
    background: ${theme.colors.neutral[100]};
    cursor: not-allowed;
  }
`;