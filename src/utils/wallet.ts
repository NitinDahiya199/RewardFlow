// src/utils/wallet.ts
import { ethers } from 'ethers';

export type WalletType = 'metamask' | 'walletconnect' | 'coinbase';

declare global {
  interface Window {
    ethereum?: any;
  }
}

export interface WalletProvider {
  name: string;
  type: WalletType;
  isAvailable: boolean;
}

/**
 * Check if MetaMask is installed
 */
export const isMetaMaskInstalled = (): boolean => {
  return typeof window !== 'undefined' && typeof window.ethereum !== 'undefined' && window.ethereum.isMetaMask;
};

/**
 * Check if Coinbase Wallet is installed
 */
export const isCoinbaseWalletInstalled = (): boolean => {
  return typeof window !== 'undefined' && typeof window.ethereum !== 'undefined' && window.ethereum.isCoinbaseWallet;
};

/**
 * Check if any wallet is available
 */
export const isAnyWalletAvailable = (): boolean => {
  return isMetaMaskInstalled() || isCoinbaseWalletInstalled();
};

/**
 * Get wallet provider based on type
 */
export const getWalletProvider = async (type: WalletType): Promise<ethers.BrowserProvider | null> => {
  if (typeof window === 'undefined' || !window.ethereum) {
    return null;
  }

  try {
    if (type === 'metamask') {
      if (window.ethereum.providers) {
        // Multiple providers might be available
        const metamaskProvider = window.ethereum.providers.find(
          (provider: any) => provider.isMetaMask
        );
        if (metamaskProvider) {
          return new ethers.BrowserProvider(metamaskProvider);
        }
      } else if (window.ethereum.isMetaMask) {
        return new ethers.BrowserProvider(window.ethereum);
      }
    } else if (type === 'coinbase') {
      if (window.ethereum.providers) {
        const coinbaseProvider = window.ethereum.providers.find(
          (provider: any) => provider.isCoinbaseWallet
        );
        if (coinbaseProvider) {
          return new ethers.BrowserProvider(coinbaseProvider);
        }
      } else if (window.ethereum.isCoinbaseWallet) {
        return new ethers.BrowserProvider(window.ethereum);
      }
    } else if (type === 'walletconnect') {
      // WalletConnect integration would go here
      // For now, we'll use the default provider
      return new ethers.BrowserProvider(window.ethereum);
    }
  } catch (error) {
    console.error('Error getting wallet provider:', error);
    return null;
  }

  return null;
};

/**
 * Connect to wallet and get signer
 */
export const connectWallet = async (type: WalletType): Promise<{ address: string; signer: ethers.JsonRpcSigner } | null> => {
  try {
    const provider = await getWalletProvider(type);
    if (!provider) {
      throw new Error('Wallet provider not available');
    }

    // Request account access
    await provider.send('eth_requestAccounts', []);

    const signer = await provider.getSigner();
    const address = await signer.getAddress();

    return { address, signer };
  } catch (error: any) {
    if (error.code === 4001) {
      // User rejected the request
      throw new Error('Connection rejected by user');
    }
    throw error;
  }
};

/**
 * Sign a message with the wallet
 */
export const signMessage = async (signer: ethers.JsonRpcSigner, message: string): Promise<string> => {
  try {
    const signature = await signer.signMessage(message);
    return signature;
  } catch (error: any) {
    if (error.code === 4001) {
      throw new Error('Signature rejected by user');
    }
    throw error;
  }
};

/**
 * Get available wallet providers
 */
export const getAvailableWallets = (): WalletProvider[] => {
  const wallets: WalletProvider[] = [
    {
      name: 'MetaMask',
      type: 'metamask',
      isAvailable: isMetaMaskInstalled(),
    },
    {
      name: 'Coinbase Wallet',
      type: 'coinbase',
      isAvailable: isCoinbaseWalletInstalled(),
    },
    {
      name: 'WalletConnect',
      type: 'walletconnect',
      isAvailable: true, // WalletConnect can work without installation
    },
  ];

  return wallets;
};

