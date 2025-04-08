// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/Pausable.sol";
import "@openzeppelin/contracts/proxy/transparent/TransparentUpgradeableProxy.sol";
import "@openzeppelin/contracts/proxy/transparent/ProxyAdmin.sol";
import "./CompanyNFT.sol";
import "./PlatformToken.sol";
import "./RevenueRouter.sol";
import "./Marketplace.sol";

contract AdminControls is Ownable, Pausable {
    struct Transaction {
        address target;
        uint256 value;
        bytes data;
        bool executed;
        uint256 numConfirmations;
    }

    CompanyNFT public companyNFT;
    PlatformToken public platformToken;
    RevenueRouter public revenueRouter;
    Marketplace public marketplace;
    ProxyAdmin public proxyAdmin;

    address[] public admins;
    mapping(address => bool) public isAdmin;
    mapping(uint256 => mapping(address => bool)) public isConfirmed;
    
    uint256 public numConfirmationsRequired = 2;
    uint256 public transactionCount;
    mapping(uint256 => Transaction) public transactions;

    event TransactionSubmitted(uint256 indexed txIndex, address indexed submitter);
    event TransactionConfirmed(uint256 indexed txIndex, address indexed confirmer);
    event TransactionExecuted(uint256 indexed txIndex);
    event AdminAdded(address indexed admin);
    event AdminRemoved(address indexed admin);

    modifier onlyAdmin() {
        require(isAdmin[msg.sender], "Not admin");
        _;
    }

    modifier txExists(uint256 _txIndex) {
        require(_txIndex < transactionCount, "Transaction does not exist");
        _;
    }

    modifier notExecuted(uint256 _txIndex) {
        require(!transactions[_txIndex].executed, "Transaction already executed");
        _;
    }

    modifier notConfirmed(uint256 _txIndex) {
        require(!isConfirmed[_txIndex][msg.sender], "Transaction already confirmed");
        _;
    }

    constructor(
        address[] memory _admins,
        address _companyNFT,
        address _platformToken,
        address _revenueRouter,
        address _marketplace
    ) {
        require(_admins.length >= numConfirmationsRequired, "Invalid number of admins");
        
        for (uint256 i = 0; i < _admins.length; i++) {
            address admin = _admins[i];
            require(admin != address(0), "Invalid admin");
            require(!isAdmin[admin], "Admin not unique");

            isAdmin[admin] = true;
            admins.push(admin);
            emit AdminAdded(admin);
        }

        companyNFT = CompanyNFT(_companyNFT);
        platformToken = PlatformToken(_platformToken);
        revenueRouter = RevenueRouter(payable(_revenueRouter));
        marketplace = Marketplace(_marketplace);
        
        proxyAdmin = new ProxyAdmin();
        proxyAdmin.transferOwnership(address(this));
    }

    function submitTransaction(
        address _target,
        uint256 _value,
        bytes memory _data
    ) public onlyAdmin {
        uint256 txIndex = transactionCount;

        transactions[txIndex] = Transaction({
            target: _target,
            value: _value,
            data: _data,
            executed: false,
            numConfirmations: 0
        });

        transactionCount += 1;
        emit TransactionSubmitted(txIndex, msg.sender);
    }

    function confirmTransaction(uint256 _txIndex)
        public
        onlyAdmin
        txExists(_txIndex)
        notExecuted(_txIndex)
        notConfirmed(_txIndex)
    {
        Transaction storage transaction = transactions[_txIndex];
        transaction.numConfirmations += 1;
        isConfirmed[_txIndex][msg.sender] = true;

        emit TransactionConfirmed(_txIndex, msg.sender);

        if (transaction.numConfirmations >= numConfirmationsRequired) {
            executeTransaction(_txIndex);
        }
    }

    function executeTransaction(uint256 _txIndex)
        internal
        txExists(_txIndex)
        notExecuted(_txIndex)
    {
        Transaction storage transaction = transactions[_txIndex];
        require(
            transaction.numConfirmations >= numConfirmationsRequired,
            "Not enough confirmations"
        );

        (bool success, bytes memory returnData) = transaction.target.call{value: transaction.value}(
            transaction.data
        );
        
        if (!success) {
            // Try to extract the revert reason
            if (returnData.length > 0) {
                // The easiest way to bubble the revert reason is using memory via assembly
                assembly {
                    let returnDataSize := mload(returnData)
                    revert(add(32, returnData), returnDataSize)
                }
            } else {
                revert("Transaction failed");
            }
        }
        
        transaction.executed = true;

        emit TransactionExecuted(_txIndex);
    }

    // Admin management functions
    function addAdmin(address _admin) public onlyOwner {
        require(_admin != address(0), "Invalid admin");
        require(!isAdmin[_admin], "Already admin");

        isAdmin[_admin] = true;
        admins.push(_admin);
        emit AdminAdded(_admin);
    }

    function removeAdmin(address _admin) public onlyOwner {
        require(isAdmin[_admin], "Not admin");
        require(admins.length > numConfirmationsRequired, "Too few admins");

        isAdmin[_admin] = false;
        for (uint256 i = 0; i < admins.length; i++) {
            if (admins[i] == _admin) {
                admins[i] = admins[admins.length - 1];
                admins.pop();
                break;
            }
        }
        emit AdminRemoved(_admin);
    }

    // Proxy upgrade functions
    function upgradeContract(address _contract, address _implementation) external {
        require(msg.sender == owner(), "Only owner");
        require(_contract != address(0), "Invalid contract address");
        require(_implementation != address(0), "Invalid implementation address");
        
        try proxyAdmin.upgrade(ITransparentUpgradeableProxy(payable(_contract)), _implementation) {
            // Success
        } catch Error(string memory reason) {
            revert(reason);
        } catch {
            revert("Upgrade failed");
        }
    }

    // Pause/Unpause functions
    function pause() external onlyOwner {
        _pause();
    }

    function unpause() external onlyOwner {
        _unpause();
    }

    // Utility functions
    function getAdmins() external view returns (address[] memory) {
        return admins;
    }

    function getTransaction(uint256 _txIndex)
        external
        view
        returns (
            address target,
            uint256 value,
            bytes memory data,
            bool executed,
            uint256 numConfirmations
        )
    {
        Transaction storage transaction = transactions[_txIndex];
        return (
            transaction.target,
            transaction.value,
            transaction.data,
            transaction.executed,
            transaction.numConfirmations
        );
    }

    receive() external payable {}
}
