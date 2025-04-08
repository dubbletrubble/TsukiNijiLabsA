import React from 'react';
import styled from '@emotion/styled';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { theme } from '../../styles/theme';
import { formatEther } from 'viem';

const Card = styled(motion.div)`
  position: relative;
  background: ${theme.colors.background.secondary};
  border-radius: ${theme.borderRadius.lg};
  border: 1px solid ${theme.colors.border.subtle};
  overflow: hidden;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    border-color: ${theme.colors.border.glow};
    box-shadow: 0 0 20px ${theme.colors.border.glow}33;
    transform: translateY(-2px);
  }
`;

const ImageContainer = styled.div`
  position: relative;
  width: 100%;
  padding-top: 75%;
  overflow: hidden;

  img {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;

const Content = styled.div`
  padding: ${theme.spacing.lg};
`;

const Title = styled.h3`
  font-size: ${theme.fontSize.lg};
  color: ${theme.colors.text.primary};
  margin-bottom: ${theme.spacing.sm};
`;

const TokenId = styled.span`
  font-size: ${theme.fontSize.sm};
  color: ${theme.colors.text.secondary};
`;

const RevenueInfo = styled.div`
  margin-top: ${theme.spacing.md};
  padding: ${theme.spacing.md};
  background: ${theme.colors.background.dark}99;
  border-radius: ${theme.borderRadius.sm};

  p {
    font-size: ${theme.fontSize.sm};
    color: ${theme.colors.text.secondary};
    margin-bottom: ${theme.spacing.xs};
  }

  strong {
    font-size: ${theme.fontSize.lg};
    color: ${theme.colors.text.primary};
  }
`;

const ClaimButton = styled.button`
  width: 100%;
  margin-top: ${theme.spacing.md};
  padding: ${theme.spacing.md};
  background: ${theme.colors.primary.main};
  color: ${theme.colors.text.primary};
  border: none;
  border-radius: ${theme.borderRadius.sm};
  font-size: ${theme.fontSize.md};
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover:not(:disabled) {
    background: ${theme.colors.primary.dark};
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const Badge = styled.span`
  position: absolute;
  top: ${theme.spacing.md};
  right: ${theme.spacing.md};
  padding: ${theme.spacing.xs} ${theme.spacing.sm};
  background: ${props => props.warning ? theme.colors.warning.background : theme.colors.success.background};
  color: ${props => props.warning ? theme.colors.warning.text : theme.colors.success.text};
  border-radius: ${theme.borderRadius.sm};
  font-size: ${theme.fontSize.sm};
  z-index: 1;
`;

const DashboardNFTCard = ({ 
  tokenId, 
  metadata, 
  availableRevenue, 
  isListed,
  claimWindowExpiring,
  onClaim 
}) => {
  const navigate = useNavigate();

  const handleClick = (e) => {
    if (e.target.tagName.toLowerCase() !== 'button') {
      navigate(`/nft/${tokenId}`);
    }
  };

  const handleClaim = (e) => {
    e.stopPropagation();
    onClaim(tokenId);
  };

  return (
    <Card
      whileHover={{ y: -4 }}
      whileTap={{ scale: 0.98 }}
      onClick={handleClick}
    >
      {isListed && <Badge>Listed for Sale</Badge>}
      {claimWindowExpiring && <Badge warning>Claim Window Expiring Soon</Badge>}
      
      <ImageContainer>
        <img src={metadata?.image} alt={metadata?.name} />
      </ImageContainer>

      <Content>
        <Title>{metadata?.name}</Title>
        <TokenId>Token ID: {tokenId}</TokenId>

        <RevenueInfo>
          <p>Available Revenue</p>
          <strong>{formatEther(availableRevenue || 0n)} $TSKJ</strong>
        </RevenueInfo>

        <ClaimButton
          onClick={handleClaim}
          disabled={!availableRevenue || availableRevenue === 0n}
        >
          {availableRevenue && availableRevenue > 0n ? 'Claim Revenue' : 'No Revenue Available'}
        </ClaimButton>
      </Content>
    </Card>
  );
};

export default DashboardNFTCard;
