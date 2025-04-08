/**
 * @jest-environment jsdom
 */

import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { useAccount } from 'wagmi';
import NFTDetail from '../NFTDetail';
import { useNFTContract, useMarketplace, usePlatformToken } from '../../hooks/useNFTContract';
import { useRevenueRouter } from '../../hooks/useRevenueRouter';

// Mock the hooks
jest.mock('wagmi', () => ({
  useAccount: jest.fn()
}));

jest.mock('../../hooks/useNFTContract', () => ({
  useNFTContract: jest.fn(),
  useMarketplace: jest.fn(),
  usePlatformToken: jest.fn()
}));

jest.mock('../../hooks/useRevenueRouter', () => ({
  useRevenueRouter: jest.fn()
}));

describe('NFTDetail', () => {
  const mockNFTData = {
    name: 'Test NFT',
    image: 'test-image.jpg',
    industry: 'Technology',
    description: 'Test Description',
    revenueTier: 'gold'
  };

  const mockListing = {
    price: 100000n,
    isAuction: false,
    currentBid: 0n
  };

  const mockRevenueInfo = {
    totalRevenue: 500000n,
    lastPayout: BigInt(Math.floor(Date.now() / 1000) - 86400),
    nextPayout: BigInt(Math.floor(Date.now() / 1000) + 86400),
    availableRevenue: 50000n
  };

  beforeEach(() => {
    // Reset all mocks
    jest.clearAllMocks();

    // Mock useAccount
    useAccount.mockReturnValue({
      address: '0x1234567890123456789012345678901234567890'
    });

    // Mock NFT contract hooks
    useNFTContract.mockReturnValue({
      getNFTMetadata: jest.fn().mockResolvedValue(mockNFTData),
      getNFTOwner: jest.fn().mockResolvedValue('0x1234567890123456789012345678901234567890')
    });

    useMarketplace.mockReturnValue({
      getListing: jest.fn().mockResolvedValue(mockListing),
      buyNFT: jest.fn().mockResolvedValue({}),
      placeBid: jest.fn().mockResolvedValue({})
    });

    usePlatformToken.mockReturnValue({
      getBalance: jest.fn().mockResolvedValue(1000000n),
      approve: jest.fn().mockResolvedValue({})
    });

    useRevenueRouter.mockReturnValue({
      getRevenueInfo: jest.fn().mockResolvedValue(mockRevenueInfo),
      claim: jest.fn().mockResolvedValue({})
    });
  });

  const renderNFTDetail = (tokenId = '1') => {
    return render(
      <MemoryRouter initialEntries={[`/nft/${tokenId}`]}>
        <Routes>
          <Route path="/nft/:tokenId" element={<NFTDetail />} />
        </Routes>
      </MemoryRouter>
    );
  };

  it('should render NFT details correctly', async () => {
    renderNFTDetail();

    // Wait for data to load
    await waitFor(() => {
      expect(screen.getByText(mockNFTData.name)).toBeInTheDocument();
    });

    // Check if main components are rendered
    expect(screen.getByText(mockNFTData.description)).toBeInTheDocument();
    expect(screen.getByText(mockNFTData.industry)).toBeInTheDocument();
    expect(screen.getByAltText(mockNFTData.name)).toHaveAttribute('src', mockNFTData.image);
  });

  it('should handle buy NFT flow', async () => {
    const { buyNFT } = useMarketplace();
    const { approve } = usePlatformToken();

    renderNFTDetail();

    // Wait for buy button to be available
    const buyButton = await screen.findByText('Buy Now');
    fireEvent.click(buyButton);

    // Check if approval and buy functions were called
    await waitFor(() => {
      expect(approve).toHaveBeenCalled();
      expect(buyNFT).toHaveBeenCalled();
    });
  });

  it('should handle bid NFT flow', async () => {
    const mockAuctionListing = { ...mockListing, isAuction: true, currentBid: 90000n };
    useMarketplace.mockReturnValue({
      ...useMarketplace(),
      getListing: jest.fn().mockResolvedValue(mockAuctionListing)
    });

    renderNFTDetail();

    // Wait for bid input to be available
    const bidInput = await screen.findByPlaceholderText('Enter bid amount');
    fireEvent.change(bidInput, { target: { value: '100000' } });

    const bidButton = screen.getByText('Place Bid');
    fireEvent.click(bidButton);

    // Check if bid was placed
    const { placeBid } = useMarketplace();
    await waitFor(() => {
      expect(placeBid).toHaveBeenCalled();
    });
  });

  it('should handle claim revenue flow', async () => {
    const { claim } = useRevenueRouter();

    renderNFTDetail();

    // Wait for claim button to be available
    const claimButton = await screen.findByText('Claim Revenue');
    fireEvent.click(claimButton);

    // Check if claim function was called
    await waitFor(() => {
      expect(claim).toHaveBeenCalled();
    });
  });

  it('should handle errors gracefully', async () => {
    // Mock an error in data loading
    useNFTContract.mockReturnValue({
      getNFTMetadata: jest.fn().mockRejectedValue(new Error('Failed to load NFT')),
      getNFTOwner: jest.fn().mockRejectedValue(new Error('Failed to load owner'))
    });

    renderNFTDetail();

    // Check if error message is displayed
    await waitFor(() => {
      expect(screen.getByText('Failed to load NFT data')).toBeInTheDocument();
    });
  });
});
