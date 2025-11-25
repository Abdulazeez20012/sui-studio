import React, { useState, useEffect } from 'react';
import { Rocket, Loader, CheckCircle, XCircle, ExternalLink, Copy, Clock, Cloud } from 'lucide-react';
import { apiService } from '../../services/apiService';
import { analyticsService } from '../../services/analyticsService';
import { deploymentService } from '../../services/deploymentService';
import { walrusService } from '../../services/walrusService';
import { useSuiWallet } from '../../hooks/useSuiWallet';
import { useIDEStore } from '../../store/ideStore';

const DeploymentPanel: React.FC = () => {
  const { tabs, activeTab } = useIDEStore();
  const wallet = useSuiWallet();
  const [isDeploying, setIsDeploying] = useState(false);
  const [deploymentResult, setDeploymentResult] = useState<any>(null);
  const [network, setNetwork] = useState<'testnet' | 'devnet' | 'mainnet'>('testnet');
  const [recentDeployments, setRecentDeployments] = useState<any[]>([]);
  const [projectId] = useState<string>('temp-project');

  const currentTab = tabs.find(t => t.id === activeTab);

  useEffect(() => {
    loadRecentDeployments();
  }, []);

  const loadRecentDeployments = async () => {
    try {
      if (projectId) {
        const response = await apiService.getProjectDeployments(projectId);
        setRecentDeployments(response.deployments || []);
      }
    } catch (error) {
      console.log('Failed to load deployments:', error);
      // Fallback to empty array
      setRecentDeployments([]);
    }
  };

  const handlePublish = async () => {
    if (!currentTab) return;

    setIsDeploying(true);
    setDeploymentResult(null);

    try {
      // Check if wallet is connected
      if (!wallet.connected) {
        setDeploymentResult({
          status: 'failed',
          errorMessage: 'Please connect your Sui wallet first to publish contracts.',
        });
        setIsDeploying(false);
        return;
      }

      // Check wallet balance
      const balance = parseFloat(wallet.balance);
      if (balance < 0.1) {
        setDeploymentResult({
          status: 'failed',
          errorMessage: `Insufficient balance. You need at least 0.1 SUI for gas fees. Current balance: ${wallet.balance} SUI`,
        });
        setIsDeploying(false);
        return;
      }

      // Use deployment service to publish
      const result = await deploymentService.simulateDeployment({
        code: currentTab.content,
        packageName: currentTab.name.replace('.move', ''),
        network,
      });

      if (result.success) {
        setDeploymentResult({
          status: 'success',
          packageId: result.packageId,
          transactionDigest: result.transactionDigest,
          gasUsed: result.gasUsed,
          network,
        });
        
        // Track successful deployment
        analyticsService.trackDeployment(network, true);
        
        // Refresh wallet balance
        await wallet.refreshBalance();
        
        // Reload recent deployments
        await loadRecentDeployments();
      } else {
        throw new Error(result.error || 'Deployment failed');
      }
    } catch (error: any) {
      setDeploymentResult({
        status: 'failed',
        errorMessage: error.message || 'Publishing failed',
      });
      analyticsService.trackDeployment(network, false);
    } finally {
      setIsDeploying(false);
    }
  };

  const handleDeployToWalrus = async () => {
    if (!currentTab) return;

    setIsDeploying(true);
    setDeploymentResult(null);

    try {
      // Deploy to Walrus storage
      const result = await walrusService.deployToWalrus({
        projectName: currentTab.name.replace('.move', ''),
        files: [{
          name: currentTab.name,
          content: currentTab.content,
        }],
        network: 'testnet',
      });

      if (result.success) {
        setDeploymentResult({
          status: 'success',
          walrusId: result.blobId,
          walrusUrl: result.url,
          walrusSize: result.size,
          message: 'Successfully deployed to Walrus storage',
        });
        
        analyticsService.trackEvent('walrus_deployment', { network: 'walrus' });
      } else {
        throw new Error(result.error || 'Walrus deployment failed');
      }
    } catch (error: any) {
      setDeploymentResult({
        status: 'failed',
        errorMessage: error.message || 'Walrus deployment failed',
      });
    } finally {
      setIsDeploying(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  return (
    <div className="h-full bg-dark-surface flex flex-col">
      <div className="p-4 border-b border-dark-border">
        <h3 className="text-sm font-semibold text-white mb-3">Deploy Contract</h3>
        
        <div className="space-y-3">
          {/* Network Selection */}
          <div>
            <label className="block text-xs text-slate-400 mb-2">Network</label>
            <select
              value={network}
              onChange={(e) => setNetwork(e.target.value as 'testnet' | 'devnet' | 'mainnet')}
              className="w-full px-3 py-2 bg-dark-bg border border-dark-border rounded text-sm text-white focus:outline-none focus:border-sui-cyan"
            >
              <option value="testnet">Testnet</option>
              <option value="devnet">Devnet</option>
              <option value="mainnet">Mainnet</option>
            </select>
          </div>

          {/* Wallet Status */}
          {wallet.connected ? (
            <div className="p-3 bg-neon-green/10 border border-neon-green/20 rounded-lg">
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs text-slate-400 uppercase font-tech">Wallet Connected</span>
                <CheckCircle size={14} className="text-neon-green" />
              </div>
              <div className="text-sm text-white font-mono">{wallet.formatAddress(wallet.address!)}</div>
              <div className="text-xs text-slate-400 mt-1">Balance: {wallet.balance} SUI</div>
            </div>
          ) : (
            <div className="p-3 bg-neon-pink/10 border border-neon-pink/20 rounded-lg">
              <div className="flex items-center gap-2 mb-1">
                <XCircle size={14} className="text-neon-pink" />
                <span className="text-xs text-neon-pink uppercase font-tech">Wallet Not Connected</span>
              </div>
              <p className="text-xs text-slate-400">Connect your wallet to publish contracts</p>
            </div>
          )}

          {/* Publish Button */}
          <button
            onClick={handlePublish}
            disabled={isDeploying || !currentTab || !wallet.connected}
            className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-sui-cyan text-black rounded-lg hover:bg-[#2ba6eb] disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-bold uppercase text-sm tracking-wider font-tech"
          >
            {isDeploying ? (
              <>
                <Loader size={16} className="animate-spin" />
                <span>Publishing...</span>
              </>
            ) : (
              <>
                <Rocket size={16} />
                <span>Publish to {network}</span>
              </>
            )}
          </button>

          {/* Walrus Deployment Button */}
          <button
            onClick={handleDeployToWalrus}
            disabled={isDeploying || !currentTab}
            className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-neon-purple/20 border border-neon-purple/30 text-neon-purple rounded-lg hover:bg-neon-purple/30 hover:border-neon-purple disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-bold uppercase text-sm tracking-wider font-tech"
          >
            {isDeploying ? (
              <>
                <Loader size={16} className="animate-spin" />
                <span>Deploying...</span>
              </>
            ) : (
              <>
                <Cloud size={16} />
                <span>Deploy to Walrus</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Deployment Result & History */}
      <div className="flex-1 overflow-y-auto p-4 scrollbar-thin space-y-4">
        {/* Current Deployment Result */}
        {deploymentResult && (
          <div className={`p-4 rounded-lg border ${
            deploymentResult.status === 'success' 
              ? 'bg-neon-green/10 border-neon-green/20' 
              : 'bg-neon-pink/10 border-neon-pink/20'
          }`}>
            <div className="flex items-start gap-3">
              {deploymentResult.status === 'success' ? (
                <CheckCircle size={20} className="text-neon-green flex-shrink-0 mt-0.5" />
              ) : (
                <XCircle size={20} className="text-neon-pink flex-shrink-0 mt-0.5" />
              )}
              <div className="flex-1 min-w-0">
                <p className={`text-sm font-bold mb-2 uppercase tracking-wider font-tech ${
                  deploymentResult.status === 'success' ? 'text-neon-green' : 'text-neon-pink'
                }`}>
                  {deploymentResult.status === 'success' ? 'Deployment Successful' : 'Deployment Failed'}
                </p>
                {deploymentResult.errorMessage && (
                  <p className="text-sm text-slate-300 mb-3 font-tech">{deploymentResult.errorMessage}</p>
                )}

                {deploymentResult.status === 'success' && (
                  <div className="space-y-2">
                    {/* Package ID (Sui Deployment) */}
                    {deploymentResult.packageId && (
                      <div className="p-2 bg-dark-bg rounded border border-sui-cyan/20">
                        <p className="text-xs text-slate-400 mb-1 uppercase tracking-wider font-tech">Package ID</p>
                        <div className="flex items-center gap-2">
                          <code className="text-xs text-sui-cyan font-mono flex-1 truncate">
                            {deploymentResult.packageId}
                          </code>
                          <button
                            onClick={() => copyToClipboard(deploymentResult.packageId)}
                            className="p-1 hover:bg-sui-cyan/10 rounded transition-colors"
                            title="Copy"
                          >
                            <Copy size={14} className="text-slate-400 hover:text-sui-cyan" />
                          </button>
                          <a
                            href={`https://suiscan.com/object/${deploymentResult.packageId}?network=${deploymentResult.network || network}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-1 hover:bg-sui-cyan/10 rounded transition-colors"
                            title="View on Explorer"
                          >
                            <ExternalLink size={14} className="text-slate-400 hover:text-sui-cyan" />
                          </a>
                        </div>
                      </div>
                    )}

                    {/* Transaction Digest (Sui Deployment) */}
                    {deploymentResult.transactionDigest && (
                      <div className="p-2 bg-dark-bg rounded border border-sui-cyan/20">
                        <p className="text-xs text-slate-400 mb-1 uppercase tracking-wider font-tech">Transaction</p>
                        <div className="flex items-center gap-2">
                          <code className="text-xs text-slate-300 font-mono flex-1 truncate">
                            {deploymentResult.transactionDigest}
                          </code>
                          <button
                            onClick={() => copyToClipboard(deploymentResult.transactionDigest)}
                            className="p-1 hover:bg-sui-cyan/10 rounded transition-colors"
                            title="Copy"
                          >
                            <Copy size={14} className="text-slate-400 hover:text-sui-cyan" />
                          </button>
                          <a
                            href={`https://suiexplorer.com/txblock/${deploymentResult.transactionDigest}?network=${deploymentResult.network || network}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-1 hover:bg-sui-cyan/10 rounded transition-colors"
                            title="View on Explorer"
                          >
                            <ExternalLink size={14} className="text-slate-400 hover:text-sui-cyan" />
                          </a>
                        </div>
                      </div>
                    )}

                    {/* Gas Used (Sui Deployment) */}
                    {deploymentResult.gasUsed && (
                      <div className="p-2 bg-dark-bg rounded border border-sui-cyan/20">
                        <p className="text-xs text-slate-400 mb-1 uppercase tracking-wider font-tech">Gas Used</p>
                        <div className="text-sm text-white font-mono font-tech">
                          {(deploymentResult.gasUsed / 1000000000).toFixed(4)} SUI
                        </div>
                      </div>
                    )}

                    {/* Walrus Blob ID */}
                    {deploymentResult.walrusId && (
                      <div className="p-2 bg-dark-bg rounded border border-neon-purple/20">
                        <p className="text-xs text-slate-400 mb-1 uppercase tracking-wider font-tech">Walrus Blob ID</p>
                        <div className="flex items-center gap-2">
                          <code className="text-xs text-neon-purple font-mono flex-1 truncate">
                            {deploymentResult.walrusId}
                          </code>
                          <button
                            onClick={() => copyToClipboard(deploymentResult.walrusId)}
                            className="p-1 hover:bg-neon-purple/10 rounded transition-colors"
                            title="Copy"
                          >
                            <Copy size={14} className="text-slate-400 hover:text-neon-purple" />
                          </button>
                        </div>
                      </div>
                    )}

                    {/* Walrus URL */}
                    {deploymentResult.walrusUrl && (
                      <div className="p-2 bg-dark-bg rounded border border-neon-purple/20">
                        <p className="text-xs text-slate-400 mb-1 uppercase tracking-wider font-tech">Walrus URL</p>
                        <div className="flex items-center gap-2">
                          <code className="text-xs text-slate-300 font-mono flex-1 truncate">
                            {deploymentResult.walrusUrl}
                          </code>
                          <button
                            onClick={() => copyToClipboard(deploymentResult.walrusUrl)}
                            className="p-1 hover:bg-neon-purple/10 rounded transition-colors"
                            title="Copy"
                          >
                            <Copy size={14} className="text-slate-400 hover:text-neon-purple" />
                          </button>
                          <a
                            href={deploymentResult.walrusUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-1 hover:bg-neon-purple/10 rounded transition-colors"
                            title="Open Walrus Site"
                          >
                            <ExternalLink size={14} className="text-slate-400 hover:text-neon-purple" />
                          </a>
                        </div>
                      </div>
                    )}

                    {/* Walrus Size */}
                    {deploymentResult.walrusSize && (
                      <div className="p-2 bg-dark-bg rounded border border-neon-purple/20">
                        <p className="text-xs text-slate-400 mb-1 uppercase tracking-wider font-tech">File Size</p>
                        <div className="text-sm text-white font-mono font-tech">
                          {(deploymentResult.walrusSize / 1024).toFixed(2)} KB
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Recent Deployments */}
        {recentDeployments.length > 0 && (
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Clock size={16} className="text-slate-400" />
              <h4 className="text-sm font-bold text-white uppercase tracking-wider font-tech">Recent Deployments</h4>
            </div>
            <div className="space-y-2">
              {recentDeployments.slice(0, 5).map((deployment) => (
                <div
                  key={deployment.id}
                  className="p-3 bg-dark-panel border border-sui-cyan/20 rounded-lg hover:border-sui-cyan/40 transition-all"
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      {deployment.status === 'success' ? (
                        <CheckCircle size={14} className="text-neon-green" />
                      ) : (
                        <XCircle size={14} className="text-neon-pink" />
                      )}
                      <span className="text-xs font-bold text-white uppercase font-tech">
                        {deployment.network}
                      </span>
                    </div>
                    <span className="text-xs text-slate-400 font-tech">
                      {new Date(deployment.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  {deployment.packageId && (
                    <code className="text-xs text-sui-cyan font-mono block truncate">
                      {deployment.packageId}
                    </code>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {!deploymentResult && !isDeploying && recentDeployments.length === 0 && (
          <div className="text-center py-12">
            <Rocket size={48} className="text-slate-600 mx-auto mb-3" />
            <p className="text-sm text-slate-400 font-tech">Ready to deploy your contract</p>
            <p className="text-xs text-slate-500 mt-2 font-tech">Select a network and click Deploy</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default DeploymentPanel;
