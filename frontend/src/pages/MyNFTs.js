import React, { useState, useEffect } from 'react';
import { useWeb3 } from '../context/Web3Context';
import { ethers } from 'ethers';

function MyNFTs() {
  const { account, contracts } = useWeb3();
  const [nfts, setNfts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMyNFTs();
  }, [account, contracts]);

  const fetchMyNFTs = async () => {
    if (!account || !contracts.companyNFT) {
      setLoading(false);
      return;
    }

    try {
      const balance = await contracts.companyNFT.balanceOf(account);
      const ownedNFTs = [];

      for (let i = 0; i < balance; i++) {
        const tokenId = await contracts.companyNFT.tokenOfOwnerByIndex(account, i);
        const tokenURI = await contracts.companyNFT.tokenURI(tokenId);
        const metadata = await fetch(tokenURI).then(res => res.json());
        
        // Check if NFT is already listed
        const listing = await contracts.marketplace.getListing(tokenId);
        
        ownedNFTs.push({
          tokenId: tokenId.toString(),
          metadata,
          isListed: listing.active
        });
      }

      setNfts(ownedNFTs);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching NFTs:", error);
      setLoading(false);
    }
  };

  const listNFT = async (tokenId, price, isAuction) => {
    if (!account || !contracts.marketplace || !contracts.companyNFT) return;

    try {
      // Approve NFT first
      await contracts.companyNFT.approve(contracts.marketplace.address, tokenId);
      
      // List NFT
      const priceWei = ethers.utils.parseEther(price);
      const tx = await contracts.marketplace.listNFT(tokenId, priceWei, isAuction);
      await tx.wait();
      
      // Refresh NFTs
      await fetchMyNFTs();
    } catch (error) {
      console.error("Error listing NFT:", error);
    }
  };

  const cancelListing = async (tokenId) => {
    if (!account || !contracts.marketplace) return;

    try {
      const tx = await contracts.marketplace.cancelListing(tokenId);
      await tx.wait();
      
      // Refresh NFTs
      await fetchMyNFTs();
    } catch (error) {
      console.error("Error cancelling listing:", error);
    }
  };

  return (
    <>
      <h1 className="h3 mb-2 text-gray-800">My NFTs</h1>
      <p className="mb-4">View and manage your company NFTs</p>

      {loading ? (
        <div className="text-center">
          <div className="spinner-border" role="status">
            <span className="sr-only">Loading...</span>
          </div>
        </div>
      ) : (
        <div className="row">
          {nfts.map((nft) => (
            <div key={nft.tokenId} className="col-lg-4 mb-4">
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
                      style={{ maxHeight: "200px" }}
                    />
                    <h5>{nft.metadata.name}</h5>
                    <p>{nft.metadata.description}</p>
                  </div>
                  
                  <hr />

                  {nft.isListed ? (
                    <button
                      className="btn btn-danger btn-block"
                      onClick={() => cancelListing(nft.tokenId)}
                    >
                      Cancel Listing
                    </button>
                  ) : (
                    <>
                      <div className="form-group">
                        <input
                          type="number"
                          className="form-control mb-2"
                          placeholder="Price (TSKJ)"
                          id={`price-${nft.tokenId}`}
                        />
                      </div>
                      <div className="btn-group d-flex">
                        <button
                          className="btn btn-primary w-100"
                          onClick={() => {
                            const price = document.getElementById(`price-${nft.tokenId}`).value;
                            listNFT(nft.tokenId, price, false);
                          }}
                        >
                          List for Sale
                        </button>
                        <button
                          className="btn btn-info w-100"
                          onClick={() => {
                            const price = document.getElementById(`price-${nft.tokenId}`).value;
                            listNFT(nft.tokenId, price, true);
                          }}
                        >
                          Create Auction
                        </button>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>
          ))}

          {nfts.length === 0 && (
            <div className="col-12">
              <div className="card shadow mb-4">
                <div className="card-body text-center">
                  <p>You don't own any NFTs yet.</p>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </>
  );
}

export default MyNFTs;
