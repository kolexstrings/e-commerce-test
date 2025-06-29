import { ethers } from "ethers";

export const getProvider = () => {
  if (typeof window.ethereum !== "undefined") {
    return new ethers.providers.Web3Provider(window.ethereum);
  } else {
    throw new Error("MetaMask not installed");
  }
};

export const connectWallet = async () => {
  const provider = getProvider();
  await provider.send("eth_requestAccounts", []);
  const signer = provider.getSigner();
  const address = await signer.getAddress();
  const network = await provider.getNetwork();
  return { signer, address, network };
};

export const getContract = (
  address: string,
  abi: any,
  signer: ethers.Signer
) => {
  return new ethers.Contract(address, abi, signer);
};
