import { ethers } from "ethers";
import { useEffect, useState } from "react";
import axios from "axios";

import Image from "next/image";

import { getContract } from "../helper/contract";
import { useWeb3React } from "@web3-react/core";
import { motion } from "framer-motion";
import Link from "next/link";

export default function Marketplace() {
  const [nfts, setNfts] = useState<any[]>([]);
  const [loadingState, setLoadingState] = useState("not-loaded");
  const web3reactContext = useWeb3React();

  useEffect(() => {
    loadNFTs();
  }, []);

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
    return (
      <h1
        className="py-10 px-20 text-3xl flex justify-center items-center"
        style={{ height: "90vh" }}
      >
        No items in marketplace
      </h1>
    );
  return loadingState === "not-loaded" ? (
    <div
      className="flex flex-col justify-center items-center space-y-3"
      style={{ height: "90vh" }}
    >
      <button
        disabled
        type="button"
        className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center mr-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800 inline-flex items-center"
      >
        <svg
          role="status"
          className="inline w-4 h-4 mr-3 text-white animate-spin"
          viewBox="0 0 100 101"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
            fill="#E5E7EB"
          />
          <path
            d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
            fill="currentColor"
          />
        </svg>
        Loading...
      </button>
      <p>
      Sorry😞, but the marketplace is currently not visible due to a problem with the Infura node.
      </p>
      <p>
        To see the Marketplace at work head to{" "}
        <Link href="https://www.youtube.com/watch?v=_QfKX-NoHhE">
          <a className=" underline text-blue-600 font-semibold">YouTube, I have a video there that shows it</a>
        </Link>
      </p>
    </div>
  ) : (
    <motion.div
      variants={{
        hidden: { opacity: 0, x: 200, y: 0 },
        enter: { opacity: 1, x: 0, y: 0 },
        exit: { opacity: 0, x: 0, y: -100 },
      }} // Pass the variant object into Framer Motion
      initial="hidden" // Set the initial state to variants.hidden
      animate="enter" // Animated state to variants.enter
      exit="exit" // Exit state (used later) to variants.exit
      transition={{ type: "linear", duration: 1 }} // Set the transition to linear
    >
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
    </motion.div>
  );
}
