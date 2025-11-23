import React from 'react';
import { GitBranch, AlertCircle, CheckCircle, Hammer, TestTube, Rocket } from 'lucide-react';
import { useIDEStore } from '../../store/ideStore';

const StatusBar: React.FC = () => {
  const { activeTab, tabs } = useIDEStore();
  const currentTab = tabs.find(t => t.id === activeTab);

  return (
    <div className="h-7 bg-[#2d3748] border-t border-slate-700/50 flex items-center justify-between px-4 text-xs">
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-1.5 text-slate-300">
          <GitBranch size={13} />
          <span className="font-medium">main</span>
        </div>
        <div className="flex items-center gap-1.5 text-green-400">
          <CheckCircle size={13} />
          <span className="font-medium">Ready</span>
        </div>
        <div className="h-3 w-px bg-slate-600"></div>
        <div className="flex items-center gap-3 text-slate-400">
          <div className="flex items-center gap-1 hover:text-white transition-colors cursor-pointer" title="Last build status">
            <Hammer size={12} />
            <span>Build: Ready</span>
          </div>
          <div className="flex items-center gap-1 hover:text-white transition-colors cursor-pointer" title="Last test status">
            <TestTube size={12} />
            <span>Tests: Passed</span>
          </div>
          <div className="flex items-center gap-1 hover:text-white transition-colors cursor-pointer" title="Deployment status">
            <Rocket size={12} />
            <span>Deploy: Testnet</span>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-4 text-slate-300">
        {currentTab && (
          <>
            <span className="font-medium">Ln 1, Col 1</span>
            <span className="uppercase font-medium">{currentTab.language}</span>
            <span>UTF-8</span>
          </>
        )}
        <span className="font-semibold text-cyan-400">Sui Studio IDE</span>
      </div>
    </div>
  );
};

export default StatusBar;
