import { getDefaultWallets } from '@rainbow-me/rainbowkit';
import { configureChains, createConfig } from 'wagmi';
import { mainnet, sepolia } from 'viem/chains';
import { alchemyProvider } from 'wagmi/providers/alchemy';
import { createPublicClient, http } from 'viem';

// Configure chains for development and production
const { chains } = configureChains(
  [process.env.REACT_APP_NETWORK === 'mainnet' ? mainnet : sepolia],
  [
    alchemyProvider({ apiKey: process.env.REACT_APP_ALCHEMY_KEY })
  ]
);

const client = createPublicClient({
  chain: process.env.REACT_APP_NETWORK === 'mainnet' ? mainnet : sepolia,
  transport: http()
});

// Set up RainbowKit wallet connectors
const { connectors } = getDefaultWallets({
  appName: 'Tsuki Niji Labs NFT Platform',
  projectId: process.env.REACT_APP_WALLET_CONNECT_PROJECT_ID,
  chains
});

// Configure wagmi client
const wagmiConfig = createConfig({
  autoConnect: true,
  connectors,
  client
});

// Contract addresses - using environment variables for flexibility
const contractAddresses = {
  CompanyNFT: process.env.REACT_APP_COMPANY_NFT_ADDRESS,
  Marketplace: process.env.REACT_APP_MARKETPLACE_ADDRESS,
  PlatformToken: process.env.REACT_APP_PLATFORM_TOKEN_ADDRESS,
  RevenueRouter: process.env.REACT_APP_REVENUE_ROUTER_ADDRESS,
  AdminControls: process.env.REACT_APP_ADMIN_CONTROLS_ADDRESS
};

// Network configuration
const networkConfig = {
  chains,
  initialChain: process.env.REACT_APP_NETWORK === 'mainnet' ? mainnet : sepolia,
};

export { wagmiConfig, contractAddresses, networkConfig };
