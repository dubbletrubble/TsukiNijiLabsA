import React, { useState, useEffect } from 'react';
import { useAccount } from 'wagmi';
import { ethers } from 'ethers';
import {
  AdminSection,
  AdminTitle,
  AdminGrid,
  AdminCard,
  AdminButton,
  AdminBadge,
  AdminAlert
} from './AdminStyles';

const MultiSigPanel = ({ contracts }) => {
  const { address } = useAccount();
  const [pendingActions, setPendingActions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    fetchPendingActions();
  }, [contracts]);

  const fetchPendingActions = async () => {
    if (!contracts.companyNFT) return;

    try {
      // Get pending actions from events
      const filter = contracts.companyNFT.filters.MultiSigActionProposed();
      const events = await contracts.companyNFT.queryFilter(filter);
      
      const pendingActionPromises = events.map(async (event) => {
        const actionId = event.args.actionId;
        const action = await contracts.companyNFT.getPendingAction(actionId);
        
        // Only include actions that haven't been executed
        if (!action.executed) {
          const signatures = await contracts.companyNFT.getActionSignatures(actionId);
          return {
            id: actionId.toString(),
            description: action.description,
            proposer: action.proposer,
            signatures: signatures.map(s => s.toLowerCase()),
            deadline: action.deadline.toNumber(),
            executed: action.executed
          };
        }
        return null;
      });

      const actions = (await Promise.all(pendingActionPromises))
        .filter(action => action !== null)
        .sort((a, b) => b.deadline - a.deadline);

      setPendingActions(actions);
    } catch (error) {
      console.error("Error fetching pending actions:", error);
      setError("Failed to load pending actions");
    }
  };

  const handleApprove = async (actionId) => {
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const tx = await contracts.companyNFT.signAction(actionId);
      await tx.wait();
      
      await fetchPendingActions();
      setSuccess('Successfully signed the action');
    } catch (err) {
      setError(err.message || 'Failed to sign action');
    } finally {
      setLoading(false);
    }
  };

  const handleRevoke = async (actionId) => {
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const tx = await contracts.companyNFT.revokeSignature(actionId);
      await tx.wait();
      
      await fetchPendingActions();
      setSuccess('Successfully revoked signature');
    } catch (err) {
      setError(err.message || 'Failed to revoke signature');
    } finally {
      setLoading(false);
    }
  };

  const formatTimeLeft = (deadline) => {
    const now = Math.floor(Date.now() / 1000);
    const timeLeft = deadline - now;
    
    if (timeLeft <= 0) return 'Expired';
    
    const days = Math.floor(timeLeft / 86400);
    const hours = Math.floor((timeLeft % 86400) / 3600);
    
    return days + 'd ' + hours + 'h remaining';
  };

  return (
    <AdminSection>
      <AdminTitle>Multi-Signature Actions</AdminTitle>

      {error && <AdminAlert type="warning">{error}</AdminAlert>}
      {success && <AdminAlert type="success">{success}</AdminAlert>}

      {pendingActions.length === 0 ? (
        <AdminCard>
          <p>No pending actions requiring signatures</p>
        </AdminCard>
      ) : (
        <AdminGrid>
          {pendingActions.map(action => {
            const hasSigned = action.signatures.includes(address.toLowerCase());
            const timeLeft = formatTimeLeft(action.deadline);
            const isExpired = timeLeft === 'Expired';

            return (
              <AdminCard key={action.id}>
                <h3>Action #{action.id}</h3>
                <p>{action.description}</p>
                
                <div style={{ margin: '1rem 0' }}>
                  <AdminBadge type={isExpired ? 'warning' : 'success'}>
                    {timeLeft}
                  </AdminBadge>
                  <AdminBadge type={hasSigned ? 'success' : 'warning'} style={{ marginLeft: '0.5rem' }}>
                    {action.signatures.length} signatures
                  </AdminBadge>
                </div>

                <p>Proposed by: {action.proposer.slice(0, 6)}...{action.proposer.slice(-4)}</p>

                {!isExpired && (
                  <AdminButton
                    variant={hasSigned ? 'danger' : 'success'}
                    onClick={() => hasSigned ? handleRevoke(action.id) : handleApprove(action.id)}
                    disabled={loading}
                  >
                    {loading 
                      ? 'Processing...' 
                      : hasSigned 
                        ? 'Revoke Signature' 
                        : 'Approve Action'}
                  </AdminButton>
                )}
              </AdminCard>
            );
          })}
        </AdminGrid>
      )}
    </AdminSection>
  );
};

export default MultiSigPanel;
