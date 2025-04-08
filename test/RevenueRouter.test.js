const { expect } = require("chai");
const { ethers } = require("hardhat");
const { time } = require("@nomicfoundation/hardhat-network-helpers");
const { deployContracts, QUARTER } = require("./helpers");

describe("RevenueRouter", function () {
  let revenueRouter, companyNFT, platformToken, owner, user1, user2, treasury;
  const COMPANY_ID = 1;
  const TOKEN_URI = "ipfs://QmTest";

  beforeEach(async function () {
    const contracts = await deployContracts();
    revenueRouter = contracts.revenueRouter;
    companyNFT = contracts.companyNFT;
    platformToken = contracts.platformToken;
    owner = contracts.owner;
    user1 = contracts.user1;
    user2 = contracts.user2;
    treasury = contracts.treasury;

    // Mint NFT for testing
    await companyNFT.mintCompanyNFT(user1.address, COMPANY_ID, TOKEN_URI);
  });

  describe("Revenue Deposit", function () {
    it("Should accept revenue deposits", async function () {
      const deposit = ethers.parseEther("1.0");
      await revenueRouter.depositRevenue(1, { value: deposit });
      
      const quarter = await revenueRouter.getCurrentQuarter();
      expect(quarter.totalRevenue).to.equal(deposit);
    });

    it("Should reject deposits for non-existent tokens", async function () {
      const deposit = ethers.parseEther("1.0");
      await expect(
        revenueRouter.depositRevenue(999, { value: deposit })
      ).to.be.revertedWith("ERC721: invalid token ID");
    });
  });

  describe("Quarter Management", function () {
    it("Should not allow finalizing quarter before end", async function () {
      await expect(
        revenueRouter.finalizeQuarter()
      ).to.be.revertedWith("Quarter not ended");
    });

    it("Should allow finalizing quarter after end", async function () {
      const deposit = ethers.parseEther("1.0");
      await revenueRouter.depositRevenue(1, { value: deposit });
      
      await time.increase(QUARTER);
      
      await revenueRouter.finalizeQuarter();
      const quarter = await revenueRouter.quarters(0);
      expect(quarter.finalized).to.be.true;
    });

    it("Should distribute platform fee to treasury", async function () {
      const deposit = ethers.parseEther("1.0");
      await revenueRouter.depositRevenue(1, { value: deposit });
      
      await time.increase(QUARTER);
      
      const treasuryBalanceBefore = await ethers.provider.getBalance(treasury.address);
      await revenueRouter.finalizeQuarter();
      const treasuryBalanceAfter = await ethers.provider.getBalance(treasury.address);
      
      // Platform fee should be 2.5% of deposit
      const expectedFee = deposit * BigInt(250) / BigInt(10000);
      expect(treasuryBalanceAfter - treasuryBalanceBefore).to.equal(expectedFee);
    });
  });

  describe("Distribution Claims", function () {
    beforeEach(async function () {
      const deposit = ethers.parseEther("1000"); // 1000 TSKJ
      await platformToken.connect(owner).transfer(revenueRouter.getAddress(), deposit);
      await revenueRouter.depositTokenRevenue(1, deposit);
      
      // Set company revenue data
      await companyNFT.updateCompanyData(1, deposit, 0);
      
      await time.increase(QUARTER);
      await revenueRouter.finalizeQuarter();
    });

    it("Should allow token owner to claim distribution", async function () {
      const balanceBefore = await platformToken.balanceOf(user1.address);
      
      await revenueRouter.connect(user1).claimDistribution(1, 0);
      
      const balanceAfter = await platformToken.balanceOf(user1.address);
      
      // Should receive 97.5% of deposit (after platform fee)
      const deposit = ethers.parseEther("1000");
      const expectedShare = (deposit * BigInt(9750)) / BigInt(10000);
      expect(balanceAfter - balanceBefore).to.equal(expectedShare);
    });

    it("Should prevent claiming after window expires", async function () {
      await time.increase(180 * 24 * 60 * 60); // 6 months
      await expect(
        revenueRouter.connect(user1).claimDistribution(1, 0)
      ).to.be.revertedWith("Claim window expired");
    });

    it("Should prevent double claims", async function () {
      await revenueRouter.connect(user1).claimDistribution(1, 0);
      await expect(
        revenueRouter.connect(user1).claimDistribution(1, 0)
      ).to.be.revertedWith("Already claimed");
    });
  });

  describe("Admin Functions", function () {
    it("Should allow owner to update platform treasury", async function () {
      await revenueRouter.updatePlatformTreasury(user2.address);
      expect(await revenueRouter.platformTreasury()).to.equal(user2.address);
    });

    it("Should allow owner to update platform fee", async function () {
      const newFee = 300; // 3%
      await revenueRouter.updatePlatformFee(newFee);
      expect(await revenueRouter.platformFeePercent()).to.equal(newFee);
    });

    it("Should prevent setting platform fee too high", async function () {
      const newFee = 1100; // 11%
      await expect(
        revenueRouter.updatePlatformFee(newFee)
      ).to.be.revertedWith("Fee too high");
    });
  });
});
