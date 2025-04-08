import styled from '@emotion/styled';
import { motion } from 'framer-motion';
import { theme } from '../../styles/theme';

export const GlassCard = styled(motion.div)`
  background: ${theme.colors.gradient.glass};
  backdrop-filter: blur(8px);
  border-radius: ${theme.borderRadius.lg};
  border: 1px solid rgba(255, 255, 255, 0.1);
  box-shadow: ${theme.shadows.glass};
  padding: ${theme.spacing.lg};
`;

export const Button = styled(motion.button)`
  background: ${props => props.variant === 'primary' 
    ? theme.colors.gradient.rainbow
    : theme.colors.background.glass};
  color: ${theme.colors.text.primary};
  padding: ${theme.spacing.md} ${theme.spacing.lg};
  border-radius: ${theme.borderRadius.full};
  font-weight: 600;
  transition: ${theme.transitions.default};
  border: 1px solid rgba(255, 255, 255, 0.1);
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: ${theme.shadows.hover};
  }
`;

export const Container = styled.div`
  max-width: ${theme.breakpoints.xl};
  margin: 0 auto;
  padding: 0 ${theme.spacing.lg};
  
  @media (max-width: ${theme.breakpoints.md}) {
    padding: 0 ${theme.spacing.md};
  }
`;

export const Heading = styled.h1`
  font-size: ${props => {
    switch (props.size) {
      case 'xl': return '4rem';
      case 'lg': return '3rem';
      case 'md': return '2rem';
      case 'sm': return '1.5rem';
      default: return '2rem';
    }
  }};
  font-weight: 700;
  margin-bottom: ${theme.spacing.lg};
  background: ${props => props.gradient ? theme.colors.gradient.rainbow : 'none'};
  -webkit-background-clip: ${props => props.gradient ? 'text' : 'none'};
  -webkit-text-fill-color: ${props => props.gradient ? 'transparent' : 'inherit'};
  
  @media (max-width: ${theme.breakpoints.md}) {
    font-size: ${props => {
      switch (props.size) {
        case 'xl': return '3rem';
        case 'lg': return '2.5rem';
        case 'md': return '1.75rem';
        case 'sm': return '1.25rem';
        default: return '1.75rem';
      }
    }};
  }
`;

export const Text = styled.p`
  color: ${props => props.color === 'secondary' 
    ? theme.colors.text.secondary 
    : theme.colors.text.primary};
  font-size: ${props => props.size === 'sm' ? '0.875rem' : '1rem'};
  line-height: 1.6;
`;

export const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(${props => props.columns || 12}, 1fr);
  gap: ${props => props.gap || theme.spacing.lg};
  
  @media (max-width: ${theme.breakpoints.md}) {
    grid-template-columns: repeat(${props => props.mobileColumns || 1}, 1fr);
  }
`;

export const Flex = styled.div`
  display: flex;
  justify-content: ${props => props.justify || 'flex-start'};
  align-items: ${props => props.align || 'stretch'};
  gap: ${props => props.gap || '0'};
  flex-direction: ${props => props.direction || 'row'};
  flex-wrap: ${props => props.wrap || 'nowrap'};
  
  @media (max-width: ${theme.breakpoints.md}) {
    flex-direction: ${props => props.mobileDirection || props.direction || 'row'};
  }
`;
