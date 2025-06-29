// Mock transaction utility for UI testing
export interface TransactionState {
  isPending: boolean;
  isSuccess: boolean;
  isError: boolean;
  hash?: string;
  error?: string;
}

// Simulate a blockchain transaction
export const mockMintNFT = async (): Promise<{ hash: string }> => {
  // Simulate network delay
  await new Promise((resolve) =>
    setTimeout(resolve, 2000 + Math.random() * 3000)
  );

  // Simulate 10% failure rate for testing error states
  if (Math.random() < 0.1) {
    throw new Error("Transaction failed: Insufficient gas");
  }

  // Generate a mock transaction hash
  const mockHash = "0x" + Math.random().toString(16).substring(2, 66);

  return { hash: mockHash };
};

// Simulate checking transaction status
export const mockCheckTransaction = async (hash: string): Promise<boolean> => {
  // Simulate network delay for transaction confirmation
  await new Promise((resolve) =>
    setTimeout(resolve, 1000 + Math.random() * 2000)
  );

  // Simulate 95% success rate (hash parameter used for future implementation)
  console.log(`Checking transaction: ${hash}`);
  return Math.random() < 0.95;
};
