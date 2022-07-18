require('dotenv').config();
require("@nomiclabs/hardhat-ethers")
const PUBLIC_KEY=process.env.INFURA_NETWORK;
const PRIVATE_KEY=process.env.PRIVATE_KEY;
module.exports = {
  solidity: "0.8.9",
  networks: {
    rinkeby: {
      url: `${PUBLIC_KEY}`,
      accounts: [`0x${PRIVATE_KEY}`]
    },
  },
  paths: {
    sources: "./contracts",
    tests: "./test",
    cache: "./cache",
    artifacts: "./lottery/src/artifacts"
  },
};
