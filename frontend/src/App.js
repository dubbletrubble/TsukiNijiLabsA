import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import ScrollToTop from './components/common/ScrollToTop';
import { RainbowKitProvider } from '@rainbow-me/rainbowkit';
import { WagmiConfig } from 'wagmi';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { GlobalStyles } from './styles/GlobalStyles';
import Footer from './components/landing/Footer';
import Navigation from './components/common/Navigation';
import Landing from './pages/Landing';
import Marketplace from './pages/Marketplace';
import NFTDetail from './pages/NFTDetail';
import Dashboard from './pages/Dashboard';
import About from './pages/About';
import ConnectWallet from './pages/ConnectWallet';
import Convert from './pages/Convert';
import Support from './pages/Support';
import FAQ from './pages/FAQ';
import Documentation from './pages/Documentation';
import { wagmiConfig, chains } from './config/web3';
import '@rainbow-me/rainbowkit/styles.css';

const queryClient = new QueryClient();

function App() {
  return (
    <WagmiConfig config={wagmiConfig}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider chains={chains}>
          <Router>
            <ScrollToTop />
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
                  <Route path="/connect-wallet" element={<ConnectWallet />} />
                  <Route path="/convert" element={<Convert />} />
                  <Route path="/support" element={<Support />} />
                  <Route path="/faq" element={<FAQ />} />
                  <Route path="/docs" element={<Documentation />} />
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
