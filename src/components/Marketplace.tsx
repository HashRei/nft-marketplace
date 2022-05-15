import { ethers } from "ethers";
import { useEffect, useState } from "react";
import axios from "axios";

import Image from "next/image";

import { getContract } from "../helper/contract";
import { useWeb3React } from "@web3-react/core";

export default function Marketplace() {
  const [nfts, setNfts] = useState<any[]>([]);
  const [loadingState, setLoadingState] = useState("not-loaded");
  const web3reactContext = useWeb3React();
  // const [nftCreation, setNftCreation] = useState(false);

  useEffect(() => {
    loadNFTs();
  }, []);

  // async function checkEvents() {
  //   /* create a generic provider and query for unsold market items */
  //   const provider = new ethers.providers.JsonRpcProvider();
  //   const contract = new ethers.Contract(
  //     marketplaceAddress,
  //     NFTMarketplace.abi,
  //     provider
  //   );
  //   contract.on("MarketItemCreated", () => {
  //     setNftCreation(true);
  //     console.log("setNftCreation(true)");
  //   });
  // }

  async function loadNFTs() {
    const contract = getContract(
      web3reactContext.library,
      web3reactContext.account
    );
    const data = await contract.fetchMarketItems();

    /*
     *  map over items returned from smart contract and format
     *  them as well as fetch their token metadata
     */
    const items = await Promise.all(
      data.map(
        async (i: {
          tokenId: { toNumber: () => any };
          price: { toString: () => ethers.BigNumberish };
          seller: any;
          owner: any;
        }) => {
          const tokenUri = await contract.tokenURI(i.tokenId);
          const meta = await axios.get(tokenUri);
          let price = ethers.utils.formatUnits(i.price.toString(), "ether");
          let item = {
            price,
            tokenId: i.tokenId.toNumber(),
            seller: i.seller,
            owner: i.owner,
            image: meta.data.nftFile,
            name: meta.data.nftName,
            description: meta.data.nftDescription,
          };
          return item;
        }
      )
    );
    setNfts(items);
    setLoadingState("loaded");
  }
  async function buyNft(nft: {
    price: { toString: () => string };
    tokenId: any;
  }) {
    const contract = getContract(
      web3reactContext.library,
      web3reactContext.account
    );
    /* user will be prompted to pay the asking proces to complete the transaction */
    const price = ethers.utils.parseUnits(nft.price.toString(), "ether");
    const transaction = await contract.createMarketSale(nft.tokenId, {
      value: price,
    });
    await transaction.wait();
    loadNFTs();
  }
  if (loadingState === "loaded" && !nfts.length)
    return <h1 className="px-20 py-10 text-3xl">No items in marketplace</h1>;
  return (
    <div className="flex justify-center">
      <div className="px-4" style={{ maxWidth: "1600px" }}>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-4">
          {nfts.map((nft, i) => (
            <div key={i} className="border shadow rounded-xl overflow-hidden">
              <Image
                className="rounded"
                src={nft.image}
                alt="NFT file"
                width={350}
                height={257}
                objectFit="cover"
                quality={100}
              />
              <div className="p-4">
                <p
                  style={{ height: "64px" }}
                  className="text-2xl font-semibold"
                >
                  {nft.name}
                </p>
                <div style={{ height: "70px", overflow: "hidden" }}>
                  <p className="text-gray-400">{nft.description}</p>
                </div>
              </div>
              <div className="p-4 bg-black">
                <div className="text-2xl font-bold text-white">
                  {nft.price}{" "}
                  <Image
                    src="/Polygon-Matic-Logo.svg"
                    alt="Polygon Matic Logo"
                    width={25}
                    height={25}
                  />
                  MATIC
                </div>
                <button
                  className="mt-4 w-full bg-pink-500 text-white font-bold py-2 px-12 rounded"
                  onClick={() => buyNft(nft)}
                >
                  Buy
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
