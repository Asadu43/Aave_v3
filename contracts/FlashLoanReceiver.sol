// SPDX-License-Identifier: BUSL-1.1
pragma solidity ^0.8.0;

import "./IFlashLoanReceiver.sol";
import "./IERC20.sol";
import "hardhat/console.sol";


contract FlashLoanReceiver is IFlashLoanReceiver {

  function executeOperation(
    address[] memory assets,
    uint256[] memory amounts,
    uint256[] memory premiums,
    address, // initiator
    bytes memory // params
  ) public override returns (bool) {
    
    console.log("RAI balance: ",IERC20(assets[0]).balanceOf(address(this)));
    IERC20(assets[0]).approve(0x7d2768dE32b0b80b7a3454c06BdAc94A69DDc7A9, amounts[0]+premiums[0]);
    return true;
  }

   function ADDRESSES_PROVIDER() external override view returns (IPoolAddressesProvider){

   }

  function POOL() external override view returns (IPool){

  }


}
