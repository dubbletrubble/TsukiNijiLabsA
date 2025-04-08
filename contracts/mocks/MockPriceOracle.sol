// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

contract MockPriceOracle {
    int256 private price;
    uint8 private _decimals = 8;

    constructor() {
        price = 200000000000; // $2000.00000000 per ETH
    }

    function latestRoundData()
        external
        view
        returns (
            uint80 roundId,
            int256 answer,
            uint256 startedAt,
            uint256 updatedAt,
            uint80 answeredInRound
        )
    {
        return (
            1,
            price,
            block.timestamp - 1,
            block.timestamp,
            1
        );
    }

    function setPrice(int256 _price) external {
        price = _price;
    }

    function decimals() external view returns (uint8) {
        return _decimals;
    }
}
