import React from 'react';
import styled from '@emotion/styled';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Button, Container, Heading, Text, Flex } from '../common/StyledComponents';
import { theme } from '../../styles/theme';

const HeroSection = styled.section`
  min-height: 100vh;
  position: relative;
  overflow: hidden;
  display: flex;
  align-items: center;
  
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

const StatsContainer = styled(Flex)`
  margin-top: ${theme.spacing.xl};
  gap: ${theme.spacing.lg};
  
  @media (max-width: ${theme.breakpoints.md}) {
    flex-direction: column;
    align-items: flex-start;
  }
`;

const StatItem = styled(motion.div)`
  text-align: left;
`;

const StatValue = styled(Text)`
  font-size: 2rem;
  font-weight: 700;
  background: ${theme.colors.gradient.rainbow};
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  margin-bottom: ${theme.spacing.xs};
`;

const Hero = () => {
  const navigate = useNavigate();
  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        staggerChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0
    }
  };

  return (
    <HeroSection>
      <Container>
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <Heading size="xl" gradient>
            Invest in real-world company performance through tokenized ownership.
          </Heading>
          
          <Text color="secondary" style={{ fontSize: '1.25rem', maxWidth: '600px', marginBottom: theme.spacing.xl }}>
            Join the future of company ownership. Purchase NFTs representing real businesses and earn your share of their profits.
          </Text>

          <Flex gap={theme.spacing.md}>
            <Button
              variant="primary"
              as={motion.button}
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95, y: 0 }}
              onClick={() => navigate('/connect-wallet')}
              style={{ position: 'relative' }}
            >
              Connect Wallet
            </Button>
            <Button
              as={motion.button}
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95, y: 0 }}
              onClick={() => navigate('/marketplace')}
              style={{ position: 'relative' }}
            >
              Explore Marketplace
            </Button>
          </Flex>

          <StatsContainer>
            <StatItem variants={itemVariants}>
              <StatValue>$1.2M+</StatValue>
              <Text color="secondary">Total Revenue Distributed</Text>
            </StatItem>
            <StatItem variants={itemVariants}>
              <StatValue>10M</StatValue>
              <Text color="secondary">$TSKJ in Circulation</Text>
            </StatItem>
            <StatItem variants={itemVariants}>
              <StatValue>25+</StatValue>
              <Text color="secondary">Companies Onboarded</Text>
            </StatItem>
          </StatsContainer>
        </motion.div>
      </Container>
    </HeroSection>
  );
};

export default Hero;
