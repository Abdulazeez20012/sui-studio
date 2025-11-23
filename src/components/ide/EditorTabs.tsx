import React from 'react';
import { X, Circle } from 'lucide-react';
import { useIDEStore } from '../../store/ideStore';

const EditorTabs: React.FC = () => {
  const { tabs, activeTab, setActiveTab, removeTab } = useIDEStore();

  return (
    <div className="flex items-center bg-[#2d3748] border-b border-slate-700/50 overflow-x-auto scrollbar-thin scrollbar-thumb-slate-600 scrollbar-track-transparent">
      {tabs.map((tab) => (
        <div
          key={tab.id}
          className={`flex items-center gap-3 px-4 py-3 cursor-pointer group min-w-[140px] relative ${
            activeTab === tab.id
              ? 'bg-[#1e2433] text-white'
              : 'text-slate-400 hover:text-white hover:bg-slate-700/30'
          }`}
          onClick={() => setActiveTab(tab.id)}
        >
          {/* Language indicator icon */}
          <span className={`text-xs font-bold ${
            tab.language === 'javascript' ? 'text-yellow-400' : 
            tab.language === 'typescript' ? 'text-blue-400' :
            tab.language === 'css' ? 'text-pink-400' :
            'text-slate-400'
          }`}>
            {tab.language === 'javascript' ? 'JS' : 
             tab.language === 'typescript' ? 'TS' :
             tab.language === 'css' ? 'CSS' : 
             tab.language === 'move' ? 'MV' : ''}
          </span>
          <span className="text-sm truncate flex-1 font-medium">{tab.name}</span>
          {tab.isDirty && <Circle size={6} fill="currentColor" className="text-cyan-400" />}
          <button
            onClick={(e) => {
              e.stopPropagation();
              removeTab(tab.id);
            }}
            className="opacity-0 group-hover:opacity-100 hover:bg-slate-600/50 rounded p-1 transition-opacity"
          >
            <X size={14} />
          </button>
          {activeTab === tab.id && (
            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-cyan-400"></div>
          )}
        </div>
      ))}
    </div>
  );
};

export default EditorTabs;
