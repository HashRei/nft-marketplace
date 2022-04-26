import { useWallet } from '../../hooks/useWallet'

export function Navbar() {
  const { hasWallet, isGoodChainId, connected, requestConnection, switchNetwork } = useWallet()
  return (
    <div className=" text-right">
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
  )
}
