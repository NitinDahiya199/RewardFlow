// backend/src/utils/web3.ts
import { ethers } from 'ethers';
import { randomBytes } from 'crypto';

/**
 * Verify that a signature was created by the specified address
 */
export const verifySignature = (
  message: string,
  signature: string,
  expectedAddress: string
): boolean => {
  try {
    // Recover the address from the signature
    const recoveredAddress = ethers.verifyMessage(message, signature);
    
    // Normalize addresses to lowercase for comparison
    return recoveredAddress.toLowerCase() === expectedAddress.toLowerCase();
  } catch (error) {
    console.error('Signature verification error:', error);
    return false;
  }
};

/**
 * Generate a random nonce for authentication
 */
export const generateNonce = (): string => {
  return randomBytes(16).toString('hex');
};

