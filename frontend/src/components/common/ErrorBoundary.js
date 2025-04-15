/**
 * @fileoverview Error Boundary component for catching and handling React component errors
 * Provides fallback UI and error reporting functionality
 */

import React from 'react';
import styled from '@emotion/styled';
import { theme } from '../../styles/theme';

const ErrorContainer = styled.div`
  padding: ${theme.spacing.xl};
  background: rgba(255, 0, 0, 0.1);
  border-radius: ${theme.borderRadius.md};
  border: 1px solid rgba(255, 0, 0, 0.2);
  margin: ${theme.spacing.md};
`;

const ErrorHeading = styled.h3`
  color: ${theme.colors.error};
  margin: 0 0 ${theme.spacing.md};
`;

const ErrorMessage = styled.p`
  color: ${theme.colors.text.secondary};
  margin: 0 0 ${theme.spacing.md};
`;

const RetryButton = styled.button`
  background: ${theme.colors.error};
  color: white;
  border: none;
  padding: ${theme.spacing.sm} ${theme.spacing.md};
  border-radius: ${theme.borderRadius.sm};
  cursor: pointer;
  transition: opacity 0.2s;
  
  &:hover {
    opacity: 0.9;
  }
`;

/**
 * Error Boundary component that catches JavaScript errors anywhere in their child
 * component tree, logs those errors, and displays a fallback UI.
 * 
 * @component
 * @example
 * ```jsx
 * <ErrorBoundary>
 *   <MyComponent />
 * </ErrorBoundary>
 * ```
 */
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { 
      hasError: false,
      error: null,
      errorInfo: null
    };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    this.setState({
      error: error,
      errorInfo: errorInfo
    });
    
    // Enhanced error logging with context information
    console.error('%c Error caught by ErrorBoundary:', 'background: #FF0000; color: white; padding: 2px 5px; border-radius: 3px;');
    console.error('Error message:', error.message);
    console.error('Error stack:', error.stack);
    console.error('Component stack:', errorInfo.componentStack);
    
    // Log browser and environment information to help with debugging
    console.info('%c Environment Debug Info:', 'background: #4B0082; color: white; padding: 2px 5px; border-radius: 3px;');
    console.info('User Agent:', navigator.userAgent);
    console.info('React Version:', React.version);
    console.info('Window URL:', window.location.href);
    
    // Check if error is related to wallet connection
    const isWalletError = 
      error.message?.includes('wallet') || 
      error.message?.includes('provider') || 
      error.message?.includes('ethereum') || 
      error.message?.includes('MetaMask') ||
      errorInfo.componentStack?.includes('ConnectButton');
      
    if (isWalletError) {
      console.warn('%c Wallet Connection Error Detected:', 'background: #FFA500; color: black; padding: 2px 5px; border-radius: 3px;');
      console.warn('This appears to be a wallet connection issue. Check that MetaMask is installed and accessible.');
      
      // Check if window.ethereum exists
      if (window.ethereum) {
        console.info('MetaMask is installed. Provider details:', window.ethereum);
      } else {
        console.error('MetaMask provider not found in window.ethereum');
      }
    }
  }

  handleRetry = () => {
    this.setState({ 
      hasError: false,
      error: null,
      errorInfo: null
    });
  };

  render() {
    const { FallbackComponent } = this.props;
    
    if (this.state.hasError) {
      // If a custom fallback component is provided, use it
      if (FallbackComponent) {
        return <FallbackComponent 
          error={this.state.error} 
          resetErrorBoundary={this.handleRetry} 
        />;
      }
      
      // Otherwise use the default error UI
      return (
        <ErrorContainer>
          <ErrorHeading>Something went wrong</ErrorHeading>
          <ErrorMessage>
            {this.state.error && this.state.error.toString()}
          </ErrorMessage>
          <RetryButton onClick={this.handleRetry}>
            Try Again
          </RetryButton>
        </ErrorContainer>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
