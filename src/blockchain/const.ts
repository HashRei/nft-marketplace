export enum ChainId {
    MAINNET = 137, // Polygon mainnet
    TESTNET = 80001 // Mumbai testsnet
  }
  
  export const PROVIDER: { [chainId in ChainId]: string } = {
    [ChainId.MAINNET]: 'https://polygon-mainnet.infura.io/v3/a0cad0782a1f452dbc631e10854244ea',
    [ChainId.TESTNET]: 'https://polygon-mumbai.infura.io/v3/a0cad0782a1f452dbc631e10854244ea'
  }
  