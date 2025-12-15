// src/components/common/WalletSelectModal.tsx
import styled from 'styled-components';
import { WalletProvider, getAvailableWallets } from '../../utils/wallet';
import { Button } from './Button';
import { MetaMaskIcon, CoinbaseIcon, WalletConnectIcon } from './WalletIcons';

const Overlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.7);
  backdrop-filter: blur(4px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  animation: fadeIn 0.2s ease;
  
  @keyframes fadeIn {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }
`;

const Modal = styled.div`
  background: ${({ theme }) => theme.colors.surface};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  padding: ${({ theme }) => theme.spacing.xl};
  max-width: 450px;
  width: 90%;
  box-shadow: ${({ theme }) => theme.shadows.xl};
  border: 1px solid ${({ theme }) => theme.colors.border};
  animation: slideUp 0.3s ease;
  position: relative;
  
  @keyframes slideUp {
    from {
      transform: translateY(20px);
      opacity: 0;
    }
    to {
      transform: translateY(0);
      opacity: 1;
    }
  }
`;

const ModalHeader = styled.div`
  margin-bottom: ${({ theme }) => theme.spacing.lg};
  text-align: center;
`;

const ModalTitle = styled.h2`
  margin: 0;
  font-size: ${({ theme }) => theme.fontSize.xl};
  font-weight: ${({ theme }) => theme.fontWeight.bold};
  color: ${({ theme }) => theme.colors.text};
  background: ${({ theme }) => theme.gradients.primary};
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
`;

const ModalDescription = styled.p`
  margin: ${({ theme }) => theme.spacing.sm} 0 0 0;
  color: ${({ theme }) => theme.colors.textLight};
  font-size: ${({ theme }) => theme.fontSize.sm};
`;

const WalletList = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.md};
  margin-bottom: ${({ theme }) => theme.spacing.lg};
`;

const WalletButton = styled.button<{ $disabled?: boolean }>`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.md};
  padding: ${({ theme }) => theme.spacing.md} ${({ theme }) => theme.spacing.lg};
  background: ${({ theme }) => theme.colors.surfaceLight};
  border: 2px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  color: ${({ theme }) => theme.colors.text};
  font-size: ${({ theme }) => theme.fontSize.md};
  font-weight: ${({ theme }) => theme.fontWeight.semibold};
  cursor: ${({ $disabled }) => ($disabled ? 'not-allowed' : 'pointer')};
  transition: all 0.3s ease;
  opacity: ${({ $disabled }) => ($disabled ? 0.5 : 1)};

  &:hover:not(:disabled) {
    border-color: ${({ theme }) => theme.colors.primary};
    background: ${({ theme }) => theme.colors.surfaceHover};
    transform: translateY(-2px);
    box-shadow: ${({ theme }) => theme.shadows.md};
  }

  &:active:not(:disabled) {
    transform: translateY(0);
  }
`;

const WalletIconWrapper = styled.div`
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
`;

const WalletInfo = styled.div`
  flex: 1;
  text-align: left;
`;

const WalletName = styled.div`
  font-weight: ${({ theme }) => theme.fontWeight.semibold};
  margin-bottom: ${({ theme }) => theme.spacing.xs};
`;

const WalletStatus = styled.div`
  font-size: ${({ theme }) => theme.fontSize.sm};
  color: ${({ theme }) => theme.colors.textSecondary};
`;

const InstallLink = styled.a`
  color: ${({ theme }) => theme.colors.primary};
  text-decoration: none;
  font-size: ${({ theme }) => theme.fontSize.sm};
  margin-left: ${({ theme }) => theme.spacing.sm};
  
  &:hover {
    text-decoration: underline;
  }
`;

const CloseButton = styled(Button)`
  width: 100%;
  margin-top: ${({ theme }) => theme.spacing.md};
`;

interface WalletSelectModalProps {
  onSelect: (walletType: WalletProvider['type']) => void;
  onClose: () => void;
}

export const WalletSelectModal = ({ onSelect, onClose }: WalletSelectModalProps) => {
  const wallets = getAvailableWallets();

  const handleWalletSelect = (wallet: WalletProvider) => {
    if (wallet.isAvailable || wallet.type === 'walletconnect') {
      onSelect(wallet.type);
    }
  };

  const getInstallUrl = (walletType: WalletProvider['type']): string => {
    switch (walletType) {
      case 'metamask':
        return 'https://metamask.io/download/';
      case 'coinbase':
        return 'https://www.coinbase.com/wallet';
      case 'walletconnect':
        return 'https://walletconnect.com/';
      default:
        return '#';
    }
  };

  const renderWalletIcon = (type: WalletProvider['type']) => {
    switch (type) {
      case 'metamask':
        return <MetaMaskIcon size={32} />;
      case 'coinbase':
        return <CoinbaseIcon size={32} />;
      case 'walletconnect':
        return <WalletConnectIcon size={32} />;
      default:
        return null;
    }
  };

  return (
    <Overlay onClick={onClose}>
      <Modal onClick={(e) => e.stopPropagation()}>
        <ModalHeader>
          <ModalTitle>Connect Wallet</ModalTitle>
          <ModalDescription>
            Choose a wallet to connect to your account
          </ModalDescription>
        </ModalHeader>
        <WalletList>
          {wallets.map((wallet) => (
            <WalletButton
              key={wallet.type}
              onClick={() => handleWalletSelect(wallet)}
              disabled={!wallet.isAvailable && wallet.type !== 'walletconnect'}
              $disabled={!wallet.isAvailable && wallet.type !== 'walletconnect'}
            >
              <WalletIconWrapper>{renderWalletIcon(wallet.type)}</WalletIconWrapper>
              <WalletInfo>
                <WalletName>{wallet.name}</WalletName>
                <WalletStatus>
                  {wallet.isAvailable ? (
                    'Available'
                  ) : wallet.type === 'walletconnect' ? (
                    'Available via QR code'
                  ) : (
                    <>
                      Not installed
                      <InstallLink
                        href={getInstallUrl(wallet.type)}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={(e) => e.stopPropagation()}
                      >
                        Install
                      </InstallLink>
                    </>
                  )}
                </WalletStatus>
              </WalletInfo>
            </WalletButton>
          ))}
        </WalletList>
        <CloseButton variant="outline" onClick={onClose}>
          Cancel
        </CloseButton>
      </Modal>
    </Overlay>
  );
};

