import { 
  useCurrentAccount, 
  useConnectWallet, 
  useDisconnectWallet,
  useWallets,
  useSuiClient,
  useSignAndExecuteTransaction
} from '@mysten/dapp-kit';
import { useState, useEffect } from 'react';

export const useSuiWallet = () => {
  const currentAccount = useCurrentAccount();
  const { mutate: connect } = useConnectWallet();
  const { mutate: disconnect } = useDisconnectWallet();
  const wallets = useWallets();
  const suiClient = useSuiClient();
  const { mutateAsync: signAndExecuteTransactionBlock } = useSignAndExecuteTransaction();
  
  const [balance, setBalance] = useState<string>('0');
  const [loading, setLoading] = useState(false);

  // Fetch balance when account changes
  useEffect(() => {
    const fetchBalance = async () => {
      if (currentAccount?.address) {
        try {
          const balanceData = await suiClient.getBalance({
            owner: currentAccount.address,
          });
          const suiBalance = (Number(balanceData.totalBalance) / 1_000_000_000).toFixed(4);
          setBalance(suiBalance);
        } catch (error) {
          console.error('Failed to fetch balance:', error);
          setBalance('0');
        }
      } else {
        setBalance('0');
      }
    };

    fetchBalance();
    
    // Refresh balance every 30 seconds
    const interval = setInterval(fetchBalance, 30000);
    return () => clearInterval(interval);
  }, [currentAccount?.address, suiClient]);

  const connectWallet = (walletName: string) => {
    setLoading(true);
    const wallet = wallets.find(w => w.name === walletName);
    if (wallet) {
      connect(
        { wallet },
        {
          onSuccess: () => {
            setLoading(false);
          },
          onError: (error) => {
            console.error('Connection failed:', error);
            setLoading(false);
          },
        }
      );
    } else {
      setLoading(false);
    }
  };

  const disconnectWallet = () => {
    disconnect();
  };

  const refreshBalance = async () => {
    if (currentAccount?.address) {
      try {
        const balanceData = await suiClient.getBalance({
          owner: currentAccount.address,
        });
        const suiBalance = (Number(balanceData.totalBalance) / 1_000_000_000).toFixed(4);
        setBalance(suiBalance);
      } catch (error) {
        console.error('Failed to fetch balance:', error);
      }
    }
  };

  const formatAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  return {
    // Account info
    account: currentAccount,
    address: currentAccount?.address,
    connected: !!currentAccount,
    balance,
    
    // Wallets
    availableWallets: wallets,
    
    // Actions
    connect: connectWallet,
    disconnect: disconnectWallet,
    refreshBalance,
    
    // Transaction
    signAndExecuteTransactionBlock,
    
    // Client
    suiClient,
    
    // Utils
    formatAddress,
    loading,
  };
};
