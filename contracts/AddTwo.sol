pragma solidity ^0.8.0;
import "hardhat/console.sol";

contract AddTwo {
  function add(
    uint256 a,
    uint256 b
  ) public view returns (bool) {

    // Add two Values
    console.log("add", a + b);

    // console.log("address", subContract);

    // Delegate Call (tring to Call SubContract sub Function if bytes are Correct form)
    // (bool success, ) = subContract.call(data);

    // // Checking Result.
    // console.log("Results", success);

    // return success;

    return true;
  }
}
