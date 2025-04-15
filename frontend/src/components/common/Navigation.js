import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import styled from '@emotion/styled';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { theme } from '../../styles/theme';
import { useAccount, useReadContract } from 'wagmi';
import { CompanyNFTABI } from '../../abis/CompanyNFTABI';

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



const Navigation = () => {
  const location = useLocation();
  const { address } = useAccount();
  
  // Check if admin wallet is connected (direct check for Sepolia testing)
  const isAdminWallet = address && address.toLowerCase() === '0x2cda89DC7839a0f1a63ab3a11E154409c2639d1F'.toLowerCase();
  
  // Only attempt contract call if we have a valid ABI and address
  const safeABI = CompanyNFTABI && CompanyNFTABI.abi && Array.isArray(CompanyNFTABI.abi) && CompanyNFTABI.abi.length > 0 ? CompanyNFTABI.abi : [];
  
  const { data: hasAdminRole } = useReadContract({
    address: process.env.REACT_APP_COMPANY_NFT_ADDRESS,
    abi: safeABI,
    functionName: 'hasRole',
    args: ['0x0000000000000000000000000000000000000000000000000000000000000000', address || '0x0000000000000000000000000000000000000000'],
    enabled: !!address && safeABI.length > 0
  });

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
          {(isAdminWallet || hasAdminRole) && (
            <NavLink 
              to="/admin"
              isactive={(location.pathname === '/admin').toString()}
            >
              Admin
            </NavLink>
          )}
          <ConnectButton />
        </Links>
      </Container>
    </Nav>
  );
};

export default Navigation;
