import React from 'react';
import { X, Circle } from 'lucide-react';
import { useIDEStore } from '../../store/ideStore';

const EditorTabs: React.FC = () => {
  const { tabs, activeTab, setActiveTab, removeTab } = useIDEStore();

  return (
    <div className="flex items-center bg-dark-header border-b border-sui-cyan/20 overflow-x-auto scrollbar-thin scrollbar-thumb-sui-cyan/30 scrollbar-track-transparent relative">
      <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-sui-cyan/30 to-transparent"></div>
      
      {tabs.map((tab) => (
        <div
          key={tab.id}
          className={`flex items-center gap-3 px-4 py-3 cursor-pointer group min-w-[140px] relative transition-all duration-200 ${
            activeTab === tab.id
              ? 'bg-dark-bg text-white'
              : 'text-slate-500 hover:text-sui-cyan hover:bg-sui-cyan/5'
          }`}
          onClick={() => setActiveTab(tab.id)}
        >
          {/* Language indicator icon with glow */}
          <span className={`text-xs font-bold ${
            tab.language === 'javascript' ? 'text-yellow-400' : 
            tab.language === 'typescript' ? 'text-blue-400' :
            tab.language === 'css' ? 'text-pink-400' :
            tab.language === 'move' ? 'text-neon-purple' :
            'text-slate-500'
          }`}>
            {tab.language === 'javascript' ? 'JS' : 
             tab.language === 'typescript' ? 'TS' :
             tab.language === 'css' ? 'CSS' : 
             tab.language === 'move' ? 'MV' : ''}
          </span>
          <span className="text-sm truncate flex-1 font-medium">{tab.name}</span>
          {tab.isDirty && <Circle size={6} fill="currentColor" className="text-sui-cyan animate-pulse" />}
          <button
            onClick={(e) => {
              e.stopPropagation();
              removeTab(tab.id);
            }}
            className="opacity-0 group-hover:opacity-100 hover:bg-sui-cyan/10 hover:text-sui-cyan rounded p-1 transition-all"
          >
            <X size={14} />
          </button>
          {activeTab === tab.id && (
            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-neon shadow-neon"></div>
          )}
        </div>
      ))}
    </div>
  );
};

export default EditorTabs;
