// SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

import "hardhat/console.sol";
import "./Token.sol";
//use safe math on older versions of solidity (before 8)

interface IReceiver {
    function receiveTokens(address _tokenAddress, uint _amount) external;
}

contract FlashLoan {
    Token public token;
    uint256 public poolBalance;

    constructor(address _tokenAddress) {
        token = Token(_tokenAddress);
    }


    function depositTokens(uint256 _amount) external {
        require(_amount > 0, 'Must deposit at least one token');
        token.transferFrom(msg.sender, address(this), _amount);
        poolBalance += _amount;
    }

    function flashLoan(uint256 _borrowAmount) external {
        //send tokens to receiver
        token.transfer(msg.sender, _borrowAmount);
        
        //get paid back
        IReceiver(msg.sender).receiveTokens(address(token), _borrowAmount);
        

        //ensure loan paid back


    }

}