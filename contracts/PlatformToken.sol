// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/token/ERC20/presets/ERC20PresetMinterPauser.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@chainlink/contracts/src/v0.8/interfaces/AggregatorV3Interface.sol";

/**
 * @title PlatformToken
 * @dev ERC20 token for the platform with price oracle integration
 * 
 * This contract handles:
 * 1. ERC20 token functionality with minting and pausing
 * 2. ETH price oracle integration for token price calculation
 * 3. Fixed USD price conversion to tokens
 */
contract PlatformToken is ERC20PresetMinterPauser, Ownable {
    // ============ Constants ============

    /// @dev Initial token supply: 10 million tokens with 18 decimals
    uint256 private constant INITIAL_SUPPLY = 10_000_000 * 10**18;

    /// @dev Decimal precision for ETH price from Chainlink
    uint256 private constant CHAINLINK_DECIMALS = 8;

    /// @dev Decimal precision for ERC20 tokens
    uint256 private constant TOKEN_DECIMALS = 18;

    // ============ State Variables ============

    /// @dev Chainlink ETH/USD price feed
    AggregatorV3Interface private ethPriceOracle;

    // ============ Events ============

    /// @dev Emitted when the price oracle address is updated
    event PriceOracleUpdated(address indexed newOracle);

    /**
     * @dev Initialize the PlatformToken contract
     * @param _ethPriceOracle Address of the Chainlink ETH/USD price feed
     */
    constructor(address _ethPriceOracle) 
        ERC20PresetMinterPauser("CompanyToken", "TSKJ") 
    {
        require(_ethPriceOracle != address(0), "Invalid oracle address");
        ethPriceOracle = AggregatorV3Interface(_ethPriceOracle);
        _mint(msg.sender, INITIAL_SUPPLY);
    }

    // ============ Admin Functions ============

    /**
     * @dev Update the ETH price oracle address
     * @param _newOracle Address of the new Chainlink price feed
     */
    function updatePriceOracle(address _newOracle) external onlyOwner {
        require(_newOracle != address(0), "Invalid oracle address");
        ethPriceOracle = AggregatorV3Interface(_newOracle);
        emit PriceOracleUpdated(_newOracle);
    }

    // ============ View Functions ============

    /**
     * @dev Get the current ETH price in USD
     * @return The ETH price with 8 decimals
     */
    function getETHPrice() public view returns (uint256) {
        (, int256 price,,,) = ethPriceOracle.latestRoundData();
        require(price > 0, "Invalid price");
        return uint256(price);
    }

    /**
     * @dev Calculate how many tokens can be bought with 1 ETH
     * @notice Token price is fixed at $1 USD
     * @return Number of tokens per ETH with 18 decimals
     * 
     * For example: if ETH is $2000 (200000000000), then:
     * 1 ETH = 2000 USD = 2000 tokens
     */
    function getTokensPerETH() public view returns (uint256) {
        uint256 ethPrice = getETHPrice();
        // Convert ETH price (8 decimals) to tokens (18 decimals)
        return (ethPrice * 10**TOKEN_DECIMALS) / 10**CHAINLINK_DECIMALS;
    }
}
