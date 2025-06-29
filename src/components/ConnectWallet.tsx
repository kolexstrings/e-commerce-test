"use client";

import { useState, useEffect } from "react";
import { connectWallet } from "../utils/ethersUtils";

interface WalletOption {
  id: string;
  name: string;
  icon: string;
  description: string;
}

const walletOptions: WalletOption[] = [
  {
    id: "metamask",
    name: "MetaMask",
    icon: "🦊",
    description: "Connect using MetaMask wallet",
  },
  {
    id: "coinbase",
    name: "Coinbase Wallet",
    icon: "🪙",
    description: "Connect using Coinbase Wallet",
  },
  {
    id: "walletconnect",
    name: "WalletConnect",
    icon: "🔗",
    description: "Connect using WalletConnect",
  },
  {
    id: "trust",
    name: "Trust Wallet",
    icon: "🛡️",
    description: "Connect using Trust Wallet",
  },
];

const ConnectWallet = () => {
  const [account, setAccount] = useState<string | null>(null);
  const [network, setNetwork] = useState<string>("");
  const [isConnecting, setIsConnecting] = useState(false);
  const [showWalletModal, setShowWalletModal] = useState(false);
  const [availableWallets, setAvailableWallets] = useState<WalletOption[]>([]);

  // Detect available wallets
  useEffect(() => {
    const detectWallets = () => {
      const available: WalletOption[] = [];

      // Check for MetaMask
      if (typeof window.ethereum !== "undefined") {
        available.push(walletOptions.find((w) => w.id === "metamask")!);
      }

      // Check for Coinbase Wallet
      if (
        typeof window.ethereum !== "undefined" ||
        typeof window.coinbaseWalletExtension !== "undefined"
      ) {
        available.push(walletOptions.find((w) => w.id === "coinbase")!);
      }

      // Check for Trust Wallet
      if (
        typeof window.ethereum !== "undefined" ||
        typeof window.trustwallet !== "undefined"
      ) {
        available.push(walletOptions.find((w) => w.id === "trust")!);
      }

      // WalletConnect is always available as it's a protocol
      available.push(walletOptions.find((w) => w.id === "walletconnect")!);

      setAvailableWallets(available);
    };

    detectWallets();
  }, []);

  const handleWalletSelect = async (walletId: string) => {
    setIsConnecting(true);
    setShowWalletModal(false);

    try {
      const { address, network } = await connectWallet(walletId);
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

  const handleConnect = () => {
    setShowWalletModal(true);
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

      {/* Wallet Selection Modal */}
      {showWalletModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Choose Your Wallet</h2>
              <button
                onClick={() => setShowWalletModal(false)}
                className="text-gray-500 hover:text-gray-700 text-2xl"
              >
                ×
              </button>
            </div>

            <div className="space-y-3">
              {availableWallets.map((wallet) => (
                <button
                  key={wallet.id}
                  onClick={() => handleWalletSelect(wallet.id)}
                  className="w-full p-4 border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-colors text-left"
                >
                  <div className="flex items-center space-x-3">
                    <span className="text-2xl">{wallet.icon}</span>
                    <div>
                      <div className="font-semibold">{wallet.name}</div>
                      <div className="text-sm text-gray-600">
                        {wallet.description}
                      </div>
                    </div>
                  </div>
                </button>
              ))}
            </div>

            {availableWallets.length === 0 && (
              <div className="text-center py-4 text-gray-600">
                <p>No wallets detected. Please install a wallet extension.</p>
                <div className="mt-2 space-y-1 text-sm">
                  <p>
                    •{" "}
                    <a
                      href="https://metamask.io"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline"
                    >
                      Install MetaMask
                    </a>
                  </p>
                  <p>
                    •{" "}
                    <a
                      href="https://wallet.coinbase.com"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline"
                    >
                      Install Coinbase Wallet
                    </a>
                  </p>
                </div>
              </div>
            )}

            <div className="mt-4 text-center">
              <button
                onClick={() => setShowWalletModal(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ConnectWallet;
