/**
 * This module provides custom hooks for interacting with the NFT marketplace smart contracts.
 * It includes hooks for the main NFT contract, marketplace contract, and platform token contract.
 * 
 * @module hooks/useNFTContract
 */

import { useContractRead, useContractWrite, useContractEvent } from 'wagmi';
import { contractAddresses } from '../config/web3';

// Import ABIs from contracts
import CompanyNFTABI from '../abis/CompanyNFTABI.json';
import MarketplaceABI from '../abis/MarketplaceABI.json';
import PlatformTokenABI from '../abis/PlatformTokenABI.json';

/**
 * Hook for interacting with the main NFT contract.
 * Provides functions for reading NFT metadata, checking ownership, and getting total supply.
 * 
 * @returns {Object} Object containing NFT contract functions and data
 * @property {BigInt} totalSupply - Total number of NFTs minted
 * @property {Function} getNFTMetadata - Function to fetch NFT metadata
 * @property {Function} getNFTOwner - Function to get NFT owner address
 */
export const useNFTContract = () => {
  const { data: totalSupply } = useContractRead({
    address: contractAddresses.CompanyNFT,
    abi: CompanyNFTABI,
    functionName: 'totalSupply'
  });

  const getNFTMetadata = async (tokenId) => {
    const data = await useContractRead({
      address: contractAddresses.CompanyNFT,
      abi: CompanyNFTABI,
      functionName: 'tokenURI',
      args: [tokenId]
    });
    
    if (data) {
      const response = await fetch(data);
      return response.json();
    }
    return null;
  };

  const getNFTOwner = async (tokenId) => {
    return await useContractRead({
      address: contractAddresses.CompanyNFT,
      abi: CompanyNFTABI,
      functionName: 'ownerOf',
      args: [tokenId]
    });
  };

  return {
    totalSupply,
    getNFTMetadata,
    getNFTOwner
  };
};

/**
 * Hook for interacting with the marketplace contract.
 * Provides functions for listing NFTs, placing bids, and managing sales.
 * 
 * @returns {Object} Object containing marketplace functions
 * @property {Function} getListing - Get listing details for an NFT
 * @property {Function} buyNFT - Purchase an NFT at the listed price
 * @property {Function} placeBid - Place a bid on an auctioned NFT
 * @property {Function} cancelListing - Cancel an active listing
 */
export const useMarketplace = () => {
  const getListing = async (tokenId) => {
    return await useContractRead({
      address: contractAddresses.Marketplace,
      abi: MarketplaceABI,
      functionName: 'getListing',
      args: [tokenId]
    });
  };

  const { writeContract } = useContractWrite();

  const listNFT = async (args) => {
    return await writeContract({
      address: contractAddresses.Marketplace,
      abi: MarketplaceABI,
      functionName: 'listNFT',
      ...args
    });
  };

  const createAuction = async (args) => {
    return await writeContract({
      address: contractAddresses.Marketplace,
      abi: MarketplaceABI,
      functionName: 'createAuction',
      ...args
    });
  };

  const placeBid = async (args) => {
    return await writeContract({
      address: contractAddresses.Marketplace,
      abi: MarketplaceABI,
      functionName: 'placeBid',
      ...args
    });
  };

  const buyNFT = async (args) => {
    return await writeContract({
      address: contractAddresses.Marketplace,
      abi: MarketplaceABI,
      functionName: 'buyNFT',
      ...args
    });
  };

  const cancelListing = async (args) => {
    return await writeContract({
      address: contractAddresses.Marketplace,
      abi: MarketplaceABI,
      functionName: 'cancelListing',
      ...args
    });
  };

  // Watch for events
  useContractEvent({
    address: contractAddresses.Marketplace,
    abi: MarketplaceABI,
    eventName: 'NFTListed',
    onLogs(logs) {
      console.log('NFT Listed:', logs);
    }
  });

  useContractEvent({
    address: contractAddresses.Marketplace,
    abi: MarketplaceABI,
    eventName: 'NFTSold',
    onLogs(logs) {
      console.log('NFT Sold:', logs);
    }
  });

  return {
    getListing,
    listNFT,
    createAuction,
    placeBid,
    buyNFT,
    cancelListing
  };
};

/**
 * Hook for interacting with the platform's ERC20 token contract.
 * Provides functions for checking balances and approving token transfers.
 * 
 * @returns {Object} Object containing token functions
 * @property {Function} getBalance - Get token balance for an address
 * @property {Function} approve - Approve token spending for marketplace
 */
export const usePlatformToken = () => {
  const getBalance = async (address) => {
    return await useContractRead({
      address: contractAddresses.PlatformToken,
      abi: PlatformTokenABI,
      functionName: 'balanceOf',
      args: [address]
    });
  };

  const { writeContract } = useContractWrite();

  const approve = async (args) => {
    return await writeContract({
      address: contractAddresses.PlatformToken,
      abi: PlatformTokenABI,
      functionName: 'approve',
      ...args
    });
  };

  const checkAllowance = async (owner, spender) => {
    return await useContractRead({
      address: contractAddresses.PlatformToken,
      abi: PlatformTokenABI,
      functionName: 'allowance',
      args: [owner, spender]
    });
  };

  return {
    getBalance,
    approve,
    checkAllowance
  };
};
