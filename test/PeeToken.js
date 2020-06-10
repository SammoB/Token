var PeeToken = artifacts.require("./PeeToken.sol");

contract('PeeToken', function(accounts) {
	it('sets the total supply upon deployment', function() {
 	 	return PeeToken.deployed().then(function(instance) {
 	 		tokenInstance = instance;
 	 		return tokenInstance.totalSupply();
 		}).then(function(totalSupply) {
 	 		assert.equal(totalSupply.toNumber(), 420000, 'sets the total supply to 420,000');
 	 	});
 	 });
 })