// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "./CompanyNFT.sol";
import "./PlatformToken.sol";

/**
 * @title RevenueRouter
 * @dev Manages revenue distribution for company NFT holders
 * 
 * This contract handles:
 * 1. Quarterly revenue collection (both ETH and ERC20 tokens)
 * 2. Platform fee calculation and distribution
 * 3. Revenue share calculation based on company performance
 * 4. Distribution claims by NFT holders
 */
contract RevenueRouter is Ownable, ReentrancyGuard {
    // ============ Structs ============

    struct Distribution {
        uint256 amount;      // Amount of tokens/ETH distributed
        uint256 timestamp;   // When the distribution was claimed
        bool claimed;        // Whether the distribution has been claimed
    }

    struct Quarter {
        uint256 startTime;    // Start timestamp of the quarter
        uint256 endTime;      // End timestamp of the quarter
        bool finalized;       // Whether the quarter has been finalized
        uint256 totalRevenue; // Total revenue collected in this quarter
    }

    // ============ Constants ============

    uint256 public constant CLAIM_WINDOW = 180 days;    // 6 months to claim distribution
    uint256 public constant QUARTER_DURATION = 90 days; // 3 months per quarter
    uint256 public constant MAX_PLATFORM_FEE = 1000;    // Maximum 10% platform fee

    // ============ State Variables ============

    CompanyNFT public companyNFT;           // NFT contract reference
    PlatformToken public platformToken;     // Token contract reference
    address public platformTreasury;        // Treasury address for platform fees
    uint256 public platformFeePercent = 250; // 2.50% platform fee

    // Mappings for distributions and quarters
    mapping(uint256 => mapping(uint256 => Distribution)) public distributions; // tokenId => quarterIndex => Distribution
    mapping(uint256 => Quarter) public quarters;                              // quarterIndex => Quarter
    uint256 public currentQuarterIndex;                                      // Current quarter index

    // ============ Events ============

    event RevenueReceived(uint256 indexed tokenId, uint256 amount);
    event DistributionClaimed(uint256 indexed tokenId, uint256 indexed quarterIndex, uint256 amount);
    event QuarterFinalized(uint256 indexed quarterIndex, uint256 totalRevenue);
    event FailedDistribution(uint256 indexed tokenId, uint256 indexed quarterIndex, string reason);
    event PlatformTreasuryUpdated(address indexed newTreasury);
    event PlatformFeeUpdated(uint256 newFeePercent);

    // ============ Constructor ============

    /**
     * @dev Initialize the RevenueRouter contract
     * @param _companyNFT Address of the CompanyNFT contract
     * @param _platformToken Address of the PlatformToken contract
     * @param _platformTreasury Address of the platform treasury
     */
    constructor(
        address _companyNFT,
        address _platformToken,
        address _platformTreasury
    ) {
        require(_companyNFT != address(0), "Invalid NFT address");
        require(_platformToken != address(0), "Invalid token address");
        require(_platformTreasury != address(0), "Invalid treasury address");
        
        companyNFT = CompanyNFT(_companyNFT);
        platformToken = PlatformToken(_platformToken);
        platformTreasury = _platformTreasury;
        
        // Initialize first quarter
        quarters[0].startTime = block.timestamp;
        quarters[0].endTime = block.timestamp + QUARTER_DURATION;
    }
    
    // ============ Revenue Collection ============

    /**
     * @dev Deposit token revenue for a specific NFT
     * @param tokenId The ID of the NFT the revenue is for
     * @param amount The amount of tokens to deposit
     */
    function depositTokenRevenue(uint256 tokenId, uint256 amount) external {
        require(companyNFT.ownerOf(tokenId) != address(0), "Token does not exist");
        require(amount > 0, "Amount must be greater than 0");
        
        Quarter storage quarter = quarters[currentQuarterIndex];
        require(!quarter.finalized, "Quarter already finalized");
        
        // Update quarter revenue and emit event
        quarter.totalRevenue += amount;
        emit RevenueReceived(tokenId, amount);
    }

    /**
     * @dev Fallback function - reverts ETH transfers
     */
    receive() external payable {
        revert("Use depositRevenue function to send ETH");
    }

    /**
     * @dev Deposit ETH revenue for a specific NFT
     * @param tokenId The ID of the NFT the revenue is for
     */
    function depositRevenue(uint256 tokenId) external payable {
        require(msg.value > 0, "No ETH sent");
        require(companyNFT.ownerOf(tokenId) != address(0), "Invalid token ID");

        // Update quarter revenue and emit event
        quarters[currentQuarterIndex].totalRevenue += msg.value;
        emit RevenueReceived(tokenId, msg.value);
    }

    // ============ Quarter Management ============

    /**
     * @dev Finalize the current quarter and distribute platform fees
     * @notice Can only be called by the owner after the quarter has ended
     */
    function finalizeQuarter() external onlyOwner {
        require(block.timestamp >= quarters[currentQuarterIndex].endTime, "Quarter not ended");
        require(!quarters[currentQuarterIndex].finalized, "Quarter already finalized");

        Quarter storage currentQuarter = quarters[currentQuarterIndex];
        currentQuarter.finalized = true;

        // Calculate platform fee
        uint256 totalRevenue = currentQuarter.totalRevenue;
        uint256 platformFee = (totalRevenue * platformFeePercent) / 10000;

        // Transfer platform fee to treasury
        bool success;
        if (address(this).balance >= platformFee) {
            (success, ) = platformTreasury.call{value: platformFee}("");
            require(success, "ETH fee transfer failed");
        } else {
            success = IERC20(platformToken).transfer(platformTreasury, platformFee);
            require(success, "Token fee transfer failed");
        }

        emit QuarterFinalized(currentQuarterIndex, totalRevenue);

        // Initialize next quarter
        currentQuarterIndex++;
        quarters[currentQuarterIndex].startTime = block.timestamp;
        quarters[currentQuarterIndex].endTime = block.timestamp + QUARTER_DURATION;
    }

    // ============ Distribution Management ============

    /**
     * @dev Allow NFT holders to claim their revenue share for a specific quarter
     * @param tokenId The ID of the NFT to claim for
     * @param quarterIndex The quarter index to claim from
     */
    function claimDistribution(uint256 tokenId, uint256 quarterIndex) external nonReentrant {
        require(quarters[quarterIndex].finalized, "Quarter not finalized");
        require(block.timestamp <= quarters[quarterIndex].endTime + CLAIM_WINDOW, "Claim window expired");
        require(!distributions[tokenId][quarterIndex].claimed, "Already claimed");
        require(msg.sender == companyNFT.ownerOf(tokenId), "Not token owner");

        Distribution storage dist = distributions[tokenId][quarterIndex];
        dist.claimed = true;
        dist.timestamp = block.timestamp;

        // Calculate and transfer share
        uint256 share = calculateShare(tokenId, quarterIndex);
        if (share > 0) {
            bool success = IERC20(platformToken).transfer(msg.sender, share);
            require(success, "Token transfer failed");
            dist.amount = share;
            emit DistributionClaimed(tokenId, quarterIndex, share);
        }
    }

    /**
     * @dev Calculate a company's share of the quarterly revenue
     * @param tokenId The ID of the NFT to calculate for
     * @param quarterIndex The quarter index to calculate from
     * @return The calculated share amount
     */
    function calculateShare(uint256 tokenId, uint256 quarterIndex) public view returns (uint256) {
        Quarter storage quarter = quarters[quarterIndex];
        require(quarter.finalized, "Quarter not finalized");

        // Get company data
        (, , uint256 revenue, , bool exists) = companyNFT.companies(tokenId);
        require(exists, "Company does not exist");
        
        // Return 0 if no revenue in quarter or company
        if (quarter.totalRevenue == 0 || revenue == 0) return 0;

        // Calculate distributable revenue after platform fee
        uint256 platformFee = (quarter.totalRevenue * platformFeePercent) / 10000;
        uint256 distributableRevenue = quarter.totalRevenue - platformFee;

        // Calculate company's share based on their contribution
        return (distributableRevenue * revenue) / quarter.totalRevenue;
    }

    // ============ Admin Functions ============

    /**
     * @dev Update the platform treasury address
     * @param _newTreasury New treasury address
     */
    function updatePlatformTreasury(address _newTreasury) external onlyOwner {
        require(_newTreasury != address(0), "Invalid treasury address");
        platformTreasury = _newTreasury;
        emit PlatformTreasuryUpdated(_newTreasury);
    }

    /**
     * @dev Update the platform fee percentage
     * @param _newFeePercent New fee percentage (in basis points, e.g. 250 = 2.50%)
     */
    function updatePlatformFee(uint256 _newFeePercent) external onlyOwner {
        require(_newFeePercent <= MAX_PLATFORM_FEE, "Fee too high");
        platformFeePercent = _newFeePercent;
        emit PlatformFeeUpdated(_newFeePercent);
    }

    // ============ View Functions ============

    /**
     * @dev Get information about the current quarter
     * @return index Current quarter index
     * @return startTime Quarter start timestamp
     * @return endTime Quarter end timestamp
     * @return finalized Whether the quarter is finalized
     * @return totalRevenue Total revenue collected in the quarter
     */
    function getCurrentQuarter() external view returns (
        uint256 index,
        uint256 startTime,
        uint256 endTime,
        bool finalized,
        uint256 totalRevenue
    ) {
        Quarter storage quarter = quarters[currentQuarterIndex];
        return (
            currentQuarterIndex,
            quarter.startTime,
            quarter.endTime,
            quarter.finalized,
            quarter.totalRevenue
        );
    }

    /**
     * @dev Get information about a specific distribution
     * @param tokenId The NFT token ID
     * @param quarterIndex The quarter index
     * @return amount Amount of tokens/ETH distributed
     * @return timestamp When the distribution was claimed
     * @return claimed Whether the distribution has been claimed
     */
    function getDistributionInfo(uint256 tokenId, uint256 quarterIndex) external view returns (
        uint256 amount,
        uint256 timestamp,
        bool claimed
    ) {
        Distribution storage dist = distributions[tokenId][quarterIndex];
        return (dist.amount, dist.timestamp, dist.claimed);
    }
}
