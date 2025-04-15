import { createConfig, http } from 'wagmi';
import { sepolia, mainnet } from 'wagmi/chains';
import { getDefaultConfig } from '@rainbow-me/rainbowkit';

// Determine environment
const isProduction = process.env.NODE_ENV === 'production';

// Get environment variables
const alchemyKey = process.env.REACT_APP_ALCHEMY_KEY;
const walletConnectProjectId = process.env.REACT_APP_WALLET_CONNECT_PROJECT_ID || 'fallback-project-id';

// Configure the network based on environment variables
const activeChain = process.env.REACT_APP_NETWORK === 'mainnet' ? mainnet : sepolia;

// Contract addresses from environment
export const contractAddresses = {
  CompanyNFT: process.env.REACT_APP_COMPANY_NFT_ADDRESS,
  Marketplace: process.env.REACT_APP_MARKETPLACE_ADDRESS,
  PlatformToken: process.env.REACT_APP_PLATFORM_TOKEN_ADDRESS,
  RevenueRouter: process.env.REACT_APP_REVENUE_ROUTER_ADDRESS,
  AdminControls: process.env.REACT_APP_ADMIN_CONTROLS_ADDRESS,
  ETH: '0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE' // Placeholder for native ETH
};

// Create Wagmi configuration
export const wagmiConfig = getDefaultConfig({
  appName: 'Tsuki Niji Labs',
  projectId: walletConnectProjectId,
  chains: [activeChain],
  transports: {
    [activeChain.id]: http(alchemyKey ? 
      `https://eth-${activeChain.name}.g.alchemy.com/v2/${alchemyKey}` : 
      undefined)
  },
  ssr: true
});
