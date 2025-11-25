import { useState, useEffect } from 'react';
import { SuiClient, getFullnodeUrl } from '@mysten/sui.js/client';

export interface WalletAccount {
  address: string;
  publicKey: string;
  label?: string;
}

export interface WalletAdapter {
  name: string;
  icon: string;
  connect: () => Promise<WalletAccount[]>;
  disconnect: () => Promise<void>;
  signAndExecuteTransactionBlock: (transaction: any) => Promise<any>;
  getAccounts: () => Promise<WalletAccount[]>;
}

export const useWallet = () => {
  const [connected, setConnected] = useState(false);
  const [connecting, setConnecting] = useState(false);
  const [account, setAccount] = useState<WalletAccount | null>(null);
  const [balance, setBalance] = useState<string>('0');
  const [walletName, setWalletName] = useState<string>('');
  const [client] = useState(() => new SuiClient({ url: getFullnodeUrl('testnet') }));

  // Check for available wallets
  const getAvailableWallets = (): string[] => {
    const wallets: string[] = [];
    if (typeof window !== 'undefined') {
      if ((window as any).suiWallet) wallets.push('Sui Wallet');
      if ((window as any).suiet) wallets.push('Suiet');
      if ((window as any).ethos) wallets.push('Ethos');
    }
    return wallets;
  };

  // Connect to wallet
  const connect = async (walletType: string = 'Sui Wallet') => {
    setConnecting(true);
    try {
      let wallet: any;
      
      if (walletType === 'Sui Wallet' && (window as any).suiWallet) {
        wallet = (window as any).suiWallet;
      } else if (walletType === 'Suiet' && (window as any).suiet) {
        wallet = (window as any).suiet;
      } else if (walletType === 'Ethos' && (window as any).ethos) {
        wallet = (window as any).ethos;
      } else {
        throw new Error(`${walletType} not found. Please install the wallet extension.`);
      }

      const accounts = await wallet.requestPermissions();
      
      if (accounts && accounts.length > 0) {
        const selectedAccount = accounts[0];
        setAccount({
          address: selectedAccount.address,
          publicKey: selectedAccount.publicKey || '',
          label: selectedAccount.label,
        });
        setConnected(true);
        setWalletName(walletType);
        
        // Fetch balance
        await fetchBalance(selectedAccount.address);
        
        // Store in localStorage
        localStorage.setItem('walletConnected', 'true');
        localStorage.setItem('walletType', walletType);
        localStorage.setItem('walletAddress', selectedAccount.address);
      }
    } catch (error: any) {
      console.error('Failed to connect wallet:', error);
      throw error;
    } finally {
      setConnecting(false);
    }
  };

  // Disconnect wallet
  const disconnect = async () => {
    setConnected(false);
    setAccount(null);
    setBalance('0');
    setWalletName('');
    localStorage.removeItem('walletConnected');
    localStorage.removeItem('walletType');
    localStorage.removeItem('walletAddress');
  };

  // Fetch balance
  const fetchBalance = async (address: string) => {
    try {
      const balanceData = await client.getBalance({
        owner: address,
      });
      const suiBalance = (Number(balanceData.totalBalance) / 1_000_000_000).toFixed(4);
      setBalance(suiBalance);
    } catch (error) {
      console.error('Failed to fetch balance:', error);
      setBalance('0');
    }
  };

  // Sign and execute transaction
  const signAndExecuteTransaction = async (transaction: any) => {
    if (!connected || !account) {
      throw new Error('Wallet not connected');
    }

    try {
      let wallet: any;
      
      if (walletName === 'Sui Wallet' && (window as any).suiWallet) {
        wallet = (window as any).suiWallet;
      } else if (walletName === 'Suiet' && (window as any).suiet) {
        wallet = (window as any).suiet;
      } else if (walletName === 'Ethos' && (window as any).ethos) {
        wallet = (window as any).ethos;
      }

      const result = await wallet.signAndExecuteTransactionBlock({
        transactionBlock: transaction,
        options: {
          showEffects: true,
          showEvents: true,
        },
      });

      // Refresh balance after transaction
      await fetchBalance(account.address);

      return result;
    } catch (error) {
      console.error('Transaction failed:', error);
      throw error;
    }
  };

  // Auto-reconnect on page load
  useEffect(() => {
    const autoConnect = async () => {
      const wasConnected = localStorage.getItem('walletConnected');
      const savedWalletType = localStorage.getItem('walletType');
      
      if (wasConnected === 'true' && savedWalletType) {
        try {
          await connect(savedWalletType);
        } catch (error) {
          console.error('Auto-connect failed:', error);
          localStorage.removeItem('walletConnected');
        }
      }
    };

    autoConnect();
  }, []);

  // Refresh balance periodically
  useEffect(() => {
    if (connected && account) {
      const interval = setInterval(() => {
        fetchBalance(account.address);
      }, 30000); // Every 30 seconds

      return () => clearInterval(interval);
    }
  }, [connected, account]);

  return {
    connected,
    connecting,
    account,
    balance,
    walletName,
    client,
    connect,
    disconnect,
    signAndExecuteTransaction,
    getAvailableWallets,
    refreshBalance: () => account && fetchBalance(account.address),
  };
};
