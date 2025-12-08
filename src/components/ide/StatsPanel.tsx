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
    <div className="h-full bg-walrus-dark-900/40 backdrop-blur-xl flex flex-col font-sans overflow-hidden">
      {/* Header */}
      <div className="p-4 border-b border-white/5 bg-black/20 z-10">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-black text-white uppercase tracking-widest flex items-center gap-2">
            <TrendingUp size={16} className="text-walrus-cyan" />
            Analytics
          </h3>
          <button
            onClick={loadAnalytics}
            className="p-1.5 text-gray-500 hover:text-walrus-cyan hover:bg-walrus-cyan/10 rounded-lg transition-all"
            title="Refresh"
          >
            <TrendingUp size={14} />
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent p-4 space-y-4">
        {/* Key Metrics Grid */}
        <div className="grid grid-cols-2 gap-3">
          {/* Projects */}
          <div className="p-4 bg-white/5 border border-white/5 rounded-2xl backdrop-blur-sm group hover:border-walrus-cyan/30 transition-all">
            <div className="flex items-center gap-2 mb-2">
              <Code size={14} className="text-walrus-cyan" />
              <span className="text-[10px] text-gray-400 uppercase tracking-wider font-bold">Projects</span>
            </div>
            <div className="text-2xl font-black text-white font-mono group-hover:text-walrus-cyan transition-colors">{analytics.projects}</div>
          </div>

          {/* Compilations */}
          <div className="p-4 bg-white/5 border border-white/5 rounded-2xl backdrop-blur-sm group hover:border-walrus-purple/30 transition-all">
            <div className="flex items-center gap-2 mb-2">
              <Code size={14} className="text-walrus-purple" />
              <span className="text-[10px] text-gray-400 uppercase tracking-wider font-bold">Builds</span>
            </div>
            <div className="text-2xl font-black text-white font-mono mb-1">{analytics.compilations.last30Days}</div>
            <div className="text-[9px] text-gray-500 font-medium">Last 30 days</div>
          </div>
        </div>

        {/* Deployments */}
        <div className="p-4 bg-white/5 border border-white/5 rounded-2xl backdrop-blur-sm group hover:border-green-400/30 transition-all">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Rocket size={14} className="text-green-400" />
              <span className="text-[10px] text-gray-400 uppercase tracking-wider font-bold">Total Deployments</span>
            </div>
            <div className="text-xl font-black text-white font-mono">{analytics.deployments.total}</div>
          </div>

          <div className="flex items-center gap-2">
            <div className="flex-1 h-1.5 bg-black/40 rounded-full overflow-hidden flex">
              <div style={{ width: `${(analytics.deployments.successful / analytics.deployments.total) * 100}%` }} className="h-full bg-green-400" />
              <div style={{ width: `${(analytics.deployments.failed / analytics.deployments.total) * 100}%` }} className="h-full bg-red-400" />
            </div>
          </div>
          <div className="flex items-center justify-between text-[10px] mt-2 font-medium">
            <span className="text-green-400">{analytics.deployments.successful} Successful</span>
            <span className="text-red-400">{analytics.deployments.failed} Failed</span>
          </div>
        </div>

        {/* Success Rate Circle */}
        <div className="p-5 bg-white/5 border border-white/5 rounded-2xl backdrop-blur-sm flex items-center justify-between group hover:border-walrus-pink/30 transition-all">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp size={14} className="text-walrus-pink" />
              <span className="text-[10px] text-gray-400 uppercase tracking-wider font-bold">Success Rate</span>
            </div>
            <div className="text-3xl font-black text-white font-mono">{successRate}%</div>
            <div className="text-[10px] text-gray-500 font-medium mt-1">All time performance</div>
          </div>
          <div className="relative w-24 h-24">
            <svg className="w-full h-full transform -rotate-90">
              <circle cx="48" cy="48" r="40" stroke="rgba(255,255,255,0.05)" strokeWidth="6" fill="none" />
              <circle
                cx="48" cy="48" r="40"
                stroke="#F472B6"
                strokeWidth="6"
                fill="none"
                strokeDasharray={`${2 * Math.PI * 40 * (successRate / 100)} ${2 * Math.PI * 40}`}
                strokeLinecap="round"
                className="transition-all duration-1000 drop-shadow-[0_0_8px_rgba(244,114,182,0.5)]"
              />
            </svg>
          </div>
        </div>

        {/* Gas Usage */}
        <div className="p-4 bg-white/5 border border-white/5 rounded-2xl backdrop-blur-sm group hover:border-yellow-400/30 transition-all">
          <div className="flex items-center gap-2 mb-2">
            <Zap size={14} className="text-yellow-400" />
            <span className="text-[10px] text-gray-400 uppercase tracking-wider font-bold">Gas Consumption</span>
          </div>
          <div className="flex items-end gap-2 mb-1">
            <div className="text-2xl font-black text-white font-mono">{(analytics.gas.totalUsed / 1000000).toFixed(2)}M</div>
            <div className="text-xs text-yellow-400 font-bold mb-1.5">MIST</div>
          </div>
          <div className="text-[10px] text-gray-500 font-medium bg-black/20 p-2 rounded-lg border border-white/5 inline-block">
            Avg: {(analytics.gas.averagePerDeployment / 1000).toFixed(1)}K per deployment
          </div>
        </div>

        {/* Activity Chart */}
        {Object.keys(analytics.activity).length > 0 && (
          <div className="p-4 bg-white/5 border border-white/5 rounded-2xl backdrop-blur-sm">
            <div className="flex items-center gap-2 mb-4">
              <Users size={14} className="text-walrus-cyan" />
              <span className="text-[10px] text-gray-400 uppercase tracking-wider font-bold">Activity (7 Days)</span>
            </div>
            <div className="space-y-3">
              {Object.entries(analytics.activity).map(([day, count]) => (
                <div key={day} className="space-y-1 group">
                  <div className="flex items-center justify-between text-[10px] font-medium">
                    <span className="text-gray-500">{new Date(day).toLocaleDateString('en-US', { weekday: 'short' })}</span>
                    <span className="text-gray-300 font-mono">{count} ops</span>
                  </div>
                  <div className="w-full h-1.5 bg-black/40 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-walrus-cyan to-walrus-purple rounded-full transition-all duration-500 group-hover:shadow-neon-sm"
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
