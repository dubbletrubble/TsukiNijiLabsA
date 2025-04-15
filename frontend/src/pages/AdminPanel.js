import React, { useState, useEffect } from 'react';
import { useAccount, useReadContract } from 'wagmi';
import { useNavigate } from 'react-router-dom';
import { AdminContainer, AdminPanel as StyledAdminPanel, AdminAlert } from '../components/admin/AdminStyles';
import AdminRolePanel from '../components/admin/AdminRolePanel';
import NFTMintingPanel from '../components/admin/NFTMintingPanel';
import PlatformSettingsPanel from '../components/admin/PlatformSettingsPanel';
import ContractControlPanel from '../components/admin/ContractControlPanel';
import MultiSigPanel from '../components/admin/MultiSigPanel';
import AdminActivityLog from '../components/admin/AdminActivityLog';
import { contractAddresses } from '../config/web3';
import CompanyNFTABI from '../abis/CompanyNFTABI.json';

// Hardcoded admin wallet for testing on Sepolia
const ADMIN_WALLET = '0x2cda89DC7839a0f1a63ab3a11E154409c2639d1F'.toLowerCase();

function AdminPanel() {
  const { address } = useAccount();
  const navigate = useNavigate();
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);


  const DEFAULT_ADMIN_ROLE = '0x0000000000000000000000000000000000000000000000000000000000000000';
  
  const { data: hasAdminRole, isLoading: roleCheckLoading } = useReadContract({
    address: contractAddresses.CompanyNFT,
    abi: CompanyNFTABI,
    functionName: 'hasRole',
    args: [DEFAULT_ADMIN_ROLE, address],
    enabled: !!address
  });

  useEffect(() => {
    if (!roleCheckLoading) {
      // Check if the connected address is the admin wallet OR has admin role in the contract
      const isHardcodedAdmin = address && address.toLowerCase() === ADMIN_WALLET;
      setIsAdmin(isHardcodedAdmin || !!hasAdminRole);
      setLoading(false);
    }
  }, [hasAdminRole, roleCheckLoading, address]);

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

        <AdminRolePanel />
        
        <NFTMintingPanel />
        
        <PlatformSettingsPanel />
        
        <ContractControlPanel />
        
        <MultiSigPanel />
        
        <AdminActivityLog />
      </StyledAdminPanel>
    </AdminContainer>
  );
}

export default AdminPanel;
