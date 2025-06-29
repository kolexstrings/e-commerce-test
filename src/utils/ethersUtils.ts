import { ethers } from "ethers";

// Extend Window interface to include various wallet providers
declare global {
  interface Window {
    ethereum?: any;
    coinbaseWalletExtension?: any;
    trustwallet?: any;
  }
}

export const getProvider = (walletId?: string) => {
  // Check for different wallet providers
  if (walletId === "metamask" || !walletId) {
    if (typeof window.ethereum !== "undefined") {
      return new ethers.BrowserProvider(window.ethereum);
    }
  }

  if (walletId === "coinbase") {
    if (typeof window.ethereum !== "undefined") {
      // Coinbase Wallet injects into window.ethereum
      return new ethers.BrowserProvider(window.ethereum);
    }
    if (typeof window.coinbaseWalletExtension !== "undefined") {
      return new ethers.BrowserProvider(window.coinbaseWalletExtension);
    }
  }

  if (walletId === "trust") {
    if (typeof window.ethereum !== "undefined") {
      // Trust Wallet also injects into window.ethereum
      return new ethers.BrowserProvider(window.ethereum);
    }
    if (typeof window.trustwallet !== "undefined") {
      return new ethers.BrowserProvider(window.trustwallet);
    }
  }

  if (walletId === "walletconnect") {
    // For WalletConnect, you'd typically use a different approach
    // This is a placeholder - you'd need to implement WalletConnect v2
    throw new Error("WalletConnect not implemented yet");
  }

  throw new Error(
    "No wallet provider found. Please install MetaMask, Coinbase Wallet, or another supported wallet."
  );
};

export const connectWallet = async (walletId?: string) => {
  const provider = getProvider(walletId);
  await provider.send("eth_requestAccounts", []);
  const signer = await provider.getSigner();
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
