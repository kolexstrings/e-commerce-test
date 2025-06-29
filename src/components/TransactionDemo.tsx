import { useState } from "react";
import {
  mockMintNFT,
  mockCheckTransaction,
  TransactionState,
} from "../utils/mockTransaction";

interface TransactionDemoProps {
  isDarkMode: boolean;
}

const TransactionDemo = ({ isDarkMode }: TransactionDemoProps) => {
  const [transactionState, setTransactionState] = useState<TransactionState>({
    isPending: false,
    isSuccess: false,
    isError: false,
  });

  const handleMintNFT = async () => {
    setTransactionState({
      isPending: true,
      isSuccess: false,
      isError: false,
    });

    try {
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

  const formatHash = (hash: string) => {
    return `${hash.slice(0, 6)}...${hash.slice(-4)}`;
  };

  return (
    <div className="space-y-6">
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
    </div>
  );
};

export default TransactionDemo;
