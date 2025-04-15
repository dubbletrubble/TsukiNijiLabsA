import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAccount, useChainId, usePublicClient, useWalletClient } from 'wagmi';
import { getContract } from 'viem';

// Import contract ABIs
import { CompanyNFTABI } from '../abis/CompanyNFTABI.js';
import { MarketplaceABI } from '../abis/MarketplaceABI.js';
import { PlatformTokenABI } from '../abis/PlatformTokenABI.js';
import { RevenueRouterABI } from '../abis/RevenueRouterABI.js';

const Web3Context = createContext();

export function Web3Provider({ children }) {
  const { address } = useAccount();
  const chainId = useChainId();
  const provider = usePublicClient();
  const { data: walletClient } = useWalletClient();
  const [contracts, setContracts] = useState({});

  useEffect(() => {
    if (walletClient && address) {
      // Initialize contracts
      const companyNFT = getContract({
        address: process.env.REACT_APP_COMPANY_NFT_ADDRESS,
        abi: CompanyNFTABI.abi,
        walletClient
      });

      const marketplace = getContract({
        address: process.env.REACT_APP_MARKETPLACE_ADDRESS,
        abi: MarketplaceABI.abi,
        walletClient
      });

      const platformToken = getContract({
        address: process.env.REACT_APP_PLATFORM_TOKEN_ADDRESS,
        abi: PlatformTokenABI.abi,
        walletClient
      });

      const revenueRouter = getContract({
        address: process.env.REACT_APP_REVENUE_ROUTER_ADDRESS,
        abi: RevenueRouterABI.abi,
        walletClient
      });

      setContracts({
        companyNFT,
        marketplace,
        platformToken,
        revenueRouter
      });
    } else {
      setContracts({});
    }
  }, [walletClient, address]);

  return (
    <Web3Context.Provider
      value={{
        account: address,
        provider,
        contracts,
        chainId,
        walletClient
      }}
    >
      {children}
    </Web3Context.Provider>
  );
}

export function useWeb3() {
  return useContext(Web3Context);
}
