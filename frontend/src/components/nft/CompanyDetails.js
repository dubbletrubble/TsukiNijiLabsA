import React from 'react';
import styled from '@emotion/styled';
import { Text } from '../common/StyledComponents';
import { theme } from '../../styles/theme';
import { FaGlobe, FaIndustry, FaExternalLinkAlt } from 'react-icons/fa';

const Container = styled.div`
  background: rgba(255, 255, 255, 0.05);
  border-radius: ${theme.borderRadius.lg};
  padding: ${theme.spacing.lg};
  display: flex;
  flex-direction: column;
  gap: ${theme.spacing.lg};
`;

const Section = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${theme.spacing.md};
`;

const SectionTitle = styled.h3`
  font-size: 1.125rem;
  font-weight: 600;
  margin: 0;
  display: flex;
  align-items: center;
  gap: ${theme.spacing.sm};
  
  svg {
    color: ${theme.colors.accent.primary};
  }
`;

const TagsContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: ${theme.spacing.sm};
`;

const Tag = styled.span`
  background: rgba(255, 255, 255, 0.1);
  padding: ${theme.spacing.xs} ${theme.spacing.sm};
  border-radius: ${theme.borderRadius.full};
  font-size: 0.875rem;
`;

const Link = styled.a`
  color: ${theme.colors.accent.primary};
  text-decoration: none;
  display: flex;
  align-items: center;
  gap: ${theme.spacing.sm};
  font-size: 0.875rem;
  
  &:hover {
    text-decoration: underline;
  }
  
  svg {
    font-size: 0.75rem;
  }
`;

const CompanyDetails = ({ metadata }) => {
  if (!metadata) return null;

  const {
    description,
    website,
    industry,
    tags = [],
    documents = []
  } = metadata;

  return (
    <Container>
      <Section>
        <SectionTitle>
          <FaIndustry />
          About the Company
        </SectionTitle>
        <Text color="secondary">{description}</Text>
      </Section>

      {website && (
        <Section>
          <SectionTitle>
            <FaGlobe />
            Website
          </SectionTitle>
          <Link href={website} target="_blank" rel="noopener noreferrer">
            {website} <FaExternalLinkAlt />
          </Link>
        </Section>
      )}

      {tags.length > 0 && (
        <Section>
          <SectionTitle>
            <FaIndustry />
            Industry Tags
          </SectionTitle>
          <TagsContainer>
            {tags.map((tag, index) => (
              <Tag key={index}>{tag}</Tag>
            ))}
          </TagsContainer>
        </Section>
      )}

      {documents.length > 0 && (
        <Section>
          <SectionTitle>
            <FaExternalLinkAlt />
            Documents
          </SectionTitle>
          {documents.map((doc, index) => (
            <Link key={index} href={doc.url} target="_blank" rel="noopener noreferrer">
              {doc.name} <FaExternalLinkAlt />
            </Link>
          ))}
        </Section>
      )}
    </Container>
  );
};

export default CompanyDetails;
