// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

/**
 * @title SimpleStorage
 * @dev A simple smart contract to store and retrieve a uint256 value on Polygon
 * @notice This is Assignment 2 for Polygon Deployment using Hardhat
 */
contract SimpleStorage {
    // State variable to store the value
    uint256 private storedValue;

    // Event emitted when the stored value changes
    event ValueChanged(uint256 newValue);

    // Owner address
    address public owner;

    /**
     * @dev Constructor sets the deployer as the owner
     */
    constructor() {
        owner = msg.sender;
    }

    /**
     * @dev Store a value in the contract
     * @param _value The uint256 value to store
     */
    function setValue(uint256 _value) public {
        // Require that only owner can set the value
        require(msg.sender == owner, "Only owner can set the value");
        storedValue = _value;
        emit ValueChanged(_value);
    }

    /**
     * @dev Retrieve the stored value
     * @return The stored uint256 value
     */
    function getValue() public view returns (uint256) {
        return storedValue;
    }
}
