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

export function Wallet() {
  const [isConnected, setIsConnected] = useState(false);
  const [hasMetamask, setHasMetamask] = useState(false);
  // const [signer, setSigner] = useState(undefined);

  useEffect(() => {
    if (typeof window.ethereum !== "undefined") {
      setHasMetamask(true);
    }
  }, []);

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
    <div className="mr-3">
      {hasMetamask ? (
        isConnected ? (
          <button className="disabled:opacity-70  disabled:cursor-not-allowed px-10 py-3 border rounded-md text-base font-bold font-sans mt-2">
            Connected
          </button>
        ) : (
          <button
            className="disabled:opacity-70  disabled:cursor-not-allowed px-10 py-3 border rounded-md text-base font-bold font-sans mt-2"
            onClick={() => connect()}
          >
            Connect your wallet
          </button>
        )
      ) : (
        <button
          className="disabled:opacity-70  disabled:cursor-not-allowed px-10 py-3 border rounded-md text-base font-bold font-sans mt-2"
          onClick={() => window.open("https://metamask.io/download", "_blank")}
        >
          Install Metamask
        </button>
      )}
    </div>
  );
}
