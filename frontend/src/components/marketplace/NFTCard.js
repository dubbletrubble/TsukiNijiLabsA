import React, { useCallback } from 'react';
import styled from '@emotion/styled';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { GlassCard, Text } from '../common/StyledComponents';
import { theme } from '../../styles/theme';

const Card = styled(GlassCard)`
  position: relative;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  cursor: pointer;
  transition: ${theme.transitions.default};
  
  &:hover {
    transform: translateY(-4px);
  }
`;

const ImageContainer = styled.div`
  position: relative;
  width: 100%;
  padding-top: 100%; /* 1:1 Aspect Ratio */
  background: ${theme.colors.background.secondary};
  overflow: hidden;
`;

const Image = styled.img`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

const Content = styled.div`
  padding: ${theme.spacing.md};
`;

const TagContainer = styled.div`
  position: absolute;
  top: ${theme.spacing.sm};
  left: ${theme.spacing.sm};
  display: flex;
  gap: ${theme.spacing.xs};
  z-index: 1;
`;

const Tag = styled.span`
  background: rgba(0, 0, 0, 0.7);
  backdrop-filter: blur(4px);
  padding: ${theme.spacing.xs} ${theme.spacing.sm};
  border-radius: ${theme.borderRadius.full};
  font-size: 0.75rem;
  font-weight: 600;
  color: ${props => props.color || theme.colors.text.primary};
`;

const PriceTag = styled.div`
  display: flex;
  align-items: center;
  gap: ${theme.spacing.xs};
  margin-top: ${theme.spacing.sm};
  padding: ${theme.spacing.sm};
  background: rgba(255, 255, 255, 0.05);
  border-radius: ${theme.borderRadius.sm};
`;

const AuctionTimer = styled.div`
  position: absolute;
  bottom: ${theme.spacing.sm};
  right: ${theme.spacing.sm};
  background: rgba(0, 0, 0, 0.7);
  backdrop-filter: blur(4px);
  padding: ${theme.spacing.xs} ${theme.spacing.sm};
  border-radius: ${theme.borderRadius.full};
  font-size: 0.75rem;
  color: ${theme.colors.text.primary};
`;

const RevenueIndicator = styled.div`
  position: absolute;
  top: ${theme.spacing.sm};
  right: ${theme.spacing.sm};
  width: 24px;
  height: 24px;
  border-radius: ${theme.borderRadius.full};
  background: ${props => {
    switch (props.tier) {
      case 'gold': return 'linear-gradient(45deg, #FFD700, #FFA500)';
      case 'silver': return 'linear-gradient(45deg, #C0C0C0, #A9A9A9)';
      case 'bronze': return 'linear-gradient(45deg, #CD7F32, #8B4513)';
      default: return 'none';
    }
  }};
  box-shadow: 0 0 10px ${props => {
    switch (props.tier) {
      case 'gold': return 'rgba(255, 215, 0, 0.5)';
      case 'silver': return 'rgba(192, 192, 192, 0.5)';
      case 'bronze': return 'rgba(205, 127, 50, 0.5)';
      default: return 'none';
    }
  }};
`;

const NFTCard = ({ 
  id,
  name,
  image,
  industry,
  price,
  isAuction,
  timeRemaining,
  revenueTier,
  currentBid
}) => {
  const navigate = useNavigate();
  // Format IPFS URL
  const formatImageUrl = (url) => {
    if (!url) return '';
    if (url.startsWith('ipfs://')) {
      return url.replace('ipfs://', 'https://ipfs.io/ipfs/');
    }
    return url;
  };

  // Format price with commas and fixed decimals
  const formatPrice = (price) => {
    if (!price) return '0';
    return parseFloat(price).toLocaleString(undefined, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    });
  };

  return (
    <Card
      as={motion.div}
      whileHover={{ y: -4 }}
      whileTap={{ scale: 0.98 }}
      onClick={useCallback((e) => {
        e.preventDefault();
        e.stopPropagation();
        const nftData = { id, name, image, industry, price, isAuction, timeRemaining, revenueTier, currentBid };
        console.log('Navigating to NFT:', nftData);
        navigate('/nft/' + id, { state: { nft: nftData }, replace: true });
      }, [id, name, image, industry, price, isAuction, timeRemaining, revenueTier, currentBid, navigate])}
    >
      <ImageContainer>
        <Image src={formatImageUrl(image)} alt={name} />
        <TagContainer>
          <Tag>{industry}</Tag>
          {isAuction && <Tag color="#FFD700">Auction</Tag>}
        </TagContainer>
        {revenueTier && <RevenueIndicator tier={revenueTier} />}
        {isAuction && timeRemaining && (
          <AuctionTimer>{timeRemaining}</AuctionTimer>
        )}
      </ImageContainer>
      
      <Content>
        <Text style={{ 
          fontSize: '1.125rem',
          fontWeight: 600,
          marginBottom: theme.spacing.xs
        }}>
          {name}
        </Text>
        
        <PriceTag>
          <Text color="secondary" size="sm">
            {isAuction ? 'Current Bid' : 'Price'}
          </Text>
          <Text style={{ fontWeight: 600 }}>
            {formatPrice(isAuction ? currentBid : price)} TSKJ
          </Text>
        </PriceTag>
      </Content>
    </Card>
  );
};

export default NFTCard;
