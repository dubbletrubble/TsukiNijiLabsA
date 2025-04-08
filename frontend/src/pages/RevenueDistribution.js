import React, { useState, useEffect } from 'react';
import { useWeb3 } from '../context/Web3Context';
import { ethers } from 'ethers';

function RevenueDistribution() {
  const { account, contracts } = useWeb3();
  const [quarters, setQuarters] = useState([]);
  const [myNFTs, setMyNFTs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, [account, contracts]);

  const fetchData = async () => {
    if (!account || !contracts.revenueRouter || !contracts.companyNFT) {
      setLoading(false);
      return;
    }

    try {
      // Fetch quarters
      const currentQuarterIndex = await contracts.revenueRouter.currentQuarterIndex();
      const quarterData = [];

      for (let i = 0; i <= currentQuarterIndex; i++) {
        const quarter = await contracts.revenueRouter.quarters(i);
        quarterData.push({
          index: i,
          startTime: quarter.startTime.toString(),
          endTime: quarter.endTime.toString(),
          totalRevenue: ethers.utils.formatEther(quarter.totalRevenue),
          finalized: quarter.finalized
        });
      }

      // Fetch user's NFTs
      const balance = await contracts.companyNFT.balanceOf(account);
      const nftData = [];

      for (let i = 0; i < balance; i++) {
        const tokenId = await contracts.companyNFT.tokenOfOwnerByIndex(account, i);
        const tokenURI = await contracts.companyNFT.tokenURI(tokenId);
        const metadata = await fetch(tokenURI).then(res => res.json());
        
        // Get claimable amounts for each quarter
        const claims = await Promise.all(
          quarterData.map(async (quarter) => {
            if (!quarter.finalized) return "0";
            try {
              const amount = await contracts.revenueRouter.calculateShare(tokenId, quarter.index);
              return ethers.utils.formatEther(amount);
            } catch {
              return "0";
            }
          })
        );

        nftData.push({
          tokenId: tokenId.toString(),
          metadata,
          claims
        });
      }

      setQuarters(quarterData);
      setMyNFTs(nftData);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching data:", error);
      setLoading(false);
    }
  };

  const claimDistribution = async (tokenId, quarterIndex) => {
    if (!account || !contracts.revenueRouter) return;

    try {
      const tx = await contracts.revenueRouter.claimDistribution(tokenId, quarterIndex);
      await tx.wait();
      
      // Refresh data
      await fetchData();
    } catch (error) {
      console.error("Error claiming distribution:", error);
    }
  };

  return (
    <>
      <h1 className="h3 mb-2 text-gray-800">Revenue Distribution</h1>
      <p className="mb-4">View and claim your revenue share</p>

      {loading ? (
        <div className="text-center">
          <div className="spinner-border" role="status">
            <span className="sr-only">Loading...</span>
          </div>
        </div>
      ) : (
        <>
          {/* Quarters Overview */}
          <div className="card shadow mb-4">
            <div className="card-header py-3">
              <h6 className="m-0 font-weight-bold text-primary">Quarters Overview</h6>
            </div>
            <div className="card-body">
              <div className="table-responsive">
                <table className="table">
                  <thead>
                    <tr>
                      <th>Quarter</th>
                      <th>Start Date</th>
                      <th>End Date</th>
                      <th>Total Revenue</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {quarters.map((quarter) => (
                      <tr key={quarter.index}>
                        <td>Q{quarter.index + 1}</td>
                        <td>{new Date(quarter.startTime * 1000).toLocaleDateString()}</td>
                        <td>{new Date(quarter.endTime * 1000).toLocaleDateString()}</td>
                        <td>{quarter.totalRevenue} TSKJ</td>
                        <td>
                          <span className={`badge badge-${quarter.finalized ? 'success' : 'warning'}`}>
                            {quarter.finalized ? 'Finalized' : 'In Progress'}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* My NFTs and Claims */}
          <div className="row">
            {myNFTs.map((nft) => (
              <div key={nft.tokenId} className="col-lg-6 mb-4">
                <div className="card shadow">
                  <div className="card-header py-3">
                    <h6 className="m-0 font-weight-bold text-primary">
                      Company #{nft.tokenId}
                    </h6>
                  </div>
                  <div className="card-body">
                    <div className="text-center mb-3">
                      <img 
                        src={nft.metadata.image} 
                        alt={nft.metadata.name}
                        className="img-fluid rounded mb-3"
                        style={{ maxHeight: "150px" }}
                      />
                      <h5>{nft.metadata.name}</h5>
                    </div>
                    
                    <div className="table-responsive">
                      <table className="table">
                        <thead>
                          <tr>
                            <th>Quarter</th>
                            <th>Claimable Amount</th>
                            <th>Action</th>
                          </tr>
                        </thead>
                        <tbody>
                          {quarters.map((quarter, index) => (
                            <tr key={index}>
                              <td>Q{quarter.index + 1}</td>
                              <td>{nft.claims[index]} TSKJ</td>
                              <td>
                                {quarter.finalized && Number(nft.claims[index]) > 0 && (
                                  <button
                                    className="btn btn-primary btn-sm"
                                    onClick={() => claimDistribution(nft.tokenId, quarter.index)}
                                  >
                                    Claim
                                  </button>
                                )}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </div>
            ))}

            {myNFTs.length === 0 && (
              <div className="col-12">
                <div className="card shadow mb-4">
                  <div className="card-body text-center">
                    <p>You don't own any NFTs to claim revenue from.</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </>
      )}
    </>
  );
}

export default RevenueDistribution;
