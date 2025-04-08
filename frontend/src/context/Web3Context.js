import React, { createContext, useContext, useState, useEffect } from 'react';
import { ethers } from 'ethers';
import Web3Modal from 'web3modal';

// Import contract ABIs
import { CompanyNFTABI } from '../abis/CompanyNFTABI.js';
import { MarketplaceABI } from '../abis/MarketplaceABI.js';
import { PlatformTokenABI } from '../abis/PlatformTokenABI.js';
import { RevenueRouterABI } from '../abis/RevenueRouterABI.js';

const Web3Context = createContext();

export function Web3Provider({ children }) {
  const [account, setAccount] = useState(null);
  const [provider, setProvider] = useState(null);
  const [contracts, setContracts] = useState({});
  const [chainId, setChainId] = useState(null);

  const web3Modal = new Web3Modal({
    network: "localhost",
    cacheProvider: true,
  });

  const connectWallet = async () => {
    try {
      const instance = await web3Modal.connect();
      const provider = new ethers.providers.Web3Provider(instance);
      const signer = provider.getSigner();
      const account = await signer.getAddress();
      const { chainId } = await provider.getNetwork();

      setProvider(provider);
      setAccount(account);
      setChainId(chainId);

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

      // Setup event listeners
      instance.on("accountsChanged", (accounts) => {
        setAccount(accounts[0]);
      });

      instance.on("chainChanged", (chainId) => {
        setChainId(parseInt(chainId, 16));
      });

    } catch (error) {
      console.error("Error connecting wallet:", error);
    }
  };

  const disconnectWallet = async () => {
    await web3Modal.clearCachedProvider();
    setAccount(null);
    setProvider(null);
    setContracts({});
    setChainId(null);
  };

  useEffect(() => {
    if (web3Modal.cachedProvider) {
      connectWallet();
    }
  }, []);

  return (
    <Web3Context.Provider
      value={{
        account,
        provider,
        contracts,
        chainId,
        connectWallet,
        disconnectWallet
      }}
    >
      {children}
    </Web3Context.Provider>
  );
}

export function useWeb3() {
  return useContext(Web3Context);
}
