import { NFTMarketplace__factory } from "../../typechain-types";
import { marketplaceAddress } from "../../const";
import { ethers } from "ethers";

export const getContract = (library: { getSigner: (arg0: any) => { (): any; new(): any; connectUnchecked: { (): any; new(): any; }; }; }, account: any) => {
	let signer
	if(library == undefined){
		 signer = new ethers.providers.JsonRpcProvider(
		"https://polygon-mumbai.infura.io/v3/a0cad0782a1f452dbc631e10854244ea"
	  )}
	  else{
		 signer = library.getSigner(account).connectUnchecked();
	  }
	
	let contract = new ethers.Contract(marketplaceAddress, NFTMarketplace__factory.abi, signer);
	return contract;
};