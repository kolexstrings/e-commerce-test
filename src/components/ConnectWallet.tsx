"use client";

import { useState } from "react";
import { connectWallet } from "../utils/ethersUtils";

const ConnectWallet = () => {
  const [account, setAccount] = useState<string | null>(null);
  const [network, setNetwork] = useState<string>("");
  const [isConnecting, setIsConnecting] = useState(false);

  const handleConnect = async () => {
    setIsConnecting(true);
    try {
      const { address, network } = await connectWallet();
      setAccount(address);
      setNetwork(network.name || `Chain ID: ${network.chainId}`);
    } catch (error) {
      console.error("Connection error:", error);
      alert(
        error instanceof Error ? error.message : "Failed to connect wallet"
      );
    } finally {
      setIsConnecting(false);
    }
  };

  return (
    <div>
      <button
        onClick={handleConnect}
        disabled={isConnecting}
        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isConnecting ? "Connecting..." : "Connect Wallet"}
      </button>
      {account && (
        <div className="mt-2">
          <p>Connected: {account}</p>
          <p>Network: {network}</p>
        </div>
      )}
    </div>
  );
};

export default ConnectWallet;
