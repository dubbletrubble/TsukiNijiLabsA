import React from 'react';
import { screen, fireEvent, waitFor } from '@testing-library/react';
import ContractControlPanel from '../components/admin/ContractControlPanel';
import { renderWithProviders, createMockContracts } from './test-utils';

describe('ContractControlPanel', () => {
  beforeEach(() => {
    window.confirm = jest.fn();
    jest.clearAllMocks();
  });

  it('loads and displays contract states', async () => {
    const contracts = createMockContracts({
      companyNFT: {
        paused: jest.fn().mockResolvedValue(true)
      },
      marketplace: {
        paused: jest.fn().mockResolvedValue(false)
      },
      revenueRouter: {
        paused: jest.fn().mockResolvedValue(false)
      }
    });

    renderWithProviders(<ContractControlPanel contracts={contracts} />);

    await waitFor(() => {
      expect(screen.getByText(/companyNFT/i)).toBeInTheDocument();
      expect(screen.getByText(/marketplace/i)).toBeInTheDocument();
      expect(screen.getByText(/revenueRouter/i)).toBeInTheDocument();
    });

    // CompanyNFT should show as paused
    const pausedBadges = screen.getAllByText('Paused');
    expect(pausedBadges).toHaveLength(1);

    // Other contracts should show as active
    const activeBadges = screen.getAllByText('Active');
    expect(activeBadges).toHaveLength(2);
  });

  it('requires confirmation before pausing a contract', async () => {
    window.confirm.mockImplementation(() => false);
    const mockPause = jest.fn();
    
    const contracts = createMockContracts({
      companyNFT: {
        paused: jest.fn().mockResolvedValue(false),
        pause: mockPause
      }
    });

    renderWithProviders(<ContractControlPanel contracts={contracts} />);

    await waitFor(() => {
      const pauseButton = screen.getByText(/pause contract/i);
      fireEvent.click(pauseButton);
    });

    expect(window.confirm).toHaveBeenCalledWith(expect.stringContaining('pause'));
    expect(mockPause).not.toHaveBeenCalled();
  });

  it('successfully pauses a contract', async () => {
    window.confirm.mockImplementation(() => true);
    const mockPause = jest.fn().mockResolvedValue({ wait: () => Promise.resolve() });
    
    const contracts = createMockContracts({
      companyNFT: {
        paused: jest.fn()
          .mockResolvedValueOnce(false)
          .mockResolvedValueOnce(true),
        pause: mockPause
      }
    });

    renderWithProviders(<ContractControlPanel contracts={contracts} />);

    await waitFor(() => {
      const pauseButton = screen.getByText(/pause contract/i);
      fireEvent.click(pauseButton);
    });

    expect(mockPause).toHaveBeenCalled();
    await waitFor(() => {
      expect(screen.getByText(/successfully paused companyNFT/i)).toBeInTheDocument();
    });
  });

  it('successfully unpauses a contract', async () => {
    window.confirm.mockImplementation(() => true);
    const mockUnpause = jest.fn().mockResolvedValue({ wait: () => Promise.resolve() });
    
    const contracts = createMockContracts({
      companyNFT: {
        paused: jest.fn()
          .mockResolvedValueOnce(true)
          .mockResolvedValueOnce(false),
        unpause: mockUnpause
      }
    });

    renderWithProviders(<ContractControlPanel contracts={contracts} />);

    await waitFor(() => {
      const resumeButton = screen.getByText(/resume contract/i);
      fireEvent.click(resumeButton);
    });

    expect(mockUnpause).toHaveBeenCalled();
    await waitFor(() => {
      expect(screen.getByText(/successfully resumed companyNFT/i)).toBeInTheDocument();
    });
  });

  it('handles pause/unpause errors gracefully', async () => {
    window.confirm.mockImplementation(() => true);
    const mockPause = jest.fn().mockRejectedValue(new Error('Pause failed'));
    
    const contracts = createMockContracts({
      companyNFT: {
        paused: jest.fn().mockResolvedValue(false),
        pause: mockPause
      }
    });

    renderWithProviders(<ContractControlPanel contracts={contracts} />);

    await waitFor(() => {
      const pauseButton = screen.getByText(/pause contract/i);
      fireEvent.click(pauseButton);
    });

    await waitFor(() => {
      expect(screen.getByText(/failed to pause companyNFT/i)).toBeInTheDocument();
    });
  });

  it('disables buttons during transactions', async () => {
    window.confirm.mockImplementation(() => true);
    const mockPause = jest.fn().mockImplementation(() => new Promise(resolve => setTimeout(resolve, 100)));
    
    const contracts = createMockContracts({
      companyNFT: {
        paused: jest.fn().mockResolvedValue(false),
        pause: mockPause
      }
    });

    renderWithProviders(<ContractControlPanel contracts={contracts} />);

    await waitFor(() => {
      const pauseButton = screen.getByText(/pause contract/i);
      fireEvent.click(pauseButton);
      expect(pauseButton).toBeDisabled();
    });
  });
});
