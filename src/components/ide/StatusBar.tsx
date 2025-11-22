import React from 'react';
import { GitBranch, AlertCircle, CheckCircle } from 'lucide-react';
import { useIDEStore } from '../../store/ideStore';

const StatusBar: React.FC = () => {
  const { activeTab, tabs } = useIDEStore();
  const currentTab = tabs.find(t => t.id === activeTab);

  return (
    <div className="h-6 bg-sui-cyan text-black flex items-center justify-between px-4 text-xs font-medium">
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-1">
          <GitBranch size={14} />
          <span>main</span>
        </div>
        <div className="flex items-center gap-1">
          <CheckCircle size={14} />
          <span>No Issues</span>
        </div>
      </div>

      <div className="flex items-center gap-4">
        {currentTab && (
          <>
            <span>Ln 1, Col 1</span>
            <span className="uppercase">{currentTab.language}</span>
            <span>UTF-8</span>
          </>
        )}
        <span>Sui Studio IDE</span>
      </div>
    </div>
  );
};

export default StatusBar;
