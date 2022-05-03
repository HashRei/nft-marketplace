import { useEffect, useState } from "react";
import Web3Modal from "web3modal";
import WalletConnectProvider from "@walletconnect/web3-provider";
import { ethers } from "ethers";
import AccountBalanceWalletIcon from "@mui/icons-material/AccountBalanceWallet";
import Image from "next/image";

let web3Modal: Web3Modal;

interface WalletProps {
  isMobile: boolean;
}

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

export function Wallet({ isMobile }: WalletProps) {
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
    <>
      {isMobile ? (
        <div className="mr-3 mt-2">
          {hasMetamask ? (
            isConnected ? (
              <button className="disabled:opacity-70  disabled:cursor-not-allowed px-10 py-3 border rounded-md text-base font-bold font-sans">
                Connected
                {/* Add the Metamask rpofil icon here */}
              </button>
            ) : (
              <button
                className="disabled:opacity-70  disabled:cursor-not-allowed py-2"
                onClick={() => connect()}
              >
                <AccountBalanceWalletIcon />
              </button>
            )
          ) : (
            <button
              className="disabled:opacity-70  disabled:cursor-not-allowed"
              onClick={() =>
                window.open("https://metamask.io/download", "_blank")
              }
            >
              <Image
                src="/MetaMask_Fox.svg"
                alt="MetaMask_Fox logo"
                width={"40px"}
                height={"40px"}
              />
            </button>
          )}
        </div>
      ) : (
        <div className="mr-3 mt-2">
          {hasMetamask ? (
            isConnected ? (
              <button className="disabled:opacity-70  disabled:cursor-not-allowed px-10 py-3 border rounded-md text-base font-bold font-sans">
                Connected
              </button>
            ) : (
              <button
                className="disabled:opacity-70  disabled:cursor-not-allowed px-10 py-3 border rounded-md text-base font-bold font-sans"
                onClick={() => connect()}
              >
                Connect your wallet
              </button>
            )
          ) : (
            <button
              className="disabled:opacity-70  disabled:cursor-not-allowed px-10 py-3 border rounded-md text-base font-bold font-sans"
              onClick={() =>
                window.open("https://metamask.io/download", "_blank")
              }
            >
              Install Metamask
            </button>
          )}
        </div>
      )}
    </>
  );
}
