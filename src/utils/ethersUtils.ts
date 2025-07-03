import { ethers } from "ethers";

// Extend Window interface to include ethereum
declare global {
  interface Window {
    ethereum?: {
      request: (args: {
        method: string;
        params?: unknown[];
      }) => Promise<unknown>;
      on: (event: string, callback: (...args: unknown[]) => void) => void;
      removeListener: (
        event: string,
        callback: (...args: unknown[]) => void
      ) => void;
    };
  }
}

export const getProvider = () => {
  if (typeof window.ethereum !== "undefined") {
    return new ethers.BrowserProvider(window.ethereum);
  } else {
    throw new Error(
      "MetaMask not installed. Please install MetaMask extension."
    );
  }
};

export const connectWallet = async () => {
  const provider = getProvider();
  await provider.send("eth_requestAccounts", []); //wallet permission to connect
  const signer = await provider.getSigner();
  const address = await signer.getAddress();
  const network = await provider.getNetwork();
  return { signer, address, network };
};

export const getContract = (
  address: string,
  abi: ethers.InterfaceAbi,
  signer: ethers.Signer
) => {
  return new ethers.Contract(address, abi, signer);
};
