import React from 'react';
import styled from '@emotion/styled';
import { motion } from 'framer-motion';
import { Container, Heading, Text, Grid } from '../common/StyledComponents';
import { theme } from '../../styles/theme';

const Section = styled.section`
  padding: ${theme.spacing.xl} 0;
  background: ${theme.colors.background.secondary};
  position: relative;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: radial-gradient(circle at center, rgba(83, 92, 236, 0.05), transparent 70%);
  }
`;

const StepCard = styled(motion.div)`
  position: relative;
  padding: ${theme.spacing.lg};
  background: rgba(255, 255, 255, 0.02);
  border-radius: ${theme.borderRadius.lg};
  border: 1px solid rgba(255, 255, 255, 0.05);
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 3px;
    height: 100%;
    background: ${theme.colors.gradient.rainbow};
    border-radius: ${theme.borderRadius.sm};
  }
`;

const StepNumber = styled.div`
  font-size: 4rem;
  font-weight: 700;
  opacity: 0.1;
  position: absolute;
  top: ${theme.spacing.md};
  right: ${theme.spacing.md};
`;

const StepIcon = styled.div`
  width: 48px;
  height: 48px;
  border-radius: ${theme.borderRadius.md};
  background: rgba(255, 255, 255, 0.05);
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: ${theme.spacing.md};
  
  svg {
    width: 24px;
    height: 24px;
    color: ${theme.colors.text.primary};
  }
`;

const HowItWorks = () => {
  const steps = [
    {
      title: "Purchase an NFT",
      description: "Buy an NFT representing a real company using $TSKJ tokens through our marketplace.",
      icon: "🏢"
    },
    {
      title: "Company Deposits Profits",
      description: "Companies deposit their ETH profits quarterly into the revenue-sharing contract.",
      icon: "💰"
    },
    {
      title: "Platform Fee",
      description: "A 2.5% platform fee is deducted to support ongoing development and maintenance.",
      icon: "⚙️"
    },
    {
      title: "Claim Your Profits",
      description: "As an NFT holder, claim your share of the distributed profits directly to your wallet.",
      icon: "✨"
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
    hidden: { opacity: 0, x: -20 },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        duration: 0.5
      }
    }
  };

  return (
    <Section>
      <Container>
        <Heading size="lg" style={{ marginBottom: theme.spacing.xl, position: 'relative', zIndex: 1 }}>
          How It Works
        </Heading>
        
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
        >
          <Grid columns={2} mobileColumns={1} gap={theme.spacing.lg}>
            {steps.map((step, index) => (
              <StepCard
                key={index}
                variants={cardVariants}
                whileHover={{ 
                  y: -5,
                  transition: { duration: 0.2 }
                }}
              >
                <StepNumber>{index + 1}</StepNumber>
                <StepIcon>
                  <span role="img" aria-label={step.title}>
                    {step.icon}
                  </span>
                </StepIcon>
                <Heading size="sm" style={{ marginBottom: theme.spacing.sm }}>
                  {step.title}
                </Heading>
                <Text color="secondary">
                  {step.description}
                </Text>
              </StepCard>
            ))}
          </Grid>
        </motion.div>
      </Container>
    </Section>
  );
};

export default HowItWorks;
