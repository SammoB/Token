var PeeToken = artifacts.require("./PeeToken.sol");
var PeeTokenSale = artifacts.require("./PeeTokenSale.sol");

module.exports = function(deployer) {
	deployer.deploy(PeeToken, 420000).then(function() { 

		// Token price is 0.001 ether
		var tokenPrice = 1000000000000000;
  		return deployer.deploy(PeeTokenSale, PeeToken.address, tokenPrice);
  		}).then(function() {
    	var tokensAvailable = 69000;
    	PeeToken.deployed().then(function(instance) { instance.transfer(PeeTokenSale.address, tokensAvailable, { from: 0x355B8E5bEdeBd6ae9AfD4852265A064053398550 }); })

	});
};
