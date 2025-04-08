import React from 'react';
import styled from '@emotion/styled';
import { motion } from 'framer-motion';
import { Container, Heading, Text, Button, GlassCard, Grid } from '../common/StyledComponents';
import { theme } from '../../styles/theme';

const Section = styled.section`
  padding: ${theme.spacing.xl} 0;
  background: ${theme.colors.background.secondary};
  position: relative;
  overflow: hidden;
  
  &::before {
    content: '';
    position: absolute;
    top: -50%;
    right: -25%;
    width: 500px;
    height: 500px;
    background: radial-gradient(circle, rgba(83, 92, 236, 0.1), transparent 70%);
    border-radius: 50%;
  }
`;

const TokenCard = styled(GlassCard)`
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  position: relative;
  overflow: hidden;
  
  &::after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    height: 3px;
    background: ${theme.colors.gradient.rainbow};
  }
`;

const IconWrapper = styled.div`
  width: 48px;
  height: 48px;
  border-radius: ${theme.borderRadius.md};
  background: rgba(255, 255, 255, 0.05);
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: ${theme.spacing.md};
  font-size: 1.5rem;
`;

const ExchangeRate = styled(GlassCard)`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: ${theme.spacing.lg};
  margin-top: ${theme.spacing.xl};
  padding: ${theme.spacing.lg};
  background: rgba(255, 255, 255, 0.02);
`;

const TokenUtility = () => {
  const utilities = [
    {
      icon: "💰",
      title: "Buy & Sell NFTs",
      description: "Use $TSKJ as the primary currency for all NFT transactions on our marketplace."
    },
    {
      icon: "✨",
      title: "Claim Revenue",
      description: "Hold $TSKJ to claim your share of company profits distributed through our platform."
    },
    {
      icon: "🏛️",
      title: "Governance Rights",
      description: "Future voting power on platform decisions and protocol upgrades."
    }
  ];

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
    <Section>
      <Container>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <Heading size="lg" style={{ marginBottom: theme.spacing.md }}>
            $TSKJ Token Utility
          </Heading>
          <Text color="secondary" style={{ marginBottom: theme.spacing.xl, maxWidth: "600px" }}>
            Our native token powers all platform interactions and unlocks exclusive benefits for holders.
          </Text>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          <Grid columns={3} mobileColumns={1} gap={theme.spacing.lg}>
            {utilities.map((utility, index) => (
              <TokenCard
                key={index}
                as={motion.div}
                variants={cardVariants}
                whileHover={{ y: -5, transition: { duration: 0.2 } }}
              >
                <div>
                  <IconWrapper>
                    <span role="img" aria-label={utility.title}>
                      {utility.icon}
                    </span>
                  </IconWrapper>
                  <Heading size="sm" style={{ marginBottom: theme.spacing.sm }}>
                    {utility.title}
                  </Heading>
                  <Text color="secondary">
                    {utility.description}
                  </Text>
                </div>
              </TokenCard>
            ))}
          </Grid>
        </motion.div>

        <ExchangeRate
          as={motion.div}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <Text style={{ fontSize: "1.25rem" }}>
            1 ETH = 2,000 TSKJ
          </Text>
          <Button variant="primary">
            Convert ETH to TSKJ
          </Button>
          <Button>
            Trade on Uniswap
          </Button>
        </ExchangeRate>
      </Container>
    </Section>
  );
};

export default TokenUtility;
