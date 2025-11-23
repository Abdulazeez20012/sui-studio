import React from 'react';
import { TrendingUp, Heart, Eye, Users } from 'lucide-react';

const StatsPanel: React.FC = () => {
  const stats = {
    overallViews: 15019,
    overallLikes: 624,
    viewsToday: 7500,
    viewsYesterday: 6750,
    viewsThisWeek: 750,
  };

  const followers = [
    { name: 'Theresa Simmmons', views: 45, likes: 12 },
    { name: 'Brandis Bell', views: 40, likes: 8 },
    { name: 'Aubrey Flores', views: 41, likes: 6 },
    { name: 'Beth Mckinney', views: 35, likes: 5 },
    { name: 'Jane Hawkins', views: 30, likes: 5 },
  ];

  return (
    <div className="h-full bg-[#252b3b] overflow-y-auto scrollbar-thin scrollbar-thumb-slate-600 scrollbar-track-transparent">
      {/* Header */}
      <div className="p-4 border-b border-slate-700/50">
        <h3 className="text-sm font-semibold text-white">Project Analytics</h3>
      </div>

      {/* Time Filter */}
      <div className="p-4 border-b border-slate-700/50">
        <div className="flex gap-2">
          <button className="px-3 py-1.5 bg-[#2d3748] text-white text-xs font-medium rounded">
            Today
          </button>
          <button className="px-3 py-1.5 text-slate-400 hover:text-white text-xs font-medium">
            Yesterday
          </button>
          <button className="px-3 py-1.5 text-slate-400 hover:text-white text-xs font-medium">
            This week
          </button>
        </div>
      </div>

      {/* Overall Stats */}
      <div className="p-4 border-b border-slate-700/50">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Eye size={14} className="text-green-400" />
              <span className="text-xs text-slate-400">Overall views</span>
            </div>
            <div className="text-2xl font-bold text-white">{stats.overallViews.toLocaleString()}</div>
          </div>
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Heart size={14} className="text-pink-400" />
              <span className="text-xs text-slate-400">Overall likes</span>
            </div>
            <div className="text-2xl font-bold text-white">{stats.overallLikes}</div>
          </div>
        </div>
      </div>

      {/* Progress Circles */}
      <div className="p-4 border-b border-slate-700/50">
        <div className="flex items-center justify-center gap-6">
          {/* Main Circle */}
          <div className="relative w-32 h-32">
            <svg className="w-full h-full transform -rotate-90">
              <circle
                cx="64"
                cy="64"
                r="56"
                stroke="#334155"
                strokeWidth="8"
                fill="none"
              />
              <circle
                cx="64"
                cy="64"
                r="56"
                stroke="#3CB9FF"
                strokeWidth="8"
                fill="none"
                strokeDasharray={`${2 * Math.PI * 56 * 0.5} ${2 * Math.PI * 56}`}
                strokeLinecap="round"
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-2xl font-bold text-white">50%</span>
            </div>
          </div>

          {/* Small Circles */}
          <div className="flex flex-col gap-3">
            <div className="flex items-center gap-2">
              <div className="relative w-12 h-12">
                <svg className="w-full h-full transform -rotate-90">
                  <circle
                    cx="24"
                    cy="24"
                    r="20"
                    stroke="#334155"
                    strokeWidth="4"
                    fill="none"
                  />
                  <circle
                    cx="24"
                    cy="24"
                    r="20"
                    stroke="#8B5CF6"
                    strokeWidth="4"
                    fill="none"
                    strokeDasharray={`${2 * Math.PI * 20 * 0.45} ${2 * Math.PI * 20}`}
                    strokeLinecap="round"
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-xs font-bold text-white">45%</span>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className="relative w-12 h-12">
                <svg className="w-full h-full transform -rotate-90">
                  <circle
                    cx="24"
                    cy="24"
                    r="20"
                    stroke="#334155"
                    strokeWidth="4"
                    fill="none"
                  />
                  <circle
                    cx="24"
                    cy="24"
                    r="20"
                    stroke="#10B981"
                    strokeWidth="4"
                    fill="none"
                    strokeDasharray={`${2 * Math.PI * 20 * 0.05} ${2 * Math.PI * 20}`}
                    strokeLinecap="round"
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-xs font-bold text-white">5%</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Followers Table */}
      <div className="p-4">
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs text-slate-400 uppercase tracking-wider">Followers</span>
          <div className="flex gap-4 text-xs text-slate-400">
            <span>Views</span>
            <span>Likes</span>
          </div>
        </div>
        <div className="space-y-2">
          {followers.map((follower, index) => (
            <div
              key={index}
              className="flex items-center justify-between py-2 hover:bg-slate-700/20 rounded px-2 transition-colors"
            >
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-full flex items-center justify-center text-white text-xs font-bold">
                  {follower.name.split(' ').map(n => n[0]).join('')}
                </div>
                <span className="text-sm text-white">{follower.name}</span>
              </div>
              <div className="flex gap-6 text-sm text-slate-300">
                <span>{follower.views}</span>
                <span>{follower.likes}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default StatsPanel;
