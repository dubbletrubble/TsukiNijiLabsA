const hre = require("hardhat");
const { ethers } = require("hardhat");

async function main() {
  const [deployer] = await ethers.getSigners();
  console.log("Setting admin with account:", deployer.address);

  // Address of the deployed CompanyNFT contract
  const COMPANY_NFT_ADDRESS = "0x84D953B3815b0623951a4ADb93d1a196F1B24891";
  
  // The wallet to set as admin
  const ADMIN_WALLET = "0x2cda89DC7839a0f1a63ab3a11E154409c2639d1F";

  // Minimal ABI for interacting with OpenZeppelin AccessControl contract
  const minimalABI = [
    {
      "inputs": [],
      "name": "DEFAULT_ADMIN_ROLE",
      "outputs": [{ "type": "bytes32" }],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [{ "type": "bytes32" }, { "type": "address" }],
      "name": "hasRole",
      "outputs": [{ "type": "bool" }],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [{ "type": "bytes32" }, { "type": "address" }],
      "name": "grantRole",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    }
  ];

  const companyNFT = new ethers.Contract(COMPANY_NFT_ADDRESS, minimalABI, deployer);
  
  try {
    // Get the DEFAULT_ADMIN_ROLE constant
    const DEFAULT_ADMIN_ROLE = await companyNFT.DEFAULT_ADMIN_ROLE();
    console.log("Default admin role:", DEFAULT_ADMIN_ROLE);
    
    // Check if admin wallet already has the role
    const hasAdminRole = await companyNFT.hasRole(DEFAULT_ADMIN_ROLE, ADMIN_WALLET);
    console.log(`Admin wallet ${ADMIN_WALLET} has admin role: ${hasAdminRole}`);

    if (hasAdminRole) {
      console.log("The specified wallet already has the admin role.");
      return;
    }

    // Grant admin role to the specified wallet
    const tx = await companyNFT.grantRole(DEFAULT_ADMIN_ROLE, ADMIN_WALLET);
    await tx.wait();
    
    console.log(`Admin role granted to ${ADMIN_WALLET}. Transaction hash: ${tx.hash}`);
  } catch (error) {
    console.error("Error:", error.message);
    if (error.data) {
      console.error("Error data:", error.data);
    }
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
