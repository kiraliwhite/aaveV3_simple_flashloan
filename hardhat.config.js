require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config();

const MAINNET_RPC_URL = process.env.MAINNET_RPC_URL;
const ETHERSACN_API_KEY = process.env.ETHERSACN_API_KEY;

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.24",
  networks: {
    hardhat: {
      forking: {
        url: MAINNET_RPC_URL,
      },
    },
  },
  etherscan: {
    apiKey: ETHERSACN_API_KEY,
  },
};
