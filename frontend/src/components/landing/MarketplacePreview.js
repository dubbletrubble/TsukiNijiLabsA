import React from 'react';
import styled from '@emotion/styled';
import { motion } from 'framer-motion';
import { GlassCard, Container, Heading, Text, Button, Grid } from '../common/StyledComponents';
import { theme } from '../../styles/theme';

const Section = styled.section`
  padding: ${theme.spacing.xl} 0;
  position: relative;
`;

const NFTCard = styled(GlassCard)`
  aspect-ratio: 1;
  padding: 0;
  overflow: hidden;
  display: flex;
  flex-direction: column;
`;

const NFTImage = styled.div`
  height: 60%;
  background: ${props => props.gradient || theme.colors.gradient.rainbow};
  position: relative;
  overflow: hidden;
  
  &::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.2);
  }
`;

const NFTInfo = styled.div`
  padding: ${theme.spacing.md};
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
`;

const PriceTag = styled.div`
  display: flex;
  align-items: center;
  gap: ${theme.spacing.sm};
  padding: ${theme.spacing.sm} ${theme.spacing.md};
  background: rgba(255, 255, 255, 0.05);
  border-radius: ${theme.borderRadius.sm};
  margin-top: ${theme.spacing.sm};
`;

const CategoryBadge = styled.span`
  font-size: 0.75rem;
  padding: ${theme.spacing.xs} ${theme.spacing.sm};
  background: rgba(255, 255, 255, 0.1);
  border-radius: ${theme.borderRadius.full};
`;

const MarketplacePreview = () => {
  const nfts = [
    {
      name: "AI Solutions Corp",
      category: "Technology",
      price: "75,000",
      gradient: "linear-gradient(45deg, #FF6B6B, #4ECDC4)"
    },
    {
      name: "Green Energy Co",
      category: "Renewable Energy",
      price: "92,500",
      gradient: "linear-gradient(45deg, #45B649, #DCE35B)"
    },
    {
      name: "Smart Logistics",
      category: "Transportation",
      price: "63,000",
      gradient: "linear-gradient(45deg, #834D9B, #D04ED6)"
    },
    {
      name: "Future Finance",
      category: "Fintech",
      price: "88,000",
      gradient: "linear-gradient(45deg, #4776E6, #8E54E9)"
    }
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5
      }
    }
  };

  return (
    <Section>
      <Container>
        <Heading size="lg" style={{ marginBottom: theme.spacing.md }}>
          Featured Listings
        </Heading>
        <Text color="secondary" style={{ marginBottom: theme.spacing.xl, maxWidth: "600px" }}>
          Discover high-performing companies currently available on our marketplace.
          Each NFT represents real ownership and profit-sharing opportunities.
        </Text>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
        >
          <Grid columns={4} mobileColumns={2} gap={theme.spacing.lg}>
            {nfts.map((nft, index) => (
              <NFTCard
                key={index}
                as={motion.div}
                variants={cardVariants}
                whileHover={{ 
                  y: -10,
                  transition: { duration: 0.2 }
                }}
              >
                <NFTImage gradient={nft.gradient} />
                <NFTInfo>
                  <div>
                    <CategoryBadge>{nft.category}</CategoryBadge>
                    <Heading size="sm" style={{ margin: `${theme.spacing.sm} 0` }}>
                      {nft.name}
                    </Heading>
                  </div>
                  <PriceTag>
                    <Text style={{ fontSize: "1.125rem", fontWeight: 600 }}>
                      {nft.price}
                    </Text>
                    <Text color="secondary" size="sm">
                      TSKJ
                    </Text>
                  </PriceTag>
                </NFTInfo>
              </NFTCard>
            ))}
          </Grid>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          style={{ 
            textAlign: 'center',
            marginTop: theme.spacing.xl 
          }}
        >
          <Button variant="primary">
            View All Listings
          </Button>
        </motion.div>
      </Container>
    </Section>
  );
};

export default MarketplacePreview;
