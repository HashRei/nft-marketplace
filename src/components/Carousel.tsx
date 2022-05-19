// export default function Carousel()
import Image from "next/image";
// import Swiper core and required modules
import { Navigation, Pagination, Scrollbar, A11y, Mousewheel } from "swiper";

import { Swiper, SwiperSlide } from "swiper/react";

// Import Swiper styles
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/scrollbar";
import { useEffect, useState } from "react";
import { ethers } from "ethers";
import axios from "axios";
import { getContract } from "../helper/contract";
import { useWeb3React } from "@web3-react/core";

export default function Carousel() {
  useEffect(() => {
    loadNFTs();
  }, []);

  const [nfts, setNfts] = useState<any[]>([]);
  const web3reactContext = useWeb3React();

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
  }

  return (
    <div className="flex items-center h-screen w-screen">
      <Swiper
        // install Swiper modules
        modules={[Navigation, Pagination, Mousewheel]}
        slidesPerView={1}
        mousewheel
        // navigation // add left and right arrows
        pagination={{ clickable: true }}
      >
        {nfts.map((nft, i) => (
          <div key={i} className="border rounded-xl">
            <SwiperSlide>
              <Image
                className="rounded"
                src={nft.image}
                alt="NFT file"
                width={350}
                height={257}
                objectFit="cover"
                quality={100}
              />
              <div className="p-8">
                <p
                  style={{ height: "64px" }}
                  className="text-2xl font-semibold"
                >
                  {nft.name}
                </p>
                <div style={{ height: "70px", overflow: "hidden" }}>
                  <p className="text-gray-400">{nft.description}</p>
                </div>
                <div className="text-2xl font-bold ">
                  {nft.price}{" "}
                  <Image
                    src="/Polygon-Matic-Logo.svg"
                    alt="Polygon Matic Logo"
                    width={25}
                    height={25}
                  />
                  MATIC
                </div>
              </div>
            </SwiperSlide>
          </div>
        ))}
      </Swiper>
    </div>
  );
}
