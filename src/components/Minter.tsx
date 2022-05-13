/** 
HOW TO?

* Open two terminals

* In the first one run `yarn hardhat node`

* In the second one run `yarn hardhat run scripts/deploy.js --network localhost`
  Then run `yarn dev` in the same terminal

**/

import { useState } from "react";
import { ethers } from "ethers";
import { create as ipfsHttpClient } from "ipfs-http-client";
import { useRouter } from "next/router";
import Web3Modal from "web3modal";
import { useForm } from "react-hook-form";
import Image from "next/image";

const client = ipfsHttpClient("https://ipfs.infura.io:5001"); // This works check https://www.npmjs.com/package/ipfs-http-client

import { marketplaceAddress } from "../../config";

import NFTMarketplace from "../../artifacts/contracts/NFTMarketplace.sol/NFTMarketplace.json";

interface Inputs {
  nftName: string;
  nftDescription: string;
  nftPrice: number;
  nftFile: File;
}

export default function Minter() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Inputs>({});

  const onSubmit = ({ nftName, nftDescription, nftPrice, nftFile }: Inputs) => {
    listNFTForSale({ nftName, nftDescription, nftPrice, nftFile });
  };

  const [fileUrl, setFileUrl] = useState("");
  const router = useRouter();

  // Function for creating and updating the file url
  async function onChange(e: any) {
    // e is an event
    const file = e.target.files[0];
    try {
      const added = await client.add(file, {
        progress: (prog) => console.log(`received: ${prog}`),
      });
      const url = `https://ipfs.infura.io/ipfs/${added.path}`;
      setFileUrl(url);
    } catch (error) {
      console.log("Error uploading file: ", error);
    }
  }

  // Function saving an item to IPFS
  async function uploadToIPFS({
    nftName,
    nftDescription,
    nftPrice,
    nftFile,
  }: Inputs) {
    if (!nftName || !nftDescription || !nftPrice || !nftFile) return;
    // First, upload to IPFS
    const data = JSON.stringify({
      nftName,
      nftDescription,
      nftFile: fileUrl,
    });
    try {
      const added = await client.add(data);
      const url = `https://ipfs.infura.io/ipfs/${added.path}`;
      // After file is uploaded to IPFS, return the URL to use it in the transaction
      return url;
    } catch (error) {
      console.log("Error uploading file: ", error);
    }
  }

  // Function creating and listing an item for sale
  async function listNFTForSale({
    nftName,
    nftDescription,
    nftPrice,
    nftFile,
  }: Inputs) {
    const url = await uploadToIPFS({
      nftName,
      nftDescription,
      nftPrice,
      nftFile,
    });
    const web3Modal = new Web3Modal();
    const connection = await web3Modal.connect();
    const provider = new ethers.providers.Web3Provider(connection);
    const signer = provider.getSigner();

    // create the item
    const price = ethers.utils.parseUnits(String(nftPrice), "ether");
    let contract = new ethers.Contract(
      marketplaceAddress, // TODO update marketplaceAddress depending on the network
      NFTMarketplace.abi,
      signer
    );

    let listingPrice = await contract.getListingPrice();
    listingPrice = listingPrice.toString();
    let transaction = await contract.createToken(url, price, {
      value: listingPrice,
    });
    await transaction.wait();

    router.push("/MarketplacePage"); // reroute the user to the marketplace page
  }

  return (
    <div className="flex justify-center items-center h-screen">
      <form
        className="mt-16 flex flex-col space-y-3 tablet:w-1/2 p-4 desktop:-mt-10 bg-slate-300 rounded-lg bg-gradient-to-tr from-violet-500 to-fuchsia-500 "
        onSubmit={handleSubmit(onSubmit)}
      >
        <input
          type="text"
          placeholder="NFT name"
          className="p-5 rounded"
          {...register("nftName", {
            required: true,
            maxLength: 20,
          })}
        />
        {errors?.nftName?.type === "required" && <p>This field is required</p>}
        {errors?.nftName?.type === "maxLength" && (
          <p>Name cannot exceed 20 characters</p>
        )}

        <input
          type="text"
          placeholder="NFT Description"
          className="p-5 rounded"
          {...register("nftDescription", { maxLength: 200 })}
        />
        {errors?.nftDescription?.type === "maxLength" && (
          <p>Description cannot exceed 200 characters</p>
        )}

        <input
          type="number"
          placeholder="0.000"
          className="p-5 rounded"
          {...register("nftPrice", { required: true, min: 1 })}
        />
        {errors.nftPrice && <p>Price must be at least 1</p>}

        <input
          type="file"
          {...register("nftFile", { required: true })}
          onChange={onChange}
          accept="image/*" //TODO Only accept images for now
          // accept="image/*,video/*,audio/*,.glb,.gltf"
        />
        {errors?.nftFile?.type === "required" && (
          <p>Adding a file is required</p>
        )}
        {fileUrl && (
          <div className="rounded-lg mx-auto">
            <Image
              className="rounded"
              src={fileUrl}
              alt="NFT file"
              width={350}
              height={257}
              objectFit="cover"
              quality={100}
            />
          </div>
        )}
        <button
          type="submit"
          className="items-center py-2 px-6 mx-0 mt-2 mb-0 font-semibold text-center normal-case whitespace-nowrap bg-none rounded-full border-2 border-solid cursor-pointer box-border border-stone-500 bg-zinc-800 text-stone-200 hover:border-neutral-600"
        >
          Mint an NFT
        </button>
      </form>
    </div>
  );
}
