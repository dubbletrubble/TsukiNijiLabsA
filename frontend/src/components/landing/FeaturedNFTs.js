import React from 'react';
import styled from '@emotion/styled';
import { motion } from 'framer-motion';
import { GlassCard, Container, Heading, Text, Grid } from '../common/StyledComponents';
import { theme } from '../../styles/theme';

const FeaturedSection = styled.section`
  padding: ${theme.spacing.xl} 0;
  position: relative;
`;

const NFTCard = styled(GlassCard)`
  position: relative;
  overflow: hidden;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 2px;
    background: ${theme.colors.gradient.rainbow};
  }
`;

const MetricBox = styled.div`
  background: rgba(255, 255, 255, 0.05);
  padding: ${theme.spacing.sm} ${theme.spacing.md};
  border-radius: ${theme.borderRadius.sm};
  margin-top: ${theme.spacing.md};
`;

const Badge = styled.span`
  background: ${theme.colors.accent};
  padding: ${theme.spacing.xs} ${theme.spacing.sm};
  border-radius: ${theme.borderRadius.full};
  font-size: 0.75rem;
  font-weight: 600;
  margin-left: ${theme.spacing.sm};
`;

const FeaturedNFTs = () => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
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
    <FeaturedSection>
      <Container>
        <Heading size="lg" style={{ marginBottom: theme.spacing.xl }}>
          Featured NFTs
        </Heading>
        
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
        >
          <Grid columns={2} mobileColumns={1}>
            {/* Top Earning NFT */}
            <NFTCard
              as={motion.div}
              variants={cardVariants}
              whileHover={{ y: -5, transition: { duration: 0.2 } }}
            >
              <Text style={{ fontSize: '0.875rem', color: theme.colors.text.secondary }}>
                TOP EARNING NFT THIS QUARTER
              </Text>
              <Heading size="sm" style={{ marginTop: theme.spacing.xs, marginBottom: theme.spacing.md }}>
                TechCorp Solutions
                <Badge>Tech</Badge>
              </Heading>
              
              <MetricBox>
                <Text color="secondary" size="sm">Total Revenue Earned</Text>
                <Text style={{ fontSize: '1.5rem', fontWeight: 600 }}>
                  142,500 TSKJ
                </Text>
                <Text color="secondary" size="sm" style={{ marginTop: theme.spacing.xs }}>
                  Last Payout: March 28, 2025
                </Text>
              </MetricBox>
            </NFTCard>

            {/* Most Recent Sale */}
            <NFTCard
              as={motion.div}
              variants={cardVariants}
              whileHover={{ y: -5, transition: { duration: 0.2 } }}
            >
              <Text style={{ fontSize: '0.875rem', color: theme.colors.text.secondary }}>
                MOST RECENT SALE
              </Text>
              <Heading size="sm" style={{ marginTop: theme.spacing.xs, marginBottom: theme.spacing.md }}>
                GreenEnergy Co
                <Badge>Energy</Badge>
              </Heading>
              
              <MetricBox>
                <Text color="secondary" size="sm">Sold for</Text>
                <Text style={{ fontSize: '1.5rem', fontWeight: 600 }}>
                  89,000 TSKJ
                </Text>
                <Text color="secondary" size="sm" style={{ marginTop: theme.spacing.xs }}>
                  Buyer: 0x7a...3f9 • 2 hours ago
                </Text>
              </MetricBox>
            </NFTCard>
          </Grid>
        </motion.div>
      </Container>
    </FeaturedSection>
  );
};

export default FeaturedNFTs;
