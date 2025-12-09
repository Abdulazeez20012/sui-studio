import React, { useState, useEffect } from 'react';
import { Activity, Zap, Clock, TrendingUp, AlertTriangle } from 'lucide-react';

interface ProfileData {
  function: string;
  gasUsed: number;
  executionTime: number;
  calls: number;
  percentage: number;
}

interface MemorySnapshot {
  timestamp: number;
  heapUsed: number;
  objectCount: number;
}

export const Profiler: React.FC = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [profileData, setProfileData] = useState<ProfileData[]>([
    { function: 'transfer_object', gasUsed: 1250, executionTime: 45, calls: 120, percentage: 35 },
    { function: 'mint_nft', gasUsed: 2100, executionTime: 78, calls: 85, percentage: 28 },
    { function: 'create_pool', gasUsed: 3500, executionTime: 120, calls: 45, percentage: 22 },
    { function: 'swap_tokens', gasUsed: 1800, executionTime: 62, calls: 95, percentage: 15 }
  ]);
  const [memorySnapshots, setMemorySnapshots] = useState<MemorySnapshot[]>([]);
  const [selectedTab, setSelectedTab] = useState<'cpu' | 'gas' | 'memory'>('cpu');

  const startProfiling = () => {
    setIsRecording(true);
    // Simulate profiling
    const interval = setInterval(() => {
      setMemorySnapshots(prev => [...prev, {
        timestamp: Date.now(),
        heapUsed: Math.random() * 100,
        objectCount: Math.floor(Math.random() * 1000)
      }]);
    }, 1000);

    setTimeout(() => {
      setIsRecording(false);
      clearInterval(interval);
    }, 10000);
  };

  const exportProfile = () => {
    const data = {
      timestamp: new Date().toISOString(),
      profileData,
      memorySnapshots,
      summary: {
        totalGas: profileData.reduce((sum, p) => sum + p.gasUsed, 0),
        totalCalls: profileData.reduce((sum, p) => sum + p.calls, 0),
        avgExecutionTime: profileData.reduce((sum, p) => sum + p.executionTime, 0) / profileData.length
      }
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `profile-${Date.now()}.json`;
    a.click();
  };

  return (
    <div className="h-full flex flex-col bg-gray-900 text-white">
      <div className="flex items-center justify-between p-3 border-b border-gray-700">
        <h3 className="font-semibold flex items-center gap-2">
          <Activity className="w-4 h-4" />
          Performance Profiler
        </h3>
        <div className="flex gap-2">
          <button
            onClick={startProfiling}
            disabled={isRecording}
            className={`px-4 py-1 rounded text-sm ${
              isRecording
                ? 'bg-red-600 animate-pulse'
                : 'bg-sui-blue hover:bg-blue-600'
            }`}
          >
            {isRecording ? 'Recording...' : 'Start Profiling'}
          </button>
          <button
            onClick={exportProfile}
            className="px-4 py-1 bg-gray-700 hover:bg-gray-600 rounded text-sm"
          >
            Export
          </button>
        </div>
      </div>

      <div className="flex border-b border-gray-700">
        {(['cpu', 'gas', 'memory'] as const).map(tab => (
          <button
            key={tab}
            onClick={() => setSelectedTab(tab)}
            className={`px-4 py-2 ${
              selectedTab === tab
                ? 'bg-gray-800 border-b-2 border-sui-blue'
                : 'hover:bg-gray-800'
            }`}
          >
            {tab === 'cpu' && <Clock className="w-4 h-4 inline mr-2" />}
            {tab === 'gas' && <Zap className="w-4 h-4 inline mr-2" />}
            {tab === 'memory' && <TrendingUp className="w-4 h-4 inline mr-2" />}
            {tab.toUpperCase()}
          </button>
        ))}
      </div>

      <div className="flex-1 overflow-auto p-4">
        {selectedTab === 'cpu' && (
          <div className="space-y-4">
            <div className="grid grid-cols-3 gap-4 mb-6">
              <div className="bg-gray-800 p-4 rounded">
                <div className="text-gray-400 text-sm">Total Calls</div>
                <div className="text-2xl font-bold">
                  {profileData.reduce((sum, p) => sum + p.calls, 0)}
                </div>
              </div>
              <div className="bg-gray-800 p-4 rounded">
                <div className="text-gray-400 text-sm">Avg Time</div>
                <div className="text-2xl font-bold">
                  {(profileData.reduce((sum, p) => sum + p.executionTime, 0) / profileData.length).toFixed(1)}ms
                </div>
              </div>
              <div className="bg-gray-800 p-4 rounded">
                <div className="text-gray-400 text-sm">Hotspots</div>
                <div className="text-2xl font-bold text-yellow-500">
                  {profileData.filter(p => p.percentage > 25).length}
                </div>
              </div>
            </div>

            {profileData.map(item => (
              <div key={item.function} className="bg-gray-800 p-4 rounded">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-mono text-sm">{item.function}</span>
                  <span className="text-sm text-gray-400">{item.calls} calls</span>
                </div>
                <div className="flex items-center gap-2 mb-2">
                  <div className="flex-1 bg-gray-700 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full ${
                        item.percentage > 30 ? 'bg-red-500' :
                        item.percentage > 20 ? 'bg-yellow-500' :
                        'bg-green-500'
                      }`}
                      style={{ width: `${item.percentage}%` }}
                    />
                  </div>
                  <span className="text-sm">{item.percentage}%</span>
                </div>
                <div className="text-xs text-gray-400">
                  {item.executionTime}ms avg execution time
                </div>
              </div>
            ))}
          </div>
        )}

        {selectedTab === 'gas' && (
          <div className="space-y-4">
            <div className="bg-yellow-900/20 border border-yellow-700 p-4 rounded flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-yellow-500 flex-shrink-0 mt-0.5" />
              <div>
                <div className="font-semibold text-yellow-500">Gas Optimization Opportunities</div>
                <div className="text-sm text-gray-300 mt-1">
                  3 functions detected with high gas consumption
                </div>
              </div>
            </div>

            {profileData.sort((a, b) => b.gasUsed - a.gasUsed).map(item => (
              <div key={item.function} className="bg-gray-800 p-4 rounded">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-mono text-sm">{item.function}</span>
                  <span className="text-lg font-bold text-sui-blue">{item.gasUsed} MIST</span>
                </div>
                <div className="text-xs text-gray-400">
                  {item.calls} calls × {(item.gasUsed / item.calls).toFixed(0)} MIST per call
                </div>
                {item.gasUsed > 2000 && (
                  <div className="mt-2 text-xs text-yellow-500">
                    ⚠️ Consider optimizing this function
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {selectedTab === 'memory' && (
          <div className="space-y-4">
            <div className="bg-gray-800 p-4 rounded">
              <h4 className="font-semibold mb-4">Memory Usage Over Time</h4>
              <div className="h-48 flex items-end gap-1">
                {memorySnapshots.slice(-20).map((snapshot, i) => (
                  <div
                    key={i}
                    className="flex-1 bg-sui-blue rounded-t"
                    style={{ height: `${snapshot.heapUsed}%` }}
                    title={`${snapshot.heapUsed.toFixed(1)}%`}
                  />
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="bg-gray-800 p-4 rounded">
                <div className="text-gray-400 text-sm">Current Heap</div>
                <div className="text-2xl font-bold">
                  {memorySnapshots.length > 0
                    ? `${memorySnapshots[memorySnapshots.length - 1].heapUsed.toFixed(1)}%`
                    : '0%'}
                </div>
              </div>
              <div className="bg-gray-800 p-4 rounded">
                <div className="text-gray-400 text-sm">Object Count</div>
                <div className="text-2xl font-bold">
                  {memorySnapshots.length > 0
                    ? memorySnapshots[memorySnapshots.length - 1].objectCount
                    : 0}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
