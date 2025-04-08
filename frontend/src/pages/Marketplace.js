import React, { useState } from 'react';
import styled from '@emotion/styled';
import { useNavigate } from 'react-router-dom';
import { Container, Heading, Text, Button, Grid } from '../components/common/StyledComponents';
import NFTCard from '../components/marketplace/NFTCard';
import FilterSidebar from '../components/marketplace/FilterSidebar';
import { theme } from '../styles/theme';

const PageContainer = styled.div`
  min-height: 100vh;
  padding: ${theme.spacing.xl} 0;
`;

const Content = styled.div`
  display: flex;
  gap: ${theme.spacing.xl};
  margin-left: ${props => props.sidebarOpen ? '240px' : '40px'};
  transition: margin-left 0.3s ease-in-out;
  
  @media (max-width: ${theme.breakpoints.lg}) {
    margin-left: 0;
  }
`;

const MainContent = styled.div`
  flex: 1;
`;

const TabsContainer = styled.div`
  display: flex;
  gap: ${theme.spacing.md};
  margin-bottom: ${theme.spacing.xl};
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  padding-bottom: ${theme.spacing.md};
`;

const Tab = styled.button`
  background: none;
  border: none;
  color: ${props => props.active ? theme.colors.text.primary : theme.colors.text.secondary};
  font-weight: ${props => props.active ? '600' : '400'};
  padding: ${theme.spacing.sm} ${theme.spacing.md};
  cursor: pointer;
  position: relative;
  
  &::after {
    content: '';
    position: absolute;
    bottom: -${theme.spacing.md};
    left: 0;
    width: 100%;
    height: 2px;
    background: ${theme.colors.gradient.rainbow};
    opacity: ${props => props.active ? 1 : 0};
    transition: opacity 0.2s ease;
  }
`;

const SortContainer = styled.div`
  display: flex;
  align-items: center;
  gap: ${theme.spacing.md};
  margin-bottom: ${theme.spacing.xl};
`;

const Select = styled.select`
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  color: ${theme.colors.text.primary};
  padding: ${theme.spacing.sm} ${theme.spacing.md};
  border-radius: ${theme.borderRadius.sm};
  cursor: pointer;
  
  option {
    background: ${theme.colors.background.primary};
  }
`;

const EmptyState = styled.div`
  text-align: center;
  padding: ${theme.spacing.xl} 0;
`;

const Marketplace = () => {
  const [activeTab, setActiveTab] = useState('buy');
  const [filters, setFilters] = useState({
    industries: [],
    revenueTiers: [],
    maxPrice: 50000
  });
  const [sortBy, setSortBy] = useState('recent');
  const [isSidebarOpen, setSidebarOpen] = useState(false);

  // Mock NFT data with proper IDs and metadata
  const mockNFTs = [
    {
      id: 1,
      name: 'AI Solutions Corp',
      image: 'https://picsum.photos/seed/ai1/400/400',
      industry: 'AI & Machine Learning',
      price: '75000',
      revenueTier: 'gold',
      isAuction: false,
      description: 'Leading AI solutions provider with proven track record',
      revenue: {
        total: '500000',
        lastPayout: '50000',
        nextPayout: '75000'
      }
    },
    {
      id: 2,
      name: 'Green Energy Tech',
      image: 'https://picsum.photos/seed/energy2/400/400',
      industry: 'Clean Energy',
      price: '100000',
      revenueTier: 'platinum',
      isAuction: true,
      currentBid: '95000',
      timeRemaining: '2d 5h',
      description: 'Revolutionary clean energy technology company',
      revenue: {
        total: '750000',
        lastPayout: '80000',
        nextPayout: '100000'
      }
    },
    {
      id: 3,
      name: 'Biotech Innovations',
      image: 'https://picsum.photos/seed/bio3/400/400',
      industry: 'Biotechnology',
      price: '120000',
      revenueTier: 'silver',
      isAuction: false,
      description: 'Cutting-edge biotech research and development',
      revenue: {
        total: '300000',
        lastPayout: '30000',
        nextPayout: '45000'
      }
    }
  ];

  return (
    <PageContainer>
      <Container>
        <Heading size="lg" style={{ marginBottom: theme.spacing.xl }}>
          NFT Marketplace
        </Heading>
        
        <Content sidebarOpen={isSidebarOpen}>
          <FilterSidebar
            filters={filters}
            setFilters={setFilters}
            isOpen={isSidebarOpen}
            onToggle={() => setSidebarOpen(!isSidebarOpen)}
          />
          
          <MainContent>
            <TabsContainer>
              <Tab
                active={activeTab === 'buy'}
                onClick={() => setActiveTab('buy')}
              >
                Buy Now
              </Tab>
              <Tab
                active={activeTab === 'auction'}
                onClick={() => setActiveTab('auction')}
              >
                Live Auctions
              </Tab>
              <Tab
                active={activeTab === 'my'}
                onClick={() => setActiveTab('my')}
              >
                My Listings
              </Tab>
            </TabsContainer>

            <SortContainer>
              <Text color="secondary">Sort by:</Text>
              <Select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
              >
                <option value="recent">Most Recent</option>
                <option value="revenue">Highest Revenue</option>
                <option value="price-low">Lowest Price</option>
                <option value="price-high">Highest Price</option>
                {activeTab === 'auction' && (
                  <option value="ending">Ending Soon</option>
                )}
              </Select>
            </SortContainer>

            {mockNFTs.length > 0 ? (
              <Grid columns={3} mobileColumns={1} gap={theme.spacing.lg}>
                {mockNFTs.map(nft => (
                  <NFTCard
                    key={nft.id}
                    {...nft}
                  />
                ))}
              </Grid>
            ) : (
              <EmptyState>
                <Text color="secondary" style={{ marginBottom: theme.spacing.md }}>
                  No NFTs found matching your criteria
                </Text>
                <Button onClick={() => setFilters({
                  industries: [],
                  revenueTiers: [],
                  maxPrice: 50000
                })}>
                  Clear Filters
                </Button>
              </EmptyState>
            )}
          </MainContent>
        </Content>
      </Container>
    </PageContainer>
  );
};

export default Marketplace;
