//SPDX-License-Identifier: Unlicense
pragma solidity 0.8.9;

import "./interfaces/IDramToken.sol";
import "./interfaces/IBuyToken.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract BuyToken is Ownable, IBuyToken {

	address private token; // = 0x00...0

	constructor(address _token) {
		token = _token;
	}

	function buy() external payable override {
		IDramToken(token).mint(msg.sender, msg.value);
		emit Buy(msg.sender, msg.value);
	}

	function sell(uint256 _amount) external override{
		require(IDramToken(token).balanceOf(msg.sender) >= _amount, "Error");
		IDramToken(token).burn(msg.sender, _amount);
		payable(msg.sender).transfer(_amount);
		emit Sell(msg.sender, _amount);
	}

	function withdraw() external onlyOwner {
		uint256 toTransfer = address(this).balance;
		payable(msg.sender).transfer(toTransfer);
		emit Withdraw(toTransfer);
	}
}