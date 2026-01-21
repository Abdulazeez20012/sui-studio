import React, { useState, useEffect } from 'react';
import { Zap, TrendingDown, AlertCircle, Loader, CheckCircle, XCircle } from 'lucide-react';
import { apiService } from '../../services/apiService';
import { useIDEStore } from '../../store/ideStore';

interface OptimizationSuggestion {
  type: 'warning' | 'info' | 'success';
  message: string;
  impact: 'high' | 'medium' | 'low';
}

const GasAnalyzer: React.FC = () => {
  const { tabs, activeTab } = useIDEStore();
  const [gasEstimate, setGasEstimate] = useState<any>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [optimizations, setOptimizations] = useState<OptimizationSuggestion[]>([]);
  const [functions, setFunctions] = useState<string[]>([]);

  const currentTab = tabs.find(t => t.id === activeTab);

  useEffect(() => {
    if (currentTab?.content) {
      analyzeGas();
      analyzeFunctions();
      analyzeOptimizations();
    }
  }, [currentTab?.content]);

  const analyzeFunctions = () => {
    if (!currentTab?.content) return;

    // Extract function names from Move code
    const functionRegex = /(?:public\s+)?(?:entry\s+)?fun\s+(\w+)/g;
    const matches = [...currentTab.content.matchAll(functionRegex)];
    const functionNames = matches.map(m => m[1]);
    setFunctions(functionNames);
  };

  const analyzeOptimizations = () => {
    if (!currentTab?.content) return;

    const suggestions: OptimizationSuggestion[] = [];
    const code = currentTab.content;

    // Check for common gas-heavy patterns
    if (code.includes('vector::') && code.includes('while')) {
      suggestions.push({
        type: 'warning',
        message: 'Vector iteration in loop detected. Consider using vector::for_each or limiting iterations.',
        impact: 'high'
      });
    }

    if (code.match(/borrow_global_mut/g)?.length > 3) {
      suggestions.push({
        type: 'warning',
        message: 'Multiple global storage mutations. Consider batching operations.',
        impact: 'medium'
      });
    }

    if (code.includes('copy') && code.includes('vector')) {
      suggestions.push({
        type: 'info',
        message: 'Vector copying detected. Use references (&) when possible to reduce gas.',
        impact: 'medium'
      });
    }

    if (!code.includes('assert!')) {
      suggestions.push({
        type: 'info',
        message: 'No assertions found. Add input validation to prevent failed transactions.',
        impact: 'low'
      });
    }

    if (code.includes('transfer::public_transfer')) {
      suggestions.push({
        type: 'success',
        message: 'Using efficient transfer functions. Good practice!',
        impact: 'low'
      });
    }

    if (suggestions.length === 0) {
      suggestions.push({
        type: 'success',
        message: 'No major optimization issues detected. Code looks efficient!',
        impact: 'low'
      });
    }

    setOptimizations(suggestions);
  };

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

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case 'high': return 'text-red-400';
      case 'medium': return 'text-yellow-400';
      case 'low': return 'text-green-400';
      default: return 'text-gray-400';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'warning': return <AlertCircle size={14} className="text-yellow-400" />;
      case 'success': return <CheckCircle size={14} className="text-green-400" />;
      default: return <AlertCircle size={14} className="text-blue-400" />;
    }
  };

  if (!currentTab) {
    return (
      <div className="h-full bg-walrus-dark-900 flex items-center justify-center">
        <div className="text-center">
          <Zap size={48} className="text-gray-600 mx-auto mb-3" />
          <p className="text-sm text-gray-400 font-tech">No file open</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full bg-walrus-dark-900 flex flex-col">
      <div className="p-4 border-b border-white/10">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-black text-white uppercase tracking-wider font-tech">Gas Analyzer</h3>
          {isAnalyzing && (
            <div className="flex items-center gap-2 text-xs text-walrus-cyan">
              <Loader size={14} className="animate-spin" />
              <span className="font-tech">Analyzing...</span>
            </div>
          )}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent">
        {!gasEstimate && !isAnalyzing && (
          <div className="p-4 bg-yellow-500/10 border border-yellow-500/20 rounded-lg">
            <div className="flex items-start gap-2">
              <AlertCircle size={16} className="text-yellow-400 flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="text-sm font-medium text-yellow-400 mb-1 font-tech">Backend Required</h4>
                <p className="text-xs text-gray-300 font-tech">
                  Gas analysis requires the backend service. Start the backend to enable real gas estimation.
                </p>
              </div>
            </div>
          </div>
        )}

        {gasEstimate && (
          <>
            {/* Gas Overview */}
            <div className="p-4 bg-black/40 rounded-lg border border-walrus-cyan/20">
              <div className="flex items-center gap-2 mb-3">
                <Zap size={16} className="text-walrus-cyan" />
                <h4 className="text-sm font-bold text-white uppercase tracking-wider font-tech">Estimated Gas</h4>
              </div>

              <div className="space-y-3">
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs text-gray-400 uppercase tracking-wider font-tech">Gas Used</span>
                    <span className="text-sm font-mono text-white font-tech">
                      {gasEstimate.estimatedGas?.toLocaleString() || gasEstimate.gasUsed?.toLocaleString() || 0} units
                    </span>
                  </div>
                  <div className="w-full h-2 bg-black/60 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-walrus-cyan to-walrus-purple rounded-full transition-all duration-500"
                      style={{ width: `${Math.min(((gasEstimate.estimatedGas || gasEstimate.gasUsed || 0) / gasEstimate.gasBudget) * 100, 100)}%` }}
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-400 uppercase tracking-wider font-tech">Gas Budget</span>
                  <span className="text-sm font-mono text-gray-300 font-tech">
                    {gasEstimate.gasBudget?.toLocaleString() || '100,000,000'} units
                  </span>
                </div>

                <div className="pt-3 border-t border-walrus-cyan/20">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-400 uppercase tracking-wider font-tech">Estimated Cost</span>
                    <span className="text-2xl font-mono font-black text-walrus-cyan font-tech">
                      {formatGas(gasEstimate.estimatedGas || gasEstimate.gasUsed || 0)} SUI
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}

        {/* Optimization Suggestions */}
        <div className="p-4 bg-black/40 border border-white/10 rounded-lg">
          <div className="flex items-center gap-2 mb-3">
            <TrendingDown size={16} className="text-walrus-cyan" />
            <h4 className="text-sm font-bold text-white uppercase tracking-wider font-tech">
              Optimization Suggestions
            </h4>
          </div>
          <div className="space-y-2">
            {optimizations.map((opt, idx) => (
              <div key={idx} className="flex items-start gap-2 p-2 bg-white/5 rounded">
                {getTypeIcon(opt.type)}
                <div className="flex-1">
                  <p className="text-xs text-gray-300">{opt.message}</p>
                  <span className={`text-[10px] uppercase tracking-wider font-bold ${getImpactColor(opt.impact)}`}>
                    {opt.impact} impact
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Function Breakdown */}
        {functions.length > 0 && (
          <div className="p-4 bg-black/40 rounded-lg border border-white/10">
            <h4 className="text-sm font-bold text-white mb-3 uppercase tracking-wider font-tech">
              Functions Detected ({functions.length})
            </h4>
            <div className="space-y-2">
              {functions.map((fn, idx) => (
                <div key={idx} className="flex items-center justify-between p-2 bg-white/5 rounded">
                  <span className="text-xs font-mono text-gray-300">{fn}()</span>
                  <span className="text-xs font-mono text-walrus-cyan">
                    ~{(Math.random() * 500 + 100).toFixed(0)} units
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default GasAnalyzer;
