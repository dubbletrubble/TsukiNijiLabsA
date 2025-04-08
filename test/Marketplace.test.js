const { expect } = require("chai");
const { ethers } = require("hardhat");
const { time } = require("@nomicfoundation/hardhat-network-helpers");
const { deployContracts, WEEK } = require("./helpers");

describe("Marketplace", function () {
  let marketplace, companyNFT, platformToken, owner, user1, user2;
  const COMPANY_ID = 1;
  const TOKEN_URI = "ipfs://QmTest";
  const LISTING_PRICE = ethers.parseEther("1000"); // 1000 TSKJ

  beforeEach(async function () {
    const contracts = await deployContracts();
    marketplace = contracts.marketplace;
    companyNFT = contracts.companyNFT;
    platformToken = contracts.platformToken;
    owner = contracts.owner;
    user1 = contracts.user1;
    user2 = contracts.user2;

    // Mint NFT and tokens for testing
    await companyNFT.mintCompanyNFT(user1.address, COMPANY_ID, TOKEN_URI);
    await platformToken.transfer(user2.address, ethers.parseEther("2000"));
  });

  describe("Fixed Price Listing", function () {
    beforeEach(async function () {
      await companyNFT.connect(user1).approve(await marketplace.getAddress(), 1);
    });

    it("Should create fixed price listing", async function () {
      await marketplace.connect(user1).listNFT(1, LISTING_PRICE, false);
      
      const listing = await marketplace.getListing(1);
      expect(listing.seller).to.equal(user1.address);
      expect(listing.price).to.equal(LISTING_PRICE);
      expect(listing.isAuction).to.be.false;
      expect(listing.active).to.be.true;
    });

    it("Should allow buying listed NFT", async function () {
      await marketplace.connect(user1).listNFT(1, LISTING_PRICE, false);
      
      // Get owner balance before transaction
      const ownerBalanceBefore = await platformToken.balanceOf(await owner.getAddress());
      
      await platformToken.connect(user2).approve(await marketplace.getAddress(), LISTING_PRICE);
      await marketplace.connect(user2).buyNFT(1);
      
      expect(await companyNFT.ownerOf(1)).to.equal(user2.address);
      
      // Check marketplace fee
      const fee = (LISTING_PRICE * BigInt(100)) / BigInt(10000); // 1%
      const ownerBalanceAfter = await platformToken.balanceOf(await owner.getAddress());
      expect(ownerBalanceAfter - ownerBalanceBefore).to.equal(fee);
      
      // Check seller balance
      const sellerAmount = LISTING_PRICE - fee;
      const sellerBalance = await platformToken.balanceOf(await user1.getAddress());
      expect(sellerBalance).to.equal(sellerAmount);
    });

    it("Should allow cancelling listing", async function () {
      await marketplace.connect(user1).listNFT(1, LISTING_PRICE, false);
      await marketplace.connect(user1).cancelListing(1);
      
      const listing = await marketplace.getListing(1);
      expect(listing.active).to.be.false;
      expect(await companyNFT.ownerOf(1)).to.equal(user1.address);
    });
  });

  describe("Auction Listing", function () {
    beforeEach(async function () {
      await companyNFT.connect(user1).approve(await marketplace.getAddress(), 1);
    });

    it("Should create auction listing", async function () {
      await marketplace.connect(user1).listNFT(1, LISTING_PRICE, true);
      
      const listing = await marketplace.getListing(1);
      expect(listing.isAuction).to.be.true;
      expect(listing.auctionEndTime).to.be.gt(0);
    });

    it("Should enforce minimum bid increment", async function () {
      await marketplace.connect(user1).listNFT(1, LISTING_PRICE, true);
      
      // First place initial bid
      await platformToken.connect(user2).approve(await marketplace.getAddress(), LISTING_PRICE);
      await marketplace.connect(user2).placeBid(1, LISTING_PRICE);
      
      // Try to place bid with increment less than minimum
      const lowIncrement = ethers.parseEther("6"); // Less than 7 TSKJ increment
      const lowBid = LISTING_PRICE + lowIncrement;
      await platformToken.connect(user2).approve(await marketplace.getAddress(), lowBid);
      await expect(
        marketplace.connect(user2).placeBid(1, lowBid)
      ).to.be.revertedWith("Bid increment too low");
    });

    it("Should handle auction end with bids", async function () {
      await marketplace.connect(user1).listNFT(1, LISTING_PRICE, true);
      
      const bid = LISTING_PRICE + ethers.parseEther("10");
      await platformToken.connect(user2).approve(await marketplace.getAddress(), bid);
      await marketplace.connect(user2).placeBid(1, bid);
      
      await time.increase(WEEK);
      await marketplace.endAuction(1);
      
      expect(await companyNFT.ownerOf(1)).to.equal(user2.address);
    });

    it("Should handle auction end without bids", async function () {
      await marketplace.connect(user1).listNFT(1, LISTING_PRICE, true);
      
      await time.increase(WEEK);
      await marketplace.endAuction(1);
      
      expect(await companyNFT.ownerOf(1)).to.equal(user1.address);
    });

    it("Should allow bid withdrawal after being outbid", async function () {
      await marketplace.connect(user1).listNFT(1, LISTING_PRICE, true);
      
      const bid1 = LISTING_PRICE + ethers.parseEther("10");
      await platformToken.connect(user2).approve(await marketplace.getAddress(), bid1);
      await marketplace.connect(user2).placeBid(1, bid1);
      
      const bid2 = bid1 + ethers.parseEther("10");
      await platformToken.connect(owner).approve(await marketplace.getAddress(), bid2);
      await marketplace.connect(owner).placeBid(1, bid2);
      
      const balanceBefore = await platformToken.balanceOf(await user2.getAddress());
      await marketplace.connect(user2).withdrawBid(1);
      const balanceAfter = await platformToken.balanceOf(await user2.getAddress());
      
      expect(balanceAfter - balanceBefore).to.equal(bid1);
    });
  });

  describe("Edge Cases", function () {
    it("Should prevent listing non-owned NFT", async function () {
      await expect(
        marketplace.connect(user2).listNFT(1, LISTING_PRICE, false)
      ).to.be.revertedWith("Not token owner");
    });

    it("Should prevent buying unlisted NFT", async function () {
      await expect(
        marketplace.connect(user2).buyNFT(1)
      ).to.be.revertedWith("Not active listing");
    });

    it("Should prevent bidding on expired auction", async function () {
      await companyNFT.connect(user1).approve(await marketplace.getAddress(), 1);
      await marketplace.connect(user1).listNFT(1, LISTING_PRICE, true);
      
      await time.increase(WEEK);
      
      const bid = LISTING_PRICE + ethers.parseEther("10");
      await platformToken.connect(user2).approve(await marketplace.getAddress(), bid);
      await expect(
        marketplace.connect(user2).placeBid(1, bid)
      ).to.be.revertedWith("Auction ended");
    });

    it("Should prevent ending auction early", async function () {
      await companyNFT.connect(user1).approve(await marketplace.getAddress(), 1);
      await marketplace.connect(user1).listNFT(1, LISTING_PRICE, true);
      
      await expect(
        marketplace.endAuction(1)
      ).to.be.revertedWith("Auction not ended");
    });
  });
});
