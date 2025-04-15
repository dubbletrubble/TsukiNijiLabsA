const hre = require("hardhat");

async function main() {
  const [deployer] = await ethers.getSigners();
  console.log("Deploying contracts with account:", deployer.address);

  // Admin address
  const ADMIN_ADDRESS = "0x2cda89DC7839a0f1a63ab3a11E154409c2639d1F";

  // Deploy MockPriceOracle first
  const MockPriceOracle = await hre.ethers.getContractFactory("MockPriceOracle");
  const mockPriceOracle = await MockPriceOracle.deploy();
  await mockPriceOracle.waitForDeployment();
  console.log("MockPriceOracle deployed to:", await mockPriceOracle.getAddress());

  // Set initial ETH price to $2000 (with 8 decimals)
  await mockPriceOracle.setPrice(200000000000);

  // Deploy CompanyNFT
  const CompanyNFT = await hre.ethers.getContractFactory("CompanyNFT");
  const companyNFT = await CompanyNFT.deploy();
  await companyNFT.waitForDeployment();
  console.log("CompanyNFT deployed to:", await companyNFT.getAddress());

  // Deploy PlatformToken with mock oracle
  const PlatformToken = await hre.ethers.getContractFactory("PlatformToken");
  const platformToken = await PlatformToken.deploy(await mockPriceOracle.getAddress());
  await platformToken.waitForDeployment();
  console.log("PlatformToken deployed to:", await platformToken.getAddress());

  // Deploy RevenueRouter with platform token, CompanyNFT, and treasury (using deployer as treasury for testing)
  const RevenueRouter = await hre.ethers.getContractFactory("RevenueRouter");
  const revenueRouter = await RevenueRouter.deploy(
    await companyNFT.getAddress(),
    await platformToken.getAddress(),
    deployer.address // Using deployer as treasury for testing
  );
  await revenueRouter.waitForDeployment();
  console.log("RevenueRouter deployed to:", await revenueRouter.getAddress());

  // Deploy Marketplace
  const Marketplace = await hre.ethers.getContractFactory("Marketplace");
  const marketplace = await Marketplace.deploy(
    await companyNFT.getAddress(),
    await platformToken.getAddress()
  );
  await marketplace.waitForDeployment();
  console.log("Marketplace deployed to:", await marketplace.getAddress());

  // Grant admin role to the specified address
  const DEFAULT_ADMIN_ROLE = '0x0000000000000000000000000000000000000000000000000000000000000000';
  await companyNFT.grantRole(DEFAULT_ADMIN_ROLE, ADMIN_ADDRESS);
  console.log("Admin role granted to:", ADMIN_ADDRESS);

  // Update .env.sepolia file with contract addresses
  const fs = require('fs');
  const envFile = 'frontend/.env.sepolia';
  const envContent = `REACT_APP_NETWORK=sepolia
REACT_APP_INFURA_ID=5b348ac26e3143738765417436a14224
REACT_APP_WALLET_CONNECT_PROJECT_ID=00000000000000000000000000000000

# Contract Addresses
REACT_APP_COMPANY_NFT_ADDRESS=${await companyNFT.getAddress()}
REACT_APP_MARKETPLACE_ADDRESS=${await marketplace.getAddress()}
REACT_APP_PLATFORM_TOKEN_ADDRESS=${await platformToken.getAddress()}
REACT_APP_REVENUE_ROUTER_ADDRESS=${await revenueRouter.getAddress()}

# Optional: Analytics and monitoring
REACT_APP_ENABLE_ANALYTICS=false`;

  fs.writeFileSync(envFile, envContent);
  console.log("Environment file updated with contract addresses");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
