import React, { useState, useEffect } from 'react';
import {
  AdminSection,
  AdminTitle,
  AdminGrid,
  AdminCard,
  AdminButton,
  AdminBadge,
  AdminAlert
} from './AdminStyles';

const ContractControlPanel = ({ contracts }) => {
  const [contractStates, setContractStates] = useState({
    companyNFT: { paused: false, loading: false },
    marketplace: { paused: false, loading: false },
    revenueRouter: { paused: false, loading: false }
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    fetchContractStates();
  }, [contracts]);

  const fetchContractStates = async () => {
    try {
      const [nftPaused, marketplacePaused, routerPaused] = await Promise.all([
        contracts.companyNFT.paused(),
        contracts.marketplace.paused(),
        contracts.revenueRouter.paused()
      ]);

      setContractStates({
        companyNFT: { paused: nftPaused, loading: false },
        marketplace: { paused: marketplacePaused, loading: false },
        revenueRouter: { paused: routerPaused, loading: false }
      });
    } catch (error) {
      console.error("Error fetching contract states:", error);
      setError("Failed to load contract states");
    }
  };

  const handleTogglePause = async (contractName) => {
    if (!contracts[contractName]) return;

    // Show warning and get confirmation
    const action = contractStates[contractName].paused ? 'resume' : 'pause';
    const confirmed = window.confirm(
      'Are you sure you want to ' + action + ' the ' + contractName + ' contract?\n\n' +
      'This will ' + (action === 'pause' ? 'temporarily stop' : 'restart') + ' all interactions with this contract.\n\n' +
      'This action requires a wallet signature and may need multi-sig approval.'
    );

    if (!confirmed) return;

    setContractStates(prev => ({
      ...prev,
      [contractName]: { ...prev[contractName], loading: true }
    }));
    setError('');
    setSuccess('');

    try {
      const contract = contracts[contractName];
      const tx = await (contractStates[contractName].paused ? contract.unpause() : contract.pause());
      await tx.wait();

      await fetchContractStates();
      setSuccess('Successfully ' + action + 'd ' + contractName);
    } catch (err) {
      setError('Failed to ' + action + ' ' + contractName + ': ' + err.message);
      setContractStates(prev => ({
        ...prev,
        [contractName]: { ...prev[contractName], loading: false }
      }));
    }
  };

  return (
    <AdminSection>
      <AdminTitle>Contract Control</AdminTitle>

      {error && <AdminAlert type="warning">{error}</AdminAlert>}
      {success && <AdminAlert type="success">{success}</AdminAlert>}

      <AdminAlert type="warning">
        ⚠️ Warning: Pausing contracts will temporarily stop all user interactions. Use with caution!
      </AdminAlert>

      <AdminGrid>
        {Object.entries(contractStates).map(([contractName, state]) => (
          <AdminCard key={contractName}>
            <h3>{contractName}</h3>
            <div style={{ margin: '1rem 0' }}>
              <AdminBadge type={state.paused ? 'warning' : 'success'}>
                {state.paused ? 'Paused' : 'Active'}
              </AdminBadge>
            </div>
            <AdminButton
              variant={state.paused ? 'success' : 'danger'}
              onClick={() => handleTogglePause(contractName)}
              disabled={state.loading}
            >
              {state.loading 
                ? 'Processing...' 
                : state.paused 
                  ? 'Resume Contract' 
                  : 'Pause Contract'}
            </AdminButton>
          </AdminCard>
        ))}
      </AdminGrid>
    </AdminSection>
  );
};

export default ContractControlPanel;
