var PeeToken = artifacts.require("./PeeToken.sol");
var PeeTokenSale = artifacts.require("./PeeTokenSale.sol");

module.exports = function(deployer) {
	deployer.deploy(PeeToken, 420000).then(function() { 

		// Token price is 0.001 ether
		var tokenPrice = 1000000000000000;
  		return deployer.deploy(PeeTokenSale, PeeToken.address, tokenPrice);
	});
};
