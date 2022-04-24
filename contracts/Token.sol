pragma solidity ^0.8.13;

import '@openzeppelin/contracts/token/ERC20/ERC20.sol';

contract Token is ERC20 {
  constructor(
    string memory name, 
    string memory ticker
  ) 
    ERC20(name, ticker) 
  {
    // give one token to the owner
    _mint(msg.sender, 1);
  }
}
