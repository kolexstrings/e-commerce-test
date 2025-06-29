# Blockchain Ecommerce Test - Network & Wallet State Management

A demonstration of how to detect network changes and sync UI with wallet state in Web3 applications.

## Network Change Detection

The application detects network changes through MetaMask's event listeners and updates the UI automatically:

```typescript
// In ConnectWallet.tsx
useEffect(() => {
  const handleChainChanged = async () => {
    // Network/chain changed - refresh network info
    await updateNetworkInfo();
  };

  const handleNetworkChanged = async () => {
    // Network changed - refresh network info
    await updateNetworkInfo();
  };

  // Set up event listeners
  window.ethereum.on("chainChanged", handleChainChanged);
  window.ethereum.on("networkChanged", handleNetworkChanged);
}, []);
```

## UI State Syncing

The UI automatically syncs with wallet state changes:

### Wallet Connection State

- **Disconnected**: Shows connect button and security info
- **Connecting**: Loading spinner with "Connecting..." text
- **Connected**: Displays wallet address, network, and transaction options

### Account Change Detection

The app listens for account changes and updates automatically:

```typescript
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
```

### Network Display

The current network is displayed and updates automatically when changed:

```typescript
const updateNetworkInfo = async () => {
  const provider = getProvider();
  const network = await provider.getNetwork();
  setNetwork(network.name || `Chain ID: ${network.chainId}`);
};
```

### Transaction State Management

The UI provides real-time feedback for transaction states:

- **Pending**: Yellow loading state with spinner
- **Success**: Green confirmation with transaction hash
- **Error**: Red error state with retry option

## Key Implementation Details

1. **Event Listeners**: Uses `accountsChanged`, `chainChanged`, and `networkChanged` events
2. **Automatic Detection**: Checks for existing wallet connection on page load
3. **State Management**: React state hooks manage wallet and transaction states
4. **UI Updates**: Conditional rendering based on connection and transaction states
5. **Error Handling**: Graceful error states with user-friendly messages
6. **Cleanup**: Properly removes event listeners to prevent memory leaks

## Testing Network Changes

1. Connect your wallet
2. Switch networks in MetaMask (e.g., from Ethereum mainnet to a testnet)
3. The UI will automatically reflect the new network
4. Switch accounts in MetaMask - the UI updates automatically
5. Disconnect wallet in MetaMask - the UI returns to disconnected state
6. Transaction states will update based on the current network
