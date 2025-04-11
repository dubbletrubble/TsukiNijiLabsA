import React, { createContext, useContext, useState, useEffect } from 'react';
import { ethers } from 'ethers';
import { useAccount, useNetwork, usePublicClient, useWalletClient } from 'wagmi';

// Import contract ABIs
import { CompanyNFTABI } from '../abis/CompanyNFTABI.js';
import { MarketplaceABI } from '../abis/MarketplaceABI.js';
import { PlatformTokenABI } from '../abis/PlatformTokenABI.js';
import { RevenueRouterABI } from '../abis/RevenueRouterABI.js';

const Web3Context = createContext();

export function Web3Provider({ children }) {
  const { address } = useAccount();
  const { chain } = useNetwork();
  const provider = usePublicClient();
  const { data: walletClient } = useWalletClient();
  const [contracts, setContracts] = useState({});

  useEffect(() => {
    if (walletClient && address) {
      // Initialize contracts
      const companyNFT = new ethers.Contract(
        process.env.REACT_APP_COMPANY_NFT_ADDRESS,
        CompanyNFTABI.abi,
        walletClient
      );

      const marketplace = new ethers.Contract(
        process.env.REACT_APP_MARKETPLACE_ADDRESS,
        MarketplaceABI.abi,
        walletClient
      );

      const platformToken = new ethers.Contract(
        process.env.REACT_APP_PLATFORM_TOKEN_ADDRESS,
        PlatformTokenABI.abi,
        walletClient
      );

      const revenueRouter = new ethers.Contract(
        process.env.REACT_APP_REVENUE_ROUTER_ADDRESS,
        RevenueRouterABI.abi,
        walletClient
      );

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
        chainId: chain?.id,
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
