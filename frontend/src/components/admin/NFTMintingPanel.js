import React, { useState } from 'react';
import { useAccount } from 'wagmi';
import { ethers } from 'ethers';
import {
  AdminSection,
  AdminTitle,
  AdminFormGroup,
  AdminInput,
  AdminTextArea,
  AdminButton,
  AdminAlert,
  AdminLabel
} from './AdminStyles';

const NFTMintingPanel = ({ contracts }) => {
  const { address } = useAccount();
  const [formData, setFormData] = useState({
    tokenId: '',
    companyName: '',
    description: '',
    metadataUri: '',
    recipientAddress: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const validateForm = () => {
    if (!formData.tokenId || !formData.companyName || !formData.metadataUri || !formData.recipientAddress) {
      setError('All fields are required');
      return false;
    }
    if (!ethers.utils.isAddress(formData.recipientAddress)) {
      setError('Invalid recipient address');
      return false;
    }
    return true;
  };

  const handleMint = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    setError('');
    setSuccess('');

    try {
      // First, check if the token ID is already used
      const exists = await contracts.companyNFT.exists(formData.tokenId);
      if (exists) {
        throw new Error('Token ID already exists');
      }

      // Create confirmation dialog
      if (!window.confirm('Are you sure you want to mint NFT #' + formData.tokenId + ' for ' + formData.companyName + '?')) {
        return;
      }

      // Mint the NFT
      const tx = await contracts.companyNFT.mint(
        formData.recipientAddress,
        formData.tokenId,
        formData.metadataUri
      );
      await tx.wait();

      setSuccess('NFT minted successfully!');
      setFormData({
        tokenId: '',
        companyName: '',
        description: '',
        metadataUri: '',
        recipientAddress: ''
      });
    } catch (err) {
      setError(err.message || 'Failed to mint NFT');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AdminSection>
      <AdminTitle>NFT Minting</AdminTitle>

      {error && <AdminAlert type="warning">{error}</AdminAlert>}
      {success && <AdminAlert type="success">{success}</AdminAlert>}

      <form onSubmit={handleMint}>
        <AdminFormGroup>
          <AdminLabel>Token ID</AdminLabel>
          <AdminInput
            type="number"
            name="tokenId"
            value={formData.tokenId}
            onChange={handleInputChange}
            placeholder="Enter unique token ID"
            disabled={loading}
          />
        </AdminFormGroup>

        <AdminFormGroup>
          <AdminLabel>Company Name</AdminLabel>
          <AdminInput
            type="text"
            name="companyName"
            value={formData.companyName}
            onChange={handleInputChange}
            placeholder="Enter company name"
            disabled={loading}
          />
        </AdminFormGroup>

        <AdminFormGroup>
          <AdminLabel>Description</AdminLabel>
          <AdminTextArea
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            placeholder="Enter NFT description"
            disabled={loading}
          />
        </AdminFormGroup>

        <AdminFormGroup>
          <AdminLabel>IPFS Metadata URI</AdminLabel>
          <AdminInput
            type="text"
            name="metadataUri"
            value={formData.metadataUri}
            onChange={handleInputChange}
            placeholder="ipfs://..."
            disabled={loading}
          />
        </AdminFormGroup>

        <AdminFormGroup>
          <AdminLabel>Recipient Wallet Address</AdminLabel>
          <AdminInput
            type="text"
            name="recipientAddress"
            value={formData.recipientAddress}
            onChange={handleInputChange}
            placeholder="0x..."
            disabled={loading}
          />
        </AdminFormGroup>

        <AdminButton 
          type="submit"
          disabled={loading}
          variant="success"
        >
          {loading ? 'Minting...' : 'Mint NFT'}
        </AdminButton>
      </form>
    </AdminSection>
  );
};

export default NFTMintingPanel;
