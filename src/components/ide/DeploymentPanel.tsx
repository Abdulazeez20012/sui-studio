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

      // Use deployment service to publish (REAL deployment)
      const result = await deploymentService.publishPackage(
        {
          code: currentTab.content,
          packageName: currentTab.name.replace('.move', ''),
          network,
        },
        wallet.signAndExecuteTransactionBlock
      );

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
        errorDetails: error.details,
        compilationErrors: error.compilationErrors,
        fullOutput: error.fullOutput,
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
    <div className="h-full bg-walrus-dark-900/40 backdrop-blur-sm flex flex-col font-sans">
      <div className="p-4 border-b border-white/5 bg-black/20">
        <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4 flex items-center gap-2">
          <Rocket size={14} className="text-walrus-cyan" />
          Deploy Contract
        </h3>

        <div className="space-y-4">
          {/* Network Selection */}
          <div>
            <label className="block text-[10px] text-gray-500 uppercase tracking-wider mb-2 font-bold ml-1">Target Network</label>
            <div className="relative group">
              <select
                value={network}
                onChange={(e) => setNetwork(e.target.value as 'testnet' | 'devnet' | 'mainnet')}
                className="w-full pl-4 pr-10 py-2.5 bg-black/40 border border-white/10 rounded-xl text-sm text-gray-200 focus:outline-none focus:border-walrus-cyan/50 focus:shadow-neon-sm appearance-none transition-all hover:bg-black/60 font-medium"
              >
                <option value="testnet">Sui Testnet</option>
                <option value="devnet">Sui Devnet</option>
                <option value="mainnet">Sui Mainnet</option>
              </select>
              <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-500 group-hover:text-white transition-colors">
                <Cloud size={14} />
              </div>
            </div>
          </div>

          {/* Wallet Status */}
          {wallet.connected ? (
            <div className="p-3 bg-neon-green/5 border border-neon-green/20 rounded-xl flex items-center justify-between group hover:bg-neon-green/10 transition-colors">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <div className="w-1.5 h-1.5 rounded-full bg-neon-green shadow-[0_0_8px_rgba(74,222,128,0.5)] animate-pulse" />
                  <span className="text-[10px] text-neon-green uppercase font-bold tracking-wider">Wallet Connected</span>
                </div>
                <div className="text-xs text-gray-300 font-mono opacity-80">{wallet.formatAddress(wallet.address!)}</div>
              </div>
              <div className="text-right">
                <div className="text-xs text-slate-500 mb-0.5">Balance</div>
                <div className="text-sm font-bold text-white font-mono">{wallet.balance} SUI</div>
              </div>
            </div>
          ) : (
            <div className="p-3 bg-red-500/5 border border-red-500/10 rounded-xl flex items-center gap-3 group hover:border-red-500/30 transition-colors">
              <div className="p-2 bg-red-500/10 rounded-lg">
                <XCircle size={16} className="text-red-400" />
              </div>
              <div>
                <span className="text-xs text-red-400 uppercase font-bold tracking-wider block mb-0.5">Wallet Disconnected</span>
                <p className="text-[10px] text-slate-500">Connect to publish</p>
              </div>
            </div>
          )}

          <div className="grid grid-cols-2 gap-3">
            {/* Publish Button */}
            <button
              onClick={handlePublish}
              disabled={isDeploying || !currentTab || !wallet.connected}
              className="col-span-1 flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-walrus-cyan/20 to-walrus-cyan/10 border border-walrus-cyan/30 text-walrus-cyan rounded-xl hover:bg-walrus-cyan/30 hover:border-walrus-cyan/50 hover:shadow-neon-sm disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none transition-all font-bold uppercase text-[10px] tracking-wider"
            >
              {isDeploying ? (
                <Loader size={14} className="animate-spin" />
              ) : (
                <Rocket size={14} />
              )}
              <span>Publish</span>
            </button>

            {/* Walrus Deployment Button */}
            <button
              onClick={handleDeployToWalrus}
              disabled={isDeploying || !currentTab}
              className="col-span-1 flex items-center justify-center gap-2 px-4 py-3 bg-walrus-purple/10 border border-walrus-purple/20 text-walrus-purple rounded-xl hover:bg-walrus-purple/20 hover:border-walrus-purple/40 hover:shadow-[0_0_15px_-5px_rgba(168,85,247,0.4)] disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none transition-all font-bold uppercase text-[10px] tracking-wider"
            >
              {isDeploying ? (
                <Loader size={14} className="animate-spin" />
              ) : (
                <Cloud size={14} />
              )}
              <span>Walrus</span>
            </button>
          </div>
        </div>
      </div>

      {/* Deployment Result & History */}
      <div className="flex-1 overflow-y-auto p-4 scrollbar-thin scrollbar-thumb-white/10 space-y-4">
        {/* Current Deployment Result */}
        {deploymentResult && (
          <div className={`p-4 rounded-xl border relative overflow-hidden backdrop-blur-xl ${deploymentResult.status === 'success'
            ? 'bg-neon-green/5 border-neon-green/20'
            : 'bg-red-500/5 border-red-500/20'
            }`}>
            <div className={`absolute top-0 left-0 w-1 h-full ${deploymentResult.status === 'success' ? 'bg-neon-green' : 'bg-red-500'}`} />

            <div className="flex items-start gap-3">
              {deploymentResult.status === 'success' ? (
                <div className="p-1.5 bg-neon-green/10 rounded-full">
                  <CheckCircle size={16} className="text-neon-green" />
                </div>
              ) : (
                <div className="p-1.5 bg-red-500/10 rounded-full">
                  <XCircle size={16} className="text-red-400" />
                </div>
              )}
              <div className="flex-1 min-w-0">
                <p className={`text-xs font-bold mb-2 uppercase tracking-wide ${deploymentResult.status === 'success' ? 'text-neon-green' : 'text-red-400'
                  }`}>
                  {deploymentResult.status === 'success' ? 'Deployment Successful' : 'Action Failed'}
                </p>
                {deploymentResult.errorMessage && (
                  <div className="space-y-3">
                    <p className="text-xs text-gray-300 font-medium leading-relaxed bg-black/20 p-2 rounded-lg border border-white/5">{deploymentResult.errorMessage}</p>

                    {/* Full Output Toggle */}
                    {deploymentResult.fullOutput && (
                      <details className="group">
                        <summary className="text-[10px] text-gray-500 cursor-pointer hover:text-white uppercase tracking-wider flex items-center gap-2 select-none">
                          <span className="group-open:rotate-90 transition-transform">▸</span> Show Logs
                        </summary>
                        <div className="mt-2 p-3 bg-black/40 rounded-lg border border-white/5 font-mono text-[10px] text-gray-400 whitespace-pre-wrap max-h-40 overflow-y-auto custom-scrollbar">
                          {deploymentResult.fullOutput}
                        </div>
                      </details>
                    )}
                  </div>
                )}

                {deploymentResult.status === 'success' && (
                  <div className="space-y-2 mt-2">
                    {/* Package ID (Sui Deployment) */}
                    {deploymentResult.packageId && (
                      <div className="p-2.5 bg-black/30 rounded-lg border border-white/5 group hover:border-walrus-cyan/30 transition-colors">
                        <p className="text-[10px] text-gray-500 mb-1 uppercase tracking-wider font-bold">Package ID</p>
                        <div className="flex items-center gap-2">
                          <code className="text-xs text-walrus-cyan font-mono flex-1 truncate select-all">
                            {deploymentResult.packageId}
                          </code>
                          <button
                            onClick={() => copyToClipboard(deploymentResult.packageId)}
                            className="p-1.5 hover:bg-white/10 rounded-md transition-colors text-gray-500 hover:text-white"
                          >
                            <Copy size={12} />
                          </button>
                          <a
                            href={`https://suiscan.com/object/${deploymentResult.packageId}?network=${deploymentResult.network || network}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-1.5 hover:bg-white/10 rounded-md transition-colors text-gray-500 hover:text-white"
                          >
                            <ExternalLink size={12} />
                          </a>
                        </div>
                      </div>
                    )}

                    {/* Walrus Blob ID */}
                    {deploymentResult.walrusId && (
                      <div className="p-2.5 bg-black/30 rounded-lg border border-white/5 group hover:border-walrus-purple/30 transition-colors">
                        <p className="text-[10px] text-gray-500 mb-1 uppercase tracking-wider font-bold">Walrus Blob ID</p>
                        <div className="flex items-center gap-2">
                          <code className="text-xs text-walrus-purple font-mono flex-1 truncate select-all">
                            {deploymentResult.walrusId}
                          </code>
                          <button
                            onClick={() => copyToClipboard(deploymentResult.walrusId)}
                            className="p-1.5 hover:bg-white/10 rounded-md transition-colors text-gray-500 hover:text-white"
                          >
                            <Copy size={12} />
                          </button>
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
            <div className="flex items-center gap-2 mb-3 px-1">
              <Clock size={12} className="text-gray-500" />
              <h4 className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Recent Activity</h4>
            </div>
            <div className="space-y-2">
              {recentDeployments.slice(0, 5).map((deployment) => (
                <div
                  key={deployment.id}
                  className="p-3 bg-white/5 border border-white/5 rounded-lg hover:bg-white/10 hover:border-white/10 transition-all cursor-pointer group"
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      {deployment.status === 'success' ? (
                        <div className="w-1.5 h-1.5 rounded-full bg-neon-green" />
                      ) : (
                        <div className="w-1.5 h-1.5 rounded-full bg-red-500" />
                      )}
                      <span className="text-[10px] font-bold text-gray-300 uppercase tracking-wider group-hover:text-white transition-colors">
                        {deployment.network}
                      </span>
                    </div>
                    <span className="text-[10px] text-gray-600 font-mono">
                      {new Date(deployment.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  {deployment.packageId && (
                    <code className="text-[10px] text-gray-500 font-mono block truncate group-hover:text-walrus-cyan transition-colors">
                      {deployment.packageId}
                    </code>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {!deploymentResult && !isDeploying && recentDeployments.length === 0 && (
          <div className="text-center py-12 opacity-50 select-none">
            <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-4">
              <Rocket size={24} className="text-gray-500" />
            </div>
            <p className="text-xs text-gray-500 font-medium uppercase tracking-widest">Ready to Deploy</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default DeploymentPanel;
