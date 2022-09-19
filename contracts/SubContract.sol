pragma solidity ^0.8.0;

import "hardhat/console.sol";

contract SubContract{
    function sub(uint256 a,uint256 b) public view returns(bool){
        console.log("sub",a-b);
        return true;
    }
    
}