import React, { createContext, useContext, useState, useEffect } from 'react';
import { ethers } from 'ethers';
import { useAccount, useNetwork, useProvider, useSigner } from 'wagmi';

// Import contract ABIs
import { CompanyNFTABI } from '../abis/CompanyNFTABI.js';
import { MarketplaceABI } from '../abis/MarketplaceABI.js';
import { PlatformTokenABI } from '../abis/PlatformTokenABI.js';
import { RevenueRouterABI } from '../abis/RevenueRouterABI.js';

const Web3Context = createContext();

export function Web3Provider({ children }) {
  const { address } = useAccount();
  const { chain } = useNetwork();
  const provider = useProvider();
  const { data: signer } = useSigner();
  const [contracts, setContracts] = useState({});

  useEffect(() => {
    if (signer && address) {
      // Initialize contracts
      const companyNFT = new ethers.Contract(
        process.env.REACT_APP_COMPANY_NFT_ADDRESS,
        CompanyNFTABI.abi,
        signer
      );

      const marketplace = new ethers.Contract(
        process.env.REACT_APP_MARKETPLACE_ADDRESS,
        MarketplaceABI.abi,
        signer
      );

      const platformToken = new ethers.Contract(
        process.env.REACT_APP_PLATFORM_TOKEN_ADDRESS,
        PlatformTokenABI.abi,
        signer
      );

      const revenueRouter = new ethers.Contract(
        process.env.REACT_APP_REVENUE_ROUTER_ADDRESS,
        RevenueRouterABI.abi,
        signer
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
  }, [signer, address]);

  return (
    <Web3Context.Provider
      value={{
        account: address,
        provider,
        contracts,
        chainId: chain?.id,
        signer
      }}
    >
      {children}
    </Web3Context.Provider>
  );
}

export function useWeb3() {
  return useContext(Web3Context);
}
