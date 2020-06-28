pragma solidity ^0.5.16;

import "./PeeToken.sol";

contract PeeTokenSale {
	address payable admin;
	PeeToken public tokenContract;
	uint256 public tokenPrice;
	uint256 public tokensSold;

	event Sell(address _buyer, uint256 _amount);
	event EndSale(uint256 _totalAmountSold);

	constructor(PeeToken _tokenContract, uint256 _tokenPrice) public {
		// Assign admin
		admin = msg.sender;
		tokenContract = _tokenContract;
		// Token Contract

		// Token Price
		tokenPrice = _tokenPrice;


	}

	// multiply
	function multiply(uint x, uint y) internal pure returns (uint z) {
		require(y == 0 || (z = x * y) / y == x);
	}

	function buyTokens(uint256 _numberOfTokens) public payable {
		// Require value is equal to tokens
		require(msg.value == multiply(_numberOfTokens, tokenPrice));
		// Require that contract has enough tokens
		require(tokenContract.balanceOf(address(this)) >= _numberOfTokens, 'cannot purchase more tokens than available');
		// Require that a transfer is successful
		require(tokenContract.transfer(msg.sender, _numberOfTokens));



		// Keep track of tokensSold
		tokensSold += _numberOfTokens;

		// Trigger Sell Event
		emit Sell(msg.sender, _numberOfTokens);
	}

	// End token sale
	function endSale() public {
		// Require admin
		require(msg.sender == admin);
		// Transfer remaining tokens to admin
		require(tokenContract.transfer(admin, tokenContract.balanceOf(address(this))));
		// destroy contract
		//admin.transfer(address(this).balance);



	}





	


}