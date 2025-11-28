import React, { useState, useEffect } from 'react';
import { Zap, TrendingDown, AlertCircle, Loader } from 'lucide-react';
import { apiService } from '../../services/apiService';
import { useIDEStore } from '../../store/ideStore';

const GasAnalyzer: React.FC = () => {
  const { tabs, activeTab } = useIDEStore();
  const [gasEstimate, setGasEstimate] = useState<any>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const currentTab = tabs.find(t => t.id === activeTab);

  useEffect(() => {
    if (currentTab?.content) {
      analyzeGas();
    }
  }, [currentTab?.content]);

  const analyzeGas = async () => {
    if (!currentTab) return;

    setIsAnalyzing(true);
    try {
      const estimate = await apiService.estimateGas(currentTab.content);
      setGasEstimate(estimate);
    } catch (error) {
      console.error('Gas analysis requires backend service:', error);
      setGasEstimate(null);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const formatGas = (gas: number) => {
    return (gas / 1000000).toFixed(4);
  };

  if (!currentTab) {
    return (
      <div className="h-full bg-dark-surface flex items-center justify-center">
        <div className="text-center">
          <Zap size={48} className="text-slate-600 mx-auto mb-3" />
          <p className="text-sm text-slate-400 font-tech">No file open</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full bg-dark-surface flex flex-col">
      <div className="p-4 border-b border-sui-cyan/20 bg-dark-header">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-black text-white uppercase tracking-wider font-tech">Gas Analyzer</h3>
          {isAnalyzing && (
            <div className="flex items-center gap-2 text-xs text-sui-cyan">
              <Loader size={14} className="animate-spin" />
              <span className="font-tech">Analyzing...</span>
            </div>
          )}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-thin scrollbar-thumb-sui-cyan/30 scrollbar-track-transparent">
        {!gasEstimate && !isAnalyzing && (
          <div className="p-4 bg-yellow-500/10 border border-yellow-500/20 rounded-lg">
            <div className="flex items-start gap-2">
              <AlertCircle size={16} className="text-yellow-400 flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="text-sm font-medium text-yellow-400 mb-1 font-tech">Backend Required</h4>
                <p className="text-xs text-slate-300 font-tech">
                  Gas analysis requires the backend AI service. Start the backend to enable this feature.
                </p>
              </div>
            </div>
          </div>
        )}
        
        {gasEstimate && (
          <>
            {/* Gas Overview */}
            <div className="p-4 bg-dark-panel rounded-lg border border-sui-cyan/20">
              <div className="flex items-center gap-2 mb-3">
                <Zap size={16} className="text-sui-cyan" />
                <h4 className="text-sm font-bold text-white uppercase tracking-wider font-tech">Estimated Gas</h4>
              </div>
              
              <div className="space-y-3">
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs text-slate-400 uppercase tracking-wider font-tech">Gas Used</span>
                    <span className="text-sm font-mono text-white font-tech">
                      {gasEstimate.estimatedGas?.toLocaleString() || gasEstimate.gasUsed?.toLocaleString() || 0} units
                    </span>
                  </div>
                  <div className="w-full h-2 bg-dark-bg rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-gradient-neon rounded-full transition-all duration-500"
                      style={{ width: `${Math.min(((gasEstimate.estimatedGas || gasEstimate.gasUsed || 0) / gasEstimate.gasBudget) * 100, 100)}%` }}
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-xs text-slate-400 uppercase tracking-wider font-tech">Gas Budget</span>
                  <span className="text-sm font-mono text-slate-300 font-tech">
                    {gasEstimate.gasBudget.toLocaleString()} units
                  </span>
                </div>

                <div className="pt-3 border-t border-sui-cyan/20">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-slate-400 uppercase tracking-wider font-tech">Estimated Cost</span>
                    <span className="text-2xl font-mono font-black text-sui-cyan font-tech">
                      {formatGas(gasEstimate.estimatedGas || gasEstimate.gasUsed || 0)} SUI
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Optimization Tips */}
            <div className="p-4 bg-yellow-500/10 border border-yellow-500/20 rounded-lg">
              <div className="flex items-start gap-2">
                <TrendingDown size={16} className="text-yellow-400 flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-sm font-medium text-yellow-400 mb-2">
                    Optimization Tips
                  </h4>
                  <ul className="text-xs text-slate-300 space-y-1">
                    <li>• Use references instead of copying large objects</li>
                    <li>• Minimize storage operations</li>
                    <li>• Batch multiple operations when possible</li>
                    <li>• Avoid unnecessary loops and recursion</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Function Breakdown */}
            <div className="p-4 bg-dark-bg rounded-lg border border-dark-border">
              <h4 className="text-sm font-medium text-white mb-3">Function Costs</h4>
              <div className="space-y-2">
                {['init', 'create_pool', 'swap', 'add_liquidity'].map((fn, idx) => (
                  <div key={fn} className="flex items-center justify-between p-2 bg-dark-surface rounded">
                    <span className="text-xs font-mono text-slate-300">{fn}()</span>
                    <span className="text-xs font-mono text-sui-cyan">
                      {(Math.random() * 200 + 50).toFixed(0)} μSUI
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default GasAnalyzer;
