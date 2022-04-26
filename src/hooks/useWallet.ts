import { useCallback, useEffect, useState } from 'react'
import { ChainId } from '../blockchain/const'
import { web3 } from '../blockchain/web3'
import { useInterval } from './useInterval'
import { NETWORK_ID } from '../components/constants'

const window_: any = typeof window !== 'undefined' ? window : undefined

function hasWallet() {
  if (window_ == undefined) return false
  return window_.web3 || window_.ethereum
}

function getAccounts(): Promise<string[]> {
  return window_.ethereum.request({ method: 'eth_accounts' })
}

function requestAccounts(): Promise<string[]> {
  return window_.ethereum.request({ method: 'eth_requestAccounts' })
}

async function getChainId(): Promise<ChainId | null> {
  const chainId_ = await window_.ethereum.request({ method: 'eth_chainId' })

  if (chainId_) {
    // Hex to base 10
    return parseInt(chainId_)
  } else {
    return null
  }
}



async function getBalance(address: string): Promise<number> {
  try {
    // const balance_ = await window_.ethereum.request({ method: 'eth_getBalance', params: [address] })
    const balance_ = await web3.eth.getBalance(address)

    if (balance_) {
      return parseFloat(web3.utils.fromWei(balance_))
    }
  } catch (error) {
    console.error('An error occurred when getting the user balance:', error)
  }

  return 0
}

function getGasPrice(): Promise<string> {
  return window_.ethereum.request({ method: 'eth_gasPrice', params: [] })
}

export interface Wallet {
  hasWallet: boolean
  connected: boolean
  chainId: ChainId | null
  isGoodChainId: boolean
  accounts: string[]
  balance: number | null
  gasPrice: string
  requestConnection: () => void
  switchNetwork: () => void
}

export function useWallet(): Wallet {
  const [chainId, setChainId] = useState<ChainId | null>(null)
  const [isGoodChainId, setIsGoodChainId] = useState(false)
  const [accounts, setAccounts] = useState<string[]>([])
  const [connected, setConnected] = useState<boolean>(false)
  const [balance, setBalance] = useState<number>(0)
  const [gasPrice, setGasPrice] = useState<string>('')

  const connectAccount = useCallback(
    (accounts: string[], balance: number, gasPrice: string, chainId: ChainId | null) => {
      if (accounts.length > 0 && chainId) {
        setAccounts(accounts)
        setChainId(chainId)
        setIsGoodChainId(chainId !== null && chainId == NETWORK_ID)
        setConnected(true)
        setBalance(balance)
        setGasPrice(gasPrice)
      }else setIsGoodChainId(false)
    },
    []
  )

  useEffect(() => {
    if (window_.ethereum) {
      window_.ethereum.on('accountsChanged', (accounts: string[]) => {
        connectAccount(accounts, balance, gasPrice, chainId)
      })
    }
  }, [balance, chainId, gasPrice, connectAccount])

  useInterval({
    callback: async () => {
      if (window_.ethereum) {
        // If the chain changed
        const currentChainId = await getChainId()
        if (currentChainId !== chainId) {
          connectAccount(await getAccounts(), balance, gasPrice, currentChainId)
        }

        // If the balance changed
        if (connected) {
          const currentBalance = await getBalance(accounts[0])
          if (currentBalance !== balance) {
            setBalance(currentBalance)
          }
        }

        // If the gas price changed
        const currentGasPrice = await getGasPrice()
        if (currentGasPrice !== gasPrice) {
          setGasPrice(gasPrice)
        }

        // If the user disconnected
        if (connected && hasWallet() && (await getAccounts()).length === 0) {
          setConnected(false)
          setAccounts([])
        }
      }
    },
    delay: 500,
    leading: true
  })

  async function requestConnection() {
    if (!connected) {
      const [accounts, gasPrice, chainId] = await Promise.all([requestAccounts(), getGasPrice(), getChainId()])
      const balance = accounts ? await getBalance(accounts[0]) : 0
      connectAccount(accounts, balance, gasPrice, chainId)
    }
  }

  async function switchNetwork ()  {
    await window_.ethereum.request({
      method: 'wallet_switchEthereumChain',
      params: [{ chainId: `0x${NETWORK_ID.toString(16)}` }]
    })
  }

  return {
    hasWallet: hasWallet(),
    connected,
    chainId,
    isGoodChainId,
    accounts,
    balance,
    gasPrice,
    requestConnection,
    switchNetwork
  }
}
