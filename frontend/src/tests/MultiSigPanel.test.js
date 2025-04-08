import React from 'react';
import { screen, fireEvent, waitFor } from '@testing-library/react';
import { useAccount } from 'wagmi';
import { ethers } from 'ethers';
import MultiSigPanel from '../components/admin/MultiSigPanel';
import { renderWithProviders, createMockContracts } from './test-utils';

jest.mock('wagmi', () => ({
  useAccount: jest.fn()
}));

describe('MultiSigPanel', () => {
  const mockAddress = '0x1234567890123456789012345678901234567890';
  const mockAction = {
    id: '1',
    description: 'Test action',
    proposer: '0x2234567890123456789012345678901234567890',
    signatures: [mockAddress.toLowerCase()],
    deadline: Math.floor(Date.now() / 1000) + 86400, // 24 hours from now
    executed: false
  };

  beforeEach(() => {
    useAccount.mockReturnValue({ address: mockAddress });
    jest.clearAllMocks();
  });

  it('displays pending actions', async () => {
    const mockEvent = {
      args: { actionId: ethers.BigNumber.from('1') }
    };

    const contracts = createMockContracts({
      companyNFT: {
        filters: {
          MultiSigActionProposed: jest.fn().mockReturnValue({})
        },
        queryFilter: jest.fn().mockResolvedValue([mockEvent]),
        getPendingAction: jest.fn().mockResolvedValue(mockAction),
        getActionSignatures: jest.fn().mockResolvedValue([mockAddress.toLowerCase()])
      }
    });

    renderWithProviders(<MultiSigPanel contracts={contracts} />);

    await waitFor(() => {
      expect(screen.getByText(/action #1/i)).toBeInTheDocument();
      expect(screen.getByText(/test action/i)).toBeInTheDocument();
      expect(screen.getByText(/1 signatures/i)).toBeInTheDocument();
    });
  });

  it('shows when user has signed an action', async () => {
    const mockEvent = {
      args: { actionId: ethers.BigNumber.from('1') }
    };

    const contracts = createMockContracts({
      companyNFT: {
        filters: {
          MultiSigActionProposed: jest.fn().mockReturnValue({})
        },
        queryFilter: jest.fn().mockResolvedValue([mockEvent]),
        getPendingAction: jest.fn().mockResolvedValue(mockAction),
        getActionSignatures: jest.fn().mockResolvedValue([mockAddress.toLowerCase()])
      }
    });

    renderWithProviders(<MultiSigPanel contracts={contracts} />);

    await waitFor(() => {
      expect(screen.getByText(/revoke signature/i)).toBeInTheDocument();
    });
  });

  it('shows when user has not signed an action', async () => {
    const mockEvent = {
      args: { actionId: ethers.BigNumber.from('1') }
    };

    const contracts = createMockContracts({
      companyNFT: {
        filters: {
          MultiSigActionProposed: jest.fn().mockReturnValue({})
        },
        queryFilter: jest.fn().mockResolvedValue([mockEvent]),
        getPendingAction: jest.fn().mockResolvedValue({
          ...mockAction,
          signatures: ['0x3234567890123456789012345678901234567890']
        }),
        getActionSignatures: jest.fn().mockResolvedValue(['0x3234567890123456789012345678901234567890'])
      }
    });

    renderWithProviders(<MultiSigPanel contracts={contracts} />);

    await waitFor(() => {
      expect(screen.getByText(/approve action/i)).toBeInTheDocument();
    });
  });

  it('successfully approves an action', async () => {
    const mockEvent = {
      args: { actionId: ethers.BigNumber.from('1') }
    };

    const mockSignAction = jest.fn().mockResolvedValue({ wait: () => Promise.resolve() });
    const contracts = createMockContracts({
      companyNFT: {
        filters: {
          MultiSigActionProposed: jest.fn().mockReturnValue({})
        },
        queryFilter: jest.fn().mockResolvedValue([mockEvent]),
        getPendingAction: jest.fn().mockResolvedValue({
          ...mockAction,
          signatures: []
        }),
        getActionSignatures: jest.fn().mockResolvedValue([]),
        signAction: mockSignAction
      }
    });

    renderWithProviders(<MultiSigPanel contracts={contracts} />);

    await waitFor(() => {
      const approveButton = screen.getByText(/approve action/i);
      fireEvent.click(approveButton);
    });

    expect(mockSignAction).toHaveBeenCalledWith('1');
    await waitFor(() => {
      expect(screen.getByText(/successfully signed the action/i)).toBeInTheDocument();
    });
  });

  it('successfully revokes a signature', async () => {
    const mockEvent = {
      args: { actionId: ethers.BigNumber.from('1') }
    };

    const mockRevokeSignature = jest.fn().mockResolvedValue({ wait: () => Promise.resolve() });
    const contracts = createMockContracts({
      companyNFT: {
        filters: {
          MultiSigActionProposed: jest.fn().mockReturnValue({})
        },
        queryFilter: jest.fn().mockResolvedValue([mockEvent]),
        getPendingAction: jest.fn().mockResolvedValue(mockAction),
        getActionSignatures: jest.fn().mockResolvedValue([mockAddress.toLowerCase()]),
        revokeSignature: mockRevokeSignature
      }
    });

    renderWithProviders(<MultiSigPanel contracts={contracts} />);

    await waitFor(() => {
      const revokeButton = screen.getByText(/revoke signature/i);
      fireEvent.click(revokeButton);
    });

    expect(mockRevokeSignature).toHaveBeenCalledWith('1');
    await waitFor(() => {
      expect(screen.getByText(/successfully revoked signature/i)).toBeInTheDocument();
    });
  });

  it('handles action errors gracefully', async () => {
    const mockEvent = {
      args: { actionId: ethers.BigNumber.from('1') }
    };

    const mockSignAction = jest.fn().mockRejectedValue(new Error('Signing failed'));
    const contracts = createMockContracts({
      companyNFT: {
        filters: {
          MultiSigActionProposed: jest.fn().mockReturnValue({})
        },
        queryFilter: jest.fn().mockResolvedValue([mockEvent]),
        getPendingAction: jest.fn().mockResolvedValue({
          ...mockAction,
          signatures: []
        }),
        getActionSignatures: jest.fn().mockResolvedValue([]),
        signAction: mockSignAction
      }
    });

    renderWithProviders(<MultiSigPanel contracts={contracts} />);

    await waitFor(() => {
      const approveButton = screen.getByText(/approve action/i);
      fireEvent.click(approveButton);
    });

    await waitFor(() => {
      expect(screen.getByText(/failed to sign action/i)).toBeInTheDocument();
    });
  });

  it('disables buttons for expired actions', async () => {
    const mockEvent = {
      args: { actionId: ethers.BigNumber.from('1') }
    };

    const expiredAction = {
      ...mockAction,
      deadline: Math.floor(Date.now() / 1000) - 86400 // 24 hours ago
    };

    const contracts = createMockContracts({
      companyNFT: {
        filters: {
          MultiSigActionProposed: jest.fn().mockReturnValue({})
        },
        queryFilter: jest.fn().mockResolvedValue([mockEvent]),
        getPendingAction: jest.fn().mockResolvedValue(expiredAction),
        getActionSignatures: jest.fn().mockResolvedValue([])
      }
    });

    renderWithProviders(<MultiSigPanel contracts={contracts} />);

    await waitFor(() => {
      expect(screen.getByText(/expired/i)).toBeInTheDocument();
      expect(screen.queryByText(/approve action/i)).not.toBeInTheDocument();
      expect(screen.queryByText(/revoke signature/i)).not.toBeInTheDocument();
    });
  });
});
