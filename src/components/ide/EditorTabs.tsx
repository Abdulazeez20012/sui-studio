import React from 'react';
import { X, Circle } from 'lucide-react';
import { useIDEStore } from '../../store/ideStore';

const EditorTabs: React.FC = () => {
  const { tabs, activeTab, setActiveTab, removeTab } = useIDEStore();

  return (
    <div className="flex items-center bg-dark-surface border-b border-dark-border overflow-x-auto scrollbar-thin">
      {tabs.map((tab) => (
        <div
          key={tab.id}
          className={`flex items-center gap-2 px-4 py-2 border-r border-dark-border cursor-pointer group min-w-[120px] ${
            activeTab === tab.id
              ? 'bg-dark-bg text-white border-t-2 border-t-sui-cyan'
              : 'text-slate-400 hover:text-white hover:bg-white/5'
          }`}
          onClick={() => setActiveTab(tab.id)}
        >
          <span className="text-sm truncate flex-1">{tab.name}</span>
          {tab.isDirty && <Circle size={8} fill="currentColor" />}
          <button
            onClick={(e) => {
              e.stopPropagation();
              removeTab(tab.id);
            }}
            className="opacity-0 group-hover:opacity-100 hover:bg-white/10 rounded p-0.5 transition-opacity"
          >
            <X size={14} />
          </button>
        </div>
      ))}
    </div>
  );
};

export default EditorTabs;
