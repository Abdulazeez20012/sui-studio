import React, { useState, useEffect } from 'react';
import { Rocket, Loader, CheckCircle, XCircle, ExternalLink, Copy, Clock } from 'lucide-react';
import { apiService } from '../../services/apiService';
import { analyticsService } from '../../services/analyticsService';
import { useIDEStore } from '../../store/ideStore';

const DeploymentPanel: React.FC = () => {
  const { tabs, activeTab } = useIDEStore();
  const [isDeploying, setIsDeploying] = useState(false);
  const [deploymentResult, setDeploymentResult] = useState<any>(null);
  const [network, setNetwork] = useState('testnet');
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

  const handleDeploy = async () => {
    if (!currentTab) return;

    setIsDeploying(true);
    setDeploymentResult(null);

    try {
      // First compile
      const compileResult = await apiService.compileCode(
        currentTab.content,
        currentTab.name.replace('.move', '')
      );
      
      if (!compileResult.success) {
        setDeploymentResult({
          status: 'failed',
          errorMessage: 'Compilation failed. Please fix errors before deploying.',
        });
        analyticsService.trackDeployment(network, false);
        setIsDeploying(false);
        return;
      }

      // Then deploy
      const deployResult = await apiService.deployContract({
        projectId: projectId || 'temp-project',
        network,
        bytecode: compileResult.bytecode,
        gasBudget: 100000000,
      });

      setDeploymentResult(deployResult.deployment);
      
      // Track successful deployment
      analyticsService.trackDeployment(network, deployResult.success);
      
      // Reload recent deployments
      await loadRecentDeployments();
    } catch (error: any) {
      setDeploymentResult({
        status: 'failed',
        errorMessage: error.message || 'Deployment failed',
      });
      analyticsService.trackDeployment(network, false);
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
              onChange={(e) => setNetwork(e.target.value)}
              className="w-full px-3 py-2 bg-dark-bg border border-dark-border rounded text-sm text-white focus:outline-none focus:border-sui-cyan"
            >
              <option value="testnet">Testnet</option>
              <option value="devnet">Devnet</option>
              <option value="mainnet">Mainnet</option>
            </select>
          </div>

          {/* Deploy Button */}
          <button
            onClick={handleDeploy}
            disabled={isDeploying || !currentTab}
            className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-sui-cyan text-black rounded-lg hover:bg-[#2ba6eb] disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
          >
            {isDeploying ? (
              <>
                <Loader size={16} className="animate-spin" />
                <span>Deploying...</span>
              </>
            ) : (
              <>
                <Rocket size={16} />
                <span>Deploy to {network}</span>
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
                    {/* Package ID */}
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
                        </div>
                      </div>
                    )}

                    {/* Transaction Digest */}
                    {deploymentResult.transactionDigest && (
                      <div className="p-2 bg-dark-bg rounded border border-sui-cyan/20">
                        <p className="text-xs text-slate-400 mb-1 uppercase tracking-wider font-tech">Transaction</p>
                        <div className="flex items-center gap-2">
                          <code className="text-xs text-slate-300 font-mono flex-1 truncate">
                            {deploymentResult.transactionDigest}
                          </code>
                          <a
                            href={`https://suiexplorer.com/txblock/${deploymentResult.transactionDigest}?network=${network}`}
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

                    {/* Gas Used */}
                    {deploymentResult.gasUsed && (
                      <div className="p-2 bg-dark-bg rounded border border-sui-cyan/20">
                        <p className="text-xs text-slate-400 mb-1 uppercase tracking-wider font-tech">Gas Used</p>
                        <div className="text-sm text-white font-mono font-tech">
                          {(deploymentResult.gasUsed / 1000000).toFixed(4)} SUI
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
