import React, { useState } from 'react';
import { Wallet, LogOut, RefreshCw, Copy, Check, ChevronDown } from 'lucide-react';
import { useWallet } from '../../hooks/useWallet';

export const WalletPanel: React.FC = () => {
  const {
    connected,
    connecting,
    account,
    balance,
    walletName,
    connect,
    disconnect,
    getAvailableWallets,
    refreshBalance,
  } = useWallet();

  const [showWalletMenu, setShowWalletMenu] = useState(false);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState('');

  const availableWallets = getAvailableWallets();

  const handleConnect = async (wallet: string) => {
    setError('');
    try {
      await connect(wallet);
      setShowWalletMenu(false);
    } catch (err: any) {
      setError(err.message || 'Failed to connect wallet');
    }
  };

  const handleDisconnect = async () => {
    await disconnect();
    setError('');
  };

  const copyAddress = () => {
    if (account?.address) {
      navigator.clipboard.writeText(account.address);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const formatAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  if (!connected) {
    return (
      <div className="h-full bg-black border-l border-gray-800 flex flex-col">
        {/* Header */}
        <div className="p-4 border-b border-gray-800">
          <div className="flex items-center gap-2 mb-2">
            <Wallet className="w-5 h-5 text-cyan-400" />
            <h3 className="text-white font-semibold">Wallet</h3>
          </div>
          <p className="text-sm text-gray-400">
            Connect your Sui wallet to interact with smart contracts
          </p>
        </div>

        {/* Connect Section */}
        <div className="flex-1 flex items-center justify-center p-6">
          <div className="text-center space-y-4 max-w-sm">
            <div className="w-16 h-16 bg-cyan-500/10 rounded-full flex items-center justify-center mx-auto">
              <Wallet className="w-8 h-8 text-cyan-400" />
            </div>
            
            <h4 className="text-white font-semibold">No Wallet Connected</h4>
            <p className="text-sm text-gray-400">
              Connect your Sui wallet to deploy contracts and interact with the blockchain
            </p>

            {availableWallets.length > 0 ? (
              <div className="space-y-2">
                {availableWallets.map((wallet) => (
                  <button
                    key={wallet}
                    onClick={() => handleConnect(wallet)}
                    disabled={connecting}
                    className="w-full px-4 py-3 bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-400 rounded-lg transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
                  >
                    <Wallet className="w-4 h-4" />
                    {connecting ? 'Connecting...' : `Connect ${wallet}`}
                  </button>
                ))}
              </div>
            ) : (
              <div className="space-y-3">
                <p className="text-sm text-yellow-400">No Sui wallet detected</p>
                <div className="text-xs text-gray-400 space-y-1">
                  <p>Please install one of these wallets:</p>
                  <ul className="list-disc list-inside space-y-1">
                    <li>Sui Wallet</li>
                    <li>Suiet Wallet</li>
                    <li>Ethos Wallet</li>
                    <li>Slush Wallet</li>
                  </ul>
                </div>
              </div>
            )}

            {error && (
              <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg">
                <p className="text-sm text-red-400">{error}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full bg-black border-l border-gray-800 flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-gray-800">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Wallet className="w-5 h-5 text-cyan-400" />
            <h3 className="text-white font-semibold">Wallet</h3>
          </div>
          <button
            onClick={handleDisconnect}
            className="p-1.5 hover:bg-gray-800 rounded transition-colors"
            title="Disconnect"
          >
            <LogOut className="w-4 h-4 text-gray-400" />
          </button>
        </div>

        {/* Wallet Info */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-400">Connected to</span>
            <span className="text-cyan-400 font-medium">{walletName}</span>
          </div>
        </div>
      </div>

      {/* Account Info */}
      <div className="p-4 border-b border-gray-800 space-y-3">
        {/* Address */}
        <div>
          <label className="text-xs text-gray-400 mb-1 block">Address</label>
          <div className="flex items-center gap-2">
            <code className="flex-1 px-3 py-2 bg-gray-900 text-cyan-400 rounded text-sm font-mono">
              {account && formatAddress(account.address)}
            </code>
            <button
              onClick={copyAddress}
              className="p-2 hover:bg-gray-800 rounded transition-colors"
              title="Copy address"
            >
              {copied ? (
                <Check className="w-4 h-4 text-green-400" />
              ) : (
                <Copy className="w-4 h-4 text-gray-400" />
              )}
            </button>
          </div>
        </div>

        {/* Balance */}
        <div>
          <label className="text-xs text-gray-400 mb-1 block">Balance</label>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-2xl font-bold text-white">{balance}</span>
              <span className="text-sm text-gray-400">SUI</span>
            </div>
            <button
              onClick={refreshBalance}
              className="p-2 hover:bg-gray-800 rounded transition-colors"
              title="Refresh balance"
            >
              <RefreshCw className="w-4 h-4 text-gray-400" />
            </button>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="p-4 border-b border-gray-800">
        <h4 className="text-sm font-semibold text-white mb-3">Quick Actions</h4>
        <div className="space-y-2">
          <button className="w-full px-3 py-2 bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-400 rounded text-sm transition-colors">
            Request Testnet SUI
          </button>
          <button className="w-full px-3 py-2 bg-gray-800 hover:bg-gray-700 text-white rounded text-sm transition-colors">
            View on Explorer
          </button>
        </div>
      </div>

      {/* Network Info */}
      <div className="p-4">
        <h4 className="text-sm font-semibold text-white mb-3">Network</h4>
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-400">Network</span>
            <span className="text-white">Testnet</span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-400">Status</span>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
              <span className="text-green-400">Connected</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
