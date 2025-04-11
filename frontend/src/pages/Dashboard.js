import React, { useState, useEffect, useCallback } from 'react';
import { useAccount, useBalance } from 'wagmi';
import { formatEther } from 'ethers';
import { AnimatePresence } from 'framer-motion';
import { useNFTContract, useMarketplace, usePlatformToken } from '../hooks/useNFTContract';
import { useRevenueRouter } from '../hooks/useRevenueRouter';
import { contractAddresses } from '../config/web3';
import DashboardNFTCard from '../components/dashboard/DashboardNFTCard';
import TokenConversionPanel from '../components/dashboard/TokenConversionPanel';
import ActivityList from '../components/dashboard/ActivityList';
import {
  DashboardContainer,
  SummaryPanel,
  StatsCard,
  NFTGrid,
  DashboardSection,
  TokenPanel,
  Alert
} from '../components/dashboard/DashboardStyles';

const Dashboard = () => {
  const { address } = useAccount();
  const { data: ethBalance } = useBalance({ address });
  const { data: tskjBalance } = useBalance({ 
    address,
    token: contractAddresses.PlatformToken 
  });

  // Contract hooks
  const { getOwnedNFTs, getMetadata } = useNFTContract();
  const { getListing } = useMarketplace();
  const { getRevenueAvailable, claim } = useRevenueRouter();
  const { getExchangeRate } = usePlatformToken();

  // State
  const [ownedNFTs, setOwnedNFTs] = useState([]);
  const [totalRevenue] = useState(0);
  const [pendingRevenue, setPendingRevenue] = useState(0n);
  const [exchangeRate, setExchangeRate] = useState(0);
  const [activities, setActivities] = useState([]);
  const [alerts, setAlerts] = useState([]);

  // Fetch owned NFTs and their metadata
  const fetchNFTs = useCallback(async () => {
    if (!address) return;

    try {
      const nfts = await getOwnedNFTs();
      const nftPromises = nfts.map(async (tokenId) => {
        const metadata = await getMetadata(tokenId);
        const listing = await getListing(tokenId);
        const revenue = await getRevenueAvailable(tokenId);
        
        return {
          tokenId,
          metadata,
          isListed: listing?.active || false,
          availableRevenue: revenue || 0n
        };
      });

      const nftData = await Promise.all(nftPromises);
      setOwnedNFTs(nftData);

      // Calculate total and pending revenue
      const total = nftData.reduce((acc, nft) => acc + (nft.availableRevenue || 0n), 0n);
      setPendingRevenue(total);
    } catch (error) {
      console.error('Error fetching NFTs:', error);
      addAlert('error', 'Failed to load NFTs. Please try again.');
    }
  }, [address, getOwnedNFTs, getMetadata, getListing, getRevenueAvailable]);

  // Fetch exchange rate
  const fetchExchangeRate = useCallback(async () => {
    try {
      const rate = await getExchangeRate();
      setExchangeRate(Number(rate));
    } catch (error) {
      console.error('Error fetching exchange rate:', error);
    }
  }, [getExchangeRate]);

  // Handle revenue claim
  const handleClaim = useCallback(async (tokenId) => {
    try {
      await claim({ args: [tokenId] });
      addAlert('success', `Successfully claimed revenue from NFT #${tokenId}`);
      
      // Add to activity list
      const revenue = ownedNFTs.find(nft => nft.tokenId === tokenId)?.availableRevenue;
      setActivities(prev => [{
        id: Date.now(),
        type: 'claim',
        tokenId,
        amount: revenue,
        token: 'TSKJ',
        timestamp: new Date(),
        status: 'success'
      }, ...prev]);

      // Refresh NFT data
      fetchNFTs();
    } catch (error) {
      console.error('Error claiming revenue:', error);
      addAlert('error', 'Failed to claim revenue. Please try again.');
    }
  }, [claim, ownedNFTs, fetchNFTs]);

  // Alert management
  const addAlert = (type, message) => {
    const id = Date.now();
    setAlerts(prev => [...prev, { id, type, message }]);
    setTimeout(() => removeAlert(id), 5000);
  };

  const removeAlert = (id) => {
    setAlerts(prev => prev.filter(alert => alert.id !== id));
  };

  // Initial data fetch
  useEffect(() => {
    if (address) {
      fetchNFTs();
      fetchExchangeRate();
    }
  }, [address, fetchNFTs, fetchExchangeRate]);

  if (!address) {
    return (
      <DashboardContainer>
        <Alert type="warning">
          Please connect your wallet to view your dashboard.
        </Alert>
      </DashboardContainer>
    );
  }

  return (
    <DashboardContainer>
      <AnimatePresence>
        {alerts.map(alert => (
          <Alert
            key={alert.id}
            type={alert.type}
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            {alert.message}
            <button onClick={() => removeAlert(alert.id)}>×</button>
          </Alert>
        ))}
      </AnimatePresence>

      <SummaryPanel
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <StatsCard>
          <h3>Total NFTs Owned</h3>
          <p>{ownedNFTs.length}</p>
        </StatsCard>
        <StatsCard>
          <h3>Total Revenue Earned</h3>
          <p>{formatEther(totalRevenue)} $TSKJ</p>
        </StatsCard>
        <StatsCard>
          <h3>Pending Revenue</h3>
          <p>{formatEther(pendingRevenue)} $TSKJ</p>
        </StatsCard>
        <StatsCard>
          <h3>$TSKJ Balance</h3>
          <p>{formatEther(tskjBalance?.value || 0n)} $TSKJ</p>
        </StatsCard>
      </SummaryPanel>

      <DashboardSection>
        <h2>Your NFTs</h2>
        <NFTGrid>
          {ownedNFTs.map(nft => (
            <DashboardNFTCard
              key={nft.tokenId}
              {...nft}
              onClaim={handleClaim}
            />
          ))}
        </NFTGrid>
      </DashboardSection>

      <TokenPanel>
        <TokenConversionPanel
          ethBalance={ethBalance?.value}
          tskjBalance={tskjBalance?.value}
          exchangeRate={exchangeRate}
        />
        <DashboardSection>
          <h2>Recent Activity</h2>
          <ActivityList activities={activities} />
        </DashboardSection>
      </TokenPanel>
    </DashboardContainer>
  );
};

export default Dashboard;
