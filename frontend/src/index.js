import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { Web3Provider } from './context/Web3Context';
import { WagmiConfig, createConfig, configureChains } from 'wagmi';
import { mainnet, sepolia } from 'wagmi/chains';
import { publicProvider } from 'wagmi/providers/public';
import { MetaMaskConnector } from 'wagmi/connectors/metaMask';

// Configure chains for both development and production
const { chains, publicClient, webSocketPublicClient } = configureChains(
  [process.env.REACT_APP_NETWORK === 'mainnet' ? mainnet : sepolia],
  [publicProvider()]
);

// Create wagmi config
const config = createConfig({
  autoConnect: true,
  connectors: [new MetaMaskConnector({ chains })],
  publicClient,
  webSocketPublicClient,
});

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <WagmiConfig config={config}>
      <Web3Provider>
        <App />
      </Web3Provider>
    </WagmiConfig>
  </React.StrictMode>
);
