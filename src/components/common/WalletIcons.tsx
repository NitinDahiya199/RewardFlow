// src/components/common/WalletIcons.tsx
import React from 'react';
import styled from 'styled-components';

interface WalletIconProps {
  size?: number | string;
  className?: string;
}

const IconWrapper = styled.svg<{ size?: number | string }>`
  width: ${({ size }) => (typeof size === 'number' ? `${size}px` : size || '32px')};
  height: ${({ size }) => (typeof size === 'number' ? `${size}px` : size || '32px')};
  display: inline-block;
  vertical-align: middle;
  flex-shrink: 0;
`;

// MetaMask Icon (Fox)
export const MetaMaskIcon: React.FC<WalletIconProps> = ({ size = 32, className }) => (
  <IconWrapper
    size={size}
    viewBox="0 0 32 32"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    <rect width="32" height="32" rx="6" fill="#F6851B" />
    <path
      d="M26.5 7L18 14L20.5 9L26.5 7Z"
      fill="#CD6116"
    />
    <path
      d="M5.5 7L14 14L11.5 9L5.5 7Z"
      fill="#E2761B"
    />
    <path
      d="M22.5 22.5L20 25.5L25.5 27L27 22L22.5 22.5Z"
      fill="#E4761B"
    />
    <path
      d="M5 22L6.5 27L12 25.5L9.5 22L5 22Z"
      fill="#E4761B"
    />
    <path
      d="M12 16.5L10.5 19.5L20.5 20L19.5 16.5L12 16.5Z"
      fill="#CD6116"
    />
    <path
      d="M26.5 7L18 14L19.5 16.5L25.5 17.5L27.5 14L26.5 7Z"
      fill="#E2761B"
    />
    <path
      d="M5.5 7L6.5 14L8.5 17.5L14.5 16.5L14 14L5.5 7Z"
      fill="#F6851B"
    />
    <path
      d="M16 22.5L12 25.5L20 25.5L16 22.5Z"
      fill="#C0AD9E"
    />
    <path
      d="M25.5 27L20 25.5L20.5 27.5L20 28.5L25.5 27Z"
      fill="#161616"
    />
    <path
      d="M6.5 27L12 28.5L11.5 27.5L12 25.5L6.5 27Z"
      fill="#161616"
    />
    <path
      d="M20.5 20L19.5 22.5L25.5 22L27 20L20.5 20Z"
      fill="#763D16"
    />
    <path
      d="M5 20L6.5 22L12.5 22.5L11.5 20L5 20Z"
      fill="#763D16"
    />
    <path
      d="M14.5 17.5L12 19.5L10.5 19.5L11.5 16.5L14.5 17.5Z"
      fill="#F6851B"
    />
    <path
      d="M17.5 17.5L20.5 16.5L21.5 19.5L20 19.5L17.5 17.5Z"
      fill="#F6851B"
    />
  </IconWrapper>
);

// Coinbase Wallet Icon
export const CoinbaseIcon: React.FC<WalletIconProps> = ({ size = 32, className }) => (
  <IconWrapper
    size={size}
    viewBox="0 0 32 32"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    <rect width="32" height="32" rx="6" fill="#0052FF" />
    <path
      d="M16 9C12.134 9 9 12.134 9 16C9 19.866 12.134 23 16 23C19.866 23 23 19.866 23 16C23 12.134 19.866 9 16 9ZM16 20.5C13.5147 20.5 11.5 18.4853 11.5 16C11.5 13.5147 13.5147 11.5 16 11.5C18.4853 11.5 20.5 13.5147 20.5 16C20.5 18.4853 18.4853 20.5 16 20.5Z"
      fill="white"
    />
    <circle cx="16" cy="16" r="3" fill="white" />
  </IconWrapper>
);

// WalletConnect Icon
export const WalletConnectIcon: React.FC<WalletIconProps> = ({ size = 32, className }) => (
  <IconWrapper
    size={size}
    viewBox="0 0 32 32"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    <rect width="32" height="32" rx="6" fill="#3B99FC" />
    <path
      d="M9.5 12.5C14.5 7.5 17.5 7.5 22.5 12.5"
      stroke="white"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M7 10C13.5 3.5 18.5 3.5 25 10"
      stroke="white"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M7 22C13.5 28.5 18.5 28.5 25 22"
      stroke="white"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M9.5 19.5C14.5 24.5 17.5 24.5 22.5 19.5"
      stroke="white"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <circle cx="16" cy="16" r="2" fill="white" />
  </IconWrapper>
);

