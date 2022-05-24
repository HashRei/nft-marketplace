import hre from "hardhat"
import { ethers } from "hardhat";
import { marketplaceAddress } from "../const"
import { NFTMarketplace } from "../typechain-types"

function sleep(ms: number) {
    return new Promise((resolve) => setTimeout(resolve, ms))
  }

async function main() {

  const ethers = (hre as any).ethers
  const [admin] = await (hre as any).ethers.getSigners()
  const chainId = "80001"
  console.log("Admin address:", admin.address)

  // Get contract factories
  const NFTMarketplace = await ethers.getContractFactory("NFTMarketplace")
  const nftMarketplace : NFTMarketplace  = await NFTMarketplace.attach(marketplaceAddress)


  console.log("await nftMarketplace.fetchMarketItems()", await nftMarketplace.fetchMarketItems())
  await nftMarketplace.burnToken(ethers.constants.One)
  console.log("await nftMarketplace.fetchMarketItems()", await nftMarketplace.fetchMarketItems())
  console.log("IT WORKS SO FAR")

  

  // await Promise.all(transactions)
  // await sleep(600000)
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
