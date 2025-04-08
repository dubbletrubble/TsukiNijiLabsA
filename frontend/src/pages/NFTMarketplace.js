import React, { useState, useEffect } from 'react';
import { useWeb3 } from '../context/Web3Context';
import { ethers } from 'ethers';

function NFTMarketplace() {
  const { account, contracts } = useWeb3();
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchListings();
  }, [account, contracts]);

  const fetchListings = async () => {
    if (!account || !contracts.companyNFT || !contracts.marketplace) {
      setLoading(false);
      return;
    }

    try {
      const totalSupply = await contracts.companyNFT.totalSupply();
      const activeListings = [];

      for (let i = 0; i < totalSupply; i++) {
        const tokenId = await contracts.companyNFT.tokenByIndex(i);
        const listing = await contracts.marketplace.getListing(tokenId);
        
        if (listing.active) {
          const tokenURI = await contracts.companyNFT.tokenURI(tokenId);
          const metadata = await fetch(tokenURI).then(res => res.json());
          
          activeListings.push({
            tokenId: tokenId.toString(),
            price: ethers.utils.formatEther(listing.price),
            seller: listing.seller,
            isAuction: listing.isAuction,
            auctionEndTime: listing.auctionEndTime.toString(),
            highestBid: listing.isAuction ? ethers.utils.formatEther(listing.highestBid) : "0",
            metadata
          });
        }
      }

      setListings(activeListings);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching listings:", error);
      setLoading(false);
    }
  };

  const buyNFT = async (tokenId, price) => {
    if (!account || !contracts.marketplace || !contracts.platformToken) return;

    try {
      // Approve tokens first
      const priceWei = ethers.utils.parseEther(price);
      await contracts.platformToken.approve(contracts.marketplace.address, priceWei);
      
      // Buy NFT
      const tx = await contracts.marketplace.buyNFT(tokenId);
      await tx.wait();
      
      // Refresh listings
      await fetchListings();
    } catch (error) {
      console.error("Error buying NFT:", error);
    }
  };

  const placeBid = async (tokenId, bidAmount) => {
    if (!account || !contracts.marketplace || !contracts.platformToken) return;

    try {
      const bidWei = ethers.utils.parseEther(bidAmount);
      
      // Approve tokens first
      await contracts.platformToken.approve(contracts.marketplace.address, bidWei);
      
      // Place bid
      const tx = await contracts.marketplace.placeBid(tokenId, bidWei);
      await tx.wait();
      
      // Refresh listings
      await fetchListings();
    } catch (error) {
      console.error("Error placing bid:", error);
    }
  };

  return (
    <>
      <h1 className="h3 mb-2 text-gray-800">NFT Marketplace</h1>
      <p className="mb-4">Browse and purchase company NFTs</p>

      {loading ? (
        <div className="text-center">
          <div className="spinner-border" role="status">
            <span className="sr-only">Loading...</span>
          </div>
        </div>
      ) : (
        <div className="row">
          {listings.map((listing) => (
            <div key={listing.tokenId} className="col-lg-4 mb-4">
              <div className="card shadow">
                <div className="card-header py-3">
                  <h6 className="m-0 font-weight-bold text-primary">
                    Company #{listing.tokenId}
                  </h6>
                </div>
                <div className="card-body">
                  <div className="text-center mb-3">
                    <img 
                      src={listing.metadata.image} 
                      alt={listing.metadata.name}
                      className="img-fluid rounded mb-3"
                      style={{ maxHeight: "200px" }}
                    />
                    <h5>{listing.metadata.name}</h5>
                    <p>{listing.metadata.description}</p>
                  </div>
                  
                  <hr />

                  <div className="mb-3">
                    <strong>Price:</strong> {listing.price} TSKJ
                  </div>

                  {listing.isAuction ? (
                    <>
                      <div className="mb-3">
                        <strong>Current Bid:</strong> {listing.highestBid} TSKJ
                      </div>
                      <div className="mb-3">
                        <strong>Ends:</strong> {new Date(listing.auctionEndTime * 1000).toLocaleString()}
                      </div>
                      <input
                        type="number"
                        className="form-control mb-2"
                        placeholder="Bid Amount (TSKJ)"
                        id={`bid-${listing.tokenId}`}
                      />
                      <button
                        className="btn btn-primary btn-block"
                        onClick={() => {
                          const bidAmount = document.getElementById(`bid-${listing.tokenId}`).value;
                          placeBid(listing.tokenId, bidAmount);
                        }}
                      >
                        Place Bid
                      </button>
                    </>
                  ) : (
                    <button
                      className="btn btn-success btn-block"
                      onClick={() => buyNFT(listing.tokenId, listing.price)}
                    >
                      Buy Now
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}

          {listings.length === 0 && (
            <div className="col-12">
              <div className="card shadow mb-4">
                <div className="card-body text-center">
                  <p>No NFTs currently listed for sale.</p>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </>
  );
}

export default NFTMarketplace;
