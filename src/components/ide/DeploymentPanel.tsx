import React, { useState } from 'react';
import { Rocket, Loader, CheckCircle, XCircle, ExternalLink, Copy } from 'lucide-react';
import { suiService } from '../../services/suiService';
import { useIDEStore } from '../../store/ideStore';

const DeploymentPanel: React.FC = () => {
  const { tabs, activeTab } = useIDEStore();
  const [isDeploying, setIsDeploying] = useState(false);
  const [deploymentResult, setDeploymentResult] = useState<any>(null);
  const [network, setNetwork] = useState('testnet');

  const currentTab = tabs.find(t => t.id === activeTab);

  const handleDeploy = async () => {
    if (!currentTab) return;

    setIsDeploying(true);
    setDeploymentResult(null);

    try {
      // First compile
      const compileResult = await suiService.compileMove(currentTab.content);
      
      if (!compileResult.success) {
        setDeploymentResult({
          success: false,
          message: compileResult.message,
        });
        setIsDeploying(false);
        return;
      }

      // Then deploy
      const deployResult = await suiService.deployContract(
        currentTab.content,
        currentTab.name.replace('.move', '')
      );

      setDeploymentResult(deployResult);
    } catch (error: any) {
      setDeploymentResult({
        success: false,
        message: error.message || 'Deployment failed',
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

      {/* Deployment Result */}
      <div className="flex-1 overflow-y-auto p-4 scrollbar-thin">
        {deploymentResult && (
          <div className={`p-4 rounded-lg border ${
            deploymentResult.success 
              ? 'bg-green-500/10 border-green-500/20' 
              : 'bg-red-500/10 border-red-500/20'
          }`}>
            <div className="flex items-start gap-3">
              {deploymentResult.success ? (
                <CheckCircle size={20} className="text-green-400 flex-shrink-0 mt-0.5" />
              ) : (
                <XCircle size={20} className="text-red-400 flex-shrink-0 mt-0.5" />
              )}
              <div className="flex-1 min-w-0">
                <p className={`text-sm font-medium mb-2 ${
                  deploymentResult.success ? 'text-green-400' : 'text-red-400'
                }`}>
                  {deploymentResult.success ? 'Deployment Successful' : 'Deployment Failed'}
                </p>
                <p className="text-sm text-slate-300 mb-3">{deploymentResult.message}</p>

                {deploymentResult.success && (
                  <div className="space-y-2">
                    {/* Package ID */}
                    {deploymentResult.packageId && (
                      <div className="p-2 bg-dark-bg rounded">
                        <p className="text-xs text-slate-400 mb-1">Package ID</p>
                        <div className="flex items-center gap-2">
                          <code className="text-xs text-sui-cyan font-mono flex-1 truncate">
                            {deploymentResult.packageId}
                          </code>
                          <button
                            onClick={() => copyToClipboard(deploymentResult.packageId)}
                            className="p-1 hover:bg-white/5 rounded"
                          >
                            <Copy size={14} className="text-slate-400" />
                          </button>
                        </div>
                      </div>
                    )}

                    {/* Transaction Digest */}
                    {deploymentResult.transactionDigest && (
                      <div className="p-2 bg-dark-bg rounded">
                        <p className="text-xs text-slate-400 mb-1">Transaction</p>
                        <div className="flex items-center gap-2">
                          <code className="text-xs text-slate-300 font-mono flex-1 truncate">
                            {deploymentResult.transactionDigest}
                          </code>
                          <a
                            href={`https://suiexplorer.com/txblock/${deploymentResult.transactionDigest}?network=${network}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-1 hover:bg-white/5 rounded"
                          >
                            <ExternalLink size={14} className="text-slate-400" />
                          </a>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {!deploymentResult && !isDeploying && (
          <div className="text-center py-8">
            <Rocket size={48} className="text-slate-600 mx-auto mb-3" />
            <p className="text-sm text-slate-400">
              Ready to deploy your contract
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default DeploymentPanel;
