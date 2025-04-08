const { expect } = require("chai");
const { ethers } = require("hardhat");
const { deployContracts, deployMockPriceOracle, ZERO_ADDRESS } = require("./helpers");

describe("PlatformToken", function () {
  let platformToken, mockPriceOracle, owner, user1;
  const INITIAL_SUPPLY = ethers.parseEther("10000000"); // 10M tokens

  beforeEach(async function () {
    const contracts = await deployContracts();
    platformToken = contracts.platformToken;
    mockPriceOracle = contracts.mockPriceOracle;
    owner = contracts.owner;
    user1 = contracts.user1;
  });

  describe("Deployment", function () {
    it("Should set the correct name and symbol", async function () {
      expect(await platformToken.name()).to.equal("CompanyToken");
      expect(await platformToken.symbol()).to.equal("TSKJ");
    });

    it("Should mint initial supply to owner", async function () {
      expect(await platformToken.totalSupply()).to.equal(INITIAL_SUPPLY);
      expect(await platformToken.balanceOf(owner.address)).to.equal(INITIAL_SUPPLY);
    });

    it("Should set the price oracle address", async function () {
      expect(await platformToken.getETHPrice()).to.not.equal(0);
    });
  });

  describe("Price Oracle", function () {
    it("Should return correct ETH price", async function () {
      const price = 200000000000; // $2000.00000000
      await mockPriceOracle.setPrice(price);
      expect(await platformToken.getETHPrice()).to.equal(price);
    });

    it("Should calculate correct tokens per ETH", async function () {
      // Set ETH price to $2000 with 8 decimals ($2000.00000000)
      const price = 200000000000;
      await mockPriceOracle.setPrice(price);
      
      // At $2000/ETH and $1/token, should get 2000 tokens per ETH
      // (200000000000 * 1e18) / 1e8 = 2000 * 1e18
      const tokensPerETH = await platformToken.getTokensPerETH();
      expect(tokensPerETH).to.equal(ethers.parseEther("2000"));
    });

    it("Should allow owner to update price oracle", async function () {
      const newOracle = await deployMockPriceOracle();
      await platformToken.updatePriceOracle(await newOracle.getAddress());
      
      const newPrice = 300000000000; // $3000.00000000
      await newOracle.setPrice(newPrice);
      expect(await platformToken.getETHPrice()).to.equal(newPrice);
    });

    it("Should revert if non-owner tries to update oracle", async function () {
      const newOracle = await deployMockPriceOracle();
      await expect(
        platformToken.connect(user1).updatePriceOracle(await newOracle.getAddress())
      ).to.be.revertedWith("Ownable: caller is not the owner");
    });
  });

  describe("Minting", function () {
    it("Should allow minter to mint tokens", async function () {
      const mintAmount = ethers.parseEther("1000");
      await platformToken.mint(user1.address, mintAmount);
      expect(await platformToken.balanceOf(user1.address)).to.equal(mintAmount);
    });

    it("Should revert if non-minter tries to mint", async function () {
      const mintAmount = ethers.parseEther("1000");
      await expect(
        platformToken.connect(user1).mint(user1.address, mintAmount)
      ).to.be.revertedWith("ERC20PresetMinterPauser: must have minter role to mint");
    });
  });

  describe("Pausing", function () {
    it("Should allow pauser to pause and unpause", async function () {
      await platformToken.pause();
      expect(await platformToken.paused()).to.be.true;

      await platformToken.unpause();
      expect(await platformToken.paused()).to.be.false;
    });

    it("Should prevent transfers when paused", async function () {
      const amount = ethers.parseEther("100");
      await platformToken.transfer(user1.address, amount);
      
      await platformToken.pause();
      await expect(
        platformToken.connect(user1).transfer(owner.address, amount)
      ).to.be.revertedWith("ERC20Pausable: token transfer while paused");
    });
  });
});
