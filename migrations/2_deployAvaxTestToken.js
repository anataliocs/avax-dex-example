const avaxTestToken = artifacts.require("AvaxTestToken");
const dex = artifacts.require("Dex");

module.exports = function (deployer) {
  deployer.deploy(avaxTestToken).then(async function() {
    return deployer.deploy(dex, avaxTestToken.address);
  });
};
