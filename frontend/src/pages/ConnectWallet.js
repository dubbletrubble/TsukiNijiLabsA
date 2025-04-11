import React from 'react';
import styled from '@emotion/styled';
import { motion } from 'framer-motion';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { Container, Heading, Text, Flex } from '../components/common/StyledComponents';
import { theme } from '../styles/theme';

const ConnectSection = styled.section`
  min-height: 80vh;
  position: relative;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: radial-gradient(circle at top right, rgba(83, 92, 236, 0.1), transparent 40%),
                radial-gradient(circle at bottom left, rgba(233, 69, 96, 0.1), transparent 40%);
    z-index: 0;
  }
`;

const Card = styled(motion.div)`
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(10px);
  border-radius: ${theme.borderRadius.lg};
  padding: ${theme.spacing.xxl};
  border: 1px solid rgba(255, 255, 255, 0.1);
  width: 100%;
  max-width: 600px;
  position: relative;
  z-index: 1;
`;

const StyledConnectButton = styled(ConnectButton)`
  margin-top: ${theme.spacing.xl};
`;

const Feature = styled(Flex)`
  margin-top: ${theme.spacing.lg};
  gap: ${theme.spacing.md};
  align-items: flex-start;
`;

const FeatureIcon = styled.div`
  width: 48px;
  height: 48px;
  border-radius: ${theme.borderRadius.circle};
  background: ${theme.colors.gradient.rainbow};
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
`;

const ConnectWallet = () => {
  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6
      }
    }
  };

  return (
    <ConnectSection>
      <Container>
        <Card
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <Heading size="lg" gradient style={{ marginBottom: theme.spacing.md }}>
            Connect Your Wallet
          </Heading>
          
          <Text color="secondary" style={{ marginBottom: theme.spacing.xl }}>
            Join Tsuki Niji Labs and start investing in tokenized real-world assets. Connect your wallet to:
          </Text>

          <Feature>
            <FeatureIcon>💼</FeatureIcon>
            <div>
              <Text color="primary" style={{ fontWeight: 600, marginBottom: theme.spacing.xs }}>
                Access Your Portfolio
              </Text>
              <Text color="secondary">
                View your NFT holdings and track your investment performance
              </Text>
            </div>
          </Feature>

          <Feature>
            <FeatureIcon>💰</FeatureIcon>
            <div>
              <Text color="primary" style={{ fontWeight: 600, marginBottom: theme.spacing.xs }}>
                Earn Revenue
              </Text>
              <Text color="secondary">
                Receive your share of company profits directly to your wallet
              </Text>
            </div>
          </Feature>

          <Feature>
            <FeatureIcon>🔄</FeatureIcon>
            <div>
              <Text color="primary" style={{ fontWeight: 600, marginBottom: theme.spacing.xs }}>
                Trade Assets
              </Text>
              <Text color="secondary">
                Buy and sell NFTs representing company ownership stakes
              </Text>
            </div>
          </Feature>

          <Flex justifyContent="center" style={{ marginTop: theme.spacing.xxl }}>
            <StyledConnectButton />
          </Flex>
        </Card>
      </Container>
    </ConnectSection>
  );
};

export default ConnectWallet;
