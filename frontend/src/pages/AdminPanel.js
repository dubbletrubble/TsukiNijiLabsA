import React, { useState, useEffect } from 'react';
import CompanyNFTABI from '../abis/CompanyNFTABI.json';
import MarketplaceABI from '../abis/MarketplaceABI.json';
import { useAccount } from 'wagmi';
import { ethers } from 'ethers';
import { useNavigate } from 'react-router-dom';
import { AdminContainer, AdminPanel as StyledAdminPanel, AdminAlert } from '../components/admin/AdminStyles';
import AdminRolePanel from '../components/admin/AdminRolePanel';
import NFTMintingPanel from '../components/admin/NFTMintingPanel';
import PlatformSettingsPanel from '../components/admin/PlatformSettingsPanel';
import ContractControlPanel from '../components/admin/ContractControlPanel';
import MultiSigPanel from '../components/admin/MultiSigPanel';
import AdminActivityLog from '../components/admin/AdminActivityLog';

function AdminPanel() {
  const { address } = useAccount();
  const navigate = useNavigate();
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const [contracts, setContracts] = useState({});

  useEffect(() => {
    checkAdminStatus();
  }, [address]);

  const checkAdminStatus = async () => {
    if (!address || !window.ethereum) {
      setLoading(false);
      return;
    }

    try {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();

      // Initialize contracts
      const companyNFT = new ethers.Contract(
        process.env.REACT_APP_COMPANY_NFT_ADDRESS,
        CompanyNFTABI,
        signer
      );

      const marketplace = new ethers.Contract(
        process.env.REACT_APP_MARKETPLACE_ADDRESS,
        MarketplaceABI,
        signer
      );

      const revenueRouter = new ethers.Contract(
        process.env.REACT_APP_REVENUE_ROUTER_ADDRESS,
        RevenueRouterABI,
        signer
      );

      setContracts({ companyNFT, marketplace, revenueRouter });

      // Check admin role
      const DEFAULT_ADMIN_ROLE = ethers.constants.HashZero;
      const hasAdminRole = await companyNFT.hasRole(DEFAULT_ADMIN_ROLE, address);
      setIsAdmin(hasAdminRole);
    } catch (error) {
      console.error("Error checking admin status:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <AdminContainer>
        <StyledAdminPanel>
          <div style={{ textAlign: 'center', padding: '2rem' }}>
            Loading admin panel...
          </div>
        </StyledAdminPanel>
      </AdminContainer>
    );
  }

  if (!address) {
    return (
      <AdminContainer>
        <StyledAdminPanel>
          <AdminAlert type="warning">
            Please connect your wallet to access the admin panel
          </AdminAlert>
        </StyledAdminPanel>
      </AdminContainer>
    );
  }

  if (!isAdmin) {
    return (
      <AdminContainer>
        <StyledAdminPanel>
          <AdminAlert type="warning">
            Access Denied. This page is only accessible to platform administrators.
            If you believe you should have access, please contact the platform owner.
          </AdminAlert>
          <div style={{ textAlign: 'center', marginTop: '1rem' }}>
            Connected Address: {address}
          </div>
        </StyledAdminPanel>
      </AdminContainer>
    );
  }

  return (
    <AdminContainer>
      <StyledAdminPanel>
        <AdminAlert type="warning" style={{ marginBottom: '2rem' }}>
          ⚠️ You are in Admin Mode - All actions require wallet signatures and may need multi-sig approval
        </AdminAlert>

        <AdminRolePanel contracts={contracts} />
        
        <NFTMintingPanel contracts={contracts} />
        
        <PlatformSettingsPanel contracts={contracts} />
        
        <ContractControlPanel contracts={contracts} />
        
        <MultiSigPanel contracts={contracts} />
        
        <AdminActivityLog contracts={contracts} />
      </StyledAdminPanel>
    </AdminContainer>
  );
}

export default AdminPanel;
