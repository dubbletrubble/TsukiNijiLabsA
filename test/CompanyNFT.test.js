const { expect } = require("chai");
const { ethers } = require("hardhat");
const { deployContracts, ZERO_ADDRESS } = require("./helpers");

describe("CompanyNFT", function () {
  let companyNFT, marketplace, platformToken, owner, user1, user2;
  const TOKEN_URI = "ipfs://QmTest";
  const COMPANY_ID = 1;

  beforeEach(async function () {
    const contracts = await deployContracts();
    companyNFT = contracts.companyNFT;
    marketplace = contracts.marketplace;
    platformToken = contracts.platformToken;
    owner = contracts.owner;
    user1 = contracts.user1;
    user2 = contracts.user2;
  });

  describe("Deployment", function () {
    it("Should set the correct name and symbol", async function () {
      expect(await companyNFT.name()).to.equal("CompanyNFT");
      expect(await companyNFT.symbol()).to.equal("CNFT");
    });
  });

  describe("Minting", function () {
    it("Should allow owner to mint NFT", async function () {
      await companyNFT.mintCompanyNFT(user1.address, COMPANY_ID, TOKEN_URI);
      
      expect(await companyNFT.ownerOf(1)).to.equal(user1.address);
      expect(await companyNFT.tokenURI(1)).to.equal(TOKEN_URI);
      
      const company = await companyNFT.companies(1);
      expect(company.companyId).to.equal(COMPANY_ID);
      expect(company.currentOwner).to.equal(user1.address);
      expect(company.exists).to.be.true;
    });

    it("Should prevent non-owner from minting", async function () {
      await expect(
        companyNFT.connect(user1).mintCompanyNFT(user1.address, COMPANY_ID, TOKEN_URI)
      ).to.be.revertedWith("Ownable: caller is not the owner");
    });

    it("Should prevent minting duplicate company IDs", async function () {
      await companyNFT.mintCompanyNFT(user1.address, COMPANY_ID, TOKEN_URI);
      await expect(
        companyNFT.mintCompanyNFT(user2.address, COMPANY_ID, TOKEN_URI)
      ).to.be.revertedWith("Company ID already used");
    });
  });

  describe("Company Data", function () {
    beforeEach(async function () {
      await companyNFT.mintCompanyNFT(user1.address, COMPANY_ID, TOKEN_URI);
    });

    it("Should allow owner to update company data", async function () {
      const revenue = ethers.parseEther("1000");
      const profit = ethers.parseEther("100");
      
      await companyNFT.updateCompanyData(1, revenue, profit);
      
      const company = await companyNFT.companies(1);
      expect(company.monthlyRevenue).to.equal(revenue);
      expect(company.monthlyProfit).to.equal(profit);
    });

    it("Should prevent non-owner from updating company data", async function () {
      const revenue = ethers.parseEther("1000");
      const profit = ethers.parseEther("100");
      
      await expect(
        companyNFT.connect(user1).updateCompanyData(1, revenue, profit)
      ).to.be.revertedWith("Ownable: caller is not the owner");
    });
  });

  describe("Transfer Restrictions", function () {
    beforeEach(async function () {
      await companyNFT.mintCompanyNFT(user1.address, COMPANY_ID, TOKEN_URI);
    });

    it("Should allow marketplace to transfer NFT", async function () {
      const marketplaceAddress = await marketplace.getAddress();
      await companyNFT.connect(user1).approve(marketplaceAddress, 1);
      
      // Create a listing to test marketplace transfer
      const listingPrice = ethers.parseEther("1000");
      await platformToken.connect(owner).transfer(user2.address, listingPrice);
      await marketplace.connect(user1).listNFT(1, listingPrice, false);
      await platformToken.connect(user2).approve(marketplaceAddress, listingPrice);
      await marketplace.connect(user2).buyNFT(1);
      
      expect(await companyNFT.ownerOf(1)).to.equal(user2.address);
      const company = await companyNFT.companies(1);
      expect(company.currentOwner).to.equal(user2.address);
    });

    it("Should prevent direct transfers between users", async function () {
      await companyNFT.connect(user1).approve(user2.address, 1);
      await expect(
        companyNFT.connect(user2).transferFrom(user1.address, user2.address, 1)
      ).to.be.revertedWith("Transfers only allowed through marketplace");
    });
  });

  describe("Token URI", function () {
    it("Should return correct token URI", async function () {
      await companyNFT.mintCompanyNFT(user1.address, COMPANY_ID, TOKEN_URI);
      expect(await companyNFT.tokenURI(1)).to.equal(TOKEN_URI);
    });

    it("Should revert for non-existent token", async function () {
      await expect(
        companyNFT.tokenURI(999)
      ).to.be.revertedWith("URI query for nonexistent token");
    });
  });
});
