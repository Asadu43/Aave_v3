pragma solidity ^0.8.0;

import "hardhat/console.sol";

contract SubContract {
  function sub(uint256 a, uint256 b,address addtwoContract, bytes calldata data) public  returns (bool) {
    console.log("sub........................................", a - b);

    (bool success, ) = addtwoContract.call(data);

    return success;
  }
}
