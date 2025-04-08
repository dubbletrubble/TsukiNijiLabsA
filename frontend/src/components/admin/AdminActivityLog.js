import React, { useState, useEffect } from 'react';
import {
  AdminSection,
  AdminTitle,
  AdminCard,
  AdminBadge,
  AdminButton,
  AdminGrid
} from './AdminStyles';

const AdminActivityLog = ({ contracts }) => {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    fetchActivities();
  }, [contracts, filter]);

  const fetchActivities = async () => {
    if (!contracts.companyNFT || !contracts.marketplace || !contracts.revenueRouter) return;

    setLoading(true);
    try {
      // Fetch relevant events from all contracts
      const [
        mintEvents,
        pauseEvents,
        feeEvents,
        roleEvents
      ] = await Promise.all([
        // NFT minting events
        contracts.companyNFT.queryFilter(contracts.companyNFT.filters.Transfer(ethers.constants.AddressZero)),
        // Pause/unpause events from all contracts
        Promise.all([
          contracts.companyNFT.queryFilter(contracts.companyNFT.filters.Paused()),
          contracts.companyNFT.queryFilter(contracts.companyNFT.filters.Unpaused()),
          contracts.marketplace.queryFilter(contracts.marketplace.filters.Paused()),
          contracts.marketplace.queryFilter(contracts.marketplace.filters.Unpaused()),
          contracts.revenueRouter.queryFilter(contracts.revenueRouter.filters.Paused()),
          contracts.revenueRouter.queryFilter(contracts.revenueRouter.filters.Unpaused())
        ]),
        // Fee update events
        contracts.revenueRouter.queryFilter(contracts.revenueRouter.filters.PlatformFeeUpdated()),
        // Role assignment events
        contracts.companyNFT.queryFilter(contracts.companyNFT.filters.RoleGranted())
      ]);

      // Format events into activities
      const allActivities = [
        ...mintEvents.map(event => ({
          type: 'mint',
          timestamp: event.blockTimestamp,
          data: {
            tokenId: event.args.tokenId.toString(),
            to: event.args.to
          },
          txHash: event.transactionHash
        })),
        ...pauseEvents.flat().map(event => ({
          type: event.event.toLowerCase(),
          timestamp: event.blockTimestamp,
          data: {
            contract: event.address
          },
          txHash: event.transactionHash
        })),
        ...feeEvents.map(event => ({
          type: 'feeUpdate',
          timestamp: event.blockTimestamp,
          data: {
            newFee: event.args.newFee.toString()
          },
          txHash: event.transactionHash
        })),
        ...roleEvents.map(event => ({
          type: 'roleGranted',
          timestamp: event.blockTimestamp,
          data: {
            role: event.args.role,
            account: event.args.account,
            sender: event.args.sender
          },
          txHash: event.transactionHash
        }))
      ];

      // Sort by timestamp (most recent first) and filter if needed
      const filteredActivities = filter === 'all'
        ? allActivities
        : allActivities.filter(activity => activity.type === filter);

      setActivities(filteredActivities.sort((a, b) => b.timestamp - a.timestamp));
    } catch (error) {
      console.error("Error fetching activities:", error);
    } finally {
      setLoading(false);
    }
  };

  const formatTimestamp = (timestamp) => {
    return new Date(timestamp * 1000).toLocaleString();
  };

  const getActivityDescription = (activity) => {
    switch (activity.type) {
      case 'mint':
        return 'NFT #' + activity.data.tokenId + ' minted to ' + activity.data.to.slice(0, 6) + '...' + activity.data.to.slice(-4);
      case 'paused':
        return 'Contract ' + activity.data.contract.slice(0, 6) + '...' + activity.data.contract.slice(-4) + ' paused';
      case 'unpaused':
        return 'Contract ' + activity.data.contract.slice(0, 6) + '...' + activity.data.contract.slice(-4) + ' unpaused';
      case 'feeUpdate':
        return 'Platform fee updated to ' + (activity.data.newFee / 100).toFixed(2) + '%';
      case 'roleGranted':
        return 'Role granted to ' + activity.data.account.slice(0, 6) + '...' + activity.data.account.slice(-4);
      default:
        return 'Unknown activity';
    }
  };

  const getActivityBadgeType = (type) => {
    switch (type) {
      case 'mint':
        return 'success';
      case 'paused':
        return 'warning';
      case 'unpaused':
        return 'success';
      case 'feeUpdate':
        return 'warning';
      case 'roleGranted':
        return 'success';
      default:
        return 'warning';
    }
  };

  return (
    <AdminSection>
      <AdminTitle>Activity Log</AdminTitle>

      <div style={{ marginBottom: '1rem' }}>
        <AdminButton
          onClick={() => setFilter('all')}
          variant={filter === 'all' ? 'success' : undefined}
          style={{ marginRight: '0.5rem' }}
        >
          All
        </AdminButton>
        <AdminButton
          onClick={() => setFilter('mint')}
          variant={filter === 'mint' ? 'success' : undefined}
          style={{ marginRight: '0.5rem' }}
        >
          Mints
        </AdminButton>
        <AdminButton
          onClick={() => setFilter('paused')}
          variant={filter === 'paused' ? 'success' : undefined}
          style={{ marginRight: '0.5rem' }}
        >
          Pauses
        </AdminButton>
        <AdminButton
          onClick={() => setFilter('feeUpdate')}
          variant={filter === 'feeUpdate' ? 'success' : undefined}
        >
          Fee Updates
        </AdminButton>
      </div>

      {loading ? (
        <AdminCard>Loading activities...</AdminCard>
      ) : activities.length === 0 ? (
        <AdminCard>No activities found</AdminCard>
      ) : (
        <AdminGrid>
          {activities.map((activity, index) => (
            <AdminCard key={activity.txHash + index}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                <AdminBadge type={getActivityBadgeType(activity.type)}>
                  {activity.type.charAt(0).toUpperCase() + activity.type.slice(1)}
                </AdminBadge>
                <small>{formatTimestamp(activity.timestamp)}</small>
              </div>
              <p>{getActivityDescription(activity)}</p>
              <small style={{ color: 'rgba(255,255,255,0.5)' }}>
                Tx: {activity.txHash.slice(0, 6)}...{activity.txHash.slice(-4)}
              </small>
            </AdminCard>
          ))}
        </AdminGrid>
      )}
    </AdminSection>
  );
};

export default AdminActivityLog;
