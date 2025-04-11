import '@rainbow-me/rainbowkit/styles.css';
import { getDefaultWallets, connectorsForWallets, RainbowKitProvider } from '@rainbow-me/rainbowkit';
import { configureChains, createConfig } from 'wagmi';
import { mainnet, sepolia } from 'wagmi/chains';
import { infuraProvider } from 'wagmi/providers/infura';
import { publicProvider } from 'wagmi/providers/public';

// Network configuration with fallback to Sepolia testnet
const NETWORK = process.env.REACT_APP_NETWORK || 'sepolia';
const selectedChain = NETWORK === 'mainnet' ? mainnet : sepolia;

// Use a default projectId for development
const DEFAULT_PROJECT_ID = '00000000000000000000000000000000';
const projectId = process.env.REACT_APP_WALLET_CONNECT_PROJECT_ID || DEFAULT_PROJECT_ID;

// Configure wagmi client with RainbowKit
const infuraId = process.env.REACT_APP_INFURA_ID || '5b348ac26e3143738765417436a14224';

const { chains, publicClient } = configureChains(
  [selectedChain],
  [
    infuraProvider({ apiKey: infuraId }),
    publicProvider()
  ]
);

const { connectors } = getDefaultWallets({
  appName: 'Tsuki Niji Labs NFT Platform',
  projectId,
  chains
});

const wagmiConfig = createConfig({
  autoConnect: true,
  connectors,
  publicClient
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

export { wagmiConfig, contractAddresses, chains };
