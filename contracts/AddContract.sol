pragma solidity ^ 0.8.0;
import "hardhat/console.sol";

contract AddContract{

    function add(uint256 a,uint256 b) public view returns (bool){

        console.log("add",a+b);


        return true;    }
}