const { expect } = require("chai");
const { ethers } = require("hardhat");
const { deployContracts } = require("./helpers");

describe("AdminControls", function () {
  let adminControls, companyNFT, platformToken, owner, admin1, admin2, user1;

  beforeEach(async function () {
    const contracts = await deployContracts();
    adminControls = contracts.adminControls;
    companyNFT = contracts.companyNFT;
    platformToken = contracts.platformToken;
    owner = contracts.owner;
    admin1 = contracts.admin1;
    admin2 = contracts.admin2;
    user1 = contracts.user1;
  });

  describe("Deployment", function () {
    it("Should set up admins correctly", async function () {
      expect(await adminControls.isAdmin(admin1.address)).to.be.true;
      expect(await adminControls.isAdmin(admin2.address)).to.be.true;
      expect(await adminControls.numConfirmationsRequired()).to.equal(2);
    });

    it("Should initialize contract references", async function () {
      expect(await adminControls.companyNFT()).to.equal(await companyNFT.getAddress());
      expect(await adminControls.platformToken()).to.equal(await platformToken.getAddress());
    });
  });

  describe("Transaction Management", function () {
    let mintData;

    beforeEach(async function () {
      // Create data for minting NFT
      mintData = companyNFT.interface.encodeFunctionData("mintCompanyNFT", [
        user1.address,
        1,
        "ipfs://QmTest"
      ]);
    });

    it("Should submit transaction", async function () {
      await adminControls.connect(admin1).submitTransaction(
        await companyNFT.getAddress(),
        0,
        mintData
      );

      const tx = await adminControls.getTransaction(0);
      expect(tx.target).to.equal(await companyNFT.getAddress());
      expect(tx.data).to.equal(mintData);
      expect(tx.executed).to.be.false;
      expect(tx.numConfirmations).to.equal(0);
    });

    it("Should confirm transaction", async function () {
      // Use a simpler transaction - unpausing the platform token
      await platformToken.connect(owner).pause();
      const unpauseData = platformToken.interface.encodeFunctionData("unpause", []);

      await adminControls.connect(admin1).submitTransaction(
        await platformToken.getAddress(),
        0,
        unpauseData
      );

      await adminControls.connect(admin1).confirmTransaction(0);
      await adminControls.connect(admin2).confirmTransaction(0);

      const tx = await adminControls.getTransaction(0);
      expect(tx.executed).to.be.true;
      expect(tx.numConfirmations).to.equal(2);
      
      // Check if token was unpaused
      expect(await platformToken.paused()).to.be.false;
    });

    it("Should prevent non-admin from submitting transaction", async function () {
      await expect(
        adminControls.connect(user1).submitTransaction(
          await companyNFT.getAddress(),
          0,
          mintData
        )
      ).to.be.revertedWith("Not admin");
    });

    it("Should prevent double confirmation", async function () {
      await adminControls.connect(admin1).submitTransaction(
        await companyNFT.getAddress(),
        0,
        mintData
      );

      await adminControls.connect(admin1).confirmTransaction(0);
      await expect(
        adminControls.connect(admin1).confirmTransaction(0)
      ).to.be.revertedWith("Transaction already confirmed");
    });
  });

  describe("Admin Management", function () {
    it("Should allow owner to add admin", async function () {
      await adminControls.addAdmin(user1.address);
      expect(await adminControls.isAdmin(user1.address)).to.be.true;
    });

    it("Should allow owner to remove admin", async function () {
      await adminControls.addAdmin(user1.address);
      await adminControls.removeAdmin(user1.address);
      expect(await adminControls.isAdmin(user1.address)).to.be.false;
    });

    it("Should prevent removing admin if too few remain", async function () {
      await expect(
        adminControls.removeAdmin(admin1.address)
      ).to.be.revertedWith("Too few admins");
    });
  });

  describe("Pause Functionality", function () {
    it("Should allow owner to pause and unpause", async function () {
      await adminControls.pause();
      expect(await adminControls.paused()).to.be.true;

      await adminControls.unpause();
      expect(await adminControls.paused()).to.be.false;
    });

    it("Should prevent non-owner from pausing", async function () {
      await expect(
        adminControls.connect(user1).pause()
      ).to.be.revertedWith("Ownable: caller is not the owner");
    });
  });

  describe("Proxy Upgrades", function () {
    it("Should allow owner to upgrade contract", async function () {
      // Deploy initial implementation
      const MockImplementation = await ethers.getContractFactory("MockImplementation");
      const mockImpl = await MockImplementation.deploy();
      await mockImpl.waitForDeployment();
      const mockImplAddress = await mockImpl.getAddress();
      
      // Verify ProxyAdmin ownership
      const proxyAdmin = await adminControls.proxyAdmin();
      const proxyAdminContract = await ethers.getContractAt("ProxyAdmin", proxyAdmin);
      expect(await proxyAdminContract.owner()).to.equal(await adminControls.getAddress());
      
      // Deploy a transparent proxy
      const TransparentUpgradeableProxy = await ethers.getContractFactory("TransparentUpgradeableProxy");
      
      // Encode the initialization call
      const initData = MockImplementation.interface.encodeFunctionData("initialize", []);
      
      const proxy = await TransparentUpgradeableProxy.deploy(
        mockImplAddress,
        proxyAdmin, // Use the ProxyAdmin address
        initData
      );
      await proxy.waitForDeployment();
      const proxyAddress = await proxy.getAddress();
      
      // Deploy new implementation
      const mockImplV2 = await MockImplementation.deploy();
      await mockImplV2.waitForDeployment();
      const mockImplV2Address = await mockImplV2.getAddress();
      
      // Try to upgrade
      await adminControls.upgradeContract(proxyAddress, mockImplV2Address);
      
      // Verify the upgrade worked
      const upgradedContract = await ethers.getContractAt("MockImplementation", proxyAddress);
      await upgradedContract.setValue(42);
      expect(await upgradedContract.value()).to.equal(42);
    });

    it("Should prevent non-owner from upgrading", async function () {
      const MockImplementation = await ethers.getContractFactory("MockImplementation");
      const mockImpl = await MockImplementation.deploy();
      await mockImpl.waitForDeployment();
      
      const mockImplAddress = await mockImpl.getAddress();
      const companyNFTAddress = await companyNFT.getAddress();
      
      await expect(
        adminControls.connect(user1).upgradeContract(companyNFTAddress, mockImplAddress)
      ).to.be.revertedWith("Only owner");
    });
  });
});
