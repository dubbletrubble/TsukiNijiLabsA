const { ethers } = require("hardhat");
const { time } = require("@nomicfoundation/hardhat-network-helpers");

const ZERO_ADDRESS = "0x0000000000000000000000000000000000000000";
const WEEK = 7 * 24 * 60 * 60;
const QUARTER = 90 * 24 * 60 * 60;

async function deployMockPriceOracle() {
  const MockPriceOracle = await ethers.getContractFactory("MockPriceOracle");
  const mockPriceOracle = await MockPriceOracle.deploy();
  await mockPriceOracle.waitForDeployment();
  return mockPriceOracle;
}

async function deployContracts() {
  const [owner, admin1, admin2, user1, user2, treasury] = await ethers.getSigners();
  
  // Deploy mock oracle first
  const mockPriceOracle = await deployMockPriceOracle();
  const mockPriceOracleAddress = await mockPriceOracle.getAddress();
  
  // Deploy platform token
  const PlatformToken = await ethers.getContractFactory("PlatformToken");
  const platformToken = await PlatformToken.deploy(mockPriceOracleAddress);
  await platformToken.waitForDeployment();
  
  // Deploy NFT contract
  const CompanyNFT = await ethers.getContractFactory("CompanyNFT");
  const companyNFT = await CompanyNFT.deploy();
  await companyNFT.waitForDeployment();
  
  const platformTokenAddress = await platformToken.getAddress();
  const companyNFTAddress = await companyNFT.getAddress();
  
  // Deploy revenue router
  const RevenueRouter = await ethers.getContractFactory("RevenueRouter");
  const revenueRouter = await RevenueRouter.deploy(
    companyNFTAddress,
    platformTokenAddress,
    treasury.address
  );
  await revenueRouter.waitForDeployment();
  
  // Deploy marketplace
  const Marketplace = await ethers.getContractFactory("Marketplace");
  const marketplace = await Marketplace.deploy(
    companyNFTAddress,
    platformTokenAddress
  );
  await marketplace.waitForDeployment();
  
  const marketplaceAddress = await marketplace.getAddress();
  const revenueRouterAddress = await revenueRouter.getAddress();
  
  // Deploy admin controls
  const AdminControls = await ethers.getContractFactory("AdminControls");
  const adminControls = await AdminControls.deploy(
    [admin1.address, admin2.address],
    companyNFTAddress,
    platformTokenAddress,
    revenueRouterAddress,
    marketplaceAddress
  );
  await adminControls.waitForDeployment();
  
  // Set up permissions
  await companyNFT.setMarketplaceAddress(marketplaceAddress);
  const MINTER_ROLE = await platformToken.MINTER_ROLE();
  const PAUSER_ROLE = await platformToken.PAUSER_ROLE();
  await platformToken.grantRole(MINTER_ROLE, owner.address);
  await platformToken.grantRole(PAUSER_ROLE, await adminControls.getAddress());
  
  return {
    mockPriceOracle,
    platformToken,
    companyNFT,
    revenueRouter,
    marketplace,
    adminControls,
    owner,
    admin1,
    admin2,
    user1,
    user2,
    treasury
  };
}

module.exports = {
  ZERO_ADDRESS,
  WEEK,
  QUARTER,
  deployContracts,
  deployMockPriceOracle
};
