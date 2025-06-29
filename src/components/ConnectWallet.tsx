"use client";

import { useState, useEffect } from "react";
import { connectWallet, getProvider } from "../utils/ethersUtils";
import ThemeToggle from "./ThemeToggle";
import TransactionDemo from "./TransactionDemo";

const ConnectWallet = () => {
  const [account, setAccount] = useState<string | null>(null);
  const [network, setNetwork] = useState<string>("");
  const [isConnecting, setIsConnecting] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);

  // Theme management
  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    const systemPrefersDark = window.matchMedia(
      "(prefers-color-scheme: dark)"
    ).matches;

    if (savedTheme === "dark" || (!savedTheme && systemPrefersDark)) {
      setIsDarkMode(true);
      document.documentElement.classList.add("dark");
    } else {
      setIsDarkMode(false);
      document.documentElement.classList.remove("dark");
    }
  }, []);

  // Wallet state syncing and network change detection
  useEffect(() => {
    const handleAccountsChanged = async (accounts: string[]) => {
      if (accounts.length === 0) {
        // User disconnected their wallet
        setAccount(null);
        setNetwork("");
      } else if (account !== accounts[0]) {
        // Account changed
        setAccount(accounts[0]);
        await updateNetworkInfo();
      }
    };

    const handleChainChanged = async () => {
      // Network/chain changed - refresh network info
      await updateNetworkInfo();
    };

    const handleNetworkChanged = async () => {
      // Network changed - refresh network info
      await updateNetworkInfo();
    };

    const updateNetworkInfo = async () => {
      try {
        const provider = getProvider();
        const network = await provider.getNetwork();
        setNetwork(network.name || `Chain ID: ${network.chainId}`);
      } catch (error) {
        console.error("Failed to update network info:", error);
        setNetwork("Unknown Network");
      }
    };

    // Set up event listeners for wallet state changes
    if (typeof window.ethereum !== "undefined") {
      window.ethereum.on("accountsChanged", handleAccountsChanged);
      window.ethereum.on("chainChanged", handleChainChanged);
      window.ethereum.on("networkChanged", handleNetworkChanged);

      // Check if wallet is already connected on page load
      const checkInitialConnection = async () => {
        try {
          const accounts = await window.ethereum.request({
            method: "eth_accounts",
          });
          if (accounts.length > 0) {
            setAccount(accounts[0]);
            await updateNetworkInfo();
          }
        } catch (error) {
          console.error("Failed to check initial connection:", error);
        }
      };

      checkInitialConnection();

      // Cleanup event listeners
      return () => {
        window.ethereum.removeListener(
          "accountsChanged",
          handleAccountsChanged
        );
        window.ethereum.removeListener("chainChanged", handleChainChanged);
        window.ethereum.removeListener("networkChanged", handleNetworkChanged);
      };
    }
  }, [account]);

  const toggleTheme = () => {
    const newTheme = !isDarkMode;
    setIsDarkMode(newTheme);

    if (newTheme) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  };

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

  const formatAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  return (
    <div
      className={`min-h-screen flex items-center justify-center p-4 relative ${
        isDarkMode
          ? "bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900"
          : "bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100"
      }`}
    >
      <ThemeToggle isDarkMode={isDarkMode} onToggle={toggleTheme} />

      <div className="w-full max-w-md">
        {/* Page Heading */}
        <div className="text-center mb-8">
          <h1
            className={`text-3xl font-bold bg-clip-text text-transparent mb-2 ${
              isDarkMode
                ? "bg-gradient-to-r from-white to-slate-300"
                : "bg-gradient-to-r from-slate-900 to-slate-600"
            }`}
          >
            Blockchain Ecommerce Test
          </h1>
          <p
            className={`text-lg ${
              isDarkMode ? "text-slate-400" : "text-slate-600"
            }`}
          >
            Connect your wallet to start shopping
          </p>
        </div>

        {/* Main Card */}
        <div
          className={`backdrop-blur-xl rounded-2xl shadow-2xl border p-8 animate-fade-in ${
            isDarkMode
              ? "bg-slate-800/80 border-slate-700/50"
              : "bg-white/80 border-white/20"
          }`}
        >
          {/* Header */}
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
              <svg
                className="w-8 h-8 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                />
              </svg>
            </div>
            <h2
              className={`text-2xl font-bold mb-2 ${
                isDarkMode ? "text-white" : "text-slate-900"
              }`}
            >
              Web3 Wallet
            </h2>
            <p className={isDarkMode ? "text-slate-400" : "text-slate-600"}>
              Connect your wallet to get started
            </p>
          </div>

          {/* Connection Status */}
          {!account ? (
            <div className="space-y-6">
              {/* Connect Button */}
              <button
                onClick={handleConnect}
                disabled={isConnecting}
                className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 disabled:from-blue-400 disabled:to-indigo-400 text-white font-semibold py-4 px-6 rounded-xl transition-all duration-200 transform hover:scale-[1.02] disabled:scale-100 disabled:cursor-not-allowed shadow-lg hover:shadow-xl"
              >
                {isConnecting ? (
                  <div className="flex items-center justify-center space-x-2">
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    <span>Connecting...</span>
                  </div>
                ) : (
                  <div className="flex items-center justify-center space-x-2">
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M13 10V3L4 14h7v7l9-11h-7z"
                      />
                    </svg>
                    <span>Connect MetaMask</span>
                  </div>
                )}
              </button>

              {/* Info Card */}
              <div
                className={`border rounded-xl p-4 ${
                  isDarkMode
                    ? "bg-blue-900/20 border-blue-800"
                    : "bg-blue-50 border-blue-200"
                }`}
              >
                <div className="flex items-start space-x-3">
                  <div
                    className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 ${
                      isDarkMode ? "bg-blue-800" : "bg-blue-100"
                    }`}
                  >
                    <svg
                      className={`w-3 h-3 ${
                        isDarkMode ? "text-blue-400" : "text-blue-600"
                      }`}
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                  <div>
                    <h3
                      className={`text-sm font-semibold mb-1 ${
                        isDarkMode ? "text-blue-100" : "text-blue-900"
                      }`}
                    >
                      Secure Connection
                    </h3>
                    <p
                      className={`text-xs ${
                        isDarkMode ? "text-blue-300" : "text-blue-700"
                      }`}
                    >
                      Your wallet connection is encrypted and secure. We never
                      store your private keys.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-6 animate-slide-up">
              {/* Connected Status */}
              <div
                className={`border rounded-xl p-4 ${
                  isDarkMode
                    ? "bg-green-900/20 border-green-800"
                    : "bg-green-50 border-green-200"
                }`}
              >
                <div className="flex items-center space-x-3">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center ${
                      isDarkMode ? "bg-green-800" : "bg-green-100"
                    }`}
                  >
                    <svg
                      className={`w-4 h-4 ${
                        isDarkMode ? "text-green-400" : "text-green-600"
                      }`}
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                  <div>
                    <h3
                      className={`text-sm font-semibold ${
                        isDarkMode ? "text-green-100" : "text-green-900"
                      }`}
                    >
                      Wallet Connected
                    </h3>
                    <p
                      className={`text-xs ${
                        isDarkMode ? "text-green-300" : "text-green-700"
                      }`}
                    >
                      You're ready to interact with the blockchain
                    </p>
                  </div>
                </div>
              </div>

              {/* Account Info */}
              <div
                className={`rounded-xl p-4 space-y-3 ${
                  isDarkMode ? "bg-slate-700/50" : "bg-slate-50"
                }`}
              >
                <div className="flex items-center justify-between">
                  <span
                    className={`text-sm font-medium ${
                      isDarkMode ? "text-slate-400" : "text-slate-600"
                    }`}
                  >
                    Address
                  </span>
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse-slow"></div>
                    <span
                      className={`text-sm font-mono ${
                        isDarkMode ? "text-white" : "text-slate-900"
                      }`}
                    >
                      {formatAddress(account)}
                    </span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span
                    className={`text-sm font-medium ${
                      isDarkMode ? "text-slate-400" : "text-slate-600"
                    }`}
                  >
                    Network
                  </span>
                  <span
                    className={`text-sm font-medium ${
                      isDarkMode ? "text-white" : "text-slate-900"
                    }`}
                  >
                    {network}
                  </span>
                </div>
              </div>

              {/* Transaction Demo */}
              <TransactionDemo isDarkMode={isDarkMode} />
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="text-center mt-6">
          <p
            className={`text-xs ${
              isDarkMode ? "text-slate-400" : "text-slate-500"
            }`}
          >
            Created by Kolade
          </p>
        </div>
      </div>
    </div>
  );
};

export default ConnectWallet;
