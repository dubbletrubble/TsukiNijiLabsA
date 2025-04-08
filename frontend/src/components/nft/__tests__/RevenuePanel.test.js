/**
 * @jest-environment jsdom
 */

import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { formatEther } from 'viem';
import RevenuePanel from '../RevenuePanel';

describe('RevenuePanel', () => {
  const defaultProps = {
    totalRevenue: 500000n,
    lastPayout: BigInt(Math.floor(Date.now() / 1000) - 86400), // 24h ago
    nextPayout: BigInt(Math.floor(Date.now() / 1000) + 86400), // 24h from now
    availableRevenue: 50000n,
    isOwner: true,
    onClaim: jest.fn(),
    isLoading: false
  };

  const renderRevenuePanel = (props = {}) => {
    return render(<RevenuePanel {...defaultProps} {...props} />);
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders revenue information correctly', () => {
    renderRevenuePanel();

    // Check total revenue
    expect(screen.getByText(`${formatEther(defaultProps.totalRevenue)} $TSKJ`)).toBeInTheDocument();

    // Check last payout date
    const lastPayoutDate = new Date(Number(defaultProps.lastPayout) * 1000).toLocaleDateString();
    expect(screen.getByText(lastPayoutDate)).toBeInTheDocument();

    // Check next payout date
    const nextPayoutDate = new Date(Number(defaultProps.nextPayout) * 1000).toLocaleDateString();
    expect(screen.getByText(nextPayoutDate)).toBeInTheDocument();
  });

  it('shows claim button for owners with available revenue', () => {
    renderRevenuePanel();

    const claimButton = screen.getByText('Claim Revenue');
    expect(claimButton).toBeInTheDocument();
    expect(claimButton).toBeEnabled();

    fireEvent.click(claimButton);
    expect(defaultProps.onClaim).toHaveBeenCalled();
  });

  it('disables claim button when loading', () => {
    renderRevenuePanel({ isLoading: true });

    const claimButton = screen.getByText('Claim Revenue');
    expect(claimButton).toBeDisabled();
  });

  it('hides claim button for non-owners', () => {
    renderRevenuePanel({ isOwner: false });

    expect(screen.queryByText('Claim Revenue')).not.toBeInTheDocument();
  });

  it('hides claim button when no revenue is available', () => {
    renderRevenuePanel({ availableRevenue: 0n });

    expect(screen.queryByText('Claim Revenue')).not.toBeInTheDocument();
  });

  it('formats revenue amounts correctly', () => {
    const props = {
      totalRevenue: 1234567890n,
      availableRevenue: 987654321n
    };
    renderRevenuePanel(props);

    expect(screen.getByText(`${formatEther(props.totalRevenue)} $TSKJ`)).toBeInTheDocument();
  });

  it('handles undefined values gracefully', () => {
    renderRevenuePanel({
      totalRevenue: undefined,
      lastPayout: undefined,
      nextPayout: undefined,
      availableRevenue: undefined
    });

    expect(screen.getByText('0 $TSKJ')).toBeInTheDocument();
    expect(screen.getByText('N/A')).toBeInTheDocument();
  });
});
