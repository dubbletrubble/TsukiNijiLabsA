import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import styled from '@emotion/styled';
import { useAccount, useConnect, useDisconnect } from 'wagmi';
import { theme } from '../../styles/theme';

const Nav = styled.nav`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 1000;
  background: rgba(0, 0, 0, 0.8);
  backdrop-filter: blur(10px);
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
`;

const Container = styled.div`
  max-width: ${theme.layout.maxWidth};
  margin: 0 auto;
  padding: 0 ${theme.spacing.lg};
  height: 80px;
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const Logo = styled(Link)`
  font-size: 1.5rem;
  font-weight: 700;
  color: ${theme.colors.text.primary};
  text-decoration: none;
  
  img {
    height: 40px;
  }
`;

const Links = styled.div`
  display: flex;
  align-items: center;
  gap: ${theme.spacing.lg};
`;

const NavLink = styled(Link)(props => ({
  color: props.isactive === 'true' ? theme.colors.text.primary : theme.colors.text.secondary,
  textDecoration: 'none',
  fontWeight: 500,
  transition: 'color 0.2s ease',
  '&:hover': {
    color: theme.colors.text.primary
  }
}));

const ConnectButton = styled.button`
  background: ${theme.colors.accent};
  color: ${theme.colors.text.primary};
  border: none;
  padding: ${theme.spacing.sm} ${theme.spacing.md};
  border-radius: ${theme.borderRadius.md};
  cursor: pointer;
  font-weight: 500;
  transition: opacity 0.2s ease;
  
  &:hover {
    opacity: 0.9;
  }
`;

const Navigation = () => {
  const location = useLocation();
  const { address, isConnected } = useAccount();
  const { connect, connectors } = useConnect();
  const { disconnect } = useDisconnect();

  const handleConnect = () => {
    if (isConnected) {
      disconnect();
    } else {
      connect({ connector: connectors[0] });
    }
  };

  return (
    <Nav>
      <Container>
        <Logo to="/">Tsuki Niji Labs</Logo>
        <Links>
          <NavLink 
            to="/marketplace"
            isactive={(location.pathname === '/marketplace').toString()}
          >
            Marketplace
          </NavLink>
          <ConnectButton onClick={handleConnect}>
            {isConnected ? `${address.slice(0, 6)}...${address.slice(-4)}` : 'Connect Wallet'}
          </ConnectButton>
        </Links>
      </Container>
    </Nav>
  );
};

export default Navigation;
