import React, { useState } from 'react';
import styled from '@emotion/styled';
import { motion, AnimatePresence } from 'framer-motion';
import { useAccount } from 'wagmi';
import { parseEther } from 'viem';
import { Button, Text } from '../common/StyledComponents';
import { theme } from '../../styles/theme';
import { useMarketplace, usePlatformToken } from '../../hooks/useNFTContract';

const Overlay = styled(motion.div)`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.8);
  backdrop-filter: blur(4px);
  z-index: 1000;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: ${theme.spacing.md};
`;

const Modal = styled(motion.div)`
  background: ${theme.colors.background.primary};
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: ${theme.borderRadius.lg};
  padding: ${theme.spacing.xl};
  width: 100%;
  max-width: 500px;
  position: relative;
`;

const CloseButton = styled.button`
  position: absolute;
  top: ${theme.spacing.md};
  right: ${theme.spacing.md};
  background: none;
  border: none;
  color: ${theme.colors.text.secondary};
  cursor: pointer;
  font-size: 1.5rem;
  padding: ${theme.spacing.xs};
  
  &:hover {
    color: ${theme.colors.text.primary};
  }
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: ${theme.spacing.lg};
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${theme.spacing.xs};
`;

const Label = styled.label`
  color: ${theme.colors.text.secondary};
  font-size: 0.875rem;
`;

const Input = styled.input`
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: ${theme.borderRadius.sm};
  color: ${theme.colors.text.primary};
  padding: ${theme.spacing.sm};
  font-size: 1rem;
  
  &:focus {
    outline: none;
    border-color: rgba(255, 255, 255, 0.2);
  }
`;

const Select = styled.select`
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: ${theme.borderRadius.sm};
  color: ${theme.colors.text.primary};
  padding: ${theme.spacing.sm};
  font-size: 1rem;
  
  option {
    background: ${theme.colors.background.primary};
  }
`;

const ErrorMessage = styled(Text)`
  color: ${theme.colors.error};
  font-size: 0.875rem;
`;

const ListNFTModal = ({ isOpen, onClose, tokenId }) => {
  const { address } = useAccount();
  const { listNFT, createAuction } = useMarketplace();
  const { approve } = usePlatformToken();
  
  const [listingType, setListingType] = useState('fixed');
  const [price, setPrice] = useState('');
  const [reservePrice, setReservePrice] = useState('');
  const [minBidIncrement, setMinBidIncrement] = useState('7');
  const [duration, setDuration] = useState('7');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      // First approve marketplace contract
      const approvalTx = await approve({
        args: [
          contractAddresses.Marketplace,
          parseEther(price)
        ]
      });
      await approvalTx.wait();

      if (listingType === 'fixed') {
        const tx = await listNFT({
          args: [tokenId, parseEther(price)]
        });
        await tx.wait();
      } else {
        const tx = await createAuction({
          args: [
            tokenId,
            parseEther(reservePrice),
            parseEther(minBidIncrement),
            Math.floor(Date.now() / 1000) + (parseInt(duration) * 24 * 60 * 60)
          ]
        });
        await tx.wait();
      }

      onClose();
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <Overlay
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <Modal
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            onClick={e => e.stopPropagation()}
          >
            <CloseButton onClick={onClose}>&times;</CloseButton>
            
            <Text size="xl" weight="bold" style={{ marginBottom: theme.spacing.lg }}>
              List NFT for Sale
            </Text>

            <Form onSubmit={handleSubmit}>
              <FormGroup>
                <Label>Listing Type</Label>
                <Select
                  value={listingType}
                  onChange={e => setListingType(e.target.value)}
                >
                  <option value="fixed">Fixed Price</option>
                  <option value="auction">Auction</option>
                </Select>
              </FormGroup>

              {listingType === 'fixed' ? (
                <FormGroup>
                  <Label>Price (TSKJ)</Label>
                  <Input
                    type="number"
                    min="0"
                    step="1"
                    value={price}
                    onChange={e => setPrice(e.target.value)}
                    required
                  />
                </FormGroup>
              ) : (
                <>
                  <FormGroup>
                    <Label>Reserve Price (TSKJ)</Label>
                    <Input
                      type="number"
                      min="0"
                      step="1"
                      value={reservePrice}
                      onChange={e => setReservePrice(e.target.value)}
                      required
                    />
                  </FormGroup>

                  <FormGroup>
                    <Label>Minimum Bid Increment (TSKJ)</Label>
                    <Input
                      type="number"
                      min="7"
                      step="1"
                      value={minBidIncrement}
                      onChange={e => setMinBidIncrement(e.target.value)}
                      required
                    />
                  </FormGroup>

                  <FormGroup>
                    <Label>Duration (Days)</Label>
                    <Input
                      type="number"
                      min="7"
                      step="1"
                      value={duration}
                      onChange={e => setDuration(e.target.value)}
                      required
                    />
                  </FormGroup>
                </>
              )}

              {error && <ErrorMessage>{error}</ErrorMessage>}

              <Button
                type="submit"
                disabled={isLoading}
                style={{ marginTop: theme.spacing.md }}
              >
                {isLoading ? 'Processing...' : 'List NFT'}
              </Button>
            </Form>
          </Modal>
        </Overlay>
      )}
    </AnimatePresence>
  );
};

export default ListNFTModal;
