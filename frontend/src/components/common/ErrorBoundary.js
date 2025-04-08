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
    
    // Log the error to an error reporting service
    console.error('Error caught by boundary:', error, errorInfo);
  }

  handleRetry = () => {
    this.setState({ 
      hasError: false,
      error: null,
      errorInfo: null
    });
  };

  render() {
    if (this.state.hasError) {
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
