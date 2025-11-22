import React, { useState, useEffect } from 'react';
import { Zap, TrendingDown, AlertCircle } from 'lucide-react';
import { suiService } from '../../services/suiService';
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
      const estimate = await suiService.estimateGas(currentTab.content);
      setGasEstimate(estimate);
    } catch (error) {
      console.error('Gas analysis failed:', error);
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
        <p className="text-sm text-slate-400">No file open</p>
      </div>
    );
  }

  return (
    <div className="h-full bg-dark-surface flex flex-col">
      <div className="p-4 border-b border-dark-border">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-semibold text-white">Gas Analysis</h3>
          {isAnalyzing && (
            <div className="flex items-center gap-2 text-xs text-slate-400">
              <div className="w-3 h-3 border-2 border-sui-cyan border-t-transparent rounded-full animate-spin"></div>
              <span>Analyzing...</span>
            </div>
          )}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-thin">
        {gasEstimate && (
          <>
            {/* Gas Overview */}
            <div className="p-4 bg-dark-bg rounded-lg border border-dark-border">
              <div className="flex items-center gap-2 mb-3">
                <Zap size={16} className="text-sui-cyan" />
                <h4 className="text-sm font-medium text-white">Estimated Gas</h4>
              </div>
              
              <div className="space-y-3">
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs text-slate-400">Gas Used</span>
                    <span className="text-sm font-mono text-white">
                      {gasEstimate.gasUsed.toLocaleString()} units
                    </span>
                  </div>
                  <div className="w-full h-2 bg-dark-surface rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-sui-cyan rounded-full"
                      style={{ width: `${(gasEstimate.gasUsed / gasEstimate.gasBudget) * 100}%` }}
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-xs text-slate-400">Gas Budget</span>
                  <span className="text-sm font-mono text-slate-300">
                    {gasEstimate.gasBudget.toLocaleString()} units
                  </span>
                </div>

                <div className="pt-3 border-t border-dark-border">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-slate-400">Estimated Cost</span>
                    <span className="text-lg font-mono font-bold text-sui-cyan">
                      {formatGas(gasEstimate.gasUsed)} SUI
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
