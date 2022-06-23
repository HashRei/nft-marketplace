import { expect } from "chai";
import { ethers } from "hardhat";
import { BigNumber, Contract, ContractFactory } from "ethers";
import { NFTMarketplace } from "../typechain-types";

let NFTMarketplace;
let nftMarketplace: NFTMarketplace;
let listingPrice: any;
let auctionPrice: BigNumber;

beforeEach(async function () {
  /** Deploy core contracts **/

  // Deploy the marketplace
  NFTMarketplace = await ethers.getContractFactory("NFTMarketplace");
  nftMarketplace = await NFTMarketplace.deploy();
  await nftMarketplace.deployed();

  listingPrice = await nftMarketplace.getListingPrice();
  listingPrice = listingPrice.toString();

  auctionPrice = ethers.utils.parseUnits("0.003", "ether"); // The actual price is in MATIC

  // Checks
  expect(listingPrice).to.equal(ethers.utils.parseUnits("0.003", "ether"));
  expect(nftMarketplace.address).to.not.equal(ethers.constants.AddressZero);
});

describe("NFTMarket", function () {
  it("Should create a token", async function () {
    const token = await nftMarketplace.createToken(
      "https://www.mytokenlocation.com", // Uniform Resource Identifier (URI) may point to JSON file that conforms to the ERC721 but not here
      auctionPrice,
      { value: listingPrice }
    );

    // Check
    expect(token).to.not.equal(ethers.constants.AddressZero);
  });

  it("Should sell a token", async function () {
    const [_, buyerAddress] = await ethers.getSigners(); // Here the first address is ignored thanks to the _

    await nftMarketplace.createToken(
      "https://www.mytokenlocation.com", // Uniform Resource Identifier (URI) may point to JSON file that conforms to the ERC721 but not here
      auctionPrice,
      { value: listingPrice }
    );

    const previousNFTMarketplaceState = await nftMarketplace.fetchMarketItems();

    // Execute sale of token to the buyerAddress
    await nftMarketplace
      .connect(buyerAddress)
      .createMarketSale(1, { value: auctionPrice });

    //Checks
    expect(previousNFTMarketplaceState).to.not.equal(
      await nftMarketplace.fetchMarketItems()
    );
    expect(
      await nftMarketplace.connect(buyerAddress).fetchMyNFTs()
    ).to.not.equal(ethers.constants.AddressZero);
  });

  it("Should resell a token", async function () {
    const [_, buyerAddress] = await ethers.getSigners(); // Here the first address is ignored thanks to the _

    const token = await nftMarketplace.createToken(
      "https://www.mytokenlocation.com", // Uniform Resource Identifier (URI) may point to JSON file that conforms to the ERC721 but not here
      auctionPrice,
      { value: listingPrice }
    );

    // execute sale of token to the buyerAddress
    await nftMarketplace
      .connect(buyerAddress)
      .createMarketSale(1, { value: auctionPrice });

    const tokenSecondState = await nftMarketplace
      .connect(buyerAddress)
      .fetchMyNFTs();

    // Resell a token
    await nftMarketplace
      .connect(buyerAddress)
      .resellToken(1, auctionPrice, { value: listingPrice });

    // Checks
    expect(await nftMarketplace.fetchMarketItems()).to.not.equal(token);
    expect(await nftMarketplace.fetchMarketItems()).to.not.equal(
      tokenSecondState
    );
  });

  it.only("Should burn a token", async function () {
    await nftMarketplace.createToken(
      "https://www.mytokenlocation.com", // Uniform Resource Identifier (URI) may point to JSON file that conforms to the ERC721 but not here
      auctionPrice,
      { value: listingPrice }
    );

    const previousBalance = await nftMarketplace.balanceOf(nftMarketplace.address);


    await nftMarketplace.burnToken(ethers.constants.One);

  

    // Checks
    expect(previousBalance).to.equal(
      ethers.constants.One
    );
    expect(await nftMarketplace.balanceOf(nftMarketplace.address)).to.equal(
      ethers.constants.Zero
    );
  });
});
