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
    <div className="w-14 bg-[#252b3b] border-r border-slate-700/50 flex flex-col items-center py-4 gap-1">
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
          className={`p-3 rounded-lg transition-all duration-200 ${
            leftPanelType === item.type && leftPanelOpen
              ? 'text-cyan-400 bg-cyan-500/10 border-l-2 border-cyan-400'
              : 'text-slate-400 hover:text-white hover:bg-slate-700/30'
          }`}
          title={item.label}
        >
          {item.icon}
        </button>
      ))}
    </div>
  );
};

export default Sidebar;
