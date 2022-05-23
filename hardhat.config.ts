import "@nomiclabs/hardhat-ethers";
import "@nomiclabs/hardhat-waffle";
import "@typechain/hardhat";
import fs from "fs";

const privateKey = fs.existsSync("../secret.txt")
? fs.readFileSync("../secret.txt", "utf-8").trim()
: "";
if (!privateKey) console.log("Missing private key");

export const infuraProjectId = fs.existsSync(".infuraprojectid")
? fs.readFileSync(".infuraprojectid", "utf-8").trim()
: "";
if (!infuraProjectId) console.log("Missing infura project id");

/**
 * @type import('hardhat/config').HardhatUserConfig
 */

module.exports = {
  solidity: {
    version: "0.8.4",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200,
      },
    },
  },
  networks: {
    hardhat: {
      chainId: 1337,
    },
    mainnet: {
      url: `https://polygon-mainnet.infura.io/v3/${infuraProjectId}`,
      chainId: 137,
      gasPrice: 50000000000,
      accounts: [privateKey]
    },
    mumbai: {
      url: `https://polygon-mumbai.infura.io/v3/${infuraProjectId}`,
      chainId: 80001,
      gasPrice: 14000000000,
      accounts: [privateKey],
    },
  },
};
