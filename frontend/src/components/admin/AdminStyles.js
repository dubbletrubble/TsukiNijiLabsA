import styled from '@emotion/styled';
import { theme } from '../../styles/theme';

export const AdminContainer = styled.div`
  max-width: ${theme.layout.maxWidth};
  margin: 0 auto;
  padding: ${theme.spacing.lg};
`;

export const AdminPanel = styled.div`
  background: ${theme.colors.background.glass};
  backdrop-filter: blur(10px);
  border: 1px solid ${theme.colors.border.subtle};
  border-radius: ${theme.borderRadius.lg};
  padding: ${theme.spacing.lg};
  box-shadow: ${theme.shadows.glass};
`;

export const AdminHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: ${theme.spacing.lg};
  padding-bottom: ${theme.spacing.md};
  border-bottom: 1px solid ${theme.colors.border.subtle};
`;

export const AdminSection = styled.section`
  background: rgba(26, 26, 46, 0.6);
  border-radius: ${theme.borderRadius.md};
  padding: ${theme.spacing.lg};
  margin-bottom: ${theme.spacing.lg};
`;

export const AdminTitle = styled.h2`
  color: ${theme.colors.text.primary};
  font-family: ${theme.fonts.heading};
  font-size: ${theme.fontSize.xl};
  margin-bottom: ${theme.spacing.md};
`;

export const AdminAlert = styled.div`
  background: ${props => theme.colors[props.type]?.background || theme.colors.warning.background};
  color: ${props => theme.colors[props.type]?.text || theme.colors.warning.text};
  padding: ${theme.spacing.md};
  border-radius: ${theme.borderRadius.md};
  margin-bottom: ${theme.spacing.md};
  display: flex;
  align-items: center;
  gap: ${theme.spacing.sm};
`;

export const AdminButton = styled.button`
  background: ${props => props.variant === 'danger' 
    ? 'rgba(233, 69, 96, 0.2)' 
    : props.variant === 'success'
    ? 'rgba(0, 255, 149, 0.2)'
    : theme.colors.background.glass};
  color: ${props => props.variant === 'danger'
    ? theme.colors.accent
    : props.variant === 'success'
    ? theme.colors.success.text
    : theme.colors.text.primary};
  border: 1px solid ${props => props.variant === 'danger'
    ? theme.colors.accent
    : props.variant === 'success'
    ? theme.colors.success.text
    : theme.colors.border.subtle};
  padding: ${theme.spacing.sm} ${theme.spacing.lg};
  border-radius: ${theme.borderRadius.md};
  font-family: ${theme.fonts.primary};
  font-size: ${theme.fontSize.sm};
  cursor: pointer;
  transition: all ${theme.transitions.default};

  &:hover {
    background: ${props => props.variant === 'danger'
      ? 'rgba(233, 69, 96, 0.3)'
      : props.variant === 'success'
      ? 'rgba(0, 255, 149, 0.3)'
      : 'rgba(255, 255, 255, 0.15)'};
    transform: translateY(-1px);
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

export const AdminGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: ${theme.spacing.lg};
  margin-top: ${theme.spacing.lg};
`;

export const AdminCard = styled.div`
  background: rgba(26, 26, 46, 0.4);
  border: 1px solid ${theme.colors.border.subtle};
  border-radius: ${theme.borderRadius.md};
  padding: ${theme.spacing.lg};
  transition: all ${theme.transitions.default};

  &:hover {
    transform: translateY(-2px);
    box-shadow: ${theme.shadows.hover};
  }
`;

export const AdminInput = styled.input`
  background: rgba(15, 15, 26, 0.6);
  border: 1px solid ${theme.colors.border.subtle};
  border-radius: ${theme.borderRadius.md};
  color: ${theme.colors.text.primary};
  padding: ${theme.spacing.sm} ${theme.spacing.md};
  font-family: ${theme.fonts.primary};
  font-size: ${theme.fontSize.sm};
  width: 100%;
  transition: all ${theme.transitions.default};

  &:focus {
    outline: none;
    border-color: ${theme.colors.accent};
    box-shadow: 0 0 0 2px ${theme.colors.border.glow};
  }
`;

export const AdminTextArea = styled.textarea`
  ${AdminInput};
  min-height: 100px;
  resize: vertical;
`;

export const AdminLabel = styled.label`
  color: ${theme.colors.text.secondary};
  font-size: ${theme.fontSize.sm};
  margin-bottom: ${theme.spacing.xs};
  display: block;
`;

export const AdminFormGroup = styled.div`
  margin-bottom: ${theme.spacing.md};
`;

export const AdminBadge = styled.span`
  background: ${props => props.type === 'success'
    ? theme.colors.success.background
    : props.type === 'warning'
    ? theme.colors.warning.background
    : theme.colors.background.glass};
  color: ${props => props.type === 'success'
    ? theme.colors.success.text
    : props.type === 'warning'
    ? theme.colors.warning.text
    : theme.colors.text.primary};
  padding: ${theme.spacing.xs} ${theme.spacing.sm};
  border-radius: ${theme.borderRadius.full};
  font-size: ${theme.fontSize.xs};
  font-weight: 500;
`;
