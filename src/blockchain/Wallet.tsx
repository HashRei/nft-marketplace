import { useEffect, useState } from "react";
import { IoMdWallet } from "react-icons/io";
import LogoutIcon from "@mui/icons-material/Logout";
import Image from "next/image";
import { injected } from "../helper/connectors";
import { useWeb3React } from "@web3-react/core";

interface WalletProps {
  isMobile: boolean;
}

export function Wallet({ isMobile }: WalletProps) {
  const [hasMetamask, setHasMetamask] = useState(false);
  const { active, activate, deactivate, account } = useWeb3React();

  useEffect(() => {
    if (typeof window.ethereum !== "undefined") {
      setHasMetamask(true);
    }
    if (
      active === false &&
      localStorage.getItem("isWalletconnected") === "true"
    ) {
      activate(injected);
    }
  }, []);

  async function connect() {
    if (typeof window.ethereum !== "undefined") {
      try {
        await activate(injected);
        localStorage.setItem("isWalletconnected", "true");
      } catch (e) {
        console.log(e);
      }
    }
  }

  async function disconnect() {
    if (typeof window.ethereum !== "undefined") {
      try {
        await deactivate();
        localStorage.setItem("isWalletconnected", "false");
      } catch (e) {
        console.log(e);
      }
    }
  }

  return (
    <div>
      {isMobile ? (
        <div>
          {hasMetamask ? (
            active ? (
              <div>
                <button className="disabled:opacity-70  disabled:cursor-not-allowed mr-5 px-5 py-2 border-2 rounded-md text-base font-bold font-sans">
                  <p>
                    {account?.slice(0, 7)}...{account?.slice(-3)}
                  </p>
                  {/* Add the Metamask profil icon here */}
                </button>
                <button
                  className="p-2 rounded-full border-2"
                  onClick={disconnect}
                >
                  <LogoutIcon />
                </button>
              </div>
            ) : (
              <button
                className="disabled:opacity-70  disabled:cursor-not-allowed"
                onClick={connect}
              >
                <IoMdWallet size="34" />
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
            active ? (
              <div>
                <button className="disabled:opacity-70  disabled:cursor-not-allowed mr-5 px-5 py-2 border-2 rounded-md text-base font-bold font-sans">
                  <p>
                    {account?.slice(0, 7)}...{account?.slice(-3)}
                  </p>
                </button>
                <button
                  className="p-2 rounded-full border-2"
                  onClick={disconnect}
                >
                  <LogoutIcon />
                </button>
              </div>
            ) : (
              <button
                className="disabled:opacity-70  disabled:cursor-not-allowed px-10 py-3 border rounded-md text-base font-bold font-sans"
                onClick={connect}
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
    </div>
  );
}
