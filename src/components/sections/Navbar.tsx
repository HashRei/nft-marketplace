import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import Web3Modal from "web3modal";
import WalletConnectProvider from "@walletconnect/web3-provider";
import { ethers } from "ethers";

import * as React from "react";
import Paper from "@mui/material/Paper";
import InputBase from "@mui/material/InputBase";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import SearchIcon from "@mui/icons-material/Search";

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
    <div className="fixed top-0 left-0 box-border flex h-16 w-full max-w-full items-center justify-between break-words border-0 border-solid border-white leading-6 text-slate-100 md:h-20">
      <div className="flex p-2 space-x-3">
        {/* The Image below generates "Warning: Prop `style` did not match" an erro in the console */}
        <Image
          src="/Logo_LooksSea.png"
          alt="LooksSea logo"
          width={"40px"}
          height={"40px"}
        />
        <p className="font-bold text-4xl">LooksSea</p>
      </div>
      <Paper
        component="form"
        sx={{ p: "2px 4px", display: "flex", alignItems: "center", width: 400 }}
      >
        <IconButton type="submit" sx={{ p: "10px" }} aria-label="search">
          <SearchIcon />
        </IconButton>
        <Divider sx={{ height: 28, m: 0.5 }} orientation="vertical" />
        <InputBase
          sx={{ ml: 1, flex: 1 }}
          placeholder="Search LooksSea"
          inputProps={{ "aria-label": "search looksSea" }}
        />
      </Paper>
      <Link href="/">My collection</Link>
      <Link href="/">Mint and sell</Link>

      {/* MY WALLET */}

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
              Connect Metamask
            </button>
          )
        ) : (
          <button
            className="disabled:opacity-70  disabled:cursor-not-allowed px-10 py-3 border rounded-md text-base font-bold font-sans mt-2"
            onClick={() =>
              window.open("https://metamask.io/download", "_blank")
            }
          >
            Install Metamask
          </button>
        )}

        {isConnected ? <button>Execute</button> : ""}
      </div>
    </div>
  );
}
