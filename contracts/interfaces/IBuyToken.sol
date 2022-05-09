//SPDX-License-Identifier: Unlicense
pragma solidity 0.8.9;

interface IBuyToken {

	event Buy(address _buyer, uint256 _amount);
	event Sell(address _seller, uint256 _amount);
	event Withdraw(uint256 _amount);

	function buy() payable external;

	function sell(uint256) external;

	function withdraw() external;
}