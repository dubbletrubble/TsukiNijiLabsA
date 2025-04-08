import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { WagmiConfig } from 'wagmi';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { RainbowKitProvider } from '@rainbow-me/rainbowkit';
import { GlobalStyles } from './styles/GlobalStyles';
import Hero from './components/landing/Hero';
import FeaturedNFTs from './components/landing/FeaturedNFTs';
import HowItWorks from './components/landing/HowItWorks';
import MarketplacePreview from './components/landing/MarketplacePreview';
import TokenUtility from './components/landing/TokenUtility';
import Footer from './components/landing/Footer';
import Navigation from './components/common/Navigation';
import Marketplace from './pages/Marketplace';
import NFTDetail from './pages/NFTDetail';
import Dashboard from './pages/Dashboard';
import About from './pages/About';
import { wagmiConfig, networkConfig } from './config/web3';
import '@rainbow-me/rainbowkit/styles.css';

const Landing = () => (
  <div style={{ width: '100%' }}>
    <Hero />
    <FeaturedNFTs />
    <HowItWorks />
    <MarketplacePreview />
    <TokenUtility />
  </div>
);

const queryClient = new QueryClient();

function App() {
  return (
    <WagmiConfig config={wagmiConfig}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider chains={networkConfig.chains} initialChain={networkConfig.initialChain}>
          <Router>
            <GlobalStyles />
            <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
              <Navigation />
              <main style={{ paddingTop: '80px', flex: '1 0 auto' }}>
                <Routes>
                  <Route path="/" element={<Landing />} />
                  <Route path="/marketplace" element={<Marketplace />} />
                  <Route path="/nft/:tokenId" element={<NFTDetail />} />
                  <Route path="/dashboard" element={<Dashboard />} />
                  <Route path="/about" element={<About />} />
                </Routes>
              </main>
              <Footer />
            </div>
          </Router>
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiConfig>
  );
}

export default App;
