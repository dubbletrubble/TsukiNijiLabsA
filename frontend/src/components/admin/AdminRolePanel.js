import React, { useState, useEffect } from 'react';
import { useAccount } from 'wagmi';
import { ethers } from 'ethers';
import {
  AdminSection,
  AdminTitle,
  AdminCard,
  AdminBadge,
  AdminGrid,
  AdminAlert
} from './AdminStyles';

const AdminRolePanel = ({ contracts }) => {
  const { address } = useAccount();
  const [adminInfo, setAdminInfo] = useState({
    isAdmin: false,
    otherAdmins: [],
    multisigRequired: false,
    currentSigners: 0,
    requiredSigners: 0
  });

  useEffect(() => {
    fetchAdminInfo();
  }, [address, contracts]);

  const fetchAdminInfo = async () => {
    if (!address || !contracts.companyNFT) return;

    try {
      // Check admin role
      const DEFAULT_ADMIN_ROLE = ethers.constants.HashZero;
      const isAdmin = await contracts.companyNFT.hasRole(DEFAULT_ADMIN_ROLE, address);

      // Get other admins (for demo, we'll get recent role assignments)
      const roleGrantedFilter = contracts.companyNFT.filters.RoleGranted(DEFAULT_ADMIN_ROLE);
      const events = await contracts.companyNFT.queryFilter(roleGrantedFilter);
      const uniqueAdmins = [...new Set(events.map(e => e.args.account))];
      const otherAdmins = uniqueAdmins.filter(admin => admin.toLowerCase() !== address.toLowerCase());

      // Get multi-sig info if available
      let multisigRequired = false;
      let currentSigners = 0;
      let requiredSigners = 0;

      try {
        multisigRequired = await contracts.companyNFT.multisigRequired();
        currentSigners = await contracts.companyNFT.getCurrentSigners();
        requiredSigners = await contracts.companyNFT.getRequiredSigners();
      } catch (error) {
        console.log("Multi-sig features not available");
      }

      setAdminInfo({
        isAdmin,
        otherAdmins,
        multisigRequired,
        currentSigners,
        requiredSigners
      });
    } catch (error) {
      console.error("Error fetching admin info:", error);
    }
  };

  return (
    <AdminSection>
      <AdminTitle>Admin Role Overview</AdminTitle>
      
      <AdminAlert type="warning">
        You are operating in Admin Mode - all actions require wallet signatures
      </AdminAlert>

      <AdminGrid>
        <AdminCard>
          <h3>Your Admin Status</h3>
          <p>Wallet: {address ? `${address.slice(0, 6)}...${address.slice(-4)}` : 'Not connected'}</p>
          <AdminBadge type={adminInfo.isAdmin ? 'success' : 'warning'}>
            {adminInfo.isAdmin ? 'Admin Access Granted' : 'Not an Admin'}
          </AdminBadge>
        </AdminCard>

        {adminInfo.multisigRequired && (
          <AdminCard>
            <h3>Multi-Signature Status</h3>
            <p>Required Signatures: {adminInfo.requiredSigners}</p>
            <p>Current Signers: {adminInfo.currentSigners}</p>
            <AdminBadge type={adminInfo.currentSigners >= adminInfo.requiredSigners ? 'success' : 'warning'}>
              {adminInfo.currentSigners}/{adminInfo.requiredSigners} Signatures
            </AdminBadge>
          </AdminCard>
        )}

        <AdminCard>
          <h3>Other Admins</h3>
          {adminInfo.otherAdmins.length > 0 ? (
            <ul>
              {adminInfo.otherAdmins.map((admin, index) => (
                <li key={admin}>
                  {admin.slice(0, 6)}...{admin.slice(-4)}
                </li>
              ))}
            </ul>
          ) : (
            <p>No other admins found</p>
          )}
        </AdminCard>
      </AdminGrid>
    </AdminSection>
  );
};

export default AdminRolePanel;
