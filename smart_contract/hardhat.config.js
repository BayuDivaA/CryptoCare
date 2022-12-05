// https://opt-goerli.g.alchemy.com/v2/gu3thyiS9UhkqwA_dy9GHshycnrglzs5

require("@nomicfoundation/hardhat-toolbox");
require("@nomicfoundation/hardhat-chai-matchers");

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.17",
  networks: {
    "optimism-goerli": {
      url: "https://opt-goerli.g.alchemy.com/v2/gu3thyiS9UhkqwA_dy9GHshycnrglzs5",
      accounts: ["542b49340fb3bcf750260dc4d64eadb1e1b717b5c4fa4d57f8e73aa20e30660c"],
    },
  },
};
