import React, { useState, useEffect } from 'react';
import { useAccount } from 'wagmi';
import { ethers } from 'ethers';
import {
  AdminSection,
  AdminTitle,
  AdminFormGroup,
  AdminInput,
  AdminButton,
  AdminAlert,
  AdminLabel,
  AdminGrid,
  AdminCard
} from './AdminStyles';

const PlatformSettingsPanel = ({ contracts }) => {
  const { address } = useAccount();
  const [settings, setSettings] = useState({
    platformFee: '',
    treasuryAddress: '',
    minBidIncrement: '',
    auctionDuration: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    fetchCurrentSettings();
  }, [contracts]);

  const fetchCurrentSettings = async () => {
    if (!contracts.revenueRouter || !contracts.marketplace) return;

    try {
      const [
        platformFee,
        treasuryAddress,
        minBidIncrement,
        auctionDuration
      ] = await Promise.all([
        contracts.revenueRouter.getPlatformFee(),
        contracts.revenueRouter.getTreasuryAddress(),
        contracts.marketplace.getMinBidIncrement(),
        contracts.marketplace.getMinAuctionDuration()
      ]);

      setSettings({
        platformFee: platformFee.toString(),
        treasuryAddress,
        minBidIncrement: ethers.utils.formatEther(minBidIncrement),
        auctionDuration: (auctionDuration / (24 * 3600)).toString() // Convert seconds to days
      });
    } catch (error) {
      console.error("Error fetching settings:", error);
      setError("Failed to load current settings");
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setSettings(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const validateSettings = (setting, value) => {
    switch (setting) {
      case 'platformFee':
        return value >= 0 && value <= 10000; // 0-100% in basis points
      case 'treasuryAddress':
        return ethers.utils.isAddress(value);
      case 'minBidIncrement':
        return parseFloat(value) > 0;
      case 'auctionDuration':
        return parseInt(value) >= 7; // Minimum 7 days
      default:
        return true;
    }
  };

  const handleUpdateSetting = async (setting) => {
    if (!validateSettings(setting, settings[setting])) {
      setError('Invalid ' + setting + ' value');
      return;
    }

    setLoading(true);
    setError('');
    setSuccess('');

    try {
      let tx;
      switch (setting) {
        case 'platformFee':
          tx = await contracts.revenueRouter.setPlatformFee(settings.platformFee);
          break;
        case 'treasuryAddress':
          tx = await contracts.revenueRouter.setTreasuryAddress(settings.treasuryAddress);
          break;
        case 'minBidIncrement':
          const bidIncrementWei = ethers.utils.parseEther(settings.minBidIncrement);
          tx = await contracts.marketplace.setMinBidIncrement(bidIncrementWei);
          break;
        case 'auctionDuration':
          const durationInSeconds = parseInt(settings.auctionDuration) * 24 * 3600;
          tx = await contracts.marketplace.setMinAuctionDuration(durationInSeconds);
          break;
      }

      await tx.wait();
      setSuccess(setting + ' updated successfully');
    } catch (err) {
      setError(err.message || 'Failed to update ' + setting);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AdminSection>
      <AdminTitle>Platform Settings</AdminTitle>

      {error && <AdminAlert type="warning">{error}</AdminAlert>}
      {success && <AdminAlert type="success">{success}</AdminAlert>}

      <AdminGrid>
        <AdminCard>
          <AdminFormGroup>
            <AdminLabel>Platform Fee (basis points, 100 = 1%)</AdminLabel>
            <AdminInput
              type="number"
              name="platformFee"
              value={settings.platformFee}
              onChange={handleInputChange}
              placeholder="Enter platform fee"
              min="0"
              max="10000"
              disabled={loading}
            />
            <AdminButton
              onClick={() => handleUpdateSetting('platformFee')}
              disabled={loading}
            >
              Update Fee
            </AdminButton>
          </AdminFormGroup>
        </AdminCard>

        <AdminCard>
          <AdminFormGroup>
            <AdminLabel>Treasury Wallet Address</AdminLabel>
            <AdminInput
              type="text"
              name="treasuryAddress"
              value={settings.treasuryAddress}
              onChange={handleInputChange}
              placeholder="0x..."
              disabled={loading}
            />
            <AdminButton
              onClick={() => handleUpdateSetting('treasuryAddress')}
              disabled={loading}
            >
              Update Treasury
            </AdminButton>
          </AdminFormGroup>
        </AdminCard>

        <AdminCard>
          <AdminFormGroup>
            <AdminLabel>Minimum Bid Increment (TSKJ)</AdminLabel>
            <AdminInput
              type="number"
              name="minBidIncrement"
              value={settings.minBidIncrement}
              onChange={handleInputChange}
              placeholder="Enter minimum bid increment"
              min="0"
              step="0.1"
              disabled={loading}
            />
            <AdminButton
              onClick={() => handleUpdateSetting('minBidIncrement')}
              disabled={loading}
            >
              Update Bid Increment
            </AdminButton>
          </AdminFormGroup>
        </AdminCard>

        <AdminCard>
          <AdminFormGroup>
            <AdminLabel>Minimum Auction Duration (days)</AdminLabel>
            <AdminInput
              type="number"
              name="auctionDuration"
              value={settings.auctionDuration}
              onChange={handleInputChange}
              placeholder="Enter minimum duration in days"
              min="7"
              disabled={loading}
            />
            <AdminButton
              onClick={() => handleUpdateSetting('auctionDuration')}
              disabled={loading}
            >
              Update Duration
            </AdminButton>
          </AdminFormGroup>
        </AdminCard>
      </AdminGrid>
    </AdminSection>
  );
};

export default PlatformSettingsPanel;
