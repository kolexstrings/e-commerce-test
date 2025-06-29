"use client";

import { useState, useEffect } from "react";
import { connectWallet } from "../utils/ethersUtils";
import {
  mockMintNFT,
  mockCheckTransaction,
  TransactionState,
} from "../utils/mockTransaction";

const ConnectWallet = () => {
  const [account, setAccount] = useState<string | null>(null);
  const [network, setNetwork] = useState<string>("");
  const [isConnecting, setIsConnecting] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [transactionState, setTransactionState] = useState<TransactionState>({
    isPending: false,
    isSuccess: false,
    isError: false,
  });

  // Theme management
  useEffect(() => {
    // Check for saved theme preference or default to system preference
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

  const handleDisconnect = () => {
    setAccount(null);
    setNetwork("");
  };

  const handleMintNFT = async () => {
    setTransactionState({
      isPending: true,
      isSuccess: false,
      isError: false,
    });

    try {
      // Simulate transaction
      const { hash } = await mockMintNFT();

      setTransactionState((prev) => ({
        ...prev,
        hash,
        isPending: false,
        isSuccess: true,
      }));

      // Simulate checking transaction confirmation
      setTimeout(async () => {
        const isConfirmed = await mockCheckTransaction(hash);
        if (isConfirmed) {
          setTransactionState((prev) => ({
            ...prev,
            isSuccess: true,
          }));
        } else {
          setTransactionState((prev) => ({
            ...prev,
            isSuccess: false,
            isError: true,
            error: "Transaction failed to confirm",
          }));
        }
      }, 2000);
    } catch (error) {
      setTransactionState({
        isPending: false,
        isSuccess: false,
        isError: true,
        error: error instanceof Error ? error.message : "Transaction failed",
      });
    }
  };

  const resetTransaction = () => {
    setTransactionState({
      isPending: false,
      isSuccess: false,
      isError: false,
    });
  };

  const formatAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  const formatHash = (hash: string) => {
    return `${hash.slice(0, 6)}...${hash.slice(-4)}`;
  };

  return (
    <div
      className={`min-h-screen flex items-center justify-center p-4 relative ${
        isDarkMode
          ? "bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900"
          : "bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100"
      }`}
    >
      {/* Theme Toggle Button */}
      <button
        onClick={toggleTheme}
        className={`absolute top-4 right-4 p-3 backdrop-blur-xl rounded-xl shadow-lg border transition-all duration-200 transform hover:scale-105 ${
          isDarkMode
            ? "bg-slate-800/80 border-slate-700/50 hover:shadow-xl"
            : "bg-white/80 border-white/20 hover:shadow-xl"
        }`}
        aria-label="Toggle theme"
      >
        {isDarkMode ? (
          <svg
            className="w-5 h-5 text-yellow-500"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path
              fillRule="evenodd"
              d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z"
              clipRule="evenodd"
            />
          </svg>
        ) : (
          <svg
            className="w-5 h-5 text-slate-700"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
          </svg>
        )}
      </button>

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
                className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 disabled:from-blue-400 disabled:to-indigo-400 text-white font-semibold py-4 px-6 rounded-xl transition-all duration-200 transform hover:scale-[1.02] disabled:scale-100 disabled:cursor-not-allowed shadow-lg hover:shadow-xl cursor-pointer"
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

              {/* Transaction Section */}
              {!transactionState.isPending &&
                !transactionState.isSuccess &&
                !transactionState.isError && (
                  <button
                    onClick={handleMintNFT}
                    className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-200 transform hover:scale-[1.02] shadow-lg hover:shadow-xl"
                  >
                    <div className="flex items-center justify-center space-x-2">
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                        />
                      </svg>
                      <span>Mint Test NFT</span>
                    </div>
                  </button>
                )}

              {/* Transaction States */}
              {transactionState.isPending && (
                <div
                  className={`border rounded-xl p-4 ${
                    isDarkMode
                      ? "bg-yellow-900/20 border-yellow-800"
                      : "bg-yellow-50 border-yellow-200"
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-yellow-100 dark:bg-yellow-800 rounded-full flex items-center justify-center">
                      <div className="w-4 h-4 border-2 border-yellow-600 dark:border-yellow-400 border-t-transparent rounded-full animate-spin"></div>
                    </div>
                    <div>
                      <h3
                        className={`text-sm font-semibold ${
                          isDarkMode ? "text-yellow-100" : "text-yellow-900"
                        }`}
                      >
                        Transaction Pending
                      </h3>
                      <p
                        className={`text-xs ${
                          isDarkMode ? "text-yellow-300" : "text-yellow-700"
                        }`}
                      >
                        Please wait while your transaction is being processed...
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {transactionState.isSuccess && (
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
                    <div className="flex-1">
                      <h3
                        className={`text-sm font-semibold ${
                          isDarkMode ? "text-green-100" : "text-green-900"
                        }`}
                      >
                        Transaction Successful!
                      </h3>
                      <p
                        className={`text-xs ${
                          isDarkMode ? "text-green-300" : "text-green-700"
                        }`}
                      >
                        Your NFT has been minted successfully
                      </p>
                      {transactionState.hash && (
                        <p
                          className={`text-xs font-mono mt-1 ${
                            isDarkMode ? "text-green-300" : "text-green-700"
                          }`}
                        >
                          Hash: {formatHash(transactionState.hash)}
                        </p>
                      )}
                    </div>
                    <button
                      onClick={resetTransaction}
                      className="text-xs px-2 py-1 rounded bg-green-200 dark:bg-green-800 text-green-800 dark:text-green-200 hover:bg-green-300 dark:hover:bg-green-700 transition-colors"
                    >
                      Reset
                    </button>
                  </div>
                </div>
              )}

              {transactionState.isError && (
                <div
                  className={`border rounded-xl p-4 ${
                    isDarkMode
                      ? "bg-red-900/20 border-red-800"
                      : "bg-red-50 border-red-200"
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center ${
                        isDarkMode ? "bg-red-800" : "bg-red-100"
                      }`}
                    >
                      <svg
                        className={`w-4 h-4 ${
                          isDarkMode ? "text-red-400" : "text-red-600"
                        }`}
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </div>
                    <div className="flex-1">
                      <h3
                        className={`text-sm font-semibold ${
                          isDarkMode ? "text-red-100" : "text-red-900"
                        }`}
                      >
                        Transaction Failed
                      </h3>
                      <p
                        className={`text-xs ${
                          isDarkMode ? "text-red-300" : "text-red-700"
                        }`}
                      >
                        {transactionState.error ||
                          "An error occurred during the transaction"}
                      </p>
                    </div>
                    <button
                      onClick={resetTransaction}
                      className="text-xs px-2 py-1 rounded bg-red-200 dark:bg-red-800 text-red-800 dark:text-red-200 hover:bg-red-300 dark:hover:bg-red-700 transition-colors"
                    >
                      Retry
                    </button>
                  </div>
                </div>
              )}

              {/* Disconnect Button */}
              <button
                onClick={handleDisconnect}
                className="w-full bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-200 transform hover:scale-[1.02] shadow-lg hover:shadow-xl"
              >
                <div className="flex items-center justify-center space-x-2">
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                    />
                  </svg>
                  <span>Disconnect Wallet</span>
                </div>
              </button>
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
