/**
 * Professional Global Styles - Modern SaaS Dashboard Design
 * Clean, sophisticated, and highly usable interface components
 */

import styled, { createGlobalStyle } from 'styled-components';
import { professionalTheme } from './professionalTheme';

export const ProfessionalGlobalStyles = createGlobalStyle`
  /* CSS Reset and Base Styles */
  *, *::before, *::after {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
  }

  html {
    font-size: 16px;
    scroll-behavior: smooth;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }

  body {
    font-family: ${professionalTheme.typography.fontFamily.sans};
    font-size: ${professionalTheme.typography.fontSize.sm};
    font-weight: ${professionalTheme.typography.fontWeight.normal};
    line-height: ${professionalTheme.typography.lineHeight.normal};
    color: ${professionalTheme.colors.gray[900]};
    background-color: ${professionalTheme.colors.gray[25]};
    text-rendering: optimizeLegibility;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }

  #root {
    min-height: 100vh;
    display: flex;
    flex-direction: column;
  }

  /* Typography Hierarchy */
  h1, h2, h3, h4, h5, h6 {
    font-weight: ${professionalTheme.typography.fontWeight.semibold};
    color: ${professionalTheme.colors.gray[900]};
    line-height: ${professionalTheme.typography.lineHeight.tight};
    letter-spacing: ${professionalTheme.typography.letterSpacing.tight};
  }

  h1 {
    font-size: ${professionalTheme.typography.fontSize['3xl']};
    font-weight: ${professionalTheme.typography.fontWeight.bold};
  }

  h2 {
    font-size: ${professionalTheme.typography.fontSize['2xl']};
    font-weight: ${professionalTheme.typography.fontWeight.semibold};
  }

  h3 {
    font-size: ${professionalTheme.typography.fontSize.xl};
    font-weight: ${professionalTheme.typography.fontWeight.semibold};
  }

  h4 {
    font-size: ${professionalTheme.typography.fontSize.lg};
    font-weight: ${professionalTheme.typography.fontWeight.medium};
  }

  h5 {
    font-size: ${professionalTheme.typography.fontSize.base};
    font-weight: ${professionalTheme.typography.fontWeight.medium};
  }

  h6 {
    font-size: ${professionalTheme.typography.fontSize.sm};
    font-weight: ${professionalTheme.typography.fontWeight.medium};
    text-transform: uppercase;
    letter-spacing: ${professionalTheme.typography.letterSpacing.wide};
  }

  p {
    color: ${professionalTheme.colors.gray[600]};
    line-height: ${professionalTheme.typography.lineHeight.relaxed};
  }

  /* Links */
  a {
    color: ${professionalTheme.colors.primary[600]};
    text-decoration: none;
    transition: ${professionalTheme.transitions.colors};
    font-weight: ${professionalTheme.typography.fontWeight.medium};

    &:hover {
      color: ${professionalTheme.colors.primary[700]};
    }

    &:focus-visible {
      outline: 2px solid ${professionalTheme.colors.primary[500]};
      outline-offset: 2px;
      border-radius: ${professionalTheme.borderRadius.sm};
    }
  }

  /* Form Elements */
  button {
    font-family: inherit;
    cursor: pointer;
    border: none;
    outline: none;
    background: none;
    transition: ${professionalTheme.transitions.all};
    font-weight: ${professionalTheme.typography.fontWeight.medium};

    &:disabled {
      cursor: not-allowed;
      opacity: 0.5;
    }

    &:focus-visible {
      outline: 2px solid ${professionalTheme.colors.primary[500]};
      outline-offset: 2px;
    }
  }

  input, textarea, select {
    font-family: inherit;
    font-size: inherit;
    outline: none;
    border: none;
    background: none;
  }

  /* Custom Scrollbar */
  ::-webkit-scrollbar {
    width: 6px;
    height: 6px;
  }

  ::-webkit-scrollbar-track {
    background: ${professionalTheme.colors.gray[100]};
    border-radius: ${professionalTheme.borderRadius.full};
  }

  ::-webkit-scrollbar-thumb {
    background: ${professionalTheme.colors.gray[300]};
    border-radius: ${professionalTheme.borderRadius.full};
    
    &:hover {
      background: ${professionalTheme.colors.gray[400]};
    }
  }

  ::-webkit-scrollbar-corner {
    background: ${professionalTheme.colors.gray[100]};
  }

  /* Selection */
  ::selection {
    background: ${professionalTheme.colors.primary[100]};
    color: ${professionalTheme.colors.primary[900]};
  }

  /* Focus Styles */
  *:focus-visible {
    outline: 2px solid ${professionalTheme.colors.primary[500]};
    outline-offset: 2px;
    border-radius: ${professionalTheme.borderRadius.sm};
  }

  /* Animations */
  @keyframes fadeIn {
    from {
      opacity: 0;
      transform: translateY(8px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  @keyframes slideIn {
    from {
      opacity: 0;
      transform: translateX(-12px);
    }
    to {
      opacity: 1;
      transform: translateX(0);
    }
  }

  @keyframes scaleIn {
    from {
      opacity: 0;
      transform: scale(0.95);
    }
    to {
      opacity: 1;
      transform: scale(1);
    }
  }

  @keyframes shimmer {
    0% {
      background-position: -200px 0;
    }
    100% {
      background-position: calc(200px + 100%) 0;
    }
  }

  .fade-in {
    animation: fadeIn 0.2s ease-out;
  }

  .slide-in {
    animation: slideIn 0.3s ease-out;
  }

  .scale-in {
    animation: scaleIn 0.2s ease-out;
  }

  /* Utility classes */
  .sr-only {
    position: absolute;
    width: 1px;
    height: 1px;
    padding: 0;
    margin: -1px;
    overflow: hidden;
    clip: rect(0, 0, 0, 0);
    white-space: nowrap;
    border: 0;
  }
`;

// Professional Layout Components
export const Container = styled.div<{ maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'full' }>`
  width: 100%;
  margin: 0 auto;
  padding: 0 ${professionalTheme.spacing[6]};
  
  ${({ maxWidth = 'xl' }) => {
    const widths = {
      sm: '640px',
      md: '768px', 
      lg: '1024px',
      xl: '1280px',
      '2xl': '1536px',
      full: '100%'
    };
    return `max-width: ${widths[maxWidth]};`;
  }}
  
  @media (max-width: ${professionalTheme.breakpoints.sm}) {
    padding: 0 ${professionalTheme.spacing[4]};
  }
`;

export const Card = styled.div<{ 
  variant?: 'default' | 'elevated' | 'outlined' | 'ghost';
  padding?: 'none' | 'sm' | 'md' | 'lg' | 'xl';
}>`
  background: ${professionalTheme.colors.white};
  border-radius: ${professionalTheme.borderRadius.lg};
  transition: ${professionalTheme.transitions.all};
  
  ${({ variant = 'default' }) => {
    switch (variant) {
      case 'elevated':
        return `
          box-shadow: ${professionalTheme.shadows.lg};
          border: 1px solid ${professionalTheme.colors.gray[100]};
        `;
      case 'outlined':
        return `
          border: 1px solid ${professionalTheme.borders.color.default};
          box-shadow: none;
        `;
      case 'ghost':
        return `
          background: transparent;
          border: none;
          box-shadow: none;
        `;
      default:
        return `
          box-shadow: ${professionalTheme.shadows.card};
          border: 1px solid ${professionalTheme.borders.color.light};
        `;
    }
  }}
  
  ${({ padding = 'md' }) => {
    const paddings = {
      none: '0',
      sm: professionalTheme.spacing[4],
      md: professionalTheme.spacing[6],
      lg: professionalTheme.spacing[8],
      xl: professionalTheme.spacing[10],
    };
    return `padding: ${paddings[padding]};`;
  }}

  &:hover {
    ${({ variant }) => variant === 'default' && `
      box-shadow: ${professionalTheme.shadows.cardHover};
      transform: translateY(-1px);
    `}
  }
`;

export const Button = styled.button<{
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger' | 'success';
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  fullWidth?: boolean;
  loading?: boolean;
}>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: ${professionalTheme.spacing[2]};
  font-weight: ${professionalTheme.typography.fontWeight.medium};
  border-radius: ${professionalTheme.borderRadius.md};
  transition: ${professionalTheme.transitions.all};
  white-space: nowrap;
  position: relative;
  font-family: ${professionalTheme.typography.fontFamily.sans};
  
  ${({ fullWidth }) => fullWidth && 'width: 100%;'}
  
  ${({ size = 'md' }) => {
    const sizes = {
      xs: {
        padding: `${professionalTheme.spacing[1]} ${professionalTheme.spacing[2]}`,
        fontSize: professionalTheme.typography.fontSize.xs,
        height: '24px',
      },
      sm: {
        padding: `${professionalTheme.spacing[2]} ${professionalTheme.spacing[3]}`,
        fontSize: professionalTheme.typography.fontSize.sm,
        height: '32px',
      },
      md: {
        padding: `${professionalTheme.spacing[2.5]} ${professionalTheme.spacing[4]}`,
        fontSize: professionalTheme.typography.fontSize.sm,
        height: '40px',
      },
      lg: {
        padding: `${professionalTheme.spacing[3]} ${professionalTheme.spacing[5]}`,
        fontSize: professionalTheme.typography.fontSize.base,
        height: '44px',
      },
      xl: {
        padding: `${professionalTheme.spacing[4]} ${professionalTheme.spacing[6]}`,
        fontSize: professionalTheme.typography.fontSize.lg,
        height: '48px',
      },
    };
    
    return `
      padding: ${sizes[size].padding};
      font-size: ${sizes[size].fontSize};
      min-height: ${sizes[size].height};
    `;
  }}
  
  ${({ variant = 'primary' }) => {
    switch (variant) {
      case 'secondary':
        return `
          background: ${professionalTheme.colors.white};
          color: ${professionalTheme.colors.gray[700]};
          border: 1px solid ${professionalTheme.borders.color.default};
          box-shadow: ${professionalTheme.shadows.xs};
          
          &:hover:not(:disabled) {
            background: ${professionalTheme.colors.gray[50]};
            border-color: ${professionalTheme.borders.color.medium};
            box-shadow: ${professionalTheme.shadows.sm};
          }
          
          &:active:not(:disabled) {
            background: ${professionalTheme.colors.gray[100]};
            transform: translateY(0);
          }
        `;
      case 'ghost':
        return `
          background: transparent;
          color: ${professionalTheme.colors.gray[600]};
          border: 1px solid transparent;
          
          &:hover:not(:disabled) {
            background: ${professionalTheme.colors.gray[100]};
            color: ${professionalTheme.colors.gray[700]};
          }
          
          &:active:not(:disabled) {
            background: ${professionalTheme.colors.gray[150]};
          }
        `;
      case 'danger':
        return `
          background: ${professionalTheme.colors.error[500]};
          color: ${professionalTheme.colors.white};
          border: 1px solid ${professionalTheme.colors.error[500]};
          box-shadow: ${professionalTheme.shadows.xs};
          
          &:hover:not(:disabled) {
            background: ${professionalTheme.colors.error[600]};
            border-color: ${professionalTheme.colors.error[600]};
            box-shadow: ${professionalTheme.shadows.sm};
          }
        `;
      case 'success':
        return `
          background: ${professionalTheme.colors.success[500]};
          color: ${professionalTheme.colors.white};
          border: 1px solid ${professionalTheme.colors.success[500]};
          box-shadow: ${professionalTheme.shadows.xs};
          
          &:hover:not(:disabled) {
            background: ${professionalTheme.colors.success[600]};
            border-color: ${professionalTheme.colors.success[600]};
            box-shadow: ${professionalTheme.shadows.sm};
          }
        `;
      default:
        return `
          background: ${professionalTheme.colors.primary[500]};
          color: ${professionalTheme.colors.white};
          border: 1px solid ${professionalTheme.colors.primary[500]};
          box-shadow: ${professionalTheme.shadows.xs};
          
          &:hover:not(:disabled) {
            background: ${professionalTheme.colors.primary[600]};
            border-color: ${professionalTheme.colors.primary[600]};
            box-shadow: ${professionalTheme.shadows.sm};
            transform: translateY(-1px);
          }
          
          &:active:not(:disabled) {
            transform: translateY(0);
            box-shadow: ${professionalTheme.shadows.xs};
          }
        `;
    }
  }}

  &:focus-visible {
    outline: 2px solid ${professionalTheme.colors.primary[500]};
    outline-offset: 2px;
  }

  ${({ loading }) => loading && `
    color: transparent;
    
    &::after {
      content: "";
      position: absolute;
      width: 16px;
      height: 16px;
      top: 50%;
      left: 50%;
      margin-left: -8px;
      margin-top: -8px;
      border: 2px solid transparent;
      border-top-color: currentColor;
      border-radius: 50%;
      animation: spin 0.8s linear infinite;
    }
    
    @keyframes spin {
      to {
        transform: rotate(360deg);
      }
    }
  `}
`;

export const Input = styled.input<{
  variant?: 'default' | 'filled' | 'flushed';
  size?: 'sm' | 'md' | 'lg';
  error?: boolean;
}>`
  width: 100%;
  border-radius: ${professionalTheme.borderRadius.md};
  background: ${professionalTheme.colors.white};
  color: ${professionalTheme.colors.gray[900]};
  transition: ${professionalTheme.transitions.all};
  font-family: ${professionalTheme.typography.fontFamily.sans};
  
  ${({ size = 'md' }) => {
    const sizes = {
      sm: {
        padding: `${professionalTheme.spacing[2]} ${professionalTheme.spacing[3]}`,
        fontSize: professionalTheme.typography.fontSize.sm,
        height: '32px',
      },
      md: {
        padding: `${professionalTheme.spacing[2.5]} ${professionalTheme.spacing[3.5]}`,
        fontSize: professionalTheme.typography.fontSize.sm,
        height: '40px',
      },
      lg: {
        padding: `${professionalTheme.spacing[3]} ${professionalTheme.spacing[4]}`,
        fontSize: professionalTheme.typography.fontSize.base,
        height: '44px',
      },
    };
    
    return `
      padding: ${sizes[size].padding};
      font-size: ${sizes[size].fontSize};
      min-height: ${sizes[size].height};
    `;
  }}
  
  ${({ variant = 'default', error }) => {
    const borderColor = error 
      ? professionalTheme.colors.error[500] 
      : professionalTheme.borders.color.default;
    
    switch (variant) {
      case 'filled':
        return `
          border: 1px solid transparent;
          background: ${professionalTheme.colors.gray[50]};
          
          &:focus {
            background: ${professionalTheme.colors.white};
            border-color: ${professionalTheme.colors.primary[500]};
            box-shadow: 0 0 0 3px ${professionalTheme.colors.primary[100]};
          }
        `;
      case 'flushed':
        return `
          border: none;
          border-bottom: 1px solid ${borderColor};
          border-radius: 0;
          background: transparent;
          
          &:focus {
            border-bottom-color: ${professionalTheme.colors.primary[500]};
            box-shadow: 0 1px 0 0 ${professionalTheme.colors.primary[500]};
          }
        `;
      default:
        return `
          border: 1px solid ${borderColor};
          box-shadow: ${professionalTheme.shadows.xs};
          
          &:focus {
            border-color: ${professionalTheme.colors.primary[500]};
            box-shadow: 0 0 0 3px ${professionalTheme.colors.primary[100]};
          }
        `;
    }
  }}
  
  &::placeholder {
    color: ${professionalTheme.colors.gray[400]};
  }
  
  &:disabled {
    background: ${professionalTheme.colors.gray[50]};
    color: ${professionalTheme.colors.gray[400]};
    cursor: not-allowed;
  }
`;

export const Textarea = styled.textarea<{
  variant?: 'default' | 'filled';
  error?: boolean;
}>`
  width: 100%;
  min-height: 80px;
  padding: ${professionalTheme.spacing[3]} ${professionalTheme.spacing[3.5]};
  border: 1px solid ${({ error }) => error ? professionalTheme.colors.error[500] : professionalTheme.borders.color.default};
  border-radius: ${professionalTheme.borderRadius.md};
  background: ${({ variant }) => variant === 'filled' ? professionalTheme.colors.gray[50] : professionalTheme.colors.white};
  color: ${professionalTheme.colors.gray[900]};
  font-size: ${professionalTheme.typography.fontSize.sm};
  line-height: ${professionalTheme.typography.lineHeight.relaxed};
  transition: ${professionalTheme.transitions.all};
  resize: vertical;
  font-family: ${professionalTheme.typography.fontFamily.sans};
  
  &:focus {
    border-color: ${professionalTheme.colors.primary[500]};
    box-shadow: 0 0 0 3px ${professionalTheme.colors.primary[100]};
    ${({ variant }) => variant === 'filled' && `background: ${professionalTheme.colors.white};`}
  }
  
  &::placeholder {
    color: ${professionalTheme.colors.gray[400]};
  }
  
  &:disabled {
    background: ${professionalTheme.colors.gray[50]};
    color: ${professionalTheme.colors.gray[400]};
    cursor: not-allowed;
  }
`;

// Professional Table Components
export const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  background: ${professionalTheme.colors.white};
  border-radius: ${professionalTheme.borderRadius.lg};
  overflow: hidden;
  box-shadow: ${professionalTheme.shadows.card};
  border: 1px solid ${professionalTheme.borders.color.light};
`;

export const TableHeader = styled.thead`
  background: ${professionalTheme.colors.gray[50]};
  border-bottom: 1px solid ${professionalTheme.borders.color.default};
`;

export const TableRow = styled.tr`
  border-bottom: 1px solid ${professionalTheme.borders.color.light};
  transition: ${professionalTheme.transitions.colors};
  
  &:hover {
    background: ${professionalTheme.colors.gray[25]};
  }
  
  &:last-child {
    border-bottom: none;
  }
`;

export const TableHeaderCell = styled.th`
  padding: ${professionalTheme.spacing[3]} ${professionalTheme.spacing[4]};
  text-align: left;
  font-weight: ${professionalTheme.typography.fontWeight.semibold};
  font-size: ${professionalTheme.typography.fontSize.xs};
  color: ${professionalTheme.colors.gray[600]};
  text-transform: uppercase;
  letter-spacing: ${professionalTheme.typography.letterSpacing.wide};
`;

export const TableCell = styled.td`
  padding: ${professionalTheme.spacing[4]};
  font-size: ${professionalTheme.typography.fontSize.sm};
  color: ${professionalTheme.colors.gray[900]};
  vertical-align: top;
`;

// Badge Component
export const Badge = styled.span<{
  variant?: 'default' | 'success' | 'warning' | 'error' | 'info';
  size?: 'sm' | 'md' | 'lg';
}>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-weight: ${professionalTheme.typography.fontWeight.medium};
  white-space: nowrap;
  border-radius: ${professionalTheme.borderRadius.full};
  
  ${({ size = 'md' }) => {
    const sizes = {
      sm: {
        padding: `${professionalTheme.spacing[1]} ${professionalTheme.spacing[2]}`,
        fontSize: professionalTheme.typography.fontSize.xs,
      },
      md: {
        padding: `${professionalTheme.spacing[1]} ${professionalTheme.spacing[2.5]}`,
        fontSize: professionalTheme.typography.fontSize.xs,
      },
      lg: {
        padding: `${professionalTheme.spacing[2]} ${professionalTheme.spacing[3]}`,
        fontSize: professionalTheme.typography.fontSize.sm,
      },
    };
    
    return `
      padding: ${sizes[size].padding};
      font-size: ${sizes[size].fontSize};
    `;
  }}
  
  ${({ variant = 'default' }) => {
    switch (variant) {
      case 'success':
        return `
          background: ${professionalTheme.colors.success[50]};
          color: ${professionalTheme.colors.success[700]};
          border: 1px solid ${professionalTheme.colors.success[200]};
        `;
      case 'warning':
        return `
          background: ${professionalTheme.colors.warning[50]};
          color: ${professionalTheme.colors.warning[700]};
          border: 1px solid ${professionalTheme.colors.warning[200]};
        `;
      case 'error':
        return `
          background: ${professionalTheme.colors.error[50]};
          color: ${professionalTheme.colors.error[700]};
          border: 1px solid ${professionalTheme.colors.error[200]};
        `;
      case 'info':
        return `
          background: ${professionalTheme.colors.primary[50]};
          color: ${professionalTheme.colors.primary[700]};
          border: 1px solid ${professionalTheme.colors.primary[200]};
        `;
      default:
        return `
          background: ${professionalTheme.colors.gray[100]};
          color: ${professionalTheme.colors.gray[700]};
          border: 1px solid ${professionalTheme.colors.gray[200]};
        `;
    }
  }}
`;

export default {
  ProfessionalGlobalStyles,
  Container,
  Card,
  Button,
  Input,
  Textarea,
  Table,
  TableHeader,
  TableRow,
  TableHeaderCell,
  TableCell,
  Badge,
};