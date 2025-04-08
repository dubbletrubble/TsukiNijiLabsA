import React from 'react';
import styled from '@emotion/styled';
import { Text } from '../common/StyledComponents';
import { theme } from '../../styles/theme';
import { FaCheckCircle } from 'react-icons/fa';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${theme.spacing.lg};
`;

const ImageFrame = styled.div`
  position: relative;
  border-radius: ${theme.borderRadius.lg};
  overflow: hidden;
  background: ${theme.colors.background.secondary};
  border: 1px solid rgba(255, 255, 255, 0.1);
  box-shadow: 0 0 20px rgba(0, 0, 0, 0.2);
  
  &::before {
    content: '';
    position: absolute;
    inset: 0;
    background: linear-gradient(
      45deg,
      rgba(255, 0, 0, 0.1),
      rgba(255, 165, 0, 0.1),
      rgba(255, 255, 0, 0.1),
      rgba(0, 128, 0, 0.1),
      rgba(0, 0, 255, 0.1),
      rgba(75, 0, 130, 0.1),
      rgba(238, 130, 238, 0.1)
    );
    z-index: 1;
    pointer-events: none;
  }
  
  img {
    width: 100%;
    height: auto;
    aspect-ratio: 16/9;
    object-fit: cover;
    display: block;
  }
`;

const Header = styled.div`
  display: flex;
  align-items: center;
  gap: ${theme.spacing.md};
`;

const CompanyName = styled.h1`
  font-size: 2rem;
  font-weight: 700;
  margin: 0;
  background: ${theme.colors.gradient.rainbow};
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
`;

const VerifiedBadge = styled(FaCheckCircle)`
  color: ${theme.colors.accent.primary};
  font-size: 1.5rem;
`;

const MetadataGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: ${theme.spacing.md};
  margin-top: ${theme.spacing.md};
`;

const MetadataItem = styled.div`
  background: rgba(255, 255, 255, 0.05);
  padding: ${theme.spacing.md};
  border-radius: ${theme.borderRadius.md};
  
  h4 {
    font-size: 0.875rem;
    color: ${theme.colors.text.secondary};
    margin: 0 0 ${theme.spacing.xs};
  }
  
  p {
    font-size: 1rem;
    margin: 0;
    color: ${theme.colors.text.primary};
  }
`;

const CompanyOverview = ({ metadata }) => {
  if (!metadata) return null;

  return (
    <Container>
      <ImageFrame>
        <img src={metadata.image} alt={metadata.name} />
      </ImageFrame>
      
      <Header>
        <CompanyName>{metadata.name}</CompanyName>
        {metadata.verified && <VerifiedBadge />}
      </Header>
      
      <MetadataGrid>
        <MetadataItem>
          <h4>Token ID</h4>
          <p>#{metadata.tokenId}</p>
        </MetadataItem>
        <MetadataItem>
          <h4>Industry</h4>
          <p>{metadata.industry}</p>
        </MetadataItem>
        <MetadataItem>
          <h4>Revenue Tier</h4>
          <p>{metadata.revenueTier}</p>
        </MetadataItem>
      </MetadataGrid>
      
      <Text color="secondary">{metadata.description}</Text>
    </Container>
  );
};

export default CompanyOverview;
