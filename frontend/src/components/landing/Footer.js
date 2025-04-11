import React from 'react';
import styled from '@emotion/styled';
import { Link } from 'react-router-dom';
import { Container, Text, Flex } from '../common/StyledComponents';
import { theme } from '../../styles/theme';

const FooterSection = styled.footer`
  padding: ${theme.spacing.xl} 0;
  background: ${theme.colors.background.secondary};
  border-top: 1px solid rgba(255, 255, 255, 0.05);
`;

const FooterGrid = styled.div`
  display: grid;
  grid-template-columns: 2fr repeat(3, 1fr);
  gap: ${theme.spacing.xl};
  
  @media (max-width: ${theme.breakpoints.md}) {
    grid-template-columns: 1fr;
    gap: ${theme.spacing.lg};
  }
`;

const FooterColumn = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${theme.spacing.md};
`;

const FooterHeading = styled.h4`
  color: ${theme.colors.text.primary};
  font-family: ${theme.fonts.heading};
  font-size: 1.125rem;
  margin-bottom: ${theme.spacing.sm};
`;

const FooterLink = styled(Link)`
  color: ${theme.colors.text.secondary};
  font-size: 0.875rem;
  transition: ${theme.transitions.default};
  text-decoration: none;
  
  &:hover {
    color: ${theme.colors.text.primary};
  }
`;

const SocialIcon = styled.a`
  width: 36px;
  height: 36px;
  border-radius: ${theme.borderRadius.full};
  background: rgba(255, 255, 255, 0.05);
  display: flex;
  align-items: center;
  justify-content: center;
  transition: ${theme.transitions.default};
  
  &:hover {
    background: rgba(255, 255, 255, 0.1);
    transform: translateY(-2px);
  }
`;

const BottomBar = styled.div`
  margin-top: ${theme.spacing.xl};
  padding-top: ${theme.spacing.lg};
  border-top: 1px solid rgba(255, 255, 255, 0.05);
`;

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <FooterSection>
      <Container>
        <FooterGrid>
          <FooterColumn>
            <img 
              src="/TsukiNijiLogoWhiteText.png" 
              alt="Tsuki Niji Labs"
              style={{ width: '180px', marginBottom: theme.spacing.md }}
            />
            <Text color="secondary" style={{ maxWidth: "300px" }}>
              Building the future of company ownership through blockchain technology and innovative NFT solutions.
            </Text>
            <Flex gap={theme.spacing.md}>
              <SocialIcon href="https://discord.gg" target="_blank" rel="noopener noreferrer">
                <Text>📱</Text>
              </SocialIcon>
              <SocialIcon href="https://twitter.com" target="_blank" rel="noopener noreferrer">
                <Text>🐦</Text>
              </SocialIcon>
              <SocialIcon href="https://github.com" target="_blank" rel="noopener noreferrer">
                <Text>💻</Text>
              </SocialIcon>
            </Flex>
          </FooterColumn>

          <FooterColumn>
            <FooterHeading>Platform</FooterHeading>
            <FooterLink to="/marketplace">Marketplace</FooterLink>
            <FooterLink to="/dashboard">Dashboard</FooterLink>
            <FooterLink to="/about">About Us</FooterLink>
          </FooterColumn>

          <FooterColumn>
            <FooterHeading>Resources</FooterHeading>
            <FooterLink to="/docs">Documentation</FooterLink>
            <FooterLink to="/faq">FAQ</FooterLink>
            <FooterLink to="/support">Support</FooterLink>
          </FooterColumn>

          <FooterColumn>
            <FooterHeading>Legal</FooterHeading>
            <FooterLink href="/privacy">Privacy Policy</FooterLink>
            <FooterLink href="/terms">Terms of Service</FooterLink>
            <FooterLink href="/cookies">Cookie Policy</FooterLink>
          </FooterColumn>
        </FooterGrid>

        <BottomBar>
          <Flex justify="space-between" align="center" mobileDirection="column" gap={theme.spacing.md}>
            <Text color="secondary" size="sm">
              © {currentYear} Tsuki Niji Labs – Built for the future of company ownership
            </Text>
            <Text color="secondary" size="sm">
              All rights reserved
            </Text>
          </Flex>
        </BottomBar>
      </Container>
    </FooterSection>
  );
};

export default Footer;
