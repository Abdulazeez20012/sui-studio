import React from 'react';
import { X, Circle, FileCode } from 'lucide-react';
import { useIDEStore } from '../../store/ideStore';

const EditorTabs: React.FC = () => {
  const { tabs, activeTab, setActiveTab, removeTab } = useIDEStore();

  return (
    <div className="flex items-center bg-walrus-dark-900 border-b border-walrus-dark-600 overflow-x-auto scrollbar-thin scrollbar-thumb-walrus-dark-700 scrollbar-track-transparent relative z-20">
      {tabs.map((tab) => (
        <div
          key={tab.id}
          className={`flex items-center gap-2 px-4 py-2.5 cursor-pointer group min-w-[140px] max-w-[200px] relative transition-all duration-200 border-r border-walrus-dark-800 ${activeTab === tab.id
              ? 'bg-walrus-dark-950 text-white'
              : 'bg-walrus-dark-900 text-gray-500 hover:bg-walrus-dark-800 hover:text-gray-300'
            }`}
          onClick={() => setActiveTab(tab.id)}
        >
          {/* Active Tab Top Indicator */}
          {activeTab === tab.id && (
            <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-neon shadow-neon"></div>
          )}

          {/* File Icon */}
          <FileCode size={14} className={`
            ${tab.language === 'move' ? 'text-walrus-cyan' :
              tab.language === 'typescript' ? 'text-blue-400' : 'text-gray-400'}
          `} />

          <span className="text-xs font-medium truncate flex-1 font-mono">
            {tab.name}
            {tab.isDirty && <span className="text-walrus-cyan ml-1">*</span>}
          </span>

          {tab.isDirty && (
            <Circle size={6} fill="currentColor" className="text-walrus-cyan animate-pulse" />
          )}

          <button
            onClick={(e) => {
              e.stopPropagation();
              // Confirm if file has unsaved changes
              if (tab.isDirty) {
                const confirmed = confirm(`"${tab.name}" has unsaved changes. Close anyway?`);
                if (!confirmed) return;
              }
              removeTab(tab.id);
            }}
            className={`p-0.5 rounded-md opacity-0 group-hover:opacity-100 transition-all ${activeTab === tab.id
                ? 'hover:bg-white/10 text-gray-400 hover:text-white'
                : 'hover:bg-walrus-dark-700 text-gray-500 hover:text-gray-300'
              }`}
            title={tab.isDirty ? 'Unsaved changes' : 'Close'}
          >
            <X size={14} />
          </button>
        </div>
      ))}
    </div>
  );
};

export default EditorTabs;
