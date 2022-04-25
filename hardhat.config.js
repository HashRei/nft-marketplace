import fs from "fs";
import "@nomiclabs/hardhat-waffle";

const mnemonic = fs.existsSync("../mnemonic")
  ? fs.readFileSync("../mnemonic", "utf-8").trim()
  : "";
if (!mnemonic) console.log("Missing mnemonic");

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
  defaultNetwork: "hardhat",
  networks: {
    hardhat: {
      chainId: 1337,
    },
    mainnet: {
      url: "https://polygon-mainnet.infura.io/v3/a0cad0782a1f452dbc631e10854244ea",
      chainId: 137,
      accounts: {
        mnemonic,
      },
    },
    mumbai: {
      url: "https://polygon-mumbai.infura.io/v3/a0cad0782a1f452dbc631e10854244ea",
      chainId: 80001,
      accounts: {
        mnemonic,
      },
    },
  },
};