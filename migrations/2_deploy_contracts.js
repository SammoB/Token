var PeeToken = artifacts.require("./PeeToken.sol");

module.exports = function(deployer) {
  deployer.deploy(PeeToken);
};
