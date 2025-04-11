import React, { useState } from 'react';
import styled from '@emotion/styled';
import { motion } from 'framer-motion';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAccount, useBalance, useContractWrite } from 'wagmi';
import { parseEther } from 'viem';
import { Container, Button, Heading, Text, GlassCard } from '../components/common/StyledComponents';
import { theme } from '../styles/theme';
import { contractAddresses } from '../config/web3';

const Section = styled.section`
  min-height: 100vh;
  padding: ${theme.spacing.xl} 0;
  display: flex;
  align-items: center;
  position: relative;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: radial-gradient(circle at top right, rgba(83, 92, 236, 0.1), transparent 40%);
    z-index: 0;
  }
`;

const ConversionCard = styled(GlassCard)`
  max-width: 480px;
  margin: 0 auto;
  padding: ${theme.spacing.xl};
`;

const InputWrapper = styled.div`
  margin: ${theme.spacing.lg} 0;
`;

const TokenInput = styled.input`
  width: 100%;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: ${theme.borderRadius.md};
  padding: ${theme.spacing.md};
  color: ${theme.colors.text.primary};
  font-size: 1.25rem;
  outline: none;
  transition: ${theme.transitions.default};
  
  &:focus {
    border-color: rgba(255, 255, 255, 0.2);
    box-shadow: ${theme.shadows.glow};
  }
  
  &::placeholder {
    color: ${theme.colors.text.secondary};
  }
`;

const RateInfo = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: ${theme.spacing.md};
  background: rgba(255, 255, 255, 0.05);
  border-radius: ${theme.borderRadius.md};
  margin: ${theme.spacing.md} 0;
`;

const ErrorMessage = styled(Text)`
  color: ${theme.colors.error};
  margin-top: ${theme.spacing.sm};
`;

const Convert = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { address } = useAccount();
  const [amount, setAmount] = useState('');
  const [error, setError] = useState('');
  
  const { fromToken, toToken, rate } = location.state || {
    fromToken: 'ETH',
    toToken: 'TSKJ',
    rate: 2000
  };

  // Get ETH balance
  const { data: balance } = useBalance({
    address,
    watch: true,
  });

  // Contract interaction for token conversion
  const { write: convertTokens, isLoading: isConverting } = useContractWrite({
    address: contractAddresses.PlatformToken,
    abi: [], // Add your token contract ABI here
    functionName: 'convert',
    args: [parseEther(amount || '0')],
    enabled: Boolean(amount && !error),
  });

  const handleAmountChange = (e) => {
    const value = e.target.value;
    setAmount(value);
    
    if (!value) {
      setError('');
      return;
    }

    const numValue = parseFloat(value);
    if (isNaN(numValue)) {
      setError('Please enter a valid number');
      return;
    }

    if (balance && parseEther(value) > balance.value) {
      setError('Insufficient balance');
      return;
    }

    setError('');
  };

  const handleConvert = async () => {
    if (!address) {
      navigate('/connect-wallet');
      return;
    }

    try {
      await convertTokens?.();
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <Section>
      <Container>
        <ConversionCard
          as={motion.div}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Heading size="lg" style={{ marginBottom: theme.spacing.md }}>
            Convert {fromToken} to {toToken}
          </Heading>
          
          <Text color="secondary">
            Convert your {fromToken} to {toToken} at the current exchange rate.
            Make sure you have sufficient {fromToken} balance.
          </Text>

          <RateInfo>
            <Text>Exchange Rate</Text>
            <Text>1 {fromToken} = {rate} {toToken}</Text>
          </RateInfo>

          <InputWrapper>
            <TokenInput
              type="number"
              placeholder={`Enter ${fromToken} amount`}
              value={amount}
              onChange={handleAmountChange}
              min="0"
              step="0.000001"
            />
            {error && <ErrorMessage>{error}</ErrorMessage>}
            {amount && !error && (
              <Text style={{ marginTop: theme.spacing.sm }}>
                You will receive: {parseFloat(amount) * rate} {toToken}
              </Text>
            )}
          </InputWrapper>

          <Button
            variant="primary"
            as={motion.button}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleConvert}
            disabled={!amount || Boolean(error) || isConverting}
            style={{ width: '100%' }}
          >
            {isConverting ? 'Converting...' : `Convert to ${toToken}`}
          </Button>
        </ConversionCard>
      </Container>
    </Section>
  );
};

export default Convert;
