/* global BigInt */
import React, { useState } from 'react';
import styled from '@emotion/styled';
import { formatEther, parseEther } from 'viem';
import { Button, Text } from '../common/StyledComponents';
import { theme } from '../../styles/theme';
import { FaGavel, FaShoppingCart, FaClock } from 'react-icons/fa';

const Container = styled.div`
  background: rgba(255, 255, 255, 0.05);
  border-radius: ${theme.borderRadius.lg};
  padding: ${theme.spacing.lg};
  display: flex;
  flex-direction: column;
  gap: ${theme.spacing.lg};
`;

const Header = styled.div`
  display: flex;
  align-items: center;
  gap: ${theme.spacing.md};
  
  svg {
    color: ${theme.colors.accent.primary};
    font-size: 1.5rem;
  }
`;

const Title = styled.h3`
  margin: 0;
  font-size: 1.25rem;
  font-weight: 600;
`;

const PriceContainer = styled.div`
  background: rgba(0, 0, 0, 0.2);
  padding: ${theme.spacing.lg};
  border-radius: ${theme.borderRadius.md};
  text-align: center;
  
  h4 {
    font-size: 0.875rem;
    color: ${theme.colors.text.secondary};
    margin: 0 0 ${theme.spacing.xs};
  }
  
  p {
    font-size: 2rem;
    font-weight: 700;
    margin: 0;
    background: ${theme.colors.gradient.rainbow};
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
  }
`;

const BidForm = styled.form`
  display: flex;
  flex-direction: column;
  gap: ${theme.spacing.md};
`;

const Input = styled.input`
  background: rgba(0, 0, 0, 0.2);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: ${theme.borderRadius.md};
  padding: ${theme.spacing.md};
  color: ${theme.colors.text.primary};
  font-size: 1rem;
  width: 100%;
  
  &:focus {
    outline: none;
    border-color: ${theme.colors.accent.primary};
  }
`;

const TimerContainer = styled.div`
  display: flex;
  align-items: center;
  gap: ${theme.spacing.sm};
  justify-content: center;
  margin-top: ${theme.spacing.md};
  color: ${theme.colors.text.secondary};
  
  svg {
    font-size: 1rem;
  }
`;

const ErrorText = styled(Text)`
  color: ${theme.colors.error};
  font-size: 0.875rem;
  text-align: center;
`;

const BuyPanel = ({
  listing,
  isOwner,
  onBuy,
  onBid,
  isLoading,
  error,
  userBalance
}) => {
  const [bidAmount, setBidAmount] = useState('');
  
  const handleBid = (e) => {
    e.preventDefault();
    if (!bidAmount) return;
    onBid(bidAmount);
  };
  
  if (!listing) return null;
  
  const isAuction = listing.isAuction;
  const currentPrice = isAuction ? listing.highestBid : listing.price;
  const minBidIncrement = 7n * parseEther('1');
  const minNextBid = currentPrice + minBidIncrement;
  
  if (isOwner) return null;
  
  return (
    <Container>
      <Header>
        {isAuction ? <FaGavel /> : <FaShoppingCart />}
        <Title>{isAuction ? 'Live Auction' : 'Buy Now'}</Title>
      </Header>
      
      <PriceContainer>
        <h4>{isAuction ? 'Current Bid' : 'Price'}</h4>
        <p>{formatEther(currentPrice)} $TSKJ</p>
      </PriceContainer>
      
      {isAuction && listing.endTime && (
        <TimerContainer>
          <FaClock />
          <Text>
            Ends {new Date(Number(listing.endTime) * 1000).toLocaleString()}
          </Text>
        </TimerContainer>
      )}
      
      {error && <ErrorText>{error}</ErrorText>}
      
      {isAuction ? (
        <BidForm onSubmit={handleBid}>
          <Text color="secondary">
            Minimum bid: {formatEther(minNextBid)} $TSKJ
          </Text>
          <Input
            type="number"
            step="0.000000000000000001"
            min={formatEther(minNextBid)}
            value={bidAmount}
            onChange={(e) => setBidAmount(e.target.value)}
            placeholder="Enter bid amount in $TSKJ"
          />
          <Button
            type="submit"
            disabled={isLoading || !bidAmount || parseEther(bidAmount) < minNextBid}
            loading={isLoading}
          >
            Place Bid
          </Button>
        </BidForm>
      ) : (
        <Button
          onClick={onBuy}
          disabled={isLoading || BigInt(userBalance) < currentPrice}
          loading={isLoading}
        >
          {BigInt(userBalance) < currentPrice 
            ? 'Insufficient $TSKJ Balance'
            : 'Buy Now'
          }
        </Button>
      )}
      
      <Text color="secondary" size="sm" align="center">
        Your balance: {formatEther(BigInt(userBalance))} $TSKJ
      </Text>
    </Container>
  );
};

export default BuyPanel;
