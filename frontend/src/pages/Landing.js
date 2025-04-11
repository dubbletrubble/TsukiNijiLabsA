import React from 'react';
import Hero from '../components/landing/Hero';
import FeaturedNFTs from '../components/landing/FeaturedNFTs';
import HowItWorks from '../components/landing/HowItWorks';
import MarketplacePreview from '../components/landing/MarketplacePreview';
import TokenUtility from '../components/landing/TokenUtility';

const Landing = () => (
  <div style={{ width: '100%' }}>
    <Hero />
    <FeaturedNFTs />
    <HowItWorks />
    <MarketplacePreview />
    <TokenUtility />
  </div>
);

export default Landing;
