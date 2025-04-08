const hre = require("hardhat");

async function main() {
  const [deployer] = await ethers.getSigners();
  console.log("Deploying contracts with account:", deployer.address);

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

  // Update .env file with contract addresses
  const fs = require('fs');
  const envFile = '.env';
  const envContent = `# Network Configuration
REACT_APP_NETWORK_URL=http://127.0.0.1:8545

# Contract Addresses
REACT_APP_COMPANY_NFT_ADDRESS=${await companyNFT.getAddress()}
REACT_APP_MARKETPLACE_ADDRESS=${await marketplace.getAddress()}
REACT_APP_PLATFORM_TOKEN_ADDRESS=${await platformToken.getAddress()}
REACT_APP_REVENUE_ROUTER_ADDRESS=${await revenueRouter.getAddress()}

# API Keys
REACT_APP_WALLET_CONNECT_PROJECT_ID=YOUR_WALLET_CONNECT_PROJECT_ID
REACT_APP_ALCHEMY_API_KEY=YOUR_ALCHEMY_API_KEY
`;

  fs.writeFileSync(envFile, envContent);
  console.log("Environment file updated with contract addresses");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
