// src/components/common/Button.tsx
import styled, { keyframes } from 'styled-components';

const shimmer = keyframes`
  0% {
    background-position: -1000px 0;
  }
  100% {
    background-position: 1000px 0;
  }
`;

const pulse = keyframes`
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.8;
  }
`;

interface ButtonProps {
  variant?: 'primary' | 'secondary' | 'danger' | 'outline';
  fullWidth?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

export const Button = styled.button<ButtonProps>`
  padding: ${({ size = 'md', theme }) => {
    if (size === 'sm') return `${theme.spacing.sm} ${theme.spacing.md}`;
    if (size === 'lg') return `${theme.spacing.md} ${theme.spacing.xl}`;
    return `${theme.spacing.sm} ${theme.spacing.lg}`;
  }};
  font-size: ${({ size = 'md', theme }) => {
    if (size === 'sm') return theme.fontSize.sm;
    if (size === 'lg') return theme.fontSize.lg;
    return theme.fontSize.md;
  }};
  font-weight: ${({ theme }) => theme.fontWeight.semibold};
  border: none;
  border-radius: ${({ theme }) => theme.borderRadius.md};
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  width: ${({ fullWidth }) => (fullWidth ? '100%' : 'auto')};
  position: relative;
  overflow: hidden;
  backdrop-filter: blur(10px);
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(
      90deg,
      transparent,
      rgba(255, 255, 255, 0.2),
      transparent
    );
    transition: left 0.5s;
  }
  
  &:hover::before {
    left: 100%;
  }
  
  ${({ variant = 'primary', theme }) => {
    switch (variant) {
      case 'primary':
        return `
          background: ${theme.gradients.primary};
          color: white;
          box-shadow: 0 4px 15px rgba(99, 102, 241, 0.4);
          &:hover {
            transform: translateY(-2px);
            box-shadow: ${theme.shadows.glow};
          }
          &:active {
            transform: translateY(0);
          }
        `;
      case 'secondary':
        return `
          background: ${theme.gradients.secondary};
          color: white;
          box-shadow: 0 4px 15px rgba(16, 185, 129, 0.4);
          &:hover {
            transform: translateY(-2px);
            box-shadow: ${theme.shadows.glowSecondary};
          }
          &:active {
            transform: translateY(0);
          }
        `;
      case 'danger':
        return `
          background: linear-gradient(135deg, ${theme.colors.danger} 0%, ${theme.colors.dangerDark} 100%);
          color: white;
          box-shadow: 0 4px 15px rgba(239, 68, 68, 0.4);
          &:hover {
            transform: translateY(-2px);
            box-shadow: 0 6px 20px rgba(239, 68, 68, 0.5);
          }
          &:active {
            transform: translateY(0);
          }
        `;
      case 'outline':
        return `
          background: transparent;
          color: ${theme.colors.primary};
          border: 2px solid ${theme.colors.primary};
          backdrop-filter: blur(10px);
          &:hover {
            background: ${theme.gradients.primary};
            color: white;
            border-color: transparent;
            transform: translateY(-2px);
            box-shadow: 0 4px 15px rgba(99, 102, 241, 0.3);
          }
          &:active {
            transform: translateY(0);
          }
        `;
    }
  }}

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    transform: none !important;
  }
`;



