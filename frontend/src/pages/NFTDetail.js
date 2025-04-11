import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import styled from '@emotion/styled';
import { useAccount } from 'wagmi';
import { parseEther } from 'viem';
import { Container } from '../components/common/StyledComponents';
import { theme } from '../styles/theme';
import { useNFTContract, useMarketplace, usePlatformToken } from '../hooks/useNFTContract';
import { useRevenueRouter } from '../hooks/useRevenueRouter';
import { contractAddresses } from '../config/web3';
import CompanyOverview from '../components/nft/CompanyOverview';
import RevenuePanel from '../components/nft/RevenuePanel';
import BuyPanel from '../components/nft/BuyPanel';
import CompanyDetails from '../components/nft/CompanyDetails';


/**
 * @fileoverview NFT Detail page component
 * Displays comprehensive information about a specific NFT, including company details,
 * revenue information, and purchase/bid options.
 */

// Make BigInt available globally
const BigInt = window.BigInt;

const DetailPageContainer = styled.div`
  min-height: calc(100vh - 80px);
  width: 100%;
  padding-top: ${theme.spacing.xl};
  background: ${theme.colors.background.primary};
  position: relative;
  z-index: 1;
`;

const DetailContainer = styled.div`
  display: grid;
  grid-template-columns: 1fr 400px;
  gap: ${theme.spacing.xl};
  padding: ${theme.spacing.xl} 0;
  
  @media (max-width: ${theme.breakpoints.lg}) {
    grid-template-columns: 1fr;
  }
`;

const MainContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${theme.spacing.xl};
`;

const SideContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${theme.spacing.xl};
  
  @media (max-width: ${theme.breakpoints.lg}) {
    position: sticky;
    top: 80px;
  }
`;



/**
 * NFTDetail component displays detailed information about a specific NFT.
 * Handles data fetching, state management, and user interactions for NFT details page.
 *
 * @component
 * @example
 * ```jsx
 * <NFTDetail />
 * ```
 */
const NFTDetail = () => {
  const { tokenId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { address } = useAccount();
  
  // Get NFT data from location state
  const initialNFTData = location.state?.nft;
  
  // Contract hooks
  const { getNFTMetadata, getNFTOwner } = useNFTContract();
  const { getListing, buyNFT, placeBid, cancelListing } = useMarketplace();
  const { getBalance, approve } = usePlatformToken();
  const { getRevenueInfo, claim } = useRevenueRouter();
  
  const [metadata, setMetadata] = useState(() => initialNFTData ? {
    name: initialNFTData.name,
    image: initialNFTData.image,
    industry: initialNFTData.industry,
    description: initialNFTData.description,
    revenueTier: initialNFTData.revenueTier
  } : null);
  const [listing, setListing] = useState(initialNFTData ? {
    price: parseEther(initialNFTData.price),
    isAuction: initialNFTData.isAuction,
    currentBid: initialNFTData.currentBid ? parseEther(initialNFTData.currentBid) : 0n,
    timeRemaining: initialNFTData.timeRemaining
  } : null);
  const [owner] = useState(null);
  const [bidAmount, setBidAmount] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [revenueInfo, setRevenueInfo] = useState(null);

  const nftData = useMemo(() => {
    return {
      ...initialNFTData,
      metadata: metadata || {}
    };
  }, [metadata, initialNFTData]);

  /**
   * Load NFT data
   */
  const loadNFTData = useCallback(async () => {
    if (!tokenId) return;

    // Use initial data if available
    if (initialNFTData) {
      setMetadata({
        name: initialNFTData.name,
        image: initialNFTData.image,
        industry: initialNFTData.industry,
        description: initialNFTData.description,
        revenueTier: initialNFTData.revenueTier
      });
      setListing({
        price: parseEther(initialNFTData.price || '0'),
        isAuction: initialNFTData.isAuction,
        currentBid: initialNFTData.currentBid ? parseEther(initialNFTData.currentBid) : 0n,
        timeRemaining: initialNFTData.timeRemaining
      });
      return;
    }

    // Otherwise load from blockchain
    const [metadataResult, listingResult] = await Promise.all([
      getNFTMetadata({ address: contractAddresses.CompanyNFT, args: [tokenId] }),
      getListing({ address: contractAddresses.Marketplace, args: [tokenId] })
    ]).catch(() => [null, null]);

    if (metadataResult) {
      setMetadata(metadataResult);
    }

    if (listingResult) {
      setListing(listingResult);
    }
  }, [tokenId, initialNFTData, getNFTMetadata, getListing, parseEther]);

  useEffect(() => {
    loadNFTData();
  }, [tokenId, address, loadNFTData]);

  /**
   * Handles the NFT purchase process
   * Includes approval and purchase transaction
   */
  const handleBuy = useCallback(async () => {
    setError('');
    setIsLoading(true);

    try {
      if (!listing?.price) throw new Error('Invalid listing price');
      
      // First approve marketplace contract
      const approvalTx = await approve({
        address: contractAddresses.PlatformToken,
        args: [
          contractAddresses.Marketplace,
          listing.price
        ]
      });
      await approvalTx.wait();

      // Then buy NFT
      const tx = await buyNFT({
        address: contractAddresses.Marketplace,
        args: [tokenId]
      });
      await tx.wait();

      navigate('/marketplace');
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  }, [approve, buyNFT, listing?.price, tokenId, navigate]);

  const handleBid = useCallback(async (bidAmount) => {
    try {
      await placeBid({
        args: [tokenId, parseEther(bidAmount)]
      });
    } catch (error) {
      setError(error.message);
    }
  }, [placeBid, tokenId, parseEther]);

  const handleCancel = useCallback(async () => {
    await cancelListing({
      address: contractAddresses.Marketplace,
      args: [tokenId]
    });
    navigate('/marketplace');
  }, [cancelListing, tokenId, navigate]);

  const handleClaim = useCallback(async () => {
    await claim({
      address: contractAddresses.Marketplace,
      args: [tokenId]
    });
    
    const newRevenueInfo = await getRevenueInfo();
    setRevenueInfo(newRevenueInfo);
  }, [claim, getRevenueInfo, tokenId]);

  // Render content
  const renderedContent = useMemo(() => {
    if (!metadata && !initialNFTData) return null;

    return (
      <Container>
        <DetailContainer>
          <MainContent>
            <CompanyOverview
              name={nftData.name}
              image={nftData.image}
              industry={nftData.industry}
              description={nftData.description}
            />
            <CompanyDetails metadata={metadata || initialNFTData} />
          </MainContent>
          <SideContent>
            <BuyPanel
              price={listing?.price}
              isAuction={listing?.isAuction}
              currentBid={listing?.currentBid}
              timeRemaining={listing?.timeRemaining}
              isOwner={owner === address}
              onBuy={handleBuy}
              onBid={handleBid}
              bidAmount={bidAmount}
              setBidAmount={setBidAmount}
            />
            <RevenuePanel
              totalRevenue={revenueInfo?.totalRevenue}
              lastPayout={revenueInfo?.lastPayout}
              nextPayout={revenueInfo?.nextPayout}
              availableRevenue={revenueInfo?.availableRevenue}
              isOwner={owner === address}
              onClaim={handleClaim}
            />
          </SideContent>
        </DetailContainer>
      </Container>
    );
  }, [metadata, listing, owner, address, revenueInfo, bidAmount, handleBuy, handleBid, handleClaim]);

  return (
    <DetailPageContainer>
      {renderedContent || (
        <Container>
          <div style={{ textAlign: 'center', padding: '2rem' }}>
            Loading NFT details...
          </div>
        </Container>
      )}
    </DetailPageContainer>
  );
};


export default NFTDetail;
