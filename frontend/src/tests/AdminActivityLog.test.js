import React from 'react';
import { screen, fireEvent, waitFor } from '@testing-library/react';
import { ethers } from 'ethers';
import AdminActivityLog from '../components/admin/AdminActivityLog';
import { renderWithProviders, createMockContracts } from './test-utils';

describe('AdminActivityLog', () => {
  const mockEvents = {
    mint: {
      blockTimestamp: Math.floor(Date.now() / 1000),
      args: {
        tokenId: ethers.BigNumber.from('1'),
        to: '0x1234567890123456789012345678901234567890'
      },
      transactionHash: '0xabcd...'
    },
    pause: {
      blockTimestamp: Math.floor(Date.now() / 1000),
      event: 'Paused',
      address: '0x2234567890123456789012345678901234567890',
      transactionHash: '0xdef...'
    },
    feeUpdate: {
      blockTimestamp: Math.floor(Date.now() / 1000),
      args: {
        newFee: ethers.BigNumber.from('500')
      },
      transactionHash: '0xghij...'
    },
    roleGrant: {
      blockTimestamp: Math.floor(Date.now() / 1000),
      args: {
        role: ethers.constants.HashZero,
        account: '0x3234567890123456789012345678901234567890',
        sender: '0x4234567890123456789012345678901234567890'
      },
      transactionHash: '0xklmn...'
    }
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('displays loading state initially', () => {
    const contracts = createMockContracts();
    renderWithProviders(<AdminActivityLog contracts={contracts} />);
    expect(screen.getByText(/loading activities/i)).toBeInTheDocument();
  });

  it('displays no activities message when empty', async () => {
    const contracts = createMockContracts({
      companyNFT: {
        queryFilter: jest.fn().mockResolvedValue([])
      }
    });

    renderWithProviders(<AdminActivityLog contracts={contracts} />);

    await waitFor(() => {
      expect(screen.getByText(/no activities found/i)).toBeInTheDocument();
    });
  });

  it('displays all types of activities', async () => {
    const contracts = createMockContracts({
      companyNFT: {
        queryFilter: jest.fn()
          .mockResolvedValueOnce([mockEvents.mint]) // Transfer events
          .mockResolvedValueOnce([mockEvents.pause]) // Pause events
          .mockResolvedValueOnce([]) // Unpause events
          .mockResolvedValueOnce([]) // Marketplace pause events
          .mockResolvedValueOnce([]) // Marketplace unpause events
          .mockResolvedValueOnce([]) // Router pause events
          .mockResolvedValueOnce([]) // Router unpause events
          .mockResolvedValueOnce([mockEvents.feeUpdate]) // Fee update events
          .mockResolvedValueOnce([mockEvents.roleGrant]), // Role grant events
        filters: {
          Transfer: jest.fn(),
          Paused: jest.fn(),
          Unpaused: jest.fn(),
          PlatformFeeUpdated: jest.fn(),
          RoleGranted: jest.fn()
        }
      }
    });

    renderWithProviders(<AdminActivityLog contracts={contracts} />);

    await waitFor(() => {
      // Check for mint activity
      expect(screen.getByText(/nft #1 minted/i)).toBeInTheDocument();
      
      // Check for pause activity
      expect(screen.getByText(/contract.*paused/i)).toBeInTheDocument();
      
      // Check for fee update activity
      expect(screen.getByText(/platform fee updated to 5%/i)).toBeInTheDocument();
      
      // Check for role grant activity
      expect(screen.getByText(/role granted to/i)).toBeInTheDocument();
    });
  });

  it('filters activities correctly', async () => {
    const contracts = createMockContracts({
      companyNFT: {
        queryFilter: jest.fn()
          .mockResolvedValueOnce([mockEvents.mint])
          .mockResolvedValueOnce([mockEvents.pause])
          .mockResolvedValueOnce([])
          .mockResolvedValueOnce([])
          .mockResolvedValueOnce([])
          .mockResolvedValueOnce([])
          .mockResolvedValueOnce([])
          .mockResolvedValueOnce([mockEvents.feeUpdate])
          .mockResolvedValueOnce([mockEvents.roleGrant]),
        filters: {
          Transfer: jest.fn(),
          Paused: jest.fn(),
          Unpaused: jest.fn(),
          PlatformFeeUpdated: jest.fn(),
          RoleGranted: jest.fn()
        }
      }
    });

    renderWithProviders(<AdminActivityLog contracts={contracts} />);

    // Wait for activities to load
    await waitFor(() => {
      expect(screen.getByText(/nft #1 minted/i)).toBeInTheDocument();
    });

    // Click Mints filter
    fireEvent.click(screen.getByText(/mints/i));

    await waitFor(() => {
      expect(screen.getByText(/nft #1 minted/i)).toBeInTheDocument();
      expect(screen.queryByText(/contract.*paused/i)).not.toBeInTheDocument();
    });

    // Click Pauses filter
    fireEvent.click(screen.getByText(/pauses/i));

    await waitFor(() => {
      expect(screen.queryByText(/nft #1 minted/i)).not.toBeInTheDocument();
      expect(screen.getByText(/contract.*paused/i)).toBeInTheDocument();
    });
  });

  it('formats timestamps correctly', async () => {
    const now = Math.floor(Date.now() / 1000);
    const mockEvent = {
      ...mockEvents.mint,
      blockTimestamp: now
    };

    const contracts = createMockContracts({
      companyNFT: {
        queryFilter: jest.fn()
          .mockResolvedValueOnce([mockEvent])
          .mockResolvedValueOnce([])
          .mockResolvedValueOnce([])
          .mockResolvedValueOnce([])
          .mockResolvedValueOnce([])
          .mockResolvedValueOnce([])
          .mockResolvedValueOnce([])
          .mockResolvedValueOnce([])
          .mockResolvedValueOnce([]),
        filters: {
          Transfer: jest.fn(),
          Paused: jest.fn(),
          Unpaused: jest.fn(),
          PlatformFeeUpdated: jest.fn(),
          RoleGranted: jest.fn()
        }
      }
    });

    renderWithProviders(<AdminActivityLog contracts={contracts} />);

    await waitFor(() => {
      const formattedDate = new Date(now * 1000).toLocaleString();
      expect(screen.getByText(formattedDate)).toBeInTheDocument();
    });
  });

  it('handles errors gracefully', async () => {
    console.error = jest.fn(); // Suppress error logs
    
    const contracts = createMockContracts({
      companyNFT: {
        queryFilter: jest.fn().mockRejectedValue(new Error('Failed to fetch events')),
        filters: {
          Transfer: jest.fn(),
          Paused: jest.fn(),
          Unpaused: jest.fn(),
          PlatformFeeUpdated: jest.fn(),
          RoleGranted: jest.fn()
        }
      }
    });

    renderWithProviders(<AdminActivityLog contracts={contracts} />);

    await waitFor(() => {
      expect(screen.getByText(/no activities found/i)).toBeInTheDocument();
    });
  });
});
