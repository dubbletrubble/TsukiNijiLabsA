import styled from '@emotion/styled';
import { theme } from '../../styles/theme';
import { motion } from 'framer-motion';

export const DashboardContainer = styled.div`
  min-height: calc(100vh - 80px);
  width: 100%;
  padding: ${theme.spacing.xl};
  background: ${theme.colors.background.primary};
  color: ${theme.colors.text.primary};
`;

export const SummaryPanel = styled(motion.div)`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: ${theme.spacing.lg};
  margin-bottom: ${theme.spacing.xl};
  padding: ${theme.spacing.lg};
  background: ${theme.colors.background.secondary};
  border-radius: ${theme.borderRadius.lg};
  border: 1px solid ${theme.colors.border.glow};
  box-shadow: 0 0 20px ${theme.colors.border.glow}33;
  backdrop-filter: blur(10px);
`;

export const StatsCard = styled(motion.div)`
  padding: ${theme.spacing.lg};
  background: ${theme.colors.background.dark}99;
  border-radius: ${theme.borderRadius.md};
  border: 1px solid ${theme.colors.border.subtle};

  h3 {
    font-size: ${theme.fontSize.sm};
    color: ${theme.colors.text.secondary};
    margin-bottom: ${theme.spacing.sm};
  }

  p {
    font-size: ${theme.fontSize.xl};
    font-weight: bold;
    color: ${theme.colors.text.primary};
  }
`;

export const NFTGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: ${theme.spacing.lg};
  margin-bottom: ${theme.spacing.xl};
`;

export const DashboardSection = styled.section`
  margin-bottom: ${theme.spacing.xl};

  h2 {
    font-size: ${theme.fontSize.xl};
    color: ${theme.colors.text.primary};
    margin-bottom: ${theme.spacing.lg};
  }
`;

export const TokenPanel = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: ${theme.spacing.xl};
  padding: ${theme.spacing.xl};
  background: ${theme.colors.background.secondary};
  border-radius: ${theme.borderRadius.lg};
  border: 1px solid ${theme.colors.border.subtle};

  @media (max-width: ${theme.breakpoints.md}) {
    grid-template-columns: 1fr;
  }
`;

export const ActivityList = styled.div`
  background: ${theme.colors.background.secondary};
  border-radius: ${theme.borderRadius.lg};
  border: 1px solid ${theme.colors.border.subtle};
  overflow: hidden;
`;

export const ActivityItem = styled.div`
  display: grid;
  grid-template-columns: auto 1fr auto;
  gap: ${theme.spacing.md};
  align-items: center;
  padding: ${theme.spacing.md};
  border-bottom: 1px solid ${theme.colors.border.subtle};

  &:last-child {
    border-bottom: none;
  }

  .icon {
    width: 32px;
    height: 32px;
    display: flex;
    align-items: center;
    justify-content: center;
    background: ${theme.colors.background.dark};
    border-radius: ${theme.borderRadius.sm};
  }

  .details {
    h4 {
      font-size: ${theme.fontSize.md};
      color: ${theme.colors.text.primary};
      margin-bottom: ${theme.spacing.xs};
    }

    p {
      font-size: ${theme.fontSize.sm};
      color: ${theme.colors.text.secondary};
    }
  }

  .status {
    font-size: ${theme.fontSize.sm};
    padding: ${theme.spacing.xs} ${theme.spacing.sm};
    border-radius: ${theme.borderRadius.sm};
    background: ${props => 
      props.status === 'success' ? theme.colors.success.background :
      props.status === 'pending' ? theme.colors.warning.background :
      theme.colors.error.background};
    color: ${props =>
      props.status === 'success' ? theme.colors.success.text :
      props.status === 'pending' ? theme.colors.warning.text :
      theme.colors.error.text};
  }
`;

export const Alert = styled(motion.div)`
  display: flex;
  align-items: center;
  gap: ${theme.spacing.md};
  padding: ${theme.spacing.md} ${theme.spacing.lg};
  margin-bottom: ${theme.spacing.lg};
  background: ${props => 
    props.type === 'success' ? theme.colors.success.background :
    props.type === 'warning' ? theme.colors.warning.background :
    theme.colors.error.background};
  color: ${props =>
    props.type === 'success' ? theme.colors.success.text :
    props.type === 'warning' ? theme.colors.warning.text :
    theme.colors.error.text};
  border-radius: ${theme.borderRadius.md};
  border: 1px solid ${props =>
    props.type === 'success' ? theme.colors.success.border :
    props.type === 'warning' ? theme.colors.warning.border :
    theme.colors.error.border};

  button {
    margin-left: auto;
    background: none;
    border: none;
    color: currentColor;
    cursor: pointer;
    opacity: 0.7;
    transition: opacity 0.2s;

    &:hover {
      opacity: 1;
    }
  }
`;
