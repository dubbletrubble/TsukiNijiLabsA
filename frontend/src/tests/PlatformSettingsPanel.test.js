import React from 'react';
import { screen, fireEvent, waitFor } from '@testing-library/react';
import { ethers } from 'ethers';
import PlatformSettingsPanel from '../components/admin/PlatformSettingsPanel';
import { renderWithProviders, createMockContracts } from './test-utils';

describe('PlatformSettingsPanel', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('loads and displays current settings', async () => {
    const mockSettings = {
      platformFee: '100', // 1%
      treasuryAddress: '0x1234567890123456789012345678901234567890',
      minBidIncrement: ethers.utils.parseEther('0.1'),
      auctionDuration: 7 * 24 * 3600 // 7 days in seconds
    };

    const contracts = createMockContracts({
      revenueRouter: {
        getPlatformFee: jest.fn().mockResolvedValue(mockSettings.platformFee),
        getTreasuryAddress: jest.fn().mockResolvedValue(mockSettings.treasuryAddress)
      },
      marketplace: {
        getMinBidIncrement: jest.fn().mockResolvedValue(mockSettings.minBidIncrement),
        getMinAuctionDuration: jest.fn().mockResolvedValue(mockSettings.auctionDuration)
      }
    });

    renderWithProviders(<PlatformSettingsPanel contracts={contracts} />);

    await waitFor(() => {
      expect(screen.getByDisplayValue('100')).toBeInTheDocument(); // Platform fee
      expect(screen.getByDisplayValue(mockSettings.treasuryAddress)).toBeInTheDocument();
      expect(screen.getByDisplayValue('0.1')).toBeInTheDocument(); // Min bid increment
      expect(screen.getByDisplayValue('7')).toBeInTheDocument(); // Auction duration in days
    });
  });

  it('validates platform fee input', async () => {
    const contracts = createMockContracts();
    renderWithProviders(<PlatformSettingsPanel contracts={contracts} />);

    const feeInput = screen.getByLabelText(/platform fee/i);
    fireEvent.change(feeInput, { target: { value: '15000' } }); // 150% is invalid

    const updateButton = screen.getByText(/update fee/i);
    fireEvent.click(updateButton);

    expect(await screen.findByText(/invalid platformfee value/i)).toBeInTheDocument();
  });

  it('validates treasury address input', async () => {
    const contracts = createMockContracts();
    renderWithProviders(<PlatformSettingsPanel contracts={contracts} />);

    const addressInput = screen.getByLabelText(/treasury wallet address/i);
    fireEvent.change(addressInput, { target: { value: 'invalid-address' } });

    const updateButton = screen.getByText(/update treasury/i);
    fireEvent.click(updateButton);

    expect(await screen.findByText(/invalid treasuryaddress value/i)).toBeInTheDocument();
  });

  it('validates minimum bid increment input', async () => {
    const contracts = createMockContracts();
    renderWithProviders(<PlatformSettingsPanel contracts={contracts} />);

    const bidInput = screen.getByLabelText(/minimum bid increment/i);
    fireEvent.change(bidInput, { target: { value: '-1' } });

    const updateButton = screen.getByText(/update bid increment/i);
    fireEvent.click(updateButton);

    expect(await screen.findByText(/invalid minbidincrement value/i)).toBeInTheDocument();
  });

  it('validates auction duration input', async () => {
    const contracts = createMockContracts();
    renderWithProviders(<PlatformSettingsPanel contracts={contracts} />);

    const durationInput = screen.getByLabelText(/minimum auction duration/i);
    fireEvent.change(durationInput, { target: { value: '3' } }); // Less than 7 days

    const updateButton = screen.getByText(/update duration/i);
    fireEvent.click(updateButton);

    expect(await screen.findByText(/invalid auctionduration value/i)).toBeInTheDocument();
  });

  it('successfully updates platform fee', async () => {
    const mockSetPlatformFee = jest.fn().mockResolvedValue({ wait: () => Promise.resolve() });
    const contracts = createMockContracts({
      revenueRouter: {
        setPlatformFee: mockSetPlatformFee
      }
    });

    renderWithProviders(<PlatformSettingsPanel contracts={contracts} />);

    const feeInput = screen.getByLabelText(/platform fee/i);
    fireEvent.change(feeInput, { target: { value: '500' } }); // 5%

    const updateButton = screen.getByText(/update fee/i);
    fireEvent.click(updateButton);

    await waitFor(() => {
      expect(mockSetPlatformFee).toHaveBeenCalledWith('500');
      expect(screen.getByText(/platformfee updated successfully/i)).toBeInTheDocument();
    });
  });

  it('handles update errors gracefully', async () => {
    const contracts = createMockContracts({
      revenueRouter: {
        setPlatformFee: jest.fn().mockRejectedValue(new Error('Update failed'))
      }
    });

    renderWithProviders(<PlatformSettingsPanel contracts={contracts} />);

    const feeInput = screen.getByLabelText(/platform fee/i);
    fireEvent.change(feeInput, { target: { value: '500' } });

    const updateButton = screen.getByText(/update fee/i);
    fireEvent.click(updateButton);

    await waitFor(() => {
      expect(screen.getByText(/failed to update platformfee/i)).toBeInTheDocument();
    });
  });

  it('disables inputs during updates', async () => {
    const mockSetPlatformFee = jest.fn().mockImplementation(() => new Promise(resolve => setTimeout(resolve, 100)));
    const contracts = createMockContracts({
      revenueRouter: {
        setPlatformFee: mockSetPlatformFee
      }
    });

    renderWithProviders(<PlatformSettingsPanel contracts={contracts} />);

    const feeInput = screen.getByLabelText(/platform fee/i);
    const updateButton = screen.getByText(/update fee/i);

    fireEvent.change(feeInput, { target: { value: '500' } });
    fireEvent.click(updateButton);

    expect(updateButton).toBeDisabled();
    expect(feeInput).toBeDisabled();

    await waitFor(() => {
      expect(updateButton).not.toBeDisabled();
      expect(feeInput).not.toBeDisabled();
    });
  });
});
