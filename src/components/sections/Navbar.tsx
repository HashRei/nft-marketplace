import Image from "next/image";
import Link from "next/link";
import { useWallet } from "../../hooks/useWallet";

export function Navbar() {
  const { hasWallet, isGoodChainId, connected, requestConnection, switchNetwork } = useWallet()
  return (
    <div className="fixed top-0 left-0 box-border flex h-16 w-full max-w-full items-center justify-between break-words border-0 border-solid border-white leading-6 text-slate-100 md:h-20">
      <div className="flex p-2 space-x-3">
        <Image
          src="/Logo_LooksSea.png"
          alt="LooksSea logo"
          width={"40px"}
          height={"40px"}
        />
        <p className="font-bold text-4xl">LooksSea</p>
      </div>
      <div
        className="flex-grow leading-6 break-words border-0 border-solid box-border border-neutral-200 text-slate-300"
        style={{ marginInline: "16px" }}
      >
        <button
          type="button"
          className="inline-flex overflow-visible relative justify-center items-center p-0 m-0 w-full h-12 text-sm font-semibold text-center normal-case align-middle whitespace-nowrap rounded-3xl border border-white border-solid duration-200 appearance-none cursor-pointer select-none box-border bg-zinc-800 text-stone-200 outline-offset-2 outline-transparent"
          data-id="button"
          id="desktop-search-button-search"
        >
          <div className="flex items-start w-full leading-4 break-words border-0 border-solid box-border border-neutral-200">
            <svg
              viewBox="0 0 24 24"
              focusable="false"
              className="inline-block flex-shrink-0 mr-0 w-6 h-6 align-middle border-0 border-solid box-border border-neutral-200 text-stone-400 md:mr-3"
              data-id="icon"
            >
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M18.75 10.5C18.7508 12.4206 18.0735 14.2799 16.8375 15.75L22.5 21.4425L21.4425 22.5L15.75 16.8375C14.2799 18.0735 12.4206 18.7508 10.5 18.75C5.94365 18.75 2.25 15.0563 2.25 10.5C2.25 5.94365 5.94365 2.25 10.5 2.25C15.0563 2.25 18.75 5.94365 18.75 10.5ZM3.75 10.5C3.75 14.2279 6.77208 17.25 10.5 17.25C14.2279 17.25 17.25 14.2279 17.25 10.5C17.25 6.77208 14.2279 3.75 10.5 3.75C6.77208 3.75 3.75 6.77208 3.75 10.5Z"
                fill="currentColor"
                className="leading-3 border-0 border-solid box-border border-neutral-200"
              ></path>
            </svg>
            <div className="hidden text-base font-normal whitespace-nowrap border-0 border-solid box-border border-neutral-200 text-stone-400 md:block">
              Search
            </div>
          </div>
        </button>
      </div>{" "}
      <a>
        <Link href="/">My collection</Link>
      </a>
      <a>
        <Link href="/">Mint and sell</Link>
      </a>
      {/* MY WALLET */}
      {hasWallet && connected && !isGoodChainId && (
        <button
          className=" px-10 py-3 border rounded-full text-base font-bold font-sans mt-2"
          onClick={() => switchNetwork()}
        >
          Wrong Network
        </button>
      )}
      {hasWallet ? (
        connected ? (
          <button className="disabled:opacity-70  disabled:cursor-not-allowed px-10 py-3 border rounded-md text-base font-bold font-sans mt-2">
            Connected
          </button>
        ) : (
          <button
            className="disabled:opacity-70  disabled:cursor-not-allowed px-10 py-3 border rounded-md text-base font-bold font-sans mt-2"
            onClick={() => requestConnection()}
          >
            Connect Metamask
          </button>
        )
      ) : (
        <button
          className="disabled:opacity-70  disabled:cursor-not-allowed px-10 py-3 border rounded-md text-base font-bold font-sans mt-2"
          onClick={() => window.open('https://metamask.io/download', '_blank')}
        >
          Install Metamask
        </button>
      )}
    </div>
    
  );
}
