import React from 'react';
import styled from '@emotion/styled';
import { GlassCard, Text, Button } from '../common/StyledComponents';
import { theme } from '../../styles/theme';

const SidebarContainer = styled.div`
  position: fixed;
  top: 90px;
  left: 0;
  height: calc(100vh - 100px);
  z-index: 1000;
  display: flex;
  transition: transform 0.3s ease-in-out;
  transform: translateX(${props => props.isOpen ? '0' : '-240px'});
  
  &:hover {
    transform: translateX(0);
  }
  
  @media (max-width: ${theme.breakpoints.lg}) {
    top: 80px;
    height: calc(100vh - 80px);
  }
`;

const Sidebar = styled(GlassCard)`
  width: 240px;
  height: 100%;
  padding: ${theme.spacing.lg};
  display: flex;
  flex-direction: column;
  overflow-y: auto;
`;

const SidebarHandle = styled.div`
  width: 40px;
  height: 80px;
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border-radius: 0 ${theme.borderRadius.md} ${theme.borderRadius.md} 0;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  margin-top: 20px;
  
  &::after {
    content: '⟩';
    color: ${theme.colors.text.primary};
    font-size: 20px;
  }
`;

const FilterSection = styled.div`
  margin-bottom: ${theme.spacing.lg};
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  padding-bottom: ${theme.spacing.lg};
  
  &:last-child {
    border-bottom: none;
    margin-bottom: 0;
    padding-bottom: 0;
  }
`;

const FilterTitle = styled.h3`
  font-size: 1rem;
  font-weight: 600;
  margin-bottom: ${theme.spacing.md};
`;

const CheckboxGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${theme.spacing.sm};
`;

const CheckboxLabel = styled.label`
  display: flex;
  align-items: center;
  gap: ${theme.spacing.sm};
  cursor: pointer;
  
  input {
    appearance: none;
    width: 18px;
    height: 18px;
    border: 2px solid rgba(255, 255, 255, 0.2);
    border-radius: ${theme.borderRadius.sm};
    position: relative;
    cursor: pointer;
    
    &:checked {
      background: ${theme.colors.gradient.rainbow};
      border: none;
      
      &::after {
        content: '✓';
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        color: white;
        font-size: 12px;
      }
    }
  }
`;

const RangeContainer = styled.div`
  margin-top: ${theme.spacing.md};
`;

const RangeSlider = styled.input`
  width: 100%;
  -webkit-appearance: none;
  height: 4px;
  border-radius: 2px;
  background: rgba(255, 255, 255, 0.1);
  outline: none;
  
  &::-webkit-slider-thumb {
    -webkit-appearance: none;
    appearance: none;
    width: 16px;
    height: 16px;
    border-radius: 50%;
    background: ${theme.colors.gradient.rainbow};
    cursor: pointer;
  }
`;

const RangeValues = styled.div`
  display: flex;
  justify-content: space-between;
  margin-top: ${theme.spacing.sm};
`;

const MobileFilterButton = styled(Button)`
  position: fixed;
  bottom: ${theme.spacing.lg};
  left: 50%;
  transform: translateX(-50%);
  z-index: 999;
  display: none;
  
  @media (max-width: ${theme.breakpoints.lg}) {
    display: block;
  }
`;

const FilterSidebar = ({
  filters,
  setFilters,
  isOpen,
  onToggle
}) => {
  const industries = [
    'AI & Machine Learning',
    'Renewable Energy',
    'FinTech',
    'Healthcare',
    'E-commerce'
  ];

  const revenueTiers = [
    'High',
    'Medium',
    'Low'
  ];

  return (
    <>
      <SidebarContainer isOpen={isOpen}>
        <Sidebar>
        <FilterSection>
          <FilterTitle>Industry</FilterTitle>
          <CheckboxGroup>
            {industries.map(industry => (
              <CheckboxLabel key={industry}>
                <input
                  type="checkbox"
                  checked={filters.industries.includes(industry)}
                  onChange={(e) => {
                    if (e.target.checked) {
                      setFilters(prev => ({
                        ...prev,
                        industries: [...prev.industries, industry]
                      }));
                    } else {
                      setFilters(prev => ({
                        ...prev,
                        industries: prev.industries.filter(i => i !== industry)
                      }));
                    }
                  }}
                />
                <Text>{industry}</Text>
              </CheckboxLabel>
            ))}
          </CheckboxGroup>
        </FilterSection>

        <FilterSection>
          <FilterTitle>Revenue Tier</FilterTitle>
          <CheckboxGroup>
            {revenueTiers.map(tier => (
              <CheckboxLabel key={tier}>
                <input
                  type="checkbox"
                  checked={filters.revenueTiers.includes(tier)}
                  onChange={(e) => {
                    if (e.target.checked) {
                      setFilters(prev => ({
                        ...prev,
                        revenueTiers: [...prev.revenueTiers, tier]
                      }));
                    } else {
                      setFilters(prev => ({
                        ...prev,
                        revenueTiers: prev.revenueTiers.filter(t => t !== tier)
                      }));
                    }
                  }}
                />
                <Text>{tier}</Text>
              </CheckboxLabel>
            ))}
          </CheckboxGroup>
        </FilterSection>

        <FilterSection>
          <FilterTitle>Price Range (TSKJ)</FilterTitle>
          <RangeContainer>
            <RangeSlider
              type="range"
              min="0"
              max="100000"
              value={filters.maxPrice}
              onChange={(e) => setFilters(prev => ({
                ...prev,
                maxPrice: parseInt(e.target.value)
              }))}
            />
            <RangeValues>
              <Text size="sm">0</Text>
              <Text size="sm">{filters.maxPrice.toLocaleString()} TSKJ</Text>
            </RangeValues>
          </RangeContainer>
        </FilterSection>
        </Sidebar>
        <SidebarHandle onClick={onToggle} />
      </SidebarContainer>

      <MobileFilterButton onClick={onToggle}>
        {isOpen ? 'Close Filters' : 'Show Filters'}
      </MobileFilterButton>
    </>
  );
};

export default FilterSidebar;
