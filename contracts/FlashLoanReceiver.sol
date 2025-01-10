// SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

import "hardhat/console.sol";
import "./FlashLoan.sol";
import "./Token.sol";


contract FlashLoanReceiver {
    FlashLoan private pool;
    address private owner;

    constructor(address _poolAddress) {
        pool = FlashLoan(_poolAddress);
        owner = msg.sender;
    }

    function receiveTokens(address _tokenAddress, uint _amount) external {
        //do stuff with money
        require(Token(_tokenAddress).balanceOf(address(this)) == _amount, "failed to get loan amount");
        
        //receive money back
    }

    function executeFlashLoan(uint _amount) external {
        require(msg.sender == owner, "Owner only");
        pool.flashLoan(_amount);
    }

}