import { createConfig, http } from 'wagmi';
import { sepolia, mainnet } from 'wagmi/chains';
import { getDefaultConfig } from '@rainbow-me/rainbowkit';

// Add version info for debug purposes
const EXPECTED_WAGMI_VERSION = '2.0.0';
const EXPECTED_RAINBOWKIT_VERSION = '2.0.0';

// Determine environment
const isProduction = process.env.NODE_ENV === 'production';

// Get environment variables
const alchemyKey = process.env.REACT_APP_ALCHEMY_KEY;
const walletConnectProjectId = process.env.REACT_APP_WALLET_CONNECT_PROJECT_ID || 'fallback-project-id';

// Configure the network based on environment variables
const activeChain = process.env.REACT_APP_NETWORK === 'mainnet' ? mainnet : sepolia;

// Check environment variables early to avoid silent failures
const requiredEnvVars = [
  'REACT_APP_NETWORK',
  'REACT_APP_ALCHEMY_KEY',
  'REACT_APP_WALLET_CONNECT_PROJECT_ID'
];

requiredEnvVars.forEach(varName => {
  if (!process.env[varName]) {
    console.warn(`Missing required environment variable: ${varName}`);
  }
});

// Contract addresses from environment
export const contractAddresses = {
  CompanyNFT: process.env.REACT_APP_COMPANY_NFT_ADDRESS,
  Marketplace: process.env.REACT_APP_MARKETPLACE_ADDRESS,
  PlatformToken: process.env.REACT_APP_PLATFORM_TOKEN_ADDRESS,
  RevenueRouter: process.env.REACT_APP_REVENUE_ROUTER_ADDRESS,
  AdminControls: process.env.REACT_APP_ADMIN_CONTROLS_ADDRESS,
  ETH: '0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE' // Placeholder for native ETH
};

// Create Wagmi configuration with error handling
let wagmiConfig;
try {
  // Additional check to ensure we're using proper URL format based on chain
  const rpcUrl = alchemyKey ? 
    `https://eth-${activeChain.name}.g.alchemy.com/v2/${alchemyKey}` : 
    undefined;
  
  console.info(`Initializing Wagmi with chain: ${activeChain.name} (ID: ${activeChain.id})`);
  console.info(`Using RPC URL: ${rpcUrl ? 'Alchemy (configured)' : 'Default (fallback)'}`);
  
  // Create the configuration
  wagmiConfig = getDefaultConfig({
    appName: 'Tsuki Niji Labs',
    projectId: walletConnectProjectId,
    chains: [activeChain],
    transports: {
      [activeChain.id]: http(rpcUrl)
    },
    ssr: true
  });
  
  // Expose version info for debugging
  window.wagmiDebugInfo = {
    expectedWagmiVersion: EXPECTED_WAGMI_VERSION,
    expectedRainbowKitVersion: EXPECTED_RAINBOWKIT_VERSION,
    activeChain,
    projectId: walletConnectProjectId ? 'Configured' : 'Missing',
    rpcConfigured: Boolean(alchemyKey)
  };
} catch (error) {
  console.error('Failed to initialize Wagmi configuration:', error);
  // Create a minimal fallback config to prevent app from crashing
  wagmiConfig = getDefaultConfig({
    appName: 'Tsuki Niji Labs',
    projectId: 'fallback-id',
    chains: [sepolia],
    ssr: true
  });
}

export { wagmiConfig };
