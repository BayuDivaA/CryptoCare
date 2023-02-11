require("@nomicfoundation/hardhat-toolbox");

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.17",
  networks: {
    "optimism-goerli": {
      url: "https://optimism-goerli.infura.io/v3/3d1947cbec5a45488fd1d5d0162fae38",
      accounts: ["addda02eef3646819481b1d41e64778130cf7c13053c7a09ed8edbb239f44983"],
    },
  },
};
