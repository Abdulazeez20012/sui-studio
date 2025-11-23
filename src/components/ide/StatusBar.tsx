import React from 'react';
import { GitBranch, AlertCircle, CheckCircle, Hammer, TestTube, Rocket } from 'lucide-react';
import { useIDEStore } from '../../store/ideStore';

const StatusBar: React.FC = () => {
  const { activeTab, tabs } = useIDEStore();
  const currentTab = tabs.find(t => t.id === activeTab);

  return (
    <div className="h-7 bg-dark-header border-t border-sui-cyan/20 flex items-center justify-between px-4 text-xs relative">
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-sui-cyan/30 to-transparent"></div>
      
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-1.5 text-slate-400 hover:text-sui-cyan transition-colors cursor-pointer">
          <GitBranch size={13} />
          <span className="font-semibold">main</span>
        </div>
        <div className="flex items-center gap-1.5 text-neon-green">
          <CheckCircle size={13} className="animate-pulse" />
          <span className="font-semibold">Ready</span>
        </div>
        <div className="h-3 w-px bg-sui-cyan/20"></div>
        <div className="flex items-center gap-3 text-slate-500">
          <div className="flex items-center gap-1 hover:text-sui-cyan transition-colors cursor-pointer" title="Last build status">
            <Hammer size={12} />
            <span className="font-medium">Build: Ready</span>
          </div>
          <div className="flex items-center gap-1 hover:text-neon-green transition-colors cursor-pointer" title="Last test status">
            <TestTube size={12} />
            <span className="font-medium">Tests: Passed</span>
          </div>
          <div className="flex items-center gap-1 hover:text-neon-purple transition-colors cursor-pointer" title="Deployment status">
            <Rocket size={12} />
            <span className="font-medium">Deploy: Testnet</span>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-4 text-slate-400">
        {currentTab && (
          <>
            <span className="font-semibold">Ln 1, Col 1</span>
            <span className="uppercase font-bold text-neon-purple">{currentTab.language}</span>
            <span className="font-medium">UTF-8</span>
          </>
        )}
        <span className="font-bold text-sui-cyan glow-text">SUI STUDIO</span>
      </div>
    </div>
  );
};

export default StatusBar;
