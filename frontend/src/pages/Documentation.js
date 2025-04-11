import React, { useState, useEffect } from 'react';
import styled from '@emotion/styled';
import { motion } from 'framer-motion';
import { Container, Heading, Text, GlassCard, Input } from '../components/common/StyledComponents';
import { theme } from '../styles/theme';

const DocContainer = styled.div`
  display: grid;
  grid-template-columns: 280px 1fr;
  gap: ${theme.spacing.xl};
  max-width: ${theme.breakpoints.xxl};
  margin: 0 auto;
  padding: ${theme.spacing.xl};
  min-height: calc(100vh - 80px);
  position: relative;

  @media (max-width: ${theme.breakpoints.lg}) {
    grid-template-columns: 1fr;
    padding: ${theme.spacing.lg};
  }
`;

const SidebarWrapper = styled.div`
  position: relative;
  width: 280px;
  transition: width 0.3s ease;

  &:hover {
    width: 320px;
  }

  @media (max-width: ${theme.breakpoints.lg}) {
    display: none;
  }
`;

const Sidebar = styled(motion.aside)`
  position: fixed;
  top: 0;
  bottom: 0;
  width: inherit;
  overflow-y: auto;
  padding: ${theme.spacing.lg};
  margin: ${theme.spacing.xl} 0;
  background: ${theme.colors.background.secondary};
  border-radius: ${theme.borderRadius.lg};
  border: 1px solid ${theme.colors.border};
  backdrop-filter: blur(8px);
  transition: all 0.3s ease;
  
  &:hover {
    box-shadow: ${theme.shadows.lg};
  }

  /* Scrollbar styling */
  &::-webkit-scrollbar {
    width: 8px;
  }

  &::-webkit-scrollbar-track {
    background: transparent;
  }

  &::-webkit-scrollbar-thumb {
    background: ${theme.colors.border};
    border-radius: 4px;
  }
`;

const MobileSidebar = styled(motion.aside)`
  display: none;
  
  @media (max-width: ${theme.breakpoints.lg}) {
    display: block;
    position: fixed;
    top: 0;
    left: 0;
    bottom: 0;
    width: 280px;
    height: 100vh;
    overflow-y: auto;
    padding: ${theme.spacing.lg};
    background: ${theme.colors.background.primary};
    border-radius: 0;
    z-index: 1000;
    transform: translateX(\${props => props.isOpen ? '0' : '-100%'});
    transition: transform 0.3s ease;
  }
`;

const MainContent = styled.main`
  max-width: 900px;
  padding: ${theme.spacing.lg};
  background: ${theme.colors.background.secondary};
  border-radius: ${theme.borderRadius.lg};
  border: 1px solid ${theme.colors.border};
  backdrop-filter: blur(8px);
`;

const NavList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
  opacity: 0.9;
  transition: opacity 0.2s ease;

  &:hover {
    opacity: 1;
  }
`;

const NavItem = styled.li`
  margin-bottom: ${theme.spacing.sm};
`;

const NavLink = styled.a`
  color: ${props => props.active ? theme.colors.primary : theme.colors.text.secondary};
  text-decoration: none;
  font-size: 0.9rem;
  display: block;
  padding: ${theme.spacing.xs} ${theme.spacing.sm};
  transition: all 0.2s ease;
  cursor: pointer;
  border-radius: ${theme.borderRadius.sm};

  &:hover {
    color: ${theme.colors.primary};
    background: rgba(83, 92, 236, 0.1);
    transform: translateX(4px);
  }
`;

const SubNavList = styled.ul`
  list-style: none;
  padding-left: ${theme.spacing.lg};
  margin: ${theme.spacing.xs} 0;
`;

const Section = styled.section`
  margin-bottom: ${theme.spacing.xxl};
`;

const SectionHeading = styled(Heading)`
  margin-bottom: ${theme.spacing.lg};
  scroll-margin-top: ${theme.spacing.xl};
`;

const MobileMenuButton = styled.button`
  display: none;
  position: fixed;
  bottom: ${theme.spacing.lg};
  right: ${theme.spacing.lg};
  background: ${theme.colors.gradient.rainbow};
  border: none;
  border-radius: 50%;
  width: 50px;
  height: 50px;
  z-index: 1001;
  cursor: pointer;
  box-shadow: ${theme.shadows.lg};
  color: white;
  font-size: 1.5rem;
  transition: transform 0.2s ease;

  &:hover {
    transform: scale(1.1);
  }

  &:active {
    transform: scale(0.95);
  }

  @media (max-width: ${theme.breakpoints.lg}) {
    display: flex;
    align-items: center;
    justify-content: center;
  }
`;

const SearchContainer = styled.div`
  margin-bottom: ${theme.spacing.lg};
  position: relative;

  &::before {
    content: '🔍';
    position: absolute;
    left: ${theme.spacing.md};
    top: 50%;
    transform: translateY(-50%);
    opacity: 0.5;
    pointer-events: none;
    z-index: 1;
  }
`;

const SearchInput = styled(Input)`
  padding-left: 2.5rem;
  transition: all 0.2s ease;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  
  &:focus {
    transform: scale(1.02);
    background: rgba(255, 255, 255, 0.1);
    border-color: ${theme.colors.primary};
  }
`;

const Documentation = () => {
  const [activeSection, setActiveSection] = useState('');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const sections = {
    introduction: {
      title: 'Introduction',
      subsections: ['What is Tsuki Niji Labs?', 'Problem & Solution', 'Target Users', 'System Overview']
    },
    platform: {
      title: 'Platform Overview',
      subsections: ['Architecture', 'System Interaction', 'Core Principles']
    },
    nfts: {
      title: 'Company NFTs',
      subsections: ['Token Standard', 'Metadata Structure', 'Ownership Rules', 'Profit Sharing']
    },
    revenue: {
      title: 'Revenue Sharing Model',
      subsections: ['Revenue Router', 'Distribution Process', 'Claim System', 'Platform Fees']
    },
    token: {
      title: '$TSKJ Token',
      subsections: ['Token Standard', 'Supply & Economics', 'Use Cases', 'Price Oracle']
    },
    marketplace: {
      title: 'Marketplace & Auctions',
      subsections: ['Listing System', 'Auction Mechanics', 'Escrow', 'Fees']
    },
    contracts: {
      title: 'Smart Contract Architecture',
      subsections: ['Contract List', 'Addresses', 'Admin Roles', 'Events']
    },
    admin: {
      title: 'Admin Controls',
      subsections: ['Access Control', 'Multi-sig', 'Upgradeability']
    },
    risks: {
      title: 'Risks & Disclosures',
      subsections: ['Platform Risks', 'NFT Risks', 'Token Risks', 'Legal']
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      const sectionElements = document.querySelectorAll('section[id]');
      let currentSection = '';

      sectionElements.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        if (window.scrollY >= sectionTop - 100) {
          currentSection = section.id;
        }
      });

      setActiveSection(currentSection);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const filteredSections = Object.entries(sections).filter(([key, section]) => {
    if (!searchTerm) return true;
    const searchLower = searchTerm.toLowerCase();
    return (
      section.title.toLowerCase().includes(searchLower) ||
      section.subsections.some(sub => sub.toLowerCase().includes(searchLower))
    );
  });

  return (
    <DocContainer>
      <SidebarWrapper>
        <Sidebar>
          <SearchContainer>
            <SearchInput
              type="text"
              placeholder="Search documentation..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </SearchContainer>
          <NavList>
            {filteredSections.map(([key, section]) => (
              <NavItem key={key}>
                <NavLink
                  href={`#${key}`}
                  active={activeSection === key}
                >
                  {section.title}
                </NavLink>
                <SubNavList>
                  {section.subsections.map((subsection, index) => (
                    <NavItem key={`${key}-${index}`}>
                      <NavLink
                        href={`#${key}-${index}`}
                        active={activeSection === `${key}-${index}`}
                      >
                        {subsection}
                      </NavLink>
                    </NavItem>
                  ))}
                </SubNavList>
              </NavItem>
            ))}
          </NavList>
        </Sidebar>
      </SidebarWrapper>

      <MobileSidebar isOpen={isMenuOpen}>
        <SearchContainer>
          <SearchInput
            type="text"
            placeholder="Search documentation..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </SearchContainer>
        <NavList>
          {filteredSections.map(([key, section]) => (
            <NavItem key={key}>
              <NavLink
                href={`#${key}`}
                active={activeSection === key}
                onClick={() => setIsMenuOpen(false)}
              >
                {section.title}
              </NavLink>
              <SubNavList>
                {section.subsections.map((subsection, index) => (
                  <NavItem key={`${key}-${index}`}>
                    <NavLink
                      href={`#${key}-${index}`}
                      active={activeSection === `${key}-${index}`}
                      onClick={() => setIsMenuOpen(false)}
                    >
                      {subsection}
                    </NavLink>
                  </NavItem>
                ))}
              </SubNavList>
            </NavItem>
          ))}
        </NavList>
      </MobileSidebar>

      <MainContent>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Heading size="xl">Documentation</Heading>
          <Text color="secondary" style={{ marginBottom: theme.spacing.xl }}>
            A technical overview of the Tsuki Niji Labs platform and how it works.
          </Text>

          <Section id="introduction">
            <SectionHeading size="lg">Introduction</SectionHeading>
            {/* Introduction content will go here */}
          </Section>

          {/* Add other sections here */}
        </motion.div>
      </MainContent>

      <MobileMenuButton onClick={() => setIsMenuOpen(!isMenuOpen)}>
        {isMenuOpen ? '✕' : '☰'}
      </MobileMenuButton>
    </DocContainer>
  );
};

export default Documentation;
