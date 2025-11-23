import React from 'react';
import { FileText, Search, GitBranch, Package, ChevronLeft } from 'lucide-react';
import { useIDEStore } from '../../store/ideStore';
import { PanelType } from '../../types/ide';

const Sidebar: React.FC = () => {
  const { leftPanelType, setLeftPanelType, leftPanelOpen, toggleLeftPanel } = useIDEStore();

  const items: { type: PanelType; icon: React.ReactNode; label: string }[] = [
    { type: 'explorer', icon: <FileText size={20} />, label: 'Explorer' },
    { type: 'search', icon: <Search size={20} />, label: 'Search' },
    { type: 'git', icon: <GitBranch size={20} />, label: 'Projects & Cloud Sync' },
    { type: 'extensions', icon: <Package size={20} />, label: 'Guided Tutorials' },
  ];

  return (
    <div className="w-16 bg-dark-header border-r border-sui-cyan/20 flex flex-col items-center py-4 gap-2 relative">
      {/* Vertical accent line */}
      <div className="absolute left-0 top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-sui-cyan/50 to-transparent"></div>
      
      {items.map((item) => (
        <button
          key={item.type}
          onClick={() => {
            if (leftPanelType === item.type && leftPanelOpen) {
              toggleLeftPanel();
            } else {
              setLeftPanelType(item.type);
              if (!leftPanelOpen) toggleLeftPanel();
            }
          }}
          className={`p-3 rounded-lg transition-all duration-300 relative group ${
            leftPanelType === item.type && leftPanelOpen
              ? 'text-sui-cyan bg-sui-cyan/10 shadow-neon'
              : 'text-slate-500 hover:text-sui-cyan hover:bg-sui-cyan/5'
          }`}
          title={item.label}
        >
          {item.icon}
          {leftPanelType === item.type && leftPanelOpen && (
            <div className="absolute -left-1 top-1/2 -translate-y-1/2 w-1 h-8 bg-sui-cyan rounded-r-full shadow-neon"></div>
          )}
        </button>
      ))}
    </div>
  );
};

export default Sidebar;
