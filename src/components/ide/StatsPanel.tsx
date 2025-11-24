import React, { useEffect, useState } from 'react';
import { TrendingUp, Heart, Eye, Users, Rocket, Code, Zap, Loader } from 'lucide-react';
import { analyticsService } from '../../services/analyticsService';

interface UserAnalytics {
  projects: number;
  deployments: {
    total: number;
    successful: number;
    failed: number;
    successRate: number;
  };
  gas: {
    totalUsed: number;
    averagePerDeployment: number;
  };
  compilations: {
    last30Days: number;
  };
  activity: Record<string, number>;
}

const StatsPanel: React.FC = () => {
  const [analytics, setAnalytics] = useState<UserAnalytics | null>(null);
  const [loading, setLoading] = useState(true);
  const [timeFilter, setTimeFilter] = useState<'today' | 'yesterday' | 'week'>('today');

  useEffect(() => {
    loadAnalytics();
  }, []);

  const loadAnalytics = async () => {
    try {
      const data = await analyticsService.getUserAnalytics();
      setAnalytics(data);
    } catch (error) {
      console.error('Failed to load analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="h-full bg-dark-surface flex items-center justify-center">
        <div className="text-center">
          <Loader size={32} className="text-sui-cyan animate-spin mx-auto mb-3" />
          <p className="text-sm text-slate-400 font-tech">Loading analytics...</p>
        </div>
      </div>
    );
  }

  if (!analytics) {
    return (
      <div className="h-full bg-dark-surface flex items-center justify-center">
        <div className="text-center">
          <TrendingUp size={48} className="text-slate-600 mx-auto mb-3" />
          <p className="text-sm text-slate-400 font-tech">No analytics data available</p>
          <button
            onClick={loadAnalytics}
            className="mt-4 px-4 py-2 bg-sui-cyan/10 border border-sui-cyan/30 rounded-lg text-sui-cyan hover:bg-sui-cyan/20 transition-all text-sm font-tech"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  const successRate = analytics.deployments.successRate;

  return (
    <div className="h-full bg-dark-surface overflow-y-auto scrollbar-thin scrollbar-thumb-sui-cyan/30 scrollbar-track-transparent">
      {/* Header */}
      <div className="p-4 border-b border-sui-cyan/20 bg-dark-header">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-black text-white uppercase tracking-wider font-tech">Analytics</h3>
          <button
            onClick={loadAnalytics}
            className="p-1.5 text-slate-400 hover:text-sui-cyan hover:bg-sui-cyan/10 rounded transition-all"
            title="Refresh"
          >
            <TrendingUp size={16} />
          </button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="p-4 space-y-3">
        {/* Projects */}
        <div className="p-4 bg-dark-panel border border-sui-cyan/20 rounded-lg">
          <div className="flex items-center gap-2 mb-2">
            <Code size={16} className="text-sui-cyan" />
            <span className="text-xs text-slate-400 uppercase tracking-wider font-tech">Projects</span>
          </div>
          <div className="text-3xl font-black text-white font-tech">{analytics.projects}</div>
        </div>

        {/* Deployments */}
        <div className="p-4 bg-dark-panel border border-sui-cyan/20 rounded-lg">
          <div className="flex items-center gap-2 mb-2">
            <Rocket size={16} className="text-neon-green" />
            <span className="text-xs text-slate-400 uppercase tracking-wider font-tech">Deployments</span>
          </div>
          <div className="text-3xl font-black text-white font-tech mb-2">{analytics.deployments.total}</div>
          <div className="flex items-center justify-between text-xs">
            <span className="text-neon-green">✓ {analytics.deployments.successful} Success</span>
            <span className="text-neon-pink">✗ {analytics.deployments.failed} Failed</span>
          </div>
        </div>

        {/* Success Rate Circle */}
        <div className="p-4 bg-dark-panel border border-sui-cyan/20 rounded-lg">
          <div className="flex items-center gap-2 mb-3">
            <TrendingUp size={16} className="text-neon-purple" />
            <span className="text-xs text-slate-400 uppercase tracking-wider font-tech">Success Rate</span>
          </div>
          <div className="flex items-center justify-center">
            <div className="relative w-32 h-32">
              <svg className="w-full h-full transform -rotate-90">
                <circle
                  cx="64"
                  cy="64"
                  r="56"
                  stroke="#1e293b"
                  strokeWidth="8"
                  fill="none"
                />
                <circle
                  cx="64"
                  cy="64"
                  r="56"
                  stroke="#4DA9FF"
                  strokeWidth="8"
                  fill="none"
                  strokeDasharray={`${2 * Math.PI * 56 * (successRate / 100)} ${2 * Math.PI * 56}`}
                  strokeLinecap="round"
                  className="transition-all duration-1000"
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center flex-col">
                <span className="text-3xl font-black text-white font-tech">{successRate}%</span>
                <span className="text-xs text-slate-400 font-tech">Success</span>
              </div>
            </div>
          </div>
        </div>

        {/* Gas Usage */}
        <div className="p-4 bg-dark-panel border border-sui-cyan/20 rounded-lg">
          <div className="flex items-center gap-2 mb-2">
            <Zap size={16} className="text-yellow-400" />
            <span className="text-xs text-slate-400 uppercase tracking-wider font-tech">Gas Usage</span>
          </div>
          <div className="text-2xl font-black text-white font-tech mb-1">
            {(analytics.gas.totalUsed / 1000000).toFixed(2)}M
          </div>
          <div className="text-xs text-slate-400 font-tech">
            Avg: {(analytics.gas.averagePerDeployment / 1000).toFixed(1)}K per deployment
          </div>
        </div>

        {/* Compilations */}
        <div className="p-4 bg-dark-panel border border-sui-cyan/20 rounded-lg">
          <div className="flex items-center gap-2 mb-2">
            <Code size={16} className="text-neon-purple" />
            <span className="text-xs text-slate-400 uppercase tracking-wider font-tech">Compilations</span>
          </div>
          <div className="text-3xl font-black text-white font-tech mb-1">{analytics.compilations.last30Days}</div>
          <div className="text-xs text-slate-400 font-tech">Last 30 days</div>
        </div>

        {/* Activity Chart */}
        {Object.keys(analytics.activity).length > 0 && (
          <div className="p-4 bg-dark-panel border border-sui-cyan/20 rounded-lg">
            <div className="flex items-center gap-2 mb-3">
              <TrendingUp size={16} className="text-sui-cyan" />
              <span className="text-xs text-slate-400 uppercase tracking-wider font-tech">Activity (7 Days)</span>
            </div>
            <div className="space-y-2">
              {Object.entries(analytics.activity).map(([day, count]) => (
                <div key={day} className="space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-400 font-tech">{new Date(day).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
                    <span className="text-white font-tech font-bold">{count}</span>
                  </div>
                  <div className="w-full h-2 bg-dark-bg rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-gradient-neon rounded-full transition-all duration-500"
                      style={{ width: `${Math.min((count / Math.max(...Object.values(analytics.activity))) * 100, 100)}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default StatsPanel;
