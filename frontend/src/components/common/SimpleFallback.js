import React, { useState, useEffect } from 'react';
import styled from '@emotion/styled';
import { theme } from '../../styles/theme';

const FallbackContainer = styled.div`
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background-color: ${theme.colors.background.primary};
  color: ${theme.colors.text.primary};
  padding: ${theme.spacing.xl};
  text-align: center;
`;

const Title = styled.h1`
  font-size: 2.5rem;
  margin-bottom: ${theme.spacing.lg};
  background: ${theme.colors.gradient.rainbow};
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
`;

const Message = styled.p`
  font-size: 1.25rem;
  max-width: 600px;
  margin-bottom: ${theme.spacing.xl};
  color: ${theme.colors.text.secondary};
`;

const Button = styled.button`
  background: ${props => props.secondary ? 'transparent' : theme.colors.gradient.rainbow};
  border: ${props => props.secondary ? `1px solid ${theme.colors.border}` : 'none'};
  color: ${props => props.secondary ? theme.colors.text.primary : 'white'};
  padding: ${theme.spacing.md} ${theme.spacing.lg};
  border-radius: ${theme.borderRadius.full};
  font-weight: 600;
  cursor: pointer;
  transition: transform 0.2s, background 0.2s;
  
  &:hover {
    transform: translateY(-2px);
    background: ${props => props.secondary ? 'rgba(255, 255, 255, 0.05)' : theme.colors.gradient.rainbow};
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: ${theme.spacing.md};
  margin-top: ${theme.spacing.lg};
  flex-wrap: wrap;
  justify-content: center;
`;

const DiagnosticInfo = styled.div`
  color: ${theme.colors.primary};
  cursor: pointer;
  padding: ${theme.spacing.sm} ${theme.spacing.md};
  border-radius: ${theme.borderRadius.sm};
  margin: ${theme.spacing.md} 0;
  display: inline-block;
  font-weight: 500;
  transition: background 0.2s;
  
  &:hover {
    background: rgba(255, 255, 255, 0.05);
  }
`;

const DiagnosticDetails = styled.div`
  background: rgba(0, 0, 0, 0.2);
  border-radius: ${theme.borderRadius.md};
  padding: ${theme.spacing.md};
  margin-bottom: ${theme.spacing.lg};
  text-align: left;
  width: 100%;
  max-width: 600px;
`;

const DiagnosticItem = styled.div`
  margin-bottom: ${theme.spacing.sm};
  display: flex;
  flex-wrap: wrap;
`;

const DiagnosticLabel = styled.span`
  font-weight: 600;
  margin-right: ${theme.spacing.sm};
  color: ${theme.colors.text.secondary};
`;

const DiagnosticValue = styled.span`
  color: ${theme.colors.text.primary};
  word-break: break-word;
`;

const SimpleFallback = ({ error, resetErrorBoundary }) => {
  const [diagnosticInfo, setDiagnosticInfo] = useState({
    errorType: 'Unknown',
    metamaskInstalled: false,
    networkDetails: '',
    accountsConnected: false,
    wagmiVersion: '',
    libraryVersions: ''
  });
  const [showDetails, setShowDetails] = useState(false);

  useEffect(() => {
    // Collect diagnostic information
    const collectDiagnostics = async () => {
      try {
        // Check for error type
        let errorType = 'Unknown Error';
        if (error) {
          if (error.message?.includes('wallet') || error.message?.includes('provider')) {
            errorType = 'Wallet Provider Error';
          } else if (error.message?.includes('network') || error.message?.includes('chain')) {
            errorType = 'Network Connection Error';
          } else if (error.message?.includes('Wagmi') || error.message?.includes('RainbowKit')) {
            errorType = 'Web3 Library Error';
          }
        }

        // Check for MetaMask installation
        const metamaskInstalled = Boolean(window.ethereum?.isMetaMask);
        
        // Get network details
        let networkDetails = 'Not available';
        if (window.ethereum) {
          try {
            const chainId = await window.ethereum.request({ method: 'eth_chainId' });
            networkDetails = `Chain ID: ${chainId}`;
          } catch (e) {
            networkDetails = `Error fetching chain: ${e.message}`;
          }
        }
        
        // Check accounts connected
        let accountsConnected = false;
        if (window.ethereum) {
          try {
            const accounts = await window.ethereum.request({ method: 'eth_accounts' });
            accountsConnected = accounts && accounts.length > 0;
          } catch (e) {
            console.error('Error checking accounts:', e);
          }
        }
        
        // Get library versions if possible
        const wagmiVersion = window.wagmi?.version || 'Unknown';
        const libraryVersions = `RainbowKit: v${window.rainbowKit?.version || 'Unknown'}, React: ${React.version}`;
        
        setDiagnosticInfo({
          errorType,
          metamaskInstalled,
          networkDetails,
          accountsConnected,
          wagmiVersion,
          libraryVersions
        });
      } catch (e) {
        console.error('Error collecting diagnostics:', e);
      }
    };
    
    collectDiagnostics();
  }, [error]);

  const handleRefresh = () => {
    window.location.reload();
  };

  const handleResetWallet = () => {
    // Clear any cached wallet connection data
    localStorage.removeItem('wagmi.wallet');
    localStorage.removeItem('wagmi.connected');
    localStorage.removeItem('wagmi.store');
    localStorage.removeItem('rk-store');
    
    // Reload after clearing cache
    window.location.reload();
  };

  return (
    <FallbackContainer>
      <Title>Tsuki Niji Labs</Title>
      <Message>
        We encountered an issue with your wallet connection. This might be due to MetaMask configuration or network conditions.
      </Message>
      
      <DiagnosticInfo onClick={() => setShowDetails(!showDetails)}>
        {showDetails ? 'Hide' : 'Show'} Technical Details ↓
      </DiagnosticInfo>
      
      {showDetails && (
        <DiagnosticDetails>
          <DiagnosticItem>
            <DiagnosticLabel>Error Type:</DiagnosticLabel> 
            <DiagnosticValue>{diagnosticInfo.errorType}</DiagnosticValue>
          </DiagnosticItem>
          <DiagnosticItem>
            <DiagnosticLabel>MetaMask Installed:</DiagnosticLabel> 
            <DiagnosticValue>{diagnosticInfo.metamaskInstalled ? '✅ Yes' : '❌ No'}</DiagnosticValue>
          </DiagnosticItem>
          <DiagnosticItem>
            <DiagnosticLabel>Network:</DiagnosticLabel> 
            <DiagnosticValue>{diagnosticInfo.networkDetails}</DiagnosticValue>
          </DiagnosticItem>
          <DiagnosticItem>
            <DiagnosticLabel>Accounts Connected:</DiagnosticLabel> 
            <DiagnosticValue>{diagnosticInfo.accountsConnected ? '✅ Yes' : '❌ No'}</DiagnosticValue>
          </DiagnosticItem>
          <DiagnosticItem>
            <DiagnosticLabel>Error Details:</DiagnosticLabel> 
            <DiagnosticValue>{error?.message || 'No details available'}</DiagnosticValue>
          </DiagnosticItem>
          <DiagnosticItem>
            <DiagnosticLabel>Library Versions:</DiagnosticLabel> 
            <DiagnosticValue>{diagnosticInfo.libraryVersions}</DiagnosticValue>
          </DiagnosticItem>
        </DiagnosticDetails>
      )}
      
      <ButtonGroup>
        <Button onClick={handleRefresh}>
          Refresh Page
        </Button>
        <Button onClick={handleResetWallet} secondary>
          Reset Wallet Connection
        </Button>
      </ButtonGroup>
    </FallbackContainer>
  );
};

export default SimpleFallback;
