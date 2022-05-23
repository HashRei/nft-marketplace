import { InjectedConnector } from '@web3-react/injected-connector';
import { WalletConnectConnector } from '@web3-react/walletconnect-connector';

const INFURA_ID = process.env.INFURA_ID

const RPC_URLS = {
	137: `https://polygon-mainnet.infura.io/v3/${INFURA_ID}`,
	80001: `https://polygon-mumbai.infura.io/v3/${INFURA_ID}`
};

//metamask
export const injected = new InjectedConnector({
	supportedChainIds: [ 137, 80001]
});

// walletconnect
export const walletconnect = new WalletConnectConnector({
	rpc: {
		137: RPC_URLS[137],
		80001: RPC_URLS[80001]
	},
	qrcode: true,
});


export function resetWalletConnector(connector: { walletConnectProvider: undefined; }) {
	if (connector && connector instanceof WalletConnectConnector) {
		connector.walletConnectProvider = undefined;
	}
}