import React from 'react';
import { screen, fireEvent, waitFor } from '@testing-library/react';
import { useAccount } from 'wagmi';
import NFTMintingPanel from '../components/admin/NFTMintingPanel';
import { renderWithProviders, createMockContracts } from './test-utils';

jest.mock('wagmi', () => ({
  useAccount: jest.fn()
}));

describe('NFTMintingPanel', () => {
  const mockAddress = '0x1234567890123456789012345678901234567890';
  
  beforeEach(() => {
    useAccount.mockReturnValue({ address: mockAddress });
    window.confirm = jest.fn().mockImplementation(() => true);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  const fillForm = () => {
    fireEvent.change(screen.getByPlaceholderText(/enter unique token id/i), {
      target: { value: '1' }
    });
    fireEvent.change(screen.getByPlaceholderText(/enter company name/i), {
      target: { value: 'Test Company' }
    });
    fireEvent.change(screen.getByPlaceholderText(/enter nft description/i), {
      target: { value: 'Test Description' }
    });
    fireEvent.change(screen.getByPlaceholderText(/ipfs:\/\/.../i), {
      target: { value: 'ipfs://test' }
    });
    fireEvent.change(screen.getByPlaceholderText(/0x.../i), {
      target: { value: mockAddress }
    });
  };

  it('renders the minting form', () => {
    const contracts = createMockContracts();
    renderWithProviders(<NFTMintingPanel contracts={contracts} />);

    expect(screen.getByText(/nft minting/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/enter unique token id/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/enter company name/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/enter nft description/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/ipfs:\/\/.../i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/0x.../i)).toBeInTheDocument();
  });

  it('validates form fields before submission', async () => {
    const contracts = createMockContracts();
    renderWithProviders(<NFTMintingPanel contracts={contracts} />);

    // Try to submit empty form
    fireEvent.click(screen.getByText(/mint nft/i));
    expect(await screen.findByText(/all fields are required/i)).toBeInTheDocument();

    // Fill form with invalid address
    fillForm();
    fireEvent.change(screen.getByPlaceholderText(/0x.../i), {
      target: { value: 'invalid-address' }
    });
    fireEvent.click(screen.getByText(/mint nft/i));
    expect(await screen.findByText(/invalid recipient address/i)).toBeInTheDocument();
  });

  it('checks if token ID already exists', async () => {
    const contracts = createMockContracts({
      companyNFT: {
        exists: jest.fn().mockResolvedValue(true)
      }
    });

    renderWithProviders(<NFTMintingPanel contracts={contracts} />);

    fillForm();
    fireEvent.click(screen.getByText(/mint nft/i));

    await waitFor(() => {
      expect(screen.getByText(/token id already exists/i)).toBeInTheDocument();
    });
  });

  it('successfully mints NFT when all validations pass', async () => {
    const mockMint = jest.fn().mockResolvedValue({ wait: () => Promise.resolve() });
    const contracts = createMockContracts({
      companyNFT: {
        exists: jest.fn().mockResolvedValue(false),
        mint: mockMint
      }
    });

    renderWithProviders(<NFTMintingPanel contracts={contracts} />);

    fillForm();
    fireEvent.click(screen.getByText(/mint nft/i));

    await waitFor(() => {
      expect(mockMint).toHaveBeenCalledWith(mockAddress, '1', 'ipfs://test');
      expect(screen.getByText(/nft minted successfully/i)).toBeInTheDocument();
    });

    // Form should be reset
    expect(screen.getByPlaceholderText(/enter unique token id/i).value).toBe('');
  });

  it('handles minting errors gracefully', async () => {
    const contracts = createMockContracts({
      companyNFT: {
        exists: jest.fn().mockResolvedValue(false),
        mint: jest.fn().mockRejectedValue(new Error('Minting failed'))
      }
    });

    renderWithProviders(<NFTMintingPanel contracts={contracts} />);

    fillForm();
    fireEvent.click(screen.getByText(/mint nft/i));

    await waitFor(() => {
      expect(screen.getByText(/failed to mint nft/i)).toBeInTheDocument();
    });
  });

  it('requires confirmation before minting', async () => {
    const mockMint = jest.fn().mockResolvedValue({ wait: () => Promise.resolve() });
    const contracts = createMockContracts({
      companyNFT: {
        exists: jest.fn().mockResolvedValue(false),
        mint: mockMint
      }
    });

    window.confirm.mockImplementationOnce(() => false);
    renderWithProviders(<NFTMintingPanel contracts={contracts} />);

    fillForm();
    fireEvent.click(screen.getByText(/mint nft/i));

    await waitFor(() => {
      expect(mockMint).not.toHaveBeenCalled();
    });
  });
});
