const Airline = artifacts.require('../contracts/Airline.sol');

module.exports = function (deployer) {
  deployer.deploy(Airline);
};
