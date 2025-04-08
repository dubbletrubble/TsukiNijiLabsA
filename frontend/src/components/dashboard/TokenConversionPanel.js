import React, { useState, useCallback } from 'react';
import styled from '@emotion/styled';
import { parseEther, formatEther } from 'viem';
import { theme } from '../../styles/theme';
import { usePlatformToken } from '../../hooks/useNFTContract';
import { contractAddresses } from '../../config/web3';

const Panel = styled.div`
  padding: ${theme.spacing.xl};
  background: ${theme.colors.background.dark}99;
  border-radius: ${theme.borderRadius.lg};
  border: 1px solid ${theme.colors.border.subtle};
`;

const Title = styled.h3`
  font-size: ${theme.fontSize.lg};
  color: ${theme.colors.text.primary};
  margin-bottom: ${theme.spacing.lg};
`;

const BalanceDisplay = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: ${theme.spacing.lg};
  padding: ${theme.spacing.md};
  background: ${theme.colors.background.secondary};
  border-radius: ${theme.borderRadius.md};

  div {
    text-align: center;
    
    p {
      font-size: ${theme.fontSize.sm};
      color: ${theme.colors.text.secondary};
      margin-bottom: ${theme.spacing.xs};
    }

    strong {
      font-size: ${theme.fontSize.lg};
      color: ${theme.colors.text.primary};
    }
  }
`;

const ConversionForm = styled.form`
  display: flex;
  flex-direction: column;
  gap: ${theme.spacing.lg};
`;

const InputGroup = styled.div`
  label {
    display: block;
    font-size: ${theme.fontSize.sm};
    color: ${theme.colors.text.secondary};
    margin-bottom: ${theme.spacing.xs};
  }

  input {
    width: 100%;
    padding: ${theme.spacing.md};
    background: ${theme.colors.background.secondary};
    border: 1px solid ${theme.colors.border.subtle};
    border-radius: ${theme.borderRadius.md};
    color: ${theme.colors.text.primary};
    font-size: ${theme.fontSize.md};

    &:focus {
      outline: none;
      border-color: ${theme.colors.primary.main};
    }
  }
`;

const ConvertButton = styled.button`
  width: 100%;
  padding: ${theme.spacing.md};
  background: ${theme.colors.primary.main};
  color: ${theme.colors.text.primary};
  border: none;
  border-radius: ${theme.borderRadius.md};
  font-size: ${theme.fontSize.md};
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover:not(:disabled) {
    background: ${theme.colors.primary.dark};
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const RateInfo = styled.div`
  text-align: center;
  margin-top: ${theme.spacing.md};
  font-size: ${theme.fontSize.sm};
  color: ${theme.colors.text.secondary};
`;

const ExternalLink = styled.a`
  display: block;
  text-align: center;
  margin-top: ${theme.spacing.lg};
  color: ${theme.colors.primary.main};
  text-decoration: none;
  font-size: ${theme.fontSize.sm};

  &:hover {
    text-decoration: underline;
  }
`;

const TokenConversionPanel = ({ ethBalance, tskjBalance, exchangeRate }) => {
  const [ethAmount, setEthAmount] = useState('');
  const [isConverting, setIsConverting] = useState(false);
  const { approve, convert } = usePlatformToken();

  const estimatedTskj = ethAmount ? parseFloat(ethAmount) * exchangeRate : 0;

  const handleConvert = useCallback(async (e) => {
    e.preventDefault();
    if (!ethAmount) return;

    setIsConverting(true);
    try {
      const ethValue = parseEther(ethAmount);
      
      // First approve the platform token contract
      await approve({
        address: contractAddresses.PlatformToken,
        args: [contractAddresses.TokenConverter, ethValue]
      });

      // Then perform the conversion
      await convert({
        address: contractAddresses.TokenConverter,
        args: [],
        value: ethValue
      });

    } catch (err) {
      console.error('Conversion failed:', err);
    } finally {
      setIsConverting(false);
      setEthAmount('');
    }
  }, [ethAmount, approve, convert]);

  return (
    <Panel>
      <Title>Convert ETH to $TSKJ</Title>
      
      <BalanceDisplay>
        <div>
          <p>ETH Balance</p>
          <strong>{formatEther(ethBalance || 0n)} ETH</strong>
        </div>
        <div>
          <p>$TSKJ Balance</p>
          <strong>{formatEther(tskjBalance || 0n)} TSKJ</strong>
        </div>
      </BalanceDisplay>

      <ConversionForm onSubmit={handleConvert}>
        <InputGroup>
          <label>ETH Amount</label>
          <input
            type="number"
            value={ethAmount}
            onChange={(e) => setEthAmount(e.target.value)}
            placeholder="0.0"
            min="0"
            step="0.01"
          />
        </InputGroup>

        <InputGroup>
          <label>Estimated $TSKJ</label>
          <input
            type="number"
            value={estimatedTskj.toFixed(6)}
            disabled
            placeholder="0.0"
          />
        </InputGroup>

        <ConvertButton 
          type="submit"
          disabled={!ethAmount || isConverting || parseFloat(ethAmount) <= 0}
        >
          {isConverting ? 'Converting...' : 'Convert Now'}
        </ConvertButton>
      </ConversionForm>

      <RateInfo>
        Current Rate: 1 ETH = {exchangeRate.toFixed(2)} $TSKJ
      </RateInfo>

      <ExternalLink 
        href="https://app.uniswap.org/"
        target="_blank"
        rel="noopener noreferrer"
      >
        View on Uniswap →
      </ExternalLink>
    </Panel>
  );
};

export default TokenConversionPanel;
