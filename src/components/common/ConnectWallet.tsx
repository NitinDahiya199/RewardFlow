// src/components/common/ConnectWallet.tsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { Button } from './Button';
import { WalletSelectModal } from './WalletSelectModal';
import { WalletProvider, WalletType, getAvailableWallets } from '../../utils/wallet';
import { authenticateWithWallet } from '../../services/web3Auth';
import { useAppDispatch } from '../../store/hooks';
import { loginWithWallet } from '../../store/slices/authSlice';
import { useToast } from './Toast';

const ConnectWalletButton = styled(Button)`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: ${({ theme }) => theme.spacing.sm};
`;

interface ConnectWalletProps {
  variant?: 'primary' | 'secondary' | 'outline';
  fullWidth?: boolean;
  onSuccess?: () => void;
}

export const ConnectWallet = ({ variant = 'primary', fullWidth = false, onSuccess }: ConnectWalletProps) => {
  const [showModal, setShowModal] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { showToast } = useToast();

  const handleConnect = () => {
    const availableWallets = getAvailableWallets();
    const hasAnyWallet = availableWallets.some(w => w.isAvailable) || availableWallets.some(w => w.type === 'walletconnect');
    
    if (!hasAnyWallet) {
      showToast('No wallet detected. Please install MetaMask or Coinbase Wallet.', 'error');
      return;
    }

    setShowModal(true);
  };

  const handleWalletSelect = async (walletType: WalletType) => {
    setShowModal(false);
    setIsConnecting(true);

    try {
      // Authenticate with wallet
      const result = await authenticateWithWallet(walletType);

      // Dispatch Redux action to store user data
      await dispatch(loginWithWallet({
        user: result.user,
        token: result.token,
        walletAddress: result.walletAddress,
      }));

      showToast('Wallet connected successfully!', 'success');
      
      // Call onSuccess callback if provided
      if (onSuccess) {
        onSuccess();
      } else {
        // Redirect to dashboard
        navigate('/tasks');
      }
    } catch (error: any) {
      console.error('Wallet connection error:', error);
      
      let errorMessage = 'Failed to connect wallet';
      if (error.message.includes('rejected')) {
        errorMessage = 'Connection was rejected';
      } else if (error.message.includes('not available')) {
        errorMessage = 'Wallet is not available';
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      showToast(errorMessage, 'error');
    } finally {
      setIsConnecting(false);
    }
  };

  const handleCloseModal = () => {
    if (!isConnecting) {
      setShowModal(false);
    }
  };

  return (
    <>
      <ConnectWalletButton
        variant={variant}
        fullWidth={fullWidth}
        onClick={handleConnect}
        disabled={isConnecting}
      >
        {isConnecting ? 'Connecting...' : '🔗 Connect Wallet'}
      </ConnectWalletButton>
      
      {showModal && (
        <WalletSelectModal
          onSelect={handleWalletSelect}
          onClose={handleCloseModal}
        />
      )}
    </>
  );
};

