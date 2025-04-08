import React from 'react';
import styled from '@emotion/styled';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { FaDiscord, FaTwitter } from 'react-icons/fa';
import { Container } from '../components/common/StyledComponents';

const AboutPage = () => {
  const fadeIn = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6 }
  };

  return (
    <AboutContainer>
      {/* Mission Statement Hero Section */}
      <HeroSection>
        <motion.div {...fadeIn}>
          <HeroTitle>Rebuilding the ownership economy through real-world profit-sharing and tokenized equity.</HeroTitle>
          <HeroSubtitle>
            Tsuki Niji Labs is transforming how people participate in company ownership and profit distribution through blockchain technology and automated smart contracts.
          </HeroSubtitle>
        </motion.div>
        <OrbitalAnimation />
      </HeroSection>

      {/* Vision Section */}
      <Section as={motion.section} {...fadeIn}>
        <SectionTitle>Our Vision</SectionTitle>
        <VisionGrid>
          <VisionItem>
            <h3>Community-Driven Ownership</h3>
            <p>Shift power from centralized entities to communities of stakeholders through transparent and decentralized ownership structures.</p>
          </VisionItem>
          <VisionItem>
            <h3>Accessible Equity</h3>
            <p>Make company ownership accessible to everyone by removing traditional barriers and creating a frictionless trading experience.</p>
          </VisionItem>
          <VisionItem>
            <h3>Global Participation</h3>
            <p>Enable worldwide access to corporate profit streams through blockchain technology and smart contracts.</p>
          </VisionItem>
          <VisionItem>
            <h3>Reimagined Ownership</h3>
            <p>Transform the traditional concept of company ownership into a dynamic, transparent, and community-driven model.</p>
          </VisionItem>
        </VisionGrid>
      </Section>

      {/* Problem Section */}
      <Section as={motion.section} {...fadeIn} style={{ background: 'rgba(0,0,0,0.3)' }}>
        <SectionTitle>The Problem We're Solving</SectionTitle>
        <ProblemGrid>
          <ProblemItem>
            <h3>Disconnected Investors</h3>
            <p>Retail investors are cut off from real cashflow and meaningful ownership rights in traditional systems.</p>
          </ProblemItem>
          <ProblemItem>
            <h3>Bypassed Profits</h3>
            <p>Company profits often bypass shareholders entirely, leaving retail investors with no real economic benefits.</p>
          </ProblemItem>
          <ProblemItem>
            <h3>Limited Access</h3>
            <p>Early-stage equity opportunities are restricted to insiders and venture capitalists.</p>
          </ProblemItem>
          <ProblemItem>
            <h3>Opaque Systems</h3>
            <p>Centralized platforms extract value through hidden fees and complex structures.</p>
          </ProblemItem>
        </ProblemGrid>
      </Section>

      {/* Solution Section */}
      <Section as={motion.section} {...fadeIn}>
        <SectionTitle>Our Solution</SectionTitle>
        <SolutionContent>
          <SolutionText>
            <SolutionList>
              <li>Company NFTs represent real economic ownership with automated quarterly profit-sharing</li>
              <li>Transparent and traceable NFT trading on the open market</li>
              <li>Smart contract-enforced revenue claim windows for scalability</li>
              <li>Fully decentralized and transparent transactions</li>
            </SolutionList>
            <LinkGroup>
              <StyledLink to="/marketplace">Explore Marketplace</StyledLink>
              <StyledLink to="/docs">Read Documentation</StyledLink>
            </LinkGroup>
          </SolutionText>
        </SolutionContent>
      </Section>

      {/* Values Section */}
      <Section as={motion.section} {...fadeIn} style={{ background: 'rgba(0,0,0,0.3)' }}>
        <SectionTitle>Our Values</SectionTitle>
        <ValuesGrid>
          <ValueItem>
            <h3>Decentralization without Chaos</h3>
            <p>Building structured systems that maintain order while distributing power.</p>
          </ValueItem>
          <ValueItem>
            <h3>Trust through Code</h3>
            <p>Ensuring transparency and reliability through open-source, audited smart contracts.</p>
          </ValueItem>
          <ValueItem>
            <h3>Long-term Vision</h3>
            <p>Focusing on sustainable growth and real value creation over short-term gains.</p>
          </ValueItem>
          <ValueItem>
            <h3>Universal Accessibility</h3>
            <p>Making complex technology accessible to users of all technical backgrounds.</p>
          </ValueItem>
        </ValuesGrid>
      </Section>

      {/* CTA Section */}
      <CTASection as={motion.section} {...fadeIn}>
        <CTAContent>
          <CTATitle>Join the Future of Ownership</CTATitle>
          <CTAButtons>
            <PrimaryButton to="/marketplace">Explore the Marketplace</PrimaryButton>
            <SecondaryButton to="/docs">Read the Docs</SecondaryButton>
          </CTAButtons>
          <SocialLinks>
            <SocialLink href="https://discord.gg/tsukiniji" target="_blank">
              <FaDiscord />
            </SocialLink>
            <SocialLink href="https://twitter.com/tsukinijilabs" target="_blank">
              <FaTwitter />
            </SocialLink>
          </SocialLinks>
        </CTAContent>
      </CTASection>
    </AboutContainer>
  );
};

// Styled Components
const AboutContainer = styled.div`
  background: linear-gradient(to bottom, #0a0a0a, #1a1a1a);
  color: #ffffff;
  min-height: 100vh;
`;

const HeroSection = styled.section`
  position: relative;
  padding: 120px 0;
  text-align: center;
  overflow: hidden;
  background: linear-gradient(180deg, rgba(10,10,10,0) 0%, rgba(26,26,26,0.1) 100%);
`;

const HeroTitle = styled.h1`
  font-size: 3.5rem;
  font-weight: 700;
  margin-bottom: 2rem;
  background: linear-gradient(120deg, #fff, #a5a5a5);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  max-width: 900px;
  margin-left: auto;
  margin-right: auto;
`;

const HeroSubtitle = styled.p`
  font-size: 1.25rem;
  color: #a5a5a5;
  max-width: 700px;
  margin: 0 auto;
  line-height: 1.6;
`;

const Section = styled(Container)`
  padding: 100px 0;
`;

const SectionTitle = styled.h2`
  font-size: 2.5rem;
  margin-bottom: 3rem;
  text-align: center;
  color: #ffffff;
`;

const VisionGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 2rem;
  margin-top: 3rem;
`;

const VisionItem = styled.div`
  h3 {
    color: #ffffff;
    font-size: 1.5rem;
    margin-bottom: 1rem;
  }
  p {
    color: #a5a5a5;
    line-height: 1.6;
  }
`;

const ProblemGrid = styled(VisionGrid)``;
const ProblemItem = styled(VisionItem)``;

const SolutionContent = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 4rem;
  @media (max-width: 768px) {
    flex-direction: column;
  }
`;

const SolutionText = styled.div`
  flex: 1;
`;

const SolutionList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0 0 2rem 0;
  
  li {
    margin-bottom: 1rem;
    padding-left: 1.5rem;
    position: relative;
    color: #a5a5a5;
    
    &:before {
      content: "•";
      color: #646cff;
      position: absolute;
      left: 0;
    }
  }
`;

const LinkGroup = styled.div`
  display: flex;
  gap: 1rem;
  margin-top: 2rem;
`;

const StyledLink = styled(Link)`
  color: #646cff;
  text-decoration: none;
  font-weight: 500;
  
  &:hover {
    text-decoration: underline;
  }
`;

const ValuesGrid = styled(VisionGrid)``;
const ValueItem = styled(VisionItem)``;

const CTASection = styled.section`
  padding: 100px 0;
  text-align: center;
  background: linear-gradient(180deg, rgba(26,26,26,0) 0%, rgba(10,10,10,0.5) 100%);
`;

const CTAContent = styled.div`
  max-width: 600px;
  margin: 0 auto;
`;

const CTATitle = styled.h2`
  font-size: 2.5rem;
  margin-bottom: 2rem;
  color: #ffffff;
`;

const CTAButtons = styled.div`
  display: flex;
  justify-content: center;
  gap: 1rem;
  margin-bottom: 2rem;
  
  @media (max-width: 480px) {
    flex-direction: column;
    align-items: center;
  }
`;

const PrimaryButton = styled(Link)`
  background: #646cff;
  color: #ffffff;
  padding: 1rem 2rem;
  border-radius: 4px;
  text-decoration: none;
  font-weight: 500;
  transition: background 0.3s;
  
  &:hover {
    background: #4a4dff;
  }
`;

const SecondaryButton = styled(Link)`
  background: transparent;
  color: #646cff;
  padding: 1rem 2rem;
  border-radius: 4px;
  text-decoration: none;
  font-weight: 500;
  border: 1px solid #646cff;
  transition: all 0.3s;
  
  &:hover {
    background: rgba(100, 108, 255, 0.1);
  }
`;

const SocialLinks = styled.div`
  display: flex;
  justify-content: center;
  gap: 1rem;
  margin-top: 2rem;
`;

const SocialLink = styled.a`
  color: #a5a5a5;
  font-size: 1.5rem;
  transition: color 0.3s;
  
  &:hover {
    color: #646cff;
  }
`;

const OrbitalAnimation = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 300px;
  height: 300px;
  opacity: 0.1;
  background: radial-gradient(circle, #646cff 0%, transparent 70%);
  animation: pulse 4s ease-in-out infinite;
  pointer-events: none;
  
  @keyframes pulse {
    0% { transform: translate(-50%, -50%) scale(1); opacity: 0.1; }
    50% { transform: translate(-50%, -50%) scale(1.2); opacity: 0.2; }
    100% { transform: translate(-50%, -50%) scale(1); opacity: 0.1; }
  }
`;

export default AboutPage;
