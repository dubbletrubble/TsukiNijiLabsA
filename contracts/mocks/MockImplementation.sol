// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";

contract MockImplementation is Initializable {
    uint256 public value;
    
    function initialize() public initializer {
        value = 0;
    }
    
    function setValue(uint256 _value) external {
        value = _value;
    }
}
