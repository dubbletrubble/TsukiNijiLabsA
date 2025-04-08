import React from 'react';
import { screen, fireEvent, waitFor } from '@testing-library/react';
import { useAccount } from 'wagmi';
import AdminPanel from '../pages/AdminPanel';
import { renderWithProviders, mockEthereum, cleanupMocks, createMockContracts } from './test-utils';

// Mock wagmi hooks
jest.mock('wagmi', () => ({
  useAccount: jest.fn()
}));

describe('AdminPanel', () => {
  const mockAddress = '0x1234567890123456789012345678901234567890';
  
  beforeEach(() => {
    mockEthereum();
    useAccount.mockReturnValue({ address: mockAddress });
  });

  afterEach(() => {
    cleanupMocks();
  });

  it('shows loading state initially', () => {
    renderWithProviders(<AdminPanel />);
    expect(screen.getByText(/loading admin panel/i)).toBeInTheDocument();
  });

  it('shows connect wallet message when wallet is not connected', () => {
    useAccount.mockReturnValue({ address: null });
    renderWithProviders(<AdminPanel />);
    expect(screen.getByText(/please connect your wallet/i)).toBeInTheDocument();
  });

  it('shows access denied when user is not admin', async () => {
    const contracts = createMockContracts({
      companyNFT: {
        hasRole: jest.fn().mockResolvedValue(false)
      }
    });

    renderWithProviders(<AdminPanel />, { contracts });

    await waitFor(() => {
      expect(screen.getByText(/access denied/i)).toBeInTheDocument();
    });
  });

  it('renders all admin components when user is admin', async () => {
    const contracts = createMockContracts({
      companyNFT: {
        hasRole: jest.fn().mockResolvedValue(true)
      }
    });

    renderWithProviders(<AdminPanel />, { contracts });

    await waitFor(() => {
      expect(screen.getByText(/admin mode/i)).toBeInTheDocument();
      expect(screen.getByText(/admin role overview/i)).toBeInTheDocument();
      expect(screen.getByText(/nft minting/i)).toBeInTheDocument();
      expect(screen.getByText(/platform settings/i)).toBeInTheDocument();
      expect(screen.getByText(/contract control/i)).toBeInTheDocument();
      expect(screen.getByText(/multi-signature actions/i)).toBeInTheDocument();
      expect(screen.getByText(/activity log/i)).toBeInTheDocument();
    });
  });

  it('initializes contracts correctly', async () => {
    const contracts = createMockContracts();
    renderWithProviders(<AdminPanel />, { contracts });

    await waitFor(() => {
      expect(contracts.companyNFT.hasRole).toHaveBeenCalledWith(
        '0x0000000000000000000000000000000000000000000000000000000000000000',
        mockAddress
      );
    });
  });

  it('handles contract initialization errors gracefully', async () => {
    console.error = jest.fn(); // Suppress error logs
    const contracts = createMockContracts({
      companyNFT: {
        hasRole: jest.fn().mockRejectedValue(new Error('Contract error'))
      }
    });

    renderWithProviders(<AdminPanel />, { contracts });

    await waitFor(() => {
      expect(screen.getByText(/access denied/i)).toBeInTheDocument();
    });
    expect(console.error).toHaveBeenCalled();
  });
});
