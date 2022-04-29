import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import Web3Modal from "web3modal";
import WalletConnectProvider from "@walletconnect/web3-provider";
import { ethers } from "ethers";

let web3Modal: Web3Modal;

const providerOptions = {
  walletconnect: {
    package: WalletConnectProvider, // required
    options: {
      rpc: { 137: process.env.NEXT_PUBLIC_RPC_URL }, // required
    },
  },
};

if (typeof window !== "undefined") {
  web3Modal = new Web3Modal({
    cacheProvider: false,
    providerOptions, // required
  });
}

export function Navbar() {
  const [isConnected, setIsConnected] = useState(false);
  const [hasMetamask, setHasMetamask] = useState(false);
  // const [signer, setSigner] = useState(undefined);

  useEffect(() => {
    if (typeof window.ethereum !== "undefined") {
      setHasMetamask(true);
    }
  });

  async function connect() {
    if (typeof window.ethereum !== "undefined") {
      try {
        const web3ModalProvider = await web3Modal.connect();
        setIsConnected(true);
        const provider = new ethers.providers.Web3Provider(web3ModalProvider);
        // setSigner(provider.getSigner());
      } catch (e) {
        console.log(e);
      }
    } else {
      setIsConnected(false);
    }
  }

  return (
    <div className="fixed top-0 left-0 box-border flex h-16 w-full max-w-full items-center justify-between break-words border-0 border-solid border-white leading-6 text-slate-100 md:h-20">
      <div className="flex p-2 space-x-3">
        {/* The Image below generates "Warning: Prop `style` did not match" an erro in the console */}
        {/* <Image
          src="/Logo_LooksSea.png"
          alt="LooksSea logo"
          width={"40px"}
          height={"40px"}
        /> */}
        <p className="font-bold text-4xl">LooksSea</p>
      </div>
      <Link href="/">My collection</Link>
      <Link href="/">Mint and sell</Link>

      {/* MY WALLET */}

      <div>
        {hasMetamask ? (
          isConnected ? (
            "Connected! "
          ) : (
            <button onClick={() => connect()}>Connect</button>
          )
        ) : (
          "Please install metamask"
        )}

        {isConnected ? <button>Execute</button> : ""}
      </div>
    </div>
  );
}
