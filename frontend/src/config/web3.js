import '@rainbow-me/rainbowkit/styles.css';
import { getDefaultConfig } from '@rainbow-me/rainbowkit';
import { mainnet, sepolia } from 'viem/chains';
import { http } from 'viem';

// Network configuration with fallback to Sepolia testnet
const NETWORK = process.env.REACT_APP_NETWORK || 'sepolia';
const selectedChain = NETWORK === 'mainnet' ? mainnet : sepolia;

// Use a default projectId for development
const DEFAULT_PROJECT_ID = '00000000000000000000000000000000';
const projectId = process.env.REACT_APP_WALLET_CONNECT_PROJECT_ID || DEFAULT_PROJECT_ID;

// Configure wagmi client with RainbowKit
const wagmiConfig = getDefaultConfig({
  appName: 'Tsuki Niji Labs NFT Platform',
  projectId,
  chains: [selectedChain],
  transports: {
    [selectedChain.id]: http()
  }
});

// Contract addresses with fallback to zero address
const ZERO_ADDRESS = '0x0000000000000000000000000000000000000000';
const contractAddresses = {
  CompanyNFT: process.env.REACT_APP_COMPANY_NFT_ADDRESS || ZERO_ADDRESS,
  Marketplace: process.env.REACT_APP_MARKETPLACE_ADDRESS || ZERO_ADDRESS,
  PlatformToken: process.env.REACT_APP_PLATFORM_TOKEN_ADDRESS || ZERO_ADDRESS,
  RevenueRouter: process.env.REACT_APP_REVENUE_ROUTER_ADDRESS || ZERO_ADDRESS,
  AdminControls: process.env.REACT_APP_ADMIN_CONTROLS_ADDRESS || ZERO_ADDRESS
};

// Export configurations
const chains = [selectedChain];

export { wagmiConfig, contractAddresses, chains };
