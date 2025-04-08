/**
 * @jest-environment jsdom
 */

import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { formatEther } from 'viem';
import BuyPanel from '../BuyPanel';

describe('BuyPanel', () => {
  const defaultProps = {
    price: 100000n,
    isAuction: false,
    currentBid: 0n,
    timeRemaining: '2d 5h',
    isOwner: false,
    onBuy: jest.fn(),
    onBid: jest.fn(),
    bidAmount: '',
    setBidAmount: jest.fn(),
    error: '',
    isLoading: false
  };

  const renderBuyPanel = (props = {}) => {
    return render(<BuyPanel {...defaultProps} {...props} />);
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Fixed Price Mode', () => {
    it('renders buy now button for fixed price listings', () => {
      renderBuyPanel();

      const buyButton = screen.getByText('Buy Now');
      expect(buyButton).toBeInTheDocument();
      expect(screen.getByText(`${formatEther(defaultProps.price)} $TSKJ`)).toBeInTheDocument();
    });

    it('disables buy button when loading', () => {
      renderBuyPanel({ isLoading: true });

      const buyButton = screen.getByText('Buy Now');
      expect(buyButton).toBeDisabled();
    });

    it('hides buy button for owners', () => {
      renderBuyPanel({ isOwner: true });

      expect(screen.queryByText('Buy Now')).not.toBeInTheDocument();
    });

    it('displays error message when present', () => {
      const error = 'Insufficient balance';
      renderBuyPanel({ error });

      expect(screen.getByText(error)).toBeInTheDocument();
    });
  });

  describe('Auction Mode', () => {
    const auctionProps = {
      ...defaultProps,
      isAuction: true,
      currentBid: 90000n,
      timeRemaining: '2d 5h'
    };

    it('renders auction information correctly', () => {
      renderBuyPanel(auctionProps);

      expect(screen.getByText(`${formatEther(auctionProps.currentBid)} $TSKJ`)).toBeInTheDocument();
      expect(screen.getByText(auctionProps.timeRemaining)).toBeInTheDocument();
      expect(screen.getByPlaceholderText('Enter bid amount')).toBeInTheDocument();
    });

    it('handles bid input correctly', () => {
      renderBuyPanel(auctionProps);

      const input = screen.getByPlaceholderText('Enter bid amount');
      fireEvent.change(input, { target: { value: '100000' } });

      expect(defaultProps.setBidAmount).toHaveBeenCalledWith('100000');
    });

    it('disables bid button when loading', () => {
      renderBuyPanel({ ...auctionProps, isLoading: true });

      const bidButton = screen.getByText('Place Bid');
      expect(bidButton).toBeDisabled();
    });

    it('validates minimum bid amount', () => {
      const bidAmount = '80000'; // Less than current bid
      renderBuyPanel({ ...auctionProps, bidAmount });

      const bidButton = screen.getByText('Place Bid');
      fireEvent.click(bidButton);

      expect(defaultProps.onBid).not.toHaveBeenCalled();
    });

    it('allows valid bid placement', () => {
      const bidAmount = '100000'; // Higher than current bid
      renderBuyPanel({ ...auctionProps, bidAmount });

      const bidButton = screen.getByText('Place Bid');
      fireEvent.click(bidButton);

      expect(defaultProps.onBid).toHaveBeenCalled();
    });
  });

  describe('Edge Cases', () => {
    it('handles undefined price gracefully', () => {
      renderBuyPanel({ price: undefined });

      expect(screen.getByText('0 $TSKJ')).toBeInTheDocument();
    });

    it('handles undefined current bid gracefully', () => {
      renderBuyPanel({ isAuction: true, currentBid: undefined });

      expect(screen.getByText('0 $TSKJ')).toBeInTheDocument();
    });

    it('handles missing time remaining gracefully', () => {
      renderBuyPanel({ isAuction: true, timeRemaining: undefined });

      expect(screen.getByText('Time remaining unknown')).toBeInTheDocument();
    });
  });
});
